// The run. One command: check, stage, run every scheduled session, scan, build coded tables.
// No prompt and no decision in between. A guard that fails stops the run; logs are kept.
//
//   node tools/run.mjs --name pass1 [--limit N]

import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ask, programVersion, sessionArgs, sessionEnv } from '../lib/claude.mjs';
import { EFFORT, FOLDER_DIR, MAX_ATTEMPTS, MODEL, QUESTIONS_FILE, runDir, STAGE_ROOT } from '../lib/config.mjs';
import { loadQuestions } from '../lib/questions.mjs';
import { sha256 } from '../lib/rng.mjs';
import { parseLog, resultRecord } from '../lib/session.mjs';
import { fingerprint, stageAll, stagedDigest } from '../lib/stage.mjs';
import { codedTables, loadRows } from '../verify/analyse.mjs';
import { logPath, scanLog, scanReport, scanRun } from '../verify/scan.mjs';
import { option, runCli } from '../lib/cli.mjs';

// Faults that mean the whole run is not the run that was planned. The run stops at once.
const STOPPING = [/^model is /, /^tool version is /, /MCP server/, /skill was loaded/, /plugin that is not built in/];

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

function loadPlan(dir) {
  if (!existsSync(join(dir, 'schedule.json'))) throw new Error(`No schedule in ${dir}. Run tools/schedule.mjs first.`);
  const keyText = readFileSync(join(dir, 'key.json'), 'utf8');
  const recorded = readFileSync(join(dir, 'key.sha256'), 'utf8').trim();
  if (sha256(keyText) !== recorded) throw new Error('key.json does not match key.sha256. The key was changed after it was fingerprinted.');
  return { schedule: readJson(join(dir, 'schedule.json')), key: JSON.parse(keyText) };
}

// The manifest names arms by code and carries only a digest of what each held. The full list
// of staged files would name the arm, so it is written beside the key and kept back with it.
function writeManifest(dir, staged, version, limit, stageRoot, questionsFile) {
  const probe = join(dir, 'probe.md');
  const coded = Object.fromEntries(Object.entries(staged).map(([code, s]) => [code, { dir: s.dir, digest: stagedDigest(s) }]));
  const manifest = {
    started: new Date().toISOString(), model: MODEL, effort: EFFORT, version, limit,
    stageRoot, flags: sessionArgs('<question>'), environment: Object.keys(sessionEnv()).sort(),
    questionsSha256: sha256(readFileSync(questionsFile, 'utf8')), probeSha256: existsSync(probe) ? sha256(readFileSync(probe, 'utf8')) : null, staged: coded,
  };
  writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(dir, 'key-staged.json'), `${JSON.stringify(staged, null, 2)}\n`);
  return manifest;
}

// Runs one session. An attempt with no result record (a timeout, a rate limit, a crash) is kept
// under its own name and tried again. An attempt that answered is never tried again.
export function runSession(dir, session, prompt, stageDir, asker = ask) {
  const path = logPath(dir, session);
  mkdirSync(dirname(path), { recursive: true });
  let attempt = 0;
  let done;
  for (;;) {
    attempt += 1;
    done = asker(stageDir, prompt);
    const answered = resultRecord(parseLog(done.stream).events) !== null;
    if (answered || attempt >= MAX_ATTEMPTS) break;
    writeFileSync(path.replace(/\.jsonl$/, `.attempt${attempt}.jsonl`), done.stream);
  }
  writeFileSync(path, done.stream);
  writeFileSync(path.replace(/\.jsonl$/, '.meta.json'), `${JSON.stringify({
    ...session, prompt, stageDir, attempts: attempt, exit: done.exit, timedOut: done.timedOut, wallMs: done.wallMs, stderr: String(done.stderr ?? '').slice(0, 2000),
  }, null, 2)}\n`);
  appendFileSync(join(dir, 'logs.sha256'), `${sha256(done.stream)}  ${relative(dir, path).replace(/\\/g, '/')}\n`);
  return done;
}

function guard(done, session, expect) {
  const stopping = scanLog(done.stream, expect).filter((fault) => STOPPING.some((pattern) => pattern.test(fault)));
  if (stopping.length > 0) throw new Error(`Run stopped at session ${session.order} (${session.code}, run ${session.run}, ${session.question}): ${stopping.join('; ')}.`);
}

export function finishRun(dir) {
  const report = scanReport(scanRun(dir));
  writeFileSync(join(dir, 'scan.md'), report);
  writeFileSync(join(dir, 'tables-coded.md'), codedTables(loadRows(dir)));
  return report;
}

// Everything from the plan to the coded tables. The options exist so the self-test can run
// this with a stand-in for the program; a real run uses the defaults.
export function executeRun(dir, { limit = 0, asker = ask, version = null, questionsFile = QUESTIONS_FILE, stageRoot = STAGE_ROOT, source = FOLDER_DIR, say = () => {} } = {}) {
  const { schedule, key } = loadPlan(dir);
  if (existsSync(join(dir, 'manifest.json'))) throw new Error(`Run "${schedule.name}" has already been started. A run is never restarted; schedule a new one.`);
  const prompts = Object.fromEntries(loadQuestions(questionsFile).map((q) => [q.id, q.prompt]));
  const staged = stageAll(key.arms, { root: stageRoot, source });
  const manifest = writeManifest(dir, staged, version ?? programVersion(), limit, stageRoot, questionsFile);
  const sessions = schedule.sessions.slice(0, limit || schedule.sessions.length);
  say(`${sessions.length} sessions, model ${MODEL}, effort ${EFFORT}, tool ${manifest.version}, staged under ${stageRoot}`);
  const startedMs = Date.now();
  for (const session of sessions) {
    const done = runSession(dir, session, prompts[session.question], manifest.staged[session.code].dir, asker);
    say(`${session.order}/${sessions.length} ${session.code} r${session.run} ${session.question}: exit ${done.exit}, ${done.wallMs} ms`);
    guard(done, session, manifest);
  }
  // Before the staged folders go, fingerprint each again: nothing may have changed during the run.
  const changed = Object.keys(staged).filter((code) => JSON.stringify(fingerprint(staged[code].dir)) !== JSON.stringify(staged[code].files)).sort();
  writeFileSync(join(dir, 'staged-after.json'), `${JSON.stringify({ checked: Object.keys(staged).length, changed }, null, 2)}\n`);
  // The staged folders have done their job. The checker stages its own copies to compare.
  for (const arm of Object.values(manifest.staged)) rmSync(arm.dir, { recursive: true, force: true });
  const report = finishRun(dir);
  const seconds = (Date.now() - startedMs) / 1000;
  say(report.split('\n')[2]);
  say(`${sessions.length} sessions in ${Math.round(seconds)} s, ${(seconds / sessions.length).toFixed(1)} s each. Wrote scan.md and tables-coded.md.`);
  return manifest;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(() => {
    if (!option('name')) throw new Error('Name the run with --name. Example: node tools/run.mjs --name pass3');
    executeRun(runDir(option('name')), { limit: Number(option('limit', '0')), say: console.log });
  });
}
