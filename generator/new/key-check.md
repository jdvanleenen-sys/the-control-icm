# Key check of the new questions

Done on Thursday 2026-10-15. The rule is in `generator/key-check-prompt.md`, applied with two substitutions: the writer (called ChatGPT in the rule) is a Claude session on `claude-opus-5-5`, and the checker (called Gemini in the rule) is a Claude session on `claude-fable-5-1`. The questions were taken from the writer's raw answer (`write.answer.md`) by `tools/renumber-new.mjs`, which changes only the headings P1..P20 to N1..N20.

## Who answered

| Role | Model the session reported | Program | Session |
|---|---|---|---|
| Writer | claude-opus-5-5 | 2.1.300 | 350de3b9-2f0f-41e0-8e96-363b59deca22 |
| Checker | claude-fable-5-1 | 2.1.300 | 3870dd06-0f83-4ebe-8d4d-010fc46e0701 |

The checker was run by `node tools/new-questions.mjs check`: a fresh session in an empty folder with no tools, given prompt one word for word with the 20 prompts pasted in and the 18 documents attached as two text files, one per organisation. The prompt it was sent (`check.prompt.txt`) holds the 20 prompts and no expected answers, no types and no "Correct requires" lines.

## The comparison

The checker's answer to each question was compared with the expected answer on every amount, date, count and yes or no. On no question did the checker give a figure, a date, a count or a yes or no that differs from the key. No question went to a dispute round, so prompt two was not sent and no session was resumed.

| Question | Key | Checker | Same |
|---|---|---|---|
| N1 | £8 (£5 + £3) | £8 (£3 + £5) | yes |
| N2 | £46 (£23 a day, 2 days) | £46 (£23 a day, 2 days) | yes |
| N3 | £28; received 2 July 2025 | £28; received 2 July 2025 | yes |
| N4 | Yes; limit 42, 36 only from 1 June 2026 | Yes; 42, 36 only from 1 June 2026; 39 | yes |
| N5 | 28 February 2027 | 28 February 2027 | yes |
| N6 | No refund | No | yes |
| N7 | £7 | £7 | yes |
| N8 | £56 (£36 + £20); due back 12:00 6 June 2025; 27 hours late | £56 (£36 + £20); 12:00 6 June 2025; 27 hours | yes |
| N9 | Yes, three days; two-day limit archived; five days from 1 April 2026 | Yes; same three limits and dates | yes |
| N10 | £12 | £12 | yes |
| N11 | No; combined limit 100 | No; 100 | yes |
| N12 | £69 (£36 + £8 + £15 + £10) | £69 (£36 + £8 + £15 + £10) | yes |
| N13 | £112 (4 h at £28) | £112 (4 h at £28) | yes |
| N14 | 50%; £30 booking deposit not refunded; 17 days | 50%; deposit not returned; 17 days | yes |
| N15 | £100 | £100 | yes |
| N16 | Full payment at acceptance, 2 October 2025 | Full payment at acceptance, 2 October 2025 | yes |
| N17 | £72 (6 h at £12) | £72 (6 h at £12) | yes |
| N18 | £130 (£30 + £100) | £130 (£30 + £100) | yes |
| N19 | The papers do not say; quorum four | The papers do not answer this; quorum four | yes |
| N20 | No lost-key charge is set | No charge for a lost key is set | yes |

### Figures in the key that the checker did not mention

The entry read a figure that is not mentioned as not a difference, and a figure stated differently as a difference. The same reading is used here. These expected answers carry figures the checker did not state; it stated nothing that conflicts with any of them:

- N6: the 48-hour cancellation window.
- N10: the archived £10 figure.
- N11: the separate room limits of 90 and 24.
- N16: the normal seven-day and 14-day deadlines (the checker says they do not apply, without the numbers).
- N19: the majority rule and the six meetings a year.
- N20: the 24-hour damage report, and the damage deposit for events serving alcohol.

The "Correct requires" lines of N19 and N20 ask for the nearby rules to be mentioned. The checker mentioned the quorum on N19 and the key rules on N20.

## Types

The checker named the same type as the writer on 18 of 20. It called N10 "plain lookup" where the writer has "trap", and N18 "plain lookup" where the writer has "two documents". By the rule this is recorded and changes nothing.

## De-duplication against the existing questions

