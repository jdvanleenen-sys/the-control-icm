// Marking for the supplement: one shuffled sheet of every primary-set answer from every arm, with
// planted answers of known grade, cut into batches. Each batch becomes one self-contained prompt:
// the marking rules, the documents, and the answers. The same prompts go to both markers.
//
//   node verify/sup-mark.mjs sheets --name sup1        build the batches and the prompts
//   node verify/sup-mark.mjs opus --name sup1          mark every batch with claude-opus-5-5
//   node verify/sup-mark.mjs collect --name sup1 --marker gemini
//                                                      check and merge replies saved by hand
//
// A Gemini reply is saved as marking/gemini-NN.csv, word for word, by whoever carries it across.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sessionEnv } from '../lib/claude.mjs';
import { option, runCli } from '../lib/cli.mjs';
import { CLAUDE_BIN, EFFORT, REPO, runDir } from '../lib/config.mjs';
import { seededRandom, sha256, shuffle } from '../lib/rng.mjs';
import { loadAllQuestions, PRIMARY_SET } from '../lib/sup.mjs';
import { attachments } from '../tools/new-questions.mjs';
import { hideStaging, plantAnswers } from './sheet.mjs';

export const BATCH = 18;
export const OPUS = 'claude-opus-5-5';
export const HEADER = 'number,grade,unsupported,unsettled,guess';
const GRADES = ['correct', 'incorrect', 'insufficient'];
const YESNO = ['yes', 'no'];
const GUESSES = ['loaded', 'staged', 'none', 'unsure'];

function entry(number, q, answer) {
  return [`## Answer ${number}`, '', `**Question:** ${q.prompt}`, '', `**Expected answer:** ${q.expected}`, '', `**Correct requires:** ${q.requires}`, '', '**The answer to mark:**', '', answer.trim(), ''].join('\n');
}

export function promptFor(batchText, repo = REPO) {
  return [readFileSync(join(repo, 'MARKING.md'), 'utf8').replace(/\r\n/g, '\n').trim(), '', '# The documents', '', attachments(), '', '# The marking sheet', '', batchText].join('\n');
}

export function buildBatches(dir) {
  const key = JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8'));
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const questions = Object.fromEntries(loadAllQuestions().filter((q) => q.questionSet === PRIMARY_SET).map((q) => [q.id, q]));
  const numberOf = Object.fromEntries(Object.entries(key.answers).map(([n, a]) => [`${a.code}|${a.run}|${a.question}`, n]));
  const rows = JSON.parse(readFileSync(join(dir, 'rows-coded.json'), 'utf8')).filter((r) => questions[r.question] && r.faults.length === 0);
  const random = seededRandom(sha256(readFileSync(join(dir, 'logs.sha256'), 'utf8')));
  const real = rows.map((r) => ({ number: numberOf[`${r.code}|${r.run}|${r.question}`], question: r.question, answer: hideStaging(r.answer, manifest.staged[r.code].dir) }));
  const plants = plantAnswers(questions, new Set(Object.keys(key.answers)), random);
  const all = shuffle([...real, ...plants], random);
  for (const code of Object.keys(key.arms)) if (all.some((a) => new RegExp(`\\b${code}\\b`).test(a.answer))) throw new Error(`An answer shows arm code ${code}.`);
  const batches = [];
  for (let i = 0; i < all.length; i += BATCH) batches.push(all.slice(i, i + BATCH));
  return { batches: batches.map((b) => ({ numbers: b.map((a) => a.number), text: b.map((a) => entry(a.number, questions[a.question], a.answer)).join('\n') })), plants };
}

