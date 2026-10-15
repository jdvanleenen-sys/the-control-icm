// The self-test. Feeds the scan, the checker, the staging guards and the counting rule one
// broken case of each kind. Every case here must be caught. If one passes quietly, the check
// that should have caught it is dead.
//
//   node verify/selftest.mjs

import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';

import { join } from 'node:path';
import { programVersion, sessionEnv } from '../lib/claude.mjs';
import { MODEL, SESSION_TIMEOUT_MS, STAGE_ROOT, TURN_LIMIT } from '../lib/config.mjs';
import { loadQuestions } from '../lib/questions.mjs';
import { assertCleanAncestors, stageArm } from '../lib/stage.mjs';
import { headlineSentence, outcome } from '../lib/stats.mjs';
import { checkRun } from './check.mjs';
import { brokenLog, FIXTURE_VERSION, goodEvents, toLog, writeRun, writeSource } from './fixtures.mjs';
import { logPath, scanLog, scanRun, usageWarning } from './scan.mjs';
import { proofCases } from './selftest-proof.mjs';
import { runCases } from './selftest-run.mjs';

const EXPECT = { model: MODEL, version: FIXTURE_VERSION };
const results = [];
const record = (group, name, pass, detail = '') => results.push({ group, name, pass, detail });

const SCAN_CASES = [
  ['an empty log file', () => '', 'empty log file'],
  ['a log that does not parse', () => '{"type":"system"\nnot json\n', 'does not parse'],
  ['no start record', () => brokenLog((init, result, events) => events.slice(1)), 'no start record'],
  ['no result record', () => brokenLog((init, result, events) => events.slice(0, -1)), 'no result record'],
  ['an empty answer', () => brokenLog((init, result) => { result.result = '  '; }), 'empty answer'],
  ['a result flagged as an error', () => brokenLog((init, result) => { result.is_error = true; }), 'flagged as an error'],
  ['a result subtype other than success', () => brokenLog((init, result) => { result.subtype = 'error_max_turns'; }), 'subtype is'],
  ['a stop reason other than a normal end', () => brokenLog((init, result) => { result.stop_reason = 'max_tokens'; }), 'stop reason is'],
  ['a session at the turn limit', () => brokenLog((init, result) => { result.num_turns = TURN_LIMIT; }), 'turn limit'],
  ['a session at the time limit', () => brokenLog((init, result) => { result.duration_ms = SESSION_TIMEOUT_MS; }), 'time limit'],
  ['a rate-limit status other than allowed', () => brokenLog((init, result, events) => { events[1].rate_limit_info.status = 'rejected'; }), 'rate limit status'],
  ['a second model that ran beside the requested one', () => brokenLog((init, result) => { result.modelUsage['a-smaller-model'] = {}; }), 'another model also ran'],
  ['a refused request at the usage limit', () => brokenLog((init, result, events) => { events[1].rate_limit_info.status = 'rejected'; }), 'rate limit status'],
  ['a model that is not the one requested', () => brokenLog((init) => { init.model = 'some-other-model'; }), 'model is'],
  ['a tool version that is not the manifest version', () => brokenLog((init) => { init.claude_code_version = '9.9.9'; }), 'tool version is'],
  ['an MCP server in the start record', () => brokenLog((init) => { init.mcp_servers = [{ name: 'x' }]; }), 'MCP server'],
  ['a skill in the start record', () => brokenLog((init) => { init.skills = ['x']; }), 'skill was loaded'],
  ['a personal plugin in the start record', () => brokenLog((init) => { init.plugins.push({ name: 'mine', path: 'C:/somewhere' }); }), 'not built in'],
  ['a refused read', () => brokenLog((init, result, events) => { events[3].message.content[0].is_error = true; result.permission_denials = [{ tool_name: 'Read' }]; }), 'was refused'],
  ['a tool call that returned an error', () => brokenLog((init, result, events) => { events[3].message.content[0].is_error = true; }), 'returned an error'],
  ['an answer that says it could not open a file', () => brokenLog((init, result) => { result.result = 'I could not open the file, so this is from search output.'; }), 'could not open'],
];