A new question is dropped (reason "same-source") when its **Source** names the same files and the same section numbers as any question in `questions.md` or `questions-heldout.md`. Only file names and section numbers were compared: ranges such as "3.1–3.3" and "3.1 to 3.3" were expanded, a parenthesis holding only section numbers was read as section numbers, and any other note in brackets was ignored. The sets had to be equal.

| New | Same source as | Sections compared |
|---|---|---|
| N5 | H3 (`questions-heldout.md`) | film-membership.md 3.1, 3.2, 3.3 |
| N11 | H8 (`questions-heldout.md`) | hall-bookings.md 4.1, 4.2, 4.3, 4.4 |

No other new question has a source set equal to an existing one. Near misses, left in because the sets differ:

- N3 and Q2 share film-fees.md 1.1 and 4.5 and the film-changes.md subsections 1.2 to 1.4; N3 cites film-changes.md section 1 and Q2 cites 1.1.
- N13 and Q8 share hall-changes.md 2.1 to 2.3 and hall-fees.md 2.1; Q8 also cites hall-fees.md 2.4 and 3.1 to 3.3.
- N18 and H9 cite the same two files; H9 also cites hall-conduct.md 3.2 and hall-fees.md 5.4.
- N19 and Q10 both rest on hall-trustees.md 4.2 and 6.3; N19 also cites 4.1 and 4.3.
- N9 and H4 share film-equipment.md 2.2 and the film-changes.md section 4 decision, cited differently.

These overlap in rule, not only in section, but the rule fixed for this check compares section numbers only.

## The result

Two questions are dropped, both for "same-source": N5 and N11 (`dropped.txt`). None is dropped for a dispute. The 18 that survive are in `questions-new.md` at the repo root, unchanged, under their N numbers: 9 film and 9 hall.

| Type | Film | Hall |
|---|---|---|
| plain lookup | N1, N2 | N12 |
| changed rule | N3, N4 | N13, N14 |
| exception or condition | N6 | N15, N16 |
| two documents | N7, N8 | N17, N18 |
| trap | N9, N10 | N19, N20 |

## What the writer reported about the documents

Saved word for word in `contradictions.md`:

**Contradictions found**

- hall-changes.md section 7.2 (from 1 July 2026 the chair may authorise up to £650 for urgent safety work) against hall-trustees.md section 5.4 (two trustees must approve payments above £500). hall-safety.md section 5.2 overrides only hall-trustees.md section 5.2, so payments between £500.01 and £650 fall under both rules.

## The checker's answer, as returned

From `check.answer.md`, unchanged.

````
## N1

**Answer:** £8 in total: £3 for the 9-year-old (under 12, accompanied by an adult) and £5 for the 12-year-old (aged 12 to 15). The children's prices are age-based, not member discounts, so the non-member rule does not raise them.

**Rests on:** film-fees.md 2.3, 2.4, 2.5

**Type:** plain lookup

## N2

**Answer:** £46: hiring both together costs £23 per booking day, times two booking days. The archive's £19 rate was superseded on 1 March 2025.

**Rests on:** film-fees.md 3.3; film-equipment.md 2.1; film-fees-archive.md 3.3 (superseded)

**Type:** plain lookup

## N3

**Answer:** £28. A transfer counts as received when it clears, so payment was received on 2 July 2025, which is on or after the 1 July 2025 change from £24 to £28.

**Rests on:** film-changes.md 1.2, 1.3; film-fees.md 1.1, 4.5

**Type:** changed rule

## N4

**Answer:** Yes. The lowered limit of 36 applies only to screenings on or after 1 June 2026, so the 30 May 2026 limit is still 42 excluding duty volunteers; 38 inside plus one more is 39.

**Rests on:** film-screenings.md 3.1, 3.6; film-changes.md 5.2, 5.3

**Type:** changed rule

## N5

**Answer:** 28 February 2027. Membership begins on 10 February 2026, and a member who joins during February gets membership until 28 February of the following year rather than the February just ahead.

**Rests on:** film-membership.md 3.1, 3.2, 3.3

**Type:** exception or condition

## N6

**Answer:** No. A changed film entitles a buyer to a full refund only before entry; a buyer who enters after being told of the change loses that option, and leaving early creates no refund right.

**Rests on:** film-refunds.md 2.2, 2.3; film-fees.md 5.2

