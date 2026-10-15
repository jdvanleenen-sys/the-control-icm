# The Control, supplement: does an ICM workspace earn its place?

A follow-up to the Weekly Comp #14 entry (github.com/jdvanleenen-sys/the-control, commit 41b93a0).
That entry tested a five-file instruction folder against the same 18 documents with no
instructions. This supplement adds an ICM workspace, built by the ICM method, and tests it against
both, on the same documents, model, harness and rule.

## The result

On 18 new questions, three runs each, against the same 18 documents:

- **The ICM workspace was the most accurate arm**: right on every answer by both markers (Claude
  Opus 5.5 and Gemini 4 Flash), against 50 to 52 of 54 for the documents alone and 52 for the
  entry's folder.
- **It was also the most expensive**: 2.2 times the documents' text, 1.7 times the folder's, answers
  nearly four times as long as the folder's.
- **By the rule fixed before the run, it did not earn its place** against the documents alone (text
  rose) or against the folder (text rose, and it took more steps to find its documents). The rule
  counts lost answers, not gained ones.
- **Reading its files on demand, instead of loading them all first, saved 39% of the text and changed
  nothing else** the test could see.
- **The entry's own result came back in this batch**: the folder again took fewer steps on 10 of 10
  of the entry's questions in both sets, with more text and fewer answers holding every key fact.

Every figure, loss and check is in [`RESULTS.md`](RESULTS.md).

## Where to look

| If you want | Open |
|---|---|
| The result, with every loss and check | [`RESULTS.md`](RESULTS.md) |
| The design, fixed before the run | [`PLAN.md`](PLAN.md) |
| Every review of the design and what it changed | [`DESIGN-LOG.md`](DESIGN-LOG.md) |
| Anything done differently from the plan | [`DEVIATIONS.md`](DEVIATIONS.md) |
| The ICM under test, and the entry's folder | [`arms/icm/`](arms/icm), [`arms/folder/`](arms/folder) |
| How the ICM was built: brief, decisions, practice rounds, gate audits | [`builder/`](builder) |
| The questions: new (primary), exam and held-out | [`questions-new.md`](questions-new.md), [`questions.md`](questions.md), [`questions-heldout.md`](questions-heldout.md) |
| Where the new questions came from and how their key was checked | [`generator/new/`](generator/new) |
| The work records of the build sessions | [`transcripts/`](transcripts) |
| What was taken out before publishing, and the old-to-new commit ids | [`PUBLISHING.md`](PUBLISHING.md) |
| The entry's own design pages, unchanged | [`origin/`](origin) |

## Run the checks yourself

Node 20 or later, nothing to install.

```
node verify/sup-verdict.test.mjs      the rule, on made-up data
node verify/key-facts-sets.test.mjs   the key-fact patterns, on their fixtures
node verify/sup-icm-check.mjs         the ICM's scripted checks and its minimum text
node verify/sup-selftest.mjs          the whole pipeline on stand-in sessions
```
