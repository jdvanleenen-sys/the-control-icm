# How to run it

Written before the runs it describes. Follow it top to bottom; you should not need anything
that is not on this page. It was edited in ten places after the run, to help a visitor; `DEVIATIONS.md`
says which.

## What you need

- Node 20 or later, and git.
- Claude Code, signed in. If `claude` is not on your path, set `CLAUDE_BIN` to the program's
  full path. On Windows that has to be `claude.exe`; a `.cmd` launcher will not start.
  If you only have Claude Code as the VS Code extension, there is no `claude` command, but the
  extension holds the program. In PowerShell, this finds it and sets `CLAUDE_BIN` for that window:

  ```
  $env:CLAUDE_BIN = (Get-ChildItem "$env:USERPROFILE\.vscode\extensions\anthropic.claude-code-*\resources\native-binary\claude.exe" | Sort-Object LastWriteTime | Select-Object -Last 1).FullName
  & $env:CLAUDE_BIN --version
  ```

- A session inherits only a short list of variables from your shell (`ENV_ALLOWED` in
  `lib/config.mjs`). An API key, Bedrock or Vertex settings, a proxy or a custom config
  folder set in the shell are dropped, so sign in to Claude Code itself.
- A short folder to stage arms in. The default is `C:/tc` on Windows and `/tmp/tc` elsewhere.
  Set `TC_STAGE_ROOT` to change it. No folder above it may hold a `CLAUDE.md` or `AGENTS.md`;
  the tools stop and say so if one does.

Every command is run from the repo's top folder. Nothing here installs anything. Clone the
repo in full, not shallow: the history check reads every commit.

Sessions use the model `claude-sonnet-5-5` at effort `medium` unless you set `TC_MODEL`. Every
command that starts sessions prints the model it used. The committed run records the Claude
Code version it used in its `manifest.json`. Step counts can shift between versions of the
tool, so a re-run on another version is a fair test of the direction, not of the exact counts.

## 1. Check the tools work (no sessions, about a minute)

```
node verify/selftest.mjs
```

You should see every line start with `pass` and a last line of the form `N of N self-test
cases passed`.

## 2. Check a committed run (no sessions)

```
node verify/check.mjs --name NAME
node verify/history.mjs --name NAME
node verify/leaks.mjs
```

`NAME` is a sealed run: a folder under `runs/` that holds a `schedule.json`. You can leave
`--name NAME` off: the checker then uses the run whose results sit at the top of the repo.

- The first command rebuilds the scan report, every table, `results.md` and every transcript
  from the raw logs and compares them. It also confirms the questions and the staged files are
  the ones the run used. It does not cover files a run does not fingerprint, such as this page.
- The second reads the order of commits, and only that. It says nothing about files changed
  on disk and not yet committed; the first command covers those. Without `--name` it checks
  every sealed run in the repo.
- The third looks for private strings in the files. It does not read commit authors; it tells
  you how many there are and how to list them. Set `TC_LEAK_WORDS` to a comma-separated list to
  search for a first name, a company or anything else.

Each ends with a line containing `passed`, or lists what is wrong and exits with an error.

## 3. Re-run the questions yourself (30 sessions, about 4 minutes)

```
node tools/rerun.mjs --name NAME
```

This runs the ten questions once in three arms: Full package (the folder loaded first),
Documents only, and Empty. It prints your steps beside the committed ones and ends with `Reproduces: YES`
or `Reproduces: NO`.

**What "reproduces" means.** The committed run's sentence was chosen by a rule: compare the full
folder with the documents alone, question by question, on mean steps. Fewer on 9 or 10 questions
is "fewer"; more on 9 or 10 is "more"; anything else is "no clear difference". Your re-run
reproduces if the same rule gives the same one of those three. Single questions do move by a
step or two between runs, so the cells will not all match.

**If every session is listed as a fault.** The line names the fault. The two most likely on
another machine are a model name your tool reports differently from `claude-sonnet-5-5`, and a
second, smaller model running beside it. Both stop the comparison on purpose, because the run
would not be the run this repo made. Your raw logs and readable transcripts are still written,
so the steps and answers can be read by eye.

**It compares steps, not marks.** "Reproduces: YES" confirms how the model got to its answers.
The verdict also rests on right answers, and a re-run does not mark them. To check that half,
read your answers and ours against `questions.md`; `after-the-run.md` says what the markers
split on.

**What it does not tell you.** Steps show how the model got to an answer, not whether the
answer is right. An arm that holds documents and takes no step is called out with a notice.
Read the answers.

