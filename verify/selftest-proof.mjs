// Self-test cases for the proof layer: what is kept out of git, the order of commits, the
// reveal, the generated results, the folder check and the leak scan.

import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { allArms, ARM_WRONG_MAP, armSpec, FOLDER_DIR, REPO } from '../lib/config.mjs';
import { charsFetched } from '../lib/session.mjs';
import { copyFolder, stageArm, wrongMap } from '../lib/stage.mjs';
import { reveal } from '../tools/reveal.mjs';
import { namedTables, loadRows } from './analyse.mjs';
import { checkRun } from './check.mjs';
import { writeRun } from './fixtures.mjs';
import { checkDocs } from './docs.mjs';
import { checkFolder } from './folder.mjs';
import { checkHistory } from './history.mjs';
import { leakPatterns, scanText } from './leaks.mjs';
import { correctnessSentences, predictionVerdict } from '../lib/stats.mjs';
import { blindingVerdict, correctCounts, guessCounts, guessLine, HEADER, parseMarks, rightByRun, rightSpread } from './marks.mjs';
import { verdictSentence, voidLines, wrongMapCaught } from './results.mjs';
import { splitFaults } from './scan.mjs';
import { buildSheet, sheetLeaks } from './sheet.mjs';

const KEPT_BACK = ['key.json', 'key-staged.json', 'probe.md', 'marking-key.csv'];
const COMMITTED = ['key.sha256', 'schedule.json', 'tables-coded.md', 'logs/AAAA/r1/Q1.jsonl'];
const ignored = (path) => spawnSync('git', ['-C', REPO, 'check-ignore', '-q', path]).status === 0;

function testKeptBack(record) {
  record('proof', 'the key, the staged-file list, the probe table and the marking key are kept out of git', KEPT_BACK.every((name) => ignored(`runs/any/${name}`)));
  record('proof', 'the fingerprint, schedule, coded tables and logs are not kept out', COMMITTED.every((name) => !ignored(`runs/any/${name}`)));
}

// Builds a scratch repo from a list of commits, each a list of [path, text] pairs.
function scratchRepo(dir, commits) {
  mkdirSync(dir, { recursive: true });
  const git = (...args) => spawnSync('git', ['-C', dir, '-c', 'user.name=Self Test', '-c', 'user.email=selftest@example.invalid', ...args], { encoding: 'utf8' });
  git('init', '-q', '-b', 'main');
  commits.forEach((files, i) => {
    for (const [path, text] of files) { mkdirSync(dirname(join(dir, path)), { recursive: true }); writeFileSync(join(dir, path), text); }
    git('add', '-A');
    git('commit', '-q', '-m', `commit ${i + 1}`);
  });
  return dir;
}

const QUESTIONS = [['questions.md', 'q']];
const FOLDER = ['README.md', 'identity.md', 'rules.md', 'examples.md'].map((name) => [name, 'f']);
const ANALYSER = [['verify/analyse.mjs', 'a'], ['lib/stats.mjs', 'l'], ['verify/results.mjs', 'r'], ['verify/scan.mjs', 's'], ['verify/marks.mjs', 'm']];
const FINGERPRINT = [['runs/r/key.sha256', 'h'], ['runs/r/schedule.json', 's']];
const LOGS = [['runs/r/logs/AAAA/r1/Q1.jsonl', 'log']];
const CODED = [['runs/r/tables-coded.md', 't']];
const KEY = [['runs/r/key.json', 'k']];
const RIGHT_ORDER = [QUESTIONS, [...FOLDER, ...ANALYSER], FINGERPRINT, LOGS, CODED, KEY];

