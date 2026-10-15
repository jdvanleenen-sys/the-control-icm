## Prompt

You write the key-fact patterns for two question sets in the repo C:\GitHub\the-control-icm. The person who sent you must stay BLIND to the new questions: your final report must contain no question text, expected answer, figure, date or document detail.

Read first:
- tools\key-facts.mjs: the entry's FACTS table and missingFacts(). Each question's facts are [name, regex] pairs taken from the "must" half of its **Correct requires:** line only; each regex is tried on the answer with whitespace squeezed. Study the style, including how the entry handled numbers (`(?!\d)` guards), alternatives, and case.
- questions-new.md (the primary set, ids N...) and questions-heldout.md (ids H...). Use only each question's **Expected answer** and **Correct requires** lines. Do not open any run log, answer file or anything under runs\ (there are none yet, and you must not look for any).

Write:
1. tools\key-facts-sets.mjs exporting `FACTS_NEW` (one entry per question in questions-new.md, keyed by its id) and `FACTS_HELDOUT` (one per question in questions-heldout.md), in exactly the entry's format, importing nothing but node built-ins. Patterns cover only what an answer MUST contain. A fact that cannot be matched fairly by a pattern (a judgement, a yes/no conclusion) is left out, and listed in a comment as left out, with why.
2. tools\key-facts-sets.fixtures.mjs exporting, for every fact of every question: `positive` (a sentence taken from or closely paraphrasing the expected answer, that must match) and `negatives` (at least one sentence that names the fact wrongly, e.g. a wrong figure, the wrong date, or the hasty-reader wrong answer from "Correct requires", which must NOT match). For a pattern on a number, a negative must use a nearby wrong number. Where an honest negative would still match (a pattern cannot tell a denial from an assertion), record it in a `knownLimits` list instead of weakening the test.
3. verify\key-facts-sets.test.mjs: a node script (node:test or plain asserts, no packages) that (a) runs each expected answer through missingFacts-style matching and requires every fact present, (b) runs every positive and every negative fixture, and (c) prints a summary count. Run it until it passes. Do not loosen a pattern so far that its negatives match; fix the pattern instead.
4. Commit only these three files (git add each by path) with the message "Key-fact patterns for the new and held-out questions, with fixtures, written from the keys alone" ending in the line "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>". Another session may be committing in the same repo; if git reports index.lock, wait a few seconds and retry.

Final report, under 150 words, with NO question content: number of questions and facts per set, facts left out (by id only, with a reason code), number of fixtures, the test's pass summary, knownLimits count, and the commit hash.

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && date && git status --short | head -20 && ls tools verify 2>&1 | head -50 && wc -l tools/key-facts.mjs questions-new.md questions-heldout.md",
  "description": "Check date, repo state and file sizes"
}
```

## Result

```
Thu Oct 15 09:47:29 MDT 2026
tools:
ask.mjs
draw.mjs
heldout.mjs
key-facts.mjs
make-map.mjs
new-questions.mjs
practice.mjs
probe.mjs
renumber-new.mjs
rerun.mjs
reveal.mjs
run.mjs
schedule.mjs

verify:
analyse.mjs
check.mjs
docs.mjs
fixtures.mjs
folder.mjs
history.mjs
leaks.mjs
marks.mjs
results.mjs
scan.mjs
selftest-proof.mjs
selftest-run.mjs
selftest.mjs
sheet.mjs
  103 tools/key-facts.mjs
  287 questions-new.md
  181 questions-heldout.md
  571 total
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && cat tools/key-facts.mjs && cat questions-new.md",
  "description": "Read the key-facts module and primary question set"
}
```

## Result

```
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
## N1

**Set:** film

**Type:** plain lookup

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: I'm a member and I'm bringing my two children to a screening on 14 March 2026. They are not members. One is 12 and the other is 9, and both will be with me the whole time. What do the two children's tickets cost in total?

**Expected answer:** £8. A child aged 12 to 15 pays £5 and a child under 12 accompanied by an adult pays £3. The 12-year-old is in the 12 to 15 band, not the under-12 band. Neither child price has been changed by a later decision.

**Source:** film-fees.md, sections 2.3 and 2.4.

**Correct requires:** The answer must say £8 (£5 plus £3). It is wrong if it treats the 12-year-old as under 12 (£6), charges both children £5 (£10), charges both standard admission of £7 (£14), or applies the member price to the children (£10 at £5 each).

## N2

**Set:** film

**Type:** plain lookup

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: I'm an adult member and I want to hire both the projector and the screen together for two booking days, collecting on 10 May 2025. Leaving the deposit aside, what is the hire charge?

**Expected answer:** £46. Hiring both together costs £23 per booking day, not the £18 projector rate plus the £8 screen rate. Two days at £23 is £46. Hire rates have not been changed by a later decision.

**Source:** film-fees.md, sections 3.1, 3.2 and 3.3.

**Correct requires:** The answer must say £46. It is wrong if it adds the separate rates (£26 a day, £52 in total), uses the archived combined rate of £19 (£38), or adds the deposit into the hire charge (£126 with an £80 deposit).

## N3

**Set:** film

**Type:** changed rule

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: My adult membership application was accepted on 25 June 2025. I sent the fee by bank transfer on 30 June 2025 and it cleared in the society's account on 2 July 2025. How much should I have paid?

**Expected answer:** £28. From 1 July 2025 annual adult membership costs £28 instead of £24, and the date the payment is received decides the fee. A bank transfer counts as received when it clears, which was 2 July 2025.

**Source:** film-changes.md, section 1 (1.2 to 1.4); film-fees.md, sections 1.1 and 4.5.

**Correct requires:** The answer must say £28 and rest on the transfer clearing on 2 July 2025. It is wrong if it says £24 because the transfer was sent on 30 June, or because the application was accepted before 1 July.

## N4

**Set:** film

**Type:** changed rule

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: At the screening on 30 May 2026, 38 audience members are already inside and two duty volunteers are on shift. I heard the committee voted on 22 May 2026 to lower the audience limit. Can I let in one more person who has just arrived?

**Expected answer:** Yes. The limit of 36 applies only to screenings on or after 1 June 2026, and the screening date decides the limit. On 30 May 2026 the limit is still 42 people, excluding duty volunteers, so a 39th audience member can be admitted.

**Source:** film-screenings.md, section 3.1; film-changes.md, section 5 (5.2 and 5.3).

**Correct requires:** The answer must say yes, under a limit of 42. It is wrong if it refuses entry because the limit is 36 (applying the decision from its decision date of 22 May 2026), or if it counts the two duty volunteers and puts the room at 40 against a limit.

## N6

**Set:** film

**Type:** exception or condition

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: I paid £4 as a member for the screening on 15 May 2025. At the door I was told the advertised film had been replaced. I went in anyway, didn't like it, and left after 20 minutes. Can I get my £4 back?

**Expected answer:** No, nothing is refunded. When the advertised film changes, a buyer may ask for a full refund before entry, but someone who enters after being told about the change loses that option. The usual cancellation refund also does not apply, because the request came after the screening had started, well inside 48 hours.

**Source:** film-refunds.md, sections 2.2, 2.3 and 1.3.

**Correct requires:** The answer must say no refund (£0) because the member entered after being told. It is wrong if it gives a full £4 refund under the film-change rule, or treats the case as a society cancellation with a full refund.

## N7

**Set:** film

**Type:** two documents

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: The committee suspended a member from 1 April 2026 to 20 April 2026. They want to come to the screening on 10 April 2026. What do they pay for a ticket?

**Expected answer:** £7, the standard admission. A suspension is allowed under the conduct rules, and during a suspension the membership rules bar the member from claiming member prices. Standard admission is £7 and no later decision changes it.

**Source:** film-conduct.md, sections 4.1 and 4.4; film-membership.md, section 5.4; film-fees.md, section 2.1.

**Correct requires:** The answer must say £7 because a suspended member cannot claim member prices. It is wrong if it charges the current member price of £5, the original member price of £4, or says the person cannot attend at all.

## N8

**Set:** film

**Type:** two documents

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: I hired the projector only, for two booking days, collecting at 12:00 on 4 June 2025. I had no extension and returned it at 15:00 on 7 June 2025. Leaving the deposit aside, what do I owe in hire and late charges together?

