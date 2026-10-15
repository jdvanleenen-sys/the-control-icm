# Supplement to The Control: does a staged ICM workspace earn its place?

Version 1. Written on Thursday 2026-10-15, before any new question, ICM file or session exists.
This page is the plan; `DESIGN-LOG.md` records each review of it and what changed.

## Where this comes from

The entry (github.com/jdvanleenen-sys/the-control, last commit 41b93a0) tested a five-file folder
(a map, identity, rules, examples, and 18 documents in `reference/`) against the same documents
with no instructions, and against nothing. The map cut steps (2.37 against 5.03); the files that
shape the answer cost facts (every fact the key asks for in 21 of 30 answers against 30 of 30); with
nothing at all the model scored 0 of 30. The entry said nothing about staged workspaces
(`origin/EXPERIMENT.md`, "What this cannot show").

This supplement asks the question the entry left open, with the same documents, harness and rule.

## The question

On the same 18 documents, with the same model, settings and questions, does an ICM workspace (a
short router that loads first, a map, numbered stage folders each with its own `CONTEXT.md`, and the
documents in `reference/`) do better than (a) the documents alone and (b) the entry's five-file
folder? And does the ICM structure, holding the words fixed, do better than the folder?

## The arms

| Code | What the session has | Why |
|---|---|---|
| `docs` | The 18 documents, nothing else | The control that keeps the material and removes every instruction |
| `folder` | The entry's folder, unchanged, its four files loaded first (the entry's arm `c1111`) | The first system |
| `icm` | An ICM workspace built for this job to Jeff's ICM conventions | The second system |
| `icm-same` | The entry folder's own sentences, redistributed into the ICM structure | Holds the words fixed and changes only the architecture |

The entry's empty arm is not repeated: it scored 0 of 30 and feeds no comparison here.

In every arm the 18 documents are byte for byte the same files in the same place. The arms run in
one batch, interleaved in a random order from a recorded seed, so the date, the tool version and the
model are the same for all of them. A script checks that each staged arm holds exactly one
`CLAUDE.md`, at its top, because Claude Code also loads a `CLAUDE.md` it finds lower down without a
tool call, which the text count would miss.

## How the ICM is built, and by whom

- **Template:** Jeff's PO Verifier, the version prepared for eduba: a router `CLAUDE.md`, a map
  `CONTEXT.md`, numbered stage folders each with a `CONTEXT.md`, and `reference/`. Its structure
  is copied; none of its content is.
- **On practice documents, as the folder was.** The folder's identity, rules and examples were
  written on rehearsal documents (`generator/provenance.md`). The ICM is built the same way: a
  separate session builds and walk-tests it on rehearsal five's 18 documents (a boat club and a
  lending library) and their practice questions. It never sees the live documents, any live
  question, any key, the entry's folder files or any result.
- **The map is the folder's map.** The ICM's `CONTEXT.md` takes its list of documents from the same
  script that wrote the folder's map (`tools/make-map.mjs`), run on the live documents. The builder
  writes the rest of `CONTEXT.md` (what the stages are, how a question moves through them).
- **No live facts in the stages.** A script checks that no figure, date or section number from
  the live documents appears in any ICM file outside the generated document list.
- **Constraints the builder works to:** the documents are never edited or moved; a session is
  read-only (Read, Glob, Grep), so the stages are walked inside one session and their outputs are
  in the reply, not in files; only `CLAUDE.md` loads by itself.
- **Fixes before the run, from a closed list only:** a missing file, a broken path, a router or map
  that does not name a stage, a stage file that does not say where to go next. Found by a
  structural audit and a walk test on the practice documents, made by the builder session, logged
  with the diff. No other change is allowed after the freeze.
- **Disclosed:** the person running this knew the entry's result (instructions that shorten
  answers cost facts) before the ICM was built, and wrote the builder's brief. The brief is
  committed. The new questions are the guard against that knowledge reaching the test.

`icm-same` is built by a rule a script checks: every sentence of the entry's four files appears
exactly once in its files, the map lines included, and the only words added are headings and
routing lines ("Next, read `02 .../CONTEXT.md`."). The count of added routing words is published.

## The questions

| Set | Count | Written by | Role |
|---|---|---|---|
| New | up to 20 | A fresh Claude Opus 5.5 session | Primary: the verdict rests on this set |
| Exam | 10 | ChatGPT, for the entry | Secondary |
| Held-out | 10 | ChatGPT, for the entry | Secondary |

