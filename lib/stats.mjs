// The counting rules. One place decides what "fewer", "more" and "no clear difference" mean.

import { RULE_CLEAR_AT_LEAST } from './config.mjs';

export const mean = (numbers) => (numbers.length === 0 ? null : numbers.reduce((total, n) => total + n, 0) / numbers.length);
export const fixed = (number, places = 2) => (number === null || number === undefined ? '' : Number(number).toFixed(places));

// Compares two groups question by question on the mean of one measure.
// A question with no clean session in either group is counted as missing.
export function compareByQuestion(questions, rowsA, rowsB, measure) {
  const tally = { lower: 0, higher: 0, equal: 0, missing: 0, perQuestion: [] };
  for (const question of questions) {
    const a = mean(rowsA.filter((r) => r.question === question).map((r) => r[measure]));
    const b = mean(rowsB.filter((r) => r.question === question).map((r) => r[measure]));
    let verdict = 'missing';
    if (a !== null && b !== null) verdict = a < b ? 'lower' : a > b ? 'higher' : 'equal';
    tally[verdict] += 1;
    tally.perQuestion.push({ question, a, b, verdict });
  }
  tally.meanA = mean(rowsA.map((r) => r[measure]));
  tally.meanB = mean(rowsB.map((r) => r[measure]));
  return tally;
}

// The counting rule. A direction is clear only at 9 or more of the questions. A tie or a
// question with no clean session is neither, and stays in the count, so it works against a
// clear direction: two of them and no direction can be called.
export function outcome(tally) {
  if (tally.lower >= RULE_CLEAR_AT_LEAST) return 'fewer';
  if (tally.higher >= RULE_CLEAR_AT_LEAST) return 'more';
  return 'unclear';
}

// One of three sentences, each carrying both means so that none of them is only a yes or no.
export function headlineSentence(tally) {
  const total = tally.perQuestion.length;
  const pair = `${fixed(tally.meanA)} per session against ${fixed(tally.meanB)}`;
  const kind = outcome(tally);
  if (kind === 'fewer') return `With the folder loaded first, the model took fewer steps on ${tally.lower} of ${total} questions (${pair}).`;
  if (kind === 'more') return `With the folder loaded first, the model took more steps on ${tally.higher} of ${total} questions (${pair}). The folder made it work more.`;
  return `Loading the folder did not clearly change how many steps the model took: fewer on ${tally.lower} of ${total} questions, more on ${tally.higher}, equal on ${tally.equal} (${pair}). This means the rule could not tell, not that there was no difference.`;
}

// Steps are never published alone. This is the sentence that always follows the headline, and
// the extra one for a folder that cut steps and lost right answers by both markers' counts.
// The count of a marker from another maker, where there is one, is given as well. A folder
// that reached more right answers by both passes is said so, whatever the steps did.
export function correctnessSentences(tally, full, docs, outside = null) {
  const lines = [`Marked with the arm hidden, the full folder was correct on ${full.one} of ${full.total} answers and the documents alone on ${docs.one} of ${docs.total} (the same model marking a second time: ${full.two} and ${docs.two}).`];
  if (outside) lines.push(`A model from another maker, also with the arm hidden, marked the same answers: ${outside.full} of ${full.total} and ${outside.docs} of ${docs.total}.`);
  const fewerRight = full.one < docs.one && full.two < docs.two;
  if (outcome(tally) === 'fewer' && fewerRight) lines.push('The folder reached fewer right answers. Fewer steps did not come with equal answers.');
  if (full.one > docs.one && full.two > docs.two) lines.push('The folder reached more right answers by both passes. The rule below asks only that right answers do not fall, so this does not count toward it.');
  return lines;
}

// A prediction of "lower with the file on": supported at 9 or more questions lower, shown
// wrong at 9 or more higher, and otherwise neither.
export function predictionVerdict(tally) {
  if (tally.lower >= RULE_CLEAR_AT_LEAST) return 'supported';
  if (tally.higher >= RULE_CLEAR_AT_LEAST) return 'shown wrong';
  return 'not shown either way';
}