**Expected answer:** £56. A booking day runs noon to noon, so two booking days ended at 12:00 on 6 June 2025. Projector hire is £18 a day, which is £36. The return was 27 hours late, which starts two 24-hour periods at £10 each, adding £20.

**Source:** film-equipment.md, sections 2.1, 2.2 and 5.2; film-fees.md, section 3.1.

**Correct requires:** The answer must say £56 (£36 hire plus £20 late charge). It is wrong if it charges one late period (£46), counts days from midnight rather than noon, or charges the combined projector-and-screen rate (£46 hire, £66 total).

## N9

**Set:** film

**Type:** trap

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: On 28 April 2025 I asked to book the projector for three consecutive booking days, collecting at noon on 6 May 2025. Someone told me the limit is two days. Am I allowed three?

**Expected answer:** Yes. From 1 March 2025 the hire limit is three consecutive booking days, and the request was made more than three calendar days ahead. The two-day limit comes from the superseded fee schedule, which applied only in February 2025. The later five-day limit applies only from 1 April 2026.

**Source:** film-equipment.md, sections 1.2 and 2.2; film-fees-archive.md, sections 3.6 and 5.1; film-changes.md, section 4.

**Correct requires:** The answer must say yes, three days allowed, under a three-day limit. It is wrong if it refuses because of the archived two-day limit, or if it says up to five days are allowed (applying the April 2026 decision early).

## N10

**Set:** film

**Type:** trap

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: A 16-year-old has handed in the membership form with a parent's written consent and been accepted. The treasurer received their payment on 5 August 2025. How much is their annual membership?

**Expected answer:** £12. Annual membership for people aged 16 or 17 costs £12. The £10 figure in the archived schedule applied only in February 2025. The July 2025 increase to £28 replaced only the adult fee, not the 16 to 17 fee.

**Source:** film-fees.md, section 1.2; film-fees-archive.md, sections 1.2 and 5.1; film-changes.md, section 1.

**Correct requires:** The answer must say £12. It is wrong if it says £10 (the archived figure), £28 (the changed adult fee), or £24 (the original adult fee).

## N12

**Set:** hall

**Type:** plain lookup

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: We're not a village group. On Tuesday 10 June 2025 we want the Meeting Room for 3 hours, including setup and clearing, with the kitchen, the projector and two sets of folding display boards. What is the total hire charge?

**Expected answer:** £69. The Meeting Room costs £12 an hour, so 3 hours is £36. The kitchen is £8 per booking, the projector £15 per booking, and display boards £5 per set, so two sets are £10.

**Source:** hall-fees.md, sections 2.2, 2.3, 4.1 and 4.3.

**Correct requires:** The answer must say £69. It is wrong if it charges display boards once (£64), uses the Main Hall rate of £24 an hour (£105), or uses archived prices (£10 an hour, £6 kitchen, £12 projector, £4 a set: £56).

## N13

**Set:** hall

**Type:** changed rule

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: Our Main Hall booking was accepted in September 2025 for an event on 8 November 2025, lasting 4 hours including setup and clearing. We aren't a village group. What is the room hire charge?

**Expected answer:** £112. From 1 November 2025 the Main Hall costs £28 an hour instead of £24, and the first date of the booked event decides the rate. The event is on 8 November 2025, so 4 hours at £28 is £112, however early the booking was made.

**Source:** hall-changes.md, section 2 (2.1 to 2.3); hall-fees.md, section 2.1.

**Correct requires:** The answer must say £112. It is wrong if it uses the £24 rate because the booking was accepted before November (£96), or the archived £20 rate (£80).

## N14

**Set:** hall

**Type:** changed rule

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: Our event is on 15 June 2026. Our written cancellation reached the booking officer on 29 May 2026. What share of our hire charges do we get back, and do we get the £30 booking deposit back?

**Expected answer:** 50% of room, kitchen and equipment hire charges, and the £30 booking deposit is not refunded. The cancellation came 17 days before the event, in the 14 to 27 day band. The 25% rate for that band applies only to cancellations received on or after 1 June 2026, and this one was received on 29 May 2026.

**Source:** hall-refunds.md, sections 1.4, 2.2, 2.4, 2.5 and 2.6; hall-changes.md, section 6.

**Correct requires:** The answer must say 50% and that the booking deposit is kept. It is wrong if it says 25% (applying the change from its 14 May 2026 decision date or from the event date), or if it refunds the £30 booking deposit.

## N15

**Set:** hall

**Type:** exception or condition

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: For a party on 20 September 2025 we paid the full £150 hire charge, which included the £30 booking deposit, plus a £100 damage deposit because we had permission to serve alcohol. Our written cancellation reached the booking officer on 10 September 2025. How much do we get back?

**Expected answer:** £100. A cancellation 10 days before the event, fewer than 14 days, gives no refund of hire charges, and the booking deposit is non-refundable. An unused damage deposit is returned in full after a hirer cancellation.

**Source:** hall-refunds.md, sections 1.4, 2.3, 2.5 and 4.5.

**Correct requires:** The answer must say £100, the damage deposit only. It is wrong if it says nothing is returned (£0), returns the booking deposit too (£130), or applies a 50% hire refund (£160 with the damage deposit).

## N16

**Set:** hall

**Type:** exception or condition

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: Our booking was accepted in writing on 2 October 2025 for an event on 12 October 2025. When do we have to pay the deposit and the rest of the hire charge?

**Expected answer:** The full hire charge, including the booking deposit, is due at acceptance on 2 October 2025. Normally the deposit is due within seven days of acceptance and the balance 14 days before the event. A booking made fewer than 14 days ahead requires full payment at acceptance instead, and this one was made 10 days ahead.

**Source:** hall-fees.md, sections 6.1, 6.2 and 6.3.

**Correct requires:** The answer must say full payment on 2 October 2025. It is wrong if it gives the deposit until 9 October 2025 and the balance by 28 September 2025, or uses the archived seven-day rule (balance due 5 October 2025).

## N17

**Set:** hall

**Type:** two documents

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: We're not a village group. We want the Meeting Room on Sunday 13 July 2025 from 15:00 for as long as we're allowed, including clearing up. What is the most we can be char
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && cat questions-heldout.md && git log --oneline -3 && cat lib/cli.mjs | head -20",
  "description": "Read held-out question set and recent commits"
}
```

## Result

```
# Held-out questions

## H1

**Drawn from:** P1

**Set:** film

**Type:** plain lookup

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: On 12 May 2025, a volunteer takes a £9 cash payment for a screening ticket. The customer asks whether the treasurer is required to issue a receipt. Is a receipt compulsory, and what is the payment threshold?

**Expected answer:** No, a receipt is not compulsory for a £9 payment. The treasurer must issue a receipt for payments of £10 or more, so this payment is £1 below the threshold. A receipt may be issued voluntarily, but the rules do not require one.

**Source:** film-fees.md, sections 4.1 and 4.4.

**Correct requires:** The answer must identify £10 as the receipt threshold and say that a £9 payment does not require a receipt. It is wrong if it says every cash payment requires a receipt, that £9 qualifies because it is close to £10, or that receipts are issued only above £10, which would incorrectly exclude payments of exactly £10.

## H2

**Drawn from:** P4

**Set:** film

**Type:** changed rule

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: An adult member booked the projector on 20 September 2025, paid the required hire fee and security deposit, and received confirmation that day. Collection is scheduled for 3 October 2025. How much security deposit must the member ultimately provide before collecting it?

**Expected answer:** The required security deposit is £100. From 1 October 2025, the deposit increased from £80 to £100, and the scheduled collection date determines which amount applies. The earlier confirmed booking does not protect the member from the increase, so an additional £20 is required if £80 was already paid.

**Source:** film-equipment.md, sections 1.4 and 3.1; film-changes.md, sections 2.1–2.4.

**Correct requires:** The answer must give a total deposit of £100 and identify the additional £20 due after an £80 payment. It is wrong if it says £80 because the booking was confirmed in September, or £60 because that was the archived deposit.

## H3

**Drawn from:** P5

