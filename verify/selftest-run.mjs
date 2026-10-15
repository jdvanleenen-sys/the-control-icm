// Self-test cases for the run itself: retries, sessions that never answer, a run that stops
// part way, boundaries, and how steps are counted. The real run code is used with a stand-in
// for the program, so no session is started.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { MAX_ATTEMPTS } from '../lib/config.mjs';
import { notices } from '../lib/mini.mjs';
import { parseQuestions } from '../lib/questions.mjs';
import { summarise } from '../lib/session.mjs';
import { fingerprint, stageArm } from '../lib/stage.mjs';
import { compareByQuestion } from '../lib/stats.mjs';
import { drawQuestions, QUESTION_TYPES } from '../tools/draw.mjs';
import { makeMap } from '../tools/make-map.mjs';
import { executeRun, runSession } from '../tools/run.mjs';
import { buildSessions } from '../tools/schedule.mjs';
import { FIXTURE_VERSION, goodEvents, toLog, writePlan, writeSource } from './fixtures.mjs';
import { checkFolder } from './folder.mjs';
import { logPath, scanRun } from './scan.mjs';

const reply = (stream) => ({ stream, stderr: '', exit: 0, timedOut: false, wallMs: 1 });
const answering = (stageDir) => reply(toLog(goodEvents(basename(stageDir), 'An answer.', stageDir.replace(/\\/g, '/'))));

function runOptions(scratch, name, asker) {
  const { source, questionsFile } = writeSource(join(scratch, `${name}-src`));
  return { asker, version: FIXTURE_VERSION, questionsFile, source, stageRoot: join(scratch, `${name}-stage`) };
}

function testRetries(record, scratch) {
  const dir = join(scratch, 'retry');
  const session = writePlan(dir)[0];
  let calls = 0;
  const flaky = (stageDir) => { calls += 1; return calls === 1 ? reply('') : answering(stageDir); };
  runSession(dir, session, 'prompt', join(scratch, 'AAAA'), flaky);
  const path = logPath(dir, session);
  const meta = JSON.parse(readFileSync(path.replace(/\.jsonl$/, '.meta.json'), 'utf8'));
  record('run', 'a session with no answer is tried again and the failed attempt is kept', meta.attempts === 2 && existsSync(path.replace(/\.jsonl$/, '.attempt1.jsonl')) && readFileSync(path, 'utf8').includes('"type":"result"'), `attempts ${meta.attempts}`);
}

function testNeverAnswers(record, scratch) {
  const dir = join(scratch, 'silent');
  writePlan(dir);
  let calls = 0;
  const silentFirst = (stageDir) => { calls += 1; return calls <= MAX_ATTEMPTS ? reply('') : answering(stageDir); };
  executeRun(dir, runOptions(scratch, 'silent', silentFirst));
  const rows = scanRun(dir);
  record('run', 'a session that never answers ends as a listed fault and the run goes on', rows[0].faults.includes('empty log file') && rows.slice(1).every((r) => r.faults.length === 0) && existsSync(join(dir, 'tables-coded.md')), rows.map((r) => r.faults.join(',') || 'clean').join(' | '));
}

function testStops(record, scratch) {
  const started = join(scratch, 'started');
  writePlan(started);
  const options = runOptions(scratch, 'started', answering);
  executeRun(started, options);
  let message = '';
  try { executeRun(started, options); } catch (error) { message = error.message; }
  record('run', 'a started run refuses to start again', message.includes('already been started'), message);
  const after = (dir) => JSON.parse(readFileSync(join(dir, 'staged-after.json'), 'utf8'));
  record('run', 'the staged files are fingerprinted again after the last session', after(started).checked > 0 && after(started).changed.length === 0);
  const meddled = join(scratch, 'meddled');
  writePlan(meddled);
  executeRun(meddled, runOptions(scratch, 'meddled', (stageDir) => { writeFileSync(join(stageDir, 'added.md'), 'x'); return answering(stageDir); }));
  record('run', 'a file added to a staged arm during the run is caught', after(meddled).changed.length > 0);

  const killed = join(scratch, 'killed');
  writePlan(killed);
  let calls = 0;
  try { executeRun(killed, runOptions(scratch, 'killed', (stageDir) => { calls += 1; if (calls === 2) throw new Error('process killed'); return answering(stageDir); })); } catch { /* the stand-in for a killed process */ }
  record('run', 'a run killed part way lists its missing logs', scanRun(killed).filter((r) => r.faults.includes('log is missing')).length === 3);

  for (const [name, spoil] of [['a wrong model', (init) => { init.model = 'another-model'; }], ['a personal plugin', (init) => { init.plugins.push({ name: 'mine', path: 'C:/x' }); }]]) {
    const dir = join(scratch, `guard-${name.replace(/\W/g, '')}`);
    writePlan(dir);
    const spoiled = (stageDir) => { const events = goodEvents(basename(stageDir)); spoil(events[0]); return reply(toLog(events)); };
    let stopped = '';
    try { executeRun(dir, runOptions(scratch, basename(dir), spoiled)); } catch (error) { stopped = error.message; }
    record('run', `${name} stops the run at that session`, stopped.includes('Run stopped at session 1') && !existsSync(join(dir, 'tables-coded.md')), stopped);
  }
}

