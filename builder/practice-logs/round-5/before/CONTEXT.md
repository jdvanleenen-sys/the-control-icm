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
