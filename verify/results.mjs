// Generates results.md from the logs, the marks and the key. Every figure and every sentence
// that reports the run is produced here; the checker rebuilds the page and fails if a character
// differs. Two files written by people are included word for word: what changed in the folder,
// and the limits.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ARM_DOCS_ONLY, ARM_EMPTY, ARM_FULL, ARM_NONE, ARM_WRONG_MAP, armSpec, FAULT_LIMIT, REPO, SELF_COMPARISON_LIMIT } from '../lib/config.mjs';
import { compareByQuestion, correctnessSentences, fixed, headlineSentence, mean, outcome } from '../lib/stats.mjs';
import { armRows, headlineTally, loadRows, pairSection, questionsOf, switchSection } from './analyse.mjs';
import { correctCounts, loadMarks, MARKERS, marksPresent, marksSection, rightSpread } from './marks.mjs';

const NOT_MARKED = 'Not marked. Nothing on this page says whether any answer is right; fewer steps is not the same as a right answer.';
const FOLDER_CHANGES = join(REPO, 'folder-changes.md');
const LIMITS = join(REPO, 'limits.md');
const DEVIATIONS = join(REPO, 'DEVIATIONS.md');
// The brief's own method, done by hand in a chat product: a page written by a person, included
// word for word. It has no steps to count, so its figures never mix with the ones built here.
const PROJECT_RUN = join(REPO, 'claude-project.md');
const ARMS = [[ARM_FULL, 'Full package'], [ARM_DOCS_ONLY, 'Documents only'], [ARM_EMPTY, 'Empty']];
// Measures where a higher number is a cost. Each is checked for ties and losses.
const COST_MEASURES = [['steps', 'steps'], ['documentsOpened', 'documents opened'], ['tokensIn', 'input tokens'], ['tokensOut', 'output tokens'], ['seconds', 'seconds'], ['words', 'answer words']];

// The answer numbers of one arm's answers to one question.
// Planted answers are on the sheet but belong to no arm, so they are skipped here.
const answersFor = (key, marks, arm, question) => marks.numbers.filter((n) => n in key.answers && key.arms[key.answers[n].code] === arm && key.answers[n].question === question);
const rightCount = (set, numbers) => numbers.filter((n) => set[n].grade === 'correct').length;

// How many of one arm's answers to one question each marker graded correct: "2 of 3 / 3 of 3".
function correctCell(key, marks, arm, question) {
  if (!marks) return 'not marked';
  const mine = answersFor(key, marks, arm, question);
  return MARKERS.map((marker) => `${rightCount(marks[marker], mine)} of ${mine.length}`).join(' / ');
}

function threeArmTable(rows, key, marks) {
  const lines = ['| Question | Arm | Steps | Steps in each run | Documents opened | Searches | Tokens in | Tokens out | Seconds | Answer words | Correct (marker one / two) |', '|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const question of questionsOf(rows)) {
    for (const [arm, label] of ARMS) {
      const group = armRows(rows, key, arm).filter((r) => r.question === question).sort((a, b) => a.run - b.run);
      const cell = (measure) => fixed(mean(group.map((r) => r[measure]).filter((n) => n !== null)));
      lines.push(`| ${question} | ${label} | ${cell('steps')} | ${group.map((r) => r.steps).join(', ') || 'none clean'} | ${cell('documentsOpened')} | ${cell('searches')} | ${cell('tokensIn')} | ${cell('tokensOut')} | ${cell('seconds')} | ${cell('words')} | ${correctCell(key, marks, arm, question)} |`);
    }
  }
  return lines.join('\n');
}

function costLine(questions, rows, key, [measure, label]) {
  const tally = compareByQuestion(questions, armRows(rows, key, ARM_FULL), armRows(rows, key, ARM_DOCS_ONLY), measure);
  const tied = tally.perQuestion.filter((q) => q.verdict === 'equal').map((q) => q.question);
  const lost = tally.perQuestion.filter((q) => q.verdict === 'higher').map((q) => `${q.question} (${fixed(q.a)} against ${fixed(q.b)})`);
  return `- On ${label}: the folder tied on ${tied.length} question(s)${tied.length ? ` (${tied.join(', ')})` : ''} and was higher on ${lost.length}${lost.length ? `: ${lost.join('; ')}` : ''}.`;
}

