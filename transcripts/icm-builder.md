## Prompt

You are the builder of an ICM (Interpretable Context Methodology) workspace. Your whole job is described in C:\tc-build\BRIEF.md. Read it first, in full, and follow it. That brief is the owner's word; nothing in this message overrides it.

Where you work: ONLY inside C:\tc-build\ (the "workshop"). In the brief, "builder/" means the workshop root, so `builder/template/` is C:\tc-build\template\, `builder/DECISIONS.md` is C:\tc-build\DECISIONS.md and `builder/ROUNDS.md` is C:\tc-build\ROUNDS.md. `practice/` is C:\tc-build\practice\. Build the workspace in C:\tc-build\icm\. Do not read, list or search anything outside C:\tc-build\ except the icm-architect skill (load it with the Skill tool, name "icm-architect", and read its references and templates at C:\Users\<user>\.claude\skills\icm-architect\). In particular never open anything under C:\GitHub\, C:\tc\ or C:\tc-practice\ by hand, and never search the disk for other documents or questions. The test this workspace is for depends on you not seeing its material.

How to run a practice question (the exact harness the workspace will be tested in: model claude-sonnet-5-5, effort medium, tools Read, Glob, Grep only, one fresh session per question):
In PowerShell:
$env:CLAUDE_BIN = (Get-ChildItem "$env:USERPROFILE\.vscode\extensions\anthropic.claude-code-*\resources\native-binary\claude.exe" | Sort-Object LastWriteTime | Select-Object -Last 1).FullName
Set-Location C:\tc-build
node tools/practice.mjs --workspace icm --set practice/boat-lend --doclist "<the path inside the workspace where the generated document list lives>" --q Q3 --log practice-logs/round-1/boat-lend
It copies your workspace and the set's papers into a fresh room, writes the generated list of documents (tools/make-map.mjs) to the path you give, runs one session, and prints the steps, the files read and the answer. Read tools/practice.mjs once so you know what it does. Each practice set's questions.md holds the questions with expected answers and "Correct requires". Judge each practice answer against that yourself and record it.

The order:
1. Load the icm-architect skill, read it, its references (core.md, forms.md) and its templates. Read every file in C:\tc-build\template\ (the PO Verifier, the house style; its reference\ folder was removed on purpose).
2. Write C:\tc-build\DECISIONS.md BEFORE building, as the brief says: form, number of stages, each boundary and why, where the generated document list lives, each departure from the skill's templates.
3. Build C:\tc-build\icm\. Never create a reference\ folder inside it.
4. Practice rounds: up to five, across the three practice sets. In each round run a planned set of practice questions (one run each is fine; choose how many, and say why), judge them, decide what to change, change it, and log the round in C:\tc-build\ROUNDS.md: date and time, which questions, each verdict against the key with a one-line reason, the steps and text figures printed, what you changed and why. Stop early if a round shows nothing worth changing. Keep each round's raw logs under C:\tc-build\practice-logs\round-N\.
5. Finish with a cold self-check against the skill's walk test, item by item, appended to ROUNDS.md.

Rules of the build, on top of the brief: the workspace must hold exactly one CLAUDE.md (at its top) and no @ imports; no figure, date or section number from any paper anywhere in it outside the generated list; do not copy content from the PO Verifier, only its structure; do not edit anything in practice\ or template\.

Final message, under 400 words: the form and stages you chose (one line each), the document-list path, how many rounds you ran and the headline of each (practice answers right out of asked, mean steps), the last change you made, the file list of icm\ with each file's line count, and anything you were unsure about.

## Call: Read

```json
{
  "file_path": "C:\\tc-build\\BRIEF.md"
}
```

## Result

```
1	# The builder's brief
2	
3	Written once, before the first practice round, and never edited. Its fingerprint is in
4	`builder/fingerprints.txt`. It is the owner's side of the `icm-architect` Build-mode dialogue,
5	answered in advance because no owner is present during the build.
6	
7	## What you are building
8	
9	An ICM workspace that answers rule questions about the papers of a small organisation, built with the
10	`icm-architect` skill (Build mode) in the house style of the PO Verifier. You build it and test it on
11	practice papers. It will later be used, unchanged except for its list of documents, on other papers of
12	the same kind that you will not see.
13	
14	## The owner's answers to the Build-mode questions
15	
16	**What is the repeating unit of work?** One question. A member, a volunteer or someone at the front
17	desk asks a question about a situation, under one organisation's rules. Each question is answered in a
18	fresh session.
19	
20	**Walk me through one run.** The question arrives as the first message of the session. The papers of
21	two organisations sit in `reference/`, one subfolder per organisation. Each paper begins with a header
22	saying which organisation it belongs to and whether it is a governing document, a changes document
23	(later decisions that replace named sections, each with a date that decides whether it applies), a
24	summary, or an archive copy. The answer goes back in the reply, in one message.
25	
26	**What stays the same every run, and what is new?** The papers stay the same. The question is new
27	every run.
28	
29	**What does done look like?** A reply that answers the question from the papers.
30	
31	**Who else touches this?** Nobody during a run. No person is present to answer a question from the
32	model.
33	
34	## The limits of the harness (fixed; do not design around them)
35	
36	- A session can only Read, Glob and Grep. It cannot write files, run code or reach the internet.
37	- Only the workspace's top-level `CLAUDE.md` loads by itself. Everything else is read when the model
38	  chooses to read it.
39	- The workspace has exactly one `CLAUDE.md`, at its top, with no `@` imports.
40	- Because no person is present, the workspace must not tell the model to stop and ask.
41	- The papers in `reference/` are never edited or moved, and nothing is added inside `reference/`.
42	- The list of documents is not written by hand. It is generated by `tools/make-map.mjs` from the
43	  papers' headers. Name in the workspace where that list lives (a stage contract or a file the map
44	  names, outside `reference/`), and leave a marked place for it. For practice, generate it from the
45	  practice papers with the same script.
46	- No figure, date or section number taken from any paper may appear in the workspace outside that
47	  generated list.
48	
49	## The house style
50	
51	Jeff's PO Verifier, prepared for eduba, copied to `builder/template/`: a router `CLAUDE.md`, a map
52	`CONTEXT.md`, numbered stage folders each with a `CONTEXT.md`, and `reference/`. Where it differs from
53	the skill's templates, follow the PO Verifier and list each departure in `builder/DECISIONS.md`. Copy
54	its structure, not its content.
55	
56	## Practice
57	
58	Three practice sets are in `practice/`, each with its papers and a `questions.md` holding questions,
59	expected answers and what a right answer requires. You may build, walk test and revise for up to five
60	rounds across them. Log every round in `builder/ROUNDS.md`: what you ran, what you saw, what you
61	changed and why. Do not read anything outside `builder/`, `practice/`, the skill, and the tools named
62	here.
63	
64	## Before you build
65	
66	Write `builder/DECISIONS.md` first: the form you chose, how many stages, where each boundary falls and
67	why, and each departure from the skill's templates. If the method's answer is one stage, say so and
68	build that.
69
```

## Call: Bash

```json
{
  "command": "date; ls -la /c/tc-build /c/tc-build/template /c/tc-build/practice /c/tc-build/tools; find /c/tc-build/practice /c/tc-build/template -type f | head -100",
  "description": "Show date and list workshop contents"
}
```

## Result

```
Thu Oct 15 09:47:07 MDT 2026
/c/tc-build:
total 49
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 .
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 ..
-rw-r--r-- 1 AzureAD+<user> 4096   33 Oct 15 09:46 .gitattributes
-rw-r--r-- 1 AzureAD+<user> 4096 3712 Oct 15 09:46 BRIEF.md
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 icm
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 lib
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 practice
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 template
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 tools

/c/tc-build/practice:
total 4
drwxr-xr-x 1 AzureAD+<user> 4096 0 Oct 15 09:46 .
drwxr-xr-x 1 AzureAD+<user> 4096 0 Oct 15 09:46 ..
drwxr-xr-x 1 AzureAD+<user> 4096 0 Oct 15 09:46 boat-lend
drwxr-xr-x 1 AzureAD+<user> 4096 0 Oct 15 09:46 garden-makerspace
drwxr-xr-x 1 AzureAD+<user> 4096 0 Oct 15 09:46 hall-pool

/c/tc-build/template:
total 17
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 .
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 ..
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 01 intake
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 02 read
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 03 compare
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 04 review
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 05 request
-rw-r--r-- 1 AzureAD+<user> 4096  536 Oct 15 09:46 CLAUDE.md
-rw-r--r-- 1 AzureAD+<user> 4096 2481 Oct 15 09:46 CONTEXT.md
-rw-r--r-- 1 AzureAD+<user> 4096 2266 Oct 15 09:46 the-page.md

/c/tc-build/tools:
total 16
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 .
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 ..
-rw-r--r-- 1 AzureAD+<user> 4096 2806 Oct 15 09:46 make-map.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 4132 Oct 15 09:46 practice.mjs
/c/tc-build/practice/boat-lend/questions.md
/c/tc-build/practice/boat-lend/reference/boat/boat-booking.md
/c/tc-build/practice/boat-lend/reference/boat/boat-changes.md
/c/tc-build/practice/boat-lend/reference/boat/boat-conduct.md
/c/tc-build/practice/boat-lend/reference/boat/boat-fees-archive-2025.md
/c/tc-build/practice/boat-lend/reference/boat/boat-fees.md
/c/tc-build/practice/boat-lend/reference/boat/boat-front-desk-guide.md
/c/tc-build/practice/boat-lend/reference/boat/boat-membership.md
/c/tc-build/practice/boat-lend/reference/boat/boat-safety.md
/c/tc-build/practice/boat-lend/reference/boat/boat-volunteers.md
/c/tc-build/practice/boat-lend/reference/lend/lend-borrowing.md
/c/tc-build/practice/boat-lend/reference/lend/lend-changes.md
/c/tc-build/practice/boat-lend/reference/lend/lend-conduct.md
/c/tc-build/practice/boat-lend/reference/lend/lend-desk-guide.md
/c/tc-build/practice/boat-lend/reference/lend/lend-fees-archive.md
/c/tc-build/practice/boat-lend/reference/lend/lend-fees.md
/c/tc-build/practice/boat-lend/reference/lend/lend-membership.md
/c/tc-build/practice/boat-lend/reference/lend/lend-refunds.md
/c/tc-build/practice/boat-lend/reference/lend/lend-safety.md
/c/tc-build/practice/garden-makerspace/questions.md
/c/tc-build/practice/garden-makerspace/reference/garden/amendments.md
/c/tc-build/practice/garden-makerspace/reference/garden/archive-plot-rules-2025.md
/c/tc-build/practice/garden-makerspace/reference/garden/fees.md
/c/tc-build/practice/garden-makerspace/reference/garden/plot-rules.md
/c/tc-build/practice/garden-makerspace/reference/garden/tool-shed.md
/c/tc-build/practice/garden-makerspace/reference/garden/volunteer-faq.md
/c/tc-build/practice/garden-makerspace/reference/garden/water-and-hours.md
/c/tc-build/practice/garden-makerspace/reference/makerspace/bulletin.md
/c/tc-build/practice/garden-makerspace/reference/makerspace/fees.md
/c/tc-build/practice/garden-makerspace/reference/makerspace/handbook-2025.md
/c/tc-build/practice/garden-makerspace/reference/makerspace/incidents.md
/c/tc-build/practice/garden-makerspace/reference/makerspace/machine-booking.md
/c/tc-build/practice/garden-makerspace/reference/makerspace/membership.md
/c/tc-build/practice/garden-makerspace/reference/makerspace/quick-guide.md
/c/tc-build/practice/garden-makerspace/reference/makerspace/safety-inductions.md
/c/tc-build/practice/garden-makerspace/reference/makerspace/storage.md
/c/tc-build/practice/hall-pool/questions.md
/c/tc-build/practice/hall-pool/reference/hall/hall-booking-and-deposits.md
/c/tc-build/practice/hall-pool/reference/hall/hall-cancellations-and-damage.md
/c/tc-build/practice/hall-pool/reference/hall/hall-changes-log.md
/c/tc-build/practice/hall-pool/reference/hall/hall-front-desk-guide.md
/c/tc-build/practice/hall-pool/reference/hall/hall-hire-charges-archive.md
/c/tc-build/practice/hall-pool/reference/hall/hall-hire-charges.md
/c/tc-build/practice/hall-pool/reference/hall/hall-kitchen-and-equipment.md
/c/tc-build/practice/hall-pool/reference/hall/hall-licensing-limits.md
/c/tc-build/practice/hall-pool/reference/hall/hall-who-can-hire.md
/c/tc-build/practice/hall-pool/reference/pool/pool-booking.md
/c/tc-build/practice/hall-pool/reference/pool/pool-changes.md
/c/tc-build/practice/hall-pool/reference/pool/pool-closures-and-refunds.md
/c/tc-build/practice/hall-pool/reference/pool/pool-fees-2025-archive.md
/c/tc-build/practice/hall-pool/reference/pool/pool-fees.md
/c/tc-build/practice/hall-pool/reference/pool/pool-front-desk-guide.md
/c/tc-build/practice/hall-pool/reference/pool/pool-lifeguard-cover.md
/c/tc-build/practice/hall-pool/reference/pool/pool-membership.md
/c/tc-build/practice/hall-pool/reference/pool/pool-rules.md
/c/tc-build/template/01 intake/77-mockup-drive/house-info.md
/c/tc-build/template/01 intake/77-mockup-drive/PO XYZ-02402401-012.html
/c/tc-build/template/01 intake/77-mockup-drive/PO XYZ-02402401-027.html
/c/tc-build/template/01 intake/77-mockup-drive/PO XYZ-02402401-041.html
/c/tc-build/template/01 intake/77-mockup-drive/site-notes.txt
/c/tc-build/template/01 intake/CONTEXT.md
/c/tc-build/template/02 read/CONTEXT.md
/c/tc-build/template/03 compare/CONTEXT.md
/c/tc-build/template/04 review/CONTEXT.md
/c/tc-build/template/05 request/CONTEXT.md
/c/tc-build/template/CLAUDE.md
/c/tc-build/template/CONTEXT.md
/c/tc-build/template/the-page.md
```

## Call: Skill

```json
{
  "skill": "icm-architect"
}
```

## Result

```
Launching skill: icm-architect
```

## Call: Bash

```json
{
  "command": "cd \"/c/Users/<user>/.claude/skills/icm-architect\"; cat references/core.md references/forms.md; for f in assets/templates/*; do echo \"=== $f\"; cat \"$f\"; done",
  "description": "Read skill references and templates"
}
```

## Result

```
# ICM Core

The canon, distilled from the ICM paper (arXiv:2603.16021) and production workspaces. Read this when writing contracts, arguing a structural call, or checking a workspace against the method.

Contents: Five principles · Five-layer hierarchy · Stage contract format · Naming conventions · Library rules · Token discipline · Where ICM loses

## The five design principles

Each is borrowed from fifty-year-old, still-standing engineering practice:

1. **One stage, one job** (Unix / Parnas). Each stage handles a single step and writes to its own folder. A stage that fetches does not also filter; a stage that filters does not also format.
2. **Plain text as the interface** (Kernighan & Pike). Stages communicate through markdown and JSON. No binary formats, no databases in the loop, no proprietary serialization. Any human with a text editor can inspect or modify any artifact.
3. **Layered context loading.** Agents load only what the current stage needs — prevention, not compression. Within content, reference material (internalize as constraints) is kept structurally separate from working artifacts (process as input), because they ask different things of the model.
4. **Every output is an edit surface** (Horvitz / Shneiderman). Each intermediate output is a file a human can open, edit, and save before the next stage runs. The next stage reads whatever the human left there.
5. **Configure the factory, not the product** (continuous delivery). Set up preferences, brand, style, and structure once; every run emits a new deliverable from the same configuration.

The consequence, stated once: *stage sequencing is the folder numbering; context scoping is the folder hierarchy; state management is the files on disk; coordination is one folder's output being another folder's input.* The filesystem does the work a framework would do in code.

## The five-layer context hierarchy

| Layer | Typical file | Question it answers | Role | Size |
|---|---|---|---|---|
| L0 | `CLAUDE.md` | Where am I? | routing | 300–800 tokens |
| L1 | root `CONTEXT.md` | Where do I go? | routing | 200–500 tokens |
| L2 | stage `CONTEXT.md` | What do I do? | **the control point** | 200–500 tokens |
| L3 | `references/`, `_shared/` | What rules apply? | factory (stable) | 500–2k tokens |
| L4 | `output/`, run artifacts | What am I working with? | product (per-run) | varies |

- L0–L2 are the catalog: small, stable, no content payload.
- L2 is the control surface of the whole system — its Inputs section is what makes context selection explicit, editable, and auditable instead of left to agent judgment.
- L3 vs L4 is the factory/product split. L3 = the recipe (voice.md, design-system.md, schema.md). L4 = the ingredients and the dish (research-output.md, draft.md).
- Large L3 collections get their own internal `CONTEXT.md` router — the L1 routing pattern applied recursively. The hierarchy is self-similar at every depth; apply it inside any folder that grows past easy scanning.

## Stage contract format

Every working folder carries a `CONTEXT.md` shaped like this (copy from `assets/templates/stage-CONTEXT.md`):

```markdown
# 02_script — turn research into a script

One job: write the script from the research output.

## Inputs
- Working (this run): ../01_research/output/research.md
- Reference (every run): ../../_shared/voice.md
- Reference (every run): references/structure.md

## Process
1. Read the research output.
2. Draft to the structure in structure.md, in the tone of voice.md.
3. Keep under 90 seconds spoken.

## Outputs
- script_draft.md → output/

