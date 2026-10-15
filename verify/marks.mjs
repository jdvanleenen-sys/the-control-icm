// Reads the markers' files and checks they are complete. Before the key is revealed this
// reports only how often the two model markers agree. After it, the results page uses the same
// marks to count correct answers per arm, to test whether the markers could tell the arms
// apart, and to see whether they caught the planted answers.
//
//   node verify/marks.mjs --name NAME

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli, sealedRunDir } from '../lib/cli.mjs';
import { ARM_DOCS_ONLY, ARM_EMPTY, ARM_FULL, armLabel, armSpec, GUESS_MIN, GUESS_TELLS_AT } from '../lib/config.mjs';

// The two model markers. A model from another maker may also mark the headline arms; that
// file is optional.
export const MARKERS = ['one', 'two'];
export const OUTSIDE = 'outside';
const GRADES = ['correct', 'incorrect', 'insufficient'];
const YES_NO = ['yes', 'no'];
const GUESSES = ['loaded', 'none', 'unsure'];
export const HEADER = 'number,grade,unsupported,unsettled,guess';
const NAMED_FIRST = [ARM_FULL, ARM_DOCS_ONLY, ARM_EMPTY];

// Reads one marker's file. Any line that is not a complete, valid mark is a failure.
export function parseMarks(text, expectedNumbers) {
  const lines = text.replace(/\r/g, '').split('\n').filter((line) => line.trim() !== '');
  const failures = [];
  if (lines[0] !== HEADER) failures.push(`first line is not "${HEADER}"`);
  const marks = {};
  for (const line of lines.slice(1)) {
    const [number, grade, unsupported, unsettled, guess] = line.split(',').map((cell) => cell.trim());
    if (!GRADES.includes(grade) || !YES_NO.includes(unsupported) || !YES_NO.includes(unsettled) || !GUESSES.includes(guess)) { failures.push(`not a valid mark: ${line}`); continue; }
    if (number in marks) failures.push(`answer ${number} is marked twice`);
    marks[number] = { grade, unsupported, unsettled, guess };
  }
  for (const number of expectedNumbers) if (!(number in marks)) failures.push(`answer ${number} is not marked`);
  for (const number of Object.keys(marks)) if (!expectedNumbers.includes(number)) failures.push(`answer ${number} is not on the sheet`);
  return { marks, failures };
}

