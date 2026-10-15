# Practice rounds

Harness for every run: `tools/practice.mjs`, model claude-sonnet-5-5, effort medium, tools Read,
Glob, Grep, one fresh session per question, doclist `01 answer/documents.md`. One run per
question. Raw logs (the printed summary `<Q>.txt` and the stream `<Q>-r1.jsonl`) are under
`practice-logs/round-N/<set>/`. Verdicts are mine, judged against each set's `questions.md`
("Correct requires").

## Round 1 — 2026-10-15, 09:49–09:50 MDT

**Plan.** Nine questions, three per set, one per trap type I expected the contract to have to
handle, so that one round covers every rule in the contract at least once: date split on a
missing date (boat-lend Q1), a rule in a second paper changing the answer (boat-lend Q2), a
per-item cap (boat-lend Q8), a change entry whose trigger is not met (garden Q2), a casual message
with a wrong belief and two asks (garden Q4), a missing fact with three outcomes (makerspace Q8),
two events either side of an effective date (pool Q3), a receipt-date test plus month arithmetic
(pool Q5), a three-part question with rounding up and a change entry (hall Q10). Nine, not all
thirty, because each further run of the same trap type tells me little until something fails;
the untested questions are kept for round 2 as a held-out check.

| Q | Verdict | Reason | Steps (instr/doc) | Text fetched |
|---|---|---|---|---|
| boat-lend Q1 | Right | £100 if paid by 31 March, £110 from 1 April; payment date named | 5 (2/3) | 14,318 |
| boat-lend Q2 | Right | £8 paid, £8 refunded via the safety paper's closure rule | 6 (2/4) | 16,254 |
| boat-lend Q8 | Right | £20 (£10 cap per item), new loan blocked until paid or waived | 7 (2/5) | 17,294 |
| garden Q2 | Right | In time; 14-day period, deadline 4 July, notice dated before 1 July | 4 (2/2) | 15,112 |
| garden Q4 | Right | Standard plot £85 (reduced rate stays on the Starter), no second deposit | 5 (2/3) | 18,401 |
| makerspace Q8 | Right | Depends on tier: Bench yes, Forge yes, Keystone no | 6 (2/4) | 20,906 |
| pool Q3 | Right | £4 then £6, booking suspended 14 days | 6 (2/4) | 20,127 |
| pool Q5 | Right | £32 (two whole months at £26, less £20); Change 5 not reached | 6 (2/4) | 20,621 |
| hall Q10 | Right | 3 adults, no alcohol at all, £300 deposit | 7 (2/5) | 21,723 |

**Headline:** 9 of 9 right. Mean steps 5.8 (instruction opens 2 every time). Mean text fetched
about 18,300 characters. Answers 197–424 words, 7–14 s.

**What I saw.** Every run read the contract and the list in one step, then read the changes paper
and the governing papers whose cover lines touched the facts, in parallel. No run opened a summary
or an archive paper. The weakness was not accuracy but scope: several answers added rules nobody
asked about (garden Q4 added due dates and late charges; pool Q5 added a claim time limit and said
it could not tell which date starts it; makerspace Q8 said "I did not read fees.md"). None was
wrong here, but every extra rule is one more claim that can be wrong or can read as doubt, and a
marker judging against "Correct requires" gains nothing from it.

**Change.** Added one bullet to "What goes out" in `01 answer/CONTEXT.md`: keep to what was
asked; a rule that could have decided the case but does not gets one line saying why not; leave
out rules about matters the question did not raise. Nothing else changed, because nothing failed.

## Round 2 — 2026-10-15, 09:50–09:51 MDT

**Plan.** The 21 questions not run in round 1, all of them, as a held-out check on the round-1
contract plus its scope bullet. Running all of them costs about 20 seconds of wall time in
parallel, and a contract that only passes the questions it was tuned on proves nothing.