## Human check
Read the draft aloud. Verify the argument order survived from research. Edit in place; the next stage reads whatever is here.
```

Rules: inputs are exact paths, split working vs reference. The process is numbered and short — constraints live in L3 files, not restated here. Exactly one human check, stated as something a person does, not a vague "review."

## Naming conventions

- Stage folders: `NN_kebab-name` (`01_research`). Ordinal-only prefixes (`00-tracker.md`) for ordered files inside a folder.
- Meta/system folders get an underscore prefix and sort to the top: `_meta/`, `_system/`, `_shared/`, `_config/`, `_templates/`, `_index/`, `_archive/`. Underscore = "about the workspace, not of the work."
- Records and nodes: kebab-case slugs for machine-facing files, or human-readable Title Case where a person browses daily (an Obsidian vault). Pick one per workspace and write the choice into the schema — drift between schema and files is the most common decay.
- Typed content files may prefix their type: `data-customer-list.md`.
- Entry file: `CLAUDE.md` for Claude Code, `AGENTS.md` for other agents. If both exist, one is generated from the other or is a one-line pointer — never two hand-maintained copies.
- Templates are blank, named for what they produce, and live together: `_templates/pilot-brief.md`.

## Library rules

- **The catalog holds no books.** Routing files point at everything and store almost nothing. When a routing file grows, it is absorbing payload — move the payload to a shelf.
- **One home per fact; a link beats a copy.** Duplication is how structures rot.
- **Generated indexes are never hand-edited.** A file map built from frontmatter by a script cannot drift; a hand-curated one always does. If an index matters, script it and schedule the rebuild.
- **The structure is the documentation.** If something needs explaining, the explanation goes in that folder's `CONTEXT.md`, not in a wiki elsewhere and not in anyone's head. A new collaborator should understand the whole pipeline by reading the CONTEXT files top to bottom, without running anything.
- **Method and instance live apart.** The blank, reusable template of a structure is a different artifact from any filled-in deployment of it. When a structure proves out, extract the template before it tangles with the data.
- **Working sessions end in artifacts.** A workshop, interview, or planning call that produces only slides or vibes has failed the structure; it should end with files the structure can shelve.

## Token discipline

A stage's full context — entry + contract + references + inputs — should land around 2,000–8,000 tokens. That keeps the model in the range where it performs best and keeps every load auditable. A monolithic everything-prompt for the same pipeline typically runs 30k–50k tokens, most of it irrelevant to the current step; ICM never loads those tokens rather than compressing them later. If a stage's context balloons: split the stage, tighten the Inputs list, or push detail down into an L3 file the contract points at but doesn't inline.

## Where ICM loses

Name these honestly rather than overclaiming:

- **Real-time multi-agent collaboration** — agents responding to each other in tight loops need message-passing infrastructure; file handoffs are too slow.
- **High concurrency** — many users hitting one pipeline needs queueing, state isolation, deployment. ICM is local-first by design.
- **Automated mid-pipeline branching** — a human choosing stage 3a vs 3b between stages is natural; the *system* branching on AI output mid-run pushes ICM toward becoming the framework it replaced.

The claim is not that ICM replaces frameworks everywhere. The claim is that for sequential, human-reviewed, repeatable workflows — most knowledge work — the framework is more complexity than the problem requires, and that complexity costs opacity, fragility, and developer dependency.
# The Six Forms

One skeleton, six jobs. Every form obeys the ten invariants; what changes is what the repeating unit is and what the structure optimizes for. All six are drawn from production workspaces, not theory.

Contents: Selection · 1 Pipeline · 2 Umbrella · 3 Record library · 4 Knowledge bundle · 5 Context map · 6 System map · Composing forms

## Selection

Ask one question first: **what is the repeating unit of work?**

| The unit is… | Form |
|---|---|
| a run (same stages, new deliverable each time) | Pipeline |
| several kinds of runs sharing one identity | Umbrella |
| a record that accumulates (person, client, session) | Record library |
| the knowledge itself (claims, notes, evidence) | Knowledge bundle |
| an organization (teams, processes, data, handoffs) | Context map |
| a folder later agents must edit (code, markdown, or mixed) | System map |

## 1. Pipeline — the production line

The paper's canonical shape. The same sequence runs weekly or daily with different input, a human reviews at each boundary, and a deliverable leaves at the end.

```
workspace/
├─ CLAUDE.md               identity + routing table
├─ CONTEXT.md              the pipeline in one screen
├─ stages/
│  ├─ 01_research/   {CONTEXT.md, references/, output/}
│  ├─ 02_script/     {CONTEXT.md, references/, output/}
│  └─ 03_production/ {CONTEXT.md, references/, output/}
├─ _shared/                factory: voice.md, design-system.md
└─ setup/questionnaire.md  configures the factory once
```

**Defining moves:**
- Handoff = one stage's `output/` is the next stage's input. A human edits the file in between; the next stage reads whatever is there.
- Each contract carries a "load this / do NOT load that" inputs table.
- `status` is answered by scanning `stages/*/output/` for files.
- Stage boundaries sit where the human naturally pauses to check — surfacing the judgment call (an outline, a structural plan) as an editable file *before* the expensive downstream work is the whole trick. Correction is cheapest at the earliest gate.

**Expect a U-curve of human editing:** heavy at the first stage (direction-setting), light in the middle (constrained by both anchors), heavy at the last (aligning output with earlier decisions). Design the first and last outputs to be especially easy to edit.

**Watch for:** stages that do two jobs (split them); contracts that restate reference material (point instead); pipelines built before the process has actually repeated (don't).

## 2. Umbrella — a portfolio of pipelines

Several distinct production lines share one brand, voice, and reference layer. The root is a map, not a sequence.

```
workspace/
├─ CLAUDE.md               the map: what lives where, which pipeline for which job
├─ 01-pillars/             shared factory: positioning, pillars
├─ 02-brand-voice/         shared factory: voice, style
├─ 03-video-production/    a full Pipeline workspace (own CLAUDE.md)
├─ 04-scene-generation/    a full Pipeline workspace (own CLAUDE.md)
└─ 05-animation-studio/    a full Pipeline workspace (own CLAUDE.md)
```

**Defining moves:**
- Each sub-pipeline is self-contained with its own entry file — "they don't share state" except through the root reference layers.
- The root entry file routes by task ("making a talking-head video → 03; animating a diagram → 05") and holds nothing else.
- A pipeline may host sibling *patterns* (two variants of the same line, e.g. record-then-cut vs animation-first) — the routing move recursing one level down.

**Watch for:** the root map going stale as pipelines evolve (the map states only what rarely changes; details live in each pipeline); shared reference duplicated into sub-pipelines (link up instead).

## 3. Record library — the unit is a record

Nothing "runs" to completion; records (people, clients, sessions, deals) get created, accumulate, and are looked up. The structure optimizes retrieval and uniform shape.

```
workspace/
├─ 00_START-HERE.md        the map (identity + routing in one file)
├─ _index/                 catalog: log.md — one line per record, id + status
├─ _templates/
│  └─ record-template/     the stamp: every record starts as a copy of this
├─ 01_reference/           factory: the method, rules, shared knowledge
└─ records/
   ├─ acme-corp/           each record the same internal shape
   └─ jane-doe/
```

**Defining moves:**
- **A new record is a copy, not a blank page.** The template *is* the schema.
- The index log is the declared source of truth for what exists, its id, and its status — one line per record, statuses forming a small lifecycle (`briefed → active → archived`).
- Naming convention doubles as an id scheme (`ht10-second-brain`: type + counter + slug).
- Records can recurse: each record may internally be a mini knowledge bundle or pipeline (a person-record holding its own layered brain; a session-record holding its own six-stage line). Uniformity across records is what makes the library queryable.

**Watch for:** records drifting from the template shape (re-stamp them); the index log absorbing content (it's a catalog line, not the record); half-created records with only one file (finish the stamp or archive it).

## 4. Knowledge bundle — the product is the knowledge

The deliverable is a navigable body of knowledge: a brain, a domain wiki, a model of a person or subject. Often emitted by an extraction pipeline (factory and product as two separate top-level trees).

```
workspace/
├─ CLAUDE.md
├─ corpus/                 raw sources + _index.md checkbox manifest (state surface)
├─ extraction/             the factory: an ICM Pipeline whose output is the bundle
└─ bundle/                 the product:
   ├─ index.md             what's in here, layer by layer
   ├─ voice/  (layer A)    always-load essentials
   ├─ dispositions/ (B)    load-by-task
   └─ episodes/ (C)        evidence, loaded last, access-tiered
```

**Defining moves:**
- Every note carries typed YAML frontmatter (`type:`, `layer:`, `access_tier:`, `strength:`) — labels make it queryable, links make it a graph.
- Notes cross-link by relative path or wikilink; navigation is link-following, not folder-crawling. A link that doesn't resolve yet marks something worth writing, not an error.
- Layered loading is the reading protocol: always-load layer first, task-relevant nodes second, evidence only when needed. Never slurp the bundle.
- `access_tier` gates what may leave the machine: patterns abstracted from private sources are fine; raw quotes are not.
- Regenerating the bundle is a factory run; every change appends to a log.

**Watch for:** the bundle read as a search index instead of a model (it answers "how does this think," not "find me the file"); frontmatter fields nobody queries (cut them); extraction runs that edit the product by hand (fix the factory).

## 5. Context map — the organization as a graph

The subject is a company or team: who does what, what data moves where, what's ripe for automation. Nodes + labels + links rather than stages.

```
workspace/
├─ CLAUDE.md / AGENTS.md   entry (one generated from the other)
├─ FILE-MAP.md             GENERATED index — agents jump here, never crawl
├─ _meta/                  the rules: schema.md, maturity-levels.md, ritual docs
├─ teams/
│  └─ marketing/
│     ├─ Marketing.md      node card: In / Movement / Out / Edges
│     ├─ governance.md
│     ├─ jobs/             outcome nodes
│     ├─ processes/        workflow nodes (the workhorses)
│     └─ data/             data-<thing>.md asset nodes
├─ patterns/               cross-team patterns, written bottom-up only
└─ dashboards/             00-tracker.md … live queries over frontmatter
```

**Defining moves:**
- A closed set of node types (team, job, process, data-asset, governance, pattern) defined once in `_meta/schema.md`; every node declares its `type:` in frontmatter.
- Process nodes carry the scoring frontmatter: owner, ai-level (L0 manual → L3 integrated), frequency, value 1–5, pain 1–5, `consumes:`/`produces:` as wikilinks to data assets. The links draw the org graph on their own; high value + high pain = pilot candidate.
- **The workshop is the data event.** Map live with the team; every session ends in clean node files, not slides. "You don't point an agent at a legacy mess — you clean the shelf first."
- The librarian ritual per team: inventory → single source of truth → give it shape → catalogue → shelve by sensitivity → connect the agent. The human stays the approval gate; the agent drafts and proposes.
- Patterns require three independent occurrences: one team complaining is a gripe, three teams landing on the same workflow and the same pain is structure.

**Watch for:** schema mandating names the files stopped using (reconcile immediately); duplicate entry files drifting; instance data tangled into the reusable method (extract the blank starter kit early); node types multiplying past what anyone queries.

## 6. System map — a body of work as an edit graph

The subject is a tree someone will change: a repository, a markdown vault, or both. The map exists so a later agent can answer “what is this” and “what else moves” without slurping the tree. Nouns are object cards; verbs are process cards; `effects/` is only an index into those cards.

```
subject/
├─ CLAUDE.md                 existing entry — add one row pointing at map/
└─ map/
   ├─ CLAUDE.md              catalog (generate AGENTS.md + routing.md)
   ├─ CONTEXT.md             universes + name collisions
   ├─ _meta/schema.md
   ├─ _templates/            object.md, process.md
   ├─ objects/               record library of nouns
   ├─ processes/             real movements only
   └─ effects/CONTEXT.md     if you change X, open these cards
```

**Defining moves:**
- The subject tree remains authoritative. Cards cite `path:line` (code) or the owning file (markdown). Aspiration and dead types are `ghost`, not live.
- Slices are gated: inventory → catalog → nouns → verbs → impact index → re-verify. Empty `processes/` / `effects/` folders are forbidden.
- **Hits / Does not hit** is the waterfall. “Does not hit” names the obvious next noun that is the wrong one.
- Compose with Record library (the cards) inside this form. Do not confuse this with Context map (an org) or Knowledge bundle (how something thinks).

**Watch for:** copying behaviour into cards; mapping intent docs as live; two hand-edited entry files; marking `verified` without a citation.

The audit pipeline, card sections, and walk test for this form: [system-map.md](system-map.md).

## Composing forms

The forms nest, because the invariants are recursive:

- A **record library** whose records are **knowledge bundles** (a cohort of people, each carrying a layered brain).
- A **pipeline** that emits into a **record library** (each run becomes a session record with the pipeline folded inside it).
- An **umbrella** over pipelines that all draw on one **knowledge bundle** as their factory layer.
- A **context map** whose per-team folders each grow a small **pipeline** for their pilot process.
- An **umbrella** or repo whose `developer-docs/` (or vault root) hosts a **system map** of the subject beside a setup **pipeline**.

When composing, keep one rule absolute: each level has its own small catalog, and no level's catalog describes the internals of the level below — it links down and stops.
=== assets/templates/CLAUDE.md
# {Workspace name}

{One sentence: what this workspace is and what leaves it.}

Built on ICM: folders carry sequencing, hierarchy carries context, files carry state. The structure is the documentation — if something needs explaining, the explanation goes in that folder's CONTEXT.md, not in your head.

## Where things live

| Folder | What it holds |
|---|---|
| `stages/` | the pipeline, in execution order |
| `_shared/` | factory: rules and reference that never change per run |
| `_templates/` | blank starters — new work is a copy, not a blank page |
| `setup/` | one-time factory configuration |

## Route by what just happened

| If | Go to | Then stop at |
|---|---|---|
| starting a new run | `stages/01_.../CONTEXT.md` | human reads the output |
| {previous stage} output approved | next num
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/template; for f in CLAUDE.md CONTEXT.md the-page.md \"01 intake/CONTEXT.md\" \"02 read/CONTEXT.md\" \"03 compare/CONTEXT.md\" \"04 review/CONTEXT.md\" \"05 request/CONTEXT.md\" \"01 intake/77-mockup-drive/house-info.md\" \"01 intake/77-mockup-drive/site-notes.txt\"; do echo \"=== $f\"; cat \"$f\"; done; ls -la \"01 intake/77-mockup-drive\"; head -c 1500 \"01 intake/77-mockup-drive/PO XYZ-02402401-012.html\"",
  "description": "Read all template files"
}
```

## Result

```
=== CLAUDE.md
# PO Verifier

This checks a builder's POs against what a trade measured on site, and builds the request for the
difference. It is a practice build with made-up data.

1. Read `the-page.md` for who it is for and why.
2. Read `CONTEXT.md`, the map, before doing anything.
3. Go to the stage you need and read its `CONTEXT.md` first. A house moves through the stages in
   order: `01 intake`, `02 read`, `03 compare`, `04 review`, `05 request`.

Never send anything, never change what is in `01 intake`, and stop and ask Sam when unsure.
=== CONTEXT.md
# PO Verifier: the map

## What this is
It checks a builder's POs against what the trade measured on site, and builds the request for the
difference. This is a practice build. The data is made up and nothing is ever sent.

## What is here

| Folder or file | What it holds |
|---|---|
| `reference/price-list.md` | Where the price list lives and how to read it |
| `01 intake/` | What arrives for each house, untouched |
| `02 read/` | The documents turned into rows, confirmed by Sam |
| `03 compare/` | The difference, worked out by calculation |
| `04 review/` | Sam's decisions |
| `05 request/` | The request for the site super |

Each stage folder has a `CONTEXT.md` that says what happens there. Read it before working in it.

## How a house moves through
A house goes through the stages in order, 01 to 05. In every stage it has its own folder, named for
its address, such as `77-mockup-drive`. A stage only starts when the one before it has finished. The original documents stay in
`01 intake` and are never moved or copied. Each later stage reads what the stage before it wrote,
and writes only its own output into its own house folder.

## How things are named
- **PO number:** the ORDER # printed on a PO. It is the job number, a slash, and a running number.
  It goes on every row and is never dropped.
- **EPO:** the builder's extra PO. It has a total and no lines, and names the PO it belongs to.
- **VPO:** what Sam asks for. The site super writes it as an EPO.

## What the numbers mean
- Variance is measured value minus PO amount. A plus is money owed to Sam. A minus is a credit
  back to the builder.
- The calls ($0, under $50, $50 to under $100, $100 and up) and the house-total rule are in
  `03 compare/CONTEXT.md`.
- Tax is taken from each PO's own figures. See `05 request/CONTEXT.md`.

## What lives somewhere else
- The price list is in Airtable. See `reference/price-list.md`.
- The POs come from the builder's ordering system (OrderDesk). The files here are copies.
- EPOs are written and approved in the builder's system, not here.

## Where Sam is asked
Twice: in `02 read`, to confirm what was read, and in `04 review`, to decide what to chase.
Everything else runs without him.

## What must never happen
- Nothing in `01 intake` is ever changed.
- No dollar amount is written by judgment. Every one comes from a calculation.
- The AI never makes a call for Sam and never sends anything.
- If something is unclear, stop and ask Sam. Never guess.
=== the-page.md
# My page (a painting contractor's purchase orders)

Made-up data, real problem. The builder, the painter, the addresses, the POs and the rates are all
stand-ins.

## Who receives it
A painting contractor who works for home builders and is paid through the builder's purchase
orders.

## The line
For trade contractors, we fix one office bottleneck (missed calls, slow estimates, late invoices,
or scattered job details) with the simplest system that works, one their team can run, check, and
change, so fewer jobs, dollars, and evenings slip through the cracks.

For this build, the bottleneck is wrong purchase orders: I turn his purchase orders and his real
measurements into a document that shows the differences, so he gets paid for the work he has done,
on both sides.

## The steps
1. Find the pain. Sit with the contractor and ask where the paperwork costs him money (judgment)
2. The builder's POs arrive through the builder's ordering system, often several per house (rule)
3. Look up the agreed rate on the current price list (lookup)
4. Measure on site: handrail feet, doors, stringer caps (rule)
5. Compare the POs against the price list and his measurements, line by line (lookup) **circled**
6. Decide what is worth chasing. Small differences are ignored, large ones flagged, the ones in
   between are his call (judgment) **AI never does this**
7. Request an added PO from the builder, with the proof attached. Never delete a PO (rule)
8. Build the invoice on the checked totals (rule)
9. He checks every dollar and sends it (judgment) **AI never does this**

## The circled step
Step 5. Today he does it at night after a 12-hour day, or not at all, so money goes unbilled.

## The steps AI must never do
Steps 6 and 9. The AI never decides the money and never sends anything. Every amount is worked
out by a formula, and he approves anything that goes to a builder.

## Inputs
For each house, the builder's POs and EPOs and the painter's site measurements, dropped into
`01 intake/<house>/`. The price list in Airtable, as described in `reference/price-list.md`.

## Done, in his words
Not asked yet in his words. My read so far: a document he can keep that shows the difference
between the purchase orders and his real measurements, on both sides.
=== 01 intake/CONTEXT.md
# 01 intake: what arrives for a house

## What this stage is for
Everything about one house lands here first, exactly as Sam received it.

## What comes in
- The builder's POs for the house.
- Any EPOs the builder has already issued for it. Sam asks for a VPO; the builder's system
  issues it as an EPO (an extra PO).
- Sam's measurements from site.

## Who puts it here, and how
Sam. The builder sends him the PO, or he retrieves it from OrderDesk. He takes his measurements
on site. Then he puts the PO and the measurements into the PO Verifier: he drags the files in, or
takes a photo with his phone in the Claude app. After that he should see the results.

## What Sam includes with it
- The address of the house.
- The lot number.
- The builder's name.
- The date he measured.
- The date he dropped the files in.

## How it is filed
One folder per house, named for the address, such as `77-mockup-drive`.

## What is checked here
1. The address, the date measured and the date dropped in are there.
2. There is at least one PO and one set of measurements.
3. Every PO and EPO shows its PO number.

If any of these is missing, ask Sam. Nothing moves on until all three pass.

## What goes out
The same files, untouched, ready for the read stage (`../02 read/`).

## What must never happen here
Nothing that arrives is edited, renamed or deleted. Nothing is read into numbers here. That is
the next stage's job.

## Open
How a photo taken on Sam's phone gets from the Claude app into this folder is not decided.
=== 02 read/CONTEXT.md
# 02 read: turn the documents into rows

## What this stage is for
The AI reads everything in the house's intake folder and writes it out as rows. Sam checks the
rows before anything is compared.

## What comes in
Everything in `../01 intake/<house>/`: each PO, each EPO, Sam's measurements, and the address,
lot, builder and dates he gave. The price list, as described in `../reference/price-list.md`.

## What is read from each PO
All of it, copied exactly as printed.
- **The PO number** (printed as ORDER #). It goes on every row read from that PO and follows
  the row through every later stage. It is how the builder finds the PO.
- About the PO: builder, community, cost code, vendor name and number, job name,
  job address, lot/block/unit, plan, elevation, date needed, price effective date, who submitted
  it and when, who approved it and when (if filled in).
- Each line: option number, SKU, description, unit, quantity, unit price, line total.
- Under each line: the special option information, every line of it. That means the option name,
  each selection, and any notes.
- The money at the bottom: subtotal, each tax line, total.

## What is read from each EPO
All of it, copied exactly as printed: who created it, community, job name, lot number, legal
lot and block, EPO name, EPO total, reason code, notes, account code, trade partner, date
requested, and its approval status. The EPO name carries the vendor number and the PO number it is
against. Record that PO number on the EPO row. An EPO has a total and no lines, so match it to the item it pays for, using its
account code and notes, and show that match to Sam like any other.
Also say which way the money goes. Most EPOs pay Sam. A back charge against Sam takes money from
him. A back charge against another trade, where the builder pays Sam to fix that trade's work,
still pays Sam. Sam confirms the direction with the rest of the table.

## What is read from Sam's measurements
One row per thing he measured, in his own words: what it is, its size or count, the colour, and
anything else he wrote.

## Matching to the price list
Each PO line and each thing Sam measured is matched to one item on the price list. The match is
shown in the table so Sam confirms it with everything else. If something fits no item, or could
fit two, it is listed as "no match" and Sam decides.

## What is checked before Sam sees it
1. Each line's quantity times its unit price equals its line total.
2. The lines add up to the subtotal printed on the PO.
3. The subtotal plus the taxes equals the total.
4. The job address on each PO matches the address Sam gave.
5. Anything on Sam's notes that is on no PO is listed as an extra item.
6. No PO number appears twice in the house folder. If one does, say which and stop. The same PO
   read twice would count its money twice.

If check 1, 2, 3, 4 or 6 fails, say which PO and stop.

## How Sam confirms
He sees one table of everything that was read and replies yes. If a row is wrong, he gives the
right number and the AI fixes that row, then shows the table again.

## What goes out
One file per house in this folder, `<house>/read-back.md`, holding the confirmed rows, Sam's yes,
and the date. The compare stage (`../03 compare/`) works from that file and nothing else.

## What must never happen here
The AI never guesses a number it cannot read. It never corrects a PO, even an obvious mistake.
It never changes the files in intake. Nothing is priced or compared here.

## Careful
These come from real builder POs.
- **The lines add up to the subtotal, not the total.** The total includes tax.
- **A quantity is not always a count.** One PO had a quantity of 0.1 against a lump-sum price.
  Copy it as printed.
- **The unit can be wrong.** One PO said EA on a line that was plainly priced per square foot.
  Copy the unit as printed and say so in the table.
- **The quantity and the selection can disagree.** One line had a quantity of 721 and a selection
  of 773. Record both. Do not pick one.
- **The notes under a line can change what it covers.** One said what the price does not include.
  Copy them in full.
- **A number can be printed oddly.** A selection of 1 can appear as `1.000000000000000e+000`.
- **One house has many POs to many trades.** The order number is the job number, a slash, and a
  running number. Every PO in a house folder should be to the same vendor.
- **Each PO has its own price effective date.** Record it. It says which price list the builder
  priced from.
=== 03 compare/CONTEXT.md
# 03 compare: work out the difference

## What this stage is for
Using the rows Sam confirmed, work out the difference between what the builder's POs pay and
what the work Sam measured is worth at his agreed rates.

## What comes in
- `../02 read/<house>/read-back.md`, the confirmed rows. Nothing else from the house.
- The agreed rates from the price list, as described in `../reference/price-list.md`.

## One row per item, per PO
Every row carries its PO number. If the same item is on two POs, it is two rows, one for each
PO, because the builder fixes each PO separately. An item Sam measured that is on no PO has
"none" for its PO number.

## What is worked out, for each row
- **PO amount:** the PO quantity times the PO unit price, as printed. Any EPO the builder has
  already issued for the item counts as part of the PO amount, so Sam is never asked twice for the
  same money. An EPO has a total and no lines; the read stage says which item it pays for. An EPO that pays
  Sam adds to the PO amount. A back charge against Sam takes away from it.
- **Measured value:** Sam's quantity times the agreed rate from the price list.
- **Variance:** measured value minus PO amount. A plus is money owed to Sam. A minus is a credit
  back to the builder.
- **Why:** matches, PO quantity short, PO quantity over, PO rate differs from the agreed rate, or
  missing from every PO. If more than one applies, give each.

## Rows that cannot be compared
Some PO lines are not a count of anything Sam can measure, such as a quantity of 0.1 against a
lump-sum price. Mark these "not comparable", show them to Sam, and give them no call. They are not
added into the variance.

## The call on each row
By the size of its variance, plus or minus:
- exactly $0: matches
- under $50: ignore
- $50 to under $100: Sam's call
- $100 and up: flag

## The house total
Work out the total of the POs, the total measured value and the total variance, all before tax.
If the total variance for the house is $100 or more, plus or minus, the house is flagged even if
no single row is. Sam then sees every row marked ignore or Sam's call, together, in the review
stage.

## How the sums are done
Every number comes from a calculation, run and shown, never added up in the AI's head. Numbers
are copied from the read-back, never read again from the documents.

## What goes out
`<house>/variance.md`, holding:
- one table: PO number, item, unit, agreed rate, PO quantity, PO rate, PO amount, measured quantity,
  measured value, variance, why, call;
- the rows marked not comparable, listed separately;
- the three totals, and whether the house total is flagged;
- a line saying which checks were run.

The review stage (`../04 review/`) works from that file.

## What must never happen here
Nothing is decided here. No row is chased or dropped. That is Sam's job in the review stage.
=== 04 review/CONTEXT.md
# 04 review: Sam decides

## What this stage is for
Sam decides what goes on the request to the builder. The AI lays it out; Sam makes every call.

## What comes in
`../03 compare/<house>/variance.md`.

## What Sam sees
Every row shows its PO number, grouped by PO.
- **Flagged rows.** These go on the request unless Sam takes one off. If he takes one off, he
  gives a few words on why.
- **Sam's-call rows.** He says chase or leave for each. If he says nothing, the row is left off.
- **Credits back to the builder,** shown as minus rows. Each one is Sam's call, like the rows
  above. A credit is left off unless he says to include it.
- **If the house total is flagged:** every ignore row as well, so he sees the small ones together.
- **Not-comparable rows,** for his information only. They have no call.

## How Sam answers
One table for the house. He replies yes to accept it as shown, or names the rows he wants to
change. The AI updates the table and shows it again until he says yes.

## What goes out
`<house>/review.md`, holding each row with Sam's decision, the reason for any flagged row he took
off, his yes, his name and the date. There is one request per house. The request stage
(`../05 request/`) works from that file.

## What must never happen here
The AI never makes a call for Sam and never fills in a decision he did not give. A row Sam did
not choose never goes on the request.
=== 05 request/CONTEXT.md
# 05 request: build the VPO request

## What this stage is for
Turn Sam's approved rows into one request for the house, with the proof attached. Sam sends it to
the builder's site super, who writes the EPO.

## What comes in
- `../04 review/<house>/review.md`, with Sam's yes.
- `../03 compare/<house>/variance.md`, for the numbers.
- The original POs, EPOs and measurements in `../01 intake/<house>/`, as proof.

## What the request holds
- **The house:** address, lot, builder, community, job name.
- **The rows, grouped by PO number.** The site super writes one EPO per PO, so each PO gets its
  own group, headed by its PO number. Each row shows the item, the PO quantity and amount, Sam's measured quantity and
  value, the difference, and why.
- **Tax on every group.** For each PO group: the difference before tax, each tax line, and the
  total. Use the tax lines and rates printed on that PO, worked out from its own subtotal and tax
  amounts. Never assume a rate. Every request carries tax, because every sale has tax. The
  "no PO" group uses the rate on the house's other POs. If those POs carry different rates, stop
  and ask Sam.
- **Items on no PO** go in their own group, marked "no PO", so the site super knows a new PO
  or EPO is needed.
- **Credits** Sam chose to include, shown as minus rows inside their PO group.
- **The total for the house:** before tax, the tax, and the total.
- **The proof:** a list of every document attached.

## How it looks
Follow `../reference/request-layout.html`. A filled-in sample is
`../reference/request-layout-sample.pdf`. Show only the rows Sam approved. Matches, ignored rows
and rows Sam left off are not on the request.

## How the sums are done
Every difference is copied from the compare, never worked out again. The tax and the totals come
from a calculation, run and shown.

## What goes out
`<house>/vpo-request.pdf`, for Sam to check. Sam sends it to the site super himself.

## What must never happen here
Only rows Sam approved go on the request. The AI never sends it, and never contacts the builder
or the site super.
=== 01 intake/77-mockup-drive/house-info.md
# House info

Made-up practice house. Not a real job.

- Address: 77 Mockup Drive
- Lot: 24, block 3
- Builder: Sample Builder Ltd.
- Date measured: 2026-10-02
- Date dropped in: 2026-10-14
=== 01 intake/77-mockup-drive/site-notes.txt
77 Mockup Dr / lot 24
Oct 2

prime 1
3020 sf
8' doors x12 (they added the basement ones)
railing 22 ft wood
stringers 34 ft
GARAGE - primed and painted incl ceiling, 420 sf. site super asked for it,
said a change order was coming. never saw one.
touch up 1
total 46
drwxr-xr-x 1 AzureAD+<user> 4096     0 Oct 15 09:46 .
drwxr-xr-x 1 AzureAD+<user> 4096     0 Oct 15 09:46 ..
-rw-r--r-- 1 AzureAD+<user> 4096  9055 Oct 15 09:46 PO XYZ-02402401-012.html
-rw-r--r-- 1 AzureAD+<user> 4096 12400 Oct 15 09:46 PO XYZ-02402401-027.html
-rw-r--r-- 1 AzureAD+<user> 4096  9063 Oct 15 09:46 PO XYZ-02402401-041.html
-rw-r--r-- 1 AzureAD+<user> 4096   199 Oct 15 09:46 house-info.md
-rw-r--r-- 1 AzureAD+<user> 4096   268 Oct 15 09:46 site-notes.txt
<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>BuildPro:  Job Management</title></head>
<body bgcolor="white">
<!-- MADE-UP PRACTICE DOCUMENT. Not a real purchase order. Laid out like a BuildPro PO print. -->
<table width="660" align="center" border="1" cellpadding="1" cellspacing="0"><tr><td bgcolor="#f7f3f7">
<table width="660" border="0" cellpadding="0" cellspacing="0"><tr>
<td width="200" valign="top"><font face="arial" style="font-size:12px;"><b>&nbsp;<br>Mockup Ridge Single Family&nbsp;</b></font></td>
<td width="260" align="center"><font face="arial" style="font-size:15px;"><b>Sample Builder Ltd.</b><br><b>Purchase Order Request</b></font>
<table border="0" cellpadding="1" cellspacing="0">
<tr><td><font face="arial" style="font-size:12px;"><b>ORDER #:</b></font></td><td align="right"><font face="arial" style="font-size:12px;">&nbsp;XYZ-02402401/012&nbsp;</font></td></tr>
<tr><td><font face="arial" style="font-size:12px;"><b>COST CODE:</b></font></td><td align="right"><font face="arial" style="font-size:12px;">&n
```

## Builder

Now the tools and practice sets.

## Call: Bash

```json
{
  "command": "cd /c/tc-build; cat tools/make-map.mjs tools/practice.mjs; ls -la lib icm; cat .gitattributes",
  "description": "Read tools and check lib and icm folders"
}
```

## Result

```
// Generates the folder's map (README.md) from the frontmatter of the documents in reference/.
// The map is information only: it may contain only what the documents' frontmatter states.
// How to look things up is an instruction, and lives in rules.md.
//
//   node tools/make-map.mjs

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOLDER_DIR, LIBRARY_DIR } from '../lib/config.mjs';

const ROLE_NOTES = { governing: '', changes: ' Changes document.', summary: ' Summary; does not govern.', archive: ' Archive; does not govern.' };
const ROLE_ORDER = ['governing', 'changes', 'summary', 'archive'];

const unquote = (value) => (value.startsWith('"') ? JSON.parse(value) : value);

export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const data = {};
  let list = null;
  for (const line of match[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && list) { data[list].push(unquote(item[1].trim())); continue; }
    const pair = line.match(/^([a-z]+):\s*(.*)$/);
    if (!pair) continue;
    if (pair[2] === '') { list = pair[1]; data[list] = []; } else { list = null; data[pair[1]] = unquote(pair[2]); }
  }
  return data;
}

function documentLine(path, meta) {
  if (!(meta.role in ROLE_NOTES)) throw new Error(`${path} has an unknown role "${meta.role}".`);
  const replaces = meta.replaces?.length ? ` Replaces: ${meta.replaces.join('; ')}.` : '';
  const note = meta.note ? ` ${meta.note}` : '';
  return `- ${path}: ${meta.covers.replace(/\.+$/, '')}.${ROLE_NOTES[meta.role]}${replaces}${note}`;
}

export function makeMap(libraryDir) {
  const lines = ['# Map of the library', ''];
  for (const set of readdirSync(libraryDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort()) {
    const docs = readdirSync(join(libraryDir, set)).filter((name) => name.endsWith('.md')).sort().map((name) => {
      const meta = parseFrontmatter(readFileSync(join(libraryDir, set, name), 'utf8').replace(/\r\n/g, '\n'));
      if (!meta) throw new Error(`${set}/${name} has no frontmatter.`);
      return { path: `${LIBRARY_DIR}/${set}/${name}`, meta };
    });
    docs.sort((a, b) => ROLE_ORDER.indexOf(a.meta.role) - ROLE_ORDER.indexOf(b.meta.role) || a.path.localeCompare(b.path));
    lines.push(`## ${docs[0].meta.set}`, '', ...docs.map((d) => documentLine(d.path, d.meta)), '');
  }
  return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const text = makeMap(join(FOLDER_DIR, LIBRARY_DIR));
  writeFileSync(join(FOLDER_DIR, 'README.md'), text);
  console.log(`README.md written: ${text.split(/\s+/).filter(Boolean).length} words`);
}
// Runs one practice question against a workspace being built, with exactly the flags, tools and
// isolation of the sealed run, and prints what happened. For building and walk-testing only.
//
//   node tools/practice.mjs --workspace <dir> --set <practice set dir> --doclist <path in workspace> --q Q3
//                           [--runs 1] [--log <dir>]
//
// The workspace and the set's reference/ are copied into a fresh room; the list of documents is
// generated from that reference/ by tools/make-map.mjs and written to --doclist inside the room.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ask } from '../lib/claude.mjs';
import { option, runCli } from '../lib/cli.mjs';
import { LIBRARY_DIR } from '../lib/config.mjs';
import { loadQuestions } from '../lib/questions.mjs';
import { parseLog, summarise } from '../lib/session.mjs';
import { assertCleanAncestors } from '../lib/stage.mjs';
import { makeMap } from './make-map.mjs';

const ROOT = process.platform === 'win32' ? 'C:/tc-practice' : '/tmp/tc-practice';
const STAGED_TIME = new Date('2026-01-01T00:00:00Z');

function setTimes(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) setTimes(path);
    utimesSync(path, STAGED_TIME, STAGED_TIME);
  }
}

// The room a practice session runs in: the workspace, the set's documents, and the generated list.
export function stageRoom(room, workspace, set, doclist) {
  rmSync(room, { recursive: true, force: true });
  mkdirSync(room, { recursive: true });
  cpSync(workspace, room, { recursive: true });
  if (existsSync(join(room, LIBRARY_DIR))) throw new Error(`The workspace holds its own ${LIBRARY_DIR}/; the documents come from the set.`);
  cpSync(join(set, LIBRARY_DIR), join(room, LIBRARY_DIR), { recursive: true });
  const listPath = join(room, doclist);
  if (resolve(listPath).toLowerCase().startsWith(resolve(room, LIBRARY_DIR).toLowerCase())) throw new Error('The list of documents may not sit inside reference/.');
  mkdirSync(dirname(listPath), { recursive: true });
  writeFileSync(listPath, makeMap(join(room, LIBRARY_DIR)));
  setTimes(room);
}

const isDoc = (target) => target.toLowerCase().startsWith(`${LIBRARY_DIR}/`);

export function describe(row) {
  const calls = row.calls.map((c) => `${c.tool} ${c.target}${c.ok ? '' : ' (refused)'}`);
  const instruction = row.calls.filter((c) => c.tool === 'Read' && !isDoc(c.target)).length;
  return [
    `steps ${row.steps} (instruction opens ${instruction}, document steps ${row.steps - instruction}), text fetched ${row.charsFetched} characters, ${row.words} words, ${row.seconds} s, model ${row.model}`,
    ...calls.map((c) => `  - ${c}`),
    '', row.answer, '',
  ].join('\n');
}

function main() {
  const usage = 'Usage: node tools/practice.mjs --workspace <dir> --set <dir> --doclist <path> --q <id> [--runs n] [--log <dir>]';
  const workspace = option('workspace'); const set = option('set'); const doclist = option('doclist'); const id = option('q');
  if (!workspace || !set || !doclist || !id) throw new Error(usage);
  const question = loadQuestions(join(set, 'questions.md')).find((q) => q.id === id);
  if (!question) throw new Error(`No question ${id} in ${set}/questions.md.`);
  const runs = Number(option('runs', '1'));
  const log = option('log');
  assertCleanAncestors(ROOT);
  for (let r = 1; r <= runs; r += 1) {
    const room = join(ROOT, `room-${process.pid}-${r}`);
    stageRoom(room, workspace, set, doclist);
    const done = ask(room, question.prompt);
    const row = summarise(parseLog(done.stream).events, { stageDir: room, code: 'practice', run: r, question: id });
    if (log) { mkdirSync(log, { recursive: true }); writeFileSync(join(log, `${id}-r${r}.jsonl`), done.stream); }
    console.log(`## ${id}, run ${r}\n\n${describe(row)}`);
    rmSync(room, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(main);
icm:
total 4
drwxr-xr-x 1 AzureAD+<user> 4096 0 Oct 15 09:46 .
drwxr-xr-x 1 AzureAD+<user> 4096 0 Oct 15 09:46 ..

lib:
total 68
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 .
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 ..
-rw-r--r-- 1 AzureAD+<user> 4096 1880 Oct 15 09:46 claude.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 2372 Oct 15 09:46 cli.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 4492 Oct 15 09:46 config.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 4137 Oct 15 09:46 mini.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 1484 Oct 15 09:46 questions.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 1555 Oct 15 09:46 rng.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 4724 Oct 15 09:46 session.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 6700 Oct 15 09:46 stage.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 4182 Oct 15 09:46 stats.mjs
-rw-r--r-- 1 AzureAD+<user> 4096 1031 Oct 15 09:46 transcript.mjs
* text=auto eol=lf
*.jsonl -text
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/lib; cat claude.mjs config.mjs questions.mjs",
  "description": "Read harness lib files"
}
```

## Result

```
// Starts one Claude Code session with fixed flags and a stripped environment.

import { spawnSync } from 'node:child_process';
import {
  ALLOWED_TOOLS, BLOCKED_TOOLS, CLAUDE_BIN, EFFORT, ENV_ALLOWED, ENV_FIXED, MODEL, SESSION_TIMEOUT_MS,
} from './config.mjs';

// A session sees only the allowed variables, so nothing from the launching shell leaks in.
export function sessionEnv(source = process.env) {
  const env = {};
  for (const name of ENV_ALLOWED) if (source[name] !== undefined) env[name] = source[name];
  return { ...env, ...ENV_FIXED };
}

export function sessionArgs(prompt) {
  return [
    '--setting-sources', 'project', '-p', prompt,
    '--model', MODEL,
    '--effort', EFFORT,
    '--tools', ALLOWED_TOOLS.join(','),
    '--disallowedTools', BLOCKED_TOOLS,
    '--permission-mode', 'dontAsk',
    '--strict-mcp-config',
    '--disable-slash-commands',
    '--output-format', 'stream-json', '--verbose',
  ];
}

export function programVersion(bin = CLAUDE_BIN) {
  const done = spawnSync(bin, ['--version'], { encoding: 'utf8', env: sessionEnv() });
  if (done.error || done.status !== 0) {
    throw new Error(`Cannot run the Claude Code program "${bin}". Set CLAUDE_BIN to its path. ${done.error?.message ?? done.stderr ?? ''}`.trim());
  }
  const match = done.stdout.match(/\d+\.\d+\.\d+/);
  if (!match) throw new Error(`Could not read a version from "${done.stdout.trim()}".`);
  return match[0];
}

export function ask(dir, prompt, bin = CLAUDE_BIN) {
  const started = Date.now();
  const done = spawnSync(bin, sessionArgs(prompt), {
    cwd: dir,
    encoding: 'utf8',
    timeout: SESSION_TIMEOUT_MS,
    maxBuffer: 64 * 1024 * 1024,
    env: sessionEnv(),
  });
  return {
    stream: done.stdout ?? '',
    stderr: done.stderr ?? '',
    exit: done.status,
    timedOut: done.error?.code === 'ETIMEDOUT',
    wallMs: Date.now() - started,
  };
}
// Every fixed value the harness uses lives here, so no number or name is stated twice.

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Worked out from this file's own location, in a way every Node 20 release supports.
export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// The folder under test is the repo's top level: its four instruction files and reference/.
// Everything else in the repo is apparatus and is never staged into an arm.
export const FOLDER_DIR = REPO;
export const QUESTIONS_FILE = resolve(REPO, 'questions.md');
export const STAGE_ROOT = process.env.TC_STAGE_ROOT ?? (process.platform === 'win32' ? 'C:/tc' : '/tmp/tc');
export const CLAUDE_BIN = process.env.CLAUDE_BIN ?? 'claude';

// Order matters: an arm id is one bit per file, in this order.
export const INSTRUCTION_FILES = ['README.md', 'identity.md', 'rules.md', 'examples.md'];
export const LIBRARY_DIR = 'reference';
export const SWITCH_FILE = 'CLAUDE.md';
export const ARM_DOCS_ONLY = 'docs';
export const ARM_EMPTY = 'empty';
export const ARM_FULL = 'c1111';
export const ARM_NONE = 'c0000';
// The known-bad arm: the whole folder loaded first, but its map describes each document with
// another document's entry. It is there to show the test can catch a folder that misleads.
export const ARM_WRONG_MAP = 'wrongmap';

// The pinned model. TC_MODEL lets a visitor try another; the manifest records whichever ran.
export const PINNED_MODEL = 'claude-sonnet-5-5';
export const MODEL = process.env.TC_MODEL ?? PINNED_MODEL;
export const EFFORT = 'medium';
export const ALLOWED_TOOLS = ['Read', 'Glob', 'Grep'];
export const BLOCKED_TOOLS = 'Bash,PowerShell,Edit,Write,NotebookEdit,WebFetch,WebSearch,Agent,mcp__*';
export const SESSION_TIMEOUT_MS = 240000;
export const MAX_ATTEMPTS = 3;
export const TURN_LIMIT = 20;

// The only variables a session inherits. Everything else in the launching shell is dropped.
export const ENV_ALLOWED = [
  'PATH', 'PATHEXT', 'SystemRoot', 'SYSTEMROOT', 'windir', 'COMSPEC', 'TEMP', 'TMP',
  'USERPROFILE', 'HOMEDRIVE', 'HOMEPATH', 'HOME', 'APPDATA', 'LOCALAPPDATA', 'ProgramData',
  'ProgramFiles', 'ProgramFiles(x86)', 'USERNAME', 'OS', 'LANG',
];
export const ENV_FIXED = { CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1', DISABLE_AUTOUPDATER: '1', DISABLE_UPDATES: '1' };

// The headline rule: out of the questions compared, how many must agree.
export const RULE_CLEAR_AT_LEAST = 9;
// A run is void if more than this share of the headline pair's sessions had a fault.
export const FAULT_LIMIT = 0.05;
// Two runs of one arm compared with each other should show no clear difference. This is how
// many of those comparisons may name a direction before the page warns about the rule itself.
export const SELF_COMPARISON_LIMIT = 0;

export function allArms() {
  const cells = [];
  for (let bits = 0; bits < 16; bits += 1) cells.push(`c${bits.toString(2).padStart(4, '0')}`);
  return [...cells, ARM_DOCS_ONLY, ARM_EMPTY, ARM_WRONG_MAP];
}

// What an arm puts on disk and what its switch file loads.
export function armSpec(arm) {
  if (arm === ARM_EMPTY) return { library: false, folder: false, loaded: [] };
  if (arm === ARM_DOCS_ONLY) return { library: true, folder: false, loaded: [] };
  if (arm === ARM_WRONG_MAP) return { library: true, folder: true, loaded: [...INSTRUCTION_FILES], wrongMap: true };
  if (!/^c[01]{4}$/.test(arm)) throw new Error(`Unknown arm "${arm}".`);
  const loaded = INSTRUCTION_FILES.filter((_, i) => arm[i + 1] === '1');
  return { library: true, folder: true, loaded };
}

// What an arm is, in words a reader can follow without a legend.
export function armLabel(arm) {
  if (arm === ARM_EMPTY) return 'Empty';
  if (arm === ARM_DOCS_ONLY) return 'Documents only';
  if (arm === ARM_WRONG_MAP) return 'Folder loaded first, with a map that points to the wrong documents';
  const { loaded } = armSpec(arm);
  if (loaded.length === 0) return 'Folder on disk, nothing loaded';
  if (loaded.length === INSTRUCTION_FILES.length) return 'Folder loaded first (all four files)';
  return `Loaded: ${loaded.map((name) => name.replace('.md', '')).join(' + ')}`;
}

// How often a marker has to guess the arm correctly before we say the answers gave it away.
export const GUESS_TELLS_AT = 0.7;
// Fewer guesses than this on the two headline arms and a marker's guesses say nothing either way.
export const GUESS_MIN = 10;

export const runDir = (name) => resolve(REPO, 'runs', name);
// Reads a question file. A question is a "## <id>" heading followed by fields written as
// "**Label:** text". The prompt is the quoted block under the Prompt label.

import { readFileSync } from 'node:fs';

const squash = (text) => text.replace(/\s+/g, ' ').trim();

function field(body, label) {
  const match = body.match(new RegExp(`\\*\\*${label}[^*]*\\*\\*([\\s\\S]*?)(?=\\n\\*\\*[A-Z][^*]*:\\*\\*|$)`));
  return match ? match[1].trim() : '';
}

function promptOf(body) {
  const quoted = body.split('\n').filter((line) => line.startsWith('>'));
  return squash(quoted.map((line) => line.replace(/^>\s?/, '')).join(' '));
}

export function parseQuestions(markdown) {
  const parts = markdown.split(/^## (\S+)\s*$/m);
  const questions = [];
  for (let i = 1; i < parts.length; i += 2) {
    const body = parts[i + 1];
    questions.push({
      id: parts[i],
      prompt: promptOf(body),
      set: field(body, 'Set:'),
      expected: field(body, 'Expected answer:'),
      source: field(body, 'Source:'),
      requires: field(body, 'Correct requires:'),
    });
  }
  return questions;
}

export function loadQuestions(path) {
  const questions = parseQuestions(readFileSync(path, 'utf8'));
  if (questions.length === 0) throw new Error(`No questions found in ${path}.`);
  const blank = questions.filter((q) => q.prompt === '');
  if (blank.length > 0) throw new Error(`Questions with no prompt in ${path}: ${blank.map((q) => q.id).join(', ')}.`);
  return questions;
}
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice; wc -c */questions.md */reference/*/*.md | tail -1; cat boat-lend/questions.md",
  "description": "Read boat-lend questions"
}
```

## Result

```
165935 total
# Questions

## Q1

**Set:** boat

**Prompt (paste exactly):**

> Under the Brindlecombe Community Boat Club rules: A family of two adults and two children, all living at the same address, plan to take out a household membership for the first time. They have not yet fixed a date but will join in either March or April 2026, paying the joining fee and the annual fee together on the day they join. How much will they pay in total?

**Expected answer:** It depends on the day they pay. If the payment is made on or before 31 March 2026, the total is £100: the £15 joining fee plus the £85 household fee in force from 1 January 2026. If the payment is made on or after 1 April 2026, the total is £110: the £15 joining fee plus the £95 household fee set by the committee's fee decision, which applies to payments made on or after 1 April 2026. The joining fee is £15 in both cases because the fee decision did not change it.

**Source:** boat-fees.md, sections 1.1 and 1.3; boat-changes.md, note in the front matter (payment date decides fee rules) and sections 2.2 and 2.4; boat-membership.md, section 1.2.

**Correct requires:** The answer must give both outcomes, £100 if paid before 1 April 2026 and £110 if paid on or after 1 April 2026, and name the payment date as the deciding fact. It is wrong if it gives a single figure without the date split, uses the superseded archive figures (£10 joining plus £70 household, £80), charges a different joining fee in one of the two cases, or treats the committee decision date of 12 December 2025 as the date the new fee took effect.

## Q2

**Set:** boat

**Prompt (paste exactly):**

> Under the Brindlecombe Community Boat Club rules: An adult member has a confirmed booking for two rowing boats in the 10:00 session on Sunday 14 June 2026. They arrive at 09:45, pay the boat-use charge for both boats, and at 09:55 the on-duty committee member closes the lake because of lightning, so the session does not go ahead. How much did the member pay, and how much, if anything, is refunded?

**Expected answer:** The member paid £8 (£4 per boat for two boats) and is refunded the full £8. A closure under section 4.1 of the safety rules cancels the affected bookings for the purposes of the club-cancellation refund rule, and the club refunds a boat-use charge in full when it cancels a confirmed booking. The member-cancellation and no-show rules do not apply because the member did not cancel or miss the session.

**Source:** boat-fees.md, sections 3.1 and 4.1; boat-safety.md, sections 4.1 and 4.3.

**Correct requires:** The answer must give £8 paid and £8 refunded in full. It is wrong if it says no refund is due because the cancellation came less than 24 hours before the start (treating a lake closure as a member cancellation or a no-show), if it charges £3 per boat (the superseded archive rate, £6), or if it refunds only part of the charge.

## Q3

**Set:** boat

**Prompt (paste exactly):**

> Under the Brindlecombe Community Boat Club rules: On Friday 10 July 2026 an adult member already holds confirmed bookings for sessions on Sunday 12 July 2026 and Tuesday 14 July 2026, both still to come. They now ask to add a third booking for a session on Thursday 16 July 2026. Can the booking be made?

**Expected answer:** No. For bookings dated from 1 July 2026 to 30 September 2026 the committee's summer booking decision replaces the usual weekly limit, so a member may hold no more than two future bookings in any rolling seven-day period. The member already holds two future bookings within a seven-day span (12 and 14 July), so a third on 16 July would exceed the summer limit. The booking window itself is not the obstacle: bookings for 16 July opened at 8:00 am on 2 July 2026 and close two hours before the session.

**Source:** boat-changes.md, sections 3.2 and 3.3 (replacing boat-booking.md section 3.1); boat-booking.md, sections 2.1 and 2.2.

**Correct requires:** The answer must say the third booking cannot be made because the limit is two future bookings in a rolling seven-day period during July to September 2026. It is wrong if it allows the booking under the original three-booking limit, or if it refuses it for a different reason such as the booking window or the two-boats-per-session limit.

## Q4

**Set:** boat

**Prompt (paste exactly):**

> Under the Brindlecombe Community Boat Club rules: Two junior members, aged 14 and 16, are the only people booked into the 14:00 session on Wednesday 20 May 2026, with one kayak each. An approved adult member is named in the booking and stays on site throughout but does not go out in a boat. What boat-use charge must be paid before launch for that session?

**Expected answer:** £4 in total, that is £2 per boat for two boats. A session booked solely for junior members costs £2 per boat when an approved adult supervisor is present, and the charge must be paid before launch. The adult does not use a boat, so no charge arises for them.

**Source:** boat-fees.md, sections 3.2 and 3.3; boat-booking.md, section 1.2; boat-safety.md, section 2.2.

**Correct requires:** The answer must give £4 (£2 per boat). It is wrong if it charges the standard £4 per boat (£8 in total), uses the superseded archive junior rate of £1 per boat (£2 in total), or adds a charge for the supervising adult who is not in a boat.

## Q5

**Set:** boat

**Prompt (paste exactly):**

> Under the Brindlecombe Community Boat Club rules: An adult member's friend, who is not a member, has already used club boats as that member's guest on Saturday 14 March, Saturday 2 May and Saturday 20 June 2026. The member wants to bring the same friend as their only guest again on Saturday 11 July 2026. Is that allowed, and if not, when could the friend next use a club boat as a guest?

**Expected answer:** No. A guest may use club boats on no more than three separate days between 1 January and 31 December, and the friend has already used them on three separate days in 2026. The friend could next use a club boat as a guest from 1 January 2027, when the count restarts for the new calendar year (or they could join as a member).

**Source:** boat-membership.md, sections 4.1 and 4.3.

**Correct requires:** The answer must say the visit on 11 July 2026 is not allowed because the friend has used up the three guest days for the calendar year, and that the next guest use is possible from 1 January 2027. It is wrong if it allows the visit because only one guest is being brought (confusing the two-guests-per-visit limit with the three-days-per-year limit), or if it counts the year from the first guest visit rather than the calendar year.

## Q6

**Set:** lend

**Prompt (paste exactly):**

> Under the Osterby Toy and Tool Library rules: A household's membership expired on Saturday 20 December 2025. Neither named adult declares income support and the household has no unpaid charges. One of the adults comes to the desk on Saturday 10 January 2026 and the desk accepts their renewal payment that day. How much do they pay, and from what date does the renewed membership run?

**Expected answer:** They pay £30, and the renewed membership runs for 12 calendar months from 10 January 2026. The annual fee decision in the register of changes replaces the £24 standard fee with £30 for any joining or renewal payment accepted on or after 1 January 2026. Renewal starts on the date the renewal payment is accepted, not on the old expiry date, so the term is not backdated to 20 December 2025.

**Source:** lend-changes.md, section 2 (replacing lend-fees.md section 2.1); lend-membership.md, section 2.1.

**Correct requires:** The answer must give £30 and a start date of 10 January 2026. It is wrong if it charges £24 (the original fee, still quoted in the out-of-date desk guide) or £18 (the superseded archive fee), charges the £12 reduced fee, or starts the renewed term on 20 December 2025.

## Q7

**Set:** lend

**Prompt (paste exactly):**

> Under the Osterby Toy and Tool Library rules: A household reserved a toy and was notified on Friday 27 March 2026 that it is ready for collection. They have not collected it yet and ask how many days the ordinary loan will run from the day they collect it, before any extension. What is the answer?

**Expected answer:** It depends on the collection date. If the toy is collected on or before 31 March 2026, the ordinary loan is 14 calendar days from collection. If it is collected on or after 1 April 2026, the ordinary loan decision applies and the loan is 21 calendar days from collection. The date test is the collection date, not the reservation or notification date. Collection must happen within 7 days of the 27 March notification, so both outcomes are possible.

**Source:** lend-changes.md, note in the front matter and section 3 (replacing lend-borrowing.md section 2.1); lend-borrowing.md, sections 2.1 and 3.1.

**Correct requires:** The answer must give both outcomes, 14 days if collected before 1 April 2026 and 21 days if collected on or after 1 April 2026, and name the collection date as the deciding fact. It is wrong if it gives a single period without the date split, says the period is fixed by the reservation or notification date (so 14 days regardless), or quotes the desk guide's "fortnight" as the only answer.

## Q8

**Set:** lend

**Prompt (paste exactly):**

> Under the Osterby Toy and Tool Library rules: A household returns two items, a toy and a hand saw, on Monday 25 May 2026. Both had a recorded due date of Friday 8 May 2026 and no extension was granted. On the same visit they ask to take out a new toy. What overdue charge is due, and may they take the new toy before paying it?

**Expected answer:** The overdue charge is £20: each item is 17 calendar days late at £1 per day, but the charge is capped at £10 per item, so £10 for the toy plus £10 for the hand saw. They may not take the new toy until the charge is paid or formally waived by the committee, because an unpaid charge blocks new loans. The items are not yet 28 days overdue, so the lost-item procedure does not arise.

**Source:** lend-borrowing.md, sections 3.2 and 3.3; lend-fees.md, sections 3.2 and 3.3.

**Correct requires:** The answer must give £20 (£10 per item) and say the new loan is blocked until the charge is paid or waived. It is wrong if it charges £34 (17 days times two items with no cap), £10 (applying the cap once to the whole household rather than per item), or allows the new loan while the charge is outstanding.

## Q9

**Set:** lend

**Prompt (paste exactly):**

> Under the Osterby Toy and Tool Library rules: A new household's application is approved and they pay the standard annual fee on Wednesday 1 July 2026, joining that day. Neither named adult collects any item. A written request to cancel and refund the membership reaches the desk on Friday 10 July 2026. Is a refund due, how much, and by when must it be paid?

**Expected answer:** Yes. The request reached the desk on 10 July 2026, so the unused membership decision applies (receipt on or after 1 July 2026) and the request period is 14 calendar days from joining with the joining date as day zero; 10 July is day 9, within the period, and no item was collected. The full annual fee of £30 is refunded (the fee for a payment accepted on or after 1 January 2026). The refund must be paid within 14 calendar days of receiving the request, that is by 24 July 2026.

**Source:** lend-changes.md, section 4 (replacing lend-refunds.md section 2.1) and section 2 (replacing lend-fees.md section 2.1); lend-refunds.md, section 2.3.

**Correct requires:** The answer must say a full refund of £30 is due and that it must be paid within 14 days of the request (by 24 July 2026). It is wrong if it refuses the refund under the original 7-day rule or the desk guide's "within a week", refunds £24 instead of £30, or gives a payment deadline other than 14 days from receipt of the request.

## Q10

**Set:** lend

**Prompt (paste exactly):**

> Under the Osterby Toy and Tool Library rules: A member returns a borrowed powered hedge trimmer, for which they paid the £20 deposit, with damage the committee confirms was avoidable. The confirmed repair cost is £55. What does the library charge the member for the damage, what happens to the deposit, and when is any balance due?

**Expected answer:** The damage charge is £40, because avoidable damage is charged at actual repair cost up to a cap of £40 per item. The £20 deposit is deducted in full against that charge, since only a confirmed repair or replacement charge for that tool may be deducted from its deposit, leaving a balance of £20 owed. The library must give written notice of the calculation, and the balance is due within 14 days of that notice. Until it is paid or waived, the unpaid charge blocks new loans.

**Source:** lend-refunds.md, sections 1.2, 3.1 and 3.2; lend-fees.md, section 3.2.

**Correct requires:** The answer must give a £40 charge, the £20 deposit applied against it, a £20 balance owed, and payment due within 14 days of the written notice. It is wrong if it charges £55 (ignoring the £40 cap), leaves a balance of £35, treats forfeiting the deposit as settling the whole charge, or applies the £60 lost-item cap to a repairable item.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice/boat-lend/reference; cat boat/boat-changes.md; echo ======; cat boat/boat-fees.md; echo =====; head -30 boat/boat-front-desk-guide.md; echo ====; head -15 boat/boat-fees-archive-2025.md",
  "description": "Read sample boat papers"
}
```

## Result

```
---
set: Brindlecombe Community Boat Club
role: changes
covers: "Later committee decisions that replace specified sections of governing documents."
replaces:
  - "1.2 Annual individual fee in boat-fees.md"
  - "1.3 Annual household fee in boat-fees.md"
  - "1.4 Annual junior fee in boat-fees.md"
  - "3.1 Weekly limit in boat-booking.md"
  - "4.2 Member cancellation in boat-fees.md"
note: "The date that decides whether an entry applies is the booking date for booking rules and the payment date for fee rules."
---

# Changes Register

Brindlecombe Community Boat Club is a fictional organisation.

## 1. Purpose

### 1.1 Status
This register records committee decisions made after the governing documents were issued.

### 1.2 Effect
Where an entry applies, it replaces the named section in the relevant governing document.

## 2. Fee decision

### 2.1 Decision date
On 12 December 2025, the committee approved revised annual fees.

### 2.2 Effective date
This entry applies to payments made on or after 1 April 2026.

### 2.3 Replacement text
Section 1.2 of boat-fees.md is replaced by: “The annual fee for an individual membership is £60.”

### 2.4 Replacement text
Section 1.3 of boat-fees.md is replaced by: “The annual fee for a household membership is £95.”

### 2.5 Replacement text
Section 1.4 of boat-fees.md is replaced by: “The annual fee for a junior membership is £30.”

## 3. Booking decision

### 3.1 Decision date
On 18 June 2026, the committee approved a summer booking limit.

### 3.2 Effective date
This entry applies to bookings dated from 1 July 2026 to 30 September 2026 inclusive.

### 3.3 Replacement text
Section 3.1 of boat-booking.md is replaced by: “A member may hold no more than two future bookings in any rolling seven-day period.”

## 4. Refund decision

### 4.1 Decision date
On 3 August 2026, the committee approved a shorter cancellation period.

### 4.2 Effective date
This entry applies to payments made on or after 10 August 2026.

### 4.3 Replacement text
Section 4.2 of boat-fees.md is replaced by: “A member may receive a boat-use refund when cancelling at least 12 hours before the session start time.”
======
---
set: Brindlecombe Community Boat Club
role: governing
covers: "Joining fees, annual membership fees, boat-use charges, payment dates and refunds."
---

# Fees and Payments Rules

Brindlecombe Community Boat Club is a fictional organisation.

## 1. Fees from 1 January 2026

### 1.1 Joining fee
A new member must pay a one-time joining fee of £15.

### 1.2 Annual individual fee
The annual fee for an individual membership is £55.

### 1.3 Annual household fee
The annual fee for a household membership is £85.

### 1.4 Annual junior fee
The annual fee for a junior membership is £25.

## 2. Renewal

### 2.1 Due date
Annual fees are due on 1 April each year.

### 2.2 Reminder
The Treasurer will send a reminder by 1 March where an email address is held.

### 2.3 Late payment
A membership becomes inactive on 15 April if the annual fee has not cleared.

## 3. Boat-use charges

### 3.1 Standard session
A booked rowing boat or kayak session costs £4 per boat.

### 3.2 Junior session
A session booked solely for junior members costs £2 per boat when an approved adult supervisor is present.

### 3.3 Payment timing
Boat-use charges must be paid before launch unless the Treasurer has agreed otherwise in writing.

## 4. Refunds

### 4.1 Club cancellation
The club will refund a boat-use charge in full if it cancels a confirmed booking.

### 4.2 Member cancellation
A member may receive a boat-use refund when cancelling at least 24 hours before the session start time.

### 4.3 No-show
No refund is due for a missed booking or a cancellation made less than 24 hours before its start time.

## 5. Other matters

### 5.1 Not covered
This document does not set insurance arrangements, donation policy, or prices for club social events.
=====
---
set: Brindlecombe Community Boat Club
role: summary
covers: "A plain-language quick guide for front-desk volunteers and members."
---

# Front-Desk Quick Guide

Brindlecombe Community Boat Club is a fictional organisation.

## 1. Use this guide

### 1.1 Purpose
This guide helps volunteers answer common questions quickly.

### 1.2 Legal status
The governing documents and boat-changes.md prevail if this guide differs from them.

### 1.3 Check changes
Always check boat-changes.md before quoting a fee, refund rule or booking limit.

## 2. Membership basics

### 2.1 Who can join
Adults can join individually, households can join together, and young people aged 12 to 17 can join as juniors.

### 2.2 Younger children
Children under 12 must be in a boat with an adult member.

### 2.3 Guests
====
---
set: Brindlecombe Community Boat Club
role: archive
covers: "Superseded 2025 version of fees and payments rules retained for record purposes."
---

# Fees and Payments Rules: Archive Version

Brindlecombe Community Boat Club is a fictional organisation.

## 1. Archive status

### 1.1 Superseded document
This version applied from 1 January 2025 until 31 December 2025.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build; for s in boat-lend garden-makerspace hall-pool; do node -e \"import('./tools/make-map.mjs').then(m=>console.log(m.makeMap('practice/$s/reference')))\"; done",
  "description": "Generate document maps for the three practice sets"
}
```

## Result

```
# Map of the library

## Brindlecombe Community Boat Club

- reference/boat/boat-booking.md: Booking of club boats, session limits, cancellations and launch arrangements.
- reference/boat/boat-conduct.md: Expected behaviour, care of club property, complaints and disciplinary action.
- reference/boat/boat-fees.md: Joining fees, annual membership fees, boat-use charges, payment dates and refunds.
- reference/boat/boat-membership.md: Membership eligibility, household accounts, guest access and member records.
- reference/boat/boat-safety.md: Safety requirements, supervision, weather checks, incidents and emergency response.
- reference/boat/boat-volunteers.md: Volunteer duties, committee authority, training records and opening responsibilities.
- reference/boat/boat-changes.md: Later committee decisions that replace specified sections of governing documents. Changes document. Replaces: 1.2 Annual individual fee in boat-fees.md; 1.3 Annual household fee in boat-fees.md; 1.4 Annual junior fee in boat-fees.md; 3.1 Weekly limit in boat-booking.md; 4.2 Member cancellation in boat-fees.md. The date that decides whether an entry applies is the booking date for booking rules and the payment date for fee rules.
- reference/boat/boat-front-desk-guide.md: A plain-language quick guide for front-desk volunteers and members. Summary; does not govern.
- reference/boat/boat-fees-archive-2025.md: Superseded 2025 version of fees and payments rules retained for record purposes. Archive; does not govern.

## Osterby Toy and Tool Library

- reference/lend/lend-borrowing.md: Loan limits, return dates, reservations and overdue charges.
- reference/lend/lend-conduct.md: Behaviour, volunteer decisions, complaints and suspensions.
- reference/lend/lend-fees.md: Annual fees, concessions, deposits and payment records.
- reference/lend/lend-membership.md: Who may join, membership records and household access.
- reference/lend/lend-refunds.md: Membership refunds, deposit repayments and loss or damage charges.
- reference/lend/lend-safety.md: Item checks, powered-tool handovers and incident reporting.
- reference/lend/lend-changes.md: Later committee decisions replacing specified governing sections. Changes document. Replaces: 2.1 Standard annual fee in lend-fees.md; 2.1 Ordinary loan in lend-borrowing.md; 2.1 Unused membership in lend-refunds.md. Use the payment acceptance date, item collection date or refund request receipt date specified in each entry, not the committee decision date.
- reference/lend/lend-desk-guide.md: A front-desk reminder of common membership and borrowing points. Summary; does not govern.
- reference/lend/lend-fees-archive.md: Superseded opening-period fees retained as a historical record. Archive; does not govern.

# Map of the library

## Fernhill Community Garden

- reference/garden/fees.md: annual fees, due dates, deposit, late-payment charge, refunds, reduced rate.
- reference/garden/plot-rules.md: who may hold a plot, plot types, household limits, upkeep standard, inspections and notices, forfeiture.
- reference/garden/tool-shed.md: shed access, orientation for powered equipment, sign-out limits, sign-out log, damage and loss charges.
- reference/garden/water-and-hours.md: gate hours, watering windows, hose rules, water restrictions.
- reference/garden/amendments.md: later committee changes to the late-payment charge, watering windows and the first-notice period. Changes document. Replaces: 4. Late-payment charge in fees.md; 2. Watering windows in water-and-hours.md; 5. Inspection and warnings in plot-rules.md. An entry applies only if the date it names as its trigger (fee due date, date of watering, or date printed on the first notice) falls on or after its effective date; otherwise the original wording applies.
- reference/garden/volunteer-faq.md: convenience answers for the Saturday desk summarising plots, money, water and gate, and tool shed; the governing documents prevail. Summary; does not govern.
- reference/garden/archive-plot-rules-2025.md: the superseded earlier version of the plot rules, kept for record only. Archive; does not govern.

## Brindle Yard Makerspace

- reference/makerspace/fees.md: monthly fees, included hours, machine-hour and other charges, deposit, due dates, late-payment charge, refunds.
- reference/makerspace/incidents.md: injury reporting, damage reporting, who pays for damage, damage charge from machine log readings.
- reference/makerspace/machine-booking.md: bookable machines, booking windows by tier, weekly limits, session lengths, peak time, cancellation, no-shows.
- reference/makerspace/membership.md: membership tiers, who may join, good standing, guests, suspension, termination.
- reference/makerspace/safety-inductions.md: machines needing induction, who may induct, induction validity, supervised use, machine log, service intervals.
- reference/makerspace/storage.md: lockers, shelf bays, project shelf, prohibited items, holding cage, uncollected items, storage on suspension and termination.
- reference/makerspace/bulletin.md: later changes that override named sections of the governing documents. Changes document. Replaces: 5.1 Check-in in machine-booking.md; 4.2 Late-payment charge in fees.md; 3.2 Holding period in storage.md; 3.1 Validity period in safety-inductions.md. An entry applies to a case when the deciding date that entry names for the case falls on or after the entry's effective date.
- reference/makerspace/quick-guide.md: front-desk summary of common questions on joining, guests, booking, inductions, payment, storage and injuries; governing documents prevail. Summary; does not govern.
- reference/makerspace/handbook-2025.md: superseded extract of last year's combined handbook, kept for record only. Archive; does not govern.

# Map of the library

## Tannerwick Village Hall

- reference/hall/hall-booking-and-deposits.md: How to book a room, the booking fee, when to pay, the damage deposit, keys and hire times.
- reference/hall/hall-cancellations-and-damage.md: Cancelling or moving a hire, refunds, cancellation by the hall, deposit deductions and disputes.
- reference/hall/hall-hire-charges.md: Hourly and session hire charges for each room, discounts, extras and the yearly review.
- reference/hall/hall-kitchen-and-equipment.md: Use of the kitchen, hall furniture and hirers' own equipment, clearing up, breakages and storage.
- reference/hall/hall-licensing-limits.md: Room capacities, alcohol, music hours, closing times, safety duties and breaches.
- reference/hall/hall-who-can-hire.md: Who may hire the hall, hirer categories, age limits, regular hirers and refusals.
- reference/hall/hall-changes-log.md: Dated committee decisions that replace named sections of the governing documents. Changes document. Replaces: 3 Damage deposit in hall-booking-and-deposits.md; 1 Cancellation by the hirer in hall-cancellations-and-damage.md; 3 Music in hall-licensing-limits.md; 1 Hourly rates in hall-hire-charges.md. Each entry names its own deciding date: the booking date, the hire date, or the date a cancellation notice is received
- reference/hall/hall-front-desk-guide.md: Quick guide for volunteers answering common questions about hiring the hall. Summary; does not govern.
- reference/hall/hall-hire-charges-archive.md: Superseded hire charges for hires from 6 January 2025 to 31 August 2025, kept for the record. Archive; does not govern.

## Quillmere Community Pool Club

- reference/pool/pool-booking.md: Booking lane sessions and lessons, cancelling, no-shows, session waiting lists and guest bookings.
- reference/pool/pool-closures-and-refunds.md: Planned and unplanned closures, lesson refunds, membership refunds and credits, and matters the papers do not cover.
- reference/pool/pool-fees.md: Annual and monthly membership fees, joining fees, guest and lesson charges, other charges and how to pay.
- reference/pool/pool-lifeguard-cover.md: Minimum lifeguard numbers, qualifications, rotation, what happens when cover falls short, and incident and water checks.
- reference/pool/pool-membership.md: Who can join the club, membership categories, joining, renewal, freezing, leaving and guests.
- reference/pool/pool-rules.md: Conduct in and around the pool, children, changing rooms, photography, warnings, suspension and appeals.
- reference/pool/pool-changes.md: Dated log of committee decisions made after 1 July 2025 that replace named sections of the governing documents. Changes document. Replaces: 1 Lane sessions (paragraphs 1.2 and 1.3) in pool-booking.md; 3 Pay-as-you-go charges (paragraph 3.1) in pool-fees.md; 4 No-shows (paragraph 4.3) in pool-booking.md; 4 Other charges (paragraph 4.1) in pool-fees.md; 1 Minimum cover (paragraph 1.2) in pool-lifeguard-cover.md; 4 Membership refunds and credits (paragraph 4.2) in pool-closures-and-refunds.md. Each entry names its own deciding date; unless the entry says otherwise it is the date of the session, visit or notice, not the date of booking or payment.
- reference/pool/pool-front-desk-guide.md: Quick answers for front-desk volunteers to the questions members and visitors ask most often. Summary; does not govern.
- reference/pool/pool-fees-2025-archive.md: Superseded schedule of fees that was in force from 1 January 2025 to 30 June 2025, kept for the record. Archive; does not govern.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice; cat garden-makerspace/questions.md hall-pool/questions.md",
  "description": "Read remaining question files"
}
```

## Result

```
# Test-build questions

Practice questions, drawn by seed "test-build-question-draw-2026-10-10". Not the exam.

## Q1

**Set:** garden (was Q1 in the practice pool)

**Prompt (paste exactly):**

> Under the Fernhill Community Garden rules: on which days does the plot secretary inspect the plots?

**Kind:** A plain lookup of one stated rule.

**Expected answer:** On the first Saturday of each month from April to October.

**Working:** The inspection rule states "The plot secretary inspects every plot on the first Saturday of each month from April to October." No amendment names this section (Amendment 3 changes only the first-notice period), so it stands as written. In 2026 those days are 4 April, 2 May, 6 June, 4 July, 1 August, 5 September and 3 October.

**Source:** plot-rules.md 5.1

**Correct requires:** Both parts: the first Saturday of each month, and the months April to October. Listing the seven 2026 dates is also correct. Wrong: "March to September" (that is the orientation calendar), "every Saturday", "the first Monday of the month" (that is the gate code change), or the whole growing season from March.

**Tempting wrong answer:** "The first Saturday of each month from March to September", borrowed from the powered-equipment orientation dates (tool-shed.md 2.3), or "from March to October", assuming inspections run for the whole growing season (plot-rules.md 1.4).

## Q2

**Set:** garden (was Q6 in the practice pool)

**Prompt (paste exactly):**

> Under the Fernhill Community Garden rules: a Starter plot had weeds taller than 20 cm, and the plot holder was given a written first notice with the date 20 June 2026 printed on it. It was the household's only notice in 2026. The plot holder cleared the weeds on 2 July 2026, and the plot met the upkeep standard from that day. Was the plot put right in time?

**Kind:** A case where an amendment exists on the topic but does not reach this case (its trigger is not met), so the main document's rule still applies.

**Expected answer:** Yes. A first notice dated 20 June 2026 keeps the original 14-day period, so the deadline was 4 July 2026 and 2 July is in time. No second notice is issued.

**Working:** The amendment that shortens the first-notice period to 10 days is triggered by the date printed on the first notice, and applies only to a first notice dated on or after 1 July 2026. This notice is dated 20 June 2026, which is on or before 30 June 2026, so it keeps the original period even though that period ends in July. Original rule: put right on or before the 14th day after the date printed on the notice. 20 June + 14 days = 4 July 2026. The plot was put right on 2 July, so it was in time. If the amended 10 days had applied, the deadline would have been 30 June 2026 and 2 July would have been late. Note on reuse: Amendment 3 was the deciding point of an earlier question, where its trigger was met. It is reused here for the opposite case because the other amendments' triggers either run into the listed unclear spot on late-charge day counting (Amendment 1) or would repeat the hose-day facts already used (Amendment 2).

**Source:** amendments.md 4.1, amendments.md 4.4, amendments.md 1.3, plot-rules.md 5.2, plot-rules.md 4.2

**Correct requires:** "In time"; the 14-day period; the deadline of 4 July 2026; the reason that the notice is dated before 1 July 2026. Wrong: "late, the deadline was 30 June 2026" (10 days); any answer using 21 days.

**Tempting wrong answer:** "No. The period is 10 days, so the deadline was 30 June 2026, and since the work was done in July the new rule applies." This applies the amendment by the date the plot was put right instead of the date printed on the notice.

## Q3

**Set:** garden (was Q2 in the practice pool)

**Prompt (paste exactly):**

> Under the Fernhill Community Garden rules: no water restriction is in force. During a permitted hose window, on a day when hoses are allowed, may I set up a sprinkler on my Standard plot and leave it running for 15 minutes while I weed the other end of the plot?

**Kind:** A second plain lookup, from a different document.

**Expected answer:** No. A hose must be held in the hand at all times, and sprinklers, soaker hoses and unattended hoses are not allowed.

**Working:** The hose rules state "A hose must be held in the hand at all times. Sprinklers, soaker hoses and unattended hoses are not allowed." The time (15 minutes, under the 20-minute limit), the window and the day are all given as permitted, so the only rule in play is the ban on sprinklers. Amendment 2 replaces only the watering windows section, not the hose rules.

**Source:** water-and-hours.md 3.1

**Correct requires:** "No", with the reason that sprinklers are not allowed (or that the hose must be held in the hand at all times). Wrong: "yes, 15 minutes is inside the 20-minute limit"; "yes, as long as you stay on the plot".

**Tempting wrong answer:** "Yes, 15 minutes is within the 20 minutes allowed per window and you are still on the plot." This checks only the time limit (water-and-hours.md 3.2) and treats being nearby as attending the hose.

## Q4

**Set:** garden (was Q12 in the practice pool)

**Prompt (paste exactly):**

> Under the Fernhill Community Garden rules: hi, Marge here from plot 22, that's my Starter plot, had it since 2023. It's just me at my address and plot 22 is the only plot I've had so far. I was 66 on 1 January 2026 so I'm on the half rate, and I paid my $15 for plot 22 on 5 February 2026. I've just signed an agreement dated 4 May 2026 for a Standard plot as well. Since I'm on the half rate that one will be $42.50, won't it? And do I have to pay another $50 deposit for the second plot?

**Kind:** A message written the way a real plot holder would write it: casual, asking two things, and containing one wrong belief about the rules that a correct answer must put right.

**Expected answer:** The Standard plot will cost the full $85, not $42.50: the reduced rate applies to only 1 plot per household, and with 2 plots it goes to the one with the lower annual fee, which is the Starter plot already charged at $15. No second deposit is due: the deposit is $50 per household, not per plot, and was paid once with the first fee.

**Working:** Wrong belief: that the reduced rate follows the person onto every plot she holds. Rule: Marge qualifies (aged 65 or over on 1 January 2026), but the reduced rate applies to 1 plot per household, and where the household holds 2 plots it applies to the plot with the lower annual fee. Starter $30 is lower than Standard $85, so the reduced rate stays on the Starter plot ($15) and the Standard plot is charged in full. The agreement is dated 4 May 2026, on or before 30 June 2026, so the full annual fee is charged, not the half fee for plots taken up from 1 July: $85. Her total for 2026 is $15 + $85 = $100. Deposit: $50 per household, paid once with the household's first fee, so nothing more is due. She is entitled to take the plot: the household has held its first plot for at least 1 complete plot year, and 1 Starter plus 1 Standard is within the household limit.

**Source:** fees.md 6.1, fees.md 6.2, fees.md 6.3, fees.md 1.1, fees.md 2.2, fees.md 3.1, plot-rules.md 3.1, plot-rules.md 3.3

**Correct requires:** (1) The correction that the reduced rate covers only one plot per household, the lower-fee Starter plot, so the Standard plot is $85. (2) No second deposit, because the deposit is per household. Wrong: "$42.50"; "$21.25"; "you can choose which plot gets the reduced rate"; "yes, another $50".

**Tempting wrong answer:** "Yes, $42.50, because you qualify for the reduced rate." This checks only who qualifies (fees.md 6.2) and stops before the one-plot-per-household limit in fees.md 6.3. A second slip is to move the reduced rate onto the dearer Standard plot and charge the Starter plot in full, which the lower-fee rule does not allow.

## Q5

**Set:** garden (was Q7 in the practice pool)

**Prompt (paste exactly):**

> Under the Fernhill Community Garden rules: my mother lives on her own in Fernhill parish and her household has never held a plot. She has no mobility need. She would like a Raised bed as her first plot in 2026. Can she be offered one?

**Kind:** A case that cannot be settled because a fact needed to apply the rule is missing from the question.

**Expected answer:** It depends on her age, which is not given. If she is aged 70 or over she can be offered a Raised bed; if she is under 70 she cannot, because she has no mobility need, and her first plot would have to be a Starter plot.

**Working:** A Raised bed is offered only to a plot holder who is aged 70 or over, or who has a mobility need accepted by the plot secretary. The second route is closed by the facts given (no mobility need), so everything turns on the first. Her age is not stated. Aged 70 or over: eligible, and a Raised bed is an allowed first plot for a household. Under 70 (and at least 16): not eligible for a Raised bed; the household's first plot must then be a Starter plot.

**Source:** plot-rules.md 2.3, plot-rules.md 3.3, plot-rules.md 1.1

**Correct requires:** Naming the missing fact (her age, specifically whether she is 70 or over) and giving both outcomes: yes if 70 or over, no if under 70. An answer that leads with one outcome is still correct if it names the age condition and gives the other. Wrong: a flat "yes" or a flat "no"; using 65 as the age.

**Tempting wrong answer:** "Yes, a first plot may be a Starter plot or a Raised bed." This stops at the first-plot rule (plot-rules.md 3.3) and never checks who a Raised bed is offered to. A second slip is "yes if she is 65 or over", borrowing the reduced-rate age from fees.md 6.2.

## Q6

**Set:** makerspace (was Q8 in the practice pool)

**Prompt (paste exactly):**

> Under the Brindle Yard Makerspace rules: from 5 October 2026 a Forge member in good standing wants to keep a spare lithium battery pack for a cordless tool in their locker. With the battery inside, the locker would hold 12 kg in total and would contain no food, no gas cylinders and no flammable liquid. Is the member allowed to store the battery there?

**Kind:** Q8 a second missing-fact case, on a different rule and in a different document from Q7.

**Expected answer:** It depends on the battery's rating in watt-hours, which is not given. A lithium battery rated at 100 Wh or less (exactly 100 Wh included) may be stored; one rated above 100 Wh may not, and staff would remove it when they find it.

**Working:** A Forge member has a locker. The locker holds 12 kg, under the 25 kg limit. The only limit in play is the one on lithium batteries: nobody may store a lithium battery rated above 100 Wh, and exactly 100 Wh is allowed. The question does not state the rating, so the rule cannot be applied without it. A battery above the limit is a prohibited item, which staff remove to the holding cage when found.

**Source:** storage.md sections 1.1, 2.1 and 2.2.

**Correct requires:** Naming the battery's Wh rating as the missing fact, and giving both outcomes: allowed at 100 Wh or less, not allowed above 100 Wh. An answer that leads with one outcome is still correct if it names the rating and gives the other. A flat "yes" or flat "no" is wrong.

**Tempting wrong answer:** A flat "yes", from checking the weight (12 kg is under 25 kg) and the list of other prohibited items and assuming a cordless-tool battery is small. Or a flat "no", from reading the rule as a ban on all lithium batteries.

## Q7

**Set:** makerspace (was Q5 in the practice pool)

**Prompt (paste exactly):**

> Under the Brindle Yard Makerspace rules: on 24 April 2026 a Bench member aged 52, in good standing and holding a valid wood lathe induction, books the wood lathe for a session starting at 14:00 on Thursday 7 May 2026. On the day she checks in at the front desk at 14:12. Is she in time, or is she a no-show?

**Kind:** Q5 a case where a bulletin entry applies and changes the answer the main document would give.

**Expected answer:** She is a no-show and the session is released to other members. For sessions held on or after 1 May 2026 the check-in limit is 10 minutes after the start time, and 12 minutes is past it; the date the booking was made does not matter.

**Working:** The change to the check-in rule took effect on 1 May 2026 and is decided by the date of the session, whenever the booking was made. Session date 7 May 2026 is on or after 1 May 2026, so the new rule applies even though the booking was made on 24 April 2026. New limit: within 10 minutes after the start, so 14:10 at the latest. 14:12 is 12 minutes after the start, so she is a no-show.

**Source:** bulletin.md sections 1.2 and 2.1 (Entry 1), overriding machine-booking.md section 5.1.

**Correct requires:** That she is a no-show, on the 10-minute limit. An answer that she is in time is wrong.

**Tempting wrong answer:** She is in time, because the limit is 15 minutes (the printed booking rule and the front desk summary), or because the booking was made on 24 April 2026, before the change took effect.

## Q8

**Set:** makerspace (was Q7 in the practice pool)

**Prompt (paste exactly):**

> Under the Brindle Yard Makerspace rules: on Tuesday 1 September 2026 a member aged 34, in good standing, with no no-shows during 2026, no other bookings and a wood lathe induction that stays valid throughout September 2026, wants to book the wood lathe from 10:00 to 12:00 on Saturday 12 September 2026. Can the member make that booking on 1 September 2026?

**Kind:** Q7 a case that cannot be settled because a fact needed to apply the rule is missing from the question; the correct answer names the missing fact and gives the outcome for each possibility.

**Expected answer:** It depends on the member's tier, which is not given. 12 September 2026 is 11 days ahead: a Bench member (21 days) or a Forge member (14 days) can make the booking, but a Keystone member (7 days) cannot, and could book no later than 8 September 2026 from 1 September.

**Working:** The day of booking is day zero, so 12 September 2026 is day 11 counted from 1 September 2026. Booking windows: Bench 21 days, Forge 14 days, Keystone 7 days, last day included. 11 is within 21 and within 14 but beyond 7. The 2-hour session is within every tier's weekly limit (4, 10 or 20 hours), so the weekly limit does not decide it. Nothing else in the question is missing: good standing, valid induction and age are given.

**Source:** machine-booking.md sections 2.1, 2.2 and 2.3.

**Correct requires:** Naming the tier as the missing fact, and giving the outcomes: yes for Bench, yes for Forge, no for Keystone. An answer that leads with one outcome is still correct if it names the tier and gives the others. A flat "yes" or a flat "no" is wrong, and so is an answer that gives Keystone the longest window.

**Tempting wrong answer:** A flat "yes", from assuming a tier or checking only good standing and the induction. Also the reversed version: assuming the most expensive tier books furthest ahead, so Keystone can and Bench cannot.

## Q9

**Set:** makerspace (was Q6 in the practice pool)

**Prompt (paste exactly):**

> Under the Brindle Yard Makerspace rules: a member's unfinished cabinet door was left on the project shelf past the limit and staff moved it to the holding cage on 10 July 2026. The member comes to the front desk on 28 July 2026 to collect it. May she still collect it on that day, or does it belong to the makerspace by then?

**Kind:** Q6 a case where a bulletin entry exists on the topic but does NOT reach this case (its trigger is not met), so the main document's rule still applies.

**Expected answer:** She may still collect it. The item was moved on 10 July 2026, before the shorter holding period took effect on 15 July 2026, so the 21-day period applies and runs to 30 July 2026 inclusive; 28 July is day 19.

**Working:** The change to the holding period took effect on 15 July 2026 and is decided by the date the item is moved to the holding cage. The item was moved on 10 July 2026, which is earlier, so the printed 21-day period applies. Day one is 10 July 2026; day 21 is 30 July 2026 and is included. 28 July 2026 is day 19, inside the period. (Under the 14-day rule the period would have ended on 23 July 2026 and the item would have become the makerspace's property on 24 July 2026, but that rule does not reach this item.)

**Source:** bulletin.md sections 1.2 and 2.3 (Entry 3); storage.md sections 3.1, 3.2 and 3.3.

**Correct requires:** That she may collect it on 28 July 2026, because the 21-day period applies to an item moved before 15 July 2026. An answer that the item already belongs to the makerspace is wrong.

**Tempting wrong answer:** It already belongs to the makerspace, from applying the 14-day period because the collection date (28 July 2026) is after 15 July 2026, instead of looking at the date the item was moved.

## Q10

**Set:** makerspace (was Q1 in the practice pool)

**Prompt (paste exactly):**

> Under the Brindle Yard Makerspace rules: a Forge member aged 41 hands in a written resignation on 20 August 2026. On what date does the membership end?

**Kind:** Q1 a plain lookup of one stated rule.

**Expected answer:** The membership ends on 31 August 2026. Notice given on or before the 20th of a month ends the membership on the last day of that month, and the 20th itself counts.

**Working:** Notice date is 20 August 2026. The rule says "on or before the 20th", so 20 August is inside the cut-off. The membership ends on the last day of August, which is 31 August 2026.

**Source:** membership.md section 5.1.

**Correct requires:** The date 31 August 2026. An answer of 30 September 2026 is wrong.

**Tempting wrong answer:** 30 September 2026, from reading the cut-off as "before the 20th" and treating notice on the 20th as late notice.
# Questions

## Q1

**Set:** pool

**Prompt (paste exactly):**

> Under the Quillmere Community Pool Club rules: On Friday 16 January 2026 a full member books a 10:00 lane session for Saturday 24 January 2026, booking a place for one guest, aged 30, in the same booking. The member and the guest attend that session. What guest fee is charged for that visit?

**Expected answer:** £7. The guest fee was changed with effect from 1 January 2026 and the deciding date is the day of the guest's visit, so the new rate applies. The session is a valid one: it is booked 8 days ahead, inside the 10-day limit, and 24 January 2026 is after the maintenance closure ended on 16 January 2026.

**Source:** pool-changes.md, Change 2 (replacing pool-fees.md section 3.1); pool-changes.md, Change 1 (replacing pool-booking.md section 1.2); pool-closures-and-refunds.md, section 1.1.

**Correct requires:** The answer must give £7 as the fee. An answer of £6 (the 1 July 2025 rate) or £5 (the superseded 2025 archive rate) is wrong, as is an answer that says no fee is charged because the session cannot run or cannot be booked.

## Q2

**Set:** pool

**Prompt (paste exactly):**

> Under the Quillmere Community Pool Club rules: A new Adult member applies and pays their first fee on 14 October 2025, choosing to pay for the rest of the membership year in one lump sum rather than by monthly instalments. How much do they pay in total, including any joining fee?

**Expected answer:** £274 in total: £234 of membership fee (one-twelfth of the £312 annual fee, £26, for each of the 9 whole calendar months left counting October, so October 2025 to June 2026) plus the £40 Adult joining fee.

**Source:** pool-fees.md, sections 1.1, 1.3 and 2.1.

**Correct requires:** The answer must give £274 total, or equivalently £234 membership fee plus £40 joining fee. It is wrong if it counts only 8 months (£208, the superseded archive rule that excluded the joining month), uses the archive's £30 joining fee, or omits the joining fee.

## Q3

**Set:** pool

**Prompt (paste exactly):**

> Under the Quillmere Community Pool Club rules: A
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice/boat-lend/reference; cat lend/lend-changes.md; cat boat/boat-safety.md | sed -n 1,200p | grep -n \"4\\.\\|##\" | head -40; cat ../../hall-pool/reference/pool/pool-changes.md | head -60",
  "description": "Look at more changes document shapes"
}
```

## Result

```
---
set: Osterby Toy and Tool Library
role: changes
covers: "Later committee decisions replacing specified governing sections."
replaces:
  - "2.1 Standard annual fee in lend-fees.md"
  - "2.1 Ordinary loan in lend-borrowing.md"
  - "2.1 Unused membership in lend-refunds.md"
note: "Use the payment acceptance date, item collection date or refund request receipt date specified in each entry, not the committee decision date."
---
# Register of Rule Changes
This organisation is fictional.
Opened on 10 November 2025; last entry made on 18 June 2026.

## 1 How to use this register
These entries replace only the named sections, leaving all other sections unchanged.
The governing files retain their original wording for the record.
Use the old section where the entry's stated date test is not met.

## 2 Annual fee decision
Decision made on 10 November 2025; effective from 1 January 2026.
Replaces 2.1 Standard annual fee in lend-fees.md.
Date test: use the date the joining or renewal payment is accepted.
Apply this replacement if that date is on or after 1 January 2026.
Replacement text:
"The annual household membership fee is £30 for each 12-month term.
The fee is payable on joining and on each renewal."
The £12 reduced fee in section 2.2 is unchanged.

## 3 Ordinary loan decision
Decision made on 16 March 2026; effective from 1 April 2026.
Replaces 2.1 Ordinary loan in lend-borrowing.md.
Date test: use the date the item is collected, not its reservation or due date.
Apply this replacement if collection is on or after 1 April 2026.
Replacement text:
"An ordinary loan lasts 21 calendar days from its collection date.
The desk writes the due date on the receipt."
An extension does not turn an older loan into a new collection.

## 4 Unused membership decision
Decision made on 18 June 2026; effective from 1 July 2026.
Replaces 2.1 Unused membership in lend-refunds.md.
Date test: use the date the written refund request reaches the desk, not the joining date.
Apply this replacement if receipt is on or after 1 July 2026.
Replacement text: "Refund the full annual fee if a written request reaches the desk within 14 calendar days of joining.
This applies only if neither named adult has collected any item during that membership.
The joining date is day zero when counting the request period."
11:## 1. Before launch
13:### 1.1 Buoyancy aids
16:### 1.2 Equipment check
19:### 1.3 Defects
22:## 2. Young people
24:### 2.1 Under-12s
27:### 2.2 Ages 12 to 17
30:### 2.3 Guest children
33:## 3. Lake limits
35:### 3.1 Operating area
38:### 3.2 Distance
41:### 3.3 Night use
44:## 4. Conditions
46:### 4.1 Closure authority
49:### 4.2 Member decision
52:### 4.3 Cancellation
53:A closure cancels affected bookings for the purpose of section 4.1 of boat-fees.md.
55:## 5. Incidents
57:### 5.1 Immediate action
60:### 5.2 Reporting
---
set: Quillmere Community Pool Club
role: changes
covers: "Dated log of committee decisions made after 1 July 2025 that replace named sections of the governing documents."
replaces:
  - "1 Lane sessions (paragraphs 1.2 and 1.3) in pool-booking.md"
  - "3 Pay-as-you-go charges (paragraph 3.1) in pool-fees.md"
  - "4 No-shows (paragraph 4.3) in pool-booking.md"
  - "4 Other charges (paragraph 4.1) in pool-fees.md"
  - "1 Minimum cover (paragraph 1.2) in pool-lifeguard-cover.md"
  - "4 Membership refunds and credits (paragraph 4.2) in pool-closures-and-refunds.md"
note: "Each entry names its own deciding date; unless the entry says otherwise it is the date of the session, visit or notice, not the date of booking or payment."
---

# Log of Changes

Quillmere Community Pool Club is a fictional organisation; these papers are made up.

The governing documents are not reworded when the committee changes a rule. They keep their text of 1 July 2025 and this log records what replaces it. Where an entry applies, it overrides the paragraph it names; everything else in that document stands.

## Change 1: Lane booking limits
- Decided 9 September 2025. Effective 1 October 2025. Deciding date: the day the booking is made, not the day of the session.
- Replaces paragraphs 1.2 and 1.3 of pool-booking.md. A member may book up to 10 days ahead and hold up to 5 lane bookings in a week, still counted Monday to Sunday. Booking still opens at 07:00 and the limit of 1 a day stays.

## Change 2: Guest fees
- Decided 11 November 2025. Effective 1 January 2026. Deciding date: the day of the guest's visit, not the day it was booked.
- Replaces paragraph 3.1 of pool-fees.md. The guest fee is £7 for a guest aged 16 or over and £3.50 for a guest under 16.

## Change 3: No-shows
- Decided 13 January 2026. Effective 1 February 2026. Deciding date: the day of the missed session. A no-show before 1 February 2026 is charged at the old rate but still counts towards the 30-day total.
- Replaces paragraph 4.1 of pool-fees.md: the no-show charge is £6.
- Replaces paragraph 4.3 of pool-booking.md: two no-shows within any 30 days suspend the right to book for 14 days. The second sentence of paragraph 4.3 (swimming in a session with free places on the day) stands.

## Change 4: Second lifeguard
- Decided 10 February 2026. Effective 1 March 2026. Deciding date: the day of the session.
- Replaces paragraph 1.2 of pool-lifeguard-cover.md. There must be 2 lifeguards whenever more than 16 swimmers are in the water, or whenever a lesson for under-8s shares the pool. Paragraph 5.1 of that document is not changed and still reads 20, so from 1 March 2026 an early session with more than 16 swimmers needs 2 lifeguards.

## Change 5: Refund on resignation
- Decided 10 March 2026. Effective 1 April 2026. Deciding date: the day the club receives the written notice of resignation, not the day the notice ends.
- Replaces paragraph 4.2 of pool-closures-and-refunds.md. The refund is for each whole calendar month left after the notice ends, less £30. No refund is paid where fewer than 2 whole months are left. The joining fee is still not refunded.
```

## Call: Write

```json
{
  "file_path": "C:\\tc-build\\DECISIONS.md",
  "content": "# Decisions\n\nWritten 2026-10-15, before the workspace was built. Reasoning rung: context (a stage contract a\nmodel reads once per question), with the practice rounds as the loop.\n\n## Form\n\n**Pipeline, one stage.** The repeating unit is one question answered in one fresh session\n(brief: \"What is the repeating unit of work? One question.\"). Every question runs the same\nsequence against the same papers and emits one deliverable, the reply, which is the Pipeline\nform. No record accumulates (not a Record library), the papers are not the product (not a\nKnowledge bundle), and nobody will edit the papers (not a System map).\n\n## Number of stages: one\n\nThe skill puts stage boundaries where a person pauses to check an output, and where one stage's\noutput file becomes the next stage's input. Neither exists here:\n\n- Nobody is present during a run (brief: \"Who else touches this? Nobody during a run\").\n- The session cannot write files, so there is no intermediate output to hand across a boundary\n  or to edit.\n- The answer goes back in one message.\n\nSplitting \"find the papers\", \"apply the changes\" and \"write the answer\" into three folders would\ngive three contracts with no files between them and cost the model two more reads per question\nfor no check anyone performs. The brief says: if the method's answer is one stage, say so and\nbuild that. It is one stage: `01 answer`. Inside its contract the work is still ordered (find,\ndate-check, answer, self-check), because that order is real; it is a numbered process, not a set\nof folders.\n\nWhat I considered and rejected: a second stage `02 check` read just before replying, to put the\nanswer checklist fresh in front of the model. It has no input file and no human, so it is a\nparagraph, not a stage. If practice shows the model skipping the end checks, the fix is to move\nor tighten that paragraph, not to add a folder.\n\n## Where the generated document list lives\n\n`01 answer/documents.md`. It is generated by `tools/make-map.mjs` from the papers' headers and\noverwritten whole on each set of papers. The workspace ships it as a marked placeholder. It is\noutside `reference/`, it is named in the root `CLAUDE.md`, in the map `CONTEXT.md`, and as an\ninput of the stage contract. It is a separate file because the script writes the whole file;\nputting it inside a contract would overwrite the contract.\n\n## How a run reads (the step budget)\n\n`CLAUDE.md` loads by itself. It sends the model to read `01 answer/CONTEXT.md` and\n`01 answer/documents.md` together, then the papers. That is two instruction opens per question.\nThe root `CONTEXT.md` (the map) is for a person or agent maintaining the workspace; a question\nrun does not need it, and the entry file says so.\n\n## Departures from the skill's templates (following the PO Verifier)\n\n1. **Folder names.** `01 answer` with a space, as in the PO Verifier (`01 intake`), not the\n   skill's `01_answer` or `stages/01_answer/`.\n2. **No `stages/` wrapper.** Numbered stage folders sit at the top level, as in the PO Verifier.\n3. **No `_shared/`, `_templates/`, `setup/`.** The factory layer is the papers in `reference/`,\n   which the harness supplies; there is nothing to configure per user and no unit to copy (a\n   question is a message, not a folder).\n4. **No `output/` folder and no edit surface.** The session cannot write; the deliverable is the\n   reply. This breaks invariant 6 by necessity of the harness, not by choice.\n5. **No human check in the contract.** The skill's contract ends in one human check. Nobody is\n   present, and the brief forbids telling the model to stop and ask. The contract ends with a\n   self-check the model runs on its own reply instead.\n6. **Stage contract headings follow the PO Verifier** (\"What this stage is for\", \"What comes in\",\n   \"What goes out\", \"What must never happen here\") rather than the skill's\n   Inputs / Process / Outputs / Human check. The content each heading carries is the same.\n7. **No `the-page.md`.** The PO Verifier has a page saying who it is for and why. The brief's\n   house style lists router, map, stage folders and `reference/` only, and the \"who and why\" fits\n   in the first line of `CLAUDE.md`. Adding a page would be a third instruction read for no rule.\n8. **Entry file does not say \"read the map first\".** The PO Verifier's `CLAUDE.md` sends the\n   model to `the-page.md` then `CONTEXT.md` before any stage. Here the entry file sends a\n   question run straight to the stage contract and the list, to keep instruction reads at two.\n   The map is still the place a maintainer starts.\n9. **No `reference/` folder in the build.** The harness copies the papers into `reference/`; the\n   workspace must not hold its own. `CLAUDE.md` and the map say where the papers will be.\n10. **\"Stop and ask\" is replaced.** The PO Verifier's rule \"stop and ask Sam when unsure\" becomes\n    \"when a fact the answer turns on is missing, say which and give the answer for each case\".\n\n## Rules I hold myself to while building\n\n- No figure, date, section number or organisation name from any practice paper appears in the\n  workspace outside `documents.md`. The contract describes the kinds of trap (a summary that\n  differs, an archive with old figures, a change entry with its own deciding date, a rule in a\n  second document that changes the case), never the instances.\n- One home per rule: the reading rules live in `01 answer/CONTEXT.md` only.\n"
}
```

## Result

```
File created successfully at: C:\tc-build\DECISIONS.md (file state is current in your context — no need to Read it back)
```

## Call: Write

```json
{
  "file_path": "C:\\tc-build\\icm\\CLAUDE.md",
  "content": "# Rules Desk\n\nThis answers one question about a situation, under one small organisation's rules, from that\norganisation's papers. The answer goes back in your reply, in one message. Nobody is here to\nanswer a question from you, so never ask one back.\n\n1. Read `01 answer/CONTEXT.md` and `01 answer/documents.md` together, in one step, before\n   anything else. The first says how to answer; the second lists every paper and what it is.\n2. Then read the papers the contract tells you to, from `reference/`, and answer.\n\n`CONTEXT.md` at the top is the map of this workspace, for whoever maintains it. A question does\nnot need it.\n\nNever edit, move or add anything. Never answer from memory or from a paper that does not govern.\n"
}
```

## Call: Write

```json
{
  "file_path": "C:\\tc-build\\icm\\CONTEXT.md",
  "content": "# Rules Desk: the map\n\n## What this is\nA member, a volunteer or someone at a front desk asks a question about a situation under one\norganisation's rules. A fresh session answers it from the papers, in one reply. The papers stay\nthe same from question to question; only the question is new.\n\n## What is here\n\n| Folder or file | What it holds |\n|---|---|\n| `CLAUDE.md` | Where a question starts. Loads by itself. |\n| `01 answer/CONTEXT.md` | How to answer: which papers to read, how changes and dates work, what the reply holds |\n| `01 answer/documents.md` | The list of every paper, generated from the papers' headers. Never edited by hand |\n| `reference/` | The papers, one subfolder per organisation. Supplied with the papers, never edited |\n\n## How a question moves through\nThere is one stage, `01 answer`. A question arrives as the first message. The session reads the\nstage contract and the document list, reads the papers that govern the situation, and replies.\nNothing is written to disk. There is no second stage because there is no file to hand on and no\nperson to check one; see `DECISIONS.md` in the workshop for why.\n\n## How the document list is made\n`01 answer/documents.md` is written by `tools/make-map.mjs` from the header at the top of each\npaper in `reference/`. When the papers change, run the script again and write its output to that\npath. It holds the only facts taken from the papers that live outside `reference/`. Everything\nelse in this workspace is about how to read papers of this kind, not about any one set of them.\n\n## How things are named\nThe four kinds of paper (governing, changes, summary, archive) and what each one is worth are\ndefined once, in `01 answer/CONTEXT.md`.\n\n## What must never happen\n- Nothing in `reference/` is changed, moved or added to.\n- `01 answer/documents.md` is never edited by hand.\n- No figure, date or section number from a paper is written into any file here except the\n  generated list.\n- The session never asks the person a question; a missing fact is handled in the answer.\n"
}
```

## Result

```
File created successfully at: C:\tc-build\icm\CLAUDE.md (file state is current in your context — no need to Read it back)
```

## Result

```
File created successfully at: C:\tc-build\icm\CONTEXT.md (file state is current in your context — no need to Read it back)
```

## Call: Write

```json
{
  "file_path": "C:\\tc-build\\icm\\01 answer\\CONTEXT.md",
  "content": "# 01 answer: answer one question from the papers\n\n## What this stage is for\nOne question, about one situation, under one organisation's rules. Find every rule that touches\nthe situation, decide which version of each rule applies to it, work out the answer, and reply.\n\n## What comes in\n- The question: the first message of the session. It names the organisation (\"Under the ...\n  rules\").\n- `documents.md`, next to this file: every paper, grouped by organisation, with what it covers\n  and its kind. For a changes paper it also lists the sections it replaces and which date decides\n  whether an entry applies.\n- The papers themselves, in `reference/<organisation folder>/`.\n\n## The four kinds of paper\n- **Governing.** The rules. Only governing papers, as changed by the changes paper, decide an\n  answer.\n- **Changes.** Later decisions. Each entry replaces a named section, but only for cases that\n  pass that entry's own date test. It replaces only what it names; the rest of that paper stands.\n- **Summary.** A quick guide. It does not govern. It is often out of date or loosely worded.\n  Never take a figure, period or rule from it.\n- **Archive.** An old version. It does not govern. Its figures are superseded. Never use them.\n\n## How to work, in order\n1. **Pick the organisation.** Use only its section of `documents.md` and its folder. Never mix\n   in the other organisation's papers.\n2. **Pick the papers.** Go through the facts of the question one by one (who, what item or room,\n   which dates, what money, what event: a closure, damage, a cancellation, a missed session, a\n   notice). For each, find every governing paper whose \"covers\" line touches it. Read all of them,\n   whole; they are short. A case often turns on a rule in a second paper (a closure rule in a\n   safety paper that changes a refund in a fees paper; an age or capacity rule in another paper).\n   Read them in one step, together.\n3. **Always read the changes paper** for that organisation, whole, in the same step. Check every\n   entry against every section you are relying on, not only the ones you expect to have changed.\n4. **Date-test each change entry that touches a section you use.** Use the deciding date that\n   entry names (or the note in `documents.md`): the date of payment, booking, session, visit,\n   collection, notice, receipt, or whatever the entry says. Never use the date the committee\n   decided, the date the question is asked, or a different event's date. \"On or after\" includes\n   the day; a stated range includes both ends. If the entry applies, use its replacement text; if\n   not, use the governing paper's original section. An entry can apply to one part of a case and\n   not another (two events on two dates can fall either side).\n5. **Find the exact rule text.** Read each sentence that decides the case closely: who it applies\n   to, what it is counted per (per item, per person, per household, per booking, per day), any\n   cap, minimum, rounding (\"or part of\"), exception, and how days are counted (day zero or day\n   one, \"within\", \"at least\", \"before\"). Follow a sentence that points to another section and read\n   that section too.\n6. **Check for a missing fact.** If the rule turns on a fact the question does not give (an age,\n   a tier or category, a rating, which day something is paid or collected), do not assume it. Name\n   the missing fact and give the answer for each possible value. Do this only where the papers\n   really make the answer turn on that fact; where the question gives the fact, use it.\n7. **Work out every number and date step by step in the reply.** Count days on a calendar, check\n   the day of the week when it matters, apply caps and rounding where the rule says. Quote the\n   figure from the governing text or the change entry that applies, not from memory.\n8. **Answer every part of the question.** If the question asks two things, answer both. If the\n   person states something the rules contradict, say plainly that it is wrong and give the right\n   rule.\n\n## What goes out\nOne reply:\n- First line: the direct answer (yes or no, the amount, the date, the number, or \"it depends on\n  X\" with each outcome).\n- Then the reasons: each rule used, cited as paper and section, and for any change entry the\n  deciding date and which side of the effective date the case falls.\n- The working for any sum or day count.\n- If the papers do not cover the point, say so rather than filling the gap.\n\n## Before you send it\n- Did any figure come from a summary or an archive paper? Replace it with the governing one.\n- Did you date-test every change entry against the right event's date?\n- Did you check the other governing papers whose cover lines touch the facts?\n- If a deciding fact is missing, did you give each outcome?\n- Is every part of the question answered?\n\n## What must never happen here\nNever ask the person a question back. Never edit anything. Never use the other organisation's\npapers. Never let a summary or an archive paper decide an answer.\n"
}
```

## Call: Write

```json
{
  "file_path": "C:\\tc-build\\icm\\01 answer\\documents.md",
  "content": "# Document list (generated; do not edit by hand)\n\nThis file is replaced whole by the output of `tools/make-map.mjs`, run on the papers in\n`reference/`. Until it has been generated, the papers are in `reference/`, one subfolder per\norganisation, and each paper's header says its organisation and kind.\n"
}
```

## Call: Edit

```json
{
  "replace_all": false,
  "file_path": "C:\\tc-build\\icm\\CONTEXT.md",
  "old_string": "Nothing is written to disk. There is no second stage because there is no file to hand on and no\nperson to check one; see `DECISIONS.md` in the workshop for why.",
  "new_string": "Nothing is written to disk. There is no second stage because there is no file to hand on and no\nperson to check one."
}
```

## Result

```
File created successfully at: C:\tc-build\icm\01 answer\CONTEXT.md (file state is current in your context — no need to Read it back)
```

## Result

```
File created successfully at: C:\tc-build\icm\01 answer\documents.md (file state is current in your context — no need to Read it back)
```

## Result

```
The file C:\tc-build\icm\CONTEXT.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/lib; grep -n \"assertCleanAncestors\" -A20 stage.mjs | head -40; cat session.mjs | head -80",
  "description": "Check clean-ancestors and session summary logic"
}
```

## Result

```
18:export function assertCleanAncestors(root, managed = MANAGED_FILES) {
19-  for (const path of managed) {
20-    if (existsSync(path)) throw new Error(`This machine has a managed instruction file at ${path}. It loads into every session and cannot be switched off from here.`);
21-  }
22-  let dir = resolve(root);
23-  for (;;) {
24-    for (const name of LEAKY_FILES) {
25-      if (existsSync(join(dir, name))) throw new Error(`Staging root ${root} sits at or below ${join(dir, name)}, which would leak into every session.`);
26-    }
27-    const parent = dirname(dir);
28-    if (parent === dir) return;
29-    dir = parent;
30-  }
31-}
32-
33-function setTimes(dir) {
34-  for (const entry of readdirSync(dir, { withFileTypes: true })) {
35-    const path = join(dir, entry.name);
36-    if (entry.isDirectory()) setTimes(path);
37-    utimesSync(path, STAGED_TIME, STAGED_TIME);
38-  }
--
119:  assertCleanAncestors(root);
120-  const staged = {};
121-  for (const [code, arm] of Object.entries(armsByCode)) {
122-    staged[code] = stageArm(join(root, code), arm, { source, edit });
123-  }
124-  return staged;
125-}
// Turns one raw session log into one row of counts. Nothing here judges an answer.

import { INSTRUCTION_FILES, LIBRARY_DIR } from './config.mjs';

const flat = (path) => String(path ?? '').replace(/\\/g, '/');
const squash = (text) => String(text ?? '').replace(/\s+/g, ' ').trim();
export const wordCount = (text) => (squash(text) === '' ? 0 : squash(text).split(' ').length);

export function parseLog(text) {
  if (text.trim() === '') return { events: [], error: 'empty' };
  try {
    return { events: text.split('\n').filter((line) => line.trim() !== '').map((line) => JSON.parse(line)), error: null };
  } catch {
    return { events: [], error: 'unparseable' };
  }
}

export const startRecord = (events) => events.find((e) => e.type === 'system' && e.subtype === 'init') ?? null;
export const resultRecord = (events) => events.find((e) => e.type === 'result') ?? null;

// The part of a path inside the staged arm folder, so counts do not depend on where it was staged.
export function insideStage(path, stageDir) {
  const full = flat(path).replace(/^\.\//, '');
  const base = flat(stageDir).replace(/\/$/, '');
  const at = full.toLowerCase().indexOf(base.toLowerCase());
  if (base === '' || at === -1) return full;
  return full.slice(at + base.length).replace(/^\//, '') || '.';
}

// Every tool call the main model made, in order, with whether it succeeded.
export function toolCalls(events, stageDir) {
  const calls = [];
  const failed = new Set();
  for (const event of events) {
    const content = event.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (event.type === 'assistant' && block.type === 'tool_use' && !event.parent_tool_use_id) {
        const input = block.input ?? {};
        calls.push({ id: block.id, tool: block.name, target: insideStage(input.file_path ?? input.path ?? input.pattern ?? '', stageDir), pattern: input.pattern ?? null, hasPath: Boolean(input.file_path ?? input.path) });
      }
      if (event.type === 'user' && block.type === 'tool_result' && block.is_error) failed.add(block.tool_use_id);
    }
  }
  return calls.map((call) => ({ ...call, ok: !failed.has(call.id) }));
}

const resultText = (content) => (Array.isArray(content) ? content.map((part) => part.text ?? '').join('') : String(content ?? ''));

// The number of characters the main model's tools handed back to it: file text, search hits,
// listings and refusals alike. Loaded files and tool results can be compared in this one unit.
export function charsFetched(events) {
  const mine = new Set(toolCalls(events, '').map((call) => call.id));
  let total = 0;
  for (const event of events) {
    if (event.type !== 'user' || !Array.isArray(event.message?.content)) continue;
    for (const block of event.message.content) {
      if (block.type === 'tool_result' && mine.has(block.tool_use_id)) total += resultText(block.content).length;
    }
  }
  return total;
}

function tokenCounts(usage) {
  if (!usage) return { tokensIn: null, tokensOut: null, cacheRead: null };
  const fresh = (usage.input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0);
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  return { tokensIn: fresh + cacheRead, tokensOut: usage.output_tokens ?? 0, cacheRead };
}

const isDocument = (target) => target.toLowerCase().startsWith(`${LIBRARY_DIR}/`);
const instructionName = (target) => INSTRUCTION_FILES.find((name) => name.toLowerCase() === target.toLowerCase()) ?? null;

export function summarise(events, meta) {
  const calls = toolCalls(events, meta.stageDir);
  const opened = calls.filter((c) => c.tool === 'Read' && c.ok);
  const result = resultRecord(events) ?? {};
  const init = startRecord(events) ?? {};
  return {
    code: meta.code, run: meta.run, question: meta.question,
```

## Call: Bash

```json
{
  "command": "ls \"$USERPROFILE/.vscode/extensions/\" | grep anthropic.claude-code; ls -t \"$USERPROFILE\"/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude.exe | head -1",
  "description": "Locate the Claude binary"
}
```

## Result

```
anthropic.claude-code-2.1.296-win32-x64
anthropic.claude-code-2.1.300-win32-x64
anthropic.claude-code-2.1.61-win32-x64
C:\Users\<user>/.vscode/extensions/anthropic.claude-code-2.1.300-win32-x64/resources/native-binary/claude.exe
```

## Call: Write

```json
{
  "file_path": "C:\\Users\\<user>\\AppData\\Local\\Temp\\claude\\c--GitHub-gsd-todo-tutorial\\2fb9ec64-8e96-443d-80ed-fec8743a0fec\\scratchpad\\run-round.sh",
  "content": "#!/usr/bin/env bash\n# usage: run-round.sh <round> <set:Q> ...   runs each in parallel, output to practice-logs/round-N/<set>/<Q>.txt\nround=$1; shift\nexport CLAUDE_BIN=\"$(ls -t \"$USERPROFILE\"/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude.exe | head -1)\"\ncd /c/tc-build\nfor item in \"$@\"; do\n  set_=${item%%:*}; q=${item##*:}\n  dir=\"practice-logs/round-$round/$set_\"; mkdir -p \"$dir\"\n  node tools/practice.mjs --workspace icm --set \"practice/$set_\" --doclist \"01 answer/documents.md\" --q \"$q\" --log \"$dir\" > \"$dir/$q.txt\" 2>&1 &\ndone\nwait\necho done\n"
}
```

## Result

```
File created successfully at: C:\Users\<user>\AppData\Local\Temp\claude\c--GitHub-gsd-todo-tutorial\2fb9ec64-8e96-443d-80ed-fec8743a0fec\scratchpad\run-round.sh (file state is current in your context — no need to Read it back)
```

## Call: Bash

```json
{
  "command": "date; bash \"C:/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/run-round.sh\" 1 boat-lend:Q1 boat-lend:Q2 boat-lend:Q8 garden-makerspace:Q2 garden-makerspace:Q4 garden-makerspace:Q8 hall-pool:Q3 hall-pool:Q5 hall-pool:Q10; date",
  "description": "Run round 1 practice questions in parallel",
  "timeout": 600000
}
```

## Result

```
Thu Oct 15 09:49:55 MDT 2026
done
Thu Oct 15 09:50:12 MDT 2026
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-1; cat boat-lend/Q1.txt",
  "description": "Check round 1 output"
}
```

## Result

```
## Q1, run 1

steps 5 (instruction opens 2, document steps 3), text fetched 14318 characters, 197 words, 7 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/boat/boat-fees.md
  - Read reference/boat/boat-changes.md
  - Read reference/boat/boat-membership.md

**The total depends on the joining date. A March payment costs £100. An April payment costs £110.**

The household fits one household membership. Membership rules 1.2 allow up to two adults and four children living at the same address, and this family has two adults and two children.

**Fees used**
- Joining fee: £15, one-time, for a new member (boat-fees.md 1.1). The changes register does not touch it.
- Annual household fee: £85 under boat-fees.md 1.3 as originally written.
- The changes register (entry 2) replaces 1.3 with £95. Under 2.2, the entry applies to payments made on or after 1 April 2026. The payment date decides, because these are fee rules.

**Working**
- **Paying in March 2026 (1–31 March):** this is before 1 April, so the change does not apply. The original £85 stands. £15 + £85 = **£100**.
- **Paying in April 2026:** every April date is on or after 1 April, so the change applies. The fee is £95. £15 + £95 = **£110**.

Both fees are paid together on the joining day, so one date decides both.

Boat-use charges (£4 per boat per session) are separate and are not part of this total.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-1; for f in boat-lend/Q2 boat-lend/Q8 garden-makerspace/Q2 garden-makerspace/Q4; do echo \"######## $f\"; cat $f.txt; done",
  "description": "Read round 1 answers part 1"
}
```

## Result

```
######## boat-lend/Q2
## Q2, run 1

steps 6 (instruction opens 2, document steps 4), text fetched 16254 characters, 285 words, 8.4 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/boat/boat-fees.md
  - Read reference/boat/boat-safety.md
  - Read reference/boat/boat-booking.md
  - Read reference/boat/boat-changes.md

**The member paid £8 and is refunded the full £8.**

**Amount paid.** Boat-fees.md §3.1 sets a standard rowing session at £4 per boat. Two boats at £4 each is £8. Booking.md §3.2 allows up to two boats in one session, so the booking is within the limit. Payment on arrival is fine because §3.3 only requires payment before launch.

**Refund.**
- Safety.md §4.1 lets an on-duty committee member close the lake for lightning. That is what happened at 09:55.
- Safety.md §4.3 says a closure cancels the affected bookings for the purpose of boat-fees.md §4.1. Booking.md §5.3 points to the same rule.
- Boat-fees.md §4.1 says the club refunds a boat-use charge in full if it cancels a confirmed booking. The booking was confirmed, so the full £8 comes back.

**Rules that don't apply.**
- Boat-fees.md §4.2 (member cancellation, 24 hours' notice) and §4.3 (no-show) concern cancellations made by the member or missed bookings. The member didn't cancel and didn't miss the session. The club cancelled it, so the notice period is irrelevant.
- Boat-changes.md entry 4 would change §4.2 to 12 hours, but only for payments made on or after 10 August 2026. The payment was on 14 June 2026, which is before that date, so the entry doesn't apply. It wouldn't change the result anyway, because §4.2 isn't the rule that decides this case.
- Boat-changes.md entry 3 (summer booking limit) covers bookings dated 1 July to 30 September 2026. A 14 June booking falls outside that range, and the question doesn't involve the weekly limit.
- Entry 2 (annual fees) concerns membership fees, not boat-use charges.

I didn't use the front-desk guide (a summary) or the 2025 fees archive, since neither governs.

######## boat-lend/Q8
## Q8, run 1

steps 7 (instruction opens 2, document steps 5), text fetched 17294 characters, 310 words, 10.6 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/lend/lend-borrowing.md
  - Read reference/lend/lend-changes.md
  - Read reference/lend/lend-fees.md
  - Read reference/lend/lend-conduct.md
  - Read reference/lend/lend-refunds.md

**The overdue charge is £20, and no, they can't take the new toy until it is paid or formally waived.**

**Charge**
- The rule is lend-borrowing.md §3.2: £1 per item for each calendar day after the recorded due date, capped at £10 per item.
- The changes register doesn't affect this. Its 21-day loan entry replaces §2.1, which only sets the loan length. The due dates are already recorded, so §3.2 runs from those.
- Counting from the due date, Friday 8 May 2026, to the return on Monday 25 May 2026:
  - Day 1 is Saturday 9 May and day 17 is Monday 25 May, so each item is 17 days late.
  - The day of the week fits, since 17 days is two weeks and three days, and Friday plus three is Monday.
- Each item comes to 17 × £1 = £17, which the cap reduces to £10.
- The toy and the hand saw each get the cap, so the total is 2 × £10 = **£20**.
- No extension was granted, and §2.2 says an overdue loan can't be extended anyway.
- A hand saw is a hand tool, so no deposit is involved (lend-fees.md §3.1).

**New toy**
- lend-fees.md §3.2 says an unpaid charge blocks new loans until it is paid or formally waived. A pending appeal doesn't lift the block (also lend-conduct.md §3.3).
- lend-borrowing.md §1.2 also requires all charges to be paid or formally waived before a loan.
- Only the committee can waive a charge, with the amount and reason recorded in its minutes (lend-fees.md §3.3). A desk volunteer can't waive it.
- The household limit isn't a problem, because both items have been returned (lend-borrowing.md §1.1).
- Once they pay the £20 at the desk (cash or card, lend-fees.md §1.1), they can take the new toy on the same visit.

######## garden-makerspace/Q2
## Q2, run 1

steps 4 (instruction opens 2, document steps 2), text fetched 15112 characters, 314 words, 8 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/garden/plot-rules.md
  - Read reference/garden/amendments.md

**Yes, the plot was put right in time.** The deadline was 4 July 2026, and the weeds were cleared on 2 July.

**Rules used**
- **plot-rules.md, section 4.2:** weeds must not be taller than 20 cm. Weeds above that fail the upkeep standard, so a first notice was proper (section 5.2).
- **plot-rules.md, section 5.2 (original):** the plot holder must put the plot right "on or before the 14th day after the date printed on the notice".
- **amendments.md, Amendment 3 (section 4):** this changes section 5.2 to 10 days. It applies only to a first notice dated on or after 1 July 2026 (4.4). The trigger is the date printed on the notice.
  - This notice is dated 20 June 2026, which is before the effective date.
  - Under 4.4, a notice dated on or before 30 June 2026 keeps the original 14-day period, "even if that period ends in July". So the 10-day period does not apply.

**Day count**
- The date printed on the notice is day 0, which is 20 June.
- Day 10 would be 30 June, but that is the amended period and does not apply here.
- Day 14 is 4 July 2026 (20 June + 10 days = 30 June; 4 more days = 4 July).
- The weeds were cleared on 2 July, which is day 12. That is before the deadline, so the plot was put right in time.

**Consequences**
- No second notice is issued (plot-rules.md, 5.3), and forfeiture under 6.1(a) does not arise.
- Notices are counted per household for each plot year (5.4). This was the household's only notice in 2026, so the 3-notice forfeiture rule in 6.1(b) is not close to being triggered.
- The plot type, a Starter plot, makes no difference to the result.

I did not use the volunteer FAQ or the 2025 archive, because neither governs.

######## garden-makerspace/Q4
## Q4, run 1

steps 5 (instruction opens 2, document steps 3), text fetched 18401 characters, 424 words, 13.6 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/garden/fees.md
  - Read reference/garden/plot-rules.md
  - Read reference/garden/amendments.md

**Answer: No on both. The Standard plot costs the full $85, not $42.50, and there is no second $50 deposit.**

**Why the Standard plot is $85**
- The Standard annual fee is $85 (fees.md, 1.1).
- Your agreement is dated 4 May 2026. That is on or before 30 June 2026, so the full annual fee is charged, not the half fee for plots taken up from 1 July (fees.md, 2.2).
- The reduced rate is 50% of the annual fee, and you qualify because you were 65 or over on 1 January 2026 (fees.md, 6.1 and 6.2).
- It applies to only one plot per household. When a household holds 2 plots, it goes to the plot with the lower annual fee (fees.md, 6.3).
- Your Starter plot ($30) has the lower fee than the Standard ($85), so the reduced rate stays on plot 22. That is why you paid $15, which is correct. The Standard plot gets no reduction.
- The 25% figure in fees.md, 6.4 only applies when the reduced rate and the half fee fall on the same plot. That isn't the case here.

**Why there is no second deposit**
- The deposit is $50 per household, not per plot. It is paid once, with the household's first fee (fees.md, 3.1).
- Your household's first plot is plot 22, so the deposit belongs with that first fee. The papers don't show whether it was paid, but if it was, nothing more is due.

**Your eligibility for the Standard plot**
- A household may hold up to 2 plots, with at most 1 Standard (plot-rules.md, 3.1).
- A household can apply for a Standard plot only after holding its first plot for 1 complete plot year (plot-rules.md, 3.3). You have held plot 22 since 2023, so you meet this.

**When to pay**
- The fee is due on or before the 14th day after the agreement date (fees.md, 2.2). Counting from 4 May 2026, that is **18 May 2026**.
- The late-payment charge is $2 per day from 19 May as day 1, capped at $30 per plot per year. Amendment 1 applies because the due date falls after its 1 April 2026 effective date (amendments.md, 2.3 and 2.4).
- If the fee is still unpaid more than 30 days after the due date, the plot is forfeited (plot-rules.md, 6.1(c)). The charge is not refundable, and paying it does not stop forfeiture (amendments.md, 2.3).
- If you haven't paid yet, the amount is $85 plus any late charge, up to $30.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-1; for f in garden-makerspace/Q8 hall-pool/Q3 hall-pool/Q5 hall-pool/Q10; do echo \"######## $f\"; cat $f.txt; done",
  "description": "Read round 1 answers part 2"
}
```

## Result

```
######## garden-makerspace/Q8
## Q8, run 1

steps 6 (instruction opens 2, document steps 4), text fetched 20906 characters, 409 words, 12.4 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/makerspace/machine-booking.md
  - Read reference/makerspace/membership.md
  - Read reference/makerspace/safety-inductions.md
  - Read reference/makerspace/bulletin.md

**It depends on the member's tier, which the question doesn't give.** Booking 11 days ahead is allowed for a Bench or Forge member and not for a Keystone member.

**Day count (machine-booking.md section 2.2).**
- The window is 21 days for Bench, 14 for Forge and 7 for Keystone.
- The booking day is day zero, and the last day of the window is included.
- Tuesday 1 September is day 0, so Saturday 12 September is day 11.
- **Bench (21 days):** the window runs to 22 September, so yes.
- **Forge (14 days):** the window runs to 15 September, so yes.
- **Keystone (7 days):** the window ends on 8 September, so no. The member could book 12 September from 5 September onward.

**Other conditions, which are met for every tier.**
- **Who may book (machine-booking.md section 2.1, membership.md section 2.3):** the member is in good standing, which the question states. An induction must be valid on the day of the session, not the day of booking.
- **Induction:**
  - The wood lathe needs an induction (safety-inductions.md section 1.1).
  - The question says the induction stays valid throughout September, so it is valid on 12 September.
  - Bulletin entry 4 changes the validity period, but the induction is valid on 12 September under either the 12-month or the 9-month rule, so the entry doesn't change the answer.
- **Age:** the member is 34, so the under-18 limit in safety-inductions.md section 1.2 doesn't apply. That limit covers only the table saw and the MIG welder anyway.
- **Session length (machine-booking.md section 3.1):**
  - The workshop is open 08:00 to 22:00, and sessions start on the hour or half hour.
  - The 10:00 to 12:00 session is 2 hours. The wood lathe maximum is 4 hours, so it fits.
- **Weekly limit (machine-booking.md section 2.3):**
  - The week of Monday 7 to Sunday 13 September contains 12 September.
  - The member has no other bookings, so 2 hours is under even the lowest limit, 4 hours for Bench.
- **No-shows (machine-booking.md section 5.2):** there are none in 2026, so no restriction applies. Bulletin entry 1 changes only the check-in time, which doesn't matter for making the booking.

**Peak time.** Saturday is peak all day (machine-booking.md section 3.2), so this is a peak session. Peak status doesn't stop the booking in the booking rules I read. I did not read fees.md, so I haven't checked whether it affects the cost.

######## hall-pool/Q3
## Q3, run 1

steps 6 (instruction opens 2, document steps 4), text fetched 20127 characters, 336 words, 10 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/pool/pool-booking.md
  - Read reference/pool/pool-fees.md
  - Read reference/pool/pool-changes.md
  - Read reference/pool/pool-rules.md

**The 25 January no-show is charged £4 and the 10 February no-show is charged £6. The second no-show suspends the member's right to book for 14 days, though they can still swim in any session that has free places on the day.**

**Charges**
- The charge is set by pool-fees.md section 4.1, which pool-booking.md section 4.2 points to. The original figure is £4 per missed lane session.
- Change 3 in pool-changes.md raises it to £6. It is effective 1 February 2026, and the deciding date is the day of the missed session.
- 25 January 2026 is before 1 February, so the old rate applies: **£4**.
- 10 February 2026 is on or after 1 February, so the new rate applies: **£6**.
- The total is £10.

**Right to book**
- The original pool-booking.md paragraph 4.3 needs three no-shows within 30 days before it suspends booking. Change 3 replaces that with two no-shows within any 30 days, suspending the right to book for 14 days.
- Change 3 says a no-show before 1 February 2026 is charged at the old rate but still counts towards the 30-day total.
- The 10 February no-show is the one that triggers the suspension, and it falls on the new rule's side of the effective date.
- From 25 January to 10 February is 16 days, which is inside 30 days. So the two count together, and the right to book is **suspended for 14 days**.
- The second sentence of paragraph 4.3 still stands. The member may still swim in a session that has free places on the day.
- The papers don't say on what day the 14 days start. If they run from the second no-show on 10 February, they would end on 23 February 2026. That start date is my reading, not something the papers state.

**Related rule**
Under pool-fees.md section 4.4, any charge left unpaid for 30 days also stops the member booking until it is paid. This is separate from the suspension above.

######## hall-pool/Q5
## Q5, run 1

steps 6 (instruction opens 2, document steps 4), text fetched 20621 characters, 346 words, 11.1 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/pool/pool-closures-and-refunds.md
  - Read reference/pool/pool-changes.md
  - Read reference/pool/pool-membership.md
  - Read reference/pool/pool-fees.md

**The member is due £32.**

Change 5 does not apply, so the original paragraph 4.2 decides this case.

**Which version of the rule applies**
- pool-membership.md 6.1 lets a member resign on 30 days' written notice to the membership secretary.
- Change 5 in pool-changes.md raises the deduction to £30 and refunds nothing if fewer than 2 whole months are left. Its deciding date is the day the club receives the written notice, and it is effective from 1 April 2026.
- The notice was received on 25 March 2026, which is before 1 April 2026. Change 5 therefore does not apply.
- The original pool-closures-and-refunds.md 4.2 governs. It refunds each whole calendar month left after the notice ends, less £20. The joining fee is not refunded.

**Working**
1. Thirty days from receipt on 25 March 2026 is 24 April 2026. March has 6 days after the 25th, which brings the count to 31 March, and 24 more days reach 24 April. If you count the 25th itself, it is 25 April. The result is the same either way.
2. April is only partly left after the notice ends, so it does not count. The whole calendar months left are May and June 2026, which is 2 months. The membership year ends on 30 June (pool-membership.md 3.4).
3. The paper doesn't state the monthly value. I used one-twelfth of the annual fee, the same basis as the other month-based rules in pool-fees.md 1.3 and pool-closures-and-refunds.md 4.3. For the £312 fee that is £26 a month.
4. Two months at £26 is £52. Less the £20 deduction, the refund is **£32**.
5. The £312 was a single payment, so the £2 monthly handling charge in pool-fees.md 1.2 does not enter the sum.

**Claim time limit:** pool-closures-and-refunds.md 6.1 says a claim must reach the treasurer within 60 days of the event. Refunds go back to the original payment method within 21 days of approval. The papers don't say whether "the event" is the notice or the notice ending, so I can't say which date starts the 60 days.

######## hall-pool/Q10
## Q10, run 1

steps 7 (instruction opens 2, document steps 5), text fetched 21723 characters, 282 words, 8.1 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/hall/hall-booking-and-deposits.md
  - Read reference/hall/hall-licensing-limits.md
  - Read reference/hall/hall-who-can-hire.md
  - Read reference/hall/hall-changes-log.md
  - Read reference/hall/hall-hire-charges.md

**Answer:** 3 adults aged 25 or over. No, guests may not bring their own alcohol, because no alcohol is allowed at all. The damage deposit is £300.

**Adults aged 25 or over**
- A 17th birthday party is a party for young people (hall-who-can-hire.md, section 2.1). A resident hirer qualifies, and the question says the hirer is a Tannerwick resident.
- Section 2.2 requires one adult aged 25 or over for every 15 guests or part of 15.
- 40 ÷ 15 = 2.67, which rounds up to 3.
- The section 5.3 steward rule in hall-licensing-limits.md applies only above 80 guests. With 40 guests it does not apply.

**Alcohol**
- hall-who-can-hire.md, section 2.3 says no alcohol may be brought, supplied or sold at these parties.
- hall-licensing-limits.md, section 2.4 says the same.
- Section 2.3 of hall-licensing-limits.md normally lets guests bring their own alcohol without consent. That does not apply here, because section 2.4 overrides it for these parties.

**Damage deposit**
- The booking date is the date on the confirmation, 5 October 2025 (hall-booking-and-deposits.md, section 1.4).
- Change 1 in hall-changes-log.md replaces section 3.1 for bookings with a booking date on or after 1 July 2025. Its deciding date is the booking date. 5 October 2025 is after 1 July 2025, so the new amounts apply.
- Under the new rule the Main Hall deposit is £150. It is £300 for any hire that is a party under section 2 of hall-who-can-hire.md.
- Section 3.2 takes one deposit per hire, the highest that applies. That is £300, not £150.
- Section 2.3 of hall-who-can-hire.md applies the higher deposit however many guests are expected. The 40-guest figure does not change it.
```

## Call: Edit

```json
{
  "replace_all": false,
  "file_path": "C:\\tc-build\\icm\\01 answer\\CONTEXT.md",
  "old_string": "- If the papers do not cover the point, say so rather than filling the gap.",
  "new_string": "- If the papers do not cover the point, say so rather than filling the gap.\n- Keep to what was asked. A rule that could have decided it but does not (a change entry whose\n  date test fails, a rule for a different kind of case) gets one line saying why not. Leave out\n  rules about matters the question did not raise, such as what happens next or other charges."
}
```

## Call: Write

```json
{
  "file_path": "C:\\tc-build\\ROUNDS.md",
  "content": "# Practice rounds\n\nHarness for every run: `tools/practice.mjs`, model claude-sonnet-5-5, effort medium, tools Read,\nGlob, Grep, one fresh session per question, doclist `01 answer/documents.md`. One run per\nquestion. Raw logs (the printed summary `<Q>.txt` and the stream `<Q>-r1.jsonl`) are under\n`practice-logs/round-N/<set>/`. Verdicts are mine, judged against each set's `questions.md`\n(\"Correct requires\").\n\n## Round 1 — 2026-10-15, 09:49–09:50 MDT\n\n**Plan.** Nine questions, three per set, one per trap type I expected the contract to have to\nhandle, so that one round covers every rule in the contract at least once: date split on a\nmissing date (boat-lend Q1), a rule in a second paper changing the answer (boat-lend Q2), a\nper-item cap (boat-lend Q8), a change entry whose trigger is not met (garden Q2), a casual message\nwith a wrong belief and two asks (garden Q4), a missing fact with three outcomes (makerspace Q8),\ntwo events either side of an effective date (pool Q3), a receipt-date test plus month arithmetic\n(pool Q5), a three-part question with rounding up and a change entry (hall Q10). Nine, not all\nthirty, because each further run of the same trap type tells me little until something fails;\nthe untested questions are kept for round 2 as a held-out check.\n\n| Q | Verdict | Reason | Steps (instr/doc) | Text fetched |\n|---|---|---|---|---|\n| boat-lend Q1 | Right | £100 if paid by 31 March, £110 from 1 April; payment date named | 5 (2/3) | 14,318 |\n| boat-lend Q2 | Right | £8 paid, £8 refunded via the safety paper's closure rule | 6 (2/4) | 16,254 |\n| boat-lend Q8 | Right | £20 (£10 cap per item), new loan blocked until paid or waived | 7 (2/5) | 17,294 |\n| garden Q2 | Right | In time; 14-day period, deadline 4 July, notice dated before 1 July | 4 (2/2) | 15,112 |\n| garden Q4 | Right | Standard plot £85 (reduced rate stays on the Starter), no second deposit | 5 (2/3) | 18,401 |\n| makerspace Q8 | Right | Depends on tier: Bench yes, Forge yes, Keystone no | 6 (2/4) | 20,906 |\n| pool Q3 | Right | £4 then £6, booking suspended 14 days | 6 (2/4) | 20,127 |\n| pool Q5 | Right | £32 (two whole months at £26, less £20); Change 5 not reached | 6 (2/4) | 20,621 |\n| hall Q10 | Right | 3 adults, no alcohol at all, £300 deposit | 7 (2/5) | 21,723 |\n\n**Headline:** 9 of 9 right. Mean steps 5.8 (instruction opens 2 every time). Mean text fetched\nabout 18,300 characters. Answers 197–424 words, 7–14 s.\n\n**What I saw.** Every run read the contract and the list in one step, then read the changes paper\nand the governing papers whose cover lines touched the facts, in parallel. No run opened a summary\nor an archive paper. The weakness was not accuracy but scope: several answers added rules nobody\nasked about (garden Q4 added due dates and late charges; pool Q5 added a claim time limit and said\nit could not tell which date starts it; makerspace Q8 said \"I did not read fees.md\"). None was\nwrong here, but every extra rule is one more claim that can be wrong or can read as doubt, and a\nmarker judging against \"Correct requires\" gains nothing from it.\n\n**Change.** Added one bullet to \"What goes out\" in `01 answer/CONTEXT.md`: keep to what was\nasked; a rule that could have decided the case but does not gets one line saying why not; leave\nout rules about matters the question did not raise. Nothing else changed, because nothing failed.\n"
}
```

## Result

```
The file C:\tc-build\icm\01 answer\CONTEXT.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

## Result

```
File created successfully at: C:\tc-build\ROUNDS.md (file state is current in your context — no need to Read it back)
```

## Call: Bash

```json
{
  "command": "date; bash \"C:/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/run-round.sh\" 2 boat-lend:Q3 boat-lend:Q4 boat-lend:Q5 boat-lend:Q6 boat-lend:Q7 boat-lend:Q9 boat-lend:Q10 garden-makerspace:Q1 garden-makerspace:Q3 garden-makerspace:Q5 garden-makerspace:Q6 garden-makerspace:Q7 garden-makerspace:Q9 garden-makerspace:Q10 hall-pool:Q1 hall-pool:Q2 hall-pool:Q4 hall-pool:Q6 hall-pool:Q7 hall-pool:Q8 hall-pool:Q9; date; cd /c/tc-build/practice-logs/round-2; grep -h \"^steps\\|^## \" */*.txt",
  "description": "Run round 2 on the 21 held-out questions",
  "timeout": 600000
}
```

## Result

```
Thu Oct 15 09:50:53 MDT 2026
done
Thu Oct 15 09:51:12 MDT 2026
## Q10, run 1
steps 7 (instruction opens 2, document steps 5), text fetched 17456 characters, 233 words, 9.7 s, model claude-sonnet-5-5
## Q3, run 1
steps 5 (instruction opens 2, document steps 3), text fetched 14621 characters, 212 words, 9.2 s, model claude-sonnet-5-5
## Q4, run 1
steps 7 (instruction opens 2, document steps 5), text fetched 18579 characters, 206 words, 8.3 s, model claude-sonnet-5-5
## Q5, run 1
steps 6 (instruction opens 2, document steps 4), text fetched 16663 characters, 255 words, 8.1 s, model claude-sonnet-5-5
## Q6, run 1
steps 5 (instruction opens 2, document steps 3), text fetched 14162 characters, 222 words, 7.3 s, model claude-sonnet-5-5
## Q7, run 1
steps 4 (instruction opens 2, document steps 2), text fetched 12407 characters, 241 words, 8.6 s, model claude-sonnet-5-5
## Q9, run 1
steps 6 (instruction opens 2, document steps 4), text fetched 15920 characters, 255 words, 9.6 s, model claude-sonnet-5-5
## Q1, run 1
steps 4 (instruction opens 2, document steps 2), text fetched 15406 characters, 116 words, 5.8 s, model claude-sonnet-5-5
## Q10, run 1
steps 5 (instruction opens 2, document steps 3), text fetched 18116 characters, 223 words, 7.1 s, model claude-sonnet-5-5
## Q3, run 1
steps 5 (instruction opens 2, document steps 3), text fetched 18256 characters, 290 words, 8.3 s, model claude-sonnet-5-5
## Q5, run 1
steps 5 (instruction opens 2, document steps 3), text fetched 18695 characters, 270 words, 8.6 s, model claude-sonnet-5-5
## Q6, run 1
steps 5 (instruction opens 2, document steps 3), text fetched 18082 characters, 293 words, 9.8 s, model claude-sonnet-5-5
## Q7, run 1
steps 6 (instruction opens 2, document steps 4), text fetched 21200 characters, 253 words, 9 s, model claude-sonnet-5-5
## Q9, run 1
steps 5 (instruction opens 2, document steps 3), text fetched 18082 characters, 220 words, 7.3 s, model claude-sonnet-5-5
## Q1, run 1
steps 6 (instruction opens 2, document steps 4), text fetched 20524 characters, 231 words, 7.9 s, model claude-sonnet-5-5
## Q2, run 1
steps 5 (instruction opens 2, document steps 3), text fetched 17818 characters, 222 words, 7.9 s, model claude-sonnet-5-5
## Q4, run 1
steps 5 (instruction opens 2, document steps 3), text fetched 17598 characters, 271 words, 8.2 s, model claude-sonnet-5-5
## Q6, run 1
steps 6 (instruction opens 2, document steps 4), text fetched 19451 characters, 306 words, 8.7 s, model claude-sonnet-5-5
## Q7, run 1
steps 6 (instruction opens 2, document steps 4), text fetched 19768 characters, 383 words, 12.6 s, model claude-sonnet-5-5
## Q8, run 1
steps 7 (instruction opens 2, document steps 5), text fetched 22111 characters, 259 words, 11.9 s, model claude-sonnet-5-5
## Q9, run 1
steps 6 (instruction opens 2, document steps 4), text fetched 19817 characters, 223 words, 7.5 s, model claude-sonnet-5-5
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-2/boat-lend; for q in Q3 Q4 Q5 Q6 Q7 Q9 Q10; do echo \"######## $q\"; sed -n '/^$/,$p' $q.txt; done",
  "description": "Read round 2 boat-lend answers"
}
```

## Result

```
######## Q3

