# Question prompt

Given word for word to ChatGPT in a new chat, with the documents of both organisations attached and nothing else. ChatGPT is told nothing about the folder, the experiment or what the questions are for. Task type: structured output, because a script reads the answer.

Everything below the line is the prompt.

---

Attached are the working papers of two small, made-up organisations. Each file begins with a header saying which organisation it belongs to and whether it is a governing document, a changes document, a summary or an archive copy.

Write 20 exam questions about these papers, 10 for each organisation, with the answer to each. They will be used to test how well a reader can find the right answer in the papers.

## What makes a good question here

- A careful reader who checks the papers gets it right. A hasty reader, who stops at the first passage that looks relevant, gets it wrong.
- The answer is checkable by a stranger: an amount, a date, a count, a yes or no, or a short list. Never a matter of opinion.
- It reads as a real person would ask it: a member, a volunteer or someone at the front desk describing a situation. Do not name a document, a file or a section number in the question.
- It gives every date and figure the answer depends on, with the year. Nothing may depend on today's date.
- No two questions rest on the same rule.

## The ten questions for each organisation

Write two questions of each of these five types, in this order. Make the two of a pair as good as each other: which one is used will be decided later by a random draw, and the other will be used as well.

1. **Plain lookup.** The answer sits in one governing document and no later decision changes it. What makes it hard is detail inside that document, such as two similar figures.
2. **Changed rule.** A later decision in the changes document alters the answer, or looks as if it does and, on the dates given, does not.
3. **Exception or condition.** A general rule has an exception, a limit or a condition in the same document, and the case in the question falls under it.
4. **Two documents.** The answer needs facts from two different governing documents put together.
5. **Trap.** For the organisation whose name comes first in the alphabet: the summary or the archive copy says something different from the governing document, and the governing document decides. For the other organisation: the papers do not contain the answer, and the right answer is to say so and say what the papers do cover nearby.

If the papers contradict themselves in a way that is not meant (two governing documents that disagree), do not write a question about it. List it under "Contradictions found" at the end.

## The form of your answer

One code block and one list, and nothing else.

**The block, named `question-pool.md`:** all 20 questions, numbered `P1` to `P20`. `P1` to `P10` are the first organisation in alphabetical order: two of type 1, then two of type 2, and so on. `P11` to `P20` are the second organisation in the same order.

Every question has exactly this form:

```
## P1

**Set:** <the prefix that starts that organisation's file names>

**Type:** <plain lookup | changed rule | exception or condition | two documents | trap>

**Prompt (paste exactly):**

> Under the <organisation's full name> rules: <the question>

**Expected answer:** <the answer in two to four sentences, with every figure and date, and the reason>

**Source:** <file name and section numbers the answer rests on>

**Correct requires:** <what an answer must contain to be right, and the specific wrong answers a hasty reader would give, each with the figure it would produce>
```

One filled-in example of the form, about an organisation that is not in your papers:

```
## P1

**Set:** choir

**Type:** exception or condition

**Prompt (paste exactly):**

> Under the Wexcombe Community Choir rules: A member aged 17 paid the adult annual subscription on 3 February 2026 because the treasurer did not know their age. They ask for the difference back on 20 February 2026. Are they owed anything, and how much?

**Expected answer:** Yes, £18. Members under 18 on the day they pay are charged the youth subscription of £12, not the adult subscription of £30, and an overpayment caused by the choir's mistake is refunded in full if it is asked for within 28 days of payment. 20 February is 17 days after 3 February.

**Source:** choir-fees.md, sections 2.1, 2.3 and 5.2.

**Correct requires:** The answer must say £18 is owed. It is wrong if it says nothing is owed because subscriptions are not refundable (the general rule in 5.1, ignoring 5.2), if it refunds the whole £30, or if it refuses the refund as out of time.
```

**The list, headed "Contradictions found":** one line for each unintended contradiction you noticed, with the two places. Write "None" if there were none.

Do not explain your choices. Do not add anything before, between or after these two parts.
