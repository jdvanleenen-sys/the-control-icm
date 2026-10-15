// Ask your own question in three arms: the full folder, the documents alone, and nothing.
// Prints what each arm did and what it answered.
//
//   node tools/ask.mjs "Under the X rules: your question"

import { join } from 'node:path';
import { runCli } from '../lib/cli.mjs';
import { EFFORT, MODEL, REPO } from '../lib/config.mjs';
import { notices, OPEN_ARMS, runOpenArms, STEPS_CAUTION } from '../lib/mini.mjs';

runCli(() => {
  const prompt = process.argv.slice(2).join(' ').trim();
  if (prompt === '') throw new Error('Give a question: node tools/ask.mjs "your question"');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const rows = runOpenArms([{ id: 'own', prompt }], { outDir: join(REPO, 'runs', `ask-${stamp}`) });

  console.log(`Question: ${prompt}`);
  console.log(`Model: ${MODEL}, effort ${EFFORT}\n`);
  console.log('| Arm | Steps | Documents opened | Searches | Tokens in | Seconds | Answer words | Faults |');
  console.log('|---|---|---|---|---|---|---|---|');
  for (const [arm, label] of OPEN_ARMS) {
    const row = rows.find((r) => r.arm === arm);
    console.log(`| ${label} | ${row.steps} | ${row.documentsOpened} | ${row.searches} | ${row.tokensIn ?? '-'} | ${row.seconds ?? '-'} | ${row.words} | ${row.faults.join('; ') || 'none'} |`);
  }
  console.log(`\n${STEPS_CAUTION}`);
  for (const notice of notices(rows)) console.log(`Notice: ${notice}`);
  for (const [arm, label] of OPEN_ARMS) console.log(`\n## ${label}\n\n${rows.find((r) => r.arm === arm).answer.trim()}`);
  console.log(`\nRaw logs and the question as sent: runs/ask-${stamp}/ (not tracked by git; delete when done)`);
  if (rows.every((r) => r.faults.length > 0)) { console.error('Every session was left out for a fault in the set-up, so nothing above is an answer. The fault is named in the table.'); process.exitCode = 1; }
});