const WRONG_ORDERS = [
  ['a folder file committed before the questions', [FOLDER, QUESTIONS, ANALYSER, FINGERPRINT, LOGS, CODED, KEY]],
  ['a run file committed before the questions', [[...FOLDER.slice(0, 0), ...ANALYSER], FINGERPRINT, LOGS, QUESTIONS, FOLDER, CODED, KEY]],
  ["logs committed before the key's fingerprint", [QUESTIONS, [...FOLDER, ...ANALYSER], LOGS, FINGERPRINT, CODED, KEY]],
  ['logs committed before the analyser', [QUESTIONS, FOLDER, FINGERPRINT, LOGS, ANALYSER, CODED, KEY]],
  ['the key committed with the logs', [QUESTIONS, [...FOLDER, ...ANALYSER], FINGERPRINT, [...LOGS, ...KEY], CODED]],
  ['the key committed before the coded tables', [QUESTIONS, [...FOLDER, ...ANALYSER], FINGERPRINT, LOGS, KEY, CODED]],
  ['the questions changed after their first commit', [...RIGHT_ORDER, [['questions.md', 'q changed']]]],
  ['a raw log changed after its first commit', [...RIGHT_ORDER, [['runs/r/logs/AAAA/r1/Q1.jsonl', 'log changed']]]],
  ['the analyser changed after the first log', [...RIGHT_ORDER, [['verify/analyse.mjs', 'a changed']]]],
  ['run instructions written after the run they describe', [QUESTIONS, [...FOLDER, ...ANALYSER], FINGERPRINT, LOGS, [['RUN.md', 'steps']], CODED, KEY]],
  ['the counting rule changed after the first log', [...RIGHT_ORDER, [['lib/stats.mjs', 'l changed']]]],
];

function testHistory(record, scratch) {
  const right = checkHistory(scratchRepo(join(scratch, 'history-right'), RIGHT_ORDER), 'r').failures;
  record('history', 'the right commit order passes', right.length === 0, right.join('; '));
  WRONG_ORDERS.forEach(([name, commits], i) => {
    const repo = scratchRepo(join(scratch, `history-wrong${i}`), commits);
    const failures = checkHistory(repo, 'r').failures;
    record('history', `catches ${name}`, failures.length > 0, failures[0] ?? '');
    if (i === 2) record('history', 'with no run named, every run is checked, so a bad order still fails', checkHistory(repo).failures.length > 0 && checkHistory(repo).runs.join() === 'r');
  });
  const page = [['EXPERIMENT.md', 'design']];
  record('history', 'a design page committed first passes', checkHistory(scratchRepo(join(scratch, 'history-page-first'), [page, ...RIGHT_ORDER]), 'r').failures.length === 0);
  record('history', 'catches a design page that was not the first commit', checkHistory(scratchRepo(join(scratch, 'history-page-late'), [QUESTIONS, page, ...RIGHT_ORDER.slice(1)]), 'r').failures.some((f) => f.includes('not the first commit')));
  record('history', 'catches a design page changed later', checkHistory(scratchRepo(join(scratch, 'history-page-edit'), [page, ...RIGHT_ORDER, [['EXPERIMENT.md', 'edited']]]), 'r').failures.some((f) => f.includes('changed after')));
  const fix = [['verify/analyse.mjs', 'a fixed']];
  const noted = checkHistory(scratchRepo(join(scratch, 'history-fix-noted'), [...RIGHT_ORDER, [...fix, ['DEVIATIONS.md', 'what was wrong, what the fix changed']]]), 'r').failures;
  record('history', 'a fix to the analysis after a run passes when the same commit records it as a deviation', noted.length === 0, noted.join('; '));
  const late = checkHistory(scratchRepo(join(scratch, 'history-fix-late'), [...RIGHT_ORDER, fix, [['DEVIATIONS.md', 'written afterwards']]]), 'r').failures;
  record('history', 'catches a fix whose deviation note came in a later commit', late.some((f) => f.includes('with no note')), late.join('; '));
  record('history', 'a run that is not in the history fails by name', checkHistory(join(scratch, 'history-right'), 'no-such-run').failures.length > 0);
}