// Every question where the folder did not come out lower, measure by measure, and every
// question where the documents alone were right more often than the folder.
function tiesAndLosses(rows, key, marks) {
  const questions = questionsOf(rows);
  const lines = COST_MEASURES.map((measure) => costLine(questions, rows, key, measure));
  if (marks) {
    const worse = questions.filter((q) => MARKERS.some((marker) => rightCount(marks[marker], answersFor(key, marks, ARM_FULL, q)) < rightCount(marks[marker], answersFor(key, marks, ARM_DOCS_ONLY, q))));
    lines.push(`- On correct answers: by at least one marker, the documents alone were right more often than the folder on ${worse.length} question(s)${worse.length ? ` (${worse.join(', ')})` : ''}.`);
  }
  return lines.join('\n');
}

// The headline pair differs in two ways at once: the folder's files are on disk, and they are
// loaded first. The middle row has the files on disk and nothing loaded, so the last two rows
// differ only by the switch file. Steps cannot see what was loaded before the question, so the
// text loaded first is counted beside them, in characters.

// The size, in characters, of the instruction files an arm has loaded before the question.
// Read from the repo's own files, which the checker confirms are the ones that were staged.
export function loadedChars(arm) {
  return armSpec(arm).loaded.reduce((total, name) => total + readFileSync(join(REPO, name), 'utf8').replace(/\r\n/g, '\n').length, 0);
}

// Reading in one unit. A loaded file and a tool call are different kinds of thing and cannot be
// added, but the text each puts in front of the model can: characters loaded first, plus
// characters the tools returned.
function reading(rows, key, arm) {
  const group = armRows(rows, key, arm);
  const fetched = mean(group.map((r) => r.charsFetched));
  return { loaded: loadedChars(arm), fetched, total: fetched === null ? null : loadedChars(arm) + fetched };
}

function threeWayTable(rows, key) {
  const lines = ['| Arm | Instruction files loaded first | Steps | Characters loaded first | Characters fetched by tools | Characters read in all | Instruction files it opened itself | Documents opened | Turns | Tokens in | Tokens in, new | Tokens out | Sessions with no step |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const [arm, label] of [[ARM_DOCS_ONLY, 'Documents only'], [ARM_NONE, 'Folder on disk, nothing loaded'], [ARM_FULL, 'Folder loaded first']]) {
    const group = armRows(rows, key, arm);
    const read = reading(rows, key, arm);
    const cell = (values) => fixed(mean(values));
    lines.push(`| ${label} | ${armSpec(arm).loaded.length} | ${cell(group.map((r) => r.steps))} | ${fixed(read.loaded, 0)} | ${fixed(read.fetched, 0)} | ${fixed(read.total, 0)} | ${cell(group.map((r) => r.instructionOpened.length))} | ${cell(group.map((r) => r.documentsOpened))} | ${cell(group.map((r) => r.turns))} | ${cell(group.map((r) => r.tokensIn))} | ${cell(group.map((r) => r.tokensIn - r.cacheRead))} | ${cell(group.map((r) => r.tokensOut))} | ${group.filter((r) => r.steps === 0).length} of ${group.length} |`);
  }
  return lines.join('\n');
}