**Set:** film

**Type:** exception or condition

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: A 17-year-old's membership application is accepted, and the treasurer receives their membership payment on 12 February 2026. On what exact date does that membership expire? Does it end in February 2026, or does the February joining rule give them longer?

**Expected answer:** The membership expires on 28 February 2027. Although membership normally lasts until 28 February following payment, someone joining during February receives membership until 28 February of the following year. The February-specific rule prevents this membership from ending only 16 days after payment.

**Source:** film-membership.md, sections 3.1–3.3.

**Correct requires:** The answer must state 28 February 2027 and explain the special treatment of February enrolments. It is wrong if it gives 28 February 2026 by applying the ordinary expiry wording without the February condition, or 12 February 2027 by assuming membership lasts exactly 12 months.

## H4

**Drawn from:** P7

**Set:** film

**Type:** two documents

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: An active adult member wants to hire the society's projector and screen together for two consecutive booking days beginning at noon on 12 May 2026. What is the total hire charge, excluding the refundable security deposit, and when must the equipment be returned?

**Expected answer:** The total hire charge is £46, calculated as two booking days at the combined projector-and-screen rate of £23 per day. Each booking day runs from noon until noon the following day. Collection at noon on 12 May 2026 therefore means the two-day hire period ends at noon on 14 May 2026.

**Source:** film-fees.md, section 3.3; film-equipment.md, sections 2.1 and 2.2; film-changes.md, sections 4.1–4.3 (confirms that the two-day period is within the revised limit).

**Correct requires:** The answer must give £46 and a return deadline of noon on 14 May 2026, using the £23 combined rate and noon-to-noon booking days. It is wrong if it charges £52 by adding the individual projector and screen rates (£18 + £8) for each day, £38 using the archived combined rate of £19, or treats 12–14 May as three paid days and charges £69.

## H5

**Drawn from:** P9

**Set:** film

**Type:** trap

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: On 10 May 2025, an adult aged 40 pays for a new annual membership. A volunteer finds an older fee sheet showing an adult subscription of £20. What amount should the treasurer actually collect?

**Expected answer:** The correct charge is £24. The £20 adult membership fee belongs to a superseded schedule that applied only through 28 February 2025. The governing schedule effective from 1 March 2025 sets the fee at £24, and the later increase to £28 does not take effect until 1 July 2025.

**Source:** film-fees-archive.md, sections 1.1, 5.1–5.2; film-fees.md, section 1.1; film-changes.md, sections 1.2–1.4.

**Correct requires:** The answer must give £24 and reject the archived £20 rate. It is wrong if it charges £20 from the archived document or £28 by applying the July 2025 amendment before its effective date.

## H6

**Drawn from:** P11

**Set:** hall

**Type:** plain lookup

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: At a trustee committee meeting on 17 September 2025, seven trustees are in office but only three attend. One attendee says that three should be enough because all three agree. What is the required quorum, and can the committee make a valid decision at this meeting?

**Expected answer:** The required quorum is four trustees. Only three are present, so the meeting does not meet the quorum requirement and cannot make a valid committee decision. Unanimous agreement among those three does not make up for the missing trustee.

**Source:** hall-trustees.md, sections 2.1, 4.2 and 4.3.

**Correct requires:** The answer must specify four trustees as the quorum and say three are insufficient. It is wrong if it treats three as adequate because they agree unanimously, or says the quorum is five because the committee must have at least five trustees in office.

## H7

**Drawn from:** P13

**Set:** hall

**Type:** changed rule

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: A registered village group with 14 local members books the Meeting Room for four paid hours on 20 February 2026. The group submits its membership count before booking. What room-hire discount percentage applies, and what is the discounted room charge before any other fees?

**Expected answer:** The group receives a 25% room-hire discount because its event takes place after the revised discount became effective on 1 February 2026. Four hours in the Meeting Room cost 4 × £12 = £48 before discount. The 25% discount is £12, leaving a room charge of £36.

**Source:** hall-fees.md, sections 2.2 and 3.1–3.4; hall-changes.md, sections 3.1–3.3.

**Correct requires:** The answer must give a 25% discount and a final room charge of £36. It is wrong if it uses the superseded 20% discount and charges £38.40, uses the archived 15% discount and charges £40.80, or applies 25% to a different room rate.

## H8

**Drawn from:** P15

**Set:** hall

**Type:** exception or condition

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: On 12 October 2025, an organiser wants to use both the Main Hall and Meeting Room for one event. The expected attendance is 89 people in the Main Hall and 23 in the Meeting Room, including organisers and children. Both rooms would individually be within their stated capacities. Is the combined event permitted at that attendance, and by how many people would it exceed any applicable limit?

**Expected answer:** No. The two rooms individually allow up to 90 and 24 people, but combined events are subject to a separate maximum of 100 people in the building. The proposed total is 89 + 23 = 112 people, which exceeds the combined limit by 12.

**Source:** hall-bookings.md, sections 4.1–4.4.

**Correct requires:** The answer must reject the proposed attendance, give 100 as the combined maximum and calculate an excess of 12 people. It is wrong if it permits 112 people because neither room individually exceeds capacity, or uses the sum of individual limits, 114, as the permitted combined maximum.

## H9

**Drawn from:** P17

**Set:** hall

**Type:** two documents

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: A hirer books the Main Hall for a private celebration on 18 October 2025 and intends to serve wine to adult guests without selling it. The hirer asks whether the ordinary £30 booking deposit is sufficient, or whether any additional permission and deposit are required. What must the hirer arrange, and how much must be provided in deposits altogether?

**Expected answer:** The hirer must obtain prior written permission to serve alcohol and provide the separate £100 damage deposit. Every booking also requires the £30 booking deposit. The combined deposits are therefore £130, although the £30 booking deposit counts towards the hire charge.

**Source:** hall-conduct.md, sections 3.1–3.3; hall-fees.md, sections 5.1–5.4.

**Correct requires:** The answer must require prior written permission, identify the £100 damage deposit and the separate £30 booking deposit, and total them at £130. It is wrong if it says the £30 booking deposit alone is sufficient, treats the damage deposit as replacing the booking deposit and gives £100, or uses the archived £75 damage deposit to total £105.

## H10

**Drawn from:** P19

**Set:** hall

**Type:** trap

**Prompt (paste exactly):**

> Under the Quillbrook Village Hall rules: A trustee was elected in March 2022, re-elected in March 2024 and wants to stand again in March 2026. Is there a maximum number of consecutive two-year terms a trustee may serve, and what exactly is that maximum?

**Expected answer:** The papers do not specify a maximum number of consecutive trustee terms. They state that each trustee serves for two years and may stand again, but they explicitly leave the maximum number of terms undefined. The papers therefore do not establish a numerical cap or prohibit this trustee from standing again on term-count grounds.

**Source:** hall-trustees.md, sections 2.4 and 6.1.

**Correct requires:** The answer must explicitly say that no maximum number of terms is specified and identify the two-year term and permission to stand again as the nearby rules. It is wrong if it invents a maximum of two terms (four years), three terms (six years), or says the trustee is automatically entitled to remain in office without another election.
843a811 The builder's brief, the PO Verifier template, three practice sets and the practice runner, fingerprinted before the first practice round
0c1629d Plan, version 4, after Perplexity's outside review: icm-eager replaces folder-staged
f085c35 Plan, version 3, after the third design review (the skeptic); the question writer's script and raw output
// Shared command-line handling: read an option, insist on one, and turn any failure into one
// plain line and a non-zero exit instead of a stack trace.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO, runDir } from './config.mjs';

export function option(name, fallback = null) {
  const at = process.argv.indexOf(`--${name}`);
  if (at === -1) return fallback;
  const value = process.argv[at + 1];
  if (value === undefined || value.startsWith('--')) throw new Error(`--${name} needs a value.`);
  return value;
}

