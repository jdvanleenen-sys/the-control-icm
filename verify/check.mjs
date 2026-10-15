// The checker. Confirms a run's files are the files the run wrote, and that every table,
// transcript and results file is exactly what the raw logs produce. Exits 1 and prints each
// failure if anything is off.
//
//   node verify/check.mjs [--name sealed]

import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli, sealedRunOrDefault } from '../lib/cli.mjs';
import { FOLDER_DIR, QUESTIONS_FILE } from '../lib/config.mjs';
import { sha256 } from '../lib/rng.mjs';
import { parseLog, startRecord } from '../lib/session.mjs';
import { stageArm, stagedDigest } from '../lib/stage.mjs';
import { REVEALED_DIRS, revealedFiles, revealPlace } from '../tools/reveal.mjs';
import { codedTables, loadRows, namedTables } from './analyse.mjs';
import { checkDocs } from './docs.mjs';
import { buildResults } from './results.mjs';
import { logPath, scanReport, scanRun } from './scan.mjs';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const flat = (path) => path.replace(/\\/g, '/');
const sameFile = (path, text) => existsSync(path) && readFileSync(path, 'utf8') === text;

function finalLogsOnDisk(dir, base = join(dir, 'logs')) {
  if (!existsSync(base)) return [];
  const found = [];
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    const path = join(base, entry.name);
    if (entry.isDirectory()) found.push(...finalLogsOnDisk(dir, path));
    else if (/\.jsonl$/.test(entry.name) && !/\.attempt\d+\.jsonl$/.test(entry.name)) found.push(flat(path).slice(flat(dir).length + 1));
  }
  return found.sort();
}

function checkKey(dir) {
  const matches = sha256(readFileSync(join(dir, 'key.json'), 'utf8')) === readFileSync(join(dir, 'key.sha256'), 'utf8').trim();
  return matches ? [] : ['key.json does not match its fingerprint'];
}

// Every scheduled log is present, unchanged since the run wrote it, and sits under its own arm.
function checkLogs(dir, sessions) {
  const failures = [];
  const recorded = new Map(readFileSync(join(dir, 'logs.sha256'), 'utf8').split('\n').filter(Boolean).map((line) => [line.slice(66), line.slice(0, 64)]));
  const expected = sessions.map((s) => flat(logPath(dir, s)).slice(flat(dir).length + 1)).sort();
  const onDisk = finalLogsOnDisk(dir);
  for (const path of expected.filter((p) => !onDisk.includes(p))) failures.push(`scheduled log is missing: ${path}`);
  for (const path of onDisk.filter((p) => !expected.includes(p))) failures.push(`log on disk is not in the schedule: ${path}`);
  for (const path of onDisk.filter((p) => expected.includes(p))) {
    const text = readFileSync(join(dir, path), 'utf8');
    if (recorded.get(path) !== sha256(text)) failures.push(`log differs from the fingerprint the run recorded: ${path}`);
    const cwd = startRecord(parseLog(text).events)?.cwd;
    if (cwd && basename(flat(cwd)) !== path.split('/')[1]) failures.push(`log was produced in arm folder ${basename(flat(cwd))} but is filed under ${path}`);
  }
  return failures;
}

function checkTables(dir, key) {
  const failures = [];
  const rows = loadRows(dir);
  if (!sameFile(join(dir, 'tables-coded.md'), codedTables(rows))) failures.push('tables-coded.md is not what the logs produce');
  if (existsSync(join(dir, 'tables-named.md')) && !sameFile(join(dir, 'tables-named.md'), namedTables(rows, key))) failures.push('tables-named.md is not what the logs and the key produce');
  const results = revealPlace(dir).results;
  const revealed = existsSync(join(dir, 'revealed-at.json'));
  if (revealed && !existsSync(results)) failures.push('the reveal was started but results.md was never written');
  if (existsSync(results) && !sameFile(results, buildResults(dir))) failures.push('results.md is not what the logs, the marks and the key produce');
  return failures;
}

// After the reveal: every filed transcript is a true copy of its raw log, and nothing is missing.
function checkRevealed(dir, key, schedule, limit) {
  const { base } = revealPlace(dir);
  if (!REVEALED_DIRS.some((name) => existsSync(join(base, name)))) return [];
  const failures = [];
  for (const file of revealedFiles(dir, key, schedule, limit)) {
    const name = flat(file.copy).slice(flat(base).length + 1);
    if (!existsSync(file.copy)) failures.push(`revealed log is missing: ${name}`);
    else if (sha256(readFileSync(file.copy)) !== sha256(readFileSync(file.raw))) failures.push(`revealed log differs from the raw log: ${name}`);
    if (!sameFile(file.readable, file.text)) failures.push(`readable transcript is not what the raw log produces: ${name.replace(/\.jsonl$/, '.md')}`);
  }
  const expected = new Set(revealedFiles(dir, key, schedule, limit).flatMap((file) => [flat(file.copy), flat(file.readable)]));
  const found = REVEALED_DIRS.filter((name) => existsSync(join(base, name))).flatMap((name) => filesUnder(join(base, name)));
  for (const path of found.filter((p) => !expected.has(flat(p)))) failures.push(`a file among the transcripts did not come from the reveal: ${flat(path).slice(flat(base).length + 1)}`);
  return failures;
}

