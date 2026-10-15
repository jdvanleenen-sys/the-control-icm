// Builds synthetic session logs and a tiny synthetic run for the self-test. Nothing here comes
// from a real session, so the fixtures carry no private strings.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { MODEL } from '../lib/config.mjs';
import { sha256 } from '../lib/rng.mjs';
import { codedTables, loadRows } from './analyse.mjs';
import { logPath, scanReport, scanRun } from './scan.mjs';

export const FIXTURE_VERSION = '0.0.0';
export const FIXTURE_ARMS = { AAAA: 'docs', BBBB: 'empty' };
export const FIXTURE_QUESTIONS = ['Q1', 'Q2'];

export function goodEvents(code = 'AAAA', answer = 'The limit is ten (reference/set/doc.md, section 2).', cwd = `C:/tc/${code}`) {
  return [
    { type: 'system', subtype: 'init', cwd, model: MODEL, claude_code_version: FIXTURE_VERSION, mcp_servers: [], skills: [], plugins: [{ name: 'built-in', path: 'builtin' }] },
    { type: 'rate_limit_event', rate_limit_info: { status: 'allowed' } },
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 't1', name: 'Read', input: { file_path: `${cwd}/reference/set/doc.md` } }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1', is_error: false }] } },
    { type: 'assistant', message: { content: [{ type: 'text', text: answer }] } },
    { type: 'result', subtype: 'success', is_error: false, result: answer, stop_reason: 'end_turn', num_turns: 2, duration_ms: 4000, permission_denials: [], usage: { input_tokens: 100, output_tokens: 20 }, modelUsage: { [MODEL]: {} } },
  ];
}

export const toLog = (events) => `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;

// Returns a changed copy of the good log. `change` receives the start record, the result
// record and the whole list.
export function brokenLog(change) {
  const events = structuredClone(goodEvents());
  const replaced = change(events[0], events.at(-1), events);
  return toLog(replaced ?? events);
}

// The plan for a two-arm, two-question run: schedule, key and the key's fingerprint.
export function writePlan(dir, name = 'fixture') {
  const sessions = [];
  for (const code of Object.keys(FIXTURE_ARMS)) for (const question of FIXTURE_QUESTIONS) sessions.push({ order: sessions.length + 1, run: 1, question, code });
  const answers = Object.fromEntries(sessions.map((s, i) => [String(2001 + i), { code: s.code, run: s.run, question: s.question }]));
  const keyText = `${JSON.stringify({ salt: 'fixture', arms: FIXTURE_ARMS, answers }, null, 2)}\n`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'schedule.json'), JSON.stringify({ name, runs: 1, questions: FIXTURE_QUESTIONS, sessions }));
  writeFileSync(join(dir, 'key.json'), keyText);
  writeFileSync(join(dir, 'key.sha256'), `${sha256(keyText)}\n`);
  return sessions;
}

// A finished two-arm, two-question run written to `dir`, with fingerprints and coded tables.
export function writeRun(dir) {
  const sessions = writePlan(dir);
  const questionsText = FIXTURE_QUESTIONS.map((id) => `## ${id}\n\n**Prompt:**\n\n> What is the limit in case ${id}?\n`).join('\n');
  writeFileSync(join(dir, 'questions.md'), questionsText);
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify({ model: MODEL, version: FIXTURE_VERSION, limit: 0, questionsSha256: sha256(questionsText), staged: { AAAA: { dir: 'C:/tc/AAAA' }, BBBB: { dir: 'C:/tc/BBBB' } } }));
  const fingerprints = [];
  for (const session of sessions) {
    const path = logPath(dir, session);
    const text = toLog(goodEvents(session.code, `Answer for ${session.question}.`));
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
    writeFileSync(path.replace(/\.jsonl$/, '.meta.json'), JSON.stringify({ ...session, prompt: `Prompt for ${session.question}`, stageDir: `C:/tc/${session.code}` }));
    fingerprints.push(`${sha256(text)}  logs/${session.code}/r1/${session.question}.jsonl`);
  }
  writeFileSync(join(dir, 'logs.sha256'), `${fingerprints.join('\n')}\n`);
  writeFileSync(join(dir, 'scan.md'), scanReport(scanRun(dir)));
  writeFileSync(join(dir, 'tables-coded.md'), codedTables(loadRows(dir)));
  return sessions;
}

// A minimal source folder and question file, for running the real run code with a stand-in.
export function writeSource(dir) {
  mkdirSync(join(dir, 'folder', 'reference', 'set'), { recursive: true });
  writeFileSync(join(dir, 'folder', 'reference', 'set', 'doc.md'), '---\nset: Set\nrole: governing\ncovers: "one rule"\n---\n\n# Doc\n');
  for (const name of ['README.md', 'identity.md', 'rules.md', 'examples.md']) writeFileSync(join(dir, 'folder', name), `${name} text\n`);
  writeFileSync(join(dir, 'questions.md'), FIXTURE_QUESTIONS.map((id) => `## ${id}\n\n**Prompt:**\n\n> What is the limit in case ${id}?\n`).join('\n'));
  return { source: join(dir, 'folder'), questionsFile: join(dir, 'questions.md') };
}