**Type:** exception or condition

## N7

**Answer:** £7, the standard admission price. A suspended member cannot claim member prices, and 10 April 2026 falls within the suspension.

**Rests on:** film-membership.md 5.3, 5.4; film-fees.md 2.1; film-conduct.md 4.4

**Type:** two documents

## N8

**Answer:** £56: hire of £36 (2 booking days at £18) plus £20 late charge. The return deadline was 12:00 on 6 June 2025, so a 15:00 return on 7 June is 27 hours late, which is two started 24-hour periods at £10 each.

**Rests on:** film-fees.md 3.1; film-equipment.md 2.1, 5.2

**Type:** two documents

## N9

**Answer:** Yes. The governing limit for a collection on 6 May 2025 is three consecutive booking days; the two-day limit is from the archived schedule superseded on 1 March 2025, and the five-day limit only applies to collections from 1 April 2026. The request was also made more than three days ahead.

**Rests on:** film-equipment.md 1.2, 2.2; film-fees-archive.md 3.6 (superseded); film-changes.md 4.2, 4.3

**Type:** trap

## N10

**Answer:** £12. The 16-to-17 rate is unchanged; the 1 July 2025 increase applies only to adult membership.

**Rests on:** film-fees.md 1.2; film-membership.md 1.2; film-changes.md 1

**Type:** plain lookup

## N11

**Answer:** No. Combined events may not exceed 100 people in the building, and capacities include organisers and children, so 105 is over the limit.

**Rests on:** hall-bookings.md 4.3, 4.4

**Type:** plain lookup

## N12

**Answer:** £69: Meeting Room £36 (3 hours at £12), kitchen £8, projector £15, and two sets of display boards £10.

**Rests on:** hall-fees.md 2.2, 2.3, 2.5, 4.1, 4.3

**Type:** plain lookup

## N13

**Answer:** £112. The Main Hall rate rose to £28 per hour for events on or after 1 November 2025, and the controlling date is the event date (8 November 2025), not the acceptance date; 4 hours at £28.

**Rests on:** hall-changes.md 2.1, 2.2, 2.3; hall-fees.md 2.1, 2.5, 2.6

**Type:** changed rule

## N14

**Answer:** 50% of the room, kitchen and equipment hire charges, and no, the £30 booking deposit is not returned. The cancellation was received 17 days before the event, and the 25% rule only applies to cancellations received on or after 1 June 2026, so the 29 May 2026 receipt keeps the 50% rate.

**Rests on:** hall-refunds.md 1.4, 2.2, 2.4, 2.5, 2.6; hall-changes.md 6.1, 6.2, 6.3

**Type:** changed rule

## N15

**Answer:** £100. The cancellation was received 10 days before the event, so none of the hire charge (including the non-refundable £30 deposit) comes back, but the unused £100 damage deposit is returned in full.

**Rests on:** hall-refunds.md 2.3, 2.5, 4.5

**Type:** exception or condition

## N16

**Answer:** The full hire charge, deposit included, is due at acceptance on 2 October 2025, because the booking was made fewer than 14 days before the event. The usual seven-day and 14-day deadlines do not apply.

**Rests on:** hall-fees.md 6.1, 6.2, 6.3

**Type:** exception or condition

## N17

**Answer:** £72. Sunday closing is 21:00 and clearing must finish within booked hours, so the longest booking from 15:00 is 6 hours at £12 per hour.

**Rests on:** hall-bookings.md 3.3, 3.4, 3.5; hall-fees.md 2.2, 2.5

**Type:** two documents

## N18

**Answer:** £130 in deposits: the £30 booking deposit required for every booking plus the £100 damage deposit required when alcohol is served, which are separate.

**Rests on:** hall-fees.md 5.1, 5.2, 5.3; hall-conduct.md 3.1, 3.3

**Type:** plain lookup

## N19

**Answer:** The papers do not answer this. Four trustees form a quorum, but the rules expressly do not specify whether trustees may attend remotely.

**Rests on:** hall-trustees.md 4.2, 6.3

**Type:** trap

## N20

**Answer:** The papers do not set any charge for a lost key. The key rules only cover collection and the ban on copying or passing keys on.

**Rests on:** hall-bookings.md 5.1, 5.2

**Type:** trap
````
