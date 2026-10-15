# Gate audit: Rules Desk workspace (`icm/`)

Audited 2026-10-15, 10:03 to 10:08 MDT, by a gate auditor that did not build the
workspace. Method: the `icm-architect` skill (SKILL.md, references/core.md, references/forms.md),
house style from `template/` (PO Verifier), limits from `BRIEF.md`. `DECISIONS.md` was read only
after the three lists below were scored. `ROUNDS.md` was not read.

Note: `DECISIONS.md` line 89 cites an earlier "GATE.md, items a5 and b8". No `GATE.md` existed in
`C:\tc-build\` when this audit started (checked with `ls` at 10:06). This file is a fresh audit.

## 1. Cold walk

Reads, in order: `icm/CLAUDE.md` (loads by itself), then `icm/01 answer/CONTEXT.md`, then
`icm/01 answer/documents.md`.

- After `CLAUDE.md` alone: I know what this is (one question, one organisation's papers, one
  reply, never ask back), and where to go: `01 answer/CONTEXT.md` and `01 answer/documents.md`
  together (lines 7-9), then the papers in `reference/`. Session-wide rules are on lines 14-16.
- After `01 answer/CONTEXT.md`: the whole job. Inputs (lines 7-13), the four kinds of paper and
  what each may decide (15-22), an eight-step ordered method (24-58), the reply's shape ending in
  a self-check and an `Answer:` line (60-78), never-rules (80-83).
- After `01 answer/documents.md`: in the shipped workspace it is a marked placeholder (7 lines)
  saying it is replaced whole by `tools/make-map.mjs`. In a staged room it holds the paper list
  (the hall-pool list generated for this audit is 3,550 characters, one line per paper with its
  covers line, kind, replaced sections and deciding-date note).
- Verdict: *where am I* and *where do I go* are both answered within the entry file plus two
  reads. The map (`icm/CONTEXT.md`) was not needed for a question, as `CLAUDE.md` line 11 says.

## 2. Practice run (one run each, `tools/practice.mjs`, model claude-sonnet-5-5)

Logs in `C:\tc-build\gate-logs\<set>\Q?-r1.jsonl`. No read was refused in any run.

| Set / Q | Verdict | Reason | Steps | Instruction opens | Chars fetched |
|---|---|---|---|---|---|
| garden-makerspace Q1 | RIGHT | "first Saturday of each month from April to October"; Amendment 3 correctly ruled out (5.2 only) | 4 | 2 | 15,995 |
| garden-makerspace Q6 | RIGHT | names the Wh rating as the missing fact; 100 Wh or less allowed (exactly 100 included), above 100 not | 5 | 2 | 18,671 |
| hall-pool Q1 | RIGHT | £7; Change 2 date-tested on the visit date; booking validity checked under Change 1 | 7 | 2 | 23,824 |
| hall-pool Q6 | RIGHT | 100 allowed (120 standing, helpers counted); 3 stewards aged 18 or over, "part of 40" rounded up | 6 | 2 | 20,040 |
| boat-lend Q1 | RIGHT | both outcomes £100 / £110 split at 1 April 2026, payment date named as the decider, £15 joining fee unchanged | 5 | 2 | 15,201 |
| boat-lend Q6 | RIGHT | £30 (change tested on the payment-accepted date); runs from 10 January 2026, not backdated | 5 | 2 | 14,751 |

6 of 6 right. Residuals, not errors: boat-lend Q1 frames the split as "the month they join and
pay" in the Answer line (the payment date is named in the rules and working, which the key
requires); boat-lend Q6 adds an unasked end date with a hedge; hall-pool Q6 adds an unasked
"steward count is the same at 95 or 100" line. One run per question is a small sample; these
verdicts say the workspace can answer these six, not that it will every time.

## 3. Scored lists

N/A is used only where a `BRIEF.md` harness limit makes the item impossible, and the limit is
named. One item is marked "out of scope" instead, because its own wording limits it to another
form; that is not a harness limit and is said so.

### (a) The walk test (SKILL.md, "The walk test")

| # | Item | Score | Evidence |
|---|---|---|---|
| a1 | Root answers where am I / where to go within entry + two reads | PASS | `CLAUDE.md` 7-9 routes to `01 answer/CONTEXT.md` + `documents.md`; all six runs used exactly 2 instruction opens |
| a2 | Contract names exact input paths, the job, the output, the human check | PASS (human-check clause N/A) | `01 answer/CONTEXT.md` 7-13 inputs (`documents.md`, `reference/<organisation folder>/`), 3-5 job, 60-72 output. Human check N/A: brief, "No person is present" and "must not tell the model to stop and ask" |
| a3 | Status derivable by scanning `output/` folders | N/A | Brief: "A session can only Read, Glob and Grep. It cannot write files." Nothing is written, so there is no status on disk; `CONTEXT.md` 19-21 says so |
| a4 | No routing file carries content payload | PASS | `CLAUDE.md` 16 lines, routing plus session rules only; `CONTEXT.md` (map) 40 lines, table + pointers; the method lives only in `01 answer/CONTEXT.md` |
| a5 | No fact stored in two places | PASS | Never-ask/never-edit: home `CLAUDE.md` 14-16, pointers at `CONTEXT.md` 38-39 and `01 answer/CONTEXT.md` 82-83. Paper kinds: home `01 answer/CONTEXT.md` 15-22, pointers at `CLAUDE.md` 15-16, `CONTEXT.md` 31-32. Residual: "never use the other organisation's papers" is said twice inside the one contract (25-26, 81) |
| a6 | Every reference resolves | PASS | Not a restructure; checked as reference integrity instead. Every in-workspace path in the three files exists in a staged room; no refused read in six runs. `tools/make-map.mjs` (`CONTEXT.md` 24-26) is outside the workspace by design and the file says so |
| a7 | Entry + contract + inputs in ~2k-8k tokens | PASS | 902 + 5,854 + ~3,550 chars of instructions and list; whole runs fetched 14,751-23,824 chars (~3.7k-6k tokens) |
| a8 | System map: what is X / what moves | out of scope | The item applies to the System map form only; this is a Pipeline (`DECISIONS.md` 8-12). Not a harness N/A |

### (b) The ten invariants (SKILL.md, "The invariants")

| # | Invariant | Score | Evidence |
|---|---|---|---|
| b1 | One folder, one job, purpose stated inside | PASS | `01 answer/CONTEXT.md` 3-5 states the single job; root `CONTEXT.md` 3-6 states the workspace's |
| b2 | Small, stable entry file that routes | PASS | `CLAUDE.md` is 16 lines (< 60), routes on 7-9; its only other content is the session-wide never-rules (14-16), as the house router does (`template/CLAUDE.md` 11) |
| b3 | Numbering encodes order | PASS | One stage, `01 answer`; the order inside it is the numbered method at `01 answer/CONTEXT.md` 24-58 |
| b4 | Every folder-level contract explicit (in, process, out, human check) | PASS (human-check clause N/A) | `01 answer/CONTEXT.md` 7 "What comes in", 24 "How to work", 60 "What goes out". Human check N/A: brief, no person present; a self-check replaces it at 67-70 |
| b5 | Factory vs product apart | PASS | Factory: the three instruction files plus `reference/` (supplied by the harness, `practice.mjs` 36-38); product: the reply, which never touches disk |
| b6 | Every output is an edit surface; a person reads it before the next step | N/A | Brief: sessions "cannot write files" and "No person is present" |
| b7 | Load only what the step needs | PASS | `01 answer/CONTEXT.md` 25-34 restricts reading to one organisation and the papers whose covers line touches a fact; runs read 2-5 of 9 papers |
| b8 | Plain text, linkable, queryable; one home per fact | PASS | All markdown; cross-references are workspace-root paths; queryability is the papers' frontmatter, which `make-map.mjs` turns into the list. The instruction files carry no frontmatter, as in the house style. One-home: see a5 |
| b9 | Filesystem is the state machine; generated indexes rebuilt by script, never hand-edited | PASS (status clause N/A) | `documents.md` is written by `makeMap()` (`tools/practice.mjs` 42); the shipped file is the marked placeholder the brief asks for. Status clause N/A: no writes (brief) |
| b10 | Instantiate by copying from `_templates/` | N/A | Brief: Read/Glob/Grep only, so a session cannot copy anything; the unit (a question) is a message, not a folder |

### (c) Fidelity to the house style (PO Verifier, `template/`)

| # | Element | Score | Evidence |
|---|---|---|---|
| c1 | Router `CLAUDE.md` | PASS | Same shape as `template/CLAUDE.md`: title, two-line purpose, numbered reads, closing never-line. Names the stage (line 7). Departs by skipping the map and `the-page.md` (see DECISIONS 7, 8) |
| c2 | Map `CONTEXT.md` | PASS | Same headings where they apply: "What this is", "What is here" (table naming `01 answer`), "How a question moves through" (mirrors "How a house moves through"), "How things are named", "What must never happen". Missing "What the numbers mean" (brief bars paper figures) and "Where Sam is asked" (no person) |
| c3 | Stage contract shape | PASS | `01 answer/CONTEXT.md` headings "What this stage is for", "What comes in", "What goes out", "What must never happen here" match `template/02 read/CONTEXT.md` |
| c4 | Each stage says where to go next | PASS | Terminal stage: "What goes out" (60-72) is the reply itself, as `template/05 request/CONTEXT.md` ends at its deliverable |
| c5 | Numbered stage folders, spaced names, `reference/` beside them | PASS | `01 answer` matches `01 intake`; `reference/` is supplied at stage time (`practice.mjs` 36-38 refuses a workspace that ships its own) |

## 4. DECISIONS.md review (read after scoring)

| Departure | Justified by the harness limits? |
|---|---|
| 1 Folder names with a space | Not a harness matter; justified by the brief's house-style rule ("follow the PO Verifier") |
| 2 No `stages/` wrapper | Same: house style, justified |
| 3 No `_shared/`, `_templates/`, `setup/` | Yes: no writes (nothing to copy into), papers supplied in `reference/`, nobody to configure |
| 4 No `output/`, no edit surface | Yes: Read/Glob/Grep only |
| 5 No human check | Yes: no person present, and the brief forbids "stop and ask" |
| 6 PO Verifier headings | House style, justified; content maps one to one |
| 7 No `the-page.md` | Partly. The brief's house-style list omits it, so leaving it out is defensible; no harness limit forces it |
| 8 Entry skips the map | Not forced by any limit. It is a step-budget choice (every read is a step because only `CLAUDE.md` autoloads). Defensible, and the six runs show it costs nothing, but it is a real departure from the house router's "read the map before doing anything" |
| 9 No `reference/` in the build | Yes: the harness copies the papers in and refuses a workspace that has its own |
| 10 "Stop and ask" replaced | Yes: no person present, brief forbids asking |
| Round-5 addendum (one home per never-rule) | Correct reading: the house style needs never-sections, not repeated sentences. Verified in a5 |

Also checked against the brief's figure rule: a grep of the three instruction files for digits
and currency finds only stage numbering and list markers. No paper figure, date, section number
or organisation name is in the workspace outside the generated list.

## 5. Problems recorded, not fixed (none is one of the four fixable kinds)

1. Maintainer instruction does not match the script. `icm/CONTEXT.md` 24-27 says "run the script
   again and write its output to that path". Run as a command, `tools/make-map.mjs` (lines 53-57)
   writes `README.md` at the workshop root from `C:\tc-build\reference\` and prints only a word
   count; only the exported `makeMap()` (as `practice.mjs` 42 calls it) produces the list. A
   maintainer following the map literally would not get `documents.md`. The sealed harness is
   unaffected.
2. Contract size. `01 answer/CONTEXT.md` is 5,854 characters (~1.5k tokens), about three times
   the L2 range in `core.md` (200-500 tokens), and it carries its constraints itself rather than
   pointing to an L3 file. The total budget (a7) still passes; this is a style residual.
3. Path base convention. The contract mixes a file-relative path ("`documents.md`, next to this
   file", line 10) with workspace-root paths (`reference/<organisation folder>/`, line 13); the
   house style uses `../` from the stage folder. Every run resolved them correctly.
4. Within-file repetition of "never use the other organisation's papers" (`01 answer/CONTEXT.md`
   25-26 and 81).

## 6. Fixes

None made. No missing file, broken path, router or map that fails to name a stage, or stage that
fails to say where it ends was found.

GATE: PASS