// What each of the four main arms could see, read from the list of files staged for it. This is
// the proof that the control held no instruction file, and that an unloaded folder still did.
function accessTable(dir, key) {
  const path = join(dir, 'key-staged.json');
  if (!existsSync(path)) return 'The list of files staged for each arm is not in this folder.';
  const staged = JSON.parse(readFileSync(path, 'utf8'));
  const lines = ['| Arm | Documents it could open | Instruction files on disk | Loaded before the question |', '|---|---|---|---|'];
  for (const [arm, label] of [[ARM_EMPTY, 'Empty'], [ARM_DOCS_ONLY, 'Documents only'], [ARM_NONE, 'Folder on disk, nothing loaded'], [ARM_FULL, 'Folder loaded first'], [ARM_WRONG_MAP, 'Folder loaded first, map made wrong on purpose']]) {
    const code = Object.keys(key.arms).find((c) => key.arms[c] === arm);
    if (!code) continue;
    const files = Object.keys(staged[code]?.files ?? {});
    const onDisk = files.filter((f) => !f.includes('/') && f !== 'CLAUDE.md');
    lines.push(`| ${label} | ${files.filter((f) => f.includes('/')).length} | ${onDisk.join(', ') || 'none'} | ${armSpec(arm).loaded.join(', ') || 'nothing'} |`);
  }
  return lines.join('\n');
}

const DEFINITIONS = [
  'What the columns mean:', '',
  '- A step is one search, one file listing or one file opened by the model.',
  '- Characters loaded first is the size of the instruction files handed over before the question. Characters fetched is the text the tools returned. Together they are what was put in front of the model, apart from the fixed instructions every arm gets.',
  '- A document counts as opened only when the model opened the file. Text that a search returned is not counted, so this column can be lower than what the model actually read.',
  '- Tokens in is everything sent to the model: the fixed instructions, any files loaded first, and everything the tools returned. The whole conversation is sent again on every turn, so an arm that takes more turns is counted for the same text several times. That is why tokens in can fall while characters read rise.',
  '- Tokens in, new, leaves out what the service read back from its own cache, which is mostly that repeated text. It depends on what the service had cached at that moment, so treat it as a rough guide.',
  '- Tokens out is everything the model wrote: its tool requests, its own working-out and the answer.',
];

// Steps cannot see what was loaded before the question. This sentence always follows the
// headline, so the number everyone quotes is never read without the two that qualify it.
function loadedSentence(rows, key) {
  const [full, docs, none] = [reading(rows, key, ARM_FULL), reading(rows, key, ARM_DOCS_ONLY), reading(rows, key, ARM_NONE)];
  if (full.total === null || docs.total === null) return 'There were not enough clean sessions to compare what each arm read.';
  const steps = mean(armRows(rows, key, ARM_NONE).map((r) => r.steps));
  const unloaded = steps === null ? '' : ` With the folder on disk and nothing loaded, the model took ${fixed(steps)} steps and read ${fixed(none.total, 0)} characters.`;
  return `Steps do not count what was loaded before the question. Counting text in one unit, the folder arm read ${fixed(full.total, 0)} characters per session (${fixed(full.loaded, 0)} loaded first and ${fixed(full.fetched, 0)} fetched by its tools) against ${fixed(docs.total, 0)} for documents only.${unloaded}`;
}

// The verdict, by a rule fixed before the run. Fewer steps alone is not enough: the folder has
// to cut steps without losing right answers and without putting more text in front of the model.
// Three outcomes. A condition that was seen to fail is different from one the test could not
// settle, so "did not earn its place" is said only when something was seen to fail. The marker
// from another maker, where there is one, counts as a marking pass.
export function verdictSentence(kind, read, counts) {
  if (!counts) return 'Whether the folder earned its place cannot be said until the answers are marked.';
  const failed = [];
  const unsettled = [];
  if (kind === 'more') failed.push('steps clearly rose');
  else if (kind !== 'fewer') unsettled.push('steps did not clearly fall');
  const fewerRight = ['one', 'two', 'outside'].some((marker) => (counts.full[marker] ?? null) !== null && counts.full[marker] < counts.docs[marker]);
  if (fewerRight) failed.push('a marking pass counted fewer right answers with the folder');
  if (read.full === null || read.docs === null) unsettled.push('there were not enough clean sessions to compare the text');
  else if (read.full > read.docs) failed.push('the model was given more text with the folder than without');
  if (failed.length > 0) return `By the rule fixed before the run, the folder did not earn its place: ${[...failed, ...unsettled].join('; ')}.`;
  if (unsettled.length > 0) return `By the rule fixed before the run, the test could not tell whether the folder earned its place: ${unsettled.join('; ')}.`;
  return 'By the rule fixed before the run, the folder earned its place: steps fell, right answers did not, and the text put in front of the model did not rise.';
}