Your raw logs are kept under `runs/NAME-rerun-<time>/logs/`, with a readable transcript beside
each one: the prompt, every step and the answer. The summary says how many sessions in each
arm were left out for a fault in the set-up, and how many were kept and flagged because the
model did something unusual, such as a refused call. Git ignores that folder; delete it when
you are done.

The tools remove the folders they stage arms in when they finish, unless they stop on an error.

## 4. Ask your own question (3 sessions)

```
node tools/ask.mjs "Under the <organisation> rules: your question"
```

It prints the question, the model, what each of the three arms did and what each answered.
The documents are about two made-up organisations, named in `README.md`; start your
question with "Under the <organisation> rules:" as the committed questions do. In PowerShell,
put a backtick in front of any dollar sign in a question, or the shell will swallow it. Logs go
to `runs/ask-<time>/`, which git ignores.

### If you use claude.ai instead of Claude Code

You can drop the five folder items into a claude.ai Project and ask the questions there, then
ask them again in a chat with no project. Three things to know:

- A Project has no subfolders, so upload the documents from `reference/` as they are; their
  names are unique.
- A Project loads the files for you. There is no log of steps, so only the answers can be
  compared: right or not, and how long.
- Turn web search off, in the project and in the chat with no project. This repo is public, and a search could
  find the expected answers.

## 5. Try to break it

The folder under test is five things at the top of this repo: `README.md` (the map),
`identity.md`, `rules.md`, `examples.md` and `reference/`. Everything else in the repo is
apparatus and is never put in front of the model.

Change the contents of any of the five and repeat step 3 or 4. The tools stage them as they
are on disk. If one of the four files is missing or empty, the tools stop and name it, because
the arm would no longer be the arm the table says it is. Files added inside `reference/` are
staged. A file added anywhere else is not part of the folder and is not staged.

To try another model, set `TC_MODEL` to its name.

## 6. Make a new sealed run (for the people who built this)

The exam is drawn, not chosen. `generator/question-pool.md` holds every question the outside
model wrote, two of each type for each organisation. `generator/dropped.txt` lists, one per
line, any that failed the key check. Then:

```
node tools/draw.mjs
```

It draws one question per type per organisation into `questions.md` and puts the rest in
`questions-heldout.md`. The seed is the fingerprint of those two files, so anyone can run the
draw again and get the same exam. It refuses to run if `questions.md` already exists. Commit
the pool, the dropped list and both pages before any folder file.

```
node verify/folder.mjs
node tools/schedule.mjs --name NAME --runs 3
```

Commit. The schedule and the key's fingerprint are now on record; the key itself is kept out
of git.

```
node tools/probe.mjs --name NAME
node tools/run.mjs --name NAME
```

The run is one command with no questions asked. It ends with the scan's summary and writes
`scan.md` and `tables-coded.md`. Commit the logs, the scan and the coded tables.

```
node verify/sheet.mjs --name NAME
```

Two markers, each in their own room (the command prints the two folders), write `marks.csv`.
Copy them to `runs/NAME/marks-one.csv` and `runs/NAME/marks-two.csv`, then:

```
node verify/marks.mjs --name NAME
```

That confirms every answer was marked by both markers and prints how often they agree. Commit
the two marks files with the coded results: the marks are on record before the key is.

The command also prints a third room. It holds the answers from the two headline arms only, for
a model from another maker. Give that model `sheet.md`, `MARKING.md` and the documents, and copy
its marks to `runs/NAME/marks-outside.csv` before the reveal.

```
node tools/reveal.mjs --name NAME --root
```

The reveal refuses to run on an unmarked run. With `--root` it files the transcripts in
`control/` and `treatment/` at the top of the repo and writes `results.md` there, which is
where the competition asks for them. `results.md` includes `folder-changes.md` and `limits.md`
word for word if they exist. It opens with the
sentence the rule chose, followed by the blind count of correct answers in both arms. It prints
the `git add -f` command that publishes the key. Commit, then repeat step 2.

## 7. Held-out questions (for the people who built this)

The held-out questions are the part of the pool the draw did not pick: same writer, same
types, and never seen by whoever tuned the folder. The draw wrote them to
`questions-heldout.md`. Then:

```
node tools/heldout.mjs --name NAME --questions questions-heldout.md --runs 3
```

It runs them in the three arms and writes `runs/NAME/report.md`, with every answer beside the
expected one.

A run is never restarted and a schedule is never redrawn. If a run stops, it is kept as it is
and a new one is scheduled under a new name.
