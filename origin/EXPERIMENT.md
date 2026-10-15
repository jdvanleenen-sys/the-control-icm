# The experiment, on one page

Written before any document, question or folder file of this entry exists. The harness was built and rehearsed first, on other documents; `PILOTS.md` lists every rehearsal and what each one changed here.

**The question.** If an AI is handed a folder's instruction files before it starts, does it get
to its answers differently than when it has the same documents and nothing else?

**The size.** One library of about seventeen documents: two unrelated sets, as two subfolders of
`reference/`, both present in every session that has documents. A question about one set leaves
the other set as material the model has to ignore. One folder, one map covering both. Five
questions per set, three runs. 30 sessions per arm, 570 in all. The evidence is the ten
questions; the three runs show run-to-run noise. Results are reported overall and per set.

**The arms (19).** Four instruction files (`README.md`, `identity.md`, `rules.md`,
`examples.md`) can each be loaded at the start or not. All four sit on disk in the first 16
arms.

| Arm | Loaded at the start | Why it is there |
|---|---|---|
| Full package (1) | All four | The treatment |
| One file on (4) | Exactly one | What each file does alone |
| Two or three on (10) | Each mix | Completes every combination; reported, not interpreted |
| None on (1) | Nothing, files on disk, no switch file | Whether the files matter when the model must find them |
| Documents only (1) | Nothing, no folder files | The control: the same library, no folder |
| Empty (1) | Nothing, no documents | The brief's literal "no folder" |
| Wrong map (1) | All four, but the map gives each document another document's entry | A folder made wrong on purpose, to show the test can catch a folder that misleads |