function testBoundaries(record, scratch) {
  const one = parseQuestions('## Q1\n\n**Prompt:**\n\n> State the limit\n');
  record('boundary', 'one question, with no question mark, is read as written', one.length === 1 && one[0].prompt === 'State the limit');
  record('boundary', 'one question schedules one session per arm', buildSessions(['Q1'], ['AAAA', 'BBBB'], 1, 'seed').length === 2);
  const { source } = writeSource(join(scratch, 'bounds'));
  writeFileSync(join(source, 'reference', 'set', 'a file with spaces.md'), '---\nset: Set\nrole: summary\ncovers: "a summary"\n---\n\ntext\n');
  const staged = stageArm(join(scratch, 'bounds-arm'), 'c1000', { source });
  record('boundary', 'a file name with spaces is staged and fingerprinted', 'reference/set/a file with spaces.md' in staged.files && 'reference/set/a file with spaces.md' in fingerprint(join(scratch, 'bounds-arm')));
  record('boundary', 'a set of one document still makes a map', makeMap(join(writeSource(join(scratch, 'single')).source, 'reference')).includes('reference/set/doc.md'));
  writeFileSync(join(source, 'reference', 'set', 'stopped.md'), '---\nset: Set\nrole: governing\ncovers: "ends with a full stop."\n---\n\ntext\n');
  record('boundary', 'a description that already ends with a full stop gets one, not two', makeMap(join(source, 'reference')).includes('ends with a full stop.\n'));
  writeFileSync(join(source, 'rules.md'), '');
  record('boundary', 'an empty instruction file is named by the folder check', checkFolder(source).some((f) => f.includes('rules.md is empty')));
}

function testDraw(record) {
  const entry = (id, set, type) => `## ${id}\n\n**Set:** ${set}\n\n**Type:** ${type}\n\n**Prompt (paste exactly):**\n\n> Under the rules: question ${id}?\n\n**Expected answer:** yes\n`;
  const pool = ['a', 'b'].flatMap((set) => QUESTION_TYPES.flatMap((type, i) => [entry(`P${set}${i}x`, set, type), entry(`P${set}${i}y`, set, type)])).join('\n');
  const drawn = drawQuestions(pool);
  const slots = drawn.exam.map((e) => `${e.set} ${e.type}`);
  record('draw', 'one question is drawn for each type in each set, and the rest are held out', drawn.exam.length === 10 && new Set(slots).size === 10 && drawn.heldout.length === 10);
  record('draw', 'the same pool always gives the same draw, and a changed pool gives another seed', drawQuestions(pool).questions === drawn.questions && drawQuestions(`${pool}\n`).seed !== drawn.seed);
  record('draw', 'the drawn page is read back as ten questions that say where each came from', parseQuestions(drawn.questions).length === 10 && drawn.questions.includes(`**Drawn from:** ${drawn.exam[0].id}`));
  const without = drawQuestions(pool, 'Pa0x\nPa0y\nPb1x\n');
  record('draw', 'a question dropped at the key check is never drawn or held out, and an emptied slot is reported', without.empty.join() === 'a, plain lookup' && without.exam.length === 9 && [...without.exam, ...without.heldout].every((e) => !['Pa0x', 'Pa0y', 'Pb1x'].includes(e.id)));
  const ruled = drawQuestions(pool.replace('## Pb0x', '---\n\n## Pb0x'));
  record('draw', 'a rule the writer put between two groups of questions is not carried into a question', ruled.exam.length === 10 && !`${ruled.questions}${ruled.heldoutPage}`.includes('\n---'));
  let message = '';
  try { drawQuestions(pool.replace('**Type:** trap', '**Type:** riddle')); } catch (error) { message = error.message; }
  record('draw', 'a pool question with an unknown type stops the draw', message.includes('riddle'), message);
}

