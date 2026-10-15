# Pre-registration

Committed before any session. The design is `EXPERIMENT.md`, which was this repo's first
commit: the question, the arms, what is counted, the predictions, the rules and the sentences
that may be published. This file adds the mechanics. Where the two differ, `EXPERIMENT.md`
governs.

## Data collected before this file

On these documents and questions: none. No session of the model under test has seen them.

On other material, yes. `PILOTS.md` lists every rehearsal and review, what was looked at, and
what each changed in the design. In short:

- In every complete rehearsal the folder took fewer steps on 9 or 10 of 10 questions. So we
  expect fewer steps here.
- In every rehearsal the folder put more text in front of the model than the documents alone.
  So we expect the verdict "did not earn its place", because text rose.
- In every rehearsal right answers tied at or near full marks. These questions were written to
  be harder and their key was checked by another maker's model, so we do not know whether they
  will tie.

One thing we expect and could not remove. Three of the ten expected answers ask for a figure
the question does not ask for (Q4, Q7 and Q10). The folder's rules tell the model to answer what
was asked and stop. A marker following the "Correct requires" line may grade such an answer
wrong, so the folder may lose marks on those three for being brief.

No document or question from any rehearsal is in this repo.

## Who wrote and checked what

`generator/provenance.md` and `generator/key-check.md`. ChatGPT wrote the documents and the
pool of 20 questions. Gemini answered all 20 with no key. `tools/draw.mjs` drew the exam.
Neither model was shown the folder or the design.

## What a re-run should find

Wording will differ. A re-run reproduces this one if the counting rule, applied to the
re-run's full-folder and documents-only arms, lands on the same one of the three outcomes as
this run. Both runs' counts and means are always printed side by side, because a match on one
of three sentences is coarse. Single questions move by a step or two between runs. Input
tokens are the sum of fresh, cache-written and cache-read tokens.

A re-run in a Claude project has no steps to count. It should be compared with
`claude-project.md`, which reports right answers only.

## If the analysis turns out to be wrong

A fault found after the run is fixed in the open: the fixing commit adds a note to
`DEVIATIONS.md`, the old code and tables stay in the history, and the results page prints the
note. `node verify/history.mjs` fails on a change with no note.

## What is fixed in code, and where

| What | Where |
|---|---|
| Model, effort, tools a session may use, the variables a session inherits | `lib/config.mjs` |
| The counting rule and every sentence | `lib/stats.mjs`, `verify/results.mjs` |
| What is a fault and what is a flag | `verify/scan.mjs` |
| The tables and the results page | `verify/analyse.mjs`, `verify/results.mjs` |
| The marking rules | `MARKING.md` |

None of these may change after the first log is committed, except by a recorded fix as above.

## Sessions

- One fresh session per question per arm per run: 10 questions, 19 arms, 3 runs, 570 sessions.
  Read-only tools. A fixed, short list of inherited variables, so nothing from the launching
  shell comes in.
- The order of sessions is drawn once from a recorded seed: within each run the questions in a
  shuffled order, and within each question the arms in a shuffled order. The schedule is never
  redrawn.
- Before the run, one probe session per arm confirms that the arm was given exactly the files
  its switch file names. After the last session the staged files are fingerprinted again.

## Faults and flags

A session has a **fault** if any of these is true. It is listed and left out of every mean. It
is never removed from the logs.

- Its log is missing, empty or unreadable, or has no start record or no result record.
- The tool reports the session as failed, other than by running out of turns.
- A request was refused at the usage limit.
- The model or the tool version is not the one in the manifest, or a second model also ran.
- A plugin that is not built in, a skill or an MCP server was loaded.

A session is **flagged** if the model itself did something unusual. It is kept in every mean,
marked like any other answer, and counted on the results page.

- A tool call was refused or returned an error.
- It reached the turn limit or the time limit, or stopped for a reason other than finishing.
- Its answer is empty, or says it could not open or read something.

A session that ran while the account was past a usage-warning mark ran normally. It is counted
and shown, and it is neither a fault nor a flag.

## What happens to faulty sessions

- A question with no clean session in either headline arm counts as "neither", like a tie, and
  stays in the count. So faults can only make a direction harder to call.
- A session that gives no answer (a timeout, a refused request, a crash) is tried again, up to
  three attempts. Every attempt is kept. A session that answered is never tried again.
- The run stops at once if a session reports a model or tool version other than the manifest's,
  or any add-on that is not built in.
- **Void rule.** If more than 5% of the sessions in the two arms the headline compares have a
  fault, the run is void. The results page says so above the sentence.
- A stopped or void run is kept as it is. A replacement is scheduled under a new name, after a
  dated note is added to `DEVIATIONS.md` saying why.

## Marking

- The model under test marks every answer twice, with the arm hidden. Each pass is split over
  several sessions of the same model, each in its own room that holds a sheet, the rules and
  the documents, and nothing that names an arm. That is one marker repeated.
- Gemini, a model from another maker, marks the answers from the two arms the headline
  compares, from a sheet of its own. Its count is part of the verdict rule.
- Answers appear under their own random numbers, shuffled. A few answers with a known grade are
  planted. Each marker also guesses whether instructions were loaded; guesses right about half
  the time mean the answers did not give the arm away.
- The marks are committed before the key.

## What is kept out of git until the reveal

The key, the probe's table, the list of files staged for each code, and the numbers of the
planted answers. The fingerprint of the key is committed with this file's schedule; the run's
manifest carries a fingerprint of the staged files for each code and of the probe's table.

## Held-out questions

The ten questions the draw did not pick, in `questions-heldout.md`. They are run in the three
core arms after the reveal and reported beside the headline, never merged into it.

## The Claude project run

Done by hand before the reveal: the ten questions in a project holding the folder, and in a
plain chat with no project. `claude-project.md` reports it and the results page includes it
word for word. The person who marks it can see which answer is which.

## If the folder is changed after the results

One labelled change is allowed. It gets its own re-run of the three core arms. The first
transcripts are kept and the two are reported side by side.

## Deviations

Anything done differently from this file or from `EXPERIMENT.md` is written in `DEVIATIONS.md`,
with the date and the reason, before it is done where that is possible.

## Not in this entry

A re-run by a second person on another machine was planned and has not been done. The run was
made on one machine, by the person who built it.