export const marksPresent = (dir) => MARKERS.every((marker) => existsSync(join(dir, `marks-${marker}.csv`)));
const sheetNumbers = (path) => [...readFileSync(path, 'utf8').matchAll(/^## Answer (\d+)$/gm)].map((m) => m[1]);

function readMarker(dir, marker, numbers) {
  const parsed = parseMarks(readFileSync(join(dir, `marks-${marker}.csv`), 'utf8'), numbers);
  if (parsed.failures.length > 0) throw new Error(`Marker ${marker}'s marks are not complete:\n${parsed.failures.map((f) => `- ${f}`).join('\n')}`);
  return parsed.marks;
}

// Every marker's marks for a run, checked against the sheet each one was given.
export function loadMarks(dir) {
  const numbers = sheetNumbers(join(dir, 'marking-sheet.md'));
  const marks = { numbers, one: readMarker(dir, 'one', numbers), two: readMarker(dir, 'two', numbers), outside: null };
  if (existsSync(join(dir, `marks-${OUTSIDE}.csv`))) marks.outside = readMarker(dir, OUTSIDE, sheetNumbers(join(dir, `marking-sheet-${OUTSIDE}.md`)));
  return marks;
}

export function agreement({ numbers, one, two }) {
  const same = (field) => numbers.filter((n) => one[n][field] === two[n][field]).length;
  return { total: numbers.length, grade: same('grade'), unsupported: same('unsupported') };
}

// The marked answers that came from one arm. Planted answers belong to no arm.
const armNumbers = (key, set, arm) => Object.keys(set).filter((n) => n in key.answers && key.arms[key.answers[n].code] === arm);
const rightIn = (set, numbers) => numbers.filter((n) => set[n].grade === 'correct').length;

// How many of an arm's marked answers each marker graded correct.
export function correctCounts(key, marks, arm) {
  const count = (set) => rightIn(set, armNumbers(key, set, arm));
  return { total: armNumbers(key, marks.one, arm).length, one: count(marks.one), two: count(marks.two), outside: marks.outside ? count(marks.outside) : null };
}

// Right answers in each run of one arm, by each model marker.
export function rightByRun(key, marks, arm) {
  const mine = armNumbers(key, marks.one, arm);
  const runs = [...new Set(mine.map((n) => key.answers[n].run))].sort((a, b) => a - b);
  return runs.map((run) => {
    const numbers = mine.filter((n) => key.answers[n].run === run);
    return { run, total: numbers.length, one: rightIn(marks.one, numbers), two: rightIn(marks.two, numbers) };
  });
}

// The test against itself, on right answers. Runs of one arm differ only by chance, so how far
// the count moves between them is how far it can move between two arms for no reason.
export function rightSpread(key, marks) {
  const lines = ['| Arm | Run | Answers | Correct, marker one | Correct, marker two |', '|---|---|---|---|---|'];
  let widest = 0;
  for (const [arm, label] of [[ARM_DOCS_ONLY, 'Documents only'], [ARM_FULL, 'Folder loaded first']]) {
    const runs = rightByRun(key, marks, arm);
    if (runs.length < 2) return 'This run asked each question once in each arm, so the count of right answers cannot be compared between runs.';
    for (const r of runs) lines.push(`| ${label} | ${r.run} | ${r.total} | ${r.one} | ${r.two} |`);
    for (const marker of MARKERS) widest = Math.max(widest, Math.max(...runs.map((r) => r[marker])) - Math.min(...runs.map((r) => r[marker])));
  }
  const moved = widest === 0 ? 'did not move' : `moved by as much as ${widest} in a run`;
  return `${lines.join('\n')}\n\nBetween runs of one arm the count of right answers ${moved}. Read any gap between the two arms against that.`;
}

function countsFor(numbers, set) {
  const count = (test) => numbers.filter((n) => test(set[n])).length;
  return [...GRADES.map((g) => count((m) => m.grade === g)), count((m) => m.unsupported === 'yes'), count((m) => m.unsettled === 'yes')];
}

// Could a marker tell whether instructions were loaded? Scored on the two arms the headline
// compares, where half the answers had the folder loaded and half had nothing, so a marker who
// cannot tell is right about half the time. Across all arms most have something loaded, and
// half would be the wrong yardstick.
const GUESS_ARMS = [ARM_FULL, ARM_DOCS_ONLY];

export function guessCounts(key, set) {
  const made = Object.keys(set).filter((n) => n in key.answers && GUESS_ARMS.includes(key.arms[key.answers[n].code]) && set[n].guess !== 'unsure');
  const right = made.filter((n) => (armSpec(key.arms[key.answers[n].code]).loaded.length > 0) === (set[n].guess === 'loaded')).length;
  return { made: made.length, right };
}

export function guessLine(key, set, label) {
  const { made, right } = guessCounts(key, set);
  return `- Marker ${label} guessed on ${made} answers and was right on ${right}.`;
}

// A marker who is nearly always wrong can tell the arms apart as surely as one who is nearly
// always right: the answers differ, and only the label is backwards.
export function guessTells({ made, right }) {
  return made >= GUESS_MIN && (right / made >= GUESS_TELLS_AT || right / made <= 1 - GUESS_TELLS_AT);
}

// The plain conclusion from the guesses, so a reader does not have to draw it.
export function blindingVerdict(key, sets) {
  const counts = sets.map((set) => guessCounts(key, set));
  if (counts.every((c) => c.made < GUESS_MIN)) return `No marker made as many as ${GUESS_MIN} guesses on these answers, so the guesses say nothing about whether the arms could be told apart.`;
  return counts.some(guessTells)
    ? 'A marker could tell the arms apart from the answers alone. The marking was coded and shuffled, but it was not blind in effect. Read the counts of correct answers with that in mind.'
    : 'No marker could tell the arms apart well enough to matter. The blinding held.';
}

// Planted answers have a known grade. A marker that misses them is not reading closely.
export function plantLine(dir, set, label) {
  const path = join(dir, 'marking-key.csv');
  if (!existsSync(path)) return null;
  const plants = readFileSync(path, 'utf8').trim().split('\n').slice(1).map((line) => line.split(','));
  const present = plants.filter(([number]) => number in set);
  return `- Marker ${label} gave the known grade to ${present.filter(([number, grade]) => set[number].grade === grade).length} of ${present.length} planted answers.`;
}

export function marksSection(dir, key, marks) {
  const agreed = agreement(marks);
  const markers = [...MARKERS, ...(marks.outside ? [OUTSIDE] : [])];
  const lines = [
    '## Correct answers, marked with the arm hidden', '',
    `The same model marked ${agreed.total} answers twice without seeing the arm (the answers from every clean session, plus a few planted ones with a known grade). The two passes gave the same grade on ${agreed.grade} and the same unsupported-statement mark on ${agreed.unsupported}. That is one marker repeated, not two opinions.${marks.outside ? ' A model from another maker also marked the answers from the two arms the headline compares.' : ' No model from another maker has marked these answers.'}`, '',
    '| Arm | Marker | Answers | Correct | Incorrect | Insufficient | Unsupported statements | Unsettled |', '|---|---|---|---|---|---|---|---|',
  ];
  const rank = (arm) => (NAMED_FIRST.includes(arm) ? NAMED_FIRST.indexOf(arm) : NAMED_FIRST.length);
  const arms = [...new Set(Object.values(key.arms))].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  for (const arm of arms) {
    for (const marker of markers) {
      const mine = armNumbers(key, marks[marker], arm);
      if (mine.length > 0) lines.push(`| ${armLabel(arm)} | ${marker} | ${mine.length} | ${countsFor(mine, marks[marker]).join(' | ')} |`);
    }
  }
  lines.push('', 'Each marker was also asked to guess, for every answer, whether instructions had been loaded. The guesses are scored on the two arms the headline compares, where half the answers had the folder loaded. Right about half the time means the marker could not tell the arms apart; nearly always right or nearly always wrong means the marker could.', '', ...markers.map((marker) => guessLine(key, marks[marker], marker)), '', blindingVerdict(key, markers.map((marker) => marks[marker])));
  const plants = markers.map((marker) => plantLine(dir, marks[marker], marker)).filter(Boolean);
  if (plants.length > 0) lines.push('', 'A few answers with a known grade were planted on each sheet.', '', ...plants);
  return `${lines.join('\n')}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(() => {
    const dir = sealedRunDir('Example: node verify/marks.mjs --name NAME');
    if (!marksPresent(dir)) throw new Error(`Copy each marker's marks.csv to ${MARKERS.map((m) => `marks-${m}.csv`).join(' and ')} in the run's folder first.`);
    const marks = loadMarks(dir);
    const agreed = agreement(marks);
    console.log(`Marks are complete: ${agreed.total} answers, each marked twice. Same grade on ${agreed.grade}; same unsupported-statement mark on ${agreed.unsupported}.${marks.outside ? ' The outside marker\'s marks are present too.' : ''}`);
  });
}
