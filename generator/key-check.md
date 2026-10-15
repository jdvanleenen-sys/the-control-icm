# Key check

Done on Monday 2026-10-12, before the draw. The rule is in `key-check-prompt.md`.

## Who answered

Gemini 3.8 Flash, in the browser, in a temporary chat. It was given the 18 documents as two text files (one per organisation, each document under its file name) and the 20 prompts with no expected answers and no types. It was told nothing about the folder or the experiment.

## The result

All 20 questions stay in the pool. `dropped.txt` is empty.

Gemini's answer was compared with the expected answer on every amount, date, count and yes or no. On no question did Gemini give a figure, a date or a yes or no that differs from the key.

| Question | Key | Gemini | Same |
|---|---|---|---|
| P1 | Not compulsory; threshold £10 | Not compulsory; £10 or more | yes |
| P2 | Seat held until 19:40; doors 19:00 | 19:40; 19:00 | yes |
| P3 | £24 and £28 | £24 and £28 | yes |
| P4 | £100 | £100 | yes |
| P5 | 28 February 2027 | 28 February 2027 | yes |
| P6 | No warning needed | No | yes |
| P7 | £46; noon on 14 May 2026 | £46; 12:00 noon on 14 May 2026 | yes |
| P8 | No discount; £7 | No; £7 | yes |
| P9 | £24 | £24 | yes |
| P10 | £3 | £3 | yes |
| P11 | Quorum four; no valid decision | Four; cannot decide | yes |
| P12 | £25 | £25 | yes |
| P13 | 25%; £36 | 25%; £36 | yes |
| P14 | No; 21:30 | No; 21:30 | yes |
| P15 | No; limit 100; over by 12 | No; 100; over by 12 | yes |
| P16 | No discount; £48 | No; £48 | yes |
| P17 | Written permission; £100 and £30; £130 | Written permission; £100 and £30; £130 | yes |
| P18 | 21 of 24, permitted; supervision required | 21 within 24, permitted; cannot be left unsupervised | yes |
| P19 | The papers set no maximum | The papers do not contain the answer | yes |
| P20 | The papers do not say | The papers do not contain the answer | yes |

## A reading of the rule that was made after seeing the answers

The rule says a question goes to a dispute round "if any differ". Five expected answers carry a secondary figure that the question does not ask for and Gemini did not mention: the extra £20 on P4, the £4 member price on P8, the later £28 fee on P9, the 15 minutes on P14, and the quorum of four on P20. Gemini stated nothing that conflicts with any of them. We read a figure that is not mentioned as not a difference, and a figure that is stated differently as a difference. Under the stricter reading those five would have gone to a dispute round. No question was reworded, and no dispute round was run.

This matters later. The "Correct requires" lines of those five questions ask for the secondary figure, so a marker may grade an answer wrong that gives the main figure and leaves the secondary one out. That is the same in every arm.

## Types

Gemini named the same type as the writer on 18 of 20. It called P1 "exception or condition" where the writer has "plain lookup", and P16 "plain lookup" where the writer has "exception or condition". By the rule this is recorded and changes nothing. The draw uses the writer's types.

## What the writer reported about the documents

ChatGPT listed two contradictions and wrote no question on either. Its words:

- Fenwray Film Society: film-equipment.md, sections 2.1 and 5.1. Booking days end at 12:00 noon, but returns are accepted between 10:00 and 16:00 by arrangement. This creates potential ambiguity about whether a return after noon on the scheduled last day incurs a late charge under section 5.2, although the provisions are not necessarily irreconcilable.
- Quillbrook Village Hall: hall-refunds.md, sections 2.1 and 2.5–2.6. Section 2.1 promises a full refund for cancellation at least 28 days before the event, while sections 2.5–2.6 exclude the £30 booking deposit from every hirer cancellation. The intended result appears to be a full refund of eligible hire charges excluding the booking deposit, but the unqualified phrase "full refund" is inconsistent with that exclusion.

The first bears on P7, which asks when hired equipment must be returned. Gemini gave the same deadline as the key.

## Things in the pool that were noticed and left alone

- The prompt asked that no two questions rest on the same rule. Four pairs do: P3 and P9 (the adult membership fee), P11 and P20 (the quorum), P13 and P16 (the village group discount), P15 and P18 (room capacity).
- Two film documents refer to `film-safety.md`, which the writer did not produce.

## Gemini's answer, as pasted

The copy out of the browser lost the line breaks. Nothing else was changed.

