// A small open run of named arms, for the two commands a visitor uses: asking their own
// question, and re-running the committed questions. Arms are named here, not coded: nothing is
// marked from these runs and the visitor needs to see which arm is which.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ask, programVersion } from './claude.mjs';
import { ARM_DOCS_ONLY, ARM_EMPTY, ARM_FULL, EFFORT, MODEL, STAGE_ROOT } from './config.mjs';
import { transcript } from './transcript.mjs';
import { seededRandom, shuffle, uniqueCodes } from './rng.mjs';
import { parseLog, summarise } from './session.mjs';
import { assertCleanAncestors, stageArm, stagedDigest } from './stage.mjs';
import { scanLog, splitFaults } from '../verify/scan.mjs';

export const OPEN_ARMS = [[ARM_FULL, 'Full package'], [ARM_DOCS_ONLY, 'Documents only'], [ARM_EMPTY, 'Empty']];
export const STEPS_CAUTION = 'Steps show how the model got to an answer, not whether the answer is right. Read the answers.';

// An arm that holds documents and took no step did not look anything up. That is worth saying
// out loud, because on steps alone it would look like the best row in the table.
export function notices(rows) {
  return rows.filter((r) => r.arm !== ARM_EMPTY && r.steps === 0).map((r) => `${r.question}, ${OPEN_ARMS.find(([arm]) => arm === r.arm)[1]}: 0 steps in an arm that holds documents. The model did not look anything up.`);
}

// One line per arm: how many sessions had a fault in the set-up and were left out of the
// means, and how many were kept and flagged for something the model did.
export function faultSummary(rows) {
  return OPEN_ARMS.map(([arm, label]) => {
    const mine = rows.filter((r) => r.arm === arm);
    return `${label}: ${mine.filter((r) => r.faults.length > 0).length} of ${mine.length} sessions left out for a fault in the set-up, ${mine.filter((r) => r.flags.length > 0).length} kept and flagged`;
  });
}

// Runs every question in every open arm, `runs` times, and returns one row per session. Each
// call stages into its own folder, so two calls at once cannot collide, and removes it after.
export function runOpenArms(questions, { runs = 1, outDir, seed = String(Date.now()), say = () => {}, asker = ask, stageRoot = join(STAGE_ROOT, `open-${uniqueCodes(1)[0]}`) } = {}) {
  assertCleanAncestors(stageRoot);
  // The model can see the name of the folder it runs in, so the name must not describe the arm.
  const staged = Object.fromEntries(OPEN_ARMS.map(([arm], i) => [arm, stageArm(join(stageRoot, `w${i + 1}`), arm)]));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify({ started: new Date().toISOString(), model: MODEL, effort: EFFORT, version: asker === ask ? programVersion() : null, runs, seed, questions, staged: Object.fromEntries(OPEN_ARMS.map(([arm, label]) => [label, { digest: stagedDigest(staged[arm]), files: Object.keys(staged[arm].files) }])) }, null, 2)}\n`);
  const random = seededRandom(seed);
  const rows = [];
  for (let run = 1; run <= runs; run += 1) {
    for (const question of questions) {
      for (const [arm] of shuffle(OPEN_ARMS, random)) {
        const done = asker(staged[arm].dir, question.prompt);
        const dir = join(outDir, 'logs', arm, `r${run}`);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, `${question.id}.jsonl`), done.stream);
        writeFileSync(join(dir, `${question.id}.md`), transcript(done.stream, { question: question.id, run, prompt: question.prompt, stageDir: staged[arm].dir }));
        const row = { ...summarise(parseLog(done.stream).events, { code: arm, run, question: question.id, stageDir: staged[arm].dir }), arm, ...splitFaults(scanLog(done.stream)) };
        rows.push(row);
        say(`run ${run} ${question.id} ${OPEN_ARMS.find(([id]) => id === arm)[1]}: ${row.steps} steps${row.faults.length ? `, FAULT: ${row.faults.join('; ')}` : ''}${row.flags.length ? `, flagged: ${row.flags.join('; ')}` : ''}`);
      }
    }
  }
  rmSync(stageRoot, { recursive: true, force: true });
  return rows;
}
