# Deviations from the plan

Anything done differently from `PLAN.md`, in the order it happened, with the reason. Corrections to
the plan made before the build are in `DESIGN-LOG.md`.

## Thursday 2026-10-15: the gate failed once, and the builder's fifth round fixed it

The gate auditor (`builder/GATE-1.md`) passed every applicable item but one, counted twice: three rules
were written in three files each, against the method's "one home per fact" (walk test, invariant 8).
The plan said the ICM runs only if every applicable item passes, and allowed only four kinds of fix
after the switch to live documents; it did not say what follows a failed gate. We decided: the
builder used its fifth practice round, which the plan allowed and which had not been used, to fix only
the failing item (and to say plainly that the map script lives outside the workspace, which the
auditor also noted), on practice documents, with the six gate questions run again. The live document
list was then regenerated and the gate run again by a fresh auditor. The builder never saw the live
documents or any live question.

The fifth round changed three files (12 lines added, 8 removed; diff in
`builder/practice-logs/round-5/icm.diff`). A fresh auditor then passed the gate with no failures and
six of six practice answers right (`builder/GATE-2.md`). It recorded four problems that are not among
the four fixable kinds, so they were left as they are: the map's note on regenerating the list would
not work as a literal command, the stage contract is about three times the size the method suggests,
it mixes path styles, and it repeats one rule within itself. The text prediction was updated to the
fifth round's file sizes before the freeze.

## Thursday 2026-10-15: the first sealed run, sup1, is void

`sup1` ran from 10:08 to 11:00 AM Mountain. From session 345 on, the account's five-hour usage
limit refused every session (112 of 456, 25%); the run went on to the end because a refusal was
counted as a fault, not as a reason to stop. By the rule fixed in `PLAN.md`, more than 5% of sessions
faulted in a verdict arm voids the run. `sup1` is void. It is kept as it ran, under `runs/sup1/`, and
was not analysed or marked: nobody looked at its answers, steps or text.

What changed for the next run, and only this: `tools/sup-run.mjs` now treats a session refused for the
usage limit as never having reached the model. It keeps the refused attempt under its own name
(`.ratelimitN.jsonl`), waits until the limit resets, and asks again. Nothing a session sees changes:
not the arms, the questions, the model, the flags or the order. The freeze was taken again with the
changed file (`FREEZE.md`), and a new schedule, `sup2`, was drawn from it. The limit is shared with
the build session itself, which is why a whole run did not fit in one window.

`sup2` was drawn with the same seed as `sup1`, because the seed is the fingerprint of the arms and
the questions and neither changed; its session order is the same and its arm codes are new. It ran
with no usage-limit refusal, so the new waiting rule was never used.

## Thursday 2026-10-15: carrying Gemini's batches

The batches went to Gemini through the clipboard. Twice the clipboard held something else when the
paste was made (the operator's machine shares one clipboard). A check run before every send (the
marking rules first, and the batch's exact number of answers) caught both, and neither was sent. Each
batch was then pasted again and checked. A plan to serve the batches from a local web server instead
was refused by the build session's safety settings and not used.