| Q | Verdict | Reason | Steps (instr/doc) | Text fetched |
|---|---|---|---|---|
| boat-lend Q3 | Right | No: summer limit of two future bookings in a rolling seven days | 5 (2/3) | 14,621 |
| boat-lend Q4 | Right | £4 (£2 per boat), no charge for the adult | 7 (2/5) | 18,579 |
| boat-lend Q5 | Right | Not allowed, three guest days used; next from 1 January 2027 | 6 (2/4) | 16,663 |
| boat-lend Q6 | Right | £30, runs from 10 January 2026 | 5 (2/3) | 14,162 |
| boat-lend Q7 | Right | 14 days if collected by 31 March, 21 from 1 April; collection date named | 4 (2/2) | 12,407 |
| boat-lend Q9 | Right | Full £30 refund, by 24 July 2026 | 6 (2/4) | 15,920 |
| boat-lend Q10 | Right | £40 charge, £20 deposit applied, £20 balance within 14 days of notice | 7 (2/5) | 17,456 |
| garden Q1 | Right | First Saturday of each month, April to October | 4 (2/2) | 15,406 |
| garden Q3 | Right | No: sprinklers banned, hose held in hand | 5 (2/3) | 18,256 |
| garden Q5 | Right | Depends on age: 70 or over yes, under 70 no | 5 (2/3) | 18,695 |
| makerspace Q6 | Right | Depends on Wh rating: 100 Wh or less yes, above no | 5 (2/3) | 18,082 |
| makerspace Q7 | Right | No-show on the 10-minute rule, session date decides | 6 (2/4) | 21,200 |
| makerspace Q9 | Right | May collect; 21-day period, item moved before 15 July | 5 (2/3) | 18,082 |
| makerspace Q10 | **Wrong** | First line "30 September 2026"; the working then reached 31 August and the last paragraph retracted the first line. The reply contradicts itself, so a reader taking the first line gets the trap answer | 5 (2/3) | 18,116 |
| pool Q1 | Right | £7, visit date decides | 6 (2/4) | 20,524 |
| pool Q2 | Right | £274 (£234 + £40) | 5 (2/3) | 17,818 |
| pool Q4 | Right | 2 lifeguards | 5 (2/3) | 17,598 |
| hall Q6 | Right | 100 allowed (120 standing, helpers counted), 3 stewards aged 18+ | 6 (2/4) | 19,451 |
| hall Q7 | Right | Whole hire charge kept, deposit refunded in full, unused projector not charged | 6 (2/4) | 19,768 |
| hall Q8 | Right | £92 (4 hours at £18 plus £20 kitchen) | 7 (2/5) | 22,111 |
| hall Q9 | Right | 22:30, £50 deduction | 6 (2/4) | 19,817 |

**Headline:** 20 of 21 right. Mean steps 5.5 (instruction opens 2 every time). Mean text fetched
about 17,800 characters. 116–383 words.

**What I saw.** The one failure is a structural one, not a missing rule: the contract told the
model to put the direct answer on the first line, and the session log shows no thinking blocks
at medium effort, so the first line is written before any working exists. On makerspace Q10 the
model committed to the trap reading ("before the 20th") in line one, reached the right date in
its own working, and could only retract at the end. Every other answer happened to have a first
line that its working confirmed. The scope bullet from round 1 mostly held (shorter answers), but
hall Q7 still added an unasked deposit section.

**Change.** Reordered "What goes out" in `01 answer/CONTEXT.md`: rules first, then working, then
a written check (the old "Before you send it" list, which the model could not act on after
sending, folded into the reply itself), then the answer last on its own line beginning
**Answer:**, which must agree with the working. The separate "Before you send it" section is gone
(one home for the check).

## Round 3 — 2026-10-15, 09:52 MDT

**Plan.** Fifteen runs. Makerspace Q10, the round-2 failure, three times (one run of a question
that failed once cannot show the fix holds). Then twelve regression questions from rounds 1 and
2, chosen as the ones whose answers had the longest working or a date split, since moving the
answer to the end changes most for them: boat-lend Q1, Q2, Q7, Q8; garden Q2, Q4, Q5; makerspace
Q8; pool Q3, Q5; hall Q7, Q10.