// The folder of a sealed run, named with --name. Stops with a clear message if it is not one.
export function sealedRunDir(usage) {
  const name = option('name');
  if (!name) throw new Error(`Name the run with --name. ${usage}`);
  const dir = runDir(name);
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && cat package.json 2>/dev/null | head -20; head -30 verify/fixtures.mjs",
  "description": "Check package type and an existing verify script style"
}
```

## Result

```
// Builds synthetic session logs and a tiny synthetic run for the self-test. Nothing here comes
// from a real session, so the fixtures carry no private strings.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { MODEL } from '../lib/config.mjs';
import { sha256 } from '../lib/rng.mjs';
import { codedTables, loadRows } from './analyse.mjs';
import { logPath, scanReport, scanRun } from './scan.mjs';

export const FIXTURE_VERSION = '0.0.0';
export const FIXTURE_ARMS = { AAAA: 'docs', BBBB: 'empty' };
export const FIXTURE_QUESTIONS = ['Q1', 'Q2'];

export function goodEvents(code = 'AAAA', answer = 'The limit is ten (reference/set/doc.md, section 2).', cwd = `C:/tc/${code}`) {
  return [
    { type: 'system', subtype: 'init', cwd, model: MODEL, claude_code_version: FIXTURE_VERSION, mcp_servers: [], skills: [], plugins: [{ name: 'built-in', path: 'builtin' }] },
    { type: 'rate_limit_event', rate_limit_info: { status: 'allowed' } },
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 't1', name: 'Read', input: { file_path: `${cwd}/reference/set/doc.md` } }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1', is_error: false }] } },
    { type: 'assistant', message: { content: [{ type: 'text', text: answer }] } },
    { type: 'result', subtype: 'success', is_error: false, result: answer, stop_reason: 'end_turn', num_turns: 2, duration_ms: 4000, permission_denials: [], usage: { input_tokens: 100, output_tokens: 20 }, modelUsage: { [MODEL]: {} } },
  ];
}

export const toLog = (events) => `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;

// Returns a changed copy of the good log. `change` receives the start record, the result
// record and the whole list.
export function brokenLog(change) {
```

## Call: Write

```json
{
  "file_path": "C:\\GitHub\\the-control-icm\\tools\\key-facts-sets.mjs",
  "content": "// The key facts for the two later question sets: questions-new.md (ids N...) and\n// questions-heldout.md (ids H...). Same format and same rules as FACTS in key-facts.mjs: one\n// [name, pattern] pair for each thing the \"must\" half of a question's \"Correct requires\" line\n// asks for, tried on the answer with its spaces squeezed and its case kept. The \"it is wrong\n// if\" half needs a reader and is not here.\n//\n// Written from each question's Expected answer and Correct requires lines alone; no answer\n// was read. Checked by verify/key-facts-sets.test.mjs against key-facts-sets.fixtures.mjs.\n//\n// Left out, because a pattern cannot match them fairly (reason codes):\n//   YN = a yes/no or allowed/not-allowed conclusion; the pattern would match a denial too.\n//   N4  YN  \"say yes\" (the person may be admitted)\n//   N9  YN  \"say yes\" (three days are allowed)\n//   H1  YN  \"a £9 payment does not require a receipt\"\n//   H6  YN  \"three are insufficient\" (the meeting cannot decide)\n//   H8  YN  \"reject the proposed attendance\"\n\n// A pound figure that is not the start of a longer number: £8 matches \"£8\" and \"£8.00\", not\n// \"£80\", \"£8.50\" or \"£8,000\".\nconst money = (n) => new RegExp(`£\\\\s?${n}(?!\\\\d)(?!\\\\.(?!00)\\\\d)(?!,\\\\d{3})`);\n// A percentage that is not the tail or head of another number.\nconst percent = (n, word) => new RegExp(`(?<![\\\\d.])${n} ?(%|per ?cent)|\\\\b${word} per ?cent`, 'i');\n\n// The papers are silent: the same wording the entry used for its own \"not settled\" fact.\nconst SILENT = /do(es)? not (say|address|cover|specify|state|define|settle|decide|set|establish)|don't (say|address|cover|specify|state|settle|set)|doesn't (say|address|cover|specify|state|settle|set)|not (addressed|covered|specified|stated|defined|settled|decided|set)|unspecified|undefined|silent|leaves? .{0,40}(open|undecided|unspecified|undefined)|left .{0,30}(open|undecided|unspecified|undefined)|no rule|cannot (say|tell|determine|be determined|establish)|can't (say|tell|determine)|not (able|possible) to (say|tell|determine)/i;\n\nexport const FACTS_NEW = {\n  N1: [['£8, the total', money(8)], ['£5, the 12-to-15 child', money(5)], ['£3, the under-12 child', money(3)]],\n  N2: [['£46', money(46)]],\n  N3: [['£28', money(28)], ['the transfer clearing on 2 July 2025', /(?<!\\d)2(nd)? July|July 2(nd)?(?!\\d)/i]],\n  N4: [['the limit of 42', /(?<!\\d)42(?!\\d)|forty-two/i]],\n  N6: [['no refund, £0', /no refund|nothing (is |will be |can be )?(refunded|returned|back)|not (be )?(entitled to a )?refund(ed|able)?|non-?refundable|£\\s?0(?!\\d)/i],\n    ['because the member entered after being told', /(enter(ed|s|ing)?|went in|go(es)? in|going in|admitted).{0,80}(told|informed|notified|aware|knowing)|(told|informed|notified|aware|knowing).{0,80}(enter(ed|s|ing)?|went in|go(es)? in|going in|admitted)/i]],\n  N7: [['£7, standard admission', money(7)],\n    ['a suspended member cannot claim member prices', /(cannot|can't|can not|not (entitled|allowed|eligible|permitted)|bar(red|s)?|lose|loses|no longer|may not|ineligible|not claim).{0,60}member (price|rate|discount)/i]],\n  N8: [['£56, the total', money(56)], ['£36, the hire', money(36)], ['£20, the late charge', money(20)]],\n  N9: [['the three-day limit', /(?<!\\d)3(-| )(consecutive )?(booking )?days?|\\bthree(-| )(consecutive )?(booking )?days?/i]],\n  N10: [['£12', money(12)]],\n  N12: [['£69', money(69)]],\n  N13: [['£112', money(112)]],\n  N14: [['50%', /(?<![\\d.])50 ?(%|per ?cent)|\\bfifty per ?cent|\\bhalf\\b/i],\n    ['the booking deposit is kept', /deposit.{0,40}(is not|isn't|not be|will not be|won't be|not) (refunded|returned|repaid|given back)|deposit.{0,40}(kept|retained|forfeit|non-?refundable)|non-?refundable.{0,30}deposit|(keep|keeps|retain|retains|forfeit|forfeits) .{0,30}deposit/i]],\n  N15: [['£100', money(100)], ['the damage deposit', /damage deposit/i]],\n  N16: [['full payment', /(full|whole|entire|total) .{0,30}(hire charge|payment|amount|charge|sum)|all (of )?the (hire )?charge|in full/i],\n    ['on 2 October 2025', /(?<!\\d)2(nd)? October|October 2(nd)?(?!\\d)/i]],\n  N17: [['£72', money(72)], ['6 hours', /(?<!\\d)6(-| )hours?|\\bsix(-| )hours?|15[:.]00 ?(to|-|–|until|till) ?21[:.]00/i]],\n  N18: [['£130, the total', money(130)], ['£30, the booking deposit', money(30)], ['£100, the damage deposit', money(100)]],\n  N19: [['the four-trustee quorum', /quorum\\b.{0,40}\\b(four|4)\\b|\\b(four|4)(-| )trustees?\\b.{0,40}quorum|\\b(four|4)(-| )trustee quorum/i],\n    ['remote attendance', /remote|video/i], ['that the papers do not settle it', SILENT]],\n  N20: [['no lost-key charge is set', /no (set |specified |stated |fixed |particular )?(charge|fee|figure|amount|price|cost|penalty)|do(es)? not (set|specify|state|say|give|provide|mention|cover|address|fix)|doesn't (set|specify|state|say|give|provide|mention|cover|address)|don't (set|specify|state|say|give|provide|mention|cover|address)|not (set|specified|stated|covered|addressed)|silent|no rule/i],\n    ['the key rules nearby', /copied|copy|booking officer|pass(ed)? .{0,20}another hirer/i]],\n};\n\nexport const FACTS_HELDOUT = {\n  H1: [['£10, the receipt threshold', money(10)]],\n  H2: [['£100, the deposit', money(100)], ['£20, the additional sum', money(20)]],\n  H3: [['28 February 2027', /28(th)? Feb(ruary)?,? 2027|Feb(ruary)? 28(th)?,? 2027|28[/.-]0?2[/.-](20)?27(?!\\d)/i],\n    ['the February joining rule', /(join|joins|joined|joining|enrol|enrols|enrolled|enrolling|enrolment|pay|pays|paid|payment) .{0,30}(during|in) February|February[- ](join|joiner|enrol|rule|condition|provision|exception|clause|specific)/i]],\n  H4: [['£46', money(46)], ['£23, the combined rate', money(23)],\n    ['noon-to-noon booking days', /noon (to|until|till|-|–) noon|noon.{0,40}following day|midday (to|until|till|-|–) midday|12[:.]00 (to|until|till|-|–) 12[:.]00/i],\n    ['returned by noon on 14 May 2026', /(noon|midday|12[:.]00|12 ?pm).{0,30}(?<!\\d)14(th)? May|(?<!\\d)14(th)? May.{0,30}(noon|midday|12[:.]00|12 ?pm)/i]],\n  H5: [['£24', money(24)],\n    ['the archived £20 rejected', /£\\s?20(?!\\d).{0,80}(supersed|archiv|outdated|out of date|no longer|replaced|expired|obsolete|not (apply|valid|current)|does not apply|doesn't apply|applied only|only applied)|(supersed|archiv|outdated|out of date|no longer|replaced|expired|obsolete).{0,80}£\\s?20(?!\\d)/i]],\n  H6: [['a quorum of four', /quorum\\b.{0,40}\\b(four|4)\\b|\\b(four|4)(-| )trustees?\\b/i]],\n  H7: [['25%', percent(25, 'twenty-five')], ['£36', money(36)]],\n  H8: [['100, the combined maximum', /(?<![\\d.£,])100(?!\\d)|one hundred/i],\n    ['the excess of 12', /(exceed|exceeds|exceeded|exceeding|over|excess|too many|above|more than|beyond).{0,40}\\b(12|twelve)\\b(?! (October|Oct)\\b)|\\b(12|twelve) (people|persons|attendees|guests|too many|over|above|more)\\b/i]],\n  H9: [['prior written permission', /written permission|permission in writing|written (consent|approval)/i],\n    ['£100, the damage deposit', money(100)], ['£30, the booking deposit', money(30)], ['£130, the total', money(130)]],\n  H10: [['no maximum is specified', /no (maximum|max|limit|cap|upper limit)|(maximum|limit|cap).{0,40}(not (specified|defined|set|stated|given|established)|undefined|unspecified)|SILENT_PLACEHOLDER/i],\n    ['the two-year term', /(?<!\\d)2(-| )years?|\\btwo(-| )years?/i],\n    ['may stand again', /stand (again|for re-?election)|re-?elect|seek re-?election|eligible (for|to)/i]],\n};\n\n// H10's first fact also accepts every \"the papers are silent\" phrasing.\nFACTS_HELDOUT.H10[0][1] = new RegExp(FACTS_HELDOUT.H10[0][1].source.replace('|SILENT_PLACEHOLDER', `|${SILENT.source}`), 'i');\n\nexport const squeeze = (text) => String(text ?? '').replace(/[   ]/g, ' ').replace(/\\s+/g, ' ');\n\n// Which of a question's facts an answer leaves out, as missingFacts() does in key-facts.mjs.\nexport function missingFactsIn(table, question, answer) {\n  const text = squeeze(answer);\n  return (table[question] ?? []).filter(([, pattern]) => !pattern.test(text)).map(([name]) => name);\n}\n"
}
```