// What a session cost, printed beside the verdict. The verdict counts text as it arrives: a
// loaded file once, a tool's return each time it comes back. Tokens and seconds rise with the
// number of turns as well, so they are shown and not ruled on.
function costSentence(rows, key) {
  const [full, docs] = [armRows(rows, key, ARM_FULL), armRows(rows, key, ARM_DOCS_ONLY)];
  if (full.length === 0 || docs.length === 0) return [];
  const pair = (measure, places) => `${fixed(mean(full.map((r) => r[measure])), places)} against ${fixed(mean(docs.map((r) => r[measure])), places)}`;
  return [`The rule counts text as it arrives: a loaded file once, and what a tool returns each time it returns it. It does not count cost. Per session, the folder arm against documents only: ${pair('tokensIn', 0)} tokens in, ${pair('tokensOut', 0)} tokens out, ${pair('seconds', 1)} seconds.`, ''];
}

// The known-bad arm is judged by the counting rule the headline uses: more steps on 9 or 10
// questions, or fewer right answers by both marking passes. One pass alone is not enough: the
// passes can disagree on which folder did better. Anything less and the test did not catch it.
export function wrongMapCaught(tally, wrong = null, right = null) {
  return outcome(tally) === 'more' || Boolean(wrong && right && wrong.one < right.one && wrong.two < right.two);
}

// The known-bad arm. If a map that points to the wrong documents changes nothing, the test
// cannot see a folder that misleads, and the page says so.
function wrongMapSentence(rows, key, marks) {
  const bad = armRows(rows, key, ARM_WRONG_MAP);
  const good = armRows(rows, key, ARM_FULL);
  if (bad.length === 0 || good.length === 0) return 'The known-bad arm, a folder whose map points to the wrong documents, has no clean session to compare.';
  const tally = compareByQuestion(questionsOf(rows), bad, good, 'steps');
  const [wrong, right] = marks ? [correctCounts(key, marks, ARM_WRONG_MAP), correctCounts(key, marks, ARM_FULL)] : [null, null];
  const answers = marks ? ` Right answers of ${wrong.total}, by the two marking passes: ${wrong.one} and ${wrong.two} with the wrong map, ${right.one} and ${right.two} with the true one.` : '';
  const closing = wrongMapCaught(tally, wrong, right) ? 'The test caught the bad folder.' : 'Neither the steps nor the right answers show a clear difference by the rule fixed in advance. This run did not show that the test can catch a folder that misleads.';
  return `A folder made wrong on purpose, its map pointing to the wrong documents, took ${fixed(tally.meanA)} steps per session against ${fixed(tally.meanB)} for the true folder: more on ${tally.higher} of ${tally.perQuestion.length} questions, fewer on ${tally.lower}.${answers} ${closing}`;
}

