// Checks the key-fact patterns for the new and held-out question sets.
//   node verify/key-facts-sets.test.mjs
// (a) every expected answer in questions-new.md and questions-heldout.md holds every fact;
// (b) every positive fixture matches and every negative fixture does not;
// (c) every recorded known limit still matches as recorded. Prints a summary count and exits
// non-zero on any failure.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FACTS_HELDOUT, FACTS_NEW, missingFactsIn, squeeze } from '../tools/key-facts-sets.mjs';
import { FIXTURES_HELDOUT, FIXTURES_NEW, knownLimits } from '../tools/key-facts-sets.fixtures.mjs';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const count = { expected: 0, facts: 0, positives: 0, negatives: 0, limits: 0 };

function expectedAnswers(file) {
  const text = readFileSync(join(REPO, file), 'utf8');
  const out = {};
  for (const block of text.split(/^## /m).slice(1)) {
    const id = block.match(/^(\S+)/)[1];
    const answer = block.match(/\*\*Expected answer:\*\*\s*(.+)/);
    if (answer) out[id] = answer[1];
  }
  return out;
}

const SETS = [
  { name: 'new', file: 'questions-new.md', facts: FACTS_NEW, fixtures: FIXTURES_NEW },
  { name: 'heldout', file: 'questions-heldout.md', facts: FACTS_HELDOUT, fixtures: FIXTURES_HELDOUT },
];

for (const { name, file, facts, fixtures } of SETS) {
  const answers = expectedAnswers(file);
  const ids = Object.keys(answers);
  const missingIds = ids.filter((id) => !(id in facts));
  const extraIds = Object.keys(facts).filter((id) => !(id in answers));
  if (missingIds.length || extraIds.length) failures.push(`${name}: ids without facts [${missingIds}], facts without a question [${extraIds}]`);

  for (const id of ids) {
    count.expected += 1;
    const missing = missingFactsIn(facts, id, answers[id]);
    if (missing.length) failures.push(`${name} ${id}: expected answer misses ${missing.join('; ')}`);
  }

  for (const [id, list] of Object.entries(facts)) {
    for (const [fact, pattern] of list) {
      count.facts += 1;
      const fixture = fixtures[id]?.[fact];
      if (!fixture) { failures.push(`${name} ${id}: no fixture for "${fact}"`); continue; }
      if (!fixture.negatives?.length) failures.push(`${name} ${id}: no negative for "${fact}"`);
      count.positives += 1;
      if (!pattern.test(squeeze(fixture.positive))) failures.push(`${name} ${id} "${fact}": positive does not match: ${fixture.positive}`);
      for (const negative of fixture.negatives ?? []) {
        count.negatives += 1;
        if (pattern.test(squeeze(negative))) failures.push(`${name} ${id} "${fact}": negative matches: ${negative}`);
      }
    }
    for (const fact of Object.keys(fixtures[id] ?? {})) {
      if (!list.some(([n]) => n === fact)) failures.push(`${name} ${id}: fixture for unknown fact "${fact}"`);
    }
  }
}

for (const limit of knownLimits) {
  count.limits += 1;
  const facts = limit.set === 'new' ? FACTS_NEW : FACTS_HELDOUT;
  const entry = facts[limit.id]?.find(([n]) => n === limit.fact);
  if (!entry) failures.push(`known limit ${limit.id}: unknown fact "${limit.fact}"`);
  else if (!entry[1].test(squeeze(limit.sentence))) failures.push(`known limit ${limit.id} "${limit.fact}" no longer matches; remove it: ${limit.sentence}`);
}

for (const line of failures) console.log(`FAIL ${line}`);
console.log(`Expected answers holding every fact: ${count.expected - failures.filter((f) => f.includes('expected answer misses')).length}/${count.expected}`);
console.log(`Facts: ${count.facts}; positives: ${count.positives}; negatives: ${count.negatives}; known limits: ${count.limits}`);
console.log(failures.length ? `${failures.length} failure(s)` : 'All checks pass.');
process.exitCode = failures.length ? 1 : 0;