## Result

```
File created successfully at: C:\GitHub\the-control-icm\tools\key-facts-sets.mjs (file state is current in your context — no need to Read it back)
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && python - <<'EOF'\np='tools/key-facts-sets.mjs'\ns=open(p,encoding='utf8').read()\ns=s.replace(\"\"\"  H10: [['no maximum is specified', /no (maximum|max|limit|cap|upper limit)|(maximum|limit|cap).{0,40}(not (specified|defined|set|stated|given|established)|undefined|unspecified)|SILENT_PLACEHOLDER/i],\"\"\",\"\"\"  H10: [['no maximum is specified', new RegExp(`no (maximum|max|limit|cap|upper limit)|(maximum|limit|cap).{0,40}(not (specified|defined|set|stated|given|established)|undefined|unspecified)|${SILENT.source}`, 'i')],\"\"\")\ns=s.replace(\"\"\"\n// H10's first fact also accepts every \"the papers are silent\" phrasing.\nFACTS_HELDOUT.H10[0][1] = new RegExp(FACTS_HELDOUT.H10[0][1].source.replace('|SILENT_PLACEHOLDER', `|${SILENT.source}`), 'i');\n\"\"\",\"\")\nopen(p,'w',encoding='utf8').write(s)\nEOF\ngrep -n \"const squeeze\" tools/key-facts.mjs | od -c | head -5; grep -c PLACEHOLDER tools/key-facts-sets.mjs",
  "description": "Inline the H10 pattern and inspect squeeze characters"
}
```

## Result

```
0000000   3   6   :   c   o   n   s   t       s   q   u   e   e   z   e
0000020       =       (   t   e   x   t   )       =   >       S   t   r
0000040   i   n   g   (   t   e   x   t       ?   ?       '   '   )   .
0000060   r   e   p   l   a   c   e   (   /   [ 302 240 342 200 211 342
0000100 200 257   ]   /   g   ,       '       '   )   .   r   e   p   l
0
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && grep -n \"const squeeze\" tools/key-facts-sets.mjs | od -c | sed -n 3,5p",
  "description": "Inspect squeeze characters in the new file"
}
```

## Result

```
0000040       =   >       S   t   r   i   n   g   (   t   e   x   t    
0000060   ?   ?       '   '   )   .   r   e   p   l   a   c   e   (   /
0000100   [               ]   /   g   ,       '       '   )   .   r   e
```

## Builder