function testReveal(record, scratch) {
  const unmarked = join(scratch, 'reveal-unmarked');
  writeRun(unmarked);
  let refusal = '';
  try { reveal(unmarked); } catch (error) { refusal = error.message; }
  record('reveal', 'a run that has not been marked cannot be revealed', refusal.includes('has not been marked'), refusal);
  const fresh = (name) => { const dir = join(scratch, name); writeRun(dir); reveal(dir, { unmarked: true }); return dir; };
  const clean = fresh('reveal-clean');
  const failures = checkRun(clean, { staged: false, questionsFile: join(clean, 'questions.md') });
  const transcriptText = readFileSync(join(clean, 'revealed', 'control', 'documents-only', 'Q01-run1.md'), 'utf8');
  record('reveal', 'the reveal files control and treatment transcripts and the checker accepts them', failures.length === 0 && transcriptText.includes('> Prompt for Q1') && transcriptText.includes('1. Read'), failures.join('; '));
  const tampers = [
    ['a revealed log that differs from the raw log', (dir) => appendFileSync(join(dir, 'revealed', 'control', 'empty', 'Q02-run1.jsonl'), '\n')],
    ['a readable transcript edited by hand', (dir) => appendFileSync(join(dir, 'revealed', 'control', 'documents-only', 'Q01-run1.md'), 'An extra line.\n')],
    ['results.md edited by hand', (dir) => { const p = join(dir, 'results.md'); writeFileSync(p, readFileSync(p, 'utf8').replace('Sessions: 4', 'Sessions: 5')); }],
    ['a named table edited by hand', (dir) => appendFileSync(join(dir, 'tables-named.md'), 'x')],
    ['the scan report edited by hand', (dir) => { const p = join(dir, 'scan.md'); writeFileSync(p, readFileSync(p, 'utf8').replace('fault: 0', 'fault: 1')); }],
    ['a file added among the transcripts that the reveal did not write', (dir) => writeFileSync(join(dir, 'revealed', 'control', 'empty', 'Q09-run1.md'), 'made up')],
    ['the questions changed after the run asked them', (dir) => appendFileSync(join(dir, 'questions.md'), '\nchanged')],
  ];
  tampers.forEach(([name, tamper], i) => {
    const dir = fresh(`reveal-tampered${i}`);
    tamper(dir);
    const found = checkRun(dir, { staged: false, questionsFile: join(dir, 'questions.md') });
    record('reveal', `catches ${name}`, found.length > 0, found[0] ?? '');
  });
  const perSet = namedTables(loadRows(clean), JSON.parse(readFileSync(join(clean, 'key.json'), 'utf8')), { Q1: 'first', Q2: 'second' });
  const marked = join(scratch, 'reveal-marked');
  writeRun(marked);
  const { sheet, plants } = buildSheet(marked, { questionsFile: join(marked, 'questions.md') });
  writeFileSync(join(marked, 'marking-sheet.md'), sheet);
  writeFileSync(join(marked, 'marking-key.csv'), `number,grade\n${plants.map((p) => `${p.number},${p.grade}`).join('\n')}\n`);
  const numbers = [...sheet.matchAll(/^## Answer (\d+)$/gm)].map((m) => m[1]);
  for (const marker of ['one', 'two']) writeFileSync(join(marked, `marks-${marker}.csv`), `${HEADER}\n${numbers.map((n) => `${n},correct,no,no,unsure`).join('\n')}\n`);
  reveal(marked, { root: true, repo: join(scratch, 'reveal-marked-repo') });
  const markedPage = readFileSync(join(scratch, 'reveal-marked-repo', 'results.md'), 'utf8');
  record('reveal', 'a marked run with planted answers on its sheet can be revealed', plants.length === 4 && markedPage.includes('## Correct answers, marked with the arm hidden') && markedPage.includes('planted answers'), `plants ${plants.length}`);
  const half = join(scratch, 'reveal-half');
  writeRun(half);
  reveal(half, { unmarked: true });
  rmSync(join(half, 'results.md'));
  record('reveal', 'catches a reveal that was started and never wrote its results page', checkRun(half, { staged: false }).some((f) => f.includes('never written')));
  const rooted = join(scratch, 'reveal-root');
  writeRun(rooted);
  reveal(rooted, { unmarked: true, root: true, repo: join(scratch, 'reveal-root-repo') });
  record('reveal', 'a reveal to the top of the repo files control/, treatment/ and results.md there', existsSync(join(scratch, 'reveal-root-repo', 'control', 'documents-only', 'Q01-run1.md')) && existsSync(join(scratch, 'reveal-root-repo', 'results.md')) && !existsSync(join(rooted, 'results.md')));
  const pageText = readFileSync(join(clean, 'results.md'), 'utf8');
  record('reveal', 'the results page says how it was run, what changed in the folder, and the limits', ['## Loading is the only switch', 'Folder on disk, nothing loaded', '## How this was run', 'its own fresh session', '## What we changed in the folder because of a control run', '## Limits'].every((part) => pageText.includes(part)));
  record('reveal', 'the results page shows what each arm could see, reading in one unit, every run, and changes to the analysis', ['## What each arm could see', 'Characters read in all', 'Steps in each run', 'compare what each arm read', '## Changes to the analysis after a run', 'Asked cold, with no folder and no documents', '## Can the test be trusted', '### Against itself', '### Against a folder made wrong on purpose', 'cannot be said until the answers are marked', 'Every session is told the date it runs on'].every((part) => pageText.includes(part)) && !pageText.includes('as steps'));
  const fetched = charsFetched([
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 'a', name: 'Read', input: {} }] } },
    { type: 'assistant', parent_tool_use_id: 'x', message: { content: [{ type: 'tool_use', id: 'b', name: 'Read', input: {} }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'a', content: [{ type: 'text', text: 'four' }] }, { type: 'tool_result', tool_use_id: 'b', content: 'not the main model' }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'a', content: 'six ch' }] } },
  ]);
  record('reveal', 'fetched characters count what the tools returned to the main model, as text or as parts', fetched === 10, `counted ${fetched}`);
  record('reveal', 'named tables report each document set', perSet.includes('- first:') && perSet.includes('- second:'));
}

