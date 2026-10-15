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