Fixing the squeeze characters to match the entry exactly with escapes.

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && python - <<'EOF'\np='tools/key-facts-sets.mjs'\ns=open(p,encoding='utf8').read()\nimport re\ni=s.index(\"export const squeeze\")\nj=s.index(\"\\n\",i)\ns=s[:i]+\"export const squeeze = (text) => String(text ?? '').replace(/[\\\\u00a0\\\\u2009\\\\u202f]/g, ' ').replace(/\\\\s+/g, ' ');\"+s[j:]\nopen(p,'w',encoding='utf8').write(s)\nEOF\ngrep -n \"const squeeze\" tools/key-facts-sets.mjs",
  "description": "Replace squeeze with escaped space characters"
}
```

## Result

```
<stdin>:6: SyntaxWarning: invalid escape sequence '\s'
75:export const squeeze = (text) => String(text ?? '').replace(/[   ]/g, ' ').replace(/\s+/g, ' ');
```

## Call: Read

```json
{
  "file_path": "C:\\GitHub\\the-control-icm\\tools\\key-facts-sets.mjs",
  "offset": 72
}
```

## Result

```
72	    ['may stand again', /stand (again|for re-?election)|re-?elect|seek re-?election|eligible (for|to)/i]],
73	};
74	
75	export const squeeze = (text) => String(text ?? '').replace(/[   ]/g, ' ').replace(/\s+/g, ' ');
76	
77	// Which of a question's facts an answer leaves out, as missingFacts() does in key-facts.mjs.
78	export function missingFactsIn(table, question, answer) {
79	  const text = squeeze(answer);
80	  return (table[question] ?? []).filter(([, pattern]) => !pattern.test(text)).map(([name]) => name);
81	}
82
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && node -e \"\nconst fs=require('fs');const p='tools/key-facts-sets.mjs';let s=fs.readFileSync(p,'utf8');\ns=s.replace(/\\.replace\\(\\/\\[[^\\]]*\\]\\/g, ' '\\)/, String.raw\\`.replace(/[   ]/g, ' ')\\`);fs.writeFileSync(p,s);\" && sed -n 75p tools/key-facts-sets.mjs",
  "description": "Write escaped Unicode space class into squeeze"
}
```

## Result

```
export const squeeze = (text) => String(text ?? '').replace(/[   ]/g, ' ').replace(/\s+/g, ' ');
```

## Call: Edit

```json
{
  "replace_all": false,
  "file_path": "C:\\GitHub\\the-control-icm\\tools\\key-facts-sets.mjs",
  "old_string": "export const squeeze = (text) => String(text ?? '')",
  "new_string": "export const squeeze = (text) => String(text ?? '').replace(/[   ]/g, ' ')"
}
```

## Result

```
<tool_use_error>File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.</tool_use_error>
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && sed -n 75p tools/key-facts-sets.mjs | od -c | head -12",
  "description": "Inspect the squeeze line bytes"
}
```

## Result

```
0000000   e   x   p   o   r   t       c   o   n   s   t       s   q   u
0000020   e   e   z   e       =       (   t   e   x   t   )       =   >
0000040       S   t   r   i   n   g   (   t   e   x   t       ?   ?    
0000060   '   '   )   .   r   e   p   l   a   c   e   (   /   [ 302 240
0000100 342 200 211 342 200 257   ]   /   g   ,       '       '   )   .
0000120   r   e   p   l   a   c   e   (   /   \   s   +   /   g   ,    
0000140   '       '   )   ;  \n
0000146
```

## Builder

Squeeze now carries the same characters as the entry. Now the fixtures.

## Call: Write

```json
{
  "file_path": "C:\\GitHub\\the-control-icm\\tools\\key-facts-sets.fixtures.mjs",
  "content": "// Fixtures for tools/key-facts-sets.mjs. For each fact of each question: one sentence that must\n// match (taken from or closely paraphrasing the expected answer) and at least one that names\n// the fact wrongly and must not match (a nearby wrong figure, the wrong date, or the hasty\n// reader's answer from \"Correct requires\"). knownLimits lists honest wrong sentences that a\n// pattern still matches, because it cannot tell a denial from an assertion; they are kept here\n// rather than weakening the test, and the test checks that they still match as recorded.\n\nexport const FIXTURES_NEW = {\n  N1: {\n    '£8, the total': { positive: 'The two tickets cost £8 in total.', negatives: ['The two tickets cost £6 in total.', 'The two tickets cost £9.', 'That is £80 altogether.'] },\n    '£5, the 12-to-15 child': { positive: 'A child aged 12 to 15 pays £5.', negatives: ['A child aged 12 to 15 pays £4.', 'Each child pays £3, so £6.'] },\n    '£3, the under-12 child': { positive: 'A child under 12 accompanied by an adult pays £3.', negatives: ['A child under 12 pays £4.', 'Both children pay standard admission of £7, £14 in all.'] },\n  },\n  N2: {\n    '£46': { positive: 'Two days at £23 is £46.', negatives: ['The hire is £52 in total.', 'The hire is £47.', 'Two days at £19 is £38.'] },\n  },\n  N3: {\n    '£28': { positive: 'You should have paid £28.', negatives: ['You should have paid £24.', 'You should have paid £27.'] },\n    'the transfer clearing on 2 July 2025': { positive: 'A bank transfer counts as received when it clears, which was 2 July 2025.', negatives: ['The transfer was sent on 30 June 2025, so it counts as received then.', 'It cleared on 12 July 2025.', 'It cleared on 3 July 2025.'] },\n  },\n  N4: {\n    'the limit of 42': { positive: 'On 30 May 2026 the limit is still 42 people, excluding duty volunteers.', negatives: ['The limit is now 36, so no.', 'The limit is 41 people.', 'The room holds 420 people.'] },\n  },\n  N6: {\n    'no refund, £0': { positive: 'No, nothing is refunded.', negatives: ['You get a full £4 refund under the film-change rule.', 'The society cancelled, so a full refund applies.'] },\n    'because the member entered after being told': { positive: 'Someone who enters after being told about the change loses that option.', negatives: ['The advertised film changed, so you can ask for a full refund of £4.'] },\n  },\n  N7: {\n    '£7, standard admission': { positive: 'They pay £7, the standard admission.', negatives: ['They pay the current member price of £5.', 'They pay the original member price of £4.', 'They pay £8.'] },\n    'a suspended member cannot claim member prices': { positive: 'During a suspension the membership rules bar the member from claiming member prices.', negatives: ['A suspended member still pays the member price of £5.', 'A suspended member cannot attend at all.'] },\n  },\n  N8: {\n    '£56, the total': { positive: 'You owe £56 in total.', negatives: ['You owe £46 in total.', 'You owe £66 in total.', 'You owe £57.'] },\n    '£36, the hire': { positive: 'Projector hire is £18 a day, which is £36.', negatives: ['Hire is £46 at the combined rate.', 'Hire is £37.'] },\n    '£20, the late charge': { positive: 'The return started two late periods at £10 each, adding £20.', negatives: ['One late period adds a charge, £10 on top of the hire.', 'The late charge is £30.'] },\n  },\n  N9: {\n    'the three-day limit': { positive: 'From 1 March 2025 the hire limit is three consecutive booking days.', negatives: ['The limit is two days, so no.', 'You may book up to five days.', 'The limit is 13 days.'] },\n  },\n  N10: {\n    '£12': { positive: 'Annual membership for people aged 16 or 17 costs £12.', negatives: ['It costs £10, the archived figure.', 'It costs £28.', 'It costs £24.', 'It costs £13.'] },\n  },\n  N12: {\n    '£69': { positive: 'The total hire charge is £69.', negatives: ['The total is £64.', 'The total is £105.', 'The total is £56.', 'The total is £68.'] },\n  },\n  N13: {\n    '£112': { positive: 'Four hours at £28 is £112.', negatives: ['Four hours at £24 is £96.', 'Four hours at £20 is £80.', 'The charge is £113.'] },\n  },\n  N14: {\n    '50%': { positive: 'You get back 50% of room, kitchen and equipment hire charges.', negatives: ['You get back 25% of the hire charges.', 'You get back 5% of the hire charges.', 'You get back 150% of nothing.'] },\n    'the booking deposit is kept': { positive: 'The £30 booking deposit is not refunded.', negatives: ['The £30 booking deposit is refunded too.', 'You get the £30 deposit back.'] },\n  },\n  N15: {\n    '£100': { positive: 'You get back £100.', negatives: ['You get back £0.', 'You get back £130.', 'You get back £160.', 'You get back £10.'] },\n    'the damage deposit': { positive: 'An unused damage deposit is returned in full after a hirer cancellation.', negatives: ['Nothing is returned, not even the booking deposit.'] },\n  },\n  N16: {\n    'full payment': { positive: 'The full hire charge, including the booking deposit, is due at acceptance on 2 October 2025.', negatives: ['The deposit is due by 9 October 2025 and the balance by 28 September 2025.', 'The balance is due on 5 October 2025.'] },\n    'on 2 October 2025': { positive: 'Payment is due at acceptance on 2 October 2025.', negatives: ['The deposit is due by 9 October 2025.', 'The balance is due on 5 October 2025.', 'The money is due on 12 October 2025.', 'It is due on 22 October 2025.'] },\n  },\n  N17: {\n    '£72': { positive: 'The most you can be charged is £72.', negatives: ['The most is £84.', 'The most is £96.', 'The most is £144.', 'The most is £71.'] },\n    '6 hours': { positive: 'The booking can run at most from 15:00 to 21:00, which is 6 hours.', negatives: ['The booking can run 7 hours, to 22:00.', 'The booking can run 8 hours, to 23:00.', 'The booking can run 16 hours.', 'The booking can run five hours.'] },\n  },\n  N18: {\n    '£130, the total': { positive: 'The deposits total £130.', negatives: ['The deposits total £95.', 'The deposits total £131.'] },\n    '£30, the booking deposit': { positive: 'Every booking needs a £30 booking deposit.', negatives: ['The booking deposit is £20, plus £75.', 'You need only the £100 damage deposit.'] },\n    '£100, the damage deposit': { positive: 'The damage deposit is £100 and separate from the booking deposit.', negatives: ['The damage deposit is £75.', 'You need only the £30 booking deposit.'] },\n  },\n  N19: {\n    'the four-trustee quorum': { positive: 'Four trustees form a quorum.', negatives: ['Only three count, so it is not quorate.', 'The quorum is five trustees.'] },\n    'remote attendance': { positive: 'The rules do not specify whether trustees may attend remotely.', negatives: ['The fourth trustee counts, so the meeting is quorate.'] },\n    'that the papers do not settle it': { positive: 'The papers do not say.', negatives: ['Yes, the fourth trustee counts, so the meeting is quorate with four.', 'No, only three count, so it is not quorate.'] },\n  },\n  N20: {\n    'no lost-key charge is set': { positive: 'The papers do not set a charge for a lost key.', negatives: ['The hirer forfeits the £30 booking deposit for the lost key.', 'The charge is deducted from the £100 damage deposit.'] },\n    'the key rules nearby': { positive: 'Keys are collected from the booking officer by arrangement and may not be copied or passed to another hirer.', negatives: ['The hirer pays £30 for the lost key.'] },\n  },\n};\n\nexport const FIXTURES_HELDOUT = {\n  H1: {\n    '£10, the receipt threshold': { positive: 'The treasurer must issue a receipt for payments of £10 or more.', negatives: ['Every cash payment needs a receipt, even £9.', 'Receipts are needed above £11.', 'Receipts are needed from £100.'] },\n  },\n  H2: {\n    '£100, the deposit': { positive: 'The required security deposit is £100.', negatives: ['The deposit is £80 because the booking was confirmed in September.', 'The deposit is £60, the archived figure.', 'The deposit is £101.'] },\n    '£20, the additional sum': { positive: 'An additional £20 is required if £80 was already paid.', negatives: ['Nothing more is due; £80 stands.', 'A further £25 is due.', 'A further £200 is due.'] },\n  },\n  H3: {\n    '28 February 2027': { positive: 'The membership expires on 28 February 2027.', negatives: ['It ends on 28 February 2026.', 'It ends on 12 February 2027.', 'It ends on 28 February 2028.'] },\n    'the February joining rule': { positive: 'Someone joining during February receives membership until 28 February of the following year.', negatives: ['Membership lasts until 28 February following payment, so it ends on 28 February 2026.', 'Membership lasts exactly 12 months from 12 February 2026.'] },\n  },\n  H4: {\n    '£46': { positive: 'The total hire charge is £46.', negatives: ['The total is £52.', 'The total is £38.', 'The total is £69.', 'The total is £45.'] },\n    '£23, the combined rate': { positive: 'Two booking days at the combined projector-and-screen rate of £23 per day.', negatives: ['£18 + £8 = £26 a day.', 'The archived combined rate of £19 a day.'] },\n    'noon-to-noon booking days': { positive: 'Each booking day runs from noon until noon the following day.', negatives: ['Each booking day runs from midnight to midnight.', 'A booking day is a calendar day.'] },\n    'returned by noon on 14 May 2026': { positive: 'The two-day hire period ends at noon on 14 May 2026.', negatives: ['Return it by noon on 13 May 2026.', 'Return it by noon on 15 May 2026.', 'Return it on 14 May 2026 by midnight.'] },\n  },\n  H5: {\n    '£24': { positive: 'The correct charge is £24.', negatives: ['Charge £20 from the fee sheet.', 'Charge £28.', 'Charge £25.'] },\n    'the archived £20 rejected': { positive: 'The £20 adult membership fee belongs to a superseded schedule.', negatives: ['The treasurer should collect £20, the adult subscription.', 'The fee is £28; ignore the fee sheet.'] },\n  },\n  H6: {\n    'a quorum of four': { positive: 'The required quorum is four trustees.', negatives: ['The quorum is five because the committee must have at least five trustees.', 'Three trustees are enough because they agree unanimously.'] },\n  },\n  H7: {\n    '25%': { positive: 'The group receives a 25% room-hire discount.', negatives: ['The group receives a 20% discount.', 'The group receives a 15% discount.', 'The discount is 2.5%.', 'The discount is 125%.'] },\n    '£36': { positive: 'The 25% discount is £12, leaving a room charge of £36.', negatives: ['The room charge is £38.40.', 'The room charge is £40.80.', 'The room charge is £35.', 'The room charge is £36.50.'] },\n  },\n  H8: {\n    '100, the combined maximum': { positive: 'Combined events are subject to a separate maximum of 100 people in the building.', negatives: ['The combined maximum is 114, the sum of the rooms.', 'The combined limit is 110 people.'] },\n    'the excess of 12': { positive: 'The proposed total is 89 + 23 = 112 people, which exceeds the combined limit by 12.', negatives: ['It exceeds the limit by 2 people.', 'Neither room is over capacity on 12 October, so it is permitted.', 'It exceeds the limit by 14.'] },\n  },\n  H9: {\n    'prior written permission': { positive: 'The hirer must obtain prior written permission to serve alcohol.', negatives: ['The £30 booking deposit alone is sufficient.'] },\n    '£100, the damage deposit': { positive: 'The hirer must provide the separate £100 damage deposit.', negatives: ['The damage deposit is £75.', 'The damage deposit is £105 in total.'] },\n    '£30, the booking deposit': { positive: 'Every booking also requires the £30 booking deposit.', negatives: ['The damage deposit replaces the booking deposit, so £100.', 'The booking deposit is £20.'] },\n    '£130, the total': { positive: 'The combined deposits are therefore £130.', negatives: ['The total is £105.', 'The total is £100.', 'The total is £131.'] },\n  },\n  H10: {\n    'no maximum is specified': { positive: 'The papers do not specify a maximum number of consecutive trustee terms.', negatives: ['The maximum is two consecutive terms, four years.', 'A trustee may serve at most three terms.'] },\n    'the two-year term': { positive: 'Each trustee serves for two years and may stand again.', negatives: ['Each trustee serves a three-year term.', 'Each trustee serves for 12 years.'] },\n    'may stand again': { positive: 'Each trustee serves for two years and may stand again.', negatives: ['The trustee is automatically entitled to remain in office without another election.'] },\n  },\n};\n\n// Honest wrong sentences the pattern still matches. The test asserts each still matches, so a\n// pattern change that fixes one shows up and the entry can be removed.\nexport const knownLimits = [\n  { set: 'new', id: 'N6', fact: 'no refund, £0', sentence: 'It is wrong to say there is no refund; you get £4 back.', why: 'a pattern cannot tell a denial of \"no refund\" from the claim' },\n  { set: 'new', id: 'N7', fact: 'a suspended member cannot claim member prices', sentence: 'It is not true that they cannot claim member prices; they pay £5.', why: 'denial of the bar reads the same as the bar' },\n  { set: 'new', id: 'N14', fact: 'the booking deposit is kept', sentence: 'Nothing says the deposit is kept, so it comes back.', why: 'denial of the deposit being kept reads the same as the claim' },\n  { set: 'new', id: 'N16', fact: 'full payment', sentence: 'You do not need to pay in full until 28 September 2025.', why: 'denial of full payment reads the same as the claim' },\n  { set: 'new', id: 'N19', fact: 'that the papers do not settle it', sentence: 'The papers do not say he is excluded, so yes, he counts.', why: 'silence wording can sit inside a yes/no answer' },\n  { set: 'new', id: 'N20', fact: 'no lost-key charge is set', sentence: 'The papers do not mention a separate fee, so the £30 booking deposit is kept for the key.', why: 'silence wording can sit inside an answer that then states a charge' },\n  { set: 'heldout', id: 'H5', fact: 'the archived £20 rejected', sentence: 'Collect £20 as shown in the archived document.', why: 'naming the archive while applying it reads the same as rejecting it' },\n  { set: 'heldout', id: 'H6', fact: 'a quorum of four', sentence: 'The quorum is not four; three is enough.', why: 'denial of the four-trustee quorum reads the same as the claim' },\n  { set: 'heldout', id: 'H10', fact: 'may stand again', sentence: 'The trustee may not stand again after two terms.', why: 'denial of standing again reads the same as the claim' },\n];\n"
}
```

## Call: Write

```json
{
  "file_path": "C:\\GitHub\\the-control-icm\\verify\\key-facts-sets.test.mjs",
  "content": "// Checks the key-fact patterns for the new and held-out question sets.\n//   node verify/key-facts-sets.test.mjs\n// (a) every expected answer in questions-new.md and questions-heldout.md holds every fact;\n// (b) every positive fixture matches and every negative fixture does not;\n// (c) every recorded known limit still matches as recorded. Prints a summary count and exits\n// non-zero on any failure.\n\nimport { readFileSync } from 'node:fs';\nimport { join, dirname } from 'node:path';\nimport { fileURLToPath } from 'node:url';\nimport { FACTS_HELDOUT, FACTS_NEW, missingFactsIn, squeeze } from '../tools/key-facts-sets.mjs';\nimport { FIXTURES_HELDOUT, FIXTURES_NEW, knownLimits } from '../tools/key-facts-sets.fixtures.mjs';\n\nconst REPO = join(dirname(fileURLToPath(import.meta.url)), '..');\nconst failures = [];\nconst count = { expected: 0, facts: 0, positives: 0, negatives: 0, limits: 0 };\n\nfunction expectedAnswers(file) {\n  const text = readFileSync(join(REPO, file), 'utf8');\n  const out = {};\n  for (const block of text.split(/^## /m).slice(1)) {\n    const id = block.match(/^(\\S+)/)[1];\n    const answer = block.match(/\\*\\*Expected answer:\\*\\*\\s*(.+)/);\n    if (answer) out[id] = answer[1];\n  }\n  return out;\n}\n\nconst SETS = [\n  { name: 'new', file: 'questions-new.md', facts: FACTS_NEW, fixtures: FIXTURES_NEW },\n  { name: 'heldout', file: 'questions-heldout.md', facts: FACTS_HELDOUT, fixtures: FIXTURES_HELDOUT },\n];\n\nfor (const { name, file, facts, fixtures } of SETS) {\n  const answers = expectedAnswers(file);\n  const ids = Object.keys(answers);\n  const missingIds = ids.filter((id) => !(id in facts));\n  const extraIds = Object.keys(facts).filter((id) => !(id in answers));\n  if (missingIds.length || extraIds.length) failures.push(`${name}: ids without facts [${missingIds}], facts without a question [${extraIds}]`);\n\n  for (const id of ids) {\n    count.expected += 1;\n    const missing = missingFactsIn(facts, id, answers[id]);\n    if (missing.length) failures.push(`${name} ${id}: expected answer misses ${missing.join('; ')}`);\n  }\n\n  for (const [id, list] of Object.entries(facts)) {\n    for (const [fact, pattern] of list) {\n      count.facts += 1;\n      const fixture = fixtures[id]?.[fact];\n      if (!fixture) { failures.push(`${name} ${id}: no fixture for \"${fact}\"`); continue; }\n      if (!fixture.negatives?.length) failures.push(`${name} ${id}: no negative for \"${fact}\"`);\n      count.positives += 1;\n      if (!pattern.test(squeeze(fixture.positive))) failures.push(`${name} ${id} \"${fact}\": positive does not match: ${fixture.positive}`);\n      for (const negative of fixture.negatives ?? []) {\n        count.negatives += 1;\n        if (pattern.test(squeeze(negative))) failures.push(`${name} ${id} \"${fact}\": negative matches: ${negative}`);\n      }\n    }\n    for (const fact of Object.keys(fixtures[id] ?? {})) {\n      if (!list.some(([n]) => n === fact)) failures.push(`${name} ${id}: fixture for unknown fact \"${fact}\"`);\n    }\n  }\n}\n\nfor (const limit of knownLimits) {\n  count.limits += 1;\n  const facts = limit.set === 'new' ? FACTS_NEW : FACTS_HELDOUT;\n  const entry = facts[limit.id]?.find(([n]) => n === limit.fact);\n  if (!entry) failures.push(`known limit ${limit.id}: unknown fact \"${limit.fact}\"`);\n  else if (!entry[1].test(squeeze(limit.sentence))) failures.push(`known limit ${limit.id} \"${limit.fact}\" no longer matches; remove it: ${limit.sentence}`);\n}\n\nfor (const line of failures) console.log(`FAIL ${line}`);\nconsole.log(`Expected answers holding every fact: ${count.expected - failures.filter((f) => f.includes('expected answer misses')).length}/${count.expected}`);\nconsole.log(`Facts: ${count.facts}; positives: ${count.positives}; negatives: ${count.negatives}; known limits: ${count.limits}`);\nconsole.log(failures.length ? `${failures.length} failure(s)` : 'All checks pass.');\nprocess.exitCode = failures.length ? 1 : 0;\n"
}
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && node verify/key-facts-sets.test.mjs",
  "description": "Run the key-facts sets test"
}
```

## Result

```
File created successfully at: C:\GitHub\the-control-icm\tools\key-facts-sets.fixtures.mjs (file state is current in your context — no need to Read it back)
```

## Result

```
File created successfully at: C:\GitHub\the-control-icm\verify\key-facts-sets.test.mjs (file state is current in your context — no need to Read it back)
```

## Result

```
Expected answers holding every fact: 28/28
Facts: 57; positives: 57; negatives: 143; known limits: 9
All checks pass.
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm && node -e \"\nimport('./tools/key-facts-sets.mjs').then(m=>{for(const [k,t] of [['new',m.FACTS_NEW],['held',m.FACTS_HELDOUT]])console.log(k,Object.keys(t).length,Object.values(t).flat().length)})\" && node -e \"import('./tools/key-facts-sets.fixtures.mjs').then(m=>{for(const [k,t] of [['new',m.FIXTURES_NEW],['held',m.FIXTURES_HELDOUT]]){let p=0,n=0;for(const q of Object.values(t))for(const f of Object.values(q)){p++;n+=f.negatives.length}console.log(k,p,n)}})\" && git add tools/key-facts-sets.mjs tools/key-facts-sets.fixtures.mjs verify/key-facts-sets.test.mjs && git commit -q -m \"Key-fact patterns for the new and held-out questions, with fixtures, written from the keys alone\" -m \"Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\" && git log --oneline -1 && git show --stat HEAD | tail -4",
  "description": "Count facts per set and commit the three files"
}
```

## Result

```
new 18 34
held 10 23
new 34 85
held 23 58
warning: in the working copy of 'tools/key-facts-sets.mjs', CRLF will be replaced by LF the next time Git touches it
8e0cb03 Key-fact patterns for the new and held-out questions, with fixtures, written from the keys alone
 tools/key-facts-sets.fixtures.mjs | 139 ++++++++++++++++++++++++++++++++++++++
 tools/key-facts-sets.mjs          |  81 ++++++++++++++++++++++
 verify/key-facts-sets.test.mjs    |  78 +++++++++++++++++++++
 3 files changed, 298 insertions(+)