// A word that names part of whichever library this repo holds, so the case does not depend on
// one library's folder names.
const libraryWord = readdirSync(join(FOLDER_DIR, 'reference'))[0];

function testFolder(record, scratch) {
  const real = checkFolder(FOLDER_DIR);
  record('folder', 'the folder under test passes the folder check', real.length === 0, real.join('; '));
  const spoils = [
    ['a file over its word limit', 'identity.md', (text) => `${text}\n${'word '.repeat(80)}`, 'limit'],
    ['a file that names another instruction file', 'rules.md', (text) => `${text}\nSee identity.md.`, 'stand alone'],
    ['a digit in the examples', 'examples.md', (text) => `${text}\nThe fee is 40.`, 'digit'],
    ['a library name in a general file', 'identity.md', (text) => `${text}\nAsk about the ${libraryWord}.`, 'from the library'],
  ];
  spoils.forEach(([name, file, change, expected], i) => {
    const copy = join(scratch, `folder${i}`);
    copyFolder(FOLDER_DIR, copy);
    writeFileSync(join(copy, file), change(readFileSync(join(copy, file), 'utf8')));
    const failures = checkFolder(copy);
    record('folder', `catches ${name}`, failures.some((f) => f.includes(expected)), failures.join('; '));
  });
  const extra = join(scratch, 'folder-extra');
  copyFolder(FOLDER_DIR, extra);
  writeFileSync(join(extra, 'answers.md'), 'the key, left in the folder');
  record('folder', 'catches a sixth file left in the folder', checkFolder(extra).some((f) => f.includes('exactly five')));
}

function testLeaks(record) {
  const patterns = leakPatterns({ user: 'alexsample', home: 'C:\\Users\\alexsample', host: 'DESKTOP-SAMPLE1' });
  const cases = [
    ['a user name', 'run by alexsample today', 'user name'],
    ['a home path as a log writes it', '{"cwd":"C:\\\\Users\\\\alexsample\\\\work"}', 'home folder'],
    ['an email address', 'contact a.person@example.org', 'email'],
    ['a cloud-drive folder', 'D:/OneDrive - Some Company/files', 'cloud-drive'],
    ['a machine name', 'host DESKTOP-SAMPLE1 answered', 'machine name'],
  ];
  for (const [name, text, expected] of cases) record('leaks', `catches ${name}`, scanText(text, patterns).some((kind) => kind.includes(expected)), scanText(text, patterns).join('; '));
  record('leaks', 'plain text and the tooling address are not flagged', scanText('{"cwd":"C:/tc/AAAA"} noreply@anthropic.com', patterns).length === 0, scanText('{"cwd":"C:/tc/AAAA"} noreply@anthropic.com', patterns).join('; '));
}

