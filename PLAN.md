# Supplement to The Control: does a staged ICM workspace earn its place?

Version 0. Written on Thursday 2026-10-15, before any new question, ICM file or session exists.
This page is the plan; `DESIGN-LOG.md` records each review of it and what changed.

## Where this comes from

The entry (github.com/jdvanleenen-sys/the-control, last commit 41b93a0) tested a five-file folder
(a map, identity, rules, examples, and 18 documents in `reference/`) against the same documents
with no instructions, and against nothing. It found the map cut steps (2.37 against 5.03) and the
files that shape the answer cost facts (every fact the key asks for in 21 of 30 answers against 30
of 30). It said nothing about staged workspaces: `limits.md` lists that as outside the test.

This supplement asks the question the entry left open, with the same documents, the same
harness and the same rule.

## The question

On the same 18 documents, with the same model, settings and questions, does an ICM workspace (a
short router that loads first, a map, numbered stage folders each with its own `CONTEXT.md`, and the
documents in `reference/`) do better than (a) the documents alone and (b) the entry's five-file
folder?

## The arms

| Code | What the session has | Why |
|---|---|---|
| `empty` | Nothing | Floor; the brief's literal "no folder" |
| `docs` | The 18 documents, nothing else | The control that keeps the material and removes every instruction |
| `folder` | The entry's folder, unchanged, loaded first (the entry's arm `c1111`) | The first system |
| `icm` | An ICM workspace built for this job to Jeff's ICM conventions | The second system: the one under test |
| `icm-same` | The entry folder's own sentences, redistributed into the ICM structure, no sentence added or removed | Holds the words fixed and changes only the architecture, so a difference between `folder` and `icm-same` is the structure's alone |

In every arm the documents are byte for byte the same files in the same place (`reference/film`,
`reference/hall`). The only things that differ are the instruction files on disk and what loads
first. The arms run in one batch, interleaved in a random order from a recorded seed, so the date,
the tool version and the model are the same for all of them.

## How the ICM is built, and by whom

- **Template:** Jeff's PO Verifier, the version prepared for eduba (a router `CLAUDE.md`, a map
  `CONTEXT.md`, numbered stage folders each with a `CONTEXT.md`, `reference/`). Its structure is
  copied; none of its content is.
- **Builder:** a separate session that sees only the 18 documents, the template, the ICM
  conventions (the `icm-architect` skill) and the job: answer rule questions from members, volunteers
  and front-desk staff about these two organisations. It does not see `questions.md`,
  `questions-heldout.md`, the new questions, any key, the entry's folder files or any result.
- **Constraints the builder works to:** the documents stay where they are and are never edited; a
  session is read-only (Read, Glob, Grep) and cannot write a stage's output to a file, so stages are
  walked in one session; only `CLAUDE.md` loads by itself.
- **Checks before the run:** a structural audit against the ICM conventions and a walk test on
  practice questions the builder writes. Fixes found by those checks may be made before the run if
  they are structural, and every one is logged. No fix may be made because of any test question or
  answer. The run then uses the ICM exactly as committed.
- **Disclosed:** the person running this knew the entry's result (instructions that shorten
  answers cost facts) before the ICM was built. The new questions are the guard against that
  knowledge shaping the ICM.

`icm-same` is built by a script-checkable rule: every sentence of the entry's four files appears
exactly once in the ICM files, and the only words added are headings and routing lines. A script
checks the sentence sets match.

## The questions

| Set | Count | Who wrote them | Seen before the ICM was built |
|---|---|---|---|
| Exam | 10 | ChatGPT, for the entry | By the experimenter, not the builder |
| Held-out | 10 | ChatGPT, for the entry | By the experimenter, not the builder |
| New | up to 20 | A fresh session given only the documents and the entry's own question prompt (`generator/question-prompt.md`), word for word | By nobody until committed; the builder never |

The new questions are key-checked the way the entry's were: a separate session answers them with no
key, and a question still disputed after one round is dropped, never reworded. The new set is
committed before the ICM is built.

## What is counted

Exactly the entry's measures, by the entry's code:

- **Steps:** searches, file listings and document opens, from the tool's log.
- **Text:** characters put in front of the model, a loaded file once and each tool return each time.
- **Right answers:** marked with the arm hidden (coded, shuffled), two passes, by the rules in
  `origin/MARKING.md`.
- **Key facts:** the entry's script count of the facts each key asks for. Patterns for the held-out
  and new questions are written from the keys alone and committed before the run, and never changed.
- Printed beside them: tokens in and out, seconds, answer words, flagged sessions.

## The rule, fixed before the run

The entry's rule, applied twice: `icm` against `docs`, and `icm` against `folder`.

The ICM earns its place against an arm only if all three hold: steps clearly fell; neither marking
pass counted fewer right answers with the ICM; and text did not rise. "Clearly" is the entry's
threshold scaled to the number of questions: the smallest count of questions agreeing for which a
fair coin would give that many or more, in either direction, at most 5 times in 100 (9 of 10, 21 of
30, 27 of 40). It is computed by a script from the number of questions that survive.

The same three outcome sentences as the entry: earned its place, did not (naming what failed), or
the test could not tell. "Better than both systems" is said only if it earns its place against both.

## Predictions, written before the run

1. `icm` takes clearly fewer steps than `docs`.
2. `icm` puts less text in front of the model than `folder`, because only the router loads first.
3. `icm` against `docs` on right answers: no prediction.
4. `icm-same` against `folder`: no prediction.

## Size

Five arms, up to 40 questions, three runs each: up to 600 sessions. The entry ran 570 in 68 minutes.

## What this cannot show

- Anything about ICM's written hand-offs between stages or its human review gates: sessions are
  read-only and run alone.
- Anything beyond one model, one tool and made-up documents of one kind.
- That the ICM is the best possible ICM: it is one ICM, built once, by the method above.

## Order of work

1. Plan and three design reviews (this page, `DESIGN-LOG.md`).
2. New questions written, key-checked and committed; key-fact patterns committed.
3. Harness changes for the new arms, with tests.
4. ICM built by the separate session and committed; `icm-same` built and checked.
5. Audit and walk test; structural fixes logged and committed.
6. Freeze: fingerprints of every arm, the questions and the analysis committed.
7. One sealed run. Every session kept.
8. Marking with the arms hidden, then the key revealed.
9. Results page, written to the sentences above.

Nothing is published without Jeff's go.