function reads(paths, stageDir, extra = []) {
  const events = [
    { type: 'assistant', message: { content: paths.map((path, i) => ({ type: 'tool_use', id: `t${i}`, name: 'Read', input: { file_path: path } })) } },
    { type: 'user', message: { content: paths.map((_, i) => ({ type: 'tool_result', tool_use_id: `t${i}` })) } },
    ...extra,
  ];
  return summarise(events, { code: 'AAAA', run: 1, question: 'Q1', stageDir });
}

function testCounting(record) {
  const stage = 'C:/tc/AAAA';
  record('counting', 'two calls made in one message count as two steps', reads([`${stage}/reference/s/a.md`, `${stage}/reference/s/b.md`], stage).steps === 2);
  const helper = { type: 'assistant', parent_tool_use_id: 'x', message: { content: [{ type: 'tool_use', id: 'h1', name: 'Grep', input: { pattern: 'p' } }] } };
  record('counting', "a helper agent's calls are left out", reads([`${stage}/reference/s/a.md`], stage, [helper]).steps === 1);
  const spellings = ['C:\\tc\\AAAA\\reference\\s\\a.md', 'c:/TC/aaaa/Reference/s/A.md', 'reference/s/a.md', './reference/s/a.md'];
  const row = reads(spellings, stage);
  record('counting', 'one document written four ways is one document opened', row.documentsOpened === 1 && row.opens === 4, `documents ${row.documentsOpened}, opens ${row.opens}`);
  const refused = summarise([{ type: 'assistant', message: { content: [{ type: 'tool_use', id: 'r1', name: 'Read', input: { file_path: `${stage}/reference/s/a.md` } }] } }, { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'r1', is_error: true }] } }], { code: 'AAAA', run: 1, question: 'Q1', stageDir: stage });
  record('counting', 'a refused read is a step taken but not a document opened', refused.steps === 1 && refused.opens === 0 && refused.documentsOpened === 0 && refused.refused === 1);
  record('counting', 'an instruction file opened by the model is recorded', reads([`${stage}/README.md`], stage).instructionOpened.join() === 'README.md');
}

function testAveraging(record) {
  const row = (question, steps) => ({ question, steps });
  const tally = compareByQuestion(['Q1', 'Q2', 'Q3'], [row('Q1', 1), row('Q1', 2), row('Q1', 3), row('Q2', 1)], [row('Q1', 2), row('Q1', 2), row('Q1', 2), row('Q2', 4), row('Q3', 1)], 'steps');
  record('averaging', 'three runs are averaged, so 1, 2, 3 against 2, 2, 2 is a tie', tally.perQuestion[0].verdict === 'equal' && tally.lower === 1 && tally.equal === 1);
  record('averaging', 'a question with no clean session in one arm counts as missing', tally.missing === 1 && tally.perQuestion[2].verdict === 'missing');
}

function testNotices(record) {
  const rows = [{ arm: 'c1111', question: 'Q1', steps: 0 }, { arm: 'empty', question: 'Q1', steps: 0 }, { arm: 'docs', question: 'Q1', steps: 3 }];
  const found = notices(rows);
  record('counting', 'an arm with documents that took no step is called out, and the empty arm is not', found.length === 1 && found[0].includes('Full package'), found.join(' | '));
}

export function runCases(record, scratch) {
  testNotices(record);
  mkdirSync(scratch, { recursive: true });
  testRetries(record, scratch);
  testNeverAnswers(record, scratch);
  testStops(record, scratch);
  testBoundaries(record, scratch);
  testDraw(record);
  testCounting(record);
  testAveraging(record);
}