```
P1Answer: A receipt is not compulsory for a £9 cash payment, as the treasurer is only required to issue a receipt for payments of £10 or more.   Rests on: film-fees.md section 4.4   Type: exception or conditionP2Answer: The society must hold the reserved seat until 19:40 (10 minutes after the advertised start). Doors normally open 30 minutes before the advertised start time, which is 19:00.   Rests on: film-screenings.md sections 3.3 and 3.4   Type: plain lookupP3Answer: The first person should pay £24 because their payment was received before 1 July 2025. The second person should pay £28, as annual adult membership increased to £28 for payments received from 1 July 2025.   Rests on: film-fees.md section 1.1 and film-changes.md section 1   Type: changed ruleP4Answer: The member must provide a security deposit of £100 before collection. Under the committee decision effective 1 October 2025, the deposit increased from £80 to £100, and earlier confirmed bookings are subject to the new deposit if collected on or after that date.   Rests on: film-changes.md section 2 and film-equipment.md section 3.1   Type: changed ruleP5Answer: The membership expires on 28 February 2027. It does not end in February 2026; under the February joining rule, a member who joins during February receives membership until 28 February of the following year.   Rests on: film-membership.md section 3.3   Type: exception or conditionP6Answer: No, the duty volunteer is not required to issue a warning. The rules state that serious threats may result in immediate removal without a warning.   Rests on: film-conduct.md section 2.3   Type: exception or conditionP7Answer: The total hire charge is £46, which is £23 per booking day for hiring both together for two booking days. Because each booking day runs until 12:00 noon the next day, the equipment must be returned by 12:00 noon on 14 May 2026 (between 10:00 and 12:00 during return hours).   Rests on: film-fees.md section 3.3 and film-equipment.md sections 2.1 and 5.1   Type: two documentsP8Answer: No, they are not entitled to the discount because suspended members cannot claim member prices. Standard admission of £7 applies instead.   Rests on: film-membership.md section 5.4 and film-fees.md section 2.1   Type: two documentsP9Answer: The treasurer should collect £24. The £20 figure appears in the superseded historical archive sheet that ceased applying on 28 February 2025, whereas governing rules set the adult annual fee at £24.   Rests on: film-fees.md section 1.1 and film-fees-archive.md sections 1.1, 5.1, and 5.2   Type: trapP10Answer: The correct ticket price is £3. The £2 price is from a superseded archived fee schedule that is no longer valid.   Rests on: film-fees.md section 2.3 and film-fees-archive.md sections 2.3 and 5.1   Type: trapP11Answer: The required quorum is four trustees. Because only three trustees attend, the meeting lacks a quorum and the committee cannot make a valid decision.   Rests on: hall-trustees.md sections 4.2 and 4.3   Type: plain lookupP12Answer: The total equipment charge is £25. This consists of £10 for the portable speaker and £15 for the three sets of folding display boards at £5 per set.   Rests on: hall-fees.md sections 4.2 and 4.3   Type: plain lookupP13Answer: A room-hire discount of 25% applies, as the event takes place after the 1 February 2026 change took effect. The standard charge for four hours at £12 per hour is £48, making the discounted room charge £36.   Rests on: hall-changes.md section 3 and hall-fees.md sections 2.2 and 3.1   Type: changed ruleP14Answer: No, the band may not play until 21:45. Under the decision effective 1 April 2026, amplified music on Friday and Saturday must stop by 21:30.   Rests on: hall-changes.md section 5 and hall-conduct.md section 4.1   Type: changed ruleP15Answer: No, the combined event is not permitted at that attendance. The total attendance of 112 people exceeds the maximum combined building limit of 100 people by 12 people.   Rests on: hall-bookings.md sections 4.3 and 4.4   Type: exception or conditionP16Answer: No, the group does not qualify for the discount because a registered village group must have at least ten local members. The room-hire charge without the discount is £48 (£24 per hour for two hours).   Rests on: hall-fees.md sections 2.1, 2.4, and 3.2   Type: plain lookupP17Answer: Serving wine requires prior written permission and a separate £100 damage deposit in addition to the £30 booking deposit. The hirer must provide £130 in deposits altogether.   Rests on: hall-conduct.md sections 3.1 and 3.3, and hall-fees.md sections 5.1, 5.2, and 5.3   Type: two documentsP18Answer: The attendance of 21 total occupants is permitted within the 24-person Meeting Room capacity, but the children cannot be left unsupervised. The rules require that children under 12 remain under adult supervision at all times.   Rests on: hall-bookings.md sections 4.2 and 4.4, and hall-safety.md section 3.3   Type: two documentsP19Answer: The papers do not contain the answer. The rules explicitly state that they do not set a maximum number of trustee terms.   Rests on: hall-trustees.md sections 2.4 and 6.1   Type: trapP20Answer: The papers do not contain the answer. The governing documents specifically state that the rules do not specify whether trustees may attend remotely.   Rests on: hall-trustees.md sections 4.2 and 6.3   Type: trap
```