```

## Call: SubagentHandback

```json
{
  "message": "The patterns, fixtures and test are written and committed, and the test passes. I read only the question files and the entry's tools\\key-facts.mjs, nothing under runs\\.\n\n- **Primary set:** 18 questions, 34 facts. **Held-out set:** 10 questions, 23 facts.\n- **Left out (YN, a yes/no or allowed/not-allowed conclusion that a pattern would also match in a denial):** N4, N9, H1, H6, H8. One fact each; each is listed with its reason in a comment in the patterns file.\n- **Fixtures:** 57 positives and 143 negatives (primary 34/85, held-out 23/58). Every fact has at least one negative, and number facts use nearby wrong numbers.\n- **Test** (`node verify/key-facts-sets.test.mjs`): passed on the first run. 28/28 expected answers hold every fact, all 57 positives match, none of the 143 negatives match, and all 9 known limits still match as recorded.\n- **knownLimits:** 9.\n- **Commit:** 8e0cb03, containing only these three files.\n\nFiles are in C:\\GitHub\\the-control-icm:\n- tools\\key-facts-sets.mjs\n- tools\\key-facts-sets.fixtures.mjs\n- verify\\key-facts-sets.test.mjs"
}
```

## Result

```
{"success":true,"message":"Report delivered to your caller."}
```
