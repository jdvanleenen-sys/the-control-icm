# Before publishing

Thursday 2026-10-15. Before this repository was made public, every commit was rewritten once to take out
private details. Nothing that a result rests on was changed: no question, key, arm, log line of a
sealed run, mark or figure.

## What was taken out

- **The template's mock intake folder** (`builder/template/01 intake/77-mockup-drive/`): three sample
  purchase orders, a house note and site notes from the PO Verifier template. They are sample data for
  another project and were never part of the ICM. Their fingerprint lines were dropped from
  `builder/fingerprints.txt`.
- **A person's name** in the PO Verifier template, and wherever the build sessions quoted it, replaced
  by "Sam".
- **A city name** replaced by "Springfield", and a commercial product name by "OrderDesk".
- **A sample builder code** in file names replaced by "XYZ".
- **The operator's Windows user name** in file paths replaced by `<user>`. `tools/work-record.mjs` now
  takes the names to hide from an environment variable instead of naming them.

The template's other fingerprints in `builder/fingerprints.txt` were taken before these swaps and no
longer match the published template files. The brief's and the skill's fingerprints still match.

## Commit ids

Rewriting changed every commit id after the first four. Pages written before publication cite the
old ids. This table maps each one to the published commit, in the same order.

| Old id | Published id | Commit |
|---|---|---|
| a03699e | 661f3d7 | Results of sup2: the verdicts as the rule wrote them, the figures beside them, and the front page |
| a4ecc6a | 8a6dd07 | Reveal: the key for sup2, after every mark was committed |
| 389d316 | 13f2574 | Marks for sup2 before the key is revealed: Claude Opus 5.5 by script, Gemini 4 Flash through its chat page, each reply saved word for word |
| 1ecb959 | 67a8154 | Marking batches for sup2, built before any mark: 220 answers (216 real, 4 planted), shuffled, arm codes hidden |
| 1d70728 | bf973a2 | Sealed run sup2: 456 sessions, no faults; key kept back until marking is done |
| 775db44 | 37bcfa2 | Schedule for the sealed run sup2, drawn from the refreshed freeze; the key is kept back |
| e7d40c9 | 901aa6b | sup1 is void (usage limit refused 25% of sessions), kept unanalysed; the runner now waits out a usage-limit refusal; freeze taken again |
| 7552c11 | 2bbfb2e | Schedule for the sealed run sup1: 456 sessions, seed from the freeze fingerprints; the key is kept back |
| 9d921b8 | 287f24d | Freeze: every arm, the questions and the analysis fingerprinted before the schedule is drawn |
| 5d39829 | c7f1023 | The second gate passes; text prediction updated to the final file sizes |
| 27acf16 | 8e05e29 | The ICM after the builder's fifth practice round, which fixed only the gate's failing item; live list regenerated, checks pass |
| cd7a838 | c2212f4 | End-to-end self-test of the supplement's pipeline on stand-in sessions |
| df6a4d8 | 86a2431 | The first gate audit and its practice logs |
| 3909a98 | 7946552 | The text prediction, written after the ICM's minimum text was published; the gate's first result and what follows it |
| 647d783 | 4b74ec0 | The ICM as built on practice documents (one stage, chosen by the method), its live document list generated, the build logs and work records, the scripted checks, and the marking rules and tools |
| b8b572c | 77e3bca | The supplement's harness and analysis script, tested on made-up data; three corrections found by the tests |
| 8e0cb03 | 81d966e | Key-fact patterns for the new and held-out questions, with fixtures, written from the keys alone |
| 843a811 | 101f728 | The builder's brief, the PO Verifier template, three practice sets and the practice runner, fingerprinted before the first practice round |
| 0c1629d | eb47df0 | Plan, version 4, after Perplexity's outside review: icm-eager replaces folder-staged |
| f085c35 | f7f5baa | Plan, version 3, after the third design review (the skeptic); the question writer's script and raw output |
| 136edcf | c6b5928 | New questions: written, key-checked and de-duplicated |
| 0a31b11 | 0a31b11 | Plan, version 2, after the second design review (ICM fidelity) |
| dc6f91d | dc6f91d | Plan, version 1, after the first design review (method) |
| ac2e635 | ac2e635 | Plan, version 0 |
| d6ff7ec | d6ff7ec | Starting point: the entry's harness, documents, questions and folder, copied from the-control at 41b93a0 |
