// Runs questions that were written after the folder was frozen, by someone who had not seen
// it, in three arms: the full folder, the documents alone, and nothing. Writes a report with
// every answer beside the expected one, for a person to read.
//
//   node tools/heldout.mjs --name heldout1 --questions held-out-questions.md [--runs 3]

import { existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { option, runCli } from '../lib/cli.mjs';
import { EFFORT, MODEL, runDir } from '../lib/config.mjs';
import { notices, OPEN_ARMS, runOpenArms, STEPS_CAUTION } from '../lib/mini.mjs';
import { loadQuestions } from '../lib/questions.mjs';
import { fixed, mean } from '../lib/stats.mjs';

export function heldOutReport(questions, rows) {
  const lines = ['# Held-out questions', '', `Model: ${MODEL}, effort ${EFFORT}. These questions were not among the committed ten.`, '', '| Question | Arm | Sessions | Steps | Documents opened | Answer words | Faults |', '|---|---|---|---|---|---|---|'];
  for (const q of questions) {
    for (const [arm, label] of OPEN_ARMS) {
      const mine = rows.filter((r) => r.question === q.id && r.arm === arm);
      const cell = (measure) => fixed(mean(mine.map((r) => r[measure])));
      lines.push(`| ${q.id} | ${label} | ${mine.length} | ${cell('steps')} | ${cell('documentsOpened')} | ${cell('words')} | ${mine.filter((r) => r.faults.length > 0).length} |`);
    }
  }
  lines.push('', STEPS_CAUTION, ...notices(rows).map((line) => `Notice: ${line}`), '');
  for (const q of questions) {
    lines.push(`## ${q.id}`, '', `**Question:** ${q.prompt}`, '', `**Expected answer:** ${q.expected || '(none given)'}`, '');
    for (const [arm, label] of OPEN_ARMS) {
      for (const row of rows.filter((r) => r.question === q.id && r.arm === arm)) lines.push(`### ${label}, run ${row.run}`, '', row.answer.trim(), '');
    }
  }
  return lines.join('\n');
}

function main() {
  const name = option('name');
  const file = option('questions');
  if (!name || !file) throw new Error('Usage: node tools/heldout.mjs --name NAME --questions FILE [--runs 3]');
  if (existsSync(runDir(name))) throw new Error(`runs/${name} already exists. Pick a new name; a run is never overwritten.`);
  const questions = loadQuestions(resolve(file));
  const rows = runOpenArms(questions, { runs: Number(option('runs', '3')), outDir: runDir(name), say: console.log });
  writeFileSync(join(runDir(name), 'report.md'), heldOutReport(questions, rows));
  console.log(`\nReport: runs/${name}/report.md`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(main);
