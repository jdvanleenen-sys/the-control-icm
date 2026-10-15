// Builds the marking sheets and the markers' rooms. Every answer appears once under its own
// random number, in an order shuffled from a seed that did not exist until the logs did. A few
// answers with a known grade are planted among them. A room holds a sheet, the rules and the
// documents, and nothing that names an arm.
//
//   node verify/sheet.mjs --name NAME

import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { option, runCli, sealedRunDir } from '../lib/cli.mjs';
import { ARM_DOCS_ONLY, ARM_FULL, FOLDER_DIR, LIBRARY_DIR, QUESTIONS_FILE, REPO, STAGE_ROOT } from '../lib/config.mjs';
import { loadQuestions } from '../lib/questions.mjs';
import { seededRandom, sha256, shuffle } from '../lib/rng.mjs';
import { loadRows } from './analyse.mjs';
import { MARKERS, OUTSIDE } from './marks.mjs';

const WORKING_FOLDER = '[working folder]';
const HEADLINE_ARMS = [ARM_FULL, ARM_DOCS_ONLY];
const REFUSAL = 'I could not find these rules in the folder I was given, so I cannot answer this.';
const PLANTS_PER_KIND = 2;

// The staging path ends in the arm code, so it is removed wherever an answer quotes it.
export function hideStaging(text, stageDir) {
  const escaped = stageDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\//g, '[\\\\/]+');
  return text.replace(new RegExp(escaped, 'gi'), WORKING_FOLDER);
}

// Anything on the sheet that would tell a marker the arm: a code, or a staging path.
export function sheetLeaks(sheet, key, manifest) {
  const leaks = [];
  for (const code of Object.keys(key.arms)) if (new RegExp(`\\b${code}\\b`).test(sheet)) leaks.push(`arm code ${code} appears on the sheet`);
  const root = manifest.stageRoot ?? STAGE_ROOT;
  if (sheet.toLowerCase().replace(/\\+/g, '/').includes(`${root.toLowerCase()}/`)) leaks.push('a staging path appears on the sheet');
  return leaks;
}

// Answers with a known grade: a refusal (insufficient), and the expected answer to a different
// question (incorrect). Their numbers are drawn from numbers no real answer uses.
export function plantAnswers(questions, taken, random) {
  const ids = Object.keys(questions);
  const free = shuffle(Array.from({ length: 9000 }, (_, i) => String(i + 1000)).filter((n) => !taken.has(n)), random);
  const plants = [];
  for (let i = 0; i < PLANTS_PER_KIND && ids.length > 1; i += 1) {
    const [asked, other] = shuffle(ids, random);
    plants.push({ number: free.pop(), question: asked, answer: REFUSAL, grade: 'insufficient' });
    plants.push({ number: free.pop(), question: asked, answer: questions[other].expected, grade: 'incorrect' });
  }
  return plants;
}

function entry(number, question, answer) {
  return [`## Answer ${number}`, '', `**Question:** ${question.prompt}`, '', `**Expected answer:** ${question.expected}`, '', `**Correct requires:** ${question.requires}`, '', '**The answer to mark:**', '', answer.trim(), ''];
}

// One sheet. `arms` limits it to answers from those arms; the planted answers are always in.
export function buildSheet(dir, { arms = null, questionsFile = QUESTIONS_FILE } = {}) {
  const key = JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8'));
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const questions = Object.fromEntries(loadQuestions(questionsFile).map((q) => [q.id, q]));
  const numberOf = Object.fromEntries(Object.entries(key.answers).map(([number, a]) => [`${a.code}|${a.run}|${a.question}`, number]));
  const random = seededRandom(sha256(readFileSync(join(dir, 'logs.sha256'), 'utf8')));
  const plants = plantAnswers(questions, new Set(Object.keys(key.answers)), random);
  const real = loadRows(dir).filter((r) => r.faults.length === 0 && (!arms || arms.includes(key.arms[r.code])))
    .map((r) => ({ number: numberOf[`${r.code}|${r.run}|${r.question}`], question: r.question, answer: hideStaging(r.answer, manifest.staged[r.code].dir) }));
  const all = shuffle([...real, ...plants], random);
  const sheet = ['# Marking sheet', '', `Answers: ${all.length}.`, '', ...all.flatMap((a) => entry(a.number, questions[a.question], a.answer))].join('\n');
  const leaks = sheetLeaks(sheet, key, manifest);
  if (leaks.length > 0) throw new Error(`The sheet would show the arm: ${leaks.join('; ')}.`);
  return { sheet, plants };
}

// One room per marker, outside the repo, holding only what a marker may see.
function buildRoom(name, marker, sheet) {
  const room = join(STAGE_ROOT, `marking-${name}-${marker}`);
  rmSync(room, { recursive: true, force: true });
  mkdirSync(room, { recursive: true });
  writeFileSync(join(room, 'sheet.md'), sheet);
  cpSync(join(REPO, 'MARKING.md'), join(room, 'MARKING.md'));
  cpSync(join(FOLDER_DIR, LIBRARY_DIR), join(room, LIBRARY_DIR), { recursive: true });
  return room.replace(/\\/g, '/');
}

function main() {
  const dir = sealedRunDir('Example: node verify/sheet.mjs --name NAME');
  const name = option('name');
  const full = buildSheet(dir);
  const outside = buildSheet(dir, { arms: HEADLINE_ARMS });
  writeFileSync(join(dir, 'marking-sheet.md'), full.sheet);
  writeFileSync(join(dir, `marking-sheet-${OUTSIDE}.md`), outside.sheet);
  // The planted answers' numbers and grades are kept back with the key.
  writeFileSync(join(dir, 'marking-key.csv'), `number,grade\n${full.plants.map((p) => `${p.number},${p.grade}`).join('\n')}\n`);
  const rooms = [...MARKERS.map((marker) => buildRoom(name, marker, full.sheet)), buildRoom(name, OUTSIDE, outside.sheet)];
  console.log(`Two sheets written: every answer (${full.sheet.split('\n## Answer ').length - 1}) for the two model passes, and the headline arms only (${outside.sheet.split('\n## Answer ').length - 1}) for a model from another maker. Rooms:\n${rooms.join('\n')}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(main);
