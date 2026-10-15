// Schedules the supplement's sealed run: a random code for every arm, a random number for every
// answer, and the order of sessions from a seed nobody chooses. The seed is the fingerprint of the
// question files and of every arm as it will be staged, so it does not exist until the freeze.
//
//   node tools/sup-schedule.mjs --name sup1 [--runs 3]

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { option, runCli } from '../lib/cli.mjs';
import { REPO, runDir } from '../lib/config.mjs';
import { seededRandom, sha256, shuffle, uniqueNumbers } from '../lib/rng.mjs';
import { loadAllQuestions, QUESTION_SETS, stageSupArm, SUP_ARMS } from '../lib/sup.mjs';
import { buildKey, buildSessions } from './schedule.mjs';

// The fingerprint of everything the sessions will see. Staged into a scratch folder and removed.
export function freezeSeed(repo = REPO, scratch = join(repo, '.seed-stage')) {
  const parts = Object.values(QUESTION_SETS).map((file) => sha256(readFileSync(join(repo, file), 'utf8').replace(/\r\n/g, '\n')));
  for (const arm of SUP_ARMS) parts.push(sha256(JSON.stringify(stageSupArm(join(scratch, arm), arm, { repo }).files)));
  rmSync(scratch, { recursive: true, force: true });
  return sha256(parts.join('\n'));
}

function main() {
  const name = option('name');
  if (!name) throw new Error('Usage: node tools/sup-schedule.mjs --name NAME [--runs 3]');
  const dir = runDir(name);
  if (existsSync(join(dir, 'schedule.json'))) throw new Error(`Run "${name}" already has a schedule. A schedule is never redrawn.`);
  const runs = Number(option('runs', '3'));
  const seed = freezeSeed();
  const questionIds = loadAllQuestions().map((q) => q.id);
  const key = buildKey(shuffle(SUP_ARMS, seededRandom(`${seed}-arms`)));
  const sessions = buildSessions(questionIds, [...key.codes].sort(), runs, seed);
  const numbers = uniqueNumbers(sessions.length);
  const answers = Object.fromEntries(sessions.map((s, i) => [numbers[i], { code: s.code, run: s.run, question: s.question }]));
  const keyText = `${JSON.stringify({ salt: key.salt, arms: key.arms, answers }, null, 2)}\n`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'schedule.json'), `${JSON.stringify({ name, seed, runs, created: new Date().toISOString(), questions: questionIds, sessions }, null, 2)}\n`);
  writeFileSync(join(dir, 'key.json'), keyText);
  writeFileSync(join(dir, 'key.sha256'), `${sha256(keyText)}\n`);
  console.log(`${sessions.length} sessions scheduled for "${name}" (${runs} runs, ${questionIds.length} questions, ${key.codes.length} arms). Seed ${seed}.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(main);