function testMarking(record) {
  const key = { arms: { AAAA: 'docs' } };
  const manifest = { stageRoot: 'C:/tc' };
  record('marking', 'a sheet that shows an arm code is refused', sheetLeaks('The answer came from AAAA.', key, manifest).length === 1);
  record('marking', 'a sheet that shows a staging path is refused', sheetLeaks('I read C:\\\\tc\\\\zzzz\\\\reference\\\\a.md', key, manifest).length === 1);
  record('marking', 'a clean sheet is accepted', sheetLeaks('The limit is ten (reference/set/doc.md).', key, manifest).length === 0);
  const header = HEADER;
  const cases = [
    ['an answer left unmarked', `${header}\n1001,correct,no,no`, 'not marked'],
    ['an answer marked twice', `${header}\n1001,correct,no,no,none\n1001,incorrect,no,no,none\n1002,correct,no,no,none`, 'twice'],
    ['a grade that is not one of the three', `${header}\n1001,mostly,no,no\n1002,correct,no,no`, 'not a valid mark'],
    ['a number that is not on the sheet', `${header}\n1001,correct,no,no,none\n1002,correct,no,no,none\n9999,correct,no,no,none`, 'not on the sheet'],
    ['a missing header', '1001,correct,no,no,none\n1002,correct,no,no,none', 'first line'],
  ];
  for (const [name, text, expected] of cases) record('marking', `catches ${name}`, parseMarks(text, ['1001', '1002']).failures.some((f) => f.includes(expected)));
  record('marking', 'a complete set of marks is accepted', parseMarks(`${header}\n1001,correct,no,no,loaded\n1002,insufficient,yes,no,unsure`, ['1001', '1002']).failures.length === 0);
  record('marking', 'a mark with no guess is refused', parseMarks(`${header}\n1001,correct,no,no\n1002,correct,no,no,none`, ['1001', '1002']).failures.some((f) => f.includes('not a valid mark')));
}

function testVoid(record) {
  const key = { arms: { AAAA: 'c1111', BBBB: 'docs', CCCC: 'empty' } };
  const row = (code, faults) => ({ code, faults });
  const clean = Array.from({ length: 19 }, () => row('AAAA', []));
  record('rule', 'one faulty session in twenty does not void a run', voidLines([...clean, row('BBBB', ['x'])], key).length === 0);
  record('rule', 'two faulty sessions in twenty void it', voidLines([...clean.slice(0, 18), row('BBBB', ['x']), row('AAAA', ['x'])], key).join(' ').includes('This run is void'));
  record('rule', 'faults outside the headline pair do not void it', voidLines([...clean, row('CCCC', ['x']), row('CCCC', ['x']), row('CCCC', ['x'])], key).length === 0);
}

