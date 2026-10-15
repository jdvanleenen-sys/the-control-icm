// Takes the new question pool out of the writer's raw answer, word for word, and renames its
// headings "## P1".."## P20" to "## N1".."## N20" in the same order. Nothing else is changed.
// Also saves the writer's "Contradictions found" list as written.
//
//   node tools/renumber-new.mjs
//
// Reads generator/new/write.answer.md; writes generator/new/question-pool.md and
// generator/new/contradictions.md. Safe to re-run.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from '../lib/config.mjs';

const DIR = join(REPO, 'generator', 'new');
const raw = readFileSync(join(DIR, 'write.answer.md'), 'utf8');

const OPEN = '```question-pool.md\n';
const start = raw.indexOf(OPEN);
if (start < 0) throw new Error('No question-pool.md code block in write.answer.md.');
const bodyStart = start + OPEN.length;
const end = raw.indexOf('\n```', bodyStart);
if (end < 0) throw new Error('The question-pool.md code block is not closed.');
const block = raw.slice(bodyStart, end + 1);

let n = 0;
const pool = block.replace(/^## P(\d+)$/gm, (_, num) => {
  n += 1;
  if (Number(num) !== n) throw new Error(`Heading P${num} is out of order (expected P${n}).`);
  return `## N${n}`;
});
if (n !== 20) throw new Error(`Expected 20 headings, found ${n}.`);
writeFileSync(join(DIR, 'question-pool.md'), pool);

const MARK = '**Contradictions found**';
const at = raw.indexOf(MARK, end);
if (at < 0) throw new Error('No "Contradictions found" list in write.answer.md.');
writeFileSync(join(DIR, 'contradictions.md'), raw.slice(at));

console.log(`question-pool.md: ${n} questions renamed P to N; contradictions.md saved.`);