// The test against itself. Two runs of the same arm differ only by chance, so the counting rule
// should name no direction. Every pair of runs is shown.
function selfComparison(rows, key) {
  const questions = questionsOf(rows);
  const lines = ['| Arm | Runs compared | Fewer | More | Equal | What the rule says |', '|---|---|---|---|---|---|'];
  let named = 0;
  for (const [arm, label] of [[ARM_DOCS_ONLY, 'Documents only'], [ARM_FULL, 'Folder loaded first']]) {
    const mine = armRows(rows, key, arm);
    const runs = [...new Set(mine.map((r) => r.run))].sort((a, b) => a - b);
    for (const a of runs) {
      for (const b of runs.filter((r) => r > a)) {
        const tally = compareByQuestion(questions, mine.filter((r) => r.run === a), mine.filter((r) => r.run === b), 'steps');
        const kind = outcome(tally);
        if (kind !== 'unclear') named += 1;
        lines.push(`| ${label} | ${a} against ${b} | ${tally.lower} | ${tally.higher} | ${tally.equal} | ${kind === 'unclear' ? 'no clear difference' : `${kind} steps`} |`);
      }
    }
  }
  if (lines.length === 2) return 'This run asked each question once in each arm, so no arm can be compared with itself.';
  const verdict = named <= SELF_COMPARISON_LIMIT
    ? 'The rule named no direction between runs of the same arm. This checks that the result is not wildly unstable; it does not show how often the rule is wrong.'
    : `The rule named a direction in ${named} comparison(s) of an arm with itself. Chance alone can produce the headline's kind of result here, so read the headline with that in mind.`;
  return `${lines.join('\n')}\n\n${verdict}`;
}

const flagsOf = (row) => row.flags ?? [];

// Where the faulty and the flagged sessions fell, for the arms a reader will look at first.
function faultsByArm(rows, key) {
  const lines = [[ARM_FULL, 'full package'], [ARM_DOCS_ONLY, 'documents only'], [ARM_NONE, 'folder on disk, nothing loaded'], [ARM_EMPTY, 'empty']].map(([arm, label]) => {
    const all = rows.filter((r) => key.arms[r.code] === arm);
    return `${label} ${all.filter((r) => r.faults.length > 0).length} left out and ${all.filter((r) => flagsOf(r).length > 0).length} flagged of ${all.length}`;
  });
  return `By arm: ${lines.join('; ')}. A session is left out only for a fault in the set-up: a wrong model or tool version, an add-on, a second model, or a broken log. A session is flagged and kept in every average when the model itself did something: a refused call, a tool error, a limit reached, an empty answer.`;
}

// The files each arm held were fingerprinted when staged and again after the last session.
function stagedAfterLine(dir) {
  const path = join(dir, 'staged-after.json');
  if (!existsSync(path)) return [];
  const { checked, changed } = JSON.parse(readFileSync(path, 'utf8'));
  return [`- The files staged for each arm were fingerprinted again after the last session: ${changed.length === 0 ? `none of the ${checked} arms had changed` : `${changed.length} of ${checked} arms had changed, so what those arms held during the run is not known`}.`];
}

function howItWasRun(dir, rows) {
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const schedule = JSON.parse(readFileSync(join(dir, 'schedule.json'), 'utf8'));
  return [
    `- Model \`${manifest.model}\`, effort \`${manifest.effort}\`, Claude Code ${manifest.version}.`,
    `- Started ${manifest.started?.slice(0, 10) ?? 'on a date not recorded'} (UTC). Every session is told the date it runs on, so an answer to a question that leaves out a date can depend on the day.`,
    `- ${schedule.questions.length} questions, ${Object.keys(manifest.staged).length} arms, ${schedule.runs} run(s): ${rows.length} sessions.`,
    '- Each question was asked in its own fresh session. Nothing carried over from one to the next.',
    `- Sessions ran one at a time. Within each question, the arms ran in an order drawn from the seed \`${schedule.seed}\`.`,
    '- The transcripts in `control/` and `treatment/` are filed in question order, which is not the order they ran in.',
    ...stagedAfterLine(dir),
  ].join('\n');
}

// The fault rule, fixed before the run: too many faulty sessions in the two arms the headline
// compares, and the run is void. The tables are still shown; the sentence is not to be relied on.
export function voidLines(rows, key) {
  const pair = rows.filter((r) => [ARM_FULL, ARM_DOCS_ONLY].includes(key.arms[r.code]));
  const faulty = pair.filter((r) => r.faults.length > 0).length;
  if (pair.length === 0 || faulty / pair.length <= FAULT_LIMIT) return [];
  return [`**This run is void.** ${faulty} of ${pair.length} sessions in the two arms the headline compares had a fault, above the limit of ${FAULT_LIMIT * 100}%. The sentence below is shown for the record and is not a result.`, ''];
}

