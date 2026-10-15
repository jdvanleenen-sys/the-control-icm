// The supplement's rule, as code. Given one row per session, the arms, and the marks, it writes the
// sentences fixed in PLAN.md. It is committed and tested before the run and run once after it.
//
//   node verify/sup-verdict.mjs --name sup1

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { option, runCli } from '../lib/cli.mjs';
import { runDir } from '../lib/config.mjs';
import { ARM_DOCS, ARM_EAGER, ARM_FOLDER, ARM_ICM } from '../lib/sup.mjs';
import { FACTS_HELDOUT, FACTS_NEW } from '../tools/key-facts-sets.mjs';
import { FACTS as FACTS_EXAM } from '../tools/key-facts.mjs';

export const COMPARISONS = [
  { first: ARM_ICM, second: ARM_DOCS, subject: 'the ICM workspace', against: 'the documents alone' },
  { first: ARM_ICM, second: ARM_FOLDER, subject: 'the ICM workspace', against: "the entry's folder" },
  { first: ARM_ICM, second: ARM_EAGER, subject: "loading the ICM's files as each stage is reached", against: 'loading the same files all at once' },
];
export const TEXT_MARGIN = 0.05;
export const ANSWER_MARGIN = 0.05;

// The smallest k for which a fair coin gives k or more of n, in either direction, at most 5 in 100.
export function threshold(n) {
  const choose = (a, b) => { let r = 1; for (let i = 1; i <= b; i += 1) r = (r * (a - b + i)) / i; return r; };
  for (let k = Math.ceil(n / 2); k <= n; k += 1) {
    let tail = 0;
    for (let j = k; j <= n; j += 1) tail += choose(n, j);
    if ((2 * tail) / 2 ** n <= 0.05) return k;
  }
  return null;
}

export const answerMargin = (answers) => Math.ceil(ANSWER_MARGIN * answers);
const mean = (values) => (values.length === 0 ? null : values.reduce((a, b) => a + b, 0) / values.length);
const squeeze = (text) => String(text ?? '').replace(/\s+/g, ' ');
const ALL_FACTS = { ...FACTS_EXAM, ...FACTS_HELDOUT, ...FACTS_NEW };

// Exam questions in the entry are Q1..Q10, the same ids as here.
export const holdsEveryFact = (question, answer, facts = ALL_FACTS) => (facts[question] ?? []).every(([, pattern]) => pattern.test(squeeze(answer)));

// Per question, the mean of one measure in each arm, and how many questions went each way.
export function tally(rows, questions, a, b, measure) {
  let lower = 0; let higher = 0; let tie = 0;
  for (const q of questions) {
    const x = mean(rows.filter((r) => r.arm === a && r.question === q).map(measure));
    const y = mean(rows.filter((r) => r.arm === b && r.question === q).map(measure));
    if (x === null || y === null || x === y) tie += 1; else if (x < y) lower += 1; else higher += 1;
  }
  return { lower, higher, tie };
}

// Right answers in one reading. A reading is a function from a row to true (right) or false.
const rightCount = (rows, arm, reading) => rows.filter((r) => r.arm === arm && reading(r)).length;

