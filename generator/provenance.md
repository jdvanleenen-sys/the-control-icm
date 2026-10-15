# Where the documents and questions came from

## The documents

Both sets were written by ChatGPT (a different maker from the model under test), each in one answer to one prompt, in its own temporary chat, on Sunday 2026-10-11. The prompt is `document-prompt.md` with the organisation and prefix filled in:

- Fenwray Film Society, prefix `film`: "a volunteer-run society that shows films in a hired room and lends out its projector and screen".
- Quillbrook Village Hall, prefix `hall`: "a village hall run by a committee of trustees that hires out its rooms and equipment".

A person sent each prompt from a browser and pasted the whole answer into the build session, which saved each document under its file name. Blank lines between one file and the next were not kept. Nothing else was changed. No review pass was made on either set, and no second attempt was made at either.

The model name ChatGPT showed was not recorded. No screenshot could be taken: the temporary chat did not allow one.

The build session is a Claude model of a different size from the model under test. It has read both sets. It did not write or change the folder's `identity.md`, `rules.md` or `examples.md` after reading them; those were written on earlier practice documents. The map, `README.md`, is produced by a script from the documents' own headers.

One fault was noticed and left alone: two film documents refer to `film-safety.md`, which ChatGPT did not write.

## The questions

Written by ChatGPT in a third temporary chat on Monday 2026-10-12, in one answer to `question-prompt.md`. It was given the 18 documents as two text files, one per organisation, each document under its file name, and nothing else. `question-pool.md` is that answer as pasted. A list of contradictions it reported came after the questions and is quoted in `key-check.md`.

## The key check

Gemini 3.8 Flash, in a temporary chat in the browser, on Monday 2026-10-12. See `key-check.md`.

## The draw

`node tools/draw.mjs`, run once, after the key check. It printed its seed, which is the fingerprint of `question-pool.md` and `dropped.txt`. Anyone can run `drawQuestions` on those two files and get the same ten.