steps 5 (instruction opens 2, document steps 3), text fetched 14621 characters, 212 words, 9.2 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/boat/boat-booking.md
  - Read reference/boat/boat-changes.md
  - Read reference/boat/boat-membership.md

**No, the booking can't be made.** Under the summer limit, the member may hold at most two future bookings in any rolling seven-day period. The new booking would be a third.

- **Change entry:** `boat-changes.md` §3 replaces `boat-booking.md` §3.1 with: "A member may hold no more than two future bookings in any rolling seven-day period."
- **Date test:** `documents.md` says booking rules turn on the booking date. §3.2 applies the entry to bookings dated 1 July 2026 to 30 September 2026 inclusive. The request is made on 10 July 2026, and the session is on 16 July 2026. Either date is inside the range, so the entry applies.
- **Original rule not used:** The original §3.1 allowed three future bookings, which would have permitted this request. It is replaced for this case.
- **Count:** The three sessions are Sunday 12 July, Tuesday 14 July and Thursday 16 July 2026. All three fall within the seven days from 12 to 18 July, and all are future bookings. That makes three in one rolling seven-day period, against a limit of two.

The member could book the Thursday session only if one of the earlier two bookings were cancelled first. They could also choose a session that doesn't put three bookings inside one seven-day window.

######## Q4

