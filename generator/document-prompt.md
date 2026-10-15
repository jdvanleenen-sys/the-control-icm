# Document prompt for one organisation

Given word for word to ChatGPT, once for each organisation, each in its own new chat. ChatGPT is told nothing else about the project. The two lines that differ between the runs are marked. This is rehearsal five's prompt with two changes: one sentence saying a replacement must differ from the wording it replaces, which rehearsal five added after a first attempt failed, and the last line, because a chat product has no folder to write to.

Everything below the line is the prompt.

---

Write the working papers of one small, made-up organisation. They will be used as a realistic small document library.

**The organisation (differs per run):** {ORGANISATION}

**The folder name and file prefix (differs per run):** {PREFIX}

## What to write

Eight or nine short documents, each 25 to 45 lines of Markdown, in plain English that a member of the public would understand. Together they should read like papers a real committee has kept up over a couple of years.

1. **Five or six governing documents.** Each covers one area (for example who can join, fees, booking, conduct, safety, refunds). Number the sections (1, 1.1, 1.2, 2 and so on). State real rules with real figures, dates, limits and time periods. Let some rules depend on others, and let some refer to another document by its file name.
2. **One changes document.** A dated log of later decisions that replace named sections of the governing documents. Give each entry an effective date and say exactly which date in a case decides whether the entry applies. Do not edit the governing documents to match: they keep their old wording. Every replacement must say something different from the wording it replaces.
3. **One summary document.** A front-desk or quick-guide sheet that restates common points in looser words. It must say that the governing documents prevail.
4. **One archive document.** An older, superseded version of one governing document, kept for the record, with some figures that differ from the current one.

## Rules for every document

- Start every file with this frontmatter, exactly in this form:

```
---
set: <the organisation's name>
role: <one of: governing, changes, summary, archive>
covers: "<one line: what this document covers>"
---
```

  The changes document also has, inside the same frontmatter and before the closing line:

```
replaces:
  - "<section number and heading> in <file name>"
  - "<section number and heading> in <file name>"
note: "<one line: which date decides whether an entry applies>"
```

- Name every file `{PREFIX}-<topic>.md`, lower case with hyphens. Every file name starts with the prefix.
- After the frontmatter, start with a `# ` title, then a line saying the organisation is fictional.
- Write every date in full with its year (for example 14 March 2026). Use dates in 2025 and 2026.
- Leave a small number of matters plainly not covered, and have one document say so in a short section listing them.
- Keep the documents consistent with each other, except where the changes document, the summary or the archive is meant to differ. No contradictions between two governing documents.
- No real organisations, people or places.

Give each file as its own code block with its file name on the line above it. Write nothing else.
