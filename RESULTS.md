# Results

Sealed run `sup2`, Thursday 2026-10-15, 1:08 to 2:11 PM Mountain. 456 sessions on claude-sonnet-5-5
at medium effort, Claude Code 2.1.300. No session had a fault. Every staged arm was unchanged at the
end of the run. The first sealed run, `sup1`, is void and was not analysed (`DEVIATIONS.md`).

The verdicts rest on the 18 new questions, three runs each, 54 answers per arm. The sentences below
are the ones `verify/sup-verdict.mjs` wrote; the rule was fixed in `PLAN.md` before the run.

## The verdicts

| Comparison | Sentence |
|---|---|
| ICM workspace against the documents alone | By the rule fixed before the run, the ICM workspace did not earn its place against the documents alone: text rose by more than 5%. |
| ICM workspace against the entry's folder | By the rule fixed before the run, the ICM workspace did not earn its place against the entry's folder: document steps clearly rose; text rose by more than 5%. |
| On-demand loading against loading everything first (same ICM files) | The test could not tell whether loading the ICM's files as each stage is reached earned its place against loading the same files all at once. |

The ICM workspace was not shown better than both systems on these questions.

## What each arm did, per session, on the new questions

| Arm | Document steps | Instruction steps | Text in all, characters | Answer words | Seconds | Holds every key fact | Right, Claude Opus 5.5 | Right, Gemini 4 Flash |
|---|---|---|---|---|---|---|---|---|
| Documents only | 5.44 | 0 | 8,171 | 166 | 7.8 | 49 of 54 | 52 of 54 | 50 of 54 |
| The entry's folder | 2.46 | 0 | 10,447 | 85 | 4.0 | 50 of 54 | 52 of 54 | 52 of 54 |
| ICM workspace | 3.61 | 2.00 | 17,781 | 312 | 9.0 | 53 of 54 | 54 of 54 | 54 of 54 |
| Same ICM, everything loaded first | 3.89 | 1.96 | 29,208 | 318 | 8.7 | 54 of 54 | 54 of 54 | 54 of 54 |

## What that means

- **The ICM was the most accurate arm and the most expensive one.** It was right on every new
  question in both markings, and it held every key fact in 53 of 54 answers. The documents alone missed
  2 to 5 answers, depending on the reading, and the folder missed 2 to 4. The ICM read 2.2 times the
  documents' text and 1.7 times the folder's, wrote answers nearly four times as long as the folder's,
  and took more than twice the folder's time.
- **The rule weighs cost, not accuracy, unless accuracy falls.** Its answer condition only checks that
  the ICM did not lose right answers; gaining them does not count toward earning its place. Against
  the documents alone, the ICM took fewer document steps on 16 of 18 questions and lost no answers.
  It failed on text alone.
- **Against the folder it lost on steps as well as text.** The folder found its documents in 2.46
  steps; the ICM, which reads two instruction files and then every governing paper its contract
  points to, needed 3.61. Fewer document steps on 0 questions, more on 14.
- **Reading on demand saved text and changed nothing else.** The same ICM with every file loaded
  first answered the same way, took about the same steps, and still opened its two instruction files
  in almost every session (1.96 a session) although they were already loaded. It read 29,208
  characters against 17,781.
- **Few new questions separated the arms.** On 12 of the 18, every arm was right in every run and every
  reading. The differences in right answers come from six questions (N4, N6, N8, N13, N16, N20).

## The predictions, written before the run

| Prediction | Result |
|---|---|
| The ICM takes clearly fewer document steps than the documents alone | Held: fewer on 16 of 18 questions, more on none |
| The ICM's text is more than 5% above both the documents alone and the folder, so by the rule it does not earn its place against either, whatever its steps and answers | Held: 17,781 against 8,171 and 10,447 |
| Against the same ICM loaded all at once, the ICM's text is lower | Held: 17,781 against 29,208 |

## The checks on the test

- **The entry's result came back.** On the entry's own 20 questions, in this batch, the folder took
  fewer steps than the documents alone on 10 of 10 in both sets (2.37 against 5.30 and 5.13), put more
  text in front of the model (9,218 and 9,488 against 7,659 and 7,646), and held every key fact in 23
  and 25 of 30 answers against 30 and 30. The entry reported 21 to 26 of 30 against 30.
- **Planted answers.** Four answers of known grade were hidden among the 216. Both markers graded all
  four correctly.
- **Giveaway.** Asked to guess how each answer was written, Claude Opus 5.5 was right on 44% and
  Gemini on 32%, under the 70% line at which the answers would have given the arm away.
- **Markers.** Claude Opus 5.5 marked by script; Gemini 4 Flash through its chat page, in 13 new chats,
  each reply saved word for word. Neither is the model under test.

Every per-question figure is in `runs/sup2/figures.md`; the verdict lines in `runs/sup2/verdicts.md`.

## What this cannot show

- Anything about ICM's hand-offs between stages or its human review gates. The method itself chose a
  single stage for this job, because a read-only question has nothing to hand on and no one to check
  it (`builder/DECISIONS.md`).
- Anything at the scale ICM is designed for: this library is about 32,000 characters.
- Anything beyond one model, one tool and made-up documents of one kind.
- Whether the ICM's extra accuracy would hold on harder questions: the new set left most arms right
  most of the time. It was written and key-checked by Claude models, not by another maker.