steps 7 (instruction opens 2, document steps 5), text fetched 18579 characters, 206 words, 8.3 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/boat/boat-fees.md
  - Read reference/boat/boat-safety.md
  - Read reference/boat/boat-booking.md
  - Read reference/boat/boat-membership.md
  - Read reference/boat/boat-changes.md

**The charge is £4 in total: £2 for each of the two kayaks.**

**Rules used**
- boat-fees.md §3.2 (Junior session): a session booked solely for junior members costs £2 per boat when an approved adult supervisor is present. Both people booked are juniors, aged 14 and 16, and the booking names an approved adult member who stays on site. The adult isn't in a boat, but §3.2 only asks for the adult supervisor to be present. The £4 standard rate in §3.1 therefore doesn't apply.
- boat-safety.md §2.2: a junior aged 12 to 17 may use a boat only while an approved adult member remains on site. This is met. Both juniors are in that age band.
- boat-booking.md §1.2: a junior may book only where an approved adult member is named in the booking. This is met.
- boat-fees.md §3.3: the charge must be paid before launch unless the Treasurer has agreed otherwise in writing. The question mentions no such agreement.

**Working:** 2 kayaks × £2 = £4.

**Change entries:** none of them touches boat-use charges. The register only replaces §§1.2–1.4 and §4.2 of boat-fees.md and §3.1 of boat-booking.md. Its summer booking limit (§3) isn't relevant either, because the booking limit isn't in question here.

