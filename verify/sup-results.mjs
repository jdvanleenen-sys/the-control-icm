// The figures printed beside the verdicts: means per arm, the replication check on the entry's
// questions, the planted answers, the giveaway guesses and the per-question differences.
// Descriptive only; nothing here changes a verdict.
//
//   node verify/sup-results.mjs --name sup2

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { option, runCli } from '../lib/cli.mjs';
import { runDir } from '../lib/config.mjs';
import { SUP_ARMS } from '../lib/sup.mjs';
import { holdsEveryFact, tally, threshold } from './sup-verdict.mjs';

const mean = (v) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : null);
const f = (x, d = 2) => (x === null ? '-' : x.toFixed(d));
const byId = (a, b) => a.localeCompare(b, 'en', { numeric: true });

function readCsv(path) {
  const [head, ...lines] = readFileSync(path, 'utf8').replace(/\r\n/g, '\n').trim().split('\n');
  const keys = head.split(',');
  return lines.map((l) => Object.fromEntries(l.split(',').map((v, i) => [keys[i], v.trim()])));
}

export function results(dir) {
  const key = JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8'));
  const numberOf = Object.fromEntries(Object.entries(key.answers).map(([n, a]) => [`${a.code}|${a.run}|${a.question}`, n]));
  const rows = JSON.parse(readFileSync(join(dir, 'rows-coded.json'), 'utf8')).map((r) => ({ ...r, arm: key.arms[r.code], number: numberOf[`${r.code}|${r.run}|${r.question}`] }));
  const marks = { 'Claude Opus 5.5': readCsv(join(dir, 'marks-opus.csv')), Gemini: readCsv(join(dir, 'marks-gemini.csv')) };
  const markOf = Object.fromEntries(Object.entries(marks).map(([m, list]) => [m, Object.fromEntries(list.map((x) => [x.number, x]))]));
  const sets = { new: (q) => q.startsWith('N'), exam: (q) => q.startsWith('Q'), heldout: (q) => q.startsWith('H') };
  const out = ['# Figures beside the verdicts', '', `Run ${dir.split(/[\\/]/).pop()}. Sessions: ${rows.length}; with a fault: ${rows.filter((r) => r.faults.length).length}.`, ''];

  out.push('## Means per session, new questions (the primary set)', '', '| Arm | Document steps | Instruction steps | Total steps | Characters loaded first | Characters fetched | Text in all | Answer words | Tokens in | Seconds | Holds every key fact | Right, Opus | Right, Gemini |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const arm of SUP_ARMS) {
    const g = rows.filter((r) => r.arm === arm && sets.new(r.question));
    const right = (m) => g.filter((r) => markOf[m][r.number]?.grade === 'correct').length;
    out.push(`| ${arm} | ${f(mean(g.map((r) => r.documentSteps)))} | ${f(mean(g.map((r) => r.instructionSteps)))} | ${f(mean(g.map((r) => r.steps)))} | ${f(mean(g.map((r) => r.loadedChars)), 0)} | ${f(mean(g.map((r) => r.charsFetched)), 0)} | ${f(mean(g.map((r) => r.textChars)), 0)} | ${f(mean(g.map((r) => r.words)), 0)} | ${f(mean(g.map((r) => r.tokensIn)), 0)} | ${f(mean(g.map((r) => r.seconds)), 1)} | ${g.filter((r) => holdsEveryFact(r.question, r.answer)).length} of ${g.length} | ${right('Claude Opus 5.5')} of ${g.length} | ${right('Gemini')} of ${g.length} |`);
  }

  out.push('', '## Replication check: the entry\'s folder against the documents alone, on the entry\'s 20 questions', '', 'The entry found the folder took clearly fewer steps, put more text in front of the model, and held every key fact in fewer answers. Not marked; key facts counted by script.', '', '| Set | Questions | Steps, folder lower / higher / equal | Steps, folder / docs | Text, folder / docs | Holds every key fact, folder / docs |', '|---|---|---|---|---|---|');
  for (const set of ['exam', 'heldout']) {
    const qs = [...new Set(rows.filter((r) => sets[set](r.question)).map((r) => r.question))].sort(byId);
    const pool = rows.filter((r) => sets[set](r.question));
    const t = tally(pool, qs, 'folder', 'docs', (r) => r.steps);
    const g = (arm) => pool.filter((r) => r.arm === arm);
    out.push(`| ${set} | ${qs.length} | ${t.lower} / ${t.higher} / ${t.tie} (clear at ${threshold(qs.length)}) | ${f(mean(g('folder').map((r) => r.steps)))} / ${f(mean(g('docs').map((r) => r.steps)))} | ${f(mean(g('folder').map((r) => r.textChars)), 0)} / ${f(mean(g('docs').map((r) => r.textChars)), 0)} | ${g('folder').filter((r) => holdsEveryFact(r.question, r.answer)).length} / ${g('docs').filter((r) => holdsEveryFact(r.question, r.answer)).length} of ${g('docs').length} |`);
  }

  const plants = readCsv(join(dir, 'marking-key.csv'));
  out.push('', '## Planted answers of known grade', '', '| Number | Known grade | Opus | Gemini |', '|---|---|---|---|');
  for (const p of plants) out.push(`| ${p.number} | ${p.grade} | ${markOf['Claude Opus 5.5'][p.number]?.grade} | ${markOf.Gemini[p.number]?.grade} |`);

  out.push('', '## Giveaway check: how often each marker guessed the arm', '', 'An arm counts as guessed when the guess matches how its instructions arrived: `loaded` for folder and icm-eager, `staged` for icm, `none` for docs. At 70% or more the answers gave the arm away.', '', '| Marker | Guessed right | Of | Share |', '|---|---|---|---|');
  const truth = { docs: 'none', folder: 'loaded', 'icm-eager': 'loaded', icm: 'staged' };
  for (const m of Object.keys(marks)) {
    const real = rows.filter((r) => sets.new(r.question) && markOf[m][r.number]);
    const ok = real.filter((r) => markOf[m][r.number].guess === truth[r.arm]).length;
    out.push(`| ${m} | ${ok} | ${real.length} | ${f(ok / real.length)} |`);
  }

  out.push('', '## Per question, new set: mean document steps and text per arm, and answers right by each reading', '', '| Question | docs steps | folder steps | icm steps | icm-eager steps | docs text | folder text | icm text | icm-eager text | Answers not right (docs / folder / icm / icm-eager), key facts · Opus · Gemini |', '|---|---|---|---|---|---|---|---|---|---|');
  for (const q of [...new Set(rows.filter((r) => sets.new(r.question)).map((r) => r.question))].sort(byId)) {
    const g = (arm) => rows.filter((r) => r.arm === arm && r.question === q);
    const miss = (arm) => [g(arm).filter((r) => !holdsEveryFact(q, r.answer)).length, g(arm).filter((r) => markOf['Claude Opus 5.5'][r.number]?.grade !== 'correct').length, g(arm).filter((r) => markOf.Gemini[r.number]?.grade !== 'correct').length].join('·');
    out.push(`| ${q} | ${SUP_ARMS.map((a) => f(mean(g(a).map((r) => r.documentSteps)))).join(' | ')} | ${SUP_ARMS.map((a) => f(mean(g(a).map((r) => r.textChars)), 0)).join(' | ')} | ${SUP_ARMS.map(miss).join(' / ')} |`);
  }
  return `${out.join('\n')}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(() => { const dir = runDir(option('name') ?? ''); const text = results(dir); writeFileSync(join(dir, 'figures.md'), text); process.stdout.write(text); });
}
