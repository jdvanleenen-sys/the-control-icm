// Re-run the committed questions in three arms and compare with a committed, revealed run.
//
//   node tools/rerun.mjs [--name sealed] [--runs 1]
//
// "Reproduces" has one meaning here: the rule that chose the committed run's sentence, applied
// to the re-run, lands on the same one of three outcomes (fewer steps, more steps, no clear
// difference). Step counts for single questions do move by a step between runs.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { option, runCli, sealedRunOrDefault } from '../lib/cli.mjs';
import { ARM_DOCS_ONLY, ARM_EMPTY, ARM_FULL, EFFORT, MODEL, QUESTIONS_FILE, runDir } from '../lib/config.mjs';
import { faultSummary, notices, runOpenArms, STEPS_CAUTION } from '../lib/mini.mjs';
import { loadQuestions } from '../lib/questions.mjs';
import { compareByQuestion, fixed, headlineSentence, mean, outcome } from '../lib/stats.mjs';
import { headlineTally, loadRows } from '../verify/analyse.mjs';
import { loadedChars } from '../verify/results.mjs';

const OUTCOME_WORDS = { fewer: 'fewer steps with the folder', more: 'more steps with the folder', unclear: 'no clear difference' };
const MEANING = 'Reproduces means the same rule lands on the same one of three outcomes. Single questions can differ by a step or two between runs. This compares steps only. Right answers are not re-marked: to check them, read your answers in the folder named below, and ours under control/ and treatment/, against questions.md.';

export function report(committed, mine, emptyCommitted, emptyMine, extra = []) {
  const lines = ['| Question | Committed: full | Committed: documents | Re-run: full | Re-run: documents |', '|---|---|---|---|---|'];
  committed.perQuestion.forEach((q, i) => lines.push(`| ${q.question} | ${fixed(q.a)} | ${fixed(q.b)} | ${fixed(mine.perQuestion[i].a)} | ${fixed(mine.perQuestion[i].b)} |`));
  const same = outcome(committed) === outcome(mine);
  return [
    '# Re-run against the committed run', '', `Model: ${MODEL}, effort ${EFFORT}. Mean steps per session, by question.`, '', ...lines, '',
    `Empty arm, mean steps: committed ${fixed(emptyCommitted)}, re-run ${fixed(emptyMine)}.`, '',
    `Committed outcome: ${OUTCOME_WORDS[outcome(committed)]}. ${headlineSentence(committed)}`,
    `Re-run outcome: ${OUTCOME_WORDS[outcome(mine)]}. ${headlineSentence(mine)}`, '',
    `Reproduces: ${same ? 'YES' : 'NO'}. ${MEANING}`, '', STEPS_CAUTION, ...extra.map((line) => `Notice: ${line}`), '',
  ].join('\n');
}

// The second thing the verdict rests on, beside the first: the text put in front of the model.
// It is printed for the reader and is no part of "Reproduces", which is about steps.
export function textLine(committedFull, committedDocs, mineFull, mineDocs) {
  const loaded = loadedChars(ARM_FULL);
  const fetched = (rows) => mean(rows.map((r) => r.charsFetched));
  if ([committedFull, committedDocs, mineFull, mineDocs].some((rows) => rows.length === 0)) return null;
  const side = (full, docs) => `${Math.round(loaded + fetched(full))} characters with the folder (${loaded} loaded first and ${Math.round(fetched(full))} fetched) against ${Math.round(fetched(docs))} with the documents alone`;
  return `Text put in front of the model per session. Committed run: ${side(committedFull, committedDocs)}. Re-run: ${side(mineFull, mineDocs)}. This is shown beside the steps and is not part of "Reproduces".`;
}

function main() {
  const dir = sealedRunOrDefault('Example: node tools/rerun.mjs --name sealed');
  if (!existsSync(join(dir, 'key.json'))) throw new Error('That run has no key here. A re-run can only be compared with a run whose key has been revealed.');
  const key = JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8'));
  const committedRows = loadRows(dir);
  const questions = loadQuestions(QUESTIONS_FILE);
  const ids = questions.map((q) => q.id);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const name = `${basename(dir)}-rerun-${stamp}`;
  const rows = runOpenArms(questions, { runs: Number(option('runs', '1')), outDir: runDir(name), say: console.log });
  const clean = (arm) => rows.filter((r) => r.arm === arm && r.faults.length === 0);
  const mine = compareByQuestion(ids, clean(ARM_FULL), clean(ARM_DOCS_ONLY), 'steps');
  const committedEmpty = mean(committedRows.filter((r) => key.arms[r.code] === ARM_EMPTY && r.faults.length === 0).map((r) => r.steps));
  const committedClean = (arm) => committedRows.filter((r) => key.arms[r.code] === arm && r.faults.length === 0);
  const textNote = textLine(committedClean(ARM_FULL), committedClean(ARM_DOCS_ONLY), clean(ARM_FULL), clean(ARM_DOCS_ONLY));
  const text = report(headlineTally(committedRows, key, ids), mine, committedEmpty, mean(clean(ARM_EMPTY).map((r) => r.steps)), [...faultSummary(rows), ...notices(rows), ...(textNote ? [textNote] : [])]);
  writeFileSync(join(runDir(name), 'rerun.md'), text);
  console.log(`\n${text}\nRaw logs, and a readable transcript of every session with its answer: runs/${name}/logs/ (not tracked by git; delete when done)`);
  if (!text.includes('Reproduces: YES')) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(main);