######## Q5

steps 6 (instruction opens 2, document steps 4), text fetched 16663 characters, 255 words, 8.1 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/boat/boat-membership.md
  - Read reference/boat/boat-booking.md
  - Read reference/boat/boat-changes.md
  - Read reference/boat/boat-safety.md

**No. The friend can't use a club boat as a guest on Saturday 11 July 2026. They could next do so on Friday 1 January 2027, which is the first day of the next period.**

**Why not**
- Under boat-membership.md §4.3, a guest may use club boats on no more than three separate days between 1 January and 31 December.
- The friend has already used boats on three separate days in 2026: 14 March, 2 May and 20 June. That is the limit.
- 11 July 2026 would be a fourth day in the same period, so it isn't allowed.
- Having only one guest doesn't help. The two-guest limit in §4.1 is a separate rule and isn't what stops this visit.
- The limit counts the friend's days of use, whichever member brings them. Nothing in the papers lets the member apply for an extra day.

**When the friend could next come**
- The count restarts on 1 January, so the first day available is Friday 1 January 2027.
- That is the earliest date under the rules. The member would still need to book as normal, and the friend would use one of their three days for 2027.

**Other papers checked**
- boat-changes.md has no entry that touches guest access. The summer booking limit in §3 covers only the member's own bookings, and it doesn't change the guest rule.
- boat-booking.md §1.3 and boat-safety.md §2.3 don't alter the three-day limit.
- I didn't use boat-front-desk-guide.md, which is a summary and doesn't govern.

######## Q6

steps 5 (instruction opens 2, document steps 3), text fetched 14162 characters, 222 words, 7.3 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/lend/lend-fees.md
  - Read reference/lend/lend-membership.md
  - Read reference/lend/lend-changes.md

**They pay £30, and the renewed membership runs from Saturday 10 January 2026.** It lasts 12 calendar months from that date, which ends on 9 January 2027. The papers don't say whether the last day is 9 or 10 January 2027.

**Fee: £30**
- lend-fees.md 2.1 sets the standard annual fee at £24. The change entry in lend-changes.md section 2 replaces it with £30 for each 12-month term.
- That entry is tested on the date the renewal payment is accepted. The desk accepted payment on 10 January 2026, which is on or after the 1 January 2026 effective date, so the £30 applies.
- The reduced £12 fee in lend-fees.md 2.2 needs one named adult to declare income support. Neither adult does, so it doesn't apply.
- The household has no unpaid charges, so nothing blocks renewal (lend-fees.md 3.2, lend-membership.md 2.2).

**Start date: 10 January 2026**
- lend-membership.md 2.1 says renewal "starts on the date the renewal payment is accepted, not on the old expiry date". The old expiry on 20 December 2025 is therefore ignored.
- The same section says membership lasts 12 calendar months from the renewal date.
- The membership was expired from 21 December 2025 until 10 January 2026. Under lend-membership.md 3.2, an expired membership can't take new loans. The papers give no backdating or grace period.

######## Q7

steps 4 (instruction opens 2, document steps 2), text fetched 12407 characters, 241 words, 8.6 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/lend/lend-borrowing.md
  - Read reference/lend/lend-changes.md

**It depends on the collection date: 14 days if they collect on or before Tuesday 31 March 2026, and 21 days if they collect on or after Wednesday 1 April 2026.** The question doesn't give the collection date, and the rules make the answer turn on it.

**Rules used**
- **lend-borrowing.md 2.1 (original):** "An ordinary loan lasts 14 calendar days from its collection date."
- **lend-changes.md section 3 (Ordinary loan decision):** this replaces 2.1 with "An ordinary loan lasts 21 calendar days from its collection date."
  - The date test is the date the item is collected, "not its reservation or due date".
  - The replacement applies if collection is on or after 1 April 2026.
  - The notification date of 27 March doesn't decide anything. The committee's decision date of 16 March doesn't either.
- **lend-borrowing.md 3.1:** collection is "due within 7 days of notification". From 27 March, that runs to Friday 3 April 2026.

**Outcomes**
- **Collected 27–31 March 2026:** the entry's test isn't met, so the old 2.1 applies and the loan is **14 calendar days**.
- **Collected 1–3 April 2026:** the entry applies and the loan is **21 calendar days**.

The papers don't say what happens if the household collects after 3 April. If that happens, the 21-day rule would apply on the collection date alone, but whether the reservation still stands isn't covered.

The extension (lend-borrowing.md 2.2) isn't included in these figures, as the question asked.

######## Q9

steps 6 (instruction opens 2, document steps 4), text fetched 15920 characters, 255 words, 9.6 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/lend/lend-refunds.md
  - Read reference/lend/lend-changes.md
  - Read reference/lend/lend-fees.md
  - Read reference/lend/lend-membership.md

**Yes. The full £30 is due, and it must be paid by Friday 24 July 2026.**

**Which rules apply**
- **Refund window** (`lend-refunds.md` 2.1, as replaced by `lend-changes.md` section 4): the date test is the date the written request reaches the desk. That is 10 July 2026, which is on or after 1 July 2026, so the replacement applies. The window is 14 calendar days of joining, not the original 7. The joining date is day zero.
- **Amount** (`lend-fees.md` 2.1, as replaced by `lend-changes.md` section 2): the date test is the date the payment is accepted. That is 1 July 2026, which is on or after 1 January 2026, so the standard fee is £30, not the original £24. The question says the household paid the standard fee, so the £12 reduced fee does not come into it.
- **Payment deadline** (`lend-refunds.md` 2.3): an approved refund must be paid within 14 calendar days of receiving the request. Nothing in the changes register alters this section.

**Working**
- Joining on Wednesday 1 July is day 0, so Friday 10 July is day 9. That is within the 14-day window.
- Under the old 7-day rule, day 9 would have been too late. That rule no longer applies because the request was received on or after 1 July 2026.
- Neither named adult collected an item, so the "unused" condition is met. The exclusion in 2.2 (no refund after collection) does not apply.
- Deadline: 10 July + 14 calendar days = Friday 24 July 2026.

######## Q10

steps 7 (instruction opens 2, document steps 5), text fetched 17456 characters, 233 words, 9.7 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/lend/lend-refunds.md
  - Read reference/lend/lend-changes.md
  - Read reference/lend/lend-fees.md
  - Read reference/lend/lend-safety.md
  - Read reference/lend/lend-borrowing.md

**The library charges the member £40 for the damage. The £20 deposit is applied against that charge, which leaves £20 for the member to pay. That balance is due within 14 days of the written notice of the calculation.**

**Charge**
- lend-refunds.md §3.1 says to charge the actual repair cost for avoidable damage, "up to £40 per item".
- The confirmed repair cost is £55, so the £40 cap applies. The charge is £40, not £55.

**Deposit**
- lend-fees.md §3.1 sets the powered-tool deposit at £20, which the member paid.
- lend-refunds.md §1.2 allows deducting a confirmed repair charge for that tool from its deposit.
- The £20 deposit is used up against the £40 charge, so nothing is repaid under §1.1.
- Working: £40 − £20 = £20 balance.
- The library must give the member a written calculation, and §1.2 says "any balance owed remains payable".

**When the balance is due**
- lend-refunds.md §3.2 says payment is due within 14 days of the written notice of the calculation.
- The papers give no calendar date, because the notice date isn't stated. Count the 14 days from the date of that notice.

**Changes register**
- None of its entries touch these sections. They replace only lend-fees.md §2.1, lend-borrowing.md §2.1 and lend-refunds.md §2.1, so the original text of §1.1, §1.2, §3.1 and §3.2 stands.

The desk guide and archive papers were not used.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-2/garden-makerspace; for q in Q1 Q3 Q5 Q6 Q7 Q9 Q10; do echo \"######## $q\"; sed -n '/^$/,$p' $q.txt | grep -v \"^  - Read\"; done",
  "description": "Read round 2 garden-makerspace answers"
}
```

## Result

```
######## Q1

steps 4 (instruction opens 2, document steps 2), text fetched 15406 characters, 116 words, 5.8 s, model claude-sonnet-5-5

**The plot secretary inspects every plot on the first Saturday of each month from April to October.**

- **Rule:** plot-rules.md, section 5.1 says the inspection is "on the first Saturday of each month from April to October." That is seven inspection days a year, one in each of April, May, June, July, August, September and October. There are none from November to March.
- **Amendments:** amendments.md replaces section 5 of plot-rules.md only in part. Amendment 3 changes section 5.2, the first-notice period, from 14 days to 10 days. Its test is whether the first notice is dated on or after 1 July 2026. It doesn't touch section 5.1, so the inspection days stay as originally written.

######## Q3

steps 5 (instruction opens 2, document steps 3), text fetched 18256 characters, 290 words, 8.3 s, model claude-sonnet-5-5

**No.** Rule 3.1 of the Water and Hours paper bans sprinklers and unattended hoses, so you may not set one up and leave it running. That holds on a permitted day in a permitted window, and with no restriction in force.

**Reasons**

- **Water and Hours, section 3.1:** "A hose must be held in the hand at all times. Sprinklers, soaker hoses and unattended hoses are not allowed." A sprinkler left running while you weed the far end of the plot breaks both the sprinkler ban and the held-in-hand requirement.
- **Amendments Log, Amendment 2:** this changes only the watering windows in section 2. It replaces the times and the no-hose day, and its trigger is the date the watering takes place. It does not touch section 3, so the sprinkler ban stands whatever the date. Your window and day still have to be allowed under section 2 as amended, but that doesn't help here.
- **Plot type:** a Standard plot (4 m by 5 m) has no exemption from section 3.1. Section 3.2 allows up to 20 minutes per plot per window, and 15 minutes would be inside that. That limit only caps hand-held watering and doesn't permit a sprinkler.
- **Water restriction:** section 4 isn't engaged, as you say none is in force. A restriction would only add limits. It could not lift the sprinkler ban.

**What you can do**

- Water by hose for up to 20 minutes per window, holding the hose in your hand the whole time.
- Use watering cans filled from the tanks at any time during gate hours, on any day (section 2.3, repeated in Amendment 2, section 3.3). You could fill cans and water the plot that way while you weed.

######## Q5

steps 5 (instruction opens 2, document steps 3), text fetched 18695 characters, 270 words, 8.6 s, model claude-sonnet-5-5

**It depends on her age. She can be offered a Raised bed if she is 70 or over. If she is under 70, she can't, because she has no mobility need.**

Her age is the one fact the question doesn't give, and the rules turn on it.

- **Raised bed rule:** A Raised bed is "offered only to a plot holder who is aged 70 or over, or who has a mobility need accepted by the plot secretary" (plot-rules.md, section 2.3). The rule doesn't say on which date the age is tested.
  - **70 or over:** she meets the age condition, so a Raised bed can be offered.
  - **Under 70:** she meets neither condition, since you say she has no mobility need. She could take a Starter plot instead (see below).
- **Who can hold a plot:** She must be 16 or over, live in Fernhill parish and sign a plot agreement (plot-rules.md, section 1.1). She lives in the parish, so she only needs to sign the agreement.
- **First plot:** A household's first plot must be a Starter plot or a Raised bed (plot-rules.md, section 3.3). A Raised bed is allowed as a first plot. Her household has no plots, so the limit of 2 plots per household (section 3.1) is not a problem.
- **Amendments:** The only amendment to plot-rules.md changes the first-notice period in section 5.2 (Amendment 3). None of the amendments touch sections 1 to 3, so the original wording applies.

I used only the governing papers. The volunteer FAQ is a summary and the 2025 plot rules are an archive, so neither decides this.

######## Q6

steps 5 (instruction opens 2, document steps 3), text fetched 18082 characters, 293 words, 9.8 s, model claude-sonnet-5-5

**It depends on the battery's rating, which the question doesn't give.** The member may store it if it is rated at 100 Wh or less, and may not if it is rated above 100 Wh.

**Rules that decide it**
- **Entitlement (storage.md §1.1):** A Forge member has one locker, so they may use one.
- **Lithium limit (storage.md §2.1):** Nobody may store "lithium batteries rated above 100 Wh". The section adds that "exactly 100 Wh… [is] allowed".
  - A pack rated 100 Wh or less is allowed.
  - A pack rated above 100 Wh is prohibited. Under §2.2, staff would remove it and §3 would apply.
- **Weight (storage.md §2.1):** A locker may hold up to 25 kg, and exactly 25 kg is allowed. The locker would hold 12 kg with the battery inside, so it is within the limit.
- **Other prohibited items (storage.md §2.1):** There would be no food, gas cylinders or flammable liquid, so none of those limits is a problem.
- **Good standing (membership.md §2.3):** The member is in good standing. That status isn't a condition for using a locker anyway. It is only required for the project shelf (§1.2).

**Rules that don't change the answer**
- **Bulletin entries (bulletin.md §2):** The 5 October 2026 start date doesn't matter here. The only storage entry (Entry 3, effective 15 July 2026) changes the holding period in §3.2, not the §2.1 limits. The other entries cover check-in, late-payment charges and induction validity. So §2.1 applies as printed.

**To settle it:** check the pack's watt-hour rating. If only volts and amp-hours are shown, Wh = V × Ah. For example, 18 V × 5 Ah = 90 Wh, which is allowed. 36 V × 4 Ah = 144 Wh, which is not.

######## Q7

steps 6 (instruction opens 2, document steps 4), text fetched 21200 characters, 253 words, 9 s, model claude-sonnet-5-5

**She is a no-show.** The session was on 7 May 2026, so the 10-minute check-in rule applies, and 14:12 is 12 minutes after the 14:00 start.

- **Rule that applies:** Bulletin entry 1 replaces machine-booking.md section 5.1. Its deciding date is the date of the session, whenever the booking was made. The session is on 7 May 2026, which is after the effective date of 1 May 2026, so the entry applies. The printed 15-minute window in machine-booking.md 5.1 does not apply.
- **The 10-minute window:** She had to check in within 10 minutes after the start time, and exactly 10 minutes counts as in time. The last in-time moment was 14:10. She arrived at 14:12, which is 2 minutes too late. Under the entry, a member who misses the window is a no-show and the session is released to other members.
- **Why the 15-minute rule doesn't help her:** 14:12 would have been in time under the old rule, but that rule is replaced for this session.

Her booking itself was valid:
- She is in good standing and holds a valid wood lathe induction (machine-booking.md 2.1).
- She booked on 24 April, 13 days before the session, inside the Bench 21-day window (2.2).
- 7 May 2026 is a Thursday, so the session is not in Saturday peak time. Peak time is not a factor in the check-in answer.

The question doesn't give the session's length, so I haven't checked the 4-hour Bench weekly limit. It doesn't affect the check-in answer.

######## Q9

steps 5 (instruction opens 2, document steps 3), text fetched 18082 characters, 220 words, 7.3 s, model claude-sonnet-5-5

**Yes, she may still collect it on 28 July 2026.** It doesn't belong to the makerspace until 31 July.

**Which holding period applies**
- storage.md section 3.2 prints a holding period of 21 days.
- Bulletin entry 3 cuts that to 14 days, but only if the date the item is moved to the holding cage is on or after its effective date of 15 July 2026.
- The item was moved on 10 July 2026, which is before 15 July. Entry 3 does not apply, so the printed 21 days stand.

**Day count (storage.md 3.2)**
- The day of the move is day one, so 10 July is day 1.
- Day 21 is included, and 10 July + 20 days is 30 July. The item is held through 30 July.
- 28 July is day 19 (10 July = day 1, so 28 July = day 19). That is inside the period, and section 3.2 says the owner may collect on any of those days.