function testScan() {
  record('scan', 'a good log has no faults', scanLog(toLog(goodEvents()), EXPECT).length === 0);
  const warned = brokenLog((init, result, events) => { events[1].rate_limit_info.status = 'allowed_warning'; });
  record('scan', 'a session that ran past a usage-warning mark is recorded and is not a fault', scanLog(warned, EXPECT).length === 0 && usageWarning(warned) && !usageWarning(toLog(goodEvents())));
  for (const [name, build, expected] of SCAN_CASES) {
    const faults = scanLog(build(), EXPECT);
    record('scan', `catches ${name}`, faults.some((fault) => fault.includes(expected)), faults.join('; '));
  }
}

// Each tamper is applied to a fresh copy of the fixture run, and the checker must fail.
const TAMPERS = [
  ['a log with one record removed', (dir, s) => { const p = logPath(dir, s[0]); writeFileSync(p, readFileSync(p, 'utf8').split('\n').filter((line, i) => i !== 2).join('\n')); }],
  ['a log filed under the wrong question', (dir, s) => { rmSync(logPath(dir, s[1])); renameSync(logPath(dir, s[0]), logPath(dir, s[1])); }],
  ['two logs swapped between arms', (dir, s) => { const a = logPath(dir, s[0]); const b = logPath(dir, s[2]); const keep = readFileSync(a); writeFileSync(a, readFileSync(b)); writeFileSync(b, keep); }],
  ['a log swapped between arms with the fingerprints rewritten to match', (dir, s) => { const a = logPath(dir, s[0]); const b = logPath(dir, s[2]); const list = join(dir, 'logs.sha256'); const lines = readFileSync(list, 'utf8').trim().split('\n').map((l) => [l.slice(0, 64), l.slice(66)]); const keep = readFileSync(a); writeFileSync(a, readFileSync(b)); writeFileSync(b, keep); writeFileSync(list, `${[[lines[2][0], lines[0][1]], lines[1], [lines[0][0], lines[2][1]], lines[3]].map((l) => l.join('  ')).join('\n')}\n`); }],
  ['a table edited by hand', (dir) => { const p = join(dir, 'tables-coded.md'); writeFileSync(p, readFileSync(p, 'utf8').replace('1.00', '0.50')); }],
  ['a key changed after it was fingerprinted', (dir) => { appendFileSync(join(dir, 'key.json'), ' '); }],
  ['an extra log that is not in the schedule', (dir, s) => { writeFileSync(logPath(dir, s[0]).replace('Q1', 'Q9'), toLog(goodEvents())); }],
];

function testChecker(scratch) {
  const clean = join(scratch, 'clean');
  writeRun(clean);
  record('checker', 'a clean run passes', checkRun(clean, { staged: false }).length === 0, checkRun(clean, { staged: false }).join('; '));
  TAMPERS.forEach(([name, tamper], i) => {
    const dir = join(scratch, `tampered${i}`);
    tamper(dir, writeRun(dir));
    const failures = checkRun(dir, { staged: false });
    record('checker', `catches ${name}`, failures.length > 0, failures[0] ?? '');
  });
  const missing = join(scratch, 'missing');
  rmSync(logPath(missing, writeRun(missing)[3]));
  record('scan', 'catches fewer logs on disk than the schedule calls for', scanRun(missing).some((row) => row.faults.includes('log is missing')));
}

function throws(action, expected) {
  try { action(); return { pass: false, detail: 'did not stop' }; } catch (error) { return { pass: error.message.includes(expected), detail: error.message }; }
}

