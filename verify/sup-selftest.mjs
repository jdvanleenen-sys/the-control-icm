// Runs the whole supplement pipeline on a stand-in for the program: schedule, stage, run every
// session, scan, rows, marking batches and verdicts. No model is called. The run folder is removed.
//
//   node verify/sup-selftest.mjs

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { REPO, runDir } from '../lib/config.mjs';
import { executeSupRun } from '../tools/sup-run.mjs';

const NAME = 'selftest-sup';
const dir = runDir(NAME);
rmSync(dir, { recursive: true, force: true });
execFileSync(process.execPath, [join(REPO, 'tools', 'sup-schedule.mjs'), '--name', NAME, '--runs', '1'], { stdio: 'inherit' });

// A stand-in session: opens one document, then answers. Model and version match the manifest.
const VERSION = '9.9.9';
function asker(stageDir, prompt) {
  const events = [
    { type: 'system', subtype: 'init', model: 'claude-sonnet-5-5', claude_code_version: VERSION, mcp_servers: [], skills: [], plugins: [], tools: ['Read', 'Glob', 'Grep'] },
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 't1', name: 'Read', input: { file_path: `${stageDir}/reference/film/film-fees.md` } }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1', content: 'x'.repeat(1000) }] } },
    { type: 'result', subtype: 'success', is_error: false, result: `Stand-in answer to: ${prompt.slice(0, 40)}`, stop_reason: 'end_turn', num_turns: 2, duration_ms: 1000, usage: { input_tokens: 10, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, output_tokens: 5 }, modelUsage: { 'claude-sonnet-5-5': {} } },
  ];
  return { stream: `${events.map((e) => JSON.stringify(e)).join('\n')}\n`, stderr: '', exit: 0, timedOut: false, wallMs: 1 };
}

executeSupRun(dir, { asker, version: VERSION, stageRoot: 'C:/tc-selftest' });
const rows = JSON.parse(readFileSync(join(dir, 'rows-coded.json'), 'utf8'));
const schedule = JSON.parse(readFileSync(join(dir, 'schedule.json'), 'utf8'));
assert.equal(rows.length, schedule.sessions.length);
assert.equal(rows.filter((r) => r.faults.length > 0).length, 0, 'the stand-in sessions should be clean');
assert.ok(rows.every((r) => r.documentSteps === 1 && r.instructionSteps === 0));
const loaded = new Set(rows.map((r) => r.loadedChars));
assert.ok(loaded.size === 4 && loaded.has(0) && loaded.has(5261), 'loaded text: none for docs, 5261 for the folder, one figure each for the two ICM arms');
assert.ok(!existsSync('C:/tc-selftest') || readdirSync('C:/tc-selftest').length === 0, 'staged arms are removed');

execFileSync(process.execPath, [join(REPO, 'verify', 'sup-mark.mjs'), 'sheets', '--name', NAME], { stdio: 'inherit' });
const batches = readdirSync(join(dir, 'marking')).filter((n) => n.endsWith('.prompt.txt'));
assert.ok(batches.length > 0);
const sheet = batches.map((n) => readFileSync(join(dir, 'marking', n), 'utf8')).join('\n');
for (const code of Object.keys(JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8')).arms)) assert.ok(!new RegExp(`\\b${code}\\b`).test(sheet.split('# The marking sheet').slice(1).join('')), `code ${code} on a sheet`);
assert.ok(!/tc-selftest/i.test(sheet), 'a staging path on a sheet');

const out = execFileSync(process.execPath, [join(REPO, 'verify', 'sup-verdict.mjs'), '--name', NAME], { encoding: 'utf8' });
assert.match(out, /icm against docs/);
assert.match(out, /could not tell|did not earn|earned/);
rmSync(dir, { recursive: true, force: true });
rmSync('C:/tc-selftest', { recursive: true, force: true });
console.log(`sup-selftest: ${rows.length} stand-in sessions, ${batches.length} marking batches, verdicts written. All checks pass.`);
