// The supplement's sealed run. One command: stage every arm under its code, run every scheduled
// session in order, scan every log, and write one row per session, named by code only.
// No prompt and no decision in between. A stopping fault ends the run; every log is kept.
//
//   node tools/sup-run.mjs --name sup1 [--limit N]

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ask, programVersion, sessionArgs, sessionEnv } from '../lib/claude.mjs';
import { option, runCli } from '../lib/cli.mjs';
import { EFFORT, MODEL, runDir, STAGE_ROOT } from '../lib/config.mjs';
import { sha256 } from '../lib/rng.mjs';
import { parseLog, summarise } from '../lib/session.mjs';
import { assertCleanAncestors, fingerprint } from '../lib/stage.mjs';
import { digest, loadAllQuestions, splitSteps, stageSupArm } from '../lib/sup.mjs';
import { logPath, scanReport, scanRun } from '../verify/scan.mjs';
import { runSession } from './run.mjs';
import { scanLog } from '../verify/scan.mjs';

const STOPPING = [/^model is /, /^tool version is /, /MCP server/, /skill was loaded/, /plugin that is not built in/];

function loadPlan(dir) {
  const keyText = readFileSync(join(dir, 'key.json'), 'utf8');
  if (sha256(keyText) !== readFileSync(join(dir, 'key.sha256'), 'utf8').trim()) throw new Error('key.json does not match key.sha256.');
  return { schedule: JSON.parse(readFileSync(join(dir, 'schedule.json'), 'utf8')), key: JSON.parse(keyText) };
}

// One row per scheduled session: the entry's counts, the step split and the text loaded first.
export function buildRows(dir) {
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const scanned = scanRun(dir);
  return scanned.map((s) => {
    const path = logPath(dir, s);
    const text = existsSync(path) ? readFileSync(path, 'utf8') : '';
    const row = summarise(parseLog(text).events, { stageDir: manifest.staged[s.code].dir, code: s.code, run: s.run, question: s.question });
    const loaded = manifest.staged[s.code].loadedChars;
    return { ...row, ...splitSteps(row.calls), loadedChars: loaded, textChars: loaded + row.charsFetched, faults: s.faults, flags: s.flags };
  });
}

export function executeSupRun(dir, { limit = 0, asker = ask, version = null, stageRoot = STAGE_ROOT, say = () => {} } = {}) {
  const { schedule, key } = loadPlan(dir);
  if (existsSync(join(dir, 'manifest.json'))) throw new Error(`Run "${schedule.name}" has already been started. A run is never restarted.`);
  assertCleanAncestors(stageRoot);
  const prompts = Object.fromEntries(loadAllQuestions().map((q) => [q.id, q.prompt]));
  const staged = Object.fromEntries(Object.entries(key.arms).map(([code, arm]) => [code, stageSupArm(join(stageRoot, code), arm)]));
  const manifest = {
    started: new Date().toISOString(), model: MODEL, effort: EFFORT, version: version ?? programVersion(), limit, stageRoot,
    flags: sessionArgs('<question>'), environment: Object.keys(sessionEnv()).sort(), seed: schedule.seed,
    staged: Object.fromEntries(Object.entries(staged).map(([code, s]) => [code, { dir: s.dir, digest: digest(s), loadedChars: s.loadedChars }])),
  };
  writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(dir, 'key-staged.json'), `${JSON.stringify(staged, null, 2)}\n`);
  const sessions = schedule.sessions.slice(0, limit || schedule.sessions.length);
  say(`${sessions.length} sessions, model ${MODEL}, effort ${EFFORT}, tool ${manifest.version}, staged under ${stageRoot}`);
  const started = Date.now();
  for (const session of sessions) {
    const done = runSession(dir, session, prompts[session.question], manifest.staged[session.code].dir, asker);
    say(`${session.order}/${sessions.length} ${session.code} r${session.run} ${session.question}: exit ${done.exit}, ${done.wallMs} ms`);
    const stopping = scanLog(done.stream, manifest).filter((f) => STOPPING.some((p) => p.test(f)));
    if (stopping.length > 0) throw new Error(`Run stopped at session ${session.order}: ${stopping.join('; ')}.`);
  }
  const changed = Object.keys(staged).filter((code) => JSON.stringify(fingerprint(staged[code].dir)) !== JSON.stringify(staged[code].files)).sort();
  writeFileSync(join(dir, 'staged-after.json'), `${JSON.stringify({ checked: Object.keys(staged).length, changed }, null, 2)}\n`);
  for (const s of Object.values(staged)) rmSync(s.dir, { recursive: true, force: true });
  writeFileSync(join(dir, 'scan.md'), scanReport(scanRun(dir)));
  const rows = buildRows(dir).map(({ calls, answer, ...rest }) => ({ ...rest, answer, calls: calls.map((c) => `${c.tool} ${c.target}`) }));
  writeFileSync(join(dir, 'rows-coded.json'), `${JSON.stringify(rows, null, 2)}\n`);
  say(`${sessions.length} sessions in ${Math.round((Date.now() - started) / 1000)} s. Wrote scan.md and rows-coded.json.`);
  return manifest;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(() => {
    if (!option('name')) throw new Error('Name the run with --name.');
    executeSupRun(runDir(option('name')), { limit: Number(option('limit', '0')), say: console.log });
  });
}