function testCorrectness(record) {
  testVoid(record);
  const fewer = { lower: 9, higher: 1, equal: 0, missing: 0 };
  const unclear = { lower: 5, higher: 5, equal: 0, missing: 0 };
  const count = (one, two) => ({ total: 10, one, two });
  record('rule', 'the correctness sentence always follows the headline', correctnessSentences(fewer, count(10, 10), count(10, 10)).length === 1);
  record('rule', 'fewer steps with fewer right answers by both markers adds the warning sentence', correctnessSentences(fewer, count(7, 8), count(10, 10)).length === 2);
  record('rule', 'one marker alone counting fewer right answers does not add it', correctnessSentences(fewer, count(9, 10), count(10, 10)).length === 1);
  record('rule', 'it is not added when steps did not clearly fall', correctnessSentences(unclear, count(7, 7), count(10, 10)).length === 1);
  record('rule', 'more right answers by both passes is said, whatever the steps did', correctnessSentences(unclear, count(10, 10), count(7, 8))[1]?.includes('more right answers') && correctnessSentences(unclear, count(10, 8), count(7, 8)).length === 1);
  record('marking', 'a marker from another maker is named as one', correctnessSentences(fewer, count(10, 10), count(10, 10), { full: 9, docs: 10 })[1].includes('another maker, also with the arm hidden, marked the same answers: 9 of 10 and 10 of 10'));
  const runKey = { arms: { AAAA: 'c1111', BBBB: 'docs' }, answers: { 1: { code: 'AAAA', run: 1 }, 2: { code: 'AAAA', run: 2 }, 3: { code: 'BBBB', run: 1 }, 4: { code: 'BBBB', run: 2 } } };
  const both = (grades) => Object.fromEntries(grades.map((grade, i) => [i + 1, { grade }]));
  const runMarks = { one: both(['correct', 'incorrect', 'correct', 'correct']), two: both(['correct', 'correct', 'correct', 'correct']) };
  record('marking', 'right answers are counted run by run, and the widest move between runs of one arm is stated', rightByRun(runKey, runMarks, 'c1111')[1].one === 0 && rightSpread(runKey, runMarks).includes('moved by as much as 1 in a run'), rightSpread(runKey, runMarks));
  const key = { arms: { AAAA: 'c1111', BBBB: 'docs' }, answers: { 1: { code: 'AAAA' }, 2: { code: 'AAAA' }, 3: { code: 'BBBB' } } };
  const mark = (grade, guess = 'unsure') => ({ grade, unsupported: 'no', unsettled: 'no', guess });
  const marks = { numbers: ['1', '2', '3'], one: { 1: mark('correct', 'loaded'), 2: mark('incorrect', 'none'), 3: mark('correct', 'none'), 9: mark('insufficient') }, two: { 1: mark('correct'), 2: mark('correct'), 3: mark('correct') }, outside: null };
  record('marking', 'guesses are scored against whether instructions were loaded, and a planted answer is left out', guessLine(key, marks.one, 'one').includes('guessed on 3 answers and was right on 2'), guessLine(key, marks.one, 'one'));
  const guessKey = { arms: { AAAA: 'c1111', BBBB: 'docs', CCCC: 'c1000' }, answers: Object.fromEntries(Array.from({ length: 30 }, (_, i) => [i, { code: ['AAAA', 'BBBB', 'CCCC'][i % 3] }])) };
  const guesses = (pick) => Object.fromEntries(Object.keys(guessKey.answers).map((n) => [n, mark('correct', pick(guessKey.answers[n].code))]));
  record('marking', 'guesses are scored on the two headline arms only', guessCounts(guessKey, guesses(() => 'loaded')).made === 20 && guessCounts(guessKey, guesses(() => 'loaded')).right === 10);
  record('marking', 'a marker who always says loaded cannot tell the arms apart', blindingVerdict(guessKey, [guesses(() => 'loaded')]).includes('blinding held'));
  record('marking', 'a marker who is always wrong can tell the arms apart', blindingVerdict(guessKey, [guesses((code) => (code === 'AAAA' ? 'none' : 'loaded'))]).includes('not blind in effect'));
  record('marking', 'no guesses gives no verdict on blinding', blindingVerdict(guessKey, [guesses(() => 'unsure')]).includes('say nothing'));
  const fewKey = { arms: guessKey.arms, answers: Object.fromEntries(Object.entries(guessKey.answers).slice(0, 9)) };
  const allWrong = Object.fromEntries(Object.keys(fewKey.answers).map((n) => [n, mark('correct', fewKey.answers[n].code === 'AAAA' ? 'none' : 'loaded')]));
  record('marking', 'six guesses, all wrong, are too few for a verdict on blinding', blindingVerdict(fewKey, [allWrong]).includes('say nothing'), blindingVerdict(fewKey, [allWrong]));
  record('rule', 'ten ties do not show a prediction wrong', predictionVerdict({ lower: 0, higher: 0, equal: 10 }) === 'not shown either way' && predictionVerdict({ lower: 0, higher: 9, equal: 1 }) === 'shown wrong');
  const full = correctCounts(key, marks, 'c1111');
  record('marking', 'correct answers are counted per arm and per marker', full.total === 2 && full.one === 1 && full.two === 2 && correctCounts(key, marks, 'docs').one === 1);
}

function testDocs(record, scratch) {
  const repo = join(scratch, 'docs');
  mkdirSync(repo, { recursive: true });
  writeFileSync(join(repo, 'EXPERIMENT.md'), 'Fewer on 9 or 10 questions.');
  writeFileSync(join(repo, 'PREREGISTRATION.md'), 'More than 5% voids it. Tried again, up to three\nattempts.');
  record('docs', 'pages that state the numbers of the rule as the code has them pass', checkDocs(repo).length === 0, checkDocs(repo).join('; '));
  writeFileSync(join(repo, 'EXPERIMENT.md'), 'Fewer on 8 or more questions.');
  record('docs', 'catches a page whose stated number has drifted from the code', checkDocs(repo).some((f) => f.includes('EXPERIMENT.md')));
}