// A page written by a person, word for word, without its own title: the section heading here names it.
const included = (path, missing) => (existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n').replace(/^# .*\n+/, '').trim() : missing);

// The brief's own control is the cold one: no folder and no documents. It is reported in words
// near the top, before the harder comparison against the documents alone is broken down.
function coldSentence(rows, key, marks) {
  const group = armRows(rows, key, ARM_EMPTY);
  if (group.length === 0) return 'The cold arm, with no folder and no documents, has no clean session.';
  const cold = marks && correctCounts(key, marks, ARM_EMPTY);
  const right = cold ? ` It was correct on ${cold.one} of ${cold.total} answers (marked a second time: ${cold.two}).` : '';
  return `Asked cold, with no folder and no documents, the model took ${fixed(mean(group.map((r) => r.steps)))} steps per session.${right} The comparison above is the harder one: the same documents, with and without the folder's four instruction files.`;
}

export function buildResults(dir) {
  const rows = loadRows(dir);
  const key = JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8'));
  const tally = headlineTally(rows, key);
  const marks = marksPresent(dir) ? loadMarks(dir) : null;
  const full = marks && correctCounts(key, marks, ARM_FULL);
  const docs = marks && correctCounts(key, marks, ARM_DOCS_ONLY);
  const outside = marks?.outside ? { full: full.outside, docs: docs.outside } : null;
  const correctness = marks ? correctnessSentences(tally, full, docs, outside) : [NOT_MARKED];
  const verdict = verdictSentence(outcome(tally), { full: reading(rows, key, ARM_FULL).total, docs: reading(rows, key, ARM_DOCS_ONLY).total }, marks ? { full, docs } : null);
  return [
    '# Results', '',
    ...voidLines(rows, key), headlineSentence(tally), '', loadedSentence(rows, key), '', ...correctness, '', coldSentence(rows, key, marks), '', verdict, '', ...costSentence(rows, key),
    `Sessions: ${rows.length}. Left out for a fault in the set-up: ${rows.filter((r) => r.faults.length > 0).length}. Kept and flagged for something the model did: ${rows.filter((r) => flagsOf(r).length > 0).length}. Ran while the account was past a usage-warning mark, which is not a fault: ${rows.filter((r) => r.usageWarning).length}.`, '', faultsByArm(rows, key), '',
    '## The headline pair', '', ...pairSection(rows, key),
    '## Where the folder tied or lost, full package against documents only', '', tiesAndLosses(rows, key, marks), '',
    '## What we changed in the folder because of a control run', '', included(FOLDER_CHANGES, 'No change is on record.'), '',
    ...(existsSync(PROJECT_RUN) ? ['## The same questions in a Claude project', '', included(PROJECT_RUN, ''), ''] : []),
    '## Can the test be trusted', '', '### Against itself', '', selfComparison(rows, key), '', ...(marks ? [rightSpread(key, marks), ''] : []), '### Against a folder made wrong on purpose', '', wrongMapSentence(rows, key, marks), '',
    '## What each arm could see', '', accessTable(dir, key), '',
    '## Loading is the only switch', '', threeWayTable(rows, key), '', ...DEFINITIONS, '',
    '## Question by question', '', threeArmTable(rows, key, marks), '',
    '## How this was run', '', howItWasRun(dir, rows), '',
    '## Limits', '', included(LIMITS, 'No limits file is on record.'), '',
    '## Changes to the analysis after a run', '', included(DEVIATIONS, 'None. The code that produced this page is the code committed before the run.'), '',
    '# Appendix: every arm', '', 'Everything above compares the full folder with the documents alone. The tables below hold every other arm.', '',
    ...switchSection(rows, key),
    ...(marks ? [marksSection(dir, key, marks)] : []),
  ].join('\n');
}
