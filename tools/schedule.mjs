// Draws the order of sessions from a recorded seed, a random code for every arm and a random
// number for every answer. Writes the schedule (codes only), the key, and the key's fingerprint.
//
//   node tools/schedule.mjs --name pass1 --runs 1 [--seed TEXT]

import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { option, runCli } from '../lib/cli.mjs';
import { allArms, QUESTIONS_FILE, runDir } from '../lib/config.mjs';
import { loadQuestions } from '../lib/questions.mjs';
import { seededRandom, sha256, shuffle, uniqueCodes, uniqueNumbers } from '../lib/rng.mjs';

// One block is one question in one run. Inside a block every arm runs, in a seeded random order.
export function buildSessions(questionIds, codes, runs, seed) {
  const random = seededRandom(seed);
  const sessions = [];
  for (let run = 1; run <= runs; run += 1) {
    for (const question of shuffle(questionIds, random)) {
      for (const code of shuffle(codes, random)) sessions.push({ order: sessions.length + 1, run, question, code });
    }
  }
  return sessions;
}

export function buildKey(arms) {
  const codes = uniqueCodes(arms.length);
  const armsByCode = Object.fromEntries(codes.map((code, i) => [code, arms[i]]));
  return { salt: randomBytes(16).toString('hex'), arms: armsByCode, codes };
}

function main() {
  const name = option('name');
  if (!name) throw new Error('Usage: node tools/schedule.mjs --name NAME --runs N [--seed TEXT]');
  const dir = runDir(name);
  if (existsSync(join(dir, 'schedule.json'))) throw new Error(`Run "${name}" already has a schedule. A schedule is never redrawn; pick a new name.`);
  const runs = Number(option('runs', '3'));
  const seed = option('seed', randomBytes(8).toString('hex'));
  const questionIds = loadQuestions(QUESTIONS_FILE).map((q) => q.id);
  const key = buildKey(shuffle(allArms(), seededRandom(`${seed}-arms`)));
  const sessions = buildSessions(questionIds, [...key.codes].sort(), runs, seed);
  const numbers = uniqueNumbers(sessions.length);
  const answers = Object.fromEntries(sessions.map((s, i) => [numbers[i], { code: s.code, run: s.run, question: s.question }]));
  const keyText = `${JSON.stringify({ salt: key.salt, arms: key.arms, answers }, null, 2)}\n`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'schedule.json'), `${JSON.stringify({ name, seed, runs, created: new Date().toISOString(), questions: questionIds, sessions }, null, 2)}\n`);
  writeFileSync(join(dir, 'key.json'), keyText);
  writeFileSync(join(dir, 'key.sha256'), `${sha256(keyText)}\n`);
  console.log(`${sessions.length} sessions scheduled for "${name}" (${runs} run(s), ${questionIds.length} questions, ${key.codes.length} arms). Seed ${seed}.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(main);
