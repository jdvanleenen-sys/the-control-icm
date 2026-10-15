// Draws the exam from the pool of questions an outside model wrote. Nobody chooses: the seed is
// the fingerprint of the pool and of the list of questions dropped at the key check, so the
// same two files always give the same draw. One question is drawn for each type in each
// document set. The rest of the pool becomes the held-out questions.
//
//   node tools/draw.mjs

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from '../lib/cli.mjs';
import { QUESTIONS_FILE, REPO } from '../lib/config.mjs';
import { seededRandom, sha256, shuffle } from '../lib/rng.mjs';

export const QUESTION_TYPES = ['plain lookup', 'changed rule', 'exception or condition', 'two documents', 'trap'];
const POOL_FILE = join(REPO, 'generator', 'question-pool.md');
const DROPPED_FILE = join(REPO, 'generator', 'dropped.txt');
const HELDOUT_FILE = join(REPO, 'questions-heldout.md');
const unix = (text) => text.replace(/\r\n/g, '\n');
const label = (body, name) => (body.match(new RegExp(`\\*\\*${name}:\\*\\*\\s*(.+)`))?.[1] ?? '').trim();

// The pool as written: one entry per "## <id>" heading, with its set and type read from it.
export function readPool(poolText) {
  const parts = unix(poolText).split(/^## (\S+)\s*$/m);
  const pool = [];
  for (let i = 1; i < parts.length; i += 2) {
    // A writer may put a rule between two groups of questions. It belongs to neither.
    const body = parts[i + 1].trim().replace(/\n+-{3,}$/, '');
    const entry = { id: parts[i], set: label(body, 'Set').split(/\s/)[0], type: label(body, 'Type').toLowerCase(), body };
    if (!QUESTION_TYPES.includes(entry.type)) throw new Error(`Pool question ${entry.id} has the type "${entry.type}", which is not one of: ${QUESTION_TYPES.join(', ')}.`);
    if (entry.set === '') throw new Error(`Pool question ${entry.id} names no set.`);
    pool.push(entry);
  }
  if (pool.length === 0) throw new Error('No questions found in the pool.');
  return pool;
}

const page = (title, prefix, entries) => `# ${title}\n\n${entries.map((e, i) => `## ${prefix}${i + 1}\n\n**Drawn from:** ${e.id}\n\n${e.body}`).join('\n\n')}\n`;

// One slot is one type in one set. Slots are taken in a fixed order, so the draw depends only
// on the seed. A slot with nothing left after the key check is reported and left empty.
export function drawQuestions(poolText, droppedText = '') {
  const dropped = unix(droppedText).split('\n').map((line) => line.trim()).filter(Boolean);
  const pool = readPool(poolText);
  const unknown = dropped.filter((id) => !pool.some((e) => e.id === id));
  if (unknown.length > 0) throw new Error(`The dropped list names questions that are not in the pool: ${unknown.join(', ')}.`);
  const seed = sha256(`${unix(poolText)}\n--dropped--\n${dropped.join('\n')}`);
  const random = seededRandom(seed);
  const exam = [];
  const empty = [];
  for (const set of [...new Set(pool.map((e) => e.set))].sort()) {
    for (const type of QUESTION_TYPES) {
      const left = pool.filter((e) => e.set === set && e.type === type && !dropped.includes(e.id));
      if (left.length === 0) empty.push(`${set}, ${type}`);
      else exam.push(shuffle(left, random)[0]);
    }
  }
  const heldout = pool.filter((e) => !dropped.includes(e.id) && !exam.includes(e));
  return { seed, exam, heldout, empty, dropped, questions: page('Questions', 'Q', exam), heldoutPage: page('Held-out questions', 'H', heldout) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(() => {
    if (existsSync(QUESTIONS_FILE)) throw new Error('questions.md already exists. The exam is drawn once and never redrawn.');
    const drawn = drawQuestions(readFileSync(POOL_FILE, 'utf8'), existsSync(DROPPED_FILE) ? readFileSync(DROPPED_FILE, 'utf8') : '');
    writeFileSync(QUESTIONS_FILE, drawn.questions);
    writeFileSync(HELDOUT_FILE, drawn.heldoutPage);
    console.log(`Seed ${drawn.seed}.`);
    console.log(`Exam: ${drawn.exam.map((e) => e.id).join(', ')}. Held out: ${drawn.heldout.map((e) => e.id).join(', ') || 'none'}. Dropped at the key check: ${drawn.dropped.join(', ') || 'none'}.`);
    if (drawn.empty.length > 0) console.log(`No question was left for: ${drawn.empty.join('; ')}. The exam is short by ${drawn.empty.length}.`);
  });
}