export function compare(rows, questions, readings, { first, second, subject, against }) {
  const n = questions.length;
  const t = threshold(n);
  const pool = rows.filter((r) => questions.includes(r.question) && r.faults.length === 0);
  const doc = tally(pool, questions, first, second, (r) => r.documentSteps);
  const total = tally(pool, questions, first, second, (r) => r.documentSteps + r.instructionSteps);
  // Right answers are compared as a share of each arm's clean sessions, scaled to all n x 3 answers,
  // so a session left out for a set-up fault never counts as a wrong answer.
  const m = answerMargin(n * 3);
  const scaled = (arm, reading) => { const k = pool.filter((r) => r.arm === arm).length; return k === 0 ? 0 : (rightCount(pool, arm, reading) / k) * n * 3; };
  const answers = Object.entries(readings).map(([name, reading]) => {
    const a = scaled(first, reading); const b = scaled(second, reading);
    return { name, first: a, second: b, fails: b - a >= m - 1e-9 };
  });
  const textA = mean(pool.filter((r) => r.arm === first).map((r) => r.textChars));
  const textB = mean(pool.filter((r) => r.arm === second).map((r) => r.textChars));
  const conditions = {
    steps: doc.lower >= t ? 'holds' : doc.higher >= t ? 'fails' : 'unclear',
    answers: answers.some((x) => x.fails) ? 'fails' : 'holds',
    text: textA > textB * (1 + TEXT_MARGIN) ? 'fails' : 'holds',
  };
  const failed = Object.entries(conditions).filter(([, v]) => v === 'fails').map(([k]) => k);
  const outcome = failed.length > 0 ? 'did not earn' : conditions.steps === 'holds' ? 'earned' : 'could not tell';
  const words = { steps: 'document steps clearly rose', answers: 'a reading counted fewer right answers by the margin or more', text: 'text rose by more than 5%' };
  let sentence = outcome === 'earned' ? `On these questions ${subject} earned its place against ${against}.`
    : outcome === 'did not earn' ? `By the rule fixed before the run, ${subject} did not earn its place against ${against}: ${failed.map((f) => words[f]).join('; ')}.`
      : `The test could not tell whether ${subject} earned its place against ${against}.`;
  if (doc.lower >= t && total.higher >= t) sentence += ' It found the documents in fewer steps, but took more steps in all, because it read its own instructions.';
  return { first, second, n, t, m, doc, total, answers, text: { first: textA, second: textB }, conditions, outcome, sentence };
}

export function verdicts(rows, questions, readings) {
  const results = COMPARISONS.map((c) => compare(rows, questions, readings, c));
  const both = results[0].outcome === 'earned' && results[1].outcome === 'earned';
  return { results, both, bothSentence: both ? 'The ICM workspace was better than both systems on these questions.' : 'The ICM workspace was not shown better than both systems on these questions.' };
}

// Marks files: number,grade,unsupported,unsettled,guess. Returns a map from answer number to grade.
export function readMarks(path) {
  const lines = readFileSync(path, 'utf8').replace(/\r\n/g, '\n').trim().split('\n').slice(1);
  return Object.fromEntries(lines.map((line) => { const [number, grade] = line.split(','); return [number, grade.trim()]; }));
}

function fmt(x, d = 2) { return x === null ? '-' : x.toFixed(d); }

export function report(v) {
  const out = ['# The verdicts, by the rule fixed before the run', ''];
  for (const r of v.results) {
    out.push(`## ${r.first} against ${r.second}`, '', r.sentence, '',
      `- Document steps: lower on ${r.doc.lower}, higher on ${r.doc.higher}, equal on ${r.doc.tie} of ${r.n} questions (clear at ${r.t}).`,
      `- Total steps: lower on ${r.total.lower}, higher on ${r.total.higher}, equal on ${r.total.tie}.`,
      ...r.answers.map((a) => `- Right answers, ${a.name}, out of ${r.n * 3}: ${fmt(a.first, 1)} against ${fmt(a.second, 1)} (fails at ${r.m} fewer).`),
      `- Text per session, characters: ${fmt(r.text.first, 0)} against ${fmt(r.text.second, 0)} (fails above ${fmt(r.text.second * (1 + TEXT_MARGIN), 0)}).`, '');
  }
  out.push(v.bothSentence, '');
  return out.join('\n');
}

function main() {
  const dir = runDir(option('name') ?? '');
  if (!existsSync(join(dir, 'rows-coded.json'))) throw new Error('No rows-coded.json in that run.');
  const key = JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8'));
  const numberOf = Object.fromEntries(Object.entries(key.answers).map(([n, a]) => [`${a.code}|${a.run}|${a.question}`, n]));
  const rows = JSON.parse(readFileSync(join(dir, 'rows-coded.json'), 'utf8')).map((r) => ({ ...r, arm: key.arms[r.code], number: numberOf[`${r.code}|${r.run}|${r.question}`] }));
  const primary = [...new Set(rows.map((r) => r.question))].filter((q) => q.startsWith('N')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  const readings = { 'key-fact coverage': (r) => holdsEveryFact(r.question, r.answer) };
  for (const [name, file] of [['Claude Opus 5.5', 'marks-opus.csv'], ['Gemini', 'marks-gemini.csv']]) {
    if (existsSync(join(dir, file))) { const marks = readMarks(join(dir, file)); readings[name] = (r) => marks[r.number] === 'correct'; }
  }
  const text = report(verdicts(rows, primary, readings));
  writeFileSync(join(dir, 'verdicts.md'), text);
  process.stdout.write(text);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(main);
