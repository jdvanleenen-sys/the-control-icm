// Builds every table from the raw logs. Step one uses arm codes only. Step two (--key) names
// the arms and selects the pre-written sentence. Nothing is typed by hand.
//
//   node verify/analyse.mjs --name pass1          coded tables
//   node verify/analyse.mjs --name pass1 --key    coded tables, then named tables

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARM_DOCS_ONLY, ARM_EMPTY, ARM_FULL, ARM_NONE, INSTRUCTION_FILES, QUESTIONS_FILE, runDir } from '../lib/config.mjs';
import { parseQuestions } from '../lib/questions.mjs';
import { parseLog, summarise } from '../lib/session.mjs';
import { compareByQuestion, fixed, headlineSentence, mean, predictionVerdict } from '../lib/stats.mjs';
import { logPath, scanRun } from './scan.mjs';

export const MEASURES = [
  ['steps', 'Steps'], ['opens', 'Opens'], ['documentsOpened', 'Documents opened'], ['searches', 'Searches'],
  ['listings', 'Listings'], ['tokensIn', 'Tokens in'], ['tokensOut', 'Tokens out'], ['seconds', 'Seconds'], ['words', 'Answer words'],
];
const PREDICTIONS = { 'README.md': 'steps', 'rules.md': 'words' };
const CELL = /^c[01]{4}$/;
const VERDICT_WORDS = { lower: 'fewer', higher: 'more', equal: 'the same', missing: 'no clean session' };
export const byQuestionId = (a, b) => a.localeCompare(b, 'en', { numeric: true });

// One row per session that has a log, with its faults attached. Faulty sessions are listed
// but never averaged.
export function loadRows(dir) {
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  return scanRun(dir).filter((s) => !s.faults.includes('log is missing')).map((s) => {
    const { events } = parseLog(readFileSync(logPath(dir, s), 'utf8'));
    return { ...summarise(events, { ...s, stageDir: manifest.staged[s.code].dir }), faults: s.faults, flags: s.flags, usageWarning: s.usageWarning };
  });
}

// Which document set each question belongs to, read from the question file's "Set:" field.
export function questionSets(path = QUESTIONS_FILE) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(parseQuestions(readFileSync(path, 'utf8')).filter((q) => q.set).map((q) => [q.id, q.set.split(/\s/)[0]]));
}

export const clean = (rows) => rows.filter((r) => r.faults.length === 0);
export const questionsOf = (rows) => [...new Set(rows.map((r) => r.question))].sort(byQuestionId);
const cleanMean = (rows, key) => fixed(mean(clean(rows).map((r) => r[key]).filter((n) => n !== null)));

function perCodeTable(rows) {
  const lines = [`| Code | Sessions | Clean | ${MEASURES.map(([, label]) => label).join(' | ')} | Refused calls | Usage warnings |`, `|---|---|---|${MEASURES.map(() => '---').join('|')}|---|---|`];
  for (const code of [...new Set(rows.map((r) => r.code))].sort()) {
    const all = rows.filter((r) => r.code === code);
    lines.push(`| ${code} | ${all.length} | ${clean(all).length} | ${MEASURES.map(([key]) => cleanMean(all, key)).join(' | ')} | ${all.reduce((n, r) => n + r.refused, 0)} | ${all.filter((r) => r.usageWarning).length} |`);
  }
  return lines.join('\n');
}

function perQuestionTable(rows) {
  const codes = [...new Set(rows.map((r) => r.code))].sort();
  const lines = [`| Question | ${codes.join(' | ')} |`, `|---|${codes.map(() => '---').join('|')}|`];
  for (const question of questionsOf(rows)) {
    lines.push(`| ${question} | ${codes.map((code) => cleanMean(rows.filter((r) => r.code === code && r.question === question), 'steps')).join(' | ')} |`);
  }
  return lines.join('\n');
}

export function codedTables(rows) {
  return [
    '# Coded tables', '', 'Arms appear as codes. Means are over clean sessions only.', '',
    '## Per arm code', '', perCodeTable(rows), '',
    '## Mean steps per question', '', perQuestionTable(rows), '',
  ].join('\n');
}

export const armRows = (rows, key, arm) => clean(rows).filter((r) => key.arms[r.code] === arm);
export const headlineTally = (rows, key, questions = questionsOf(rows)) => compareByQuestion(questions, armRows(rows, key, ARM_FULL), armRows(rows, key, ARM_DOCS_ONLY), 'steps');

