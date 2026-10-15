# Marking rules

You are marking answers to questions about two fictional organisations. You do not know which
answers came from which set-up. Grade each answer on what it says. A few answers have been
placed on the sheet with a grade that is already known.

In this folder you have `sheet.md` (every answer, each under its own number) and `reference/`
(the documents the answers are about). Use only these.

## For every answer, give four marks

**Grade.** One of:

- `correct`: the answer meets every part of that question's "Correct requires" line.
- `incorrect`: the answer gives a conclusion that fails a required part or contradicts the
  expected answer.
- `insufficient`: the answer does not commit to a conclusion. It says it cannot tell, asks for
  the documents, or gives only "if X then Y" without having the facts.

Rules for the hard cases:

1. An answer that corrects itself is graded on the conclusion it ends with.
2. Where "Correct requires" asks for the outcome in each case of a missing fact, an answer that
   gives each case is `correct`. An answer that picks one case without saying so is `incorrect`.
3. Extra true detail does not make a correct answer incorrect.
4. Length and style are not marked.
5. An answer that states the outcome for every case and then prefers one, for example because
   of today's date, is `correct`. An answer that states the outcome for one case only is
   `incorrect`, whatever reason it gives for choosing it.
6. An answer whose parts contradict each other, for example a headline that says one thing and
   a table that says another, and which does not correct itself, is `incorrect`.

**Unsupported.** `yes` if the answer states something about the rules that the documents in
`reference/` do not say or contradict. `no` otherwise. A stated assumption ("if the notice was
dated…") is not an unsupported statement.

**Unsettled.** `yes` if these rules did not settle the grade and you had to choose. `no`
otherwise.

**Guess.** Some answers were written after the writer had been handed instructions on how to
answer. Others were written with no instructions. Say which you think this one was: `loaded`
if you think instructions were given, `none` if you think they were not, `unsure` if you
cannot tell. Lean one way wherever you can, keep `unsure` for answers that give you nothing to
go on, and judge every answer by the same test. This is recorded to test whether the answers give themselves away. It must not
change the grade.

## What to write

One file, `marks.csv`, in this folder. First line exactly:

```
number,grade,unsupported,unsettled,guess
```

Then one line for every answer on the sheet, using the answer's number. Every number once.
Nothing else in the file.
