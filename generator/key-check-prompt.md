# Key check prompt, and the rule for a disputed answer

Given word for word to Gemini in a new chat, with the documents of both organisations attached and the 20 prompts pasted in where marked. Gemini gets no expected answers, no question types, and nothing about the folder or the experiment. Task type: structured output.

## The rule, fixed before any question exists

The key check comes before the draw, and covers all 20 questions in the pool.

1. Gemini's answer to each question is compared with the expected answer on every amount, date, count and yes or no. If all of them match, the question stays in the pool.
2. If any differ, the second prompt below goes to both ChatGPT (in the chat that wrote the question) and Gemini (in the chat that answered it), each shown the other's answer.
3. If after that one round both give the expected answer, the question stays in the pool.
4. In every other case the question's number goes into `generator/dropped.txt` and it is out: never drawn, never held out.
5. No question and no expected answer is ever reworded.
6. `node tools/draw.mjs` then draws one question per type per organisation from what is left. The seed is the fingerprint of the pool and the dropped list, so nobody chooses. The questions not drawn are the held-out questions. If a type has no question left for an organisation, the exam is one short and the results page says so.
7. Every comparison and every dispute is written into `generator/key-check.md` in the entry, with both models' words.

A type that Gemini names differently from the question writer is recorded and changes nothing.

## Prompt one: answer the questions

Everything between the lines is the prompt.

---

Attached are the working papers of two small, made-up organisations. Each file begins with a header saying which organisation it belongs to and whether it is a governing document, a changes document, a summary or an archive copy.

Below are 20 questions about them. Answer each one from the papers alone. Read as much as you need to be sure. If the papers do not contain the answer, say so.

For each question give exactly this, and nothing else:

```
## <the question's number>

**Answer:** <the answer in one to three sentences, with every amount, date, count and yes or no it needs>

**Rests on:** <file name and section numbers>

**Type:** <the one that fits best: plain lookup | changed rule | exception or condition | two documents | trap>
```

For the type: "plain lookup" means one governing document settles it; "changed rule" means a later decision in the changes document matters; "exception or condition" means a general rule has an exception that applies; "two documents" means two governing documents are needed together; "trap" means a summary or archive copy disagrees with the governing text, or the papers do not contain the answer.

The questions:

{PASTE THE 20 PROMPTS HERE, EACH UNDER ITS NUMBER, WITH NOTHING ELSE}

---

## Prompt two: a disputed answer

Sent to each model about each disputed question. Everything between the lines is the prompt.

---

On question {NUMBER}, another reader of the same papers gave this answer:

{THE OTHER MODEL'S ANSWER, WORD FOR WORD}

Quote the sentences from the papers that decide the question, each with its file name and section number. Then give your answer again in one to three sentences, with every amount, date, count and yes or no. Say plainly whether you are keeping your first answer or changing it.

---
