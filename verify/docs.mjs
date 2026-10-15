// One source of truth. The numbers that govern the experiment live in lib/config.mjs. Where a
// page for people states one of them, this check makes sure the page and the code still agree.
// A page that is not in the repo is skipped.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EFFORT, FAULT_LIMIT, MAX_ATTEMPTS, PINNED_MODEL, REPO, RULE_CLEAR_AT_LEAST } from '../lib/config.mjs';

const NUMBER_WORDS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five' };

// Each entry: the page, the phrase it must contain, and what that phrase is tied to.
export function statedValues() {
  return [
    ['EXPERIMENT.md', `${RULE_CLEAR_AT_LEAST} or 10`, 'the number of questions that makes a direction clear'],
    ['PREREGISTRATION.md', `${FAULT_LIMIT * 100}%`, 'the share of faulty sessions that voids a run'],
    ['PREREGISTRATION.md', `${NUMBER_WORDS[MAX_ATTEMPTS] ?? MAX_ATTEMPTS} attempts`, 'how many times a session with no answer is tried'],
    ['RUN.md', PINNED_MODEL, 'the pinned model'],
    ['RUN.md', `effort \`${EFFORT}\``, 'the effort level'],
  ];
}

export function checkDocs(repo = REPO, values = statedValues()) {
  const failures = [];
  for (const [page, phrase, meaning] of values) {
    const path = join(repo, page);
    if (!existsSync(path)) continue;
    if (!readFileSync(path, 'utf8').replace(/\s+/g, ' ').includes(phrase)) failures.push(`${page} no longer states "${phrase}" (${meaning}); the page and lib/config.mjs disagree`);
  }
  return failures;
}