- The new questions are written from the entry's own prompt, word for word
  (`generator/question-prompt.md`), with the live documents attached and nothing else.
- A separate Claude Fable 5.1 session answers them with no key, from the entry's key-check prompt
  (`generator/key-check-prompt.md`). A question still disputed after one round is dropped, never
  reworded.
- A new question whose source sections are the same as an existing exam or held-out question's
  is dropped, because it would test a rule twice.
- The set is committed before the ICM is built. The experimenter does not read it until after the
  freeze: the key check, the disputes and the de-duplication are handled by a separate session
  that reports only which numbers were dropped and why, and the renumbering is done by script.
- Not removed: both sessions are Claude models, from the same maker as the model under test. The
  entry used ChatGPT and Gemini. This was Jeff's choice for speed and is listed as a limit.

The primary set is fixed now because the experimenter has read the exam and held-out questions
and the entry's answers to them. Those two sets are reported, and cannot decide the verdict.

## What is counted

The entry's measures, by the entry's code, with one split:

- **Document steps:** searches, file listings and opens of anything in `reference/`. The rule uses
  these.
- **Instruction steps:** opens of instruction files (an ICM stage's `CONTEXT.md`, a folder file
  opened by hand). Reported beside document steps. Their cost is not hidden: the text they return
  is in the text count.
- **Text:** characters put in front of the model: each file loaded first, once, and each tool
  return each time.
- **Right answers:** marked with the arm hidden (coded, shuffled), by `origin/MARKING.md`, in two
  passes by two models that are not the model under test: Claude Opus 5.5, then Claude Fable 5.1.
  Each marker also guesses, for every answer, whether instructions were loaded first, a staged
  workspace was used, or neither, to test whether answers give the arm away.
- **Key facts:** the entry's script count of the facts each key asks for. Patterns for the
  held-out and new questions are written from the keys alone by a session that sees no answer,
  committed before the run, and never changed.
- Printed beside them: tokens in and out, seconds, answer words, flagged sessions.

## The rule, fixed before the run

Three comparisons, on the new questions: `icm` against `docs`; `icm` against `folder`; `icm-same`
against `folder`.

The first arm earns its place against the second only if all three hold:

1. Document steps clearly fell.
2. Neither marking pass counted fewer right answers, beyond chance: fewer by more than the largest
   gap in right answers between any two runs of the same arm, across the four arms. That gap is
   measured in this run. The entry's stricter reading (any fewer at all) is printed beside it.
3. Text did not rise.

"Clearly" means at least the smallest number of questions agreeing for which a fair coin would give
that many or more, in either direction, at most 5 times in 100: 9 of 10, 15 of 20, 21 of 30, 27 of
40. A script computes it from the number of questions that survive. Questions in one document set
may move together, so this is a threshold fixed in advance, not a significance test.

Outcome sentences, as in the entry: "earned its place"; "did not earn its place", naming what
failed; or "the test could not tell". The ICM is called better than both systems only if it earns
its place against `docs` and against `folder`.

## Predictions, written before the run

1. `icm` takes clearly fewer document steps than `docs`.
2. `icm` loads less text first than `folder`, because only the router loads first. Whether its
   total text is lower: no prediction.
3. `icm` against `docs` on right answers: no prediction.
4. `icm-same` against `folder`: no prediction.

## Size

Four arms, up to 40 questions, three runs each: up to 480 sessions. The entry ran 570 in 68 minutes.

## What this cannot show

- Anything about ICM's written hand-offs between stages or its human review gates: sessions are
  read-only and run alone.
- Anything beyond one model, one tool and made-up documents of one kind.
- That this is the best possible ICM: it is one ICM, built once, by the method above.

## Order of work

1. Plan and three design reviews (this page, `DESIGN-LOG.md`).
2. New questions written, key-checked, de-duplicated and committed; key-fact patterns committed.
3. Harness changes for the new arms and the step split, with tests.
4. ICM built by the separate session on practice documents and committed; live map generated;
   `icm-same` built; both checked by script.
5. Audit and walk test on practice documents; fixes from the closed list logged and committed.
6. Freeze: fingerprints of every arm, the questions and the analysis committed.
7. One sealed run. Every session kept.
8. Marking with the arms hidden, then the key revealed.
9. Results page, written to the sentences above.

Nothing is published without Jeff's go.