| Q | Verdict | Reason | Steps (instr/doc) | Text fetched |
|---|---|---|---|---|
| makerspace Q10 run 1 | Right | 31 August 2026 | 5 (2/3) | 18,433 |
| makerspace Q10 run 2 | Right | 31 August 2026 | 5 (2/3) | 18,433 |
| makerspace Q10 run 3 | Right | 31 August 2026 | 5 (2/3) | 18,433 |
| boat-lend Q1 | Right | £100 / £110; payment date named as deciding in the rules section | 5 (2/3) | 14,929 |
| boat-lend Q2 | Right | £8 paid, £8 refunded | 7 (2/5) | 18,984 |
| boat-lend Q7 | Right | 14 / 21 days by collection date | 4 (2/2) | 12,724 |
| boat-lend Q8 | Right | £20, new loan blocked | 7 (2/5) | 17,904 |
| garden Q2 | Right | In time, 4 July deadline | 4 (2/2) | 15,723 |
| garden Q4 | Right | $85, no second deposit | 5 (2/3) | 19,012 |
| garden Q5 | Right | Depends on age, 70 | 5 (2/3) | 19,012 |
| makerspace Q8 | Right | Depends on tier, Keystone no | 6 (2/4) | 21,517 |
| pool Q3 | Right | £4, £6, 14-day suspension | 6 (2/4) | 20,738 |
| pool Q5 | Right | £32 | 6 (2/4) | 21,232 |
| hall Q7 | Right, untidy | Whole charge kept, deposit back, projector not charged; but opens with a muddled clause and leaves a dangling "Deposit amount:" heading | 6 (2/4) | 20,085 |
| hall Q10 | Right | 3 adults, no alcohol, £300 | 6 (2/4) | 20,044 |

**Headline:** 15 of 15 right (makerspace Q10 3 of 3). Mean steps 5.5. Mean text fetched about
18,500 characters. Answers grew from about 250 to about 370 words mean, the price of the written
working and check.

**What I saw.** The reorder fixed the self-contradiction and caused no regression. One new
weakness: on hall Q7 the model treated facts the question never asked about (the size of the
hire charge, the deposit amount) as "missing deciding facts" and started splitting on them, which
is what produced the dangling heading. Harmless here, but on a determinate question the same
over-firing would turn a single right answer into an "it depends" hedge, which the answer keys
mark wrong.

**Change.** Step 6 of the contract (missing fact) now says: only a fact the *asked* answer turns
on counts as missing; a fact that would change only something not asked is left out; when the
answer is the same whatever the fact, give the one answer, not a split.

## Round 4 — 2026-10-15, 09:53 MDT

**Plan.** All 30 questions, one run each, on the contract as changed after round 3. Rounds 3's
change touches every answer that could split on a fact, and the full set is the only check that a
narrowed missing-fact rule did not stop the real missing-fact questions (garden Q5, makerspace Q6,
makerspace Q8, boat-lend Q1, boat-lend Q7) from splitting.

**Housekeeping found during this round.** Four empty files (`facts`, `read`, `the`, `were`) sat
in `icm/01 answer/` from 09:51, made by a shell command of mine that failed on quoting while
editing the contract. They were copied into the round-3 and round-4 rooms. No session opened
them (instruction opens were 2 in every run, both the contract and the list), so the verdicts
stand. Deleted after this round.

| Set | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 |
|---|---|---|---|---|---|---|---|---|---|---|
| boat-lend | Right (5) | Right (7) | Right (5) | Right (7) | Right (6) | Right (5) | Right (4) | Right (6) | Right (6) | Right (7) |
| garden-makerspace | Right (4) | Right (4) | Right (5) | Right (5) | Right (5) | Right (5) | Right (6) | Right (6) | Right (5) | Right (5) |
| hall-pool | Right (6) | Right (5) | Right (6) | Right (5) | Right (6) | Right (5) | Right (6) | Right (7) | Right (6) | Right (6) |

(Steps in brackets; instruction opens were 2 in every run.)

One-line reasons, against each key's "Correct requires":
- boat-lend: Q1 £100/£110 on the payment date; Q2 £8 paid, £8 refunded; Q3 no, two in a rolling
  seven days; Q4 £4; Q5 no, next from 1 January 2027; Q6 £30 from 10 January 2026; Q7 14/21 days
  on the collection date; Q8 £20, loan blocked; Q9 £30 by 24 July 2026; Q10 £40, deposit applied,
  £20 within 14 days of notice.