function testGuards(scratch) {
  const source = join(scratch, 'folder');
  mkdirSync(join(source, 'reference'), { recursive: true });
  for (const name of ['README.md', 'identity.md', 'examples.md']) writeFileSync(join(source, name), 'text\n');
  const cases = [
    ['a pointer to a missing file', () => stageArm(join(scratch, 'arm'), 'c1111', { source }), 'rules.md'],
    ['a staging root below an AGENTS.md', () => { mkdirSync(join(scratch, 'leaky', 'stage'), { recursive: true }); writeFileSync(join(scratch, 'leaky', 'AGENTS.md'), 'x'); assertCleanAncestors(join(scratch, 'leaky', 'stage')); }, 'AGENTS.md'],
    ['a staging root inside a git repo', () => { mkdirSync(join(scratch, 'repo', '.git'), { recursive: true }); mkdirSync(join(scratch, 'repo', 'stage'), { recursive: true }); assertCleanAncestors(join(scratch, 'repo', 'stage')); }, '.git'],
    ['a staging root below a rules folder', () => { mkdirSync(join(scratch, 'ruled', '.claude', 'rules'), { recursive: true }); mkdirSync(join(scratch, 'ruled', 'stage'), { recursive: true }); assertCleanAncestors(join(scratch, 'ruled', 'stage')); }, 'rules'],
    ['a machine-wide instruction file', () => { writeFileSync(join(scratch, 'managed.md'), 'x'); assertCleanAncestors(join(scratch, 'clean-stage'), [join(scratch, 'managed.md')]); }, 'managed instruction file'],
    ['a sixth file left in the folder', () => { const { source: s } = writeSource(join(scratch, 'six')); writeFileSync(join(s, 'answers.md'), 'key'); stageArm(join(scratch, 'six-arm'), 'docs', { source: s }); }, 'exactly'],
    ['an empty instruction file', () => { const { source: s } = writeSource(join(scratch, 'hollow')); writeFileSync(join(s, 'identity.md'), ''); stageArm(join(scratch, 'hollow-arm'), 'c1111', { source: s }); }, 'is empty'],
    ['a missing program', () => programVersion('no-such-claude-program'), 'Cannot run'],
    ['zero questions', () => { writeFileSync(join(scratch, 'none.md'), '# No questions here\n'); loadQuestions(join(scratch, 'none.md')); }, 'No questions found'],
    ['a question with no prompt', () => { writeFileSync(join(scratch, 'blank.md'), '## Q1\n\n**Expected answer:** x\n'); loadQuestions(join(scratch, 'blank.md')); }, 'no prompt'],
  ];
  for (const [name, action, expected] of cases) record('guards', `stops loudly on ${name}`, ...Object.values(throws(action, expected)));
  const env = sessionEnv({ PATH: 'p', CLAUDE_CODE_SSE_PORT: '1', MY_SECRET: 's', USERPROFILE: 'u' });
  record('guards', 'a session does not inherit variables outside the allowed list', !('MY_SECRET' in env) && !('CLAUDE_CODE_SSE_PORT' in env) && env.PATH === 'p', Object.keys(env).join(','));
}

function tally(lower, higher, equal, missing = 0) {
  return { lower, higher, equal, missing, meanA: 2, meanB: 4, perQuestion: Array(lower + higher + equal + missing).fill({}) };
}

function testRule() {
  const cases = [[tally(9, 1, 0), 'fewer'], [tally(10, 0, 0), 'fewer'], [tally(0, 10, 0), 'more'], [tally(1, 9, 0), 'more'], [tally(0, 0, 10), 'unclear'], [tally(7, 3, 0), 'unclear'], [tally(8, 0, 0, 2), 'unclear'], [tally(1, 5, 4), 'unclear']];
  for (const [input, expected] of cases) {
    const got = outcome(input);
    record('rule', `fewer ${input.lower}, more ${input.higher}, equal ${input.equal}, missing ${input.missing} gives "${expected}"`, got === expected && headlineSentence(input).length > 0, got);
  }
}

function main() {
  // The scratch folder sits under the staging root, which has to be free of CLAUDE.md and
  // AGENTS.md above it. A machine's temp folder is not always free of them.
  mkdirSync(STAGE_ROOT, { recursive: true });
  const scratch = mkdtempSync(join(STAGE_ROOT, 'selftest-'));
  testScan();
  testChecker(scratch);
  testGuards(scratch);
  testRule();
  runCases(record, join(scratch, 'run'));
  proofCases(record, join(scratch, 'proof'));
  rmSync(scratch, { recursive: true, force: true });
  for (const r of results) console.log(`${r.pass ? 'pass' : 'FAIL'}  [${r.group}] ${r.name}${r.pass ? '' : `  (${r.detail})`}`);
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed} of ${results.length} self-test cases passed.`);
  if (failed > 0) process.exitCode = 1;
}

main();
