# The Control, supplement: does an ICM workspace earn its place?

A follow-up to the Weekly Comp #14 entry (github.com/jdvanleenen-sys/the-control, commit 41b93a0).
That entry tested a five-file instruction folder against the same 18 documents with no
instructions. This supplement adds an ICM workspace, built by the ICM method, and tests it against
both, on the same documents, model, harness and rule.

The result is not in yet. This page will lead with it, the losses included.

## Where to look

| If you want | Open |
|---|---|
| The design, fixed before the run | [`PLAN.md`](PLAN.md) |
| Every review of the design and what it changed | [`DESIGN-LOG.md`](DESIGN-LOG.md) |
| Anything done differently from the plan | [`DEVIATIONS.md`](DEVIATIONS.md) |
| The ICM under test, and the entry's folder | [`arms/icm/`](arms/icm), [`arms/folder/`](arms/folder) |
| How the ICM was built: brief, decisions, practice rounds, gate audits | [`builder/`](builder) |
| The questions: new (primary), exam and held-out | [`questions-new.md`](questions-new.md), [`questions.md`](questions.md), [`questions-heldout.md`](questions-heldout.md) |
| Where the new questions came from and how their key was checked | [`generator/new/`](generator/new) |
| The work records of the build sessions | [`transcripts/`](transcripts) |
| The entry's own design pages, unchanged | [`origin/`](origin) |

## Run the checks yourself

Node 20 or later, nothing to install.

```
node verify/sup-verdict.test.mjs      the rule, on made-up data
node verify/key-facts-sets.test.mjs   the key-fact patterns, on their fixtures
node verify/sup-icm-check.mjs         the ICM's scripted checks and its minimum text
node verify/sup-selftest.mjs          the whole pipeline on stand-in sessions
```