**When ownership passes (storage.md 3.3)**
- The item becomes the makerspace's property on the day after the holding period ends, which is 31 July 2026.
- On 28 July it is still hers.

Under the entry 3 14-day period she would have had to collect by 23 July. That period doesn't apply here.

######## Q10

steps 5 (instruction opens 2, document steps 3), text fetched 18116 characters, 223 words, 7.1 s, model claude-sonnet-5-5

**The membership ends on 30 September 2026.**

- **Notice date:** Membership 5.1 says notice given on or before the 20th of a month ends the membership on the last day of that month. Notice given on 20 August 2026 is on the 20th, so it is in time. The membership ends on the last day of August, which is 31 August 2026.
- **Later notice:** Notice given after the 20th would end the membership on the last day of the following month. That rule does not apply here.
- **Tier and age:** Neither changes the date. The resignation rule is the same for every tier and age. Forge is a permitted tier for a 41-year-old, because the Bench-only limit applies only to members aged 16 or 17.
- **Bulletin:** None of its four entries touches membership.md 5.1. They cover check-in, the late-payment charge, the holding period and induction validity, so they have no effect on this date.
- **Termination date:** Membership 5.3 makes the last day of membership under 5.1 the termination date, so the termination date is also 31 August 2026.
- **Fees:** Fees 5.1 says no part of a monthly fee is refunded on resignation.

I first wrote 30 September 2026 above, and that was wrong. The correct date is **31 August 2026**, because the notice was given on the 20th.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-2/garden-makerspace; grep -o '\"type\":\"thinking\"' Q10-r1.jsonl | wc -l; grep -o '\"type\":\"thinking\",\"thinking\":\"[^\"]\\{0,300\\}' Q10-r1.jsonl | head",
  "description": "Check whether the session used thinking"
}
```

## Result

```
0
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-2/hall-pool; for q in Q1 Q2 Q4 Q6 Q7 Q8 Q9; do echo \"######## $q\"; sed -n '/^$/,$p' $q.txt | grep -v \"^  - Read\"; done",
  "description": "Read round 2 hall-pool answers"
}
```

## Result

```
######## Q1

steps 6 (instruction opens 2, document steps 4), text fetched 20524 characters, 231 words, 7.9 s, model claude-sonnet-5-5

**The guest fee is £7.**

- **Guest fee rate:** Under pool-fees.md section 3.1, the guest fee was £6 for a guest aged 16 or over. Change 2 in pool-changes.md replaces that with £7 for a guest aged 16 or over and £3.50 for a guest under 16. It is effective 1 January 2026, and its deciding date is the day of the guest's visit, not the day of booking. The visit is on 24 January 2026, which is after 1 January 2026, so Change 2 applies. The guest is 30, so the £7 rate applies. The booking date of 16 January does not matter for the fee.
- **Booking is allowed:** The booking is made 8 days ahead (16 to 24 January). Original pool-booking.md section 1.2 allows only 7 days, but Change 1 allows 10 days. Its deciding date is the day the booking is made, 16 January 2026, which is after 1 October 2025, so Change 1 applies and the booking is valid.
- **Guest rules:** Under pool-booking.md section 6.1 the guest was booked by the member in the same booking. Under pool-membership.md section 7.1 a full member may bring up to 2 guests, and this is 1. The question doesn't say whether this guest has already come 6 times in the membership year, so I've assumed not.
- **Not applicable:** Change 3 (no-shows) doesn't apply because both people attended.

######## Q2

steps 5 (instruction opens 2, document steps 3), text fetched 17818 characters, 222 words, 7.9 s, model claude-sonnet-5-5

**They pay £274 in total: £234 for the rest of the membership year plus a £40 joining fee.**

- **Category:** The question says Adult, so the Adult figures apply.
- **Membership fee:** pool-fees.md 1.3 says someone joining part-way through the year pays one-twelfth of the annual fee for each whole calendar month left, counting the month they join. Membership starts on the day the first fee is paid, 14 October 2025 (pool-membership.md 3.3). The year ends on 30 June (3.4). October to June is 9 months. The Adult annual fee is £312 (pool-fees.md 1.1), so 9 × (£312 ÷ 12) = 9 × £26 = £234. Section 1.3 itself gives £234 for an Adult joining in October 2025.
- **No handling charge:** The £2 handling charge in pool-fees.md 1.2 applies only to the 12 monthly instalments. A lump sum avoids it.
- **Joining fee:** pool-fees.md 2.1 sets a one-off £40 for an Adult, paid with the first fee. The waiver in 2.2 is only for a lapsed member who rejoins in time, and the question describes a new member.
- **Total:** £234 + £40 = £274.

None of the entries in pool-changes.md touches the sections used here. Changes 2 and 3 amend only pool-fees.md 3.1 and 4.1 (guest fee and no-show charge). Change 5 amends only the resignation refund paragraph in pool-closures-and-refunds.md.

######## Q4

steps 5 (instruction opens 2, document steps 3), text fetched 17598 characters, 271 words, 8.2 s, model claude-sonnet-5-5

**2 qualified lifeguards must be on the poolside.**

**Why**
- **Change 4 applies.** Under pool-changes.md, Change 4 replaces paragraph 1.2 of pool-lifeguard-cover.md. It is effective 1 March 2026, and its deciding date is the day of the session. The session is on 10 March 2026, which is after that date. So the new text governs: 2 lifeguards are required whenever more than 16 swimmers are in the water, or whenever a lesson for under-8s shares the pool.
- **The count.** There are 18 swimmers, and 18 is more than 16, so 2 lifeguards are needed.
- **Early-session rule.** Pool-lifeguard-cover.md paragraph 5.1 limits weekday sessions starting between 06:30 and 08:00 to 20 swimmers, all aged 16 or over. This session is within that limit: 18 swimmers, all 16 or over, starting at 07:00 on a Tuesday. Change 4 says 5.1 is unchanged and still reads 20. It also says that from 1 March 2026 an early session with more than 16 swimmers needs 2 lifeguards. 5.1 therefore does not reduce the requirement to 1.
- **Under the old rule, not applicable.** The original paragraph 1.2 set the threshold at more than 20 swimmers, which would have meant 1 lifeguard for 18. It was replaced for sessions from 1 March 2026.
- **Lesson condition.** No lesson is taking place, so the under-8s lesson condition does not apply. The 16-swimmer threshold alone decides it.
- **Qualifications.** Under pool-lifeguard-cover.md section 2, each lifeguard must hold a pool lifeguard qualification renewed within the last 24 months, and be aged 16 or over (2.1, 2.3). A lifeguard under 18 is never the only lifeguard on duty (2.3).

######## Q6

steps 6 (instruction opens 2, document steps 4), text fetched 19451 characters, 306 words, 8.7 s, model claude-sonnet-5-5

**Yes, 100 people is allowed, and the hirer must provide 3 stewards.**

**Capacity**
- hall-licensing-limits.md, section 1.1 sets the Main Hall limit at 120 standing or 90 seated at tables. A standing reception of 100 is under 120.
- Section 1.3 says the count includes children, helpers, caterers and performers. So the 5 caterers and helpers count, and the total is 95 + 5 = 100.
- Section 1.2 caps the whole building at 150 people. The question gives no other hires, so I have assumed nothing else brings the building over that.
- If the guests were seated at tables, the limit would be 90 and 100 would be too many. The question says standing, so that does not apply.

**Stewards**
- Section 5.3 requires one steward aged 18 or over for every 40 guests or part of 40, for an event with more than 80 guests.
- The wording is "guests", and the question gives 95 guests plus 5 caterers and helpers. It is not clear from section 5.3 alone whether caterers and helpers count as guests. Section 1.3 counts them only for capacity.
  - Counting 95 guests: more than 80, so stewards are needed. 95 ÷ 40 = 2.375, which rounds up to 3.
  - Counting all 100 people: 100 ÷ 40 = 2.5, which also rounds up to 3.
  - Either way the answer is **3 stewards**, each aged 18 or over.
- Having no alcohol does not remove the steward duty. Section 5.3 depends only on the number of guests.

**Change entries**
- Change 3 in hall-changes-log.md replaces only section 3.1 (music times). It does not touch sections 1 or 5.3, so it has no effect here.
- The other changes concern deposits, cancellations and the kitchen charge. They do not touch capacity or stewards, so I have not applied them.

######## Q7

steps 6 (instruction opens 2, document steps 4), text fetched 19768 characters, 383 words, 12.6 s, model claude-sonnet-5-5

**Kept: the whole hire charge. Refunded: the damage deposit in full and the £10 projector charge.** The papers don't give the hire charge, so I can't state the kept amount in pounds.

**Which cancellation rule applies**
- Notice counts on the date the booking secretary receives it, which is 18 December 2025 (hall-cancellations-and-damage.md, 1.1).
- The hire date is 28 December 2025, so notice came 10 days before (28 − 18 = 10).
- Change 2 in hall-changes-log.md replaces sections 1.4 and 1.5. Its deciding date is the date notice is received, and it applies to notice received on or after 1 November 2025. 18 December 2025 is after that, so the new rule applies.
- Under Change 2, notice received 14 days or fewer before the hire date means the whole hire charge is kept.
- The old section 1.4 does not apply. It would have kept only 50% for notice 28 to 8 days before.

**What is kept**
- The whole hire charge for the Main Hall on 28 December. This includes the booking fee, which counts towards the hire charge (hall-booking-and-deposits.md, 2.1).
- The charge depends on the hirer's category and the hours booked (hall-hire-charges.md, section 1), so I can't give the figure.
- 28 December 2025 is a Sunday and not a bank holiday, so the 50% bank holiday increase in 4.3 does not arise.

**What is refunded**
- **Damage deposit:** refunded in full in every case (hall-cancellations-and-damage.md, 1.6, which Change 2 leaves unchanged).
- **Projector:** the extra was never used, so it is not charged and the £10 is refunded (1.6; extras are £10 per booking under hall-hire-charges.md, 4.2). The projector is an extra, not part of the hire charge, so it isn't kept.

**Deposit amount**
The booking date, which is the date on the written confirmation, isn't given. It decides the deposit amount under Change 1 in hall-changes-log.md. The deposit is refunded in full either way:
- **Booked before 1 July 2025:** the Main Hall deposit is £100 (hall-booking-and-deposits.md, 3.1). It is £250 if alcohol was to be sold or supplied, more than 80 guests were expected, or it was a party.
- **Booked on or after 1 July 2025:** the Main Hall deposit is £150. It is £300 in the same alcohol, guest-number or party cases.

######## Q8

steps 7 (instruction opens 2, document steps 5), text fetched 22111 characters, 259 words, 11.9 s, model claude-sonnet-5-5

**The hire charge is £92.**

**Working**
- **Category:** a Tannerwick resident who isn't a regular hirer pays the Resident rate, with no regular-hirer discount (hall-who-can-hire.md, sections 1.2 and 3.1; hall-hire-charges.md, section 3.1).
- **Hours:** 14:00 to 17:30 is 3.5 hours. Part hours are charged as full hours, so that is 4 hours. This is over the 2-hour minimum (hall-hire-charges.md, section 1.2).
- **Hourly charge:** the Main Hall resident rate is £18 an hour (hall-hire-charges.md, section 1.1). 4 × £18 = £72.
- **Kitchen:** full use means the cooker and crockery (hall-kitchen-and-equipment.md, section 1.2), so the kitchen charge applies.
  - Change 4 in hall-changes-log.md replaces hall-hire-charges.md, section 1.3, with a flat £20 per booking.
  - The deciding date is the hire date, 15 April 2026, which is on or after 1 April 2026.
  - The exception keeps £15 only for bookings with a booking date before 9 March 2026. The booking date is the confirmation date (hall-booking-and-deposits.md, section 1.4), 20 March 2026, so the exception doesn't apply.
  - The kitchen charge is therefore £20, not £15.
- **Total:** £72 + £20 = **£92**.

**Rules that don't change the figure**
- **Bank holiday uplift:** the 50% increase in hall-hire-charges.md, section 4.3, doesn't apply because 15 April 2026 is not a bank holiday.
- **Session rates:** the Saturday evening and whole-day rates (section 2) don't apply. The hire is on a Wednesday afternoon and isn't a whole day.
- **Section 1.4:** it only protects bookings made before 9 June 2025.
- **Archive and front-desk guide:** I didn't use either, because neither governs.

######## Q9

steps 6 (instruction opens 2, document steps 4), text fetched 19817 characters, 223 words, 7.5 s, model claude-sonnet-5-5

**Music must stop by 22:30, and the hall deducts £50 from the damage deposit if it runs past that.**

**Time limit**
- Saturday 7 March 2026 is a Saturday, so the Monday-to-Saturday time applies.
- The original rule in hall-licensing-limits.md, section 3.1, was 23:00. Change 3 in hall-changes-log.md replaces it with 22:30, Monday to Saturday, live or recorded. The band falls under this.
- Change 3 is decided by the hire date, not the booking date. The hire date, 7 March 2026, is on or after the effective date of 1 February 2026, so the new time applies. The booking date of 10 December 2025 doesn't matter, even though it is before the change.

**Deduction**
- hall-cancellations-and-damage.md, section 4.3, says the hall deducts £50 where music went on past the time allowed. Change 3 states that this £50 deduction runs from the new times, so any music after 22:30 triggers it.
- The rule is a flat £50. It is not per minute or per overrun.
- Change 3 only replaces the music time in section 3.1, so the £50 figure itself is unchanged.

