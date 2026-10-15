// Runs one practice question against a workspace being built, with exactly the flags, tools and
// isolation of the sealed run, and prints what happened. For building and walk-testing only.
//
//   node tools/practice.mjs --workspace <dir> --set <practice set dir> --doclist <path in workspace> --q Q3
//                           [--runs 1] [--log <dir>]
//
// The workspace and the set's reference/ are copied into a fresh room; the list of documents is
// generated from that reference/ by tools/make-map.mjs and written to --doclist inside the room.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ask } from '../lib/claude.mjs';
import { option, runCli } from '../lib/cli.mjs';
import { LIBRARY_DIR } from '../lib/config.mjs';
import { loadQuestions } from '../lib/questions.mjs';
import { parseLog, summarise } from '../lib/session.mjs';
import { assertCleanAncestors } from '../lib/stage.mjs';
import { makeMap } from './make-map.mjs';

const ROOT = process.platform === 'win32' ? 'C:/tc-practice' : '/tmp/tc-practice';
const STAGED_TIME = new Date('2026-01-01T00:00:00Z');

function setTimes(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) setTimes(path);
    utimesSync(path, STAGED_TIME, STAGED_TIME);
  }
}

// The room a practice session runs in: the workspace, the set's documents, and the generated list.
export function stageRoom(room, workspace, set, doclist) {
  rmSync(room, { recursive: true, force: true });
  mkdirSync(room, { recursive: true });
  cpSync(workspace, room, { recursive: true });
  if (existsSync(join(room, LIBRARY_DIR))) throw new Error(`The workspace holds its own ${LIBRARY_DIR}/; the documents come from the set.`);
  cpSync(join(set, LIBRARY_DIR), join(room, LIBRARY_DIR), { recursive: true });
  const listPath = join(room, doclist);
  if (resolve(listPath).toLowerCase().startsWith(resolve(room, LIBRARY_DIR).toLowerCase())) throw new Error('The list of documents may not sit inside reference/.');
  mkdirSync(dirname(listPath), { recursive: true });
  writeFileSync(listPath, makeMap(join(room, LIBRARY_DIR)));
  setTimes(room);
}

const isDoc = (target) => target.toLowerCase().startsWith(`${LIBRARY_DIR}/`);

export function describe(row) {
  const calls = row.calls.map((c) => `${c.tool} ${c.target}${c.ok ? '' : ' (refused)'}`);
  const instruction = row.calls.filter((c) => c.tool === 'Read' && !isDoc(c.target)).length;
  return [
    `steps ${row.steps} (instruction opens ${instruction}, document steps ${row.steps - instruction}), text fetched ${row.charsFetched} characters, ${row.words} words, ${row.seconds} s, model ${row.model}`,
    ...calls.map((c) => `  - ${c}`),
    '', row.answer, '',
  ].join('\n');
}

function main() {
  const usage = 'Usage: node tools/practice.mjs --workspace <dir> --set <dir> --doclist <path> --q <id> [--runs n] [--log <dir>]';
  const workspace = option('workspace'); const set = option('set'); const doclist = option('doclist'); const id = option('q');
  if (!workspace || !set || !doclist || !id) throw new Error(usage);
  const question = loadQuestions(join(set, 'questions.md')).find((q) => q.id === id);
  if (!question) throw new Error(`No question ${id} in ${set}/questions.md.`);
  const runs = Number(option('runs', '1'));
  const log = option('log');
  assertCleanAncestors(ROOT);
  for (let r = 1; r <= runs; r += 1) {
    const room = join(ROOT, `room-${process.pid}-${r}`);
    stageRoom(room, workspace, set, doclist);
    const done = ask(room, question.prompt);
    const row = summarise(parseLog(done.stream).events, { stageDir: room, code: 'practice', run: r, question: id });
    if (log) { mkdirSync(log, { recursive: true }); writeFileSync(join(log, `${id}-r${r}.jsonl`), done.stream); }
    console.log(`## ${id}, run ${r}\n\n${describe(row)}`);
    rmSync(room, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(main);