// The checks on the test itself: a verdict fixed in advance, and a folder made wrong on purpose.
function testTrust(record, scratch) {
  const counts = (fullOne, fullTwo) => ({ full: { one: fullOne, two: fullTwo }, docs: { one: 10, two: 10 } });
  record('rule', 'the folder earns its place only when steps fall, answers hold and text does not rise', verdictSentence('fewer', { full: 90, docs: 100 }, counts(10, 10)).includes('earned its place: steps fell'));
  record('rule', 'more text with the folder means it did not earn its place', verdictSentence('fewer', { full: 110, docs: 100 }, counts(10, 10)).includes('did not earn its place: the model was given more text'));
  record('rule', 'one marking pass counting fewer right answers means it did not earn its place', verdictSentence('fewer', { full: 90, docs: 100 }, counts(10, 9)).includes('fewer right answers'));
  record('rule', 'no clear fall in steps means it did not earn its place', verdictSentence('unclear', { full: 90, docs: 100 }, counts(10, 10)).includes('steps did not clearly fall'));
  record('rule', 'no verdict is given before the answers are marked', verdictSentence('fewer', { full: 90, docs: 100 }, null).includes('cannot be said'));
  record('rule', 'steps that did not clearly fall, with nothing seen to fail, is "could not tell" and not a failure', verdictSentence('unclear', { full: 90, docs: 100 }, counts(10, 10)).includes('could not tell') && verdictSentence('more', { full: 90, docs: 100 }, counts(10, 10)).includes('did not earn its place: steps clearly rose'));
  const withOutside = { full: { one: 10, two: 10, outside: 9 }, docs: { one: 10, two: 10, outside: 10 } };
  record('rule', 'fewer right answers by the marker from another maker alone fails the folder', verdictSentence('fewer', { full: 90, docs: 100 }, withOutside).includes('fewer right answers'));
  const split = splitFaults(['a tool call was refused', 'at the turn limit', 'model is x, expected y', 'log is missing']);
  record('scan', 'what the model did is flagged and kept; a fault in the set-up is left out', split.flags.length === 2 && split.faults.join() === 'model is x, expected y,log is missing');
  const map = ['# Map', '', '## One', '', '- a.md: first.', '- b.md: second.', '- c.md: third.', '', '## Two', '', '- d.md: fourth.', '- e.md: fifth.', ''].join('\n');
  const turned = ['# Map', '', '## One', '', '- a.md: second.', '- b.md: third.', '- c.md: first.', '', '## Two', '', '- d.md: fifth.', '- e.md: fourth.', ''].join('\n');
  record('arm', 'the wrong map gives each document the next entry in its own set and keeps every path', wrongMap(map) === turned, wrongMap(map));
  const staged = stageArm(join(scratch, 'wrongmap-arm'), ARM_WRONG_MAP);
  const true_ = stageArm(join(scratch, 'truemap-arm'), 'c1111');
  const sameBut = Object.keys(staged.files).filter((f) => staged.files[f] !== true_.files[f]);
  record('arm', 'the known-bad arm differs from the full folder in its map and nothing else', sameBut.join() === 'README.md' && staged.switchFile === true_.switchFile && armSpec(ARM_WRONG_MAP).loaded.length === 4, sameBut.join());
  record('arm', 'the known-bad arm is scheduled with the other eighteen', allArms().length === 19 && allArms().includes(ARM_WRONG_MAP));
  const steps = (higher, lower) => ({ lower, higher, equal: 10 - higher - lower, missing: 0 });
  record('rule', 'a wrong map is caught only at more steps on 9 or 10 questions', wrongMapCaught(steps(9, 1)) && !wrongMapCaught(steps(7, 2)));
  record('rule', 'a wrong map that reaches fewer right answers is caught whatever the steps', wrongMapCaught(steps(5, 5), { one: 8, two: 9 }, { one: 10, two: 10 }) && !wrongMapCaught(steps(5, 5), { one: 10, two: 10 }, { one: 10, two: 10 }));
  record('rule', 'one marking pass alone counting fewer right answers does not catch a wrong map', !wrongMapCaught(steps(8, 1), { one: 25, two: 27 }, { one: 28, two: 23 }));
}

export function proofCases(record, scratch) {
  testTrust(record, scratch);
  testDocs(record, scratch);
  testCorrectness(record);
  testMarking(record);
  testKeptBack(record);
  testHistory(record, scratch);
  testReveal(record, scratch);
  testFolder(record, scratch);
  testLeaks(record);
}