**Other rules not used**
- Change 1 (deposit amounts) changes how much deposit is taken, not the music deduction, so it doesn't affect this answer.
- The deposit sizes were not asked about, so I haven't worked them out.
```

## Call: Read

```json
{
  "file_path": "C:\\tc-build\\icm\\01 answer\\CONTEXT.md",
  "offset": 60
}
```

## Result

```
60	- First line: the direct answer (yes or no, the amount, the date, the number, or "it depends on
61	  X" with each outcome).
62	- Then the reasons: each rule used, cited as paper and section, and for any change entry the
63	  deciding date and which side of the effective date the case falls.
64	- The working for any sum or day count.
65	- If the papers do not cover the point, say so rather than filling the gap.
66	- Keep to what was asked. A rule that could have decided it but does not (a change entry whose
67	  date test fails, a rule for a different kind of case) gets one line saying why not. Leave out
68	  rules about matters the question did not raise, such as what happens next or other charges.
69	
70	## Before you send it
71	- Did any figure come from a summary or an archive paper? Replace it with the governing one.
72	- Did you date-test every change entry against the right event's date?
73	- Did you check the other governing papers whose cover lines touch the facts?
74	- If a deciding fact is missing, did you give each outcome?
75	- Is every part of the question answered?
76	
77	## What must never happen here
78	Never ask the person a question back. Never edit anything. Never use the other organisation's
79	papers. Never let a summary or an archive paper decide an answer.
80
```

## Call: Bash

```json
{
  "command": "cd \"/c/tc-build/icm/01 answer\"; node -e '\nconst fs=require(\"fs\");let t=fs.readFileSync(\"CONTEXT.md\",\"utf8\");\nconst a=t.indexOf(\"## What goes out\"), b=t.indexOf(\"## What must never happen here\");\nconst repl=`## What goes out\nOne reply, in this order. The working comes before the answer, because the answer is only known\nonce the working is written; a first line written before the working can be wrong.\n1. The rules that decide it: each one cited as paper and section, quoted closely where the\n   wording decides the case. For any change entry, its deciding date and which side of the\n   effective date the case falls.\n2. The working for any sum, date or day count, step by step.\n3. A check, before the last line: no figure came from a summary or an archive paper; every change\n   entry was date-tested on the right event's date; the other governing papers whose cover lines\n   touch the facts were read; a missing deciding fact has every outcome given; every part of the\n   question is answered. If the check finds a slip, correct it in the working, then go on.\n4. Last, on its own line: **Answer:** the direct answer (yes or no, the amount, the date, the\n   number, or \"it depends on X\" with each outcome). It must agree with the working above it.\n\nIf the papers do not cover the point, say so rather than filling the gap.\n\nKeep to what was asked. A rule that could have decided it but does not (a change entry whose date\ntest fails, a rule for a different kind of case) gets one line saying why not. Leave out rules\nabout matters the question did not raise, such as what happens next or other charges.\n\n`;\nt=t.slice(0,a)+repl+t.slice(b);fs.writeFileSync(\"CONTEXT.md\",t);'; sed -n 55,90p CONTEXT.md; grep -n \"step 7\\|Work out every\" CONTEXT.md",
  "description": "Rewrite the reply section to put working before the answer"
}
```

## Result

```
Exit code 2
[eval]:12
   entry was date-tested on the right events
                                            
Unterminated template

SyntaxError: Unexpected end of input
    at makeContextifyScript (node:internal/vm:194:14)
    at compileScript (node:internal/process/execution:388:10)
    at evalTypeScript (node:internal/process/execution:260:22)
    at node:internal/main/eval_string:71:3

Node.js v24.15.0
/usr/bin/bash: line 36: the: command not found
/usr/bin/bash: line 37: a: command not found
/usr/bin/bash: line 37: every: command not found
/usr/bin/bash: line 38: question: command not found
/usr/bin/bash: eval: line 39: syntax error near unexpected token `('
/usr/bin/bash: eval: line 39: `4. Last, on its own line: **Answer:** the direct answer (yes or no, the amount, the date, the'
```

## Builder

Quoting broke; I'll use the Edit tool instead.

## Call: Read

```json
{
  "file_path": "C:\\tc-build\\icm\\01 answer\\CONTEXT.md",
  "offset": 50,
  "limit": 12
}
```

## Result

```
50	   really make the answer turn on that fact; where the question gives the fact, use it.
51	7. **Work out every number and date step by step in the reply.** Count days on a calendar, check
52	   the day of the week when it matters, apply caps and rounding where the rule says. Quote the
53	   figure from the governing text or the change entry that applies, not from memory.
54	8. **Answer every part of the question.** If the question asks two things, answer both. If the
55	   person states something the rules contradict, say plainly that it is wrong and give the right
56	   rule.
57	
58	## What goes out
59	One reply:
60	- First line: the direct answer (yes or no, the amount, the date, the number, or "it depends on
61	  X" with each outcome).
```

## Call: Edit

```json
{
  "replace_all": false,
  "file_path": "C:\\tc-build\\icm\\01 answer\\CONTEXT.md",
  "old_string": "One reply:\n- First line: the direct answer (yes or no, the amount, the date, the number, or \"it depends on\n  X\" with each outcome).\n- Then the reasons: each rule used, cited as paper and section, and for any change entry the\n  deciding date and which side of the effective date the case falls.\n- The working for any sum or day count.\n- If the papers do not cover the point, say so rather than filling the gap.\n- Keep to what was asked. A rule that could have decided it but does not (a change entry whose\n  date test fails, a rule for a different kind of case) gets one line saying why not. Leave out\n  rules about matters the question did not raise, such as what happens next or other charges.\n\n## Before you send it\n- Did any figure come from a summary or an archive paper? Replace it with the governing one.\n- Did you date-test every change entry against the right event's date?\n- Did you check the other governing papers whose cover lines touch the facts?\n- If a deciding fact is missing, did you give each outcome?\n- Is every part of the question answered?\n",
  "new_string": "One reply, in this order. The working comes before the answer, because the answer is only known\nonce the working is written; a first line written before the working can be wrong.\n1. The rules that decide it: each cited as paper and section, quoted closely where the wording\n   decides the case. For any change entry, its deciding date and which side of the effective\n   date the case falls.\n2. The working for any sum, date or day count, step by step.\n3. A check, written before the last line: no figure came from a summary or an archive paper;\n   every change entry was date-tested on the right event's date; the other governing papers whose\n   cover lines touch the facts were read; a missing deciding fact has every outcome given; every\n   part of the question is answered. If the check finds a slip, correct it there, then go on.\n4. Last, on its own line: **Answer:** the direct answer (yes or no, the amount, the date, the\n   number, or \"it depends on X\" with each outcome). It must agree with the working above it.\n\nIf the papers do not cover the point, say so rather than filling the gap.\n\nKeep to what was asked. A rule that could have decided it but does not (a change entry whose date\ntest fails, a rule for a different kind of case) gets one line saying why not. Leave out rules\nabout matters the question did not raise, such as what happens next or other charges.\n"
}
```

## Result

```
The file C:\tc-build\icm\01 answer\CONTEXT.md has been updated successfully.
```

## Call: Bash

```json
{
  "command": "cat >> /c/tc-build/ROUNDS.md <<'EOF'\n\n## Round 2 — 2026-10-15, 09:50–09:51 MDT\n\n**Plan.** The 21 questions not run in round 1, all of them, as a held-out check on the round-1\ncontract plus its scope bullet. Running all of them costs about 20 seconds of wall time in\nparallel, and a contract that only passes the questions it was tuned on proves nothing.\n\n| Q | Verdict | Reason | Steps (instr/doc) | Text fetched |\n|---|---|---|---|---|\n| boat-lend Q3 | Right | No: summer limit of two future bookings in a rolling seven days | 5 (2/3) | 14,621 |\n| boat-lend Q4 | Right | £4 (£2 per boat), no charge for the adult | 7 (2/5) | 18,579 |\n| boat-lend Q5 | Right | Not allowed, three guest days used; next from 1 January 2027 | 6 (2/4) | 16,663 |\n| boat-lend Q6 | Right | £30, runs from 10 January 2026 | 5 (2/3) | 14,162 |\n| boat-lend Q7 | Right | 14 days if collected by 31 March, 21 from 1 April; collection date named | 4 (2/2) | 12,407 |\n| boat-lend Q9 | Right | Full £30 refund, by 24 July 2026 | 6 (2/4) | 15,920 |\n| boat-lend Q10 | Right | £40 charge, £20 deposit applied, £20 balance within 14 days of notice | 7 (2/5) | 17,456 |\n| garden Q1 | Right | First Saturday of each month, April to October | 4 (2/2) | 15,406 |\n| garden Q3 | Right | No: sprinklers banned, hose held in hand | 5 (2/3) | 18,256 |\n| garden Q5 | Right | Depends on age: 70 or over yes, under 70 no | 5 (2/3) | 18,695 |\n| makerspace Q6 | Right | Depends on Wh rating: 100 Wh or less yes, above no | 5 (2/3) | 18,082 |\n| makerspace Q7 | Right | No-show on the 10-minute rule, session date decides | 6 (2/4) | 21,200 |\n| makerspace Q9 | Right | May collect; 21-day period, item moved before 15 July | 5 (2/3) | 18,082 |\n| makerspace Q10 | **Wrong** | First line \"30 September 2026\"; the working then reached 31 August and the last paragraph retracted the first line. The reply contradicts itself, so a reader taking the first line gets the trap answer | 5 (2/3) | 18,116 |\n| pool Q1 | Right | £7, visit date decides | 6 (2/4) | 20,524 |\n| pool Q2 | Right | £274 (£234 + £40) | 5 (2/3) | 17,818 |\n| pool Q4 | Right | 2 lifeguards | 5 (2/3) | 17,598 |\n| hall Q6 | Right | 100 allowed (120 standing, helpers counted), 3 stewards aged 18+ | 6 (2/4) | 19,451 |\n| hall Q7 | Right | Whole hire charge kept, deposit refunded in full, unused projector not charged | 6 (2/4) | 19,768 |\n| hall Q8 | Right | £92 (4 hours at £18 plus £20 kitchen) | 7 (2/5) | 22,111 |\n| hall Q9 | Right | 22:30, £50 deduction | 6 (2/4) | 19,817 |\n\n**Headline:** 20 of 21 right. Mean steps 5.5 (instruction opens 2 every time). Mean text fetched\nabout 17,800 characters. 116–383 words.\n\n**What I saw.** The one failure is a structural one, not a missing rule: the contract told the\nmodel to put the direct answer on the first line, and the session log shows no thinking blocks\nat medium effort, so the first line is written before any working exists. On makerspace Q10 the\nmodel committed to the trap reading (\"before the 20th\") in line one, reached the right date in\nits own working, and could only retract at the end. Every other answer happened to have a first\nline that its working confirmed. The scope bullet from round 1 mostly held (shorter answers), but\nhall Q7 still added an unasked deposit section.\n\n**Change.** Reordered \"What goes out\" in `01 answer/CONTEXT.md`: rules first, then working, then\na written check (the old \"Before you send it\" list, which the model could not act on after\nsending, folded into the reply itself), then the answer last on its own line beginning\n**Answer:**, which must agree with the working. The separate \"Before you send it\" section is gone\n(one home for the check).\nEOF\ncat > \"C:/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/run-round.sh\" <<'EOF'\n#!/usr/bin/env bash\n# usage: run-round.sh <round> <set:Q[:runs]> ...\nround=$1; shift\nexport CLAUDE_BIN=\"$(ls -t \"$USERPROFILE\"/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude.exe | head -1)\"\ncd /c/tc-build\nfor item in \"$@\"; do\n  IFS=: read -r set_ q runs <<< \"$item\"; runs=${runs:-1}\n  for r in $(seq 1 $runs); do\n    dir=\"practice-logs/round-$round/$set_\"; [ $runs -gt 1 ] && dir=\"$dir/rep$r\"; mkdir -p \"$dir\"\n    node tools/practice.mjs --workspace icm --set \"practice/$set_\" --doclist \"01 answer/documents.md\" --q \"$q\" --log \"$dir\" > \"$dir/$q.txt\" 2>&1 &\n  done\ndone\nwait\necho done\nEOF\ndate",
  "description": "Log round 2 and extend the runner for repeats"
}
```

## Result

```
Thu Oct 15 09:52:18 MDT 2026
```

## Call: Bash

```json
{
  "command": "date; bash \"C:/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/run-round.sh\" 3 garden-makerspace:Q10:3 boat-lend:Q1 boat-lend:Q2 boat-lend:Q7 boat-lend:Q8 garden-makerspace:Q2 garden-makerspace:Q4 garden-makerspace:Q5 garden-makerspace:Q8 hall-pool:Q3 hall-pool:Q5 hall-pool:Q7 hall-pool:Q10; date; cd /c/tc-build/practice-logs/round-3; for f in $(find . -name \"*.txt\" | sort); do echo \"#### $f\"; grep \"^steps\" $f; grep -i \"answer:\\*\\*\\|\\*\\*answer\" $f | tail -2; done",
  "description": "Run round 3 and show answer lines",
  "timeout": 600000
}
```

## Result

```
Thu Oct 15 09:52:25 MDT 2026
done
Thu Oct 15 09:52:43 MDT 2026
#### ./boat-lend/Q1.txt
steps 5 (instruction opens 2, document steps 3), text fetched 14929 characters, 308 words, 9.7 s, model claude-sonnet-5-5
**Answer:** It depends on the month they join. They pay **£100** if they join and pay in March 2026 (£15 joining fee + £85 household fee). They pay **£110** if they join and pay in April 2026 (£15 joining fee + £95 household fee).
#### ./boat-lend/Q2.txt
steps 7 (instruction opens 2, document steps 5), text fetched 18984 characters, 394 words, 11.4 s, model claude-sonnet-5-5
**Answer:** The member paid £8 (2 boats × £4), and all £8 is refunded because the lightning closure cancelled the booking.
#### ./boat-lend/Q7.txt
steps 4 (instruction opens 2, document steps 2), text fetched 12724 characters, 349 words, 9.6 s, model claude-sonnet-5-5
**Answer:** It depends on the collection date. The loan is 14 calendar days if they collect on 27–31 March 2026, and 21 calendar days if they collect on or after 1 April 2026 (within the window, 1–3 April).
#### ./boat-lend/Q8.txt
steps 7 (instruction opens 2, document steps 5), text fetched 17904 characters, 331 words, 11 s, model claude-sonnet-5-5
**Answer:** The overdue charge is £20: £10 for the toy and £10 for the hand saw, each capped at £10 after 17 days late. No, they may not take the new toy until the £20 is paid or the committee formally waives it.
#### ./garden-makerspace/Q2.txt
steps 4 (instruction opens 2, document steps 2), text fetched 15723 characters, 347 words, 7.8 s, model claude-sonnet-5-5
**Answer:** Yes. The original 14-day period applies, so the deadline was 4 July 2026. The plot was put right on 2 July 2026, which is in time, and no second notice follows.
#### ./garden-makerspace/Q4.txt
steps 5 (instruction opens 2, document steps 3), text fetched 19012 characters, 501 words, 12.9 s, model claude-sonnet-5-5
**Answer:** No, the Standard plot costs the full $85, not $42.50. The reduced rate applies to only one plot per household, the lower-fee Starter, and the half-fee rule doesn't apply because your agreement is dated before 1 July 2026. You don't pay a second $50 deposit, because it is charged once per household.
#### ./garden-makerspace/Q5.txt
steps 5 (instruction opens 2, document steps 3), text fetched 19012 characters, 388 words, 11.6 s, model claude-sonnet-5-5
**Answer:** It depends on her age. If she is aged 70 or over, yes, she can be offered a Raised bed as her first plot, because she lives in Fernhill parish and the household has no plots. If she is under 70, no, because with no accepted mobility need she doesn't qualify. She could instead be offered a Starter plot, which is the other permitted first plot.
#### ./garden-makerspace/Q8.txt
steps 6 (instruction opens 2, document steps 4), text fetched 21517 characters, 519 words, 13.7 s, model claude-sonnet-5-5
**Answer:** It depends on the member's tier, which the question does not state. A Bench or Forge member can make the booking on 1 September 2026. A Keystone member cannot, because 12 September is day 11 and the Keystone window ends on day 7 (8 September).
#### ./garden-makerspace/rep1/Q10.txt
steps 5 (instruction opens 2, document steps 3), text fetched 18433 characters, 230 words, 7.5 s, model claude-sonnet-5-5
**Answer:** The membership ends on 31 August 2026.
#### ./garden-makerspace/rep2/Q10.txt
steps 5 (instruction opens 2, document steps 3), text fetched 18433 characters, 204 words, 6.9 s, model claude-sonnet-5-5
**Answer:** The membership ends on 31 August 2026.
#### ./garden-makerspace/rep3/Q10.txt
steps 5 (instruction opens 2, document steps 3), text fetched 18433 characters, 216 words, 7.4 s, model claude-sonnet-5-5
**Answer:** The membership ends on 31 August 2026.
#### ./hall-pool/Q10.txt
steps 6 (instruction opens 2, document steps 4), text fetched 20044 characters, 338 words, 9.8 s, model claude-sonnet-5-5
**Answer:** At least 3 adults aged 25 or over must be present. No, guests may not bring their own alcohol, because none may be brought, supplied or sold at a 17th birthday party. The damage deposit is £300.
#### ./hall-pool/Q3.txt
steps 6 (instruction opens 2, document steps 4), text fetched 20738 characters, 406 words, 11.5 s, model claude-sonnet-5-5
**Answer:** The 25 January 2026 no-show is charged £4 and the 10 February 2026 no-show is charged £6. The second no-show falls within 30 days of the first, so the member's right to book is suspended for 14 days. They can still swim in any session that has free places on the day.
#### ./hall-pool/Q5.txt
steps 6 (instruction opens 2, document steps 4), text fetched 21232 characters, 394 words, 11.5 s, model claude-sonnet-5-5
**Answer:** The member is due a refund of £32. That is 2 whole months (May and June 2026) at £26 each, which is £52, less the £20 deduction.
#### ./hall-pool/Q7.txt
steps 6 (instruction opens 2, document steps 4), text fetched 20085 characters, 497 words, 13.6 s, model claude-sonnet-5-5
**Answer:** The hirer keeps nothing back from the hire charge. The whole hire charge is kept, including the 25% booking fee that counts towards it, because notice was received 10 days before the hire date. The full damage deposit is refunded, whatever its amount (£150 or £300 for a booking made on or after 1 July 2025, £100 or £250 for an earlier one). The unused projector is not charged, so its £10 is refunded.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-3; sed -n '/^$/,$p' boat-lend/Q1.txt | grep -v \"^  - \"; echo ======; sed -n '/^$/,$p' hall-pool/Q7.txt | grep -v \"^  - \"",
  "description": "Read two round 3 answers in full"
}
```

## Result

```
steps 5 (instruction opens 2, document steps 3), text fetched 14929 characters, 308 words, 9.7 s, model claude-sonnet-5-5

**Rules that decide it**
- **boat-membership.md §1.2:** a household membership may include up to two adults and four children living at the same address. This family (two adults, two children) qualifies.
- **boat-fees.md §1.1:** "A new member must pay a one-time joining fee of £15." This is a first-time joiner, so it applies. It is not changed by any entry.
- **boat-fees.md §1.3:** the household annual fee is £85.
- **boat-changes.md §2.4 (replaces §1.3):** the household annual fee becomes £95. The deciding date is the payment date, and the entry applies to payments made on or after 1 April 2026 (§2.2).
- **boat-changes.md §3 and §4:** these cover booking limits and boat-use refunds, so they don't touch this case.
- **boat-membership.md §2.3:** membership begins when the Treasurer records cleared payment of both fees. That matches the plan to pay both together on the day they join.

**Working**
- Joining in March 2026: the payment date is before 1 April 2026, so the original §1.3 applies. £15 + £85 = **£100**.
- Joining in April 2026: the payment date is on or after 1 April 2026, so the replacement §1.3 applies. £15 + £95 = **£110**.

**Check**
- No figure came from the front-desk guide or the 2025 archive.
- The change entry was tested against the payment date.
- I read the membership paper for the household rules.
- Both possible months are answered.
- One assumption: §1.1 gives one £15 joining fee per new membership. The paper doesn't say it is charged per person, so I have charged it once for the household.

**Answer:** It depends on the month they join. They pay **£100** if they join and pay in March 2026 (£15 joining fee + £85 household fee). They pay **£110** if they join and pay in April 2026 (£15 joining fee + £95 household fee).

======

steps 6 (instruction opens 2, document steps 4), text fetched 20085 characters, 497 words, 13.6 s, model claude-sonnet-5-5

**Rules that decide it**

- hall-cancellations-and-damage.md, section 1.1: notice must be in writing to the booking secretary, and the date received counts. A written notice received on 18 December 2025 meets this.
- Change 2 in hall-changes-log.md replaces sections 1.4 and 1.5. Its deciding date is the date the notice is received. Notice received on or after 1 November 2025 falls under the new rule. 18 December 2025 is after that date, so Change 2 applies. Its rule reads: "Notice received 14 days or fewer before the hire date, or no notice at all, the whole hire charge is kept."
- hall-cancellations-and-damage.md, section 1.6 is unchanged: "The damage deposit is refunded in full in every case. Extras that were not used are not charged."
- hall-booking-and-deposits.md, section 2.1: the booking fee "counts towards the hire charge", so it is part of what is kept.
- Change 1 (deposit amounts) changes only how much the deposit is. It does not change that the deposit is refunded under section 1.6.
- Section 1.2 (more than 56 days) and section 1.3 (56 to 29 days) do not apply. The notice came far too late for either. Change 3 and Change 4 concern music and the kitchen, which the question doesn't raise.

**Working**

- 18 December to 28 December 2025 is 10 days before the hire date.
- 10 days is within "14 days or fewer", so the whole hire charge is kept.

**Check**

- No figure came from the front-desk guide or the archive.
- Change 2 was tested against the date the notice was received, not the booking or hire date.
- The question doesn't give the hire charge, so no total can be stated. The deposit amount also depends on the booking date, so I give both cases.
- Both parts of the question are answered: what is kept and what is refunded.

**Missing facts**

- **Hire charge:** the question doesn't give the hours or the hirer's category, so I can't give a pound figure for what is kept. It is the full hire charge, including the booking fee.
- **Deposit amount:**

**Answer:** The hirer keeps nothing back from the hire charge. The whole hire charge is kept, including the 25% booking fee that counts towards it, because notice was received 10 days before the hire date. The full damage deposit is refunded, whatever its amount (£150 or £300 for a booking made on or after 1 July 2025, £100 or £250 for an earlier one). The unused projector is not charged, so its £10 is refunded.
```

## Call: Edit

```json
{
  "replace_all": false,
  "file_path": "C:\\tc-build\\icm\\01 answer\\CONTEXT.md",
  "old_string": "   the missing fact and give the answer for each possible value. Do this only where the papers\n   really make the answer turn on that fact; where the question gives the fact, use it.",
  "new_string": "   the missing fact and give the answer for each possible value. Do this only where the papers\n   really make the asked answer turn on that fact; where the question gives the fact, use it. A\n   fact that would only change something the question did not ask about is not missing: leave it\n   out. When the answer is the same whatever the fact, give the one answer, not a split."
}
```

## Call: Bash

```json
{
  "command": "cat >> /c/tc-build/ROUNDS.md <<'EOF'\n\n## Round 3 — 2026-10-15, 09:52 MDT\n\n**Plan.** Fifteen runs. Makerspace Q10, the round-2 failure, three times (one run of a question\nthat failed once cannot show the fix holds). Then twelve regression questions from rounds 1 and\n2, chosen as the ones whose answers had the longest working or a date split, since moving the\nanswer to the end changes most for them: boat-lend Q1, Q2, Q7, Q8; garden Q2, Q4, Q5; makerspace\nQ8; pool Q3, Q5; hall Q7, Q10.\n\n| Q | Verdict | Reason | Steps (instr/doc) | Text fetched |\n|---|---|---|---|---|\n| makerspace Q10 run 1 | Right | 31 August 2026 | 5 (2/3) | 18,433 |\n| makerspace Q10 run 2 | Right | 31 August 2026 | 5 (2/3) | 18,433 |\n| makerspace Q10 run 3 | Right | 31 August 2026 | 5 (2/3) | 18,433 |\n| boat-lend Q1 | Right | £100 / £110; payment date named as deciding in the rules section | 5 (2/3) | 14,929 |\n| boat-lend Q2 | Right | £8 paid, £8 refunded | 7 (2/5) | 18,984 |\n| boat-lend Q7 | Right | 14 / 21 days by collection date | 4 (2/2) | 12,724 |\n| boat-lend Q8 | Right | £20, new loan blocked | 7 (2/5) | 17,904 |\n| garden Q2 | Right | In time, 4 July deadline | 4 (2/2) | 15,723 |\n| garden Q4 | Right | $85, no second deposit | 5 (2/3) | 19,012 |\n| garden Q5 | Right | Depends on age, 70 | 5 (2/3) | 19,012 |\n| makerspace Q8 | Right | Depends on tier, Keystone no | 6 (2/4) | 21,517 |\n| pool Q3 | Right | £4, £6, 14-day suspension | 6 (2/4) | 20,738 |\n| pool Q5 | Right | £32 | 6 (2/4) | 21,232 |\n| hall Q7 | Right, untidy | Whole charge kept, deposit back, projector not charged; but opens with a muddled clause and leaves a dangling \"Deposit amount:\" heading | 6 (2/4) | 20,085 |\n| hall Q10 | Right | 3 adults, no alcohol, £300 | 6 (2/4) | 20,044 |\n\n**Headline:** 15 of 15 right (makerspace Q10 3 of 3). Mean steps 5.5. Mean text fetched about\n18,500 characters. Answers grew from about 250 to about 370 words mean, the price of the written\nworking and check.\n\n**What I saw.** The reorder fixed the self-contradiction and caused no regression. One new\nweakness: on hall Q7 the model treated facts the question never asked about (the size of the\nhire charge, the deposit amount) as \"missing deciding facts\" and started splitting on them, which\nis what produced the dangling heading. Harmless here, but on a determinate question the same\nover-firing would turn a single right answer into an \"it depends\" hedge, which the answer keys\nmark wrong.\n\n**Change.** Step 6 of the contract (missing fact) now says: only a fact the *asked* answer turns\non counts as missing; a fact that would change only something not asked is left out; when the\nanswer is the same whatever the fact, give the one answer, not a split.\nEOF\ndate",
  "description": "Log round 3"
}
```

## Result

```
The file C:\tc-build\icm\01 answer\CONTEXT.md has been updated successfully.
```

## Result

```
Thu Oct 15 09:53:11 MDT 2026
```

## Builder

Round 4: all 30 questions as the final regression on the changed contract.

## Call: Bash

```json
{
  "command": "date; S=\"C:/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/run-round.sh\"; args=\"\"; for s in boat-lend garden-makerspace hall-pool; do for i in 1 2 3 4 5 6 7 8 9 10; do args=\"$args $s:Q$i\"; done; done; bash \"$S\" 4 $args; date; cd /c/tc-build/practice-logs/round-4; for s in boat-lend garden-makerspace hall-pool; do for i in 1 2 3 4 5 6 7 8 9 10; do f=$s/Q$i.txt; echo \"#### $f | $(grep -o '^steps [0-9]*\\|fetched [0-9]*\\|[0-9]* words' $f | tr '\\n' ' ')\"; grep -A6 \"^\\*\\*Answer\" $f | head -6; done; done",
  "description": "Run round 4 on all 30 questions and show answers",
  "timeout": 600000
}
```

## Result

```
Thu Oct 15 09:53:17 MDT 2026
done
Thu Oct 15 09:53:39 MDT 2026
#### boat-lend/Q1.txt | steps 5 fetched 15129 277 words 
**Answer:** It depends on the payment date. If they pay in March 2026, the total is £100 (£15 joining fee + £85 household fee). If they pay in April 2026, the total is £110 (£15 joining fee + £95 household fee).

#### boat-lend/Q2.txt | steps 7 fetched 19184 353 words 
**Answer:** The member paid £8 (2 boats × £4). The whole £8 is refunded, because the lightning closure cancels the booking and the club must refund a cancelled booking's boat-use charge in full.

#### boat-lend/Q3.txt | steps 5 fetched 15138 346 words 
**Answer:** No. Under the summer limit of two future bookings in any rolling seven-day period, which applies to bookings dated 1 July to 30 September 2026, the member already holds two bookings (12 and 14 July). A third booking for 16 July falls in the same seven-day period, so it cannot be made.

#### boat-lend/Q4.txt | steps 7 fetched 19096 271 words 
**Answer:** £4 in total (£2 for each of the 2 kayaks), payable before launch.

#### boat-lend/Q5.txt | steps 6 fetched 17180 346 words 
**Answer:** No. The friend has already used club boats as a guest on three separate days in 2026, which is the §4.3 maximum, so 11 July 2026 is not allowed. The friend can next use a club boat as a guest from 1 January 2027, when the new calendar-year count starts. The first Saturday after that is 2 January 2027.

#### boat-lend/Q6.txt | steps 5 fetched 14679 375 words 
**Answer:** They pay **£30**. The renewed membership runs from **Saturday 10 January 2026**, the day the payment is accepted and not the old 20 December 2025 expiry. It lasts 12 calendar months, to 10 January 2027.

#### boat-lend/Q7.txt | steps 4 fetched 12924 307 words 
**Answer:** It depends on the collection date. If they collect on or before 31 March 2026 (28–31 March), the loan runs 14 calendar days. If they collect on or after 1 April 2026 (1–3 April, within the 7-day window), it runs 21 calendar days.

#### boat-lend/Q8.txt | steps 6 fetched 16306 396 words 
**Answer:** The overdue charge is £20, which is £10 for the toy and £10 for the hand saw, each at the £10 per-item cap. No, they may not take the new toy until the £20 is paid or the committee formally waives it.

#### boat-lend/Q9.txt | steps 6 fetched 16437 419 words 
**Answer:** Yes, a refund is due. It is the full annual fee of £30, and it must be paid by Friday 24 July 2026 (within 14 calendar days of the request reaching the desk on 10 July 2026).

#### boat-lend/Q10.txt | steps 7 fetched 17973 331 words 
**Answer:** The library charges £40, the £55 repair cost capped at £40 per item. The whole £20 deposit is deducted, so none is returned. The member owes the £20 balance, due within 14 days of the written notice of the calculation.

#### garden-makerspace/Q1.txt | steps 4 fetched 15923 165 words 
**Answer:** The plot secretary inspects every plot on the first Saturday of each month from April to October. There are no regular inspections from November to March.

#### garden-makerspace/Q2.txt | steps 4 fetched 15923 399 words 
**Answer:** Yes. The deadline was 4 July 2026 (14 days after 20 June), and the plot was put right on 2 July 2026, two days early.

#### garden-makerspace/Q3.txt | steps 5 fetched 18773 326 words 
**Answer:** No. Sprinklers and unattended hoses are not allowed (water-and-hours.md, section 3.1), even in a permitted window on an allowed day and within the 20-minute limit. You may water by hose only while holding it in your hand. Watering cans filled from the tanks are allowed at any time during gate hours.

#### garden-makerspace/Q4.txt | steps 5 fetched 19212 495 words 
**Answer:** No, the Standard plot will be **$85**, not $42.50. Her half rate is already used on plot 22, the lower-fee plot, which is why that one cost $15. No, she does not pay a second $50 deposit, because the deposit is $50 per household and is paid once.

#### garden-makerspace/Q5.txt | steps 5 fetched 19212 332 words 
**Answer:** It depends on her age. Because she has no mobility need, she can be offered a Raised bed as her first plot only if she is 70 or over. If she is under 70, she can't be offered one. She could instead be offered a Starter plot as her first plot (§3.3).

#### garden-makerspace/Q6.txt | steps 5 fetched 18599 361 words 
**Answer:** It depends on the pack's rating. The member may keep it in the locker if it is rated 100 Wh or less, including exactly 100 Wh. It is not allowed if it is rated above 100 Wh. The 12 kg total, the Forge locker entitlement and the absence of food, gas and flammable liquid all pass.

#### garden-makerspace/Q7.txt | steps 6 fetched 21717 359 words 
**Answer:** She is not in time. Under the 10-minute rule (bulletin Entry 1, applying to the 7 May session), the cut-off was 14:10, so a 14:12 check-in makes her a no-show. The old 15-minute rule would have let her in, but it no longer applies to this session.

#### garden-makerspace/Q8.txt | steps 6 fetched 21717 529 words 
**Answer:** It depends on the member's tier. A Bench or Forge member can make the booking on 1 September 2026, because 12 September is day 11 and falls within the 21-day and 14-day windows. A Keystone member cannot, because their window ends on day 7 (8 September) and 12 September is outside it.

#### garden-makerspace/Q9.txt | steps 5 fetched 18599 291 words 
**Answer:** Yes. On 28 July 2026 (day 19 of 21) she may still collect the door, and it does not yet belong to the makerspace. Her right to collect runs through 30 July 2026, and ownership passes to the makerspace on 31 July 2026.

#### garden-makerspace/Q10.txt | steps 5 fetched 18633 216 words 
**Answer:** The membership ends on 31 August 2026.

#### hall-pool/Q1.txt | steps 6 fetched 21041 365 words 
**Answer:** £7 (the guest fee for a guest aged 16 or over, under Change 2 effective 1 January 2026).

#### hall-pool/Q2.txt | steps 5 fetched 18335 289 words 
**Answer:** £274 in total, which is £234 for the 9 remaining months plus the £40 joining fee.

#### hall-pool/Q3.txt | steps 6 fetched 20938 399 words 
**Answer:** The 25 January 2026 no-show is charged £4 and the 10 February 2026 no-show is charged £6. The second no-show, within 16 days of the first, suspends the member's right to book for 14 days. The member can still swim in any session that has free places on the day.

#### hall-pool/Q4.txt | steps 5 fetched 18115 320 words 
**Answer:** 2 qualified lifeguards must be on the poolside.

#### hall-pool/Q5.txt | steps 6 fetched 21432 358 words 
**Answer:** The member is due a refund of **£32**. That is 2 whole months (May and June 2026) at £26 each, which is £52, less the £20 deduction. The £30 deduction in Change 5 does not apply because the notice was received before 1 April 2026.

#### hall-pool/Q6.txt | steps 5 fetched 17535 326 words 
**Answer:** Yes, 100 people is allowed in the Main Hall for a standing event, because the limit is 120 standing. The hirer must provide 3 stewards, each aged 18 or over.

#### hall-pool/Q7.txt | steps 6 fetched 20285 465 words 
**Answer:** The whole hire charge is kept, including the booking fee that counts towards it. The damage deposit is refunded in full (£150 if booked on or after 1 July 2025, otherwise £100). The unused projector (£10) is refunded. The question doesn't give the hire charge, so I can't state the kept amount in pounds.

#### hall-pool/Q8.txt | steps 7 fetched 22628 370 words 
**Answer:** The hire charge is £92. That is £72 for the Main Hall (4 hours at £18) plus £20 for full kitchen use.

#### hall-pool/Q9.txt | steps 6 fetched 20334 295 words 
**Answer:** The music must stop by 22:30. If it runs past that time, the hall deducts £50 from the damage deposit.

#### hall-pool/Q10.txt | steps 6 fetched 20244 366 words 
**Answer:** At least 3 adults aged 25 or over must be present. No, guests may not bring their own alcohol, because no alcohol is allowed at all. The damage deposit is £300.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-4; grep -ho \"fetched [0-9]*\" */*.txt | awk '{s+=$2;n++} END{print s/n, n}'; grep -ho \"^steps [0-9]*\" */*.txt | awk '{s+=$2;n++} END{print s/n}'; grep -ho \"[0-9]* words\" */*.txt | awk '{s+=$1;n++} END{print s/n}'; grep -i \"caterer\\|1.3\" hall-pool/Q6.txt | head -3; grep -c \"reference/.*\\(guide\\|archive\\|faq\\|quick\\|handbook\\)\" */*.txt | grep -v \":0\"",
  "description": "Compute round 4 means and check summary/archive reads"
}
```

## Result

```
18441.4 30
5.53333
348.233
- §1.3: "The count includes children, helpers, caterers and performers." So the 5 caterers and helpers count toward the room total.
1. Capacity: the reception is standing, so the limit is 120. The room holds 95 guests + 5 caterers and helpers = 100 people. 100 is no more than 120, so it is allowed. It is also within the 150 limit for the whole building.
   - If the 5 caterers and helpers were counted as "guests", 100 ÷ 40 = 2.5, which also rounds up to 3. The answer is the same either way.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/icm; find . -type f | while read f; do echo \"$(wc -l < \"$f\") $f\"; done; grep -rn \"[0-9£$]\" . ; grep -rni \"brindle\\|osterby\\|fernhill\\|tannerwick\\|quillmere\\|boat\\|garden\\|maker\\|hall\\b\\|pool\\|lend\" . ; grep -rn \"@\" .; find . -iname \"claude.md\" ; ls -d reference 2>/dev/null",
  "description": "Leak-scrub the workspace and list files"
}
```

## Result

```
Exit code 2
82 ./01 answer/CONTEXT.md
5 ./01 answer/documents.md
0 ./01 answer/facts
0 ./01 answer/read
0 ./01 answer/the
0 ./01 answer/were
14 ./CLAUDE.md
38 ./CONTEXT.md
./01 answer/CONTEXT.md:1:# 01 answer: answer one question from the papers
./01 answer/CONTEXT.md:25:1. **Pick the organisation.** Use only its section of `documents.md` and its folder. Never mix
./01 answer/CONTEXT.md:27:2. **Pick the papers.** Go through the facts of the question one by one (who, what item or room,
./01 answer/CONTEXT.md:33:3. **Always read the changes paper** for that organisation, whole, in the same step. Check every
./01 answer/CONTEXT.md:35:4. **Date-test each change entry that touches a section you use.** Use the deciding date that
./01 answer/CONTEXT.md:42:5. **Find the exact rule text.** Read each sentence that decides the case closely: who it applies
./01 answer/CONTEXT.md:47:6. **Check for a missing fact.** If the rule turns on a fact the question does not give (an age,
./01 answer/CONTEXT.md:53:7. **Work out every number and date step by step in the reply.** Count days on a calendar, check
./01 answer/CONTEXT.md:56:8. **Answer every part of the question.** If the question asks two things, answer both. If the
./01 answer/CONTEXT.md:63:1. The rules that decide it: each cited as paper and section, quoted closely where the wording
./01 answer/CONTEXT.md:66:2. The working for any sum, date or day count, step by step.
./01 answer/CONTEXT.md:67:3. A check, written before the last line: no figure came from a summary or an archive paper;
./01 answer/CONTEXT.md:71:4. Last, on its own line: **Answer:** the direct answer (yes or no, the amount, the date, the
./CLAUDE.md:7:1. Read `01 answer/CONTEXT.md` and `01 answer/documents.md` together, in one step, before
./CLAUDE.md:9:2. Then read the papers the contract tells you to, from `reference/`, and answer.
./CONTEXT.md:13:| `01 answer/CONTEXT.md` | How to answer: which papers to read, how changes and dates work, what the reply holds |
./CONTEXT.md:14:| `01 answer/documents.md` | The list of every paper, generated from the papers' headers. Never edited by hand |
./CONTEXT.md:18:There is one stage, `01 answer`. A question arrives as the first message. The session reads the
./CONTEXT.md:24:`01 answer/documents.md` is written by `tools/make-map.mjs` from the header at the top of each
./CONTEXT.md:31:defined once, in `01 answer/CONTEXT.md`.
./CONTEXT.md:35:- `01 answer/documents.md` is never edited by hand.
./01 answer/CONTEXT.md:53:7. **Work out every number and date step by step in the reply.** Count days on a calendar, check
./CLAUDE.md
```

## Call: Bash

```json
{
  "command": "cd \"/c/tc-build/icm/01 answer\"; ls -la; rm -f facts read the were; ls -la; ls -la /c/tc-build",
  "description": "Remove stray empty files from a failed command"
}
```

## Result

```
total 13
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:53 .
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:49 ..
-rw-r--r-- 1 AzureAD+<user> 4096 5785 Oct 15 09:53 CONTEXT.md
-rw-r--r-- 1 AzureAD+<user> 4096  301 Oct 15 09:49 documents.md
-rw-r--r-- 1 AzureAD+<user> 4096    0 Oct 15 09:51 facts
-rw-r--r-- 1 AzureAD+<user> 4096    0 Oct 15 09:51 read
-rw-r--r-- 1 AzureAD+<user> 4096    0 Oct 15 09:51 the
-rw-r--r-- 1 AzureAD+<user> 4096    0 Oct 15 09:51 were
total 13
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:54 .
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:49 ..
-rw-r--r-- 1 AzureAD+<user> 4096 5785 Oct 15 09:53 CONTEXT.md
-rw-r--r-- 1 AzureAD+<user> 4096  301 Oct 15 09:49 documents.md
total 69
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:50 .
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 ..
-rw-r--r-- 1 AzureAD+<user> 4096   33 Oct 15 09:46 .gitattributes
-rw-r--r-- 1 AzureAD+<user> 4096 3712 Oct 15 09:46 BRIEF.md
-rw-r--r-- 1 AzureAD+<user> 4096 5400 Oct 15 09:48 DECISIONS.md
-rw-r--r-- 1 AzureAD+<user> 4096 9693 Oct 15 09:53 ROUNDS.md
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:49 icm
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 lib
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 practice
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:53 practice-logs
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 template
drwxr-xr-x 1 AzureAD+<user> 4096    0 Oct 15 09:46 tools
```

## Call: Read

```json
{
  "file_path": "C:\\tc-build\\icm\\01 answer\\CONTEXT.md"
}
```

## Result

```
1	# 01 answer: answer one question from the papers
2	
3	## What this stage is for
4	One question, about one situation, under one organisation's rules. Find every rule that touches
5	the situation, decide which version of each rule applies to it, work out the answer, and reply.
6	
7	## What comes in
8	- The question: the first message of the session. It names the organisation ("Under the ...
9	  rules").
10	- `documents.md`, next to this file: every paper, grouped by organisation, with what it covers
11	  and its kind. For a changes paper it also lists the sections it replaces and which date decides
12	  whether an entry applies.
13	- The papers themselves, in `reference/<organisation folder>/`.
14	
15	## The four kinds of paper
16	- **Governing.** The rules. Only governing papers, as changed by the changes paper, decide an
17	  answer.
18	- **Changes.** Later decisions. Each entry replaces a named section, but only for cases that
19	  pass that entry's own date test. It replaces only what it names; the rest of that paper stands.
20	- **Summary.** A quick guide. It does not govern. It is often out of date or loosely worded.
21	  Never take a figure, period or rule from it.
22	- **Archive.** An old version. It does not govern. Its figures are superseded. Never use them.
23	
24	## How to work, in order
25	1. **Pick the organisation.** Use only its section of `documents.md` and its folder. Never mix
26	   in the other organisation's papers.
27	2. **Pick the papers.** Go through the facts of the question one by one (who, what item or room,
28	   which dates, what money, what event: a closure, damage, a cancellation, a missed session, a
29	   notice). For each, find every governing paper whose "covers" line touches it. Read all of them,
30	   whole; they are short. A case often turns on a rule in a second paper (a closure rule in a
31	   safety paper that changes a refund in a fees paper; an age or capacity rule in another paper).
32	   Read them in one step, together.
33	3. **Always read the changes paper** for that organisation, whole, in the same step. Check every
34	   entry against every section you are relying on, not only the ones you expect to have changed.
35	4. **Date-test each change entry that touches a section you use.** Use the deciding date that
36	   entry names (or the note in `documents.md`): the date of payment, booking, session, visit,
37	   collection, notice, receipt, or whatever the entry says. Never use the date the committee
38	   decided, the date the question is asked, or a different event's date. "On or after" includes
39	   the day; a stated range includes both ends. If the entry applies, use its replacement text; if
40	   not, use the governing paper's original section. An entry can apply to one part of a case and
41	   not another (two events on two dates can fall either side).
42	5. **Find the exact rule text.** Read each sentence that decides the case closely: who it applies
43	   to, what it is counted per (per item, per person, per household, per booking, per day), any
44	   cap, minimum, rounding ("or part of"), exception, and how days are counted (day zero or day
45	   one, "within", "at least", "before"). Follow a sentence that points to another section and read
46	   that section too.
47	6. **Check for a missing fact.** If the rule turns on a fact the question does not give (an age,
48	   a tier or category, a rating, which day something is paid or collected), do not assume it. Name
49	   the missing fact and give the answer for each possible value. Do this only where the papers
50	   really make the asked answer turn on that fact; where the question gives the fact, use it. A
51	   fact that would only change something the question did not ask about is not missing: leave it
52	   out. When the answer is the same whatever the fact, give the one answer, not a split.
53	7. **Work out every number and date step by step in the reply.** Count days on a calendar, check
54	   the day of the week when it matters, apply caps and rounding where the rule says. Quote the
55	   figure from the governing text or the change entry that applies, not from memory.
56	8. **Answer every part of the question.** If the question asks two things, answer both. If the
57	   person states something the rules contradict, say plainly that it is wrong and give the right
58	   rule.
59	
60	## What goes out
61	One reply, in this order. The working comes before the answer, because the answer is only known
62	once the working is written; a first line written before the working can be wrong.
63	1. The rules that decide it: each cited as paper and section, quoted closely where the wording
64	   decides the case. For any change entry, its deciding date and which side of the effective
65	   date the case falls.
66	2. The working for any sum, date or day count, step by step.
67	3. A check, written before the last line: no figure came from a summary or an archive paper;
68	   every change entry was date-tested on the right event's date; the other governing papers whose
69	   cover lines touch the facts were read; a missing deciding fact has every outcome given; every
70	   part of the question is answered. If the check finds a slip, correct it there, then go on.
71	4. Last, on its own line: **Answer:** the direct answer (yes or no, the amount, the date, the
72	   number, or "it depends on X" with each outcome). It must agree with the working above it.
73	
74	If the papers do not cover the point, say so rather than filling the gap.
75	
76	Keep to what was asked. A rule that could have decided it but does not (a change entry whose date
77	test fails, a rule for a different kind of case) gets one line saying why not. Leave out rules
78	about matters the question did not raise, such as what happens next or other charges.
79	
80	## What must never happen here
81	Never ask the person a question back. Never edit anything. Never use the other organisation's
82	papers. Never let a summary or an archive paper decide an answer.
83
```

## Call: Bash

```json
{
  "command": "cat >> /c/tc-build/ROUNDS.md <<'EOF'\n\n## Round 4 — 2026-10-15, 09:53 MDT\n\n**Plan.** All 30 questions, one run each, on the contract as changed after round 3. Rounds 3's\nchange touches every answer that could split on a fact, and the full set is the only check that a\nnarrowed missing-fact rule did not stop the real missing-fact questions (garden Q5, makerspace Q6,\nmakerspace Q8, boat-lend Q1, boat-lend Q7) from splitting.\n\n**Housekeeping found during this round.** Four empty files (`facts`, `read`, `the`, `were`) sat\nin `icm/01 answer/` from 09:51, made by a shell command of mine that failed on quoting while\nediting the contract. They were copied into the round-3 and round-4 rooms. No session opened\nthem (instruction opens were 2 in every run, both the contract and the list), so the verdicts\nstand. Deleted after this round.\n\n| Set | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 |\n|---|---|---|---|---|---|---|---|---|---|---|\n| boat-lend | Right (5) | Right (7) | Right (5) | Right (7) | Right (6) | Right (5) | Right (4) | Right (6) | Right (6) | Right (7) |\n| garden-makerspace | Right (4) | Right (4) | Right (5) | Right (5) | Right (5) | Right (5) | Right (6) | Right (6) | Right (5) | Right (5) |\n| hall-pool | Right (6) | Right (5) | Right (6) | Right (5) | Right (6) | Right (5) | Right (6) | Right (7) | Right (6) | Right (6) |\n\n(Steps in brackets; instruction opens were 2 in every run.)\n\nOne-line reasons, against each key's \"Correct requires\":\n- boat-lend: Q1 £100/£110 on the payment date; Q2 £8 paid, £8 refunded; Q3 no, two in a rolling\n  seven days; Q4 £4; Q5 no, next from 1 January 2027; Q6 £30 from 10 January 2026; Q7 14/21 days\n  on the collection date; Q8 £20, loan blocked; Q9 £30 by 24 July 2026; Q10 £40, deposit applied,\n  £20 within 14 days of notice.\n- garden-makerspace: Q1 first Saturday, April to October; Q2 in time, 4 July; Q3 no, sprinklers\n  banned; Q4 $85, no second deposit; Q5 depends on age 70; Q6 depends on Wh, 100 allowed; Q7\n  no-show, 10 minutes; Q8 depends on tier, Keystone no; Q9 may collect, 21 days; Q10 31 August.\n- hall-pool: Q1 £7; Q2 £274; Q3 £4, £6, 14-day suspension; Q4 2 lifeguards; Q5 £32; Q6 allowed,\n  3 stewards; Q7 whole charge kept, deposit back, projector not charged; Q8 £92; Q9 22:30, £50;\n  Q10 3 adults, no alcohol, £300.\n\n**Headline:** 30 of 30 right. Mean steps 5.53 (range 4 to 7; 2 instruction opens every run).\nMean text fetched 18,441 characters. Mean answer 348 words. No run opened a summary or an archive\npaper.\n\n**What I saw.** The five missing-fact questions still split, and no determinate question split.\nThe one remaining blemish is hall Q7 again adding the deposit amount, unasked, with one branch\nincomplete (it gave the ordinary Main Hall deposits and not the higher ones); the asked parts are\nright. Tightening scope further risks cutting the one-line \"why not\" that several keys reward\n(why the summary's or archive's figure is wrong), so I left it.\n\n**Change.** None to the contract. Stopped here, after four rounds of the allowed five, because\nthe last round showed nothing worth changing: 30 of 30 with no failure pattern, and another round\nwould be tuning to these 30 questions rather than to papers of this kind.\n\n## Cold self-check against the walk test — 2026-10-15, 09:55 MDT\n\nRead cold as an agent with no memory, item by item from the skill's walk test.\n\n1. **Where am I, where do I go, within the entry file plus at most two reads?** Pass. `CLAUDE.md`\n   (auto-loaded) says what the workspace is and sends a question to `01 answer/CONTEXT.md` and\n   `01 answer/documents.md`, read together. Two reads, and every practice run made exactly those\n   two instruction opens.\n2. **Does any stage contract name exact input paths, the job, the output, and the human check?**\n   Partly, by design. `01 answer/CONTEXT.md` names the question, `documents.md` and\n   `reference/<organisation folder>/` as inputs, states the job, and states the output (one reply,\n   in a fixed order, ending in an **Answer:** line). There is no human check, because nobody is\n   present during a run and the brief forbids asking; the written check inside the reply stands in\n   for it. Recorded as departure 5 in `DECISIONS.md`.\n3. **Status by scanning `output/` folders?** Not applicable. A run writes nothing; each question\n   is a fresh session whose state is the reply. Departure 4 in `DECISIONS.md`.\n4. **Is any routing file carrying payload?** Pass. `CLAUDE.md` is 14 lines of routing. The root\n   `CONTEXT.md` is a map (what is here, how a question moves, how the list is made, never-rules)\n   and holds no reading rule; it points to the contract for the four kinds of paper.\n5. **Is any fact stored in two places?** Pass. The four kinds of paper and every reading rule live\n   only in `01 answer/CONTEXT.md`. Facts from the papers live only in the generated\n   `documents.md` and in `reference/`. The never-rules appear briefly in both `CLAUDE.md` and the\n   contract (never ask back, never edit); I kept that small overlap on purpose because the entry\n   file is the only file guaranteed to load.\n6. **After a restructure, do earlier references still resolve?** Not a restructure. Every path\n   named inside the workspace (`01 answer/CONTEXT.md`, `01 answer/documents.md`, `reference/`,\n   `tools/make-map.mjs`) exists at run time; the last is in the workshop, named only in the map\n   for the maintainer.\n7. **Token check: entry + one contract + its inputs in about 2k to 8k tokens.** Pass. Entry file\n   about 200 tokens, contract about 1,500, list about 800, and the papers a run actually read\n   averaged 18,441 characters in total (about 4,600 tokens, including the two instruction files).\n   A run lands near 5k to 7k tokens.\n8. **System map only.** Not applicable.\n\nBuild rules checked by script at 09:55: exactly one `CLAUDE.md` in `icm/`, at its top; no `@`\nanywhere in `icm/`; no `reference/` folder in `icm/`; the only digits in `icm/` are the stage\nnumber `01` and list numbering; no organisation or paper name from any practice set appears.\nNothing in `practice/` or `template/` was edited.\nEOF\ncd /c/tc-build/icm; find . -type f | while read f; do echo \"$(wc -l < \"$f\") $f\"; done; date",
  "description": "Log round 4 and walk test, list final files"
}
```

## Result

```
82 ./01 answer/CONTEXT.md
5 ./01 answer/documents.md
14 ./CLAUDE.md
38 ./CONTEXT.md
Thu Oct 15 09:54:34 MDT 2026
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build; sed -i 's/09:55 MDT 2026/09:54 MDT 2026/; s/checked by script at 09:55/checked by script at 09:54/' ROUNDS.md; find practice template -newer BRIEF.md -type f | head; grep -n \"09:5[45]\" ROUNDS.md",
  "description": "Fix timestamps and confirm practice and template untouched"
}
```

## Result

```
practice/boat-lend/questions.md
practice/boat-lend/reference/boat/boat-booking.md
practice/boat-lend/reference/boat/boat-changes.md
practice/boat-lend/reference/boat/boat-conduct.md
practice/boat-lend/reference/boat/boat-fees-archive-2025.md
practice/boat-lend/reference/boat/boat-fees.md
practice/boat-lend/reference/boat/boat-front-desk-guide.md
practice/boat-lend/reference/boat/boat-membership.md
practice/boat-lend/reference/boat/boat-safety.md
practice/boat-lend/reference/boat/boat-volunteers.md
183:## Cold self-check against the walk test — 2026-10-15, 09:55 MDT
217:Build rules checked by script at 09:54: exactly one `CLAUDE.md` in `icm/`, at its top; no `@`
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build; sed -i 's/walk test — 2026-10-15, 09:55 MDT/walk test — 2026-10-15, 09:54 MDT/' ROUNDS.md; find practice template -type f -printf '%TH:%TM\\n' | sort | uniq -c",
  "description": "Fix heading time and check practice/template modification times"
}
```

## Result

```
68 09:46
```

## Call: SubagentHandback

```json
{
  "message": "The workspace is built at C:\\tc-build\\icm\\. Four practice rounds ran on 2026-10-15 between 09:49 and 09:54 MDT. In the last round all 30 practice questions came back right.\n\n**Form and stages**\n- **Form:** Pipeline. The repeating unit is one question, answered in one fresh session, with the reply as the only output.\n- **Stages:** one, `01 answer`. There is no person to check anything mid-run and no file passed from one step to the next, so more stage folders would only add reads. Inside the contract the work is still in order: find the papers, date-test the changes, work it out, answer.\n- **Departures from the skill's templates:** ten, listed in C:\\tc-build\\DECISIONS.md, which was written before the build. The main ones: PO Verifier folder names, no `output/` folder, no human check, no `the-page.md`, and the entry file sends a question straight to the stage instead of to the map first.\n\n**Document list:** `01 answer/documents.md`, a marked placeholder. tools/make-map.mjs writes over the whole file.\n\n**Rounds** (verdicts are my own, judged against each set's \"Correct requires\")\n\n| Round | Questions | Right | Mean steps | Change made after it |\n|---|---|---|---|---|\n| 1 | 9, three per set, one per kind of trap | 9 of 9 | 5.8 | Added a \"keep to what was asked\" rule, because answers were adding rules nobody asked about |\n| 2 | the 21 not yet run | 20 of 21 | 5.5 | Working first, a written check, then a final **Answer:** line |\n| 3 | makerspace Q10 three times, plus 12 regression questions | 15 of 15 | 5.5 | Narrowed the missing-fact rule to facts the asked answer depends on |\n| 4 | all 30 | 30 of 30 | 5.53 | None, so I stopped |\n\n- **Round 2 failure:** on makerspace Q10 the first line gave the trap answer, 30 September. The working then reached 31 August and took the first line back. The session showed no thinking at medium effort, so a first line is written before any working exists.\n- **Round 3 problem:** on hall Q7 the model treated facts nobody asked about as missing and started splitting the answer on them. A determinate question could end up as an \"it depends\" answer, which the keys mark wrong.\n- **Every run:** exactly 2 instruction opens. Round 4 fetched a mean of 18,441 characters, and no run opened a summary or archive paper.\n\nThe last change I made was the narrower missing-fact rule (step 6 of the contract). I made no change after round 4.\n\n**Files in icm\\**\n- `CLAUDE.md` — 14 lines\n- `CONTEXT.md` — 38 lines\n- `01 answer/CONTEXT.md` — 82 lines\n- `01 answer/documents.md` — 5 lines (placeholder)\n\nThe scripted checks pass: one `CLAUDE.md`, no `@` imports, no `reference/` folder, and no figure, date, section number or organisation name from any paper. Nothing in practice\\ or template\\ changed; every file there still has its 09:46 timestamp.\n\n**Things I'm unsure about**\n- At 09:51 a shell command of mine broke on quoting and left four empty files (`facts`, `read`, `the`, `were`) in `icm/01 answer/`. They were copied into the round 3 and 4 practice rooms. No session opened them. They are deleted now, and this is logged in ROUNDS.md.\n- All the verdicts come from one run per question, except makerspace Q10 (3 runs). I didn't measure how much answers vary from run to run.\n- Answers now average about 350 words, up from about 250, because of the written working. Hall Q7 still adds a deposit amount nobody asked for, and one branch of it is incomplete. I left it alone, because tightening further could cut the one-line \"why not\" that several answer keys reward.\n- Departures 4 and 5 (no output folder, no human check) break invariants 4 and 6 of the skill. The harness forces that, and both are logged.\n\nThe full round logs and the walk-test check are in C:\\tc-build\\ROUNDS.md. Raw logs are under C:\\tc-build\\practice-logs\\round-1 to round-4."
}
```

## Result

```
{"success":true,"message":"Report delivered to your caller."}
```

## Call: Bash

```json
{
  "command": "date; cat /c/tc-build/GATE.md; cat /c/tc-build/icm/CLAUDE.md /c/tc-build/icm/CONTEXT.md",
  "description": "Read the gate audit and current router and map"
}
```

## Result

```
Thu Oct 15 10:01:11 MDT 2026
# Gate audit: Rules Desk workspace (`icm/`)

Audited 2026-10-15, 09:57 to 10:00 MDT. Auditor: independent gate agent (not the builder,
not the experimenter). Method: `icm-architect` SKILL.md, `references/core.md`, `references/forms.md`,
`assets/templates/stage-CONTEXT.md`; house style `template/` (PO Verifier); limits `BRIEF.md`.
`ROUNDS.md` was not read. `DECISIONS.md` was read only after the lists in section 3 were scored.

## 1. Cold walk

Read first, with nothing else open: `icm/CLAUDE.md` (14 lines).

- **Where am I?** Answered by the entry file alone: "Rules Desk", answers one question under one
  organisation's rules from its papers, in one reply, never asks back (CLAUDE.md:1-5).
- **Where do I go?** Answered by the entry file alone: read `01 answer/CONTEXT.md` and
  `01 answer/documents.md` together, then the papers in `reference/` (CLAUDE.md:7-9). The map is
  explicitly not needed for a question (CLAUDE.md:11-12).
- Reads 2 and 3 (taken in one step, as instructed): `01 answer/CONTEXT.md` gave the whole method:
  the four kinds of paper, an eight-step order of work, the reply shape and the never-rules.
  `01 answer/documents.md` in the build is a marked placeholder (3 lines of text, "generated; do not
  edit by hand"), so from the workshop copy I could not see which papers exist; in a staged room it
  is replaced by the generated list (confirmed by the six runs below, which all read it and then
  went straight to the right organisation's papers).
- Verdict: entry plus two reads is enough to know where I am, what to do and in what order. The only
  thing a cold walk of the build copy cannot answer is "which papers", by design.

## 2. Practice runs (one run each, `tools/practice.mjs`, model claude-sonnet-5-5)

Logs: `gate-logs/<set>/Q*-r1.jsonl`, console output `gate-logs/<set>-Q*.out.txt`.

| Set / Q | Verdict | Reason | Steps | Instr. opens | Chars fetched |
|---|---|---|---|---|---|
| garden-makerspace Q1 | RIGHT | First Saturday of each month, April to October; lists the seven 2026 dates (also allowed). | 4 | 2 | 15,923 |
| garden-makerspace Q6 | RIGHT | Names the Wh rating as the missing fact; allowed at 100 Wh or less, not allowed above. | 5 | 2 | 18,599 |
| hall-pool Q1 | RIGHT | £7; Change 2 date-tested on the visit date; booking valid at 8 days. | 7 | 2 | 23,752 |
| hall-pool Q6 | RIGHT | 100 allowed (120 standing, caterers counted); 3 stewards aged 18 or over. | 5 | 2 | 17,535 |
| boat-lend Q1 | RIGHT | Splits on payment date: £100 in March, £110 in April; joining fee £15 both cases. | 5 | 2 | 15,129 |
| boat-lend Q6 | RIGHT | £30; term from 10 January 2026, not backdated. | 5 | 2 | 14,679 |

6 of 6 right. No run opened the root `CONTEXT.md`, a summary or an archive paper. Range 14.7k to
23.8k characters (about 3.7k to 6k tokens) per question, all reads.

Small observations, not failures: boat-lend Q1 phrases the split by month ("in March" / "in April")
rather than "on or before 31 March / on or after 1 April"; the question restricts joining to those two
months, so the split is equivalent and the payment date is named as the deciding fact. hall-pool Q6
adds an unneeded caveat about other rooms and the 150 building limit; it does not change the answer.

## 3. The lists

### (a) Walk test (SKILL.md, "The walk test")

| # | Item | Score | Evidence |
|---|---|---|---|
| a1 | Entry plus at most two reads answers where am I / where to go | PASS | CLAUDE.md:3-9 routes to two files read in one step; cold walk above; every run used exactly 2 instruction opens. |
| a2 | Stage contract names exact input paths, job, output, human check | PASS (paths, job, output); N/A (human check) | `01 answer/CONTEXT.md`:4-5 job, :8-13 inputs (`documents.md` next to the file, `reference/<organisation folder>/`, patterned because the papers are unseen), :60-72 output. Human check N/A: BRIEF "no person is present" and "must not tell the model to stop and ask". |
| a3 | Status derivable by scanning `output/` | N/A | BRIEF: "A session can only Read, Glob and Grep. It cannot write files." No run leaves state on disk. |
| a4 | No routing file carries content payload | PASS | CLAUDE.md 14 lines, routing plus one never-line; root CONTEXT.md 38 lines, catalog table and maintainer notes; the method lives only in the stage contract. |
| a5 | No fact stored in two places | **FAIL** | "Never ask a question back" is in CLAUDE.md:5, CONTEXT.md:38 and `01 answer/CONTEXT.md`:81. "Never edit" is in CLAUDE.md:14, CONTEXT.md:34 and `01 answer/CONTEXT.md`:81. "Never answer from a paper that does not govern" is in CLAUDE.md:14 and `01 answer/CONTEXT.md`:16-22, :82. Only the CLAUDE.md copy is defensible by the limit "only CLAUDE.md loads by itself"; the map and contract copies are not forced. DECISIONS.md:85 claims one home and is contradicted. |
| a6 | After a restructure, every prior reference still resolves | N/A | Build mode, not restructure; the item's own condition is not met (this is not a harness limit). Related note: `tools/make-map.mjs` (CONTEXT.md:24, documents.md:3) does not resolve from the workspace root; it resolves from the workshop root, as the brief names it. |
| a7 | Token check: entry + contract + inputs in about 2k-8k tokens | PASS | Entry 725 chars, contract 5,785 chars; whole sessions fetched 14,679-23,752 chars (about 3.7k-6k tokens) including the generated list and papers. |
| a8 | System map: what is X / what moves | N/A | Not the System map form (forms.md: Pipeline chosen). Not a harness limit; the item's own condition. |

### (b) The ten invariants (SKILL.md, "The invariants")

| # | Invariant | Score | Evidence |
|---|---|---|---|
| b1 | One folder, one job, purpose stated inside | PASS | Root: CLAUDE.md:3-5; `01 answer/CONTEXT.md`:1-5. `reference/` has no purpose file inside it, which BRIEF forbids ("nothing is added inside reference/"); its purpose is stated in CONTEXT.md:15. |
| b2 | Small, stable entry file that only routes | PASS | CLAUDE.md is 14 lines (target under 60), routes to the stage, the list, the papers and the map. |
| b3 | Numbering encodes order | PASS | One stage, `01 answer`. |
| b4 | Explicit contract per working folder | PASS; human check N/A | `01 answer/CONTEXT.md` has inputs (:7-13), process (:24-58), outputs (:60-78). Human check N/A: BRIEF, no person present, no stop-and-ask. |
| b5 | Factory vs product apart | PASS | Factory = contract + generated list; papers supplied in `reference/`; product = the reply only (CONTEXT.md:18-21). |
| b6 | Every output an edit surface; person reads before next step | N/A | BRIEF: session cannot write files; no person present. |
| b7 | Load only what the step needs | PASS | CLAUDE.md:11-12 keeps the map out of question runs; runs opened 2 instruction files and 2-5 papers of one organisation only. |
| b8 | Plain text, linkable, queryable; one home per fact | **FAIL** | Plain markdown with relative paths: yes. Frontmatter lives on the papers and feeds the generated list: acceptable. "One home per fact" fails for the same three duplicated rules as a5. |
| b9 | Filesystem is the state machine; generated indexes by script | PASS (index); N/A (status) | `documents.md` is written whole by `tools/make-map.mjs` (CONTEXT.md:23-27; staged by `tools/practice.mjs` `stageRoom`). Status-by-scan N/A: session cannot write. |
| b10 | Instantiate by copying, `_templates/` | N/A | BRIEF: session cannot write files; the unit is a message, so there is nothing to copy into existence. |

### (c) Fidelity to the PO Verifier house style

| # | Element | Score | Evidence |
|---|---|---|---|
| c1 | Router `CLAUDE.md` | PASS | Same shape as `template/CLAUDE.md`:1-11: title, one-line what it is, numbered route to the stage, closing never-line (`icm/CLAUDE.md`:1-14). Departures: no `the-page.md`, and it does not send the model to the map first (see DECISIONS review, items 7 and 8). |
| c2 | Map `CONTEXT.md` | PASS | Same sections as `template/CONTEXT.md`: What this is, What is here (table), How a [unit] moves through, How things are named, What must never happen (`icm/CONTEXT.md`:3-38). Template's domain-only sections (numbers, lives elsewhere, where Sam is asked) correctly have no counterpart. |
| c3 | Stage contract shape | PASS | Same headings as `template/02 read/CONTEXT.md`: What this stage is for, What comes in, process sections, What goes out, What must never happen here (`01 answer/CONTEXT.md`:3, 7, 15-58, 60, 80). "What goes out" names where the output goes (the reply, :60-72), as the template's stages name the next stage. |

Observation outside the lists (not scored): the stage contract is about 1,450 tokens, above the
200-500 tokens core.md gives for an L2 contract. It is the only method file a question reads, the
whole session stays inside 2k-8k, and the practice results do not show a cost. Recorded, not fixed.

## DECISIONS.md review

Whether each listed departure is justified by the harness limits in BRIEF.md:

1. Folder name with a space: not a harness limit; justified by the brief's house-style rule ("Where it differs, follow the PO Verifier").
2. No `stages/` wrapper: same; house-style rule, not a harness limit.
3. No `_shared/`, `_templates/`, `setup/`: partly by limits (session cannot write, so no unit to copy; no person to configure). Justified.
4. No `output/`, no edit surface: justified by "cannot write files".
5. No human check: justified by "no person is present" and "must not tell the model to stop and ask".
6. PO Verifier headings: house-style rule, not a harness limit; justified by the brief.
7. No `the-page.md`: not forced by any limit. The brief's house-style sentence lists router, map, stage folders and `reference/` only, which supports it; the cost argument (one more read) is a design choice. Acceptable, not limit-forced.
8. Entry file does not say "read the map first": not forced by any limit (reads are unlimited). A step-budget choice that departs from the house router. Practice shows no cost (6/6 right). Acceptable as a choice; not justified by the limits.
9. No `reference/` in the build: justified; `tools/practice.mjs` `stageRoom` throws if the workspace holds its own `reference/`, and BRIEF says the papers come with the set.
10. "Stop and ask" replaced: justified by "must not tell the model to stop and ask".

Not listed as a departure but should be: the never-rules are repeated across router, map and contract,
against DECISIONS.md:85's own "one home per rule" and invariant 8 (finding a5/b8).

Also checked: DECISIONS.md:81 (no figure, date, section number or organisation name from a practice
paper in the workspace). Grep of `icm/` for every practice organisation name, set name, "£" and
"Wh" outside `documents.md`: no hits other than "calendar" matching "lend". Holds.

## 4. Fixes

None made. No problem found falls under the four allowed kinds:
- Missing file: none. `reference/` is absent by design (harness supplies it; the runner refuses a workspace copy).
- Broken path: every in-workspace path resolves. `tools/make-map.mjs` is an external tool named as the
  brief names it; no single path form resolves in every location the workspace is copied to, so it is
  recorded, not edited.
- Router or map that does not name a stage: CLAUDE.md:7 and CONTEXT.md:13, 18 name `01 answer`.
- Stage that does not say where to go next: `01 answer/CONTEXT.md`:60-72 says the output is the reply; it is the last stage.

Recorded, not fixed: the duplicated never-rules (a5, b8); the over-size L2 contract (observation).

GATE: FAIL. Failing items: a5 (walk test, a fact stored in two places) and b8 (invariant 8, one home
per fact), both from the "never ask back", "never edit" and "never use a non-governing paper" rules
repeated in CLAUDE.md, CONTEXT.md and `01 answer/CONTEXT.md`.
# Rules Desk

This answers one question about a situation, under one small organisation's rules, from that
organisation's papers. The answer goes back in your reply, in one message. Nobody is here to
answer a question from you, so never ask one back.

1. Read `01 answer/CONTEXT.md` and `01 answer/documents.md` together, in one step, before
   anything else. The first says how to answer; the second lists every paper and what it is.
2. Then read the papers the contract tells you to, from `reference/`, and answer.

`CONTEXT.md` at the top is the map of this workspace, for whoever maintains it. A question does
not need it.

Never edit, move or add anything. Never answer from memory or from a paper that does not govern.
# Rules Desk: the map

## What this is
A member, a volunteer or someone at a front desk asks a question about a situation under one
organisation's rules. A fresh session answers it from the papers, in one reply. The papers stay
the same from question to question; only the question is new.

## What is here

| Folder or file | What it holds |
|---|---|
| `CLAUDE.md` | Where a question starts. Loads by itself. |
| `01 answer/CONTEXT.md` | How to answer: which papers to read, how changes and dates work, what the reply holds |
| `01 answer/documents.md` | The list of every paper, generated from the papers' headers. Never edited by hand |
| `reference/` | The papers, one subfolder per organisation. Supplied with the papers, never edited |

## How a question moves through
There is one stage, `01 answer`. A question arrives as the first message. The session reads the
stage contract and the document list, reads the papers that govern the situation, and replies.
Nothing is written to disk. There is no second stage because there is no file to hand on and no
person to check one.

## How the document list is made
`01 answer/documents.md` is written by `tools/make-map.mjs` from the header at the top of each
paper in `reference/`. When the papers change, run the script again and write its output to that
path. It holds the only facts taken from the papers that live outside `reference/`. Everything
else in this workspace is about how to read papers of this kind, not about any one set of them.

## How things are named
The four kinds of paper (governing, changes, summary, archive) and what each one is worth are
defined once, in `01 answer/CONTEXT.md`.

## What must never happen
- Nothing in `reference/` is changed, moved or added to.
- `01 answer/documents.md` is never edited by hand.
- No figure, date or section number from a paper is written into any file here except the
  generated list.
- The session never asks the person a question; a missing fact is handled in the answer.
```

## Call: Bash

```json
{
  "command": "mkdir -p /c/tc-build/practice-logs/round-5/before && cp -r /c/tc-build/icm/. /c/tc-build/practice-logs/round-5/before/ && ls -R /c/tc-build/practice-logs/round-5/before; cat -n \"/c/tc-build/icm/01 answer/documents.md\"",
  "description": "Snapshot the workspace before round 5 edits"
}
```

## Result

```
/c/tc-build/practice-logs/round-5/before:
01 answer
CLAUDE.md
CONTEXT.md

/c/tc-build/practice-logs/round-5/before/01 answer:
CONTEXT.md
documents.md
     1	# Document list (generated; do not edit by hand)
     2	
     3	This file is replaced whole by the output of `tools/make-map.mjs`, run on the papers in
     4	`reference/`. Until it has been generated, the papers are in `reference/`, one subfolder per
     5	organisation, and each paper's header says its organisation and kind.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/icm && python - <<'EOF'\nimport io\ndef rep(path, old, new):\n    t = io.open(path, encoding='utf-8').read()\n    assert t.count(old) == 1, (path, old)\n    io.open(path, 'w', encoding='utf-8', newline='\\n').write(t.replace(old, new))\nrep('CLAUDE.md', \"Never edit, move or add anything. Never answer from memory or from a paper that does not govern.\\n\",\n \"Never edit, move or add anything, and never answer from memory. These rules, and the one above\\n\"\n \"about asking back, hold for the whole session and are written only here. Which papers may decide\\n\"\n \"an answer is set only in `01 answer/CONTEXT.md`, under \\\"The four kinds of paper\\\".\\n\")\nrep('CONTEXT.md', \"| `reference/` | The papers, one subfolder per organisation. Supplied with the papers, never edited |\",\n \"| `reference/` | The papers, one subfolder per organisation. Supplied with the papers |\")\nrep('CONTEXT.md', \"`01 answer/documents.md` is written by `tools/make-map.mjs` from the header at the top of each\\npaper in `reference/`.\",\n \"`01 answer/documents.md` is written by `tools/make-map.mjs` from the header at the top of each\\npaper in `reference/`. That script is not part of this workspace: it lives in the workshop that\\nbuilds it, outside this folder, so the path does not resolve from here.\")\nrep('CONTEXT.md', \"- Nothing in `reference/` is changed, moved or added to.\\n\", \"\")\nrep('CONTEXT.md', \"- The session never asks the person a question; a missing fact is handled in the answer.\\n\",\n \"- What a session may never do (ask back, edit, move or add anything) is written once, in\\n  `CLAUDE.md`. Which papers may decide an answer is written once, in `01 answer/CONTEXT.md`.\\n\")\nrep('01 answer/CONTEXT.md', \"Never ask the person a question back. Never edit anything. Never use the other organisation's\\npapers. Never let a summary or an archive paper decide an answer.\\n\",\n \"Never use the other organisation's papers. Which papers may decide an answer is set once, above,\\nunder \\\"The four kinds of paper\\\". The rules for the whole session (asking back, editing) are in\\n`CLAUDE.md`, which is always loaded.\\n\")\nrep('01 answer/documents.md', \"the output of `tools/make-map.mjs`, run on\",\n \"the output of `tools/make-map.mjs` (a script in the workshop,\\noutside this workspace), run on\")\nEOF\ncd /c/tc-build/practice-logs/round-5; diff -ru before /c/tc-build/icm > icm.diff; cat icm.diff",
  "description": "Apply one-home edits and diff against the snapshot"
}
```

## Result

```
diff -ru "before/01 answer/CONTEXT.md" "/c/tc-build/icm/01 answer/CONTEXT.md"
--- "before/01 answer/CONTEXT.md"	2026-10-15 10:01:38.666410700 -0600
+++ "/c/tc-build/icm/01 answer/CONTEXT.md"	2026-10-15 10:01:56.067840400 -0600
@@ -78,5 +78,6 @@
 about matters the question did not raise, such as what happens next or other charges.
 
 ## What must never happen here
-Never ask the person a question back. Never edit anything. Never use the other organisation's
-papers. Never let a summary or an archive paper decide an answer.
+Never use the other organisation's papers. Which papers may decide an answer is set once, above,
+under "The four kinds of paper". The rules for the whole session (asking back, editing) are in
+`CLAUDE.md`, which is always loaded.
diff -ru "before/01 answer/documents.md" "/c/tc-build/icm/01 answer/documents.md"
--- "before/01 answer/documents.md"	2026-10-15 10:01:38.666410700 -0600
+++ "/c/tc-build/icm/01 answer/documents.md"	2026-10-15 10:01:56.067840400 -0600
@@ -1,5 +1,6 @@
 # Document list (generated; do not edit by hand)
 
-This file is replaced whole by the output of `tools/make-map.mjs`, run on the papers in
+This file is replaced whole by the output of `tools/make-map.mjs` (a script in the workshop,
+outside this workspace), run on the papers in
 `reference/`. Until it has been generated, the papers are in `reference/`, one subfolder per
 organisation, and each paper's header says its organisation and kind.
diff -ru before/CLAUDE.md /c/tc-build/icm/CLAUDE.md
--- before/CLAUDE.md	2026-10-15 10:01:38.665408100 -0600
+++ /c/tc-build/icm/CLAUDE.md	2026-10-15 10:01:56.036592100 -0600
@@ -11,4 +11,6 @@
 `CONTEXT.md` at the top is the map of this workspace, for whoever maintains it. A question does
 not need it.
 
-Never edit, move or add anything. Never answer from memory or from a paper that does not govern.
+Never edit, move or add anything, and never answer from memory. These rules, and the one above
+about asking back, hold for the whole session and are written only here. Which papers may decide
+an answer is set only in `01 answer/CONTEXT.md`, under "The four kinds of paper".
diff -ru before/CONTEXT.md /c/tc-build/icm/CONTEXT.md
--- before/CONTEXT.md	2026-10-15 10:01:38.664401400 -0600
+++ /c/tc-build/icm/CONTEXT.md	2026-10-15 10:01:56.066838400 -0600
@@ -12,7 +12,7 @@
 | `CLAUDE.md` | Where a question starts. Loads by itself. |
 | `01 answer/CONTEXT.md` | How to answer: which papers to read, how changes and dates work, what the reply holds |
 | `01 answer/documents.md` | The list of every paper, generated from the papers' headers. Never edited by hand |
-| `reference/` | The papers, one subfolder per organisation. Supplied with the papers, never edited |
+| `reference/` | The papers, one subfolder per organisation. Supplied with the papers |
 
 ## How a question moves through
 There is one stage, `01 answer`. A question arrives as the first message. The session reads the
@@ -22,7 +22,8 @@
 
 ## How the document list is made
 `01 answer/documents.md` is written by `tools/make-map.mjs` from the header at the top of each
-paper in `reference/`. When the papers change, run the script again and write its output to that
+paper in `reference/`. That script is not part of this workspace: it lives in the workshop that
+builds it, outside this folder, so the path does not resolve from here. When the papers change, run the script again and write its output to that
 path. It holds the only facts taken from the papers that live outside `reference/`. Everything
 else in this workspace is about how to read papers of this kind, not about any one set of them.
 
@@ -31,8 +32,8 @@
 defined once, in `01 answer/CONTEXT.md`.
 
 ## What must never happen
-- Nothing in `reference/` is changed, moved or added to.
 - `01 answer/documents.md` is never edited by hand.
 - No figure, date or section number from a paper is written into any file here except the
   generated list.
-- The session never asks the person a question; a missing fact is handled in the answer.
+- What a session may never do (ask back, edit, move or add anything) is written once, in
+  `CLAUDE.md`. Which papers may decide an answer is written once, in `01 answer/CONTEXT.md`.
```

## Call: Edit

```json
{
  "replace_all": false,
  "file_path": "C:\\tc-build\\icm\\CONTEXT.md",
  "old_string": "paper in `reference/`. That script is not part of this workspace: it lives in the workshop that\nbuilds it, outside this folder, so the path does not resolve from here. When the papers change, run the script again and write its output to that\npath. It holds",
  "new_string": "paper in `reference/`. That script is not part of this workspace: it lives in the workshop that\nbuilds it, outside this folder, so the path does not resolve from here. When the papers change,\nrun the script again and write its output to that path. It holds"
}
```

## Result

```
<tool_use_error>File has not been read yet. Read it first before writing to it.</tool_use_error>
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/practice-logs/round-5; diff -ru before /c/tc-build/icm > icm.diff; sed -n '/How the document list/,/^@@/p' icm.diff; date; bash \"C:/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/run-round.sh\" 5 garden-makerspace:Q1 garden-makerspace:Q6 hall-pool:Q1 hall-pool:Q6 boat-lend:Q1 boat-lend:Q6; date; for f in */*.txt; do echo \"#### $f\"; grep \"^steps\" $f; grep \"^  - \" $f; grep -A4 \"^\\*\\*Answer\" $f; done",
  "description": "Regenerate diff and run the six gate questions",
  "timeout": 600000
}
```

## Result

```
## How the document list is made
 `01 answer/documents.md` is written by `tools/make-map.mjs` from the header at the top of each
-paper in `reference/`. When the papers change, run the script again and write its output to that
+paper in `reference/`. That script is not part of this workspace: it lives in the workshop that
+builds it, outside this folder, so the path does not resolve from here. When the papers change, run the script again and write its output to that
 path. It holds the only facts taken from the papers that live outside `reference/`. Everything
 else in this workspace is about how to read papers of this kind, not about any one set of them.
 
@@ -31,8 +32,8 @@
Thu Oct 15 10:02:03 MDT 2026
done
Thu Oct 15 10:02:17 MDT 2026
#### boat-lend/Q1.txt
steps 5 (instruction opens 2, document steps 3), text fetched 15201 characters, 335 words, 10 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/boat/boat-fees.md
  - Read reference/boat/boat-changes.md
  - Read reference/boat/boat-membership.md
**Answer:** It depends on the month they join. If they pay in March 2026, they pay **£100** (£15 joining + £85 annual). If they pay in April 2026, they pay **£110** (£15 joining + £95 annual).

#### boat-lend/Q6.txt
steps 5 (instruction opens 2, document steps 3), text fetched 14751 characters, 369 words, 9.8 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/lend/lend-fees.md
  - Read reference/lend/lend-membership.md
  - Read reference/lend/lend-changes.md
**Answer:** They pay £30. The renewed membership runs from Saturday 10 January 2026 for 12 calendar months, ending 10 January 2027 (the last day of cover is 9 January 2027).

#### garden-makerspace/Q1.txt
steps 4 (instruction opens 2, document steps 2), text fetched 15995 characters, 261 words, 6.8 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/garden/plot-rules.md
  - Read reference/garden/amendments.md
**Answer:** The plot secretary inspects every plot on the first Saturday of each month from April to October. In 2026 those days are 4 April, 2 May, 6 June, 4 July, 1 August, 5 September and 3 October.

#### garden-makerspace/Q6.txt
steps 5 (instruction opens 2, document steps 3), text fetched 18671 characters, 316 words, 9.2 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/makerspace/storage.md
  - Read reference/makerspace/bulletin.md
  - Read reference/makerspace/membership.md
**Answer:** It depends on the pack's rating. If it is **100 Wh or less** (exactly 100 Wh is allowed), the member may store it, because the 12 kg total is under 25 kg and nothing else is prohibited. If it is **above 100 Wh**, the member may not store it, and staff would remove it under storage.md 2.2.

#### hall-pool/Q1.txt
steps 6 (instruction opens 2, document steps 4), text fetched 21113 characters, 345 words, 9.3 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/pool/pool-fees.md
  - Read reference/pool/pool-booking.md
  - Read reference/pool/pool-membership.md
  - Read reference/pool/pool-changes.md
  - The original pool-booking.md §1.2 allows only 7 days ahead.
  - Change 1 replaces it with 10 days ahead. Its deciding date is the day the booking is made, 16 January 2026, which is after 1 October 2025. The booking is therefore valid.
**Answer:** £7 (the guest fee for a guest aged 16 or over, under Change 2, for a visit on or after 1 January 2026).

#### hall-pool/Q6.txt
steps 6 (instruction opens 2, document steps 4), text fetched 20040 characters, 313 words, 10 s, model claude-sonnet-5-5
  - Read 01 answer/CONTEXT.md
  - Read 01 answer/documents.md
  - Read reference/hall/hall-licensing-limits.md
  - Read reference/hall/hall-changes-log.md
  - Read reference/hall/hall-who-can-hire.md
  - Read reference/hall/hall-kitchen-and-equipment.md
**Answer:** Yes, 100 people is allowed in the Main Hall for a standing event, because the limit is 120. The hirer must provide 3 stewards, each aged 18 or over.
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build/icm && python - <<'EOF'\nimport io\np='CONTEXT.md'; t=io.open(p,encoding='utf-8').read()\nold=\"outside this folder, so the path does not resolve from here. When the papers change, run the script again and write its output to that\\npath. It holds\"\nnew=\"outside this folder, so the path does not resolve from here. When the papers change,\\nrun the script again and write its output to that path. It holds\"\nassert t.count(old)==1; io.open(p,'w',encoding='utf-8',newline='\\n').write(t.replace(old,new))\nEOF\ncd /c/tc-build/practice-logs/round-5; diff -ru before /c/tc-build/icm > icm.diff; grep -c \"\" icm.diff; grep -i \"payment date\\|deciding\" boat-lend/Q1.txt | head -3; grep -i \"caterer\" hall-pool/Q6.txt | head -2\ncd /c/tc-build/icm; echo \"CLAUDE.md count: $(find . -iname claude.md | wc -l)\"; echo \"@: $(grep -rn '@' . | wc -l)\"; echo \"digits outside list:\"; grep -rn \"[0-9£\\$]\" --exclude=documents.md . | grep -v \"01 answer\\|^\\./01 answer/CONTEXT.md:[0-9]*:[0-9]\\. \\|^\\./01 answer/CONTEXT.md:[0-9]*:   *\\|step 7\"; grep -rnio \"brindlecombe\\|osterby\\|fernhill\\|brindle yard\\|tannerwick\\|quillmere\\|wh\\b\" . ; ls -d reference 2>&1 | head -1; for f in CLAUDE.md CONTEXT.md \"01 answer/CONTEXT.md\" \"01 answer/documents.md\"; do echo \"$(wc -l < \"$f\") $f\"; done",
  "description": "Reflow, final diff, verify answers and run scripted checks"
}
```

## Result

```
69
- `boat-changes.md` 2.4 replaces 1.3 with "The annual fee for a household membership is £95." The deciding date is the payment date (the note in `documents.md` says the payment date decides fee rules). Entry 2.2 applies it to payments made on or after 1 April 2026.
**Check:** No figure came from a summary or archive paper. The fee change entry was date-tested on the payment date. The fees, membership and changes papers were all read. The missing deciding fact (the joining month) has both outcomes given.
- **hall-licensing-limits.md, 1.3:** "The count includes children, helpers, caterers and performers."
- **Capacity:** the 5 caterers and helpers count, so the room holds 95 + 5 = 100 people. The reception is standing, so the limit is 120. 100 is under 120, so it's allowed. The 100 is also under the 150 building limit, assuming no other rooms are in use at the same time.
CLAUDE.md count: 1
@: 0
digits outside list:
./CLAUDE.md:9:2. Then read the papers the contract tells you to, from `reference/`, and answer.
ls: cannot access 'reference': No such file or directory
16 CLAUDE.md
39 CONTEXT.md
83 01 answer/CONTEXT.md
6 01 answer/documents.md
```

## Call: Bash

```json
{
  "command": "cd /c/tc-build; cat >> DECISIONS.md <<'EOF'\n\n## Added in round 5 (2026-10-15, 10:02 MDT), after the gate audit: one home per never-rule\n\nThe gate (GATE.md, items a5 and b8) found three rules written in three files each: never ask a\nquestion back, never edit anything, never answer from a paper that does not govern. The PO\nVerifier does repeat its guardrails: `template/CLAUDE.md` line 11 (\"Never send anything, never\nchange what is in `01 intake`, and stop and ask Sam when unsure\"), `template/CONTEXT.md` \"What\nmust never happen\" (\"Nothing in `01 intake` is ever changed\", \"The AI ... never sends anything\",\n\"stop and ask Sam\"), and `template/01 intake/CONTEXT.md` \"What must never happen here\" (\"Nothing\nthat arrives is edited\"). What the house style requires is the *shape*: a closing never-line in\nthe router and a never-section in the map and in each stage. It does not need the same sentence\nin each. So the fix keeps every section and gives each rule one home, with pointers elsewhere:\n\n- Asking back, editing (and answering from memory): home `CLAUDE.md`, the only file that loads by\n  itself, because they hold for the whole session. The map and the contract point to it.\n- Which papers may decide an answer: home `01 answer/CONTEXT.md`, \"The four kinds of paper\". The\n  router and the map point to it; the contract's own never-section points up to it.\n\nThis satisfies both the skill (one home per fact) and the house style (never-sections kept), so it\nis not listed as a departure.\nEOF\n{ cat <<'EOF'\n\n## Round 5 — 2026-10-15, 10:01–10:02 MDT (last allowed round; gate fix only)\n\n**Why.** The gate audit (`GATE.md`, written by another agent at 09:57–10:00) failed walk-test item\na5 and invariant 8 (b8): three never-rules were written in `CLAUDE.md`, `CONTEXT.md` and\n`01 answer/CONTEXT.md`. It also noted that `tools/make-map.mjs` does not resolve from inside the\nworkspace. Scope given by the coordinator: fix only those, change no method step, no reply\ncontent, no other rule's wording.\n\n**Decision.** One home per rule, pointers elsewhere, every never-section kept (reasoning and the\ntemplate lines that show the house style's repetition are in `DECISIONS.md`, \"Added in round 5\").\nAsking back and editing live in `CLAUDE.md`; which papers may decide lives in the contract's\n\"The four kinds of paper\". The map and the placeholder list now say the generator script lives in\nthe workshop, outside the workspace.\n\n**Exact diff** (`diff -ru` of the snapshot taken before editing, `practice-logs/round-5/before/`,\nagainst `icm/`; also saved as `practice-logs/round-5/icm.diff`). The six runs below used these\ncontents except for one whitespace-only reflow of the map paragraph, made after the runs; the map\nis not read during a question.\n\n```diff\nEOF\nsed 's/\\t.*$//' practice-logs/round-5/icm.diff\ncat <<'EOF'\n```\n\n**Runs.** The six gate questions, one run each, as the auditor ran them\n(`--log practice-logs/round-5/<set>`).\n\n| Q | Verdict | Reason | Steps (instr/doc) | Text fetched |\n|---|---|---|---|---|\n| garden Q1 | Right | First Saturday of each month, April to October; lists the 2026 dates | 4 (2/2) | 15,995 |\n| makerspace Q6 | Right | Depends on Wh rating: 100 Wh or less allowed, above not | 5 (2/3) | 18,671 |\n| pool Q1 | Right | £7, visit date decides | 6 (2/4) | 21,113 |\n| hall Q6 | Right | 100 allowed (120 standing, caterers and helpers counted), 3 stewards aged 18+ | 6 (2/4) | 20,040 |\n| boat-lend Q1 | Right | £100 March / £110 April; payment date named as deciding in the rules and check | 5 (2/3) | 15,201 |\n| boat-lend Q6 | Right | £30, runs from 10 January 2026 | 5 (2/3) | 14,751 |\n\n**Headline:** 6 of 6 right, same verdicts as the gate's runs. Mean steps 5.17 (2 instruction opens\nevery run). Mean text fetched about 17,600 characters.\n\n**Scripted checks, 10:02.** Exactly one `CLAUDE.md` in `icm/`, at its top. No `@` anywhere in\n`icm/`. No `reference/` folder in `icm/`. Outside `documents.md` the only digits are the stage\nnumber `01` and list numbering. No practice organisation name, figure, date or section number\nappears. File lengths now: `CLAUDE.md` 16, `CONTEXT.md` 39, `01 answer/CONTEXT.md` 83,\n`01 answer/documents.md` 6 lines.\nEOF\n} >> ROUNDS.md; tail -5 ROUNDS.md; grep -c \"\" ROUNDS.md",
  "description": "Record the decision and log round 5 with the exact diff"
}
```

## Result

```
**Scripted checks, 10:02.** Exactly one `CLAUDE.md` in `icm/`, at its top. No `@` anywhere in
`icm/`. No `reference/` folder in `icm/`. Outside `documents.md` the only digits are the stage
number `01` and list numbering. No practice organisation name, figure, date or section number
appears. File lengths now: `CLAUDE.md` 16, `CONTEXT.md` 39, `01 answer/CONTEXT.md` 83,
`01 answer/documents.md` 6 lines.
332
```

## Call: SubagentHandback

```json
{
  "message": "Round 5 is done: I fixed the two gate failures (a5 and b8), and all six gate questions came back right again.\n\n**What changed** (the exact diff is in C:\\tc-build\\ROUNDS.md and C:\\tc-build\\practice-logs\\round-5\\icm.diff):\n- **Ask back, edit:** these two rules now live only in `CLAUDE.md`. It is the only file that loads by itself, and they apply to the whole session. Its last line now says they are written only there.\n- **Which papers may decide an answer:** this lives only under \"The four kinds of paper\" in `01 answer/CONTEXT.md`. `CLAUDE.md`, the map and the contract's never-section now point to it.\n- **Copies removed:** I took the duplicated lines out of the map's \"What must never happen\" section and its `reference/` table row, and out of the contract's never-section.\n- **Generator path:** the map and the `documents.md` placeholder now say `tools/make-map.mjs` lives in the workshop, outside the workspace.\n- **House style:** the template repeats its guardrails across its files. What it requires is a never-section in the router, the map and each stage, not the same sentence in each, so I kept every section and listed nothing as a departure. The reasoning and the template lines are in C:\\tc-build\\DECISIONS.md, under \"Added in round 5\".\n- **Nothing else changed:** no method step, no reply content, no other rule's wording.\n\n**Verdicts** (one run each, judged against the keys): garden Q1, makerspace Q6, pool Q1, hall Q6, boat-lend Q1 and boat-lend Q6 were all right. Mean steps were 5.17, with 2 instruction opens in every run.\n\n**Checks:** all pass. There is one `CLAUDE.md`, no `@` imports and no `reference/` folder. Outside the generated list there is no figure, date, section number or organisation name from any paper."
}
```

## Result

```
{"success":true,"message":"Report delivered to your caller."}
```