function effectRows(rows, key) {
  const cells = clean(rows).filter((r) => CELL.test(key.arms[r.code]));
  const questions = questionsOf(rows);
  return INSTRUCTION_FILES.map((file, i) => {
    const on = cells.filter((r) => key.arms[r.code][i + 1] === '1');
    const off = cells.filter((r) => key.arms[r.code][i + 1] === '0');
    const steps = compareByQuestion(questions, on, off, 'steps');
    const words = compareByQuestion(questions, on, off, 'words');
    const predicted = PREDICTIONS[file];
    const verdict = predicted ? `${predicted === 'steps' ? 'fewer steps' : 'shorter answers'}: ${predictionVerdict(predicted === 'steps' ? steps : words)}` : 'no prediction; shown, not claimed';
    const openedAnyway = off.filter((r) => r.instructionOpened.includes(file)).length;
    const stepsOf = (arm) => fixed(mean(armRows(rows, key, arm).map((r) => r.steps)));
    const flip = (arm, to) => `c${[...arm.slice(1)].map((bit, at) => (at === i ? to : bit)).join('')}`;
    const alone = `${stepsOf(flip(ARM_NONE, '1'))} against ${stepsOf(ARM_NONE)}`;
    const withoutIt = `${stepsOf(ARM_FULL)} against ${stepsOf(flip(ARM_FULL, '0'))}`;
    return `| ${file} | ${fixed(steps.meanA)} | ${fixed(steps.meanB)} | ${steps.lower} | ${alone} | ${withoutIt} | ${fixed(words.meanA)} | ${fixed(words.meanB)} | ${words.lower} | ${openedAnyway} of ${off.length} | ${verdict} |`;
  });
}

function gridTable(rows, key) {
  const label = (a, b) => [a && 'README', b && 'rules'].filter(Boolean).join(' + ') || 'neither';
  const lines = ['| README, rules \\ identity, examples | neither | identity | examples | both |', '|---|---|---|---|---|'];
  for (const [readme, rules] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
    const cells = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([identity, examples]) => fixed(mean(armRows(rows, key, `c${readme}${identity}${rules}${examples}`).map((r) => r.steps))));
    lines.push(`| ${label(readme, rules)} | ${cells.join(' | ')} |`);
  }
  return lines.join('\n');
}

function pairTable(tally) {
  const lines = ['| Question | Full package | Documents only | Folder took |', '|---|---|---|---|'];
  for (const q of tally.perQuestion) lines.push(`| ${q.question} | ${fixed(q.a)} | ${fixed(q.b)} | ${VERDICT_WORDS[q.verdict]} |`);
  return lines.join('\n');
}

// The headline pair compared inside each document set, one tally per set.
export function setTallies(rows, key, sets = questionSets()) {
  const names = [...new Set(Object.values(sets))].sort();
  return names.map((name) => ({ name, ...headlineTally(rows, key, questionsOf(rows).filter((q) => sets[q] === name)) }));
}

function perSetLines(rows, key, sets) {
  return setTallies(rows, key, sets).map((tally) => {
    const { name } = tally;
    return `- ${name}: fewer on ${tally.lower} of ${tally.perQuestion.length} questions, more on ${tally.higher}, the same on ${tally.equal}.`;
  });
}

// The headline pair question by question, then per document set, then the cold arm.
export function pairSection(rows, key, sets = questionSets()) {
  const perSet = perSetLines(rows, key, sets);
  return [
    pairTable(headlineTally(rows, key)), '',
    ...(perSet.length > 0 ? ['Per document set, full package against documents only, on steps:', '', ...perSet, ''] : []),
    `Empty arm, mean steps: ${fixed(mean(armRows(rows, key, ARM_EMPTY).map((r) => r.steps)))}.`, '',
  ];
}

// Every mix of the four instruction files. The results page carries this as an appendix.
export function switchSection(rows, key) {
  return [
    '## Mean steps in the sixteen switch arms', '', gridTable(rows, key), '',
    '## Each file: the eight arms with it loaded against the eight without', '',
    'Each figure is an average across every mix of the other three files, not the effect of the file alone. Two more readings sit beside it: the file loaded alone against nothing loaded, and the full package against the full package without that file. A file that is not loaded is still on disk. Only the two predictions are tested; the other rows are shown and not claimed.', '',
    '| File | Steps, loaded | Steps, not loaded | Questions with fewer steps | Alone, against none loaded | Full, against full without it | Words, loaded | Words, not loaded | Questions with fewer words | Opened anyway when not loaded | Prediction |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    ...effectRows(rows, key), '',
  ];
}

export function namedTables(rows, key, sets = questionSets()) {
  return [
    '# Named tables', '', '## Headline', '', headlineSentence(headlineTally(rows, key)), '',
    ...pairSection(rows, key, sets), ...switchSection(rows, key),
  ].join('\n');
}

function main() {
  const dir = runDir(process.argv[process.argv.indexOf('--name') + 1]);
  const rows = loadRows(dir);
  writeFileSync(join(dir, 'tables-coded.md'), codedTables(rows));
  console.log(`tables-coded.md written from ${rows.length} session logs`);
  if (!process.argv.includes('--key')) return;
  const named = namedTables(rows, JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8')));
  writeFileSync(join(dir, 'tables-named.md'), named);
  console.log(named.split('\n')[4]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
