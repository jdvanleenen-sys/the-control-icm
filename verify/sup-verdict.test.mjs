// Tests the supplement's rule on made-up data, one case per outcome, before any real data exists.
//
//   node verify/sup-verdict.test.mjs

import assert from 'node:assert/strict';
import { answerMargin, compare, threshold, verdicts } from './sup-verdict.mjs';

// Thresholds named in PLAN.md.
assert.deepEqual([10, 15, 16, 17, 18, 19, 20, 30, 40].map(threshold), [9, 12, 13, 13, 14, 15, 15, 21, 27]);
assert.equal(answerMargin(54), 3);
assert.equal(answerMargin(60), 3);

const QUESTIONS = Array.from({ length: 18 }, (_, i) => `N${i + 1}`);

// Three runs per question per arm. `shape(arm, q, i)` returns the row's measures.
function make(shape) {
  const rows = [];
  for (const arm of ['docs', 'folder', 'icm', 'icm-eager']) {
    QUESTIONS.forEach((q, i) => {
      for (let run = 1; run <= 3; run += 1) rows.push({ arm, question: q, run, faults: [], documentSteps: 5, instructionSteps: 0, textChars: 8000, right: true, ...shape(arm, q, i, run) });
    });
  }
  return rows;
}
const READINGS = { one: (r) => r.right, two: (r) => r.right };
const PAIR = { first: 'icm', second: 'docs', subject: 'the ICM workspace', against: 'the documents alone' };

// Earned: fewer document steps on every question, same answers, same text.
let r = compare(make((arm) => (arm === 'icm' ? { documentSteps: 2 } : {})), QUESTIONS, READINGS, PAIR);
assert.equal(r.outcome, 'earned');
assert.match(r.sentence, /^On these questions the ICM workspace earned its place against the documents alone\.$/);

// Earned, with the clause: fewer document steps but more steps in all.
r = compare(make((arm) => (arm === 'icm' ? { documentSteps: 2, instructionSteps: 5 } : {})), QUESTIONS, READINGS, PAIR);
assert.equal(r.outcome, 'earned');
assert.match(r.sentence, /took more steps in all/);

// Did not earn: text more than 5% higher.
r = compare(make((arm) => (arm === 'icm' ? { documentSteps: 2, textChars: 8500 } : {})), QUESTIONS, READINGS, PAIR);
assert.equal(r.outcome, 'did not earn');
assert.match(r.sentence, /text rose by more than 5%/);

// Text exactly 5% higher still holds.
r = compare(make((arm) => (arm === 'icm' ? { documentSteps: 2, textChars: 8400 } : {})), QUESTIONS, READINGS, PAIR);
assert.equal(r.conditions.text, 'holds');

// Did not earn: three fewer right answers in one reading; two fewer still holds.
r = compare(make((arm, q, i, run) => (arm === 'icm' ? { documentSteps: 2, right: !(i < 3 && run === 1) } : {})), QUESTIONS, READINGS, PAIR);
assert.equal(r.conditions.answers, 'fails');
r = compare(make((arm, q, i, run) => (arm === 'icm' ? { documentSteps: 2, right: !(i < 2 && run === 1) } : {})), QUESTIONS, READINGS, PAIR);
assert.equal(r.conditions.answers, 'holds');

// Could not tell: fewer steps on 13 of 18 only, nothing failed.
r = compare(make((arm, q, i) => (arm === 'icm' && i < 13 ? { documentSteps: 2 } : {})), QUESTIONS, READINGS, PAIR);
assert.equal(r.outcome, 'could not tell');
// Clear at 14.
r = compare(make((arm, q, i) => (arm === 'icm' && i < 14 ? { documentSteps: 2 } : {})), QUESTIONS, READINGS, PAIR);
assert.equal(r.outcome, 'earned');

// Did not earn: steps clearly higher.
r = compare(make((arm) => (arm === 'icm' ? { documentSteps: 9 } : {})), QUESTIONS, READINGS, PAIR);
assert.match(r.sentence, /document steps clearly rose/);

// A faulty session is left out of every count.
r = compare(make((arm, q, i, run) => (arm === 'icm' ? { documentSteps: 2, ...(run === 1 && i < 5 ? { faults: ['x'], right: false } : {}) } : {})), QUESTIONS, READINGS, PAIR);
assert.equal(r.conditions.answers, 'holds');

// Better than both only if both comparisons earn.
const all = verdicts(make((arm) => (arm === 'icm' ? { documentSteps: 1 } : {})), QUESTIONS, READINGS);
assert.equal(all.both, true);
const notBoth = verdicts(make((arm) => (arm === 'icm' ? { documentSteps: 1 } : arm === 'folder' ? { documentSteps: 1 } : {})), QUESTIONS, READINGS);
assert.equal(notBoth.both, false);

console.log('sup-verdict: all cases pass');
