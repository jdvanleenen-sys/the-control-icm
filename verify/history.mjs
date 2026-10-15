// The history check. The order of commits is the proof that each thing existed before the
// thing it could have been shaped by. This reads a repo's history and names every rule broken.
//
//   node verify/history.mjs --name NAME     one run
//   node verify/history.mjs                 every sealed run in the repo

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { option, runCli } from '../lib/cli.mjs';
import { INSTRUCTION_FILES, REPO } from '../lib/config.mjs';

function git(repo, args) {
  const done = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' });
  if (done.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${done.stderr.trim()}`);
  return done.stdout.split('\n').filter(Boolean);
}

// The position in history of the first commit that added any file under `path`, or null.
function firstAdded(repo, order, path) {
  const commits = git(repo, ['log', '--diff-filter=A', '--format=%H', '--', path]);
  return commits.length === 0 ? null : Math.min(...commits.map((hash) => order.indexOf(hash)));
}

// Everything that turns logs into numbers and sentences. None of it may change once a run's
// first log is committed.
const ANALYSIS_CODE = ['lib', 'verify/analyse.mjs', 'verify/results.mjs', 'verify/scan.mjs', 'verify/marks.mjs'];

// Pages that tell people how the run is done and marked. Where they exist, they have to be on
// record before the first log, so nobody can say the steps were written to fit the run.
const WRITTEN_FIRST = ['RUN.md', 'PREREGISTRATION.md', 'MARKING.md'];
// How the run was to be made and how answers are marked. RUN.md is not here: it was edited after
// the run to help visitors, and DEVIATIONS.md lists each edit.
const NEVER_CHANGED = ['PREREGISTRATION.md', 'MARKING.md'];

const changedLater = (repo, path) => git(repo, ['log', '--diff-filter=MD', '--format=%H', '--', path]).length > 0;

// Every sealed run the repo holds: a folder under runs/ with a committed schedule.
export function sealedRuns(repo) {
  return git(repo, ['ls-files', 'runs']).filter((path) => /^runs\/[^/]+\/schedule\.json$/.test(path)).map((path) => path.split('/')[1]).sort();
}

const DESIGN_PAGE = 'EXPERIMENT.md';

// A fault found in the analysis after a run may be fixed, in the open: the same commit has to
// add to this page what was wrong and what the fix changed. The old code and the old tables
// stay in the history. A change with no note is still a failure.
export const DEVIATIONS_PAGE = 'DEVIATIONS.md';

// The commits that changed the analysis code after the first log of a run.
export function fixesAfter(repo, order, logs) {
  return git(repo, ['log', '--format=%H', '--', ...ANALYSIS_CODE]).filter((hash) => order.indexOf(hash) > logs);
}

function undocumentedFixes(repo, order, logs) {
  const noted = new Set(git(repo, ['log', '--format=%H', '--', DEVIATIONS_PAGE]));
  return fixesAfter(repo, order, logs).filter((hash) => !noted.has(hash))
    .map((hash) => `the analysis code was changed after the first log was committed, in ${hash.slice(0, 7)}, with no note in ${DEVIATIONS_PAGE} in the same commit`);
}

function repoFailures(repo, at) {
  const failures = [];
  // Where the design page exists, it has to be the very first commit and never change.
  if (at(DESIGN_PAGE) !== null && at(DESIGN_PAGE) !== 0) failures.push(`${DESIGN_PAGE} was not the first commit`);
  if (at(DESIGN_PAGE) !== null && changedLater(repo, DESIGN_PAGE)) failures.push(`${DESIGN_PAGE} was changed after it was first committed`);
  if (at('questions.md') === null) return ['questions.md was never committed'];
  for (const name of INSTRUCTION_FILES) {
    if (at(name) !== null && at('questions.md') >= at(name)) failures.push(`questions.md was not committed before ${name}`);
  }
  if (at('runs') !== null && at('questions.md') >= at('runs')) failures.push('questions.md was not committed before the first run file');
  if (changedLater(repo, 'questions.md')) failures.push('questions.md was changed after it was first committed');
  for (const page of NEVER_CHANGED) if (at(page) !== null && changedLater(repo, page)) failures.push(`${page} was changed after it was first committed`);
  return failures;
}

function runFailures(repo, order, at, run) {
  const base = `runs/${run}`;
  const logs = at(`${base}/logs`);
  if (at(`${base}/schedule.json`) === null) return [`run "${run}" is not in the history`];
  const failures = [];
  const before = (early, message) => { if (at(early) === null || (logs !== null && at(early) >= logs)) failures.push(message); };
  for (const path of ANALYSIS_CODE) before(path, `the analysis code (${path}) was not committed before the first log`);
  before(`${base}/key.sha256`, "the key's fingerprint was not committed before the first log");
  for (const page of WRITTEN_FIRST) if (at(page) !== null && logs !== null && at(page) >= logs) failures.push(`${page} was not committed before the first log`);
  const key = at(`${base}/key.json`);
  if (key !== null && (at(`${base}/tables-coded.md`) === null || at(`${base}/tables-coded.md`) >= key)) failures.push('the coded tables were not committed before the key');
  if (key !== null && logs !== null && key <= logs) failures.push('the key was committed with or before the logs');
  if (changedLater(repo, `${base}/logs`)) failures.push('a raw log was changed or removed after it was first committed');
  // The key, its fingerprint, the record of what was staged and the coded tables are each written once.
  for (const once of ['key.json', 'key.sha256', 'manifest.json', 'tables-coded.md']) {
    if (at(`${base}/${once}`) !== null && changedLater(repo, `${base}/${once}`)) failures.push(`${base}/${once} was changed or removed after it was first committed`);
  }
  // Marks are made with the arm hidden, so they come before the key and are never touched again.
  const everAdded = [...new Set(git(repo, ['log', '--diff-filter=A', '--name-only', '--format=', '--', base]))];
  for (const marks of everAdded.filter((path) => /\/marks-[a-z]+\.csv$/.test(path))) {
    if (changedLater(repo, marks)) failures.push(`${marks} was changed or removed after it was first committed`);
    if (key !== null && at(marks) >= key) failures.push(`${marks} was not committed before the key`);
  }
  if (logs !== null) failures.push(...undocumentedFixes(repo, order, logs));
  return failures.map((failure) => `${run}: ${failure}`);
}

// `run` names one run. With no run named, every sealed run in the repo is checked, so the
// check can never pass by checking nothing.
export function checkHistory(repo, run = null) {
  // A shallow clone holds only the newest commits, so every file looks as if it arrived at once
  // and the order cannot be read. Say that, instead of reporting an order that is not there.
  if (git(repo, ['rev-parse', '--is-shallow-repository'])[0] === 'true') {
    throw new Error('This is a shallow clone, so the order of the commits cannot be read. Fetch the full history with "git fetch --unshallow", or clone again without --depth.');
  }
  const order = git(repo, ['rev-list', '--reverse', 'HEAD']);
  const at = (path) => firstAdded(repo, order, path);
  const runs = run ? [run] : sealedRuns(repo);
  return { runs, failures: [...repoFailures(repo, at), ...runs.flatMap((name) => runFailures(repo, order, at, name))] };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(() => {
    const { runs, failures } = checkHistory(REPO, option('name') ?? option('run'));
    if (failures.length === 0) console.log(`History check passed for: ${runs.join(', ') || 'the repo (no sealed run found)'}.`);
    else { console.error(`History check FAILED (${failures.length}), runs checked: ${runs.join(', ')}:\n${failures.map((f) => `- ${f}`).join('\n')}`); process.exitCode = 1; }
  });
}