// Checks one marker's CSV against the numbers it was given. Returns the rows, or throws.
export function parseCsv(text, numbers) {
  const lines = text.replace(/\r\n/g, '\n').trim().replace(/^```[a-z]*\n|\n```$/g, '').split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines[0] !== HEADER) throw new Error(`The first line is "${lines[0]}", not the header.`);
  const rows = lines.slice(1).map((l) => l.split(',').map((x) => x.trim().toLowerCase()));
  const seen = rows.map((r) => r[0]);
  const missing = numbers.filter((n) => !seen.includes(String(n)));
  const extra = seen.filter((n) => !numbers.map(String).includes(n));
  const bad = rows.filter((r) => r.length !== 5 || !GRADES.includes(r[1]) || !YESNO.includes(r[2]) || !YESNO.includes(r[3]) || !GUESSES.includes(r[4]));
  if (missing.length || extra.length || bad.length || new Set(seen).size !== seen.length) throw new Error(`Bad marks: missing ${missing.join(' ') || 'none'}; extra ${extra.join(' ') || 'none'}; malformed ${bad.length}; repeated ${seen.length - new Set(seen).size}.`);
  return rows.map((r) => r.join(','));
}

function sheets(dir) {
  const out = join(dir, 'marking');
  mkdirSync(out, { recursive: true });
  const { batches, plants } = buildBatches(dir);
  batches.forEach((b, i) => {
    const nn = String(i + 1).padStart(2, '0');
    writeFileSync(join(out, `batch-${nn}.prompt.txt`), promptFor(b.text));
    writeFileSync(join(out, `batch-${nn}.numbers.txt`), `${b.numbers.join('\n')}\n`);
  });
  writeFileSync(join(dir, 'marking-key.csv'), `number,grade\n${plants.map((p) => `${p.number},${p.grade}`).join('\n')}\n`);
  console.log(`${batches.length} batches of up to ${BATCH} answers written under marking/.`);
}

function batchList(dir) {
  return readdirSync(join(dir, 'marking')).filter((n) => /^batch-\d+\.prompt\.txt$/.test(n)).sort().map((n) => n.match(/\d+/)[0]);
}

function opus(dir) {
  const out = join(dir, 'marking');
  for (const nn of batchList(dir)) {
    const target = join(out, `opus-${nn}.csv`);
    if (existsSync(target)) continue;
    const numbers = readFileSync(join(out, `batch-${nn}.numbers.txt`), 'utf8').trim().split('\n');
    const prompt = readFileSync(join(out, `batch-${nn}.prompt.txt`), 'utf8');
    const room = mkdtempSync(join(tmpdir(), 'tc-mark-'));
    const done = spawnSync(CLAUDE_BIN, ['--setting-sources', 'project', '-p', '--model', OPUS, '--effort', EFFORT, '--tools', '', '--strict-mcp-config', '--disable-slash-commands', '--output-format', 'json'], { cwd: room, input: prompt, encoding: 'utf8', env: sessionEnv(), maxBuffer: 64 * 1024 * 1024, timeout: 900000 });
    const result = JSON.parse(done.stdout);
    writeFileSync(join(out, `opus-${nn}.raw.json`), done.stdout);
    const rows = parseCsv(result.result, numbers);
    writeFileSync(target, `${HEADER}\n${rows.join('\n')}\n`);
    console.log(`batch ${nn}: ${rows.length} marks, model ${Object.keys(result.modelUsage ?? {}).join(',')}`);
  }
  collect(dir, 'opus');
}

function collect(dir, marker) {
  const out = join(dir, 'marking');
  const all = [];
  for (const nn of batchList(dir)) {
    const numbers = readFileSync(join(out, `batch-${nn}.numbers.txt`), 'utf8').trim().split('\n');
    const file = join(out, `${marker}-${nn}.csv`);
    if (!existsSync(file)) throw new Error(`No ${marker}-${nn}.csv yet.`);
    all.push(...parseCsv(readFileSync(file, 'utf8'), numbers));
  }
  writeFileSync(join(dir, `marks-${marker}.csv`), `${HEADER}\n${all.join('\n')}\n`);
  console.log(`marks-${marker}.csv: ${all.length} marks.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(() => {
    const mode = process.argv[2];
    const dir = runDir(option('name') ?? '');
    if (mode === 'sheets') sheets(dir);
    else if (mode === 'opus') opus(dir);
    else if (mode === 'collect') collect(dir, option('marker'));
    else throw new Error('Usage: node verify/sup-mark.mjs sheets|opus|collect --name NAME [--marker gemini]');
  });
}