- garden-makerspace: Q1 first Saturday, April to October; Q2 in time, 4 July; Q3 no, sprinklers
  banned; Q4 $85, no second deposit; Q5 depends on age 70; Q6 depends on Wh, 100 allowed; Q7
  no-show, 10 minutes; Q8 depends on tier, Keystone no; Q9 may collect, 21 days; Q10 31 August.
- hall-pool: Q1 £7; Q2 £274; Q3 £4, £6, 14-day suspension; Q4 2 lifeguards; Q5 £32; Q6 allowed,
  3 stewards; Q7 whole charge kept, deposit back, projector not charged; Q8 £92; Q9 22:30, £50;
  Q10 3 adults, no alcohol, £300.

**Headline:** 30 of 30 right. Mean steps 5.53 (range 4 to 7; 2 instruction opens every run).
Mean text fetched 18,441 characters. Mean answer 348 words. No run opened a summary or an archive
paper.

**What I saw.** The five missing-fact questions still split, and no determinate question split.
The one remaining blemish is hall Q7 again adding the deposit amount, unasked, with one branch
incomplete (it gave the ordinary Main Hall deposits and not the higher ones); the asked parts are
right. Tightening scope further risks cutting the one-line "why not" that several keys reward
(why the summary's or archive's figure is wrong), so I left it.

**Change.** None to the contract. Stopped here, after four rounds of the allowed five, because
the last round showed nothing worth changing: 30 of 30 with no failure pattern, and another round
would be tuning to these 30 questions rather than to papers of this kind.

## Cold self-check against the walk test — 2026-10-15, 09:54 MDT

Read cold as an agent with no memory, item by item from the skill's walk test.

1. **Where am I, where do I go, within the entry file plus at most two reads?** Pass. `CLAUDE.md`
   (auto-loaded) says what the workspace is and sends a question to `01 answer/CONTEXT.md` and
   `01 answer/documents.md`, read together. Two reads, and every practice run made exactly those
   two instruction opens.
2. **Does any stage contract name exact input paths, the job, the output, and the human check?**
   Partly, by design. `01 answer/CONTEXT.md` names the question, `documents.md` and
   `reference/<organisation folder>/` as inputs, states the job, and states the output (one reply,
   in a fixed order, ending in an **Answer:** line). There is no human check, because nobody is
   present during a run and the brief forbids asking; the written check inside the reply stands in
   for it. Recorded as departure 5 in `DECISIONS.md`.
3. **Status by scanning `output/` folders?** Not applicable. A run writes nothing; each question
   is a fresh session whose state is the reply. Departure 4 in `DECISIONS.md`.
4. **Is any routing file carrying payload?** Pass. `CLAUDE.md` is 14 lines of routing. The root
   `CONTEXT.md` is a map (what is here, how a question moves, how the list is made, never-rules)
   and holds no reading rule; it points to the contract for the four kinds of paper.
5. **Is any fact stored in two places?** Pass. The four kinds of paper and every reading rule live
   only in `01 answer/CONTEXT.md`. Facts from the papers live only in the generated
   `documents.md` and in `reference/`. The never-rules appear briefly in both `CLAUDE.md` and the
   contract (never ask back, never edit); I kept that small overlap on purpose because the entry
   file is the only file guaranteed to load.
6. **After a restructure, do earlier references still resolve?** Not a restructure. Every path
   named inside the workspace (`01 answer/CONTEXT.md`, `01 answer/documents.md`, `reference/`,
   `tools/make-map.mjs`) exists at run time; the last is in the workshop, named only in the map
   for the maintainer.
7. **Token check: entry + one contract + its inputs in about 2k to 8k tokens.** Pass. Entry file
   about 200 tokens, contract about 1,500, list about 800, and the papers a run actually read
   averaged 18,441 characters in total (about 4,600 tokens, including the two instruction files).
   A run lands near 5k to 7k tokens.
8. **System map only.** Not applicable.

Build rules checked by script at 09:54: exactly one `CLAUDE.md` in `icm/`, at its top; no `@`
anywhere in `icm/`; no `reference/` folder in `icm/`; the only digits in `icm/` are the stage
number `01` and list numbering; no organisation or paper name from any practice set appears.
Nothing in `practice/` or `template/` was edited.
