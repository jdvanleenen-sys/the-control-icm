// Counts, by a search of the text, how many answers hold every fact that a question's
// "Correct requires" line asks for. No marker and no model is involved: the same answer gives
// the same count every time, on any machine.
//
//   node tools/key-facts.mjs              every batch of answers in this repo
//   node tools/key-facts.mjs --validate   only the two set-ups the patterns were checked on
//
// What it is not: a mark. It does not read the conclusion of an answer, so it cannot tell a
// right yes from a wrong one, and a fact can be present in a sentence that gets it wrong. It
// answers one narrow question that a marker answers differently from day to day: did the
// answer say the things the key says it must?

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from '../lib/cli.mjs';
import { ARM_DOCS_ONLY, ARM_EMPTY, ARM_FULL, REPO, armLabel } from '../lib/config.mjs';
import { parseLog, resultRecord } from '../lib/session.mjs';

// One entry for each thing a "Correct requires" line says the answer must give. Only the
// "must" half of each line is here; the "it is wrong if" half needs a reader. Each pattern is
// tried on the answer with its spaces squeezed and its case kept.
export const FACTS = {
  Q1: [['19:40, the seat deadline', /19[:.]40/], ['19:00, the doors', /19[:.]00/]],
  Q2: [['£24', /£\s?24(?!\d)/], ['£28', /£\s?28(?!\d)/]],
  Q3: [['no warning is needed', /without (a |any |first |prior )*warning|no (prior |advance |earlier |previous )?warning|warning (is|was) not (required|needed)|not (required|need(ed)?) to (be )?(give|warn)|does(n't| not) (need|require|have to)|immediate(ly)?/i], ['the ordinary procedure it departs from', /ask(s|ed|ing)? .{0,40}to stop|stop (first|when asked)|refus|ordinary|normal(ly)?|usual(ly)?|standard procedure|otherwise/i]],
  Q4: [['£7, the standard price', /£\s?7(?!\d)/], ['£4, the member price', /£\s?4(?!\d)/]],
  Q5: [['£3', /£\s?3(?!\d)/], ['under 12', /under(-| )?12|under twelve|aged? (9|nine)|9-year-old|nine-year-old/i], ['accompanied', /accompan/i]],
  Q6: [['£25, the total', /£\s?25(?!\d)/], ['£10, the speaker', /£\s?10(?!\d)/], ['£5 a set, or £15 for three', /£\s?5(?!\d)|£\s?15(?!\d)/]],
  Q7: [['21:30, the cutoff', /21[:.]30/], ['the 15-minute overrun', /15[ -]minutes?|fifteen[ -]minutes?|quarter of an hour/i]],
  Q8: [['£48', /£\s?48(?!\d)/], ['the ten-member minimum', /\bten\b|\b10\b/i]],
  Q9: [['21 people', /\b21\b|twenty-one/i], ['capacity of 24', /\b24\b|twenty-four/i], ['supervision', /supervis/i]],
  Q10: [['a quorum of four', /\bfour\b|\b4\b/i], ['remote attendance', /remote|video/i], ['that the papers do not settle it', /do(es)? not (say|address|cover|specify|state|define|settle|decide)|don't (say|address|cover|specify|state|settle)|doesn't (say|address|cover|specify|state|settle)|not (addressed|covered|specified|stated|defined|settled|decided)|unspecified|silent|leaves? .{0,40}(open|undecided|unspecified|undefined)|left .{0,30}(open|undecided|unspecified|undefined)|no rule|cannot (say|tell|determine|be determined|establish)|can't (say|tell|determine)|not (able|possible) to (say|tell|determine)/i]],
};

const squeeze = (text) => String(text ?? '').replace(/[   ]/g, ' ').replace(/\s+/g, ' ');
const questionId = (name) => `Q${Number(String(name).match(/\d+/)[0])}`;

// Which of a question's facts an answer leaves out. An empty list means it holds them all.
export function missingFacts(question, answer) {
  const text = squeeze(answer);
  return (FACTS[question] ?? []).filter(([, pattern]) => !pattern.test(text)).map(([name]) => name);
}

function answerOf(path) {
  return String(resultRecord(parseLog(readFileSync(path, 'utf8')).events)?.result ?? '');
}

// Every answer under a folder laid out as <arm>/<run>/<question>.jsonl.
function readArm(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort().flatMap((run) => readdirSync(join(dir, run)).filter((name) => name.endsWith('.jsonl')).sort()
    .map((name) => ({ run, question: questionId(name), missing: missingFacts(questionId(name), answerOf(join(dir, run, name))) })));
}

const whole = (rows) => rows.filter((row) => row.missing.length === 0).length;
const line = (label, rows) => `| ${label} | ${rows.length} | ${whole(rows)} | ${rows.length - whole(rows)} |`;
const HEAD = ['| Set-up | Answers | Hold every fact the key asks for | Leave at least one out |', '|---|---|---|---|'];

function sealedArms() {
  const run = join(REPO, 'runs', 'sealed');
  const key = JSON.parse(readFileSync(join(run, 'key.json'), 'utf8'));
  return Object.entries(key.arms).map(([code, arm]) => ({ arm, rows: readArm(join(run, 'logs', code)) }));
}

function leftOut(rows) {
  const tally = {};
  for (const row of rows) for (const name of row.missing) tally[`${row.question}: ${name}`] = (tally[`${row.question}: ${name}`] ?? 0) + 1;
  return Object.entries(tally).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })).map(([name, count]) => `- ${name}: left out of ${count}`);
}

export function report({ validateOnly = false } = {}) {
  const sealed = sealedArms();
  const of = (arm) => sealed.find((entry) => entry.arm === arm).rows;
  const out = ['# The facts the answer key asks for, counted by a search of the text', ''];
  out.push('## The two set-ups the patterns were checked on', '', ...HEAD, line('Documents only, sealed run', of(ARM_DOCS_ONLY)), line('Empty, sealed run', of(ARM_EMPTY)), '', ...leftOut(of(ARM_DOCS_ONLY)), '');
  if (validateOnly) return out.join('\n');

  out.push('## The sealed run, every set-up', '', ...HEAD);
  for (const { arm, rows } of sealed) out.push(line(armLabel(arm), rows));
  out.push('', 'What the full folder left out in the sealed run:', '', ...leftOut(of(ARM_FULL)), '');

  const later = [
    ['Re-run from a fresh clone', 'after-the-run/rerun/logs', { 'Full folder': 'c1111', 'Documents only': 'docs' }],
    ['Re-run by an outside person', 'after-the-run/outsider/rerun/logs', { 'Full folder': 'c1111', 'Documents only': 'docs' }],
    ['Re-run after the tool changes', 'after-the-run/rerun-after-changes/logs', { 'Full folder': 'c1111', 'Documents only': 'docs' }],
    ['First follow-up, the changed folder alone', 'folder-change/exam/logs', { 'Changed folder': 'c1111', 'Documents only': 'docs' }],
    ['Side by side', 'folder-change/side-by-side/logs', { 'Unchanged folder': 'unchanged', 'Changed folder': 'changed', 'Documents only, beside unchanged': 'docsA', 'Documents only, beside changed': 'docsB' }],
  ];
  out.push('## The later batches', '', ...HEAD);
  const short = [];
  for (const [name, dir, arms] of later) {
    for (const [label, folder] of Object.entries(arms)) {
      const rows = readArm(join(REPO, dir, folder));
      out.push(line(`${name}: ${label}`, rows));
      for (const row of rows.filter((r) => r.missing.length > 0)) short.push(`- ${name}: ${label}, ${row.question} in ${row.run}: ${row.missing.join('; ')}`);
    }
  }
  out.push('', 'The answers that fall short in the later batches:', '', ...short, '');
  return out.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(() => { console.log(report({ validateOnly: process.argv.includes('--validate') })); });