function filesUnder(base) {
  return readdirSync(base, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? filesUnder(join(base, entry.name)) : [join(base, entry.name)]));
}

// Files the run fingerprinted when it started: the questions it asked and the probe's table.
// A run made before these were recorded has nothing to compare, and says so.
function checkRecorded(dir, manifest, questionsFile) {
  const failures = [];
  if (!manifest.questionsSha256) return ['this run did not record a fingerprint of its questions, so they cannot be checked'];
  if (sha256(readFileSync(questionsFile, 'utf8')) !== manifest.questionsSha256) failures.push('questions.md differs from the file this run asked');
  const probe = join(dir, 'probe.md');
  if (manifest.probeSha256 && existsSync(probe) && sha256(readFileSync(probe, 'utf8')) !== manifest.probeSha256) failures.push('probe.md differs from the table the probe wrote');
  const after = join(dir, 'staged-after.json');
  if (existsSync(after) && readJson(after).changed.length > 0) failures.push(`staged files changed during the run in arm(s) ${readJson(after).changed.join(', ')}`);
  return failures;
}

// The staged files must be the files in the repo: stage each arm again and compare fingerprints.
function checkStaged(dir, manifest, key, source) {
  const failures = [];
  const scratch = mkdtempSync(join(tmpdir(), 'tc-check-'));
  for (const [code, arm] of Object.entries(key.arms)) {
    if (stagedDigest(stageArm(join(scratch, code), arm, { source })) !== manifest.staged[code]?.digest) failures.push(`arm ${code} was staged from files that differ from the repo's`);
  }
  rmSync(scratch, { recursive: true, force: true });
  return failures;
}

export const keyRevealed = (dir) => existsSync(join(dir, 'key.json'));

export function checkRun(dir, { source = FOLDER_DIR, staged = true, questionsFile = staged ? QUESTIONS_FILE : null } = {}) {
  if (!existsSync(join(dir, 'manifest.json'))) return ['this run was scheduled but never started; there is nothing to check'];
  const schedule = readJson(join(dir, 'schedule.json'));
  const manifest = readJson(join(dir, 'manifest.json'));
  const sessions = schedule.sessions.slice(0, manifest.limit || schedule.sessions.length);
  const scan = sameFile(join(dir, 'scan.md'), scanReport(scanRun(dir))) ? [] : ['scan.md is not what the logs produce'];
  const always = [...(staged ? checkDocs() : []), ...checkLogs(dir, sessions), ...scan, ...(questionsFile ? checkRecorded(dir, manifest, questionsFile) : [])];
  // Before the reveal there is no key in the repo. The logs and the coded tables can still be
  // checked; anything that names an arm cannot exist yet, and is a failure if it does.
  if (!keyRevealed(dir)) {
    const early = ['tables-named.md', 'results.md', 'revealed', 'revealed-at.json'].filter((name) => existsSync(join(dir, name))).map((name) => `${name} exists but the key has not been revealed`);
    return [...always, ...(sameFile(join(dir, 'tables-coded.md'), codedTables(loadRows(dir))) ? [] : ['tables-coded.md is not what the logs produce']), ...early];
  }
  const keyFailures = checkKey(dir);
  if (keyFailures.length > 0) return [...keyFailures, ...always];
  const key = readJson(join(dir, 'key.json'));
  return [...always, ...checkTables(dir, key), ...checkRevealed(dir, key, schedule, manifest.limit), ...(staged ? checkStaged(dir, manifest, key, source) : [])];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(() => {
    const dir = sealedRunOrDefault('Example: node verify/check.mjs --name NAME');
    const failures = checkRun(dir);
    if (failures.length > 0) { console.error(`Check FAILED (${failures.length}):\n${failures.map((f) => `- ${f}`).join('\n')}`); process.exitCode = 1; }
    else if (!keyRevealed(dir)) console.log('Check passed for a run whose key is not revealed yet: logs, scan and coded tables agree. Run it again after the reveal.');
    else console.log('Check passed: key, questions, logs, scan, tables, transcripts and staged files all agree.');
  });
}