**What we count.** The headline is steps per session, full package against documents only. A
step is one search, one file listing or one document open. The tool's log counts them. Printed
beside it: documents opened, searches, input tokens (which include the folder's own text),
output tokens, seconds, answer words, correct answers, unsupported statements, refused reads,
and instruction files the model opened by itself.

Steps cannot see what was loaded before the question was asked. So the headline is always
shown inside three rows: documents only; folder on disk, nothing loaded; folder loaded first.
The last two differ by one thing only, the switch file. The files loaded first are counted
beside the steps.

**Predictions.** Each file's figure is the 8 arms with it loaded against the 8 without. That is
an average across every mix of the other three files, not the effect of the file alone. Two
more readings are printed beside it: the file loaded alone against nothing loaded, and the full
package against the full package without that file.

| File | Prediction | Measure |
|---|---|---|
| `README.md` (the map: what each document covers, and nothing else) | Fewer | Steps |
| `rules.md` (how to look things up, and how to answer) | Shorter | Answer words |
| `identity.md` | No prediction | |
| `examples.md` | No prediction | |

A prediction is supported if it holds on 9 or 10 questions, shown wrong if the opposite holds
on 9 or 10, and otherwise not shown either way. Only these two predictions are tested. The
other two files are shown and not claimed. If steps fall, we predict the map is what does it;
a fall that arrives through another file would mean the model was told to read less.

**The four open problems.**

1. A switched-off file is still on disk. We analyse by what was assigned and report how often
   each was opened anyway.
2. The files differ in size. Each file's word and token count is printed beside its effect.
   Files are never ranked.
3. Files must stand alone. No file mentions another; a script checks.
4. Thinking effort is fixed at one setting for every session and recorded in the run's
   manifest.

**Where the data could be bent, and what removes it.**

| Risk | Removed by |
|---|---|
| Questions written to suit the folder | A model from another maker (ChatGPT) writes them from the documents alone, from a prompt that is committed, to a list of five question types fixed here. A model from a third maker (Gemini) answers them with no key; a disputed question is dropped, never reworded. The exam is then drawn from the pool by a seed nobody chooses. Committed before any folder file |
| Folder built to suit the questions | A separate session builds it on practice documents and never sees the exam |
| Dropping or redoing runs | One sealed run; every session kept; fault rules written first |
| An AI steering the run | A person starts it from a plain terminal |
| Choosing the analysis afterwards | The analysis script and the sentences below are committed first |
| A marker favouring an arm | Coded, shuffled answers; key revealed after results. Each marker also guesses the arm, to test whether answers give themselves away, and a few answers with a known grade are planted |
| Personal setup leaking in | Every session starts from a fixed, short list of settings; the run stops if any add-on or second model appears |
| Run order | Randomised from a recorded seed |

Not removed: an outside AI wrote the documents, but to our prompt; we asked it for a superseded version and
a changes log, which are features a map helps with; folder answers may be recognisable by their
shortness; the two marking passes are the same model, so a model from another maker also marks
the answers in the two headline arms; the headline measure was chosen after two practice trials and rehearsals on
used-up practice documents. Those rehearsals are pilots: the pre-registration lists each one,
what was looked at, and what changed in the design because of it. No rehearsal document or
question is in the exam.

**What this cannot show.**

- Anything beyond one model and made-up documents.
- Anything about other libraries. Ten questions from two document sets, written by one
  generator, speak for those ten questions.
- Which arm is more correct.
- That fewer steps is better; it only says the path changed.
- Why a file has its effect.
- Anything about staged workspaces or human review.
- The same answers on another day, for a question that leaves out a date. Every session is told
  the date it runs on and this cannot be switched off. The results page gives the run's date.
- Anything about kinds of question outside the five listed below, or about another kind of
  document. Three of the folder's four files were tuned on rehearsals that used documents of
  this kind, so new documents of the same kind test the folder on that kind only.

**The sentence we publish.** Compare the two arms question by question on average steps. A tie,
or a question with no clean session, is neither, and it stays in the ten: with two of them no
direction can be called. Each document set's own count is printed beside it. An earlier draft
also required both sets to lean the same way; with five questions in each set and 9 of 10
agreeing, that can never change the outcome, so it was removed.

How strict this is, under one assumption: that the ten questions move independently of each
other. Then, if the folder made no difference, the rule would name a direction about 2 times in
100, and if each question had an 8 in 10 chance of favouring the folder, the rule would say so
only about 4 times in 10. If the questions in a set move together the first figure is far
higher: with two sets that each move as one block it is 50 in 100. So 9 of 10 is our own
threshold, fixed in advance, and not a statistical test. The middle sentence means the rule
could not tell.

- Fewer on 9 or 10: "With the folder loaded first, the model took fewer steps on N of 10
  questions (X per session against Y)."
- More on 9 or 10: "With the folder loaded first, the model took more steps on N of 10 questions
  (X per session against Y). The folder made it work more."
- Otherwise: "Loading the folder did not clearly change how many steps the model took: fewer on
  N of 10 questions, more on M, equal on K (X per session against Y). This means the rule could
  not tell, not that there was no difference."

**Whether the folder earned its place.** One rule, fixed here before anything is run. The folder earned its place only if all three hold: steps clearly fell (the sentence above is "fewer"); neither marking pass counted fewer right answers with the folder than with the documents alone; and the text put in front of the model, loaded and fetched together, did not rise. The marker from another maker counts as a marking pass. There are three outcomes. If a condition was seen to fail (steps clearly rose, a pass counted fewer right answers, or text rose), the page says "By the rule fixed before the run, the folder did not earn its place" and names what failed. If nothing was seen to fail but steps did not clearly fall, it says "the test could not tell whether the folder earned its place". Otherwise it says the folder earned its place.

Text is counted in characters as it arrives: a loaded file once, and what a tool returns each time it returns it. A file the model opens twice is counted twice. Tokens are not used for the rule, because the whole conversation is sent again on every turn, so tokens rise with the number of turns as well as with the text. Tokens in, tokens out and seconds are printed in one line beside the verdict: "The rule counts text as it arrives: a loaded file once, and what a tool returns each time it returns it. It does not count cost. Per session, the folder arm against documents only: A against B tokens in, C against D tokens out, E against F seconds."

**Whether the test can be trusted.** Two checks on the test, not on the folder, are printed on the results page.

- Against itself. Each pair of runs of the same arm is compared under the same 9-or-10 rule, for the documents-only arm and for the full folder. Chance is the only difference between them, so the rule should name no direction. If it names one, the page says the headline could be chance. If it names none, the page says only that the result is not wildly unstable; this is not a measure of how often the rule is wrong. The count of right answers is shown run by run for the same two arms, with how far it moved between runs of one arm, so a gap between the arms can be read against it.
- Against a folder made wrong on purpose. The wrong-map arm is compared with the full folder. If it took more steps on 9 or 10 questions, the same rule as the headline, or reached fewer right answers, the page says the test caught it. If not, the page says this run did not show that the test can catch a folder that misleads. A model that reads past a bad map and still answers correctly is a finding, not a failed check.

A judge's own question is the first thing the repo invites: one command asks it in the cold arm, the documents-only arm and the full folder, and prints all three answers.

**The five question types, and the draw.** For each organisation the writer is asked for two questions of each type, 20 in all, every one a question a careful reader gets right and a hasty one gets wrong: a plain lookup in one governing document; a rule changed by the changes document; an exception or condition inside one document; an answer that needs two documents; and a trap. For the first organisation the trap is a summary or archive copy that disagrees with the governing text; for the second it is a question the documents do not answer. A model from a third maker answers all 20 with no key; a question still disputed after one round is dropped. A script then draws one question per type per organisation. Its seed is the fingerprint of the pool and of the dropped list, so nobody chooses the exam and anyone can run the draw again. The ten not drawn are the held-out questions.

**Faults and flags.** A session is left out of every average only for a fault in the set-up: a wrong model or tool version, an add-on, a second model, a rate-limit refusal, a session the tool itself reports as failed, or a missing or broken log. More than 5% of those in the two headline arms voids the run. A session in which the model itself did something unusual (a refused call, a tool error, the turn or time limit, an empty answer, an answer saying it could not open something) is kept in every average, marked like any other, and counted on the page as flagged, because the arm may be what caused it. The files staged for each arm are fingerprinted when staged and again after the last session.

**The brief's own method.** The ten questions are also asked by hand in a Claude project holding the folder, and in a plain chat with no project. That page reports right answers only and is never mixed with the figures above.

**Steps are never published alone.** Three things always follow the sentence above.

First, what steps cannot see:

- "Steps do not count what was loaded before the question. Counting text in one unit, the
  folder arm read X characters per session (L loaded first and F fetched by its tools) against
  Y for documents only. With the folder on disk and nothing loaded, the model took Z steps and
  read W characters."

A loaded file and a tool call are different kinds of thing and are never added together.

Second, because a folder could cut steps by stopping the model from reading at all, the count
of correct answers in both arms, marked with the arm hidden:

- "Marked with the arm hidden, the full folder was correct on A of N answers and the documents alone on B of
  N (the same model marking a second time: C and D)."
- "A model from another maker, also with the arm hidden, marked the same answers: E of N and F
  of N."
- If both passes count more right answers with the folder: "The folder reached more right
  answers by both passes. The rule below asks only that right answers do not fall, so this does
  not count toward it."

The page then says in plain words whether the markers could tell the arms apart from the
answers. If they could, it says the marking was not blind in effect. The guesses are scored on
the two headline arms, where half the answers had the folder loaded. Nearly always right or
nearly always wrong both count as telling. With fewer than ten guesses the page says the
guesses show nothing either way.

Third, the brief's own control, which is the cold one:

- "Asked cold, with no folder and no documents, the model took S steps per session. It was
  correct on G of N answers (marked a second time: H). The comparison above is the harder one:
  the same documents, with and without the folder's four instruction files."

And if the first sentence is "fewer steps" while both markers count fewer correct answers with
the folder than without, this sentence is added:

- "The folder reached fewer right answers. Fewer steps did not come with equal answers."
