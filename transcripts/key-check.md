## Prompt

You run the key check for a new set of exam questions, in the repo C:\GitHub\the-control-icm. The person who sent you must stay BLIND to the questions: your final report must NOT contain any question text, expected answer, figure, date, organisation rule or document detail. Report only question numbers, types, organisation prefixes, counts and short reason codes.

Background: a fresh Claude Opus session wrote 20 questions from the prompt in generator\question-prompt.md (raw answer at generator\new\write.answer.md, session id in generator\new\write.session.json). The rule for checking keys is in generator\key-check-prompt.md; read it in full and follow it exactly, with these substitutions: "ChatGPT" means the writer session (claude-opus-5-5, resumed by its session id) and "Gemini" means the checker (claude-fable-5-1). Use generator\key-check.md only as an example of how the entry recorded its key check.

Set the program path first in every PowerShell command that runs Claude:
$env:CLAUDE_BIN = (Get-ChildItem "$env:USERPROFILE\.vscode\extensions\anthropic.claude-code-*\resources\native-binary\claude.exe" | Sort-Object LastWriteTime | Select-Object -Last 1).FullName
Run node from C:\GitHub\the-control-icm. The script tools\new-questions.mjs does the model calls; read it first.

Steps:
1. From write.answer.md take the `question-pool.md` code block exactly as written and save it as generator\new\question-pool.md, changing ONLY the headings "## P1".."## P20" to "## N1".."## N20" (same order). Save the "Contradictions found" list as generator\new\contradictions.md. Write the renaming as a tiny committed script tools\renumber-new.mjs so it can be re-run, and run it. Do not change any other character.
2. Run `node tools/new-questions.mjs check`. If the claude-fable-5-1 model is not available, STOP and report that; do not substitute another model.
3. Compare each checker answer with the expected answer on every amount, date, count and yes or no, as rule 1 says.
4. For each disputed question, run prompt two (the second prompt in key-check-prompt.md, filled in) once to the writer and once to the checker, each shown the other's answer word for word, by writing a JSON spec {model, prompt, label, resume} and running `node tools/new-questions.mjs dispute <spec>`; the writer's resume id is in write.session.json and the checker's in check.session.json. Labels like dispute-N7-writer, dispute-N7-checker. Apply rules 3 and 4.
5. De-duplication: a new question whose **Source** sections are the same file and section numbers as any question in questions.md or questions-heldout.md is dropped (reason code "same-source"). Compare by file name plus section numbers only.
6. Write generator\new\key-check.md recording every comparison and every dispute with both models' words (as the entry's key-check.md does), generator\new\dropped.txt (one number per line with its reason code), and questions-new.md at the repo root holding the surviving questions in the same form as question-pool.md, in order, with their N numbers. No question or expected answer is ever reworded.
7. Commit everything you created (git add the specific files; message "New questions: written, key-checked and de-duplicated", ending with the line "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"). Do not commit anything else, and do not touch PLAN.md or DESIGN-LOG.md.

Final report, under 200 words, with NO question content: the model ids each session actually reported, how many questions were written, how many disputed (numbers only), how many dropped and each one's reason code (disputed / same-source), how many survive per organisation prefix and per type, the commit hash, and anything that went wrong.

## Call: PowerShell

```json
{
  "command": "Get-Date; cd C:\\GitHub\\the-control-icm; git status --short; git log --oneline -3; Get-ChildItem generator, generator\\new, tools | Select-Object FullName,Length",
  "description": "Check date and repo state"
}
```

## Result

```
Thursday, October 15, 2026 9:35:56 AM
?? generator/new/
?? tools/new-questions.mjs
dc6f91d Plan, version 1, after the first design review (method)
ac2e635 Plan, version 0
d6ff7ec Starting point: the entry's harness, documents, questions and folder, copied from the-control at 41b93a0

FullName : C:\GitHub\the-control-icm\generator\new
Length   : 


FullName : C:\GitHub\the-control-icm\generator\document-prompt.md
Length   : 3295


FullName : C:\GitHub\the-control-icm\generator\dropped.txt
Length   : 0


FullName : C:\GitHub\the-control-icm\generator\key-check-prompt.md
Length   : 3476


FullName : C:\GitHub\the-control-icm\generator\key-check.md
Length   : 9980


FullName : C:\GitHub\the-control-icm\generator\provenance.md
Length   : 2183


FullName : C:\GitHub\the-control-icm\generator\question-pool.md
Length   : 21561


FullName : C:\GitHub\the-control-icm\generator\question-prompt.md
Length   : 4982


FullName : C:\GitHub\the-control-icm\generator\new\write.answer.md
Length   : 18003


FullName : C:\GitHub\the-control-icm\generator\new\write.prompt.txt
Length   : 40897


FullName : C:\GitHub\the-control-icm\generator\new\write.session.json
Length   : 165


FullName : C:\GitHub\the-control-icm\generator\new\write.stream.jsonl
Length   : 99883


FullName : C:\GitHub\the-control-icm\tools\ask.mjs
Length   : 1847


FullName : C:\GitHub\the-control-icm\tools\draw.mjs
Length   : 4328


FullName : C:\GitHub\the-control-icm\tools\heldout.mjs
Length   : 2674


FullName : C:\GitHub\the-control-icm\tools\key-facts.mjs
Length   : 7319


FullName : C:\GitHub\the-control-icm\tools\make-map.mjs
Length   : 2806


FullName : C:\GitHub\the-control-icm\tools\new-questions.mjs
Length   : 4836


FullName : C:\GitHub\the-control-icm\tools\probe.mjs
Length   : 2647


FullName : C:\GitHub\the-control-icm\tools\rerun.mjs
Length   : 5289


FullName : C:\GitHub\the-control-icm\tools\reveal.mjs
Length   : 5238


FullName : C:\GitHub\the-control-icm\tools\run.mjs
Length   : 7005


FullName : C:\GitHub\the-control-icm\tools\schedule.mjs
Length   : 2909
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm; cat generator/key-check-prompt.md; echo ======; cat tools/new-questions.mjs; echo =====; cat generator/new/write.session.json",
  "description": "Read key-check rule, script, session"
}
```

## Call: Read

```json
{
  "file_path": "C:\\GitHub\\the-control-icm\\generator\\new\\write.answer.md"
}
```

## Result

```
1	```question-pool.md
2	## P1
3	
4	**Set:** film
5	
6	**Type:** plain lookup
7	
8	**Prompt (paste exactly):**
9	
10	> Under the Fenwray Film Society rules: I'm a member and I'm bringing my two children to a screening on 14 March 2026. They are not members. One is 12 and the other is 9, and both will be with me the whole time. What do the two children's tickets cost in total?
11	
12	**Expected answer:** £8. A child aged 12 to 15 pays £5 and a child under 12 accompanied by an adult pays £3. The 12-year-old is in the 12 to 15 band, not the under-12 band. Neither child price has been changed by a later decision.
13	
14	**Source:** film-fees.md, sections 2.3 and 2.4.
15	
16	**Correct requires:** The answer must say £8 (£5 plus £3). It is wrong if it treats the 12-year-old as under 12 (£6), charges both children £5 (£10), charges both standard admission of £7 (£14), or applies the member price to the children (£10 at £5 each).
17	
18	## P2
19	
20	**Set:** film
21	
22	**Type:** plain lookup
23	
24	**Prompt (paste exactly):**
25	
26	> Under the Fenwray Film Society rules: I'm an adult member and I want to hire both the projector and the screen together for two booking days, collecting on 10 May 2025. Leaving the deposit aside, what is the hire charge?
27	
28	**Expected answer:** £46. Hiring both together costs £23 per booking day, not the £18 projector rate plus the £8 screen rate. Two days at £23 is £46. Hire rates have not been changed by a later decision.
29	
30	**Source:** film-fees.md, sections 3.1, 3.2 and 3.3.
31	
32	**Correct requires:** The answer must say £46. It is wrong if it adds the separate rates (£26 a day, £52 in total), uses the archived combined rate of £19 (£38), or adds the deposit into the hire charge (£126 with an £80 deposit).
33	
34	## P3
35	
36	**Set:** film
37	
38	**Type:** changed rule
39	
40	**Prompt (paste exactly):**
41	
42	> Under the Fenwray Film Society rules: My adult membership application was accepted on 25 June 2025. I sent the fee by bank transfer on 30 June 2025 and it cleared in the society's account on 2 July 2025. How much should I have paid?
43	
44	**Expected answer:** £28. From 1 July 2025 annual adult membership costs £28 instead of £24, and the date the payment is received decides the fee. A bank transfer counts as received when it clears, which was 2 July 2025.
45	
46	**Source:** film-changes.md, section 1 (1.2 to 1.4); film-fees.md, sections 1.1 and 4.5.
47	
48	**Correct requires:** The answer must say £28 and rest on the transfer clearing on 2 July 2025. It is wrong if it says £24 because the transfer was sent on 30 June, or because the application was accepted before 1 July.
49	
50	## P4
51	
52	**Set:** film
53	
54	**Type:** changed rule
55	
56	**Prompt (paste exactly):**
57	
58	> Under the Fenwray Film Society rules: At the screening on 30 May 2026, 38 audience members are already inside and two duty volunteers are on shift. I heard the committee voted on 22 May 2026 to lower the audience limit. Can I let in one more person who has just arrived?
59	
60	**Expected answer:** Yes. The limit of 36 applies only to screenings on or after 1 June 2026, and the screening date decides the limit. On 30 May 2026 the limit is still 42 people, excluding duty volunteers, so a 39th audience member can be admitted.
61	
62	**Source:** film-screenings.md, section 3.1; film-changes.md, section 5 (5.2 and 5.3).
63	
64	**Correct requires:** The answer must say yes, under a limit of 42. It is wrong if it refuses entry because the limit is 36 (applying the decision from its decision date of 22 May 2026), or if it counts the two duty volunteers and puts the room at 40 against a limit.
65	
66	## P5
67	
68	**Set:** film
69	
70	**Type:** exception or condition
71	
72	**Prompt (paste exactly):**
73	
74	> Under the Fenwray Film Society rules: I'm joining as a new member and the treasurer received my payment on 10 February 2026. When does my membership end?
75	
76	**Expected answer:** 28 February 2027. Membership normally lasts until the 28 February following the payment date, but someone who joins during February keeps membership until 28 February of the following year. Payment on 10 February 2026 falls under that exception.
77	
78	**Source:** film-membership.md, sections 3.1, 3.2 and 3.3.
79	
80	**Correct requires:** The answer must say 28 February 2027. It is wrong if it applies the general rule and says 28 February 2026 (18 days of membership), or uses the archived end date of 31 January (31 January 2027).
81	
82	## P6
83	
84	**Set:** film
85	
86	**Type:** exception or condition
87	
88	**Prompt (paste exactly):**
89	
90	> Under the Fenwray Film Society rules: I paid £4 as a member for the screening on 15 May 2025. At the door I was told the advertised film had been replaced. I went in anyway, didn't like it, and left after 20 minutes. Can I get my £4 back?
91	
92	**Expected answer:** No, nothing is refunded. When the advertised film changes, a buyer may ask for a full refund before entry, but someone who enters after being told about the change loses that option. The usual cancellation refund also does not apply, because the request came after the screening had started, well inside 48 hours.
93	
94	**Source:** film-refunds.md, sections 2.2, 2.3 and 1.3.
95	
96	**Correct requires:** The answer must say no refund (£0) because the member entered after being told. It is wrong if it gives a full £4 refund under the film-change rule, or treats the case as a society cancellation with a full refund.
97	
98	## P7
99	
100	**Set:** film
101	
102	**Type:** two documents
103	
104	**Prompt (paste exactly):**
105	
106	> Under the Fenwray Film Society rules: The committee suspended a member from 1 April 2026 to 20 April 2026. They want to come to the screening on 10 April 2026. What do they pay for a ticket?
107	
108	**Expected answer:** £7, the standard admission. A suspension is allowed under the conduct rules, and during a suspension the membership rules bar the member from claiming member prices. Standard admission is £7 and no later decision changes it.
109	
110	**Source:** film-conduct.md, sections 4.1 and 4.4; film-membership.md, section 5.4; film-fees.md, section 2.1.
111	
112	**Correct requires:** The answer must say £7 because a suspended member cannot claim member prices. It is wrong if it charges the current member price of £5, the original member price of £4, or says the person cannot attend at all.
113	
114	## P8
115	
116	**Set:** film
117	
118	**Type:** two documents
119	
120	**Prompt (paste exactly):**
121	
122	> Under the Fenwray Film Society rules: I hired the projector only, for two booking days, collecting at 12:00 on 4 June 2025. I had no extension and returned it at 15:00 on 7 June 2025. Leaving the deposit aside, what do I owe in hire and late charges together?
123	
124	**Expected answer:** £56. A booking day runs noon to noon, so two booking days ended at 12:00 on 6 June 2025. Projector hire is £18 a day, which is £36. The return was 27 hours late, which starts two 24-hour periods at £10 each, adding £20.
125	
126	**Source:** film-equipment.md, sections 2.1, 2.2 and 5.2; film-fees.md, section 3.1.
127	
128	**Correct requires:** The answer must say £56 (£36 hire plus £20 late charge). It is wrong if it charges one late period (£46), counts days from midnight rather than noon, or charges the combined projector-and-screen rate (£46 hire, £66 total).
129	
130	## P9
131	
132	**Set:** film
133	
134	**Type:** trap
135	
136	**Prompt (paste exactly):**
137	
138	> Under the Fenwray Film Society rules: On 28 April 2025 I asked to book the projector for three consecutive booking days, collecting at noon on 6 May 2025. Someone told me the limit is two days. Am I allowed three?
139	
140	**Expected answer:** Yes. From 1 March 2025 the hire limit is three consecutive booking days, and the request was made more than three calendar days ahead. The two-day limit comes from the superseded fee schedule, which applied only in February 2025. The later five-day limit applies only from 1 April 2026.
141	
142	**Source:** film-equipment.md, sections 1.2 and 2.2; film-fees-archive.md, sections 3.6 and 5.1; film-changes.md, section 4.
143	
144	**Correct requires:** The answer must say yes, three days allowed, under a three-day limit. It is wrong if it refuses because of the archived two-day limit, or if it says up to five days are allowed (applying the April 2026 decision early).
145	
146	## P10
147	
148	**Set:** film
149	
150	**Type:** trap
151	
152	**Prompt (paste exactly):**
153	
154	> Under the Fenwray Film Society rules: A 16-year-old has handed in the membership form with a parent's written consent and been accepted. The treasurer received their payment on 5 August 2025. How much is their annual membership?
155	
156	**Expected answer:** £12. Annual membership for people aged 16 or 17 costs £12. The £10 figure in the archived schedule applied only in February 2025. The July 2025 increase to £28 replaced only the adult fee, not the 16 to 17 fee.
157	
158	**Source:** film-fees.md, section 1.2; film-fees-archive.md, sections 1.2 and 5.1; film-changes.md, section 1.
159	
160	**Correct requires:** The answer must say £12. It is wrong if it says £10 (the archived figure), £28 (the changed adult fee), or £24 (the original adult fee).
161	
162	## P11
163	
164	**Set:** hall
165	
166	**Type:** plain lookup
167	
168	**Prompt (paste exactly):**
169	
170	> Under the Quillbrook Village Hall rules: For our event on 6 December 2025 we've booked the Main Hall and the Meeting Room at the same time. Counting organisers and children, 105 people will be in the building. Is that allowed?
171	
172	**Expected answer:** No. The Main Hall holds up to 90 and the Meeting Room up to 24, but a combined event may not exceed 100 people in the building. The limits include organisers, performers and children, so 105 is over the limit.
173	
174	**Source:** hall-bookings.md, sections 4.1, 4.2, 4.3 and 4.4.
175	
176	**Correct requires:** The answer must say no, under a combined limit of 100. It is wrong if it adds the two room limits and allows up to 114, or if it leaves organisers or children out of the count.
177	
178	## P12
179	
180	**Set:** hall
181	
182	**Type:** plain lookup
183	
184	**Prompt (paste exactly):**
185	
186	> Under the Quillbrook Village Hall rules: We're not a village group. On Tuesday 10 June 2025 we want the Meeting Room for 3 hours, including setup and clearing, with the kitchen, the projector and two sets of folding display boards. What is the total hire charge?
187	
188	**Expected answer:** £69. The Meeting Room costs £12 an hour, so 3 hours is £36. The kitchen is £8 per booking, the projector £15 per booking, and display boards £5 per set, so two sets are £10.
189	
190	**Source:** hall-fees.md, sections 2.2, 2.3, 4.1 and 4.3.
191	
192	**Correct requires:** The answer must say £69. It is wrong if it charges display boards once (£64), uses the Main Hall rate of £24 an hour (£105), or uses archived prices (£10 an hour, £6 kitchen, £12 projector, £4 a set: £56).
193	
194	## P13
195	
196	**Set:** hall
197	
198	**Type:** changed rule
199	
200	**Prompt (paste exactly):**
201	
202	> Under the Quillbrook Village Hall rules: Our Main Hall booking was accepted in September 2025 for an event on 8 November 2025, lasting 4 hours including setup and clearing. We aren't a village group. What is the room hire charge?
203	
204	**Expected answer:** £112. From 1 November 2025 the Main Hall costs £28 an hour instead of £24, and the first date of the booked event decides the rate. The event is on 8 November 2025, so 4 hours at £28 is £112, however early the booking was made.
205	
206	**Source:** hall-changes.md, section 2 (2.1 to 2.3); hall-fees.md, section 2.1.
207	
208	**Correct requires:** The answer must say £112. It is wrong if it uses the £24 rate because the booking was accepted before November (£96), or the archived £20 rate (£80).
209	
210	## P14
211	
212	**Set:** hall
213	
214	**Type:** changed rule
215	
216	**Prompt (paste exactly):**
217	
218	> Under the Quillbrook Village Hall rules: Our event is on 15 June 2026. Our written cancellation reached the booking officer on 29 May 2026. What share of our hire charges do we get back, and do we get the £30 booking deposit back?
219	
220	**Expected answer:** 50% of room, kitchen and equipment hire charges, and the £30 booking deposit is not refunded. The cancellation came 17 days before the event, in the 14 to 27 day band. The 25% rate for that band applies only to cancellations received on or after 1 June 2026, and this one was received on 29 May 2026.
221	
222	**Source:** hall-refunds.md, sections 1.4, 2.2, 2.4, 2.5 and 2.6; hall-changes.md, section 6.
223	
224	**Correct requires:** The answer must say 50% and that the booking deposit is kept. It is wrong if it says 25% (applying the change from its 14 May 2026 decision date or from the event date), or if it refunds the £30 booking deposit.
225	
226	## P15
227	
228	**Set:** hall
229	
230	**Type:** exception or condition
231	
232	**Prompt (paste exactly):**
233	
234	> Under the Quillbrook Village Hall rules: For a party on 20 September 2025 we paid the full £150 hire charge, which included the £30 booking deposit, plus a £100 damage deposit because we had permission to serve alcohol. Our written cancellation reached the booking officer on 10 September 2025. How much do we get back?
235	
236	**Expected answer:** £100. A cancellation 10 days before the event, fewer than 14 days, gives no refund of hire charges, and the booking deposit is non-refundable. An unused damage deposit is returned in full after a hirer cancellation.
237	
238	**Source:** hall-refunds.md, sections 1.4, 2.3, 2.5 and 4.5.
239	
240	**Correct requires:** The answer must say £100, the damage deposit only. It is wrong if it says nothing is returned (£0), returns the booking deposit too (£130), or applies a 50% hire refund (£160 with the damage deposit).
241	
242	## P16
243	
244	**Set:** hall
245	
246	**Type:** exception or condition
247	
248	**Prompt (paste exactly):**
249	
250	> Under the Quillbrook Village Hall rules: Our booking was accepted in writing on 2 October 2025 for an event on 12 October 2025. When do we have to pay the deposit and the rest of the hire charge?
251	
252	**Expected answer:** The full hire charge, including the booking deposit, is due at acceptance on 2 October 2025. Normally the deposit is due within seven days of acceptance and the balance 14 days before the event. A booking made fewer than 14 days ahead requires full payment at acceptance instead, and this one was made 10 days ahead.
253	
254	**Source:** hall-fees.md, sections 6.1, 6.2 and 6.3.
255	
256	**Correct requires:** The answer must say full payment on 2 October 2025. It is wrong if it gives the deposit until 9 October 2025 and the balance by 28 September 2025, or uses the archived seven-day rule (balance due 5 October 2025).
257	
258	## P17
259	
260	**Set:** hall
261	
262	**Type:** two documents
263	
264	**Prompt (paste exactly):**
265	
266	> Under the Quillbrook Village Hall rules: We're not a village group. We want the Meeting Room on Sunday 13 July 2025 from 15:00 for as long as we're allowed, including clearing up. What is the most we can be charged for room hire?
267	
268	**Expected answer:** £72. On Sunday the hall is open 09:00 to 21:00, and setup and clearing must fit within the booked hours, so the booking can run at most from 15:00 to 21:00, which is 6 hours. The Meeting Room costs £12 an hour.
269	
270	**Source:** hall-bookings.md, sections 3.3 and 3.5; hall-fees.md, sections 2.2 and 2.6.
271	
272	**Correct requires:** The answer must say £72 for 6 hours. It is wrong if it uses the Monday to Thursday closing of 22:00 (7 hours, £84), the Friday and Saturday closing of 23:00 (8 hours, £96), or the Main Hall rate (£144).
273	
274	## P18
275	
276	**Set:** hall
277	
278	**Type:** two documents
279	
280	**Prompt (paste exactly):**
281	
282	> Under the Quillbrook Village Hall rules: For a birthday party in the Main Hall on 14 June 2025 we have written permission to serve wine to guests. We won't sell it. What deposits do we need to pay in total?
283	
284	**Expected answer:** £130. Every booking needs a £30 booking deposit. Permission to serve alcohol requires the damage deposit, which is £100 and separate from the booking deposit.
285	
286	**Source:** hall-conduct.md, sections 3.1 and 3.3; hall-fees.md, sections 5.1, 5.2 and 5.3.
287	
288	**Correct requires:** The answer must say £130 (£30 plus £100). It is wrong if it gives only the £30 booking deposit, only the £100 damage deposit, or uses the archived figures (£20 plus £75, £95).
289	
290	## P19
291	
292	**Set:** hall
293	
294	**Type:** trap
295	
296	**Prompt (paste exactly):**
297	
298	> Under the Quillbrook Village Hall rules: At the committee meeting on 3 November 2026 three trustees are in the room and a fourth wants to join by video call. Does the fourth trustee count towards the quorum?
299	
300	**Expected answer:** The papers do not say. The trustee rules state that they do not specify whether trustees may attend remotely. What they do cover is that four trustees form a quorum, decisions need a majority of those present and voting, and the committee meets at least six times a year.
301	
302	**Source:** hall-trustees.md, sections 6.3, 4.1, 4.2 and 4.3.
303	
304	**Correct requires:** The answer must say the rules do not cover remote attendance and mention the four-trustee quorum. It is wrong if it says yes (the meeting is quorate with four) or no (only three count, so it is not quorate) as though the rules decided it.
305	
306	## P20
307	
308	**Set:** hall
309	
310	**Type:** trap
311	
312	**Prompt (paste exactly):**
313	
314	> Under the Quillbrook Village Hall rules: A hirer lost the hall key after their event on 12 September 2026. How much do they have to pay for the lost key?
315	
316	**Expected answer:** The papers do not set a charge for a lost key. They say keys are collected from the booking officer by arrangement and may not be copied or passed to another hirer. Damage must be reported within 24 hours after the event, and documented repair costs may be deducted from a damage deposit, which is required only for events serving alcohol.
317	
318	**Source:** hall-bookings.md, sections 5.1 and 5.2; hall-conduct.md, sections 5.4 and 5.5; hall-refunds.md, section 4.2; hall-fees.md, section 5.2.
319	
320	**Correct requires:** The answer must say no lost-key charge is set and mention the key rules nearby. It is wrong if it states a figure, such as keeping the £30 booking deposit or deducting from a £100 damage deposit, as the set charge for a lost key.
321	```
322	
323	**Contradictions found**
324	
325	- hall-changes.md section 7.2 (from 1 July 2026 the chair may authorise up to £650 for urgent safety work) against hall-trustees.md section 5.4 (two trustees must approve payments above £500). hall-safety.md section 5.2 overrides only hall-trustees.md section 5.2, so payments between £500.01 and £650 fall under both rules.
```

## Result

```
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
======
// Asks a fresh Claude session the entry's question prompt (or key-check prompt), word for word,
// with the 18 documents attached as two text files, one per organisation, as the entry did.
// The session runs in an empty folder with no tools, so it sees the prompt and nothing else.
//
//   node tools/new-questions.mjs write          the writer: claude-opus-5-5, question-prompt.md
//   node tools/new-questions.mjs check          the key check: claude-fable-5-1, prompt one
//   node tools/new-questions.mjs dispute <file> one dispute round, resuming the session named in <file>
//
// Every prompt sent and every raw reply is saved under generator/new/.

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAUDE_BIN, EFFORT, REPO } from '../lib/config.mjs';
import { sessionEnv } from '../lib/claude.mjs';

const OUT = join(REPO, 'generator', 'new');
const WRITER = 'claude-opus-5-5';
const CHECKER = 'claude-fable-5-1';

// The part of a prompt file between the first two lines that are exactly "---" after the heading.
export function promptBody(file, which = 0) {
  const text = readFileSync(join(REPO, 'generator', file), 'utf8').replace(/\r\n/g, '\n');
  const parts = text.split('\n---\n');
  if (parts.length < 2 + which * 2) throw new Error(`${file} has no prompt number ${which + 1}.`);
  return parts[1 + which * 2].trim();
}

// The documents as two text files, one per organisation, each document under its file name.
export function attachments() {
  const lib = join(REPO, 'reference');
  return readdirSync(lib).sort().map((set) => {
    const docs = readdirSync(join(lib, set)).filter((n) => n.endsWith('.md')).sort();
    const body = docs.map((n) => `### ${n}\n\n${readFileSync(join(lib, set, n), 'utf8').replace(/\r\n/g, '\n').trim()}`).join('\n\n');
    return `<attached file="${set}.txt">\n${body}\n</attached>`;
  }).join('\n\n');
}

function run(model, prompt, label, resume = null) {
  mkdirSync(OUT, { recursive: true });
  const room = mkdtempSync(join(tmpdir(), 'tc-q-'));
  const args = ['--setting-sources', 'project', '-p', '--model', model, '--effort', EFFORT, '--tools', '',
    '--strict-mcp-config', '--disable-slash-commands', '--output-format', 'stream-json', '--verbose'];
  if (resume) args.push('--resume', resume);
  writeFileSync(join(OUT, `${label}.prompt.txt`), prompt);
  const done = spawnSync(CLAUDE_BIN, args, { cwd: room, input: prompt, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: sessionEnv(), timeout: 900000 });
  writeFileSync(join(OUT, `${label}.stream.jsonl`), done.stdout ?? '');
  const events = (done.stdout ?? '').split('\n').filter(Boolean).map((line) => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean);
  const result = events.find((e) => e.type === 'result');
  const init = events.find((e) => e.type === 'system' && e.subtype === 'init');
  if (!result || result.is_error) throw new Error(`${label}: no answer (exit ${done.status}). ${done.stderr ?? ''}`.trim());
  writeFileSync(join(OUT, `${label}.answer.md`), result.result);
  writeFileSync(join(OUT, `${label}.session.json`), JSON.stringify({ model: init?.model, version: init?.claude_code_version, session: result.session_id, label, at: new Date().toISOString() }, null, 2));
  console.log(`${label}: ${init?.model}, ${result.result.length} characters, saved under generator/new/`);
  return result.result;
}

const WRITE_PREFIX = 'Attached are the working papers';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [mode, arg] = process.argv.slice(2);
  if (mode === 'write') {
    const body = promptBody('question-prompt.md');
    if (!body.startsWith(WRITE_PREFIX)) throw new Error('question-prompt.md did not split where expected.');
    run(WRITER, `${body}\n\n${attachments()}`, 'write');
  } else if (mode === 'check') {
    const pool = readFileSync(join(OUT, 'question-pool.md'), 'utf8');
    const prompts = [...pool.matchAll(/^## (N\d+)[\s\S]*?\*\*Prompt \(paste exactly\):\*\*\s*\n\s*\n> (.+)$/gm)].map((m) => `## ${m[1]}\n\n${m[2].trim()}`);
    if (prompts.length === 0) throw new Error('No prompts found in generator/new/question-pool.md.');
    const body = promptBody('key-check-prompt.md', 0).replace('{PASTE THE 20 PROMPTS HERE, EACH UNDER ITS NUMBER, WITH NOTHING ELSE}', prompts.join('\n\n'));
    run(CHECKER, `${body}\n\n${attachments()}`, 'check');
  } else if (mode === 'dispute') {
    const spec = JSON.parse(readFileSync(arg, 'utf8'));
    run(spec.model, spec.prompt, spec.label, spec.resume);
  } else {
    console.error('Usage: node tools/new-questions.mjs write | check | dispute <file>');
    process.exit(1);
  }
}
=====
{
  "model": "claude-opus-5-5",
  "version": "2.1.300",
  "session": "350de3b9-2f0f-41e0-8e96-363b59deca22",
  "label": "write",
  "at": "2026-10-15T15:35:21.976Z"
}
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm; head -c 400 generator/key-check.md; echo; echo =====; sed -n 1,80p generator/key-check.md | tail -n +5; echo ====; cat lib/config.mjs | head -40; file generator/new/write.answer.md; ls; grep -n \"Source\" questions.md questions-heldout.md",
  "description": "Inspect example key-check, config, sources"
}
```

## Result

```
# Key check

Done on Monday 2026-10-12, before the draw. The rule is in `key-check-prompt.md`.

## Who answered

Gemini 3.8 Flash, in the browser, in a temporary chat. It was given the 18 documents as two text files (one per organisation, each document under its file name) and the 20 prompts with no expected answers and no types. It was told nothing about the folder or the experiment.

## The resu
=====
## Who answered

Gemini 3.8 Flash, in the browser, in a temporary chat. It was given the 18 documents as two text files (one per organisation, each document under its file name) and the 20 prompts with no expected answers and no types. It was told nothing about the folder or the experiment.

## The result

All 20 questions stay in the pool. `dropped.txt` is empty.

Gemini's answer was compared with the expected answer on every amount, date, count and yes or no. On no question did Gemini give a figure, a date or a yes or no that differs from the key.

| Question | Key | Gemini | Same |
|---|---|---|---|
| P1 | Not compulsory; threshold £10 | Not compulsory; £10 or more | yes |
| P2 | Seat held until 19:40; doors 19:00 | 19:40; 19:00 | yes |
| P3 | £24 and £28 | £24 and £28 | yes |
| P4 | £100 | £100 | yes |
| P5 | 28 February 2027 | 28 February 2027 | yes |
| P6 | No warning needed | No | yes |
| P7 | £46; noon on 14 May 2026 | £46; 12:00 noon on 14 May 2026 | yes |
| P8 | No discount; £7 | No; £7 | yes |
| P9 | £24 | £24 | yes |
| P10 | £3 | £3 | yes |
| P11 | Quorum four; no valid decision | Four; cannot decide | yes |
| P12 | £25 | £25 | yes |
| P13 | 25%; £36 | 25%; £36 | yes |
| P14 | No; 21:30 | No; 21:30 | yes |
| P15 | No; limit 100; over by 12 | No; 100; over by 12 | yes |
| P16 | No discount; £48 | No; £48 | yes |
| P17 | Written permission; £100 and £30; £130 | Written permission; £100 and £30; £130 | yes |
| P18 | 21 of 24, permitted; supervision required | 21 within 24, permitted; cannot be left unsupervised | yes |
| P19 | The papers set no maximum | The papers do not contain the answer | yes |
| P20 | The papers do not say | The papers do not contain the answer | yes |

## A reading of the rule that was made after seeing the answers

The rule says a question goes to a dispute round "if any differ". Five expected answers carry a secondary figure that the question does not ask for and Gemini did not mention: the extra £20 on P4, the £4 member price on P8, the later £28 fee on P9, the 15 minutes on P14, and the quorum of four on P20. Gemini stated nothing that conflicts with any of them. We read a figure that is not mentioned as not a difference, and a figure that is stated differently as a difference. Under the stricter reading those five would have gone to a dispute round. No question was reworded, and no dispute round was run.

This matters later. The "Correct requires" lines of those five questions ask for the secondary figure, so a marker may grade an answer wrong that gives the main figure and leaves the secondary one out. That is the same in every arm.

## Types

Gemini named the same type as the writer on 18 of 20. It called P1 "exception or condition" where the writer has "plain lookup", and P16 "plain lookup" where the writer has "exception or condition". By the rule this is recorded and changes nothing. The draw uses the writer's types.

## What the writer reported about the documents

ChatGPT listed two contradictions and wrote no question on either. Its words:

- Fenwray Film Society: film-equipment.md, sections 2.1 and 5.1. Booking days end at 12:00 noon, but returns are accepted between 10:00 and 16:00 by arrangement. This creates potential ambiguity about whether a return after noon on the scheduled last day incurs a late charge under section 5.2, although the provisions are not necessarily irreconcilable.
- Quillbrook Village Hall: hall-refunds.md, sections 2.1 and 2.5–2.6. Section 2.1 promises a full refund for cancellation at least 28 days before the event, while sections 2.5–2.6 exclude the £30 booking deposit from every hirer cancellation. The intended result appears to be a full refund of eligible hire charges excluding the booking deposit, but the unqualified phrase "full refund" is inconsistent with that exclusion.

The first bears on P7, which asks when hired equipment must be returned. Gemini gave the same deadline as the key.

## Things in the pool that were noticed and left alone

- The prompt asked that no two questions rest on the same rule. Four pairs do: P3 and P9 (the adult membership fee), P11 and P20 (the quorum), P13 and P16 (the village group discount), P15 and P18 (room capacity).
- Two film documents refer to `film-safety.md`, which the writer did not produce.

## Gemini's answer, as pasted

The copy out of the browser lost the line breaks. Nothing else was changed.

```
P1Answer: A receipt is not compulsory for a £9 cash payment, as the treasurer is only required to issue a receipt for payments of £10 or more.   Rests on: film-fees.md section 4.4   Type: exception or conditionP2Answer: The society must hold the reserved seat until 19:40 (10 minutes after the advertised start). Doors normally open 30 minutes before the advertised start time, which is 19:00.   Rests on: film-screenings.md sections 3.3 and 3.4   Type: plain lookupP3Answer: The first person should pay £24 because their payment was received before 1 July 2025. The second person should pay £28, as annual adult membership increased to £28 for payments received from 1 July 2025.   Rests on: film-fees.md section 1.1 and film-changes.md section 1   Type: changed ruleP4Answer: The member must provide a security deposit of £100 before collection. Under the committee decision effective 1 October 2025, the deposit increased from £80 to £100, and earlier confirmed bookings are subject to the new deposit if collected on or after that date.   Rests on: film-changes.md section 2 and film-equipment.md section 3.1   Type: changed ruleP5Answer: The membership expires on 28 February 2027. It does not end in February 2026; under the February joining rule, a member who joins during February receives membership until 28 February of the following year.   Rests on: film-membership.md section 3.3   Type: exception or conditionP6Answer: No, the duty volunteer is not required to issue a warning. The rules state that serious threats may result in immediate removal without a warning.   Rests on: film-conduct.md section 2.3   Type: exception or conditionP7Answer: The total hire charge is £46, which is £23 per booking day for hiring both together for two booking days. Because each booking day runs until 12:00 noon the next day, the equipment must be returned by 12:00 noon on 14 May 2026 (between 10:00 and 12:00 during return hours).   Rests on: film-fees.md section 3.3 and film-equipment.md sections 2.1 and 5.1   Type: two documentsP8Answer: No, they are not entitled to the discount because suspended members cannot claim member prices. Standard admission of £7 applies instead.   Rests on: film-membership.md section 5.4 and film-fees.md section 2.1   Type: two documentsP9Answer: The treasurer should collect £24. The £20 figure appears in the superseded historical archive sheet that ceased applying on 28 February 2025, whereas governing rules set the adult annual fee at £24.   Rests on: film-fees.md section 1.1 and film-fees-archive.md sections 1.1, 5.1, and 5.2   Type: trapP10Answer: The correct ticket price is £3. The £2 price is from a superseded archived fee schedule that is no longer valid.   Rests on: film-fees.md section 2.3 and film-fees-archive.md sections 2.3 and 5.1   Type: trapP11Answer: The required quorum is four trustees. Because only three trustees attend, the meeting lacks a quorum and the committee cannot make a valid decision.   Rests on: hall-trustees.md sections 4.2 and 4.3   Type: plain lookupP12Answer: The total equipment charge is £25. This consists of £10 for the portable speaker and £15 for the three sets of folding display boards at £5 per set.   Rests on: hall-fees.md sections 4.2 and 4.3   Type: plain lookupP13Answer: A room-hire discount of 25% applies, as the event takes place after the 1 February 2026 change took effect. The standard charge for four hours at £12 per hour is £48, making the discounted room charge £36.   Rests on: hall-changes.md section 3 and hall-fees.md sections 2.2 and 3.1   Type: changed ruleP14Answer: No, the band may not play until 21:45. Under the decision effective 1 April 2026, amplified music on Friday and Saturday must stop by 21:30.   Rests on: hall-changes.md section 5 and hall-conduct.md section 4.1   Type: changed ruleP15Answer: No, the combined event is not permitted at that attendance. The total attendance of 112 people exceeds the maximum combined building limit of 100 people by 12 people.   Rests on: hall-bookings.md sections 4.3 and 4.4   Type: exception or conditionP16Answer: No, the group does not qualify for the discount because a registered village group must have at least ten local members. The room-hire charge without the discount is £48 (£24 per hour for two hours).   Rests on: hall-fees.md sections 2.1, 2.4, and 3.2   Type: plain lookupP17Answer: Serving wine requires prior written permission and a separate £100 damage deposit in addition to the £30 booking deposit. The hirer must provide £130 in deposits altogether.   Rests on: hall-conduct.md sections 3.1 and 3.3, and hall-fees.md sections 5.1, 5.2, and 5.3   Type: two documentsP18Answer: The attendance of 21 total occupants is permitted within the 24-person Meeting Room capacity, but the children cannot be left unsupervised. The rules require that children under 12 remain under adult supervision at all times.   Rests on: hall-bookings.md sections 4.2 and 4.4, and hall-safety.md section 3.3   Type: two documentsP19Answer: The papers do not contain the answer. The rules explicitly state that they do not set a maximum number of trustee terms.   Rests on: hall-trustees.md sections 2.4 and 6.1   Type: trapP20Answer: The papers do not contain the answer. The governing documents specifically state that the rules do not specify whether trustees may attend remotely.   Rests on: hall-trustees.md sections 4.2 and 6.3   Type: trap
```
====
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
generator/new/write.answer.md: Dyalog APL transfer
DESIGN-LOG.md
PLAN.md
arms
generator
lib
origin
questions-heldout.md
questions.md
reference
tools
verify
questions.md:17:**Source:** film-screenings.md, sections 3.3 and 3.4.
questions.md:35:**Source:** film-fees.md, section 1.1; film-changes.md, sections 1.1–1.4; film-fees.md, section 4.5.
questions.md:53:**Source:** film-conduct.md, sections 2.1–2.3.
questions.md:71:**Source:** film-membership.md, sections 5.3–5.4; film-fees.md, sections 2.1–2.2.
questions.md:89:**Source:** film-fees-archive.md, sections 2.3 and 5.1–5.2; film-fees.md, section 2.3; film-changes.md, sections 1–6 (no replacement of the under-12 ticket rate).
questions.md:107:**Source:** hall-fees.md, sections 4.2–4.4.
questions.md:125:**Source:** hall-conduct.md, section 4.1; hall-changes.md, sections 5.1–5.3.
questions.md:143:**Source:** hall-fees.md, sections 2.1, 2.4 and 3.1–3.3; hall-changes.md, sections 2.1–2.3 (confirms the £28 rate is not yet effective).
questions.md:161:**Source:** hall-bookings.md, sections 4.2 and 4.4; hall-safety.md, sections 3.1–3.3.
questions.md:179:**Source:** hall-trustees.md, sections 4.2 and 6.3.
questions-heldout.md:17:**Source:** film-fees.md, sections 4.1 and 4.4.
questions-heldout.md:35:**Source:** film-equipment.md, sections 1.4 and 3.1; film-changes.md, sections 2.1–2.4.
questions-heldout.md:53:**Source:** film-membership.md, sections 3.1–3.3.
questions-heldout.md:71:**Source:** film-fees.md, section 3.3; film-equipment.md, sections 2.1 and 2.2; film-changes.md, sections 4.1–4.3 (confirms that the two-day period is within the revised limit).
questions-heldout.md:89:**Source:** film-fees-archive.md, sections 1.1, 5.1–5.2; film-fees.md, section 1.1; film-changes.md, sections 1.2–1.4.
questions-heldout.md:107:**Source:** hall-trustees.md, sections 2.1, 4.2 and 4.3.
questions-heldout.md:125:**Source:** hall-fees.md, sections 2.2 and 3.1–3.4; hall-changes.md, sections 3.1–3.3.
questions-heldout.md:143:**Source:** hall-bookings.md, sections 4.1–4.4.
questions-heldout.md:161:**Source:** hall-conduct.md, sections 3.1–3.3; hall-fees.md, sections 5.1–5.4.
questions-heldout.md:179:**Source:** hall-trustees.md, sections 2.4 and 6.1.
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm; grep -c $'\\r' generator/new/write.answer.md; tail -c 50 generator/new/write.answer.md | od -c | tail -3; cat .gitignore 2>/dev/null; cat generator/dropped.txt | wc -c; head -20 questions.md",
  "description": "Check line endings and file formats"
}
```

## Result

```
0
0000040       u   n   d   e   r       b   o   t   h       r   u   l   e
0000060   s   .
0000062
node_modules/

# Kept back until the reveal. tools/reveal.mjs prints the command that adds them.
runs/*/key.json
runs/*/key-staged.json
runs/*/probe.md
runs/*/marking-key.csv

# What a visitor's own commands write.
runs/ask-*/
runs/*-rerun-*/
0
# Questions

## Q1

**Drawn from:** P2

**Set:** film

**Type:** plain lookup

**Prompt (paste exactly):**

> Under the Fenwray Film Society rules: A screening is advertised to begin at 19:30 on 18 November 2025. Someone has paid for a reserved seat but has not arrived when the film starts. Until what exact time must the society hold that seat, and when do the doors normally open?

**Expected answer:** The reserved seat must be held until 19:40, which is 10 minutes after the advertised 19:30 start. Doors normally open at 19:00, which is 30 minutes before the advertised start. The seat-holding deadline is not the same as the door-opening time.

**Source:** film-screenings.md, sections 3.3 and 3.4.

**Correct requires:** The answer must give both 19:40 for the reserved-seat deadline and 19:00 for door opening. It is wrong if it gives 19:30 as the seat deadline, 19:00 as both times, or 20:00 by adding the 30-minute door-opening interval after the start.
```

## Call: Write

```json
{
  "file_path": "C:\\GitHub\\the-control-icm\\tools\\renumber-new.mjs",
  "content": "// Takes the new question pool out of the writer's raw answer, word for word, and renames its\n// headings \"## P1\"..\"## P20\" to \"## N1\"..\"## N20\" in the same order. Nothing else is changed.\n// Also saves the writer's \"Contradictions found\" list as written.\n//\n//   node tools/renumber-new.mjs\n//\n// Reads generator/new/write.answer.md; writes generator/new/question-pool.md and\n// generator/new/contradictions.md. Safe to re-run.\n\nimport { readFileSync, writeFileSync } from 'node:fs';\nimport { join } from 'node:path';\nimport { REPO } from '../lib/config.mjs';\n\nconst DIR = join(REPO, 'generator', 'new');\nconst raw = readFileSync(join(DIR, 'write.answer.md'), 'utf8');\n\nconst OPEN = '```question-pool.md\\n';\nconst start = raw.indexOf(OPEN);\nif (start < 0) throw new Error('No question-pool.md code block in write.answer.md.');\nconst bodyStart = start + OPEN.length;\nconst end = raw.indexOf('\\n```', bodyStart);\nif (end < 0) throw new Error('The question-pool.md code block is not closed.');\nconst block = raw.slice(bodyStart, end + 1);\n\nlet n = 0;\nconst pool = block.replace(/^## P(\\d+)$/gm, (_, num) => {\n  n += 1;\n  if (Number(num) !== n) throw new Error(`Heading P${num} is out of order (expected P${n}).`);\n  return `## N${n}`;\n});\nif (n !== 20) throw new Error(`Expected 20 headings, found ${n}.`);\nwriteFileSync(join(DIR, 'question-pool.md'), pool);\n\nconst MARK = '**Contradictions found**';\nconst at = raw.indexOf(MARK, end);\nif (at < 0) throw new Error('No \"Contradictions found\" list in write.answer.md.');\nwriteFileSync(join(DIR, 'contradictions.md'), raw.slice(at));\n\nconsole.log(`question-pool.md: ${n} questions renamed P to N; contradictions.md saved.`);\n"
}
```

## Call: Read

```json
{
  "file_path": "C:\\GitHub\\the-control-icm\\lib\\claude.mjs"
}
```

## Result

```
File created successfully at: C:\GitHub\the-control-icm\tools\renumber-new.mjs (file state is current in your context — no need to Read it back)
```

## Result

```
1	// Starts one Claude Code session with fixed flags and a stripped environment.
2	
3	import { spawnSync } from 'node:child_process';
4	import {
5	  ALLOWED_TOOLS, BLOCKED_TOOLS, CLAUDE_BIN, EFFORT, ENV_ALLOWED, ENV_FIXED, MODEL, SESSION_TIMEOUT_MS,
6	} from './config.mjs';
7	
8	// A session sees only the allowed variables, so nothing from the launching shell leaks in.
9	export function sessionEnv(source = process.env) {
10	  const env = {};
11	  for (const name of ENV_ALLOWED) if (source[name] !== undefined) env[name] = source[name];
12	  return { ...env, ...ENV_FIXED };
13	}
14	
15	export function sessionArgs(prompt) {
16	  return [
17	    '--setting-sources', 'project', '-p', prompt,
18	    '--model', MODEL,
19	    '--effort', EFFORT,
20	    '--tools', ALLOWED_TOOLS.join(','),
21	    '--disallowedTools', BLOCKED_TOOLS,
22	    '--permission-mode', 'dontAsk',
23	    '--strict-mcp-config',
24	    '--disable-slash-commands',
25	    '--output-format', 'stream-json', '--verbose',
26	  ];
27	}
28	
29	export function programVersion(bin = CLAUDE_BIN) {
30	  const done = spawnSync(bin, ['--version'], { encoding: 'utf8', env: sessionEnv() });
31	  if (done.error || done.status !== 0) {
32	    throw new Error(`Cannot run the Claude Code program "${bin}". Set CLAUDE_BIN to its path. ${done.error?.message ?? done.stderr ?? ''}`.trim());
33	  }
34	  const match = done.stdout.match(/\d+\.\d+\.\d+/);
35	  if (!match) throw new Error(`Could not read a version from "${done.stdout.trim()}".`);
36	  return match[0];
37	}
38	
39	export function ask(dir, prompt, bin = CLAUDE_BIN) {
40	  const started = Date.now();
41	  const done = spawnSync(bin, sessionArgs(prompt), {
42	    cwd: dir,
43	    encoding: 'utf8',
44	    timeout: SESSION_TIMEOUT_MS,
45	    maxBuffer: 64 * 1024 * 1024,
46	    env: sessionEnv(),
47	  });
48	  return {
49	    stream: done.stdout ?? '',
50	    stderr: done.stderr ?? '',
51	    exit: done.status,
52	    timedOut: done.error?.code === 'ETIMEDOUT',
53	    wallMs: Date.now() - started,
54	  };
55	}
56
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm; node tools/renumber-new.mjs && diff <(sed -n '2,320p' generator/new/write.answer.md) generator/new/question-pool.md | grep -c '^[<>]'; diff <(sed -n '2,320p' generator/new/write.answer.md | sed -E 's/^## P([0-9]+)$/## N\\1/') generator/new/question-pool.md && echo IDENTICAL; diff <(sed -n '323,$p' generator/new/write.answer.md) generator/new/contradictions.md && echo CONTRA_OK",
  "description": "Run renumber script and verify only headings changed"
}
```

## Result

```
question-pool.md: 20 questions renamed P to N; contradictions.md saved.
40
IDENTICAL
CONTRA_OK
```

## Call: PowerShell

```json
{
  "command": "$env:CLAUDE_BIN = (Get-ChildItem \"$env:USERPROFILE\\.vscode\\extensions\\anthropic.claude-code-*\\resources\\native-binary\\claude.exe\" | Sort-Object LastWriteTime | Select-Object -Last 1).FullName; $env:CLAUDE_BIN; Set-Location C:\\GitHub\\the-control-icm; node tools/new-questions.mjs check",
  "description": "Run the key check with the checker model",
  "timeout": 960000
}
```

## Result

```
C:\Users\<user>\.vscode\extensions\anthropic.claude-code-2.1.300-win32-x64\resources\native-binary\claude.exe
check: claude-fable-5-1, 5604 characters, saved under generator/new/
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm/generator/new; cat check.session.json; cat check.answer.md",
  "description": "Read checker answer"
}
```

## Result

```
{
  "model": "claude-fable-5-1",
  "version": "2.1.300",
  "session": "3870dd06-0f83-4ebe-8d4d-010fc46e0701",
  "label": "check",
  "at": "2026-10-15T15:37:29.925Z"
}## N1

**Answer:** £8 in total: £3 for the 9-year-old (under 12, accompanied by an adult) and £5 for the 12-year-old (aged 12 to 15). The children's prices are age-based, not member discounts, so the non-member rule does not raise them.

**Rests on:** film-fees.md 2.3, 2.4, 2.5

**Type:** plain lookup

## N2

**Answer:** £46: hiring both together costs £23 per booking day, times two booking days. The archive's £19 rate was superseded on 1 March 2025.

**Rests on:** film-fees.md 3.3; film-equipment.md 2.1; film-fees-archive.md 3.3 (superseded)

**Type:** plain lookup

## N3

**Answer:** £28. A transfer counts as received when it clears, so payment was received on 2 July 2025, which is on or after the 1 July 2025 change from £24 to £28.

**Rests on:** film-changes.md 1.2, 1.3; film-fees.md 1.1, 4.5

**Type:** changed rule

## N4

**Answer:** Yes. The lowered limit of 36 applies only to screenings on or after 1 June 2026, so the 30 May 2026 limit is still 42 excluding duty volunteers; 38 inside plus one more is 39.

**Rests on:** film-screenings.md 3.1, 3.6; film-changes.md 5.2, 5.3

**Type:** changed rule

## N5

**Answer:** 28 February 2027. Membership begins on 10 February 2026, and a member who joins during February gets membership until 28 February of the following year rather than the February just ahead.

**Rests on:** film-membership.md 3.1, 3.2, 3.3

**Type:** exception or condition

## N6

**Answer:** No. A changed film entitles a buyer to a full refund only before entry; a buyer who enters after being told of the change loses that option, and leaving early creates no refund right.

**Rests on:** film-refunds.md 2.2, 2.3; film-fees.md 5.2

**Type:** exception or condition

## N7

**Answer:** £7, the standard admission price. A suspended member cannot claim member prices, and 10 April 2026 falls within the suspension.

**Rests on:** film-membership.md 5.3, 5.4; film-fees.md 2.1; film-conduct.md 4.4

**Type:** two documents

## N8

**Answer:** £56: hire of £36 (2 booking days at £18) plus £20 late charge. The return deadline was 12:00 on 6 June 2025, so a 15:00 return on 7 June is 27 hours late, which is two started 24-hour periods at £10 each.

**Rests on:** film-fees.md 3.1; film-equipment.md 2.1, 5.2

**Type:** two documents

## N9

**Answer:** Yes. The governing limit for a collection on 6 May 2025 is three consecutive booking days; the two-day limit is from the archived schedule superseded on 1 March 2025, and the five-day limit only applies to collections from 1 April 2026. The request was also made more than three days ahead.

**Rests on:** film-equipment.md 1.2, 2.2; film-fees-archive.md 3.6 (superseded); film-changes.md 4.2, 4.3

**Type:** trap

## N10

**Answer:** £12. The 16-to-17 rate is unchanged; the 1 July 2025 increase applies only to adult membership.

**Rests on:** film-fees.md 1.2; film-membership.md 1.2; film-changes.md 1

**Type:** plain lookup

## N11

**Answer:** No. Combined events may not exceed 100 people in the building, and capacities include organisers and children, so 105 is over the limit.

**Rests on:** hall-bookings.md 4.3, 4.4

**Type:** plain lookup

## N12

**Answer:** £69: Meeting Room £36 (3 hours at £12), kitchen £8, projector £15, and two sets of display boards £10.

**Rests on:** hall-fees.md 2.2, 2.3, 2.5, 4.1, 4.3

**Type:** plain lookup

## N13

**Answer:** £112. The Main Hall rate rose to £28 per hour for events on or after 1 November 2025, and the controlling date is the event date (8 November 2025), not the acceptance date; 4 hours at £28.

**Rests on:** hall-changes.md 2.1, 2.2, 2.3; hall-fees.md 2.1, 2.5, 2.6

**Type:** changed rule

## N14

**Answer:** 50% of the room, kitchen and equipment hire charges, and no, the £30 booking deposit is not returned. The cancellation was received 17 days before the event, and the 25% rule only applies to cancellations received on or after 1 June 2026, so the 29 May 2026 receipt keeps the 50% rate.

**Rests on:** hall-refunds.md 1.4, 2.2, 2.4, 2.5, 2.6; hall-changes.md 6.1, 6.2, 6.3

**Type:** changed rule

## N15

**Answer:** £100. The cancellation was received 10 days before the event, so none of the hire charge (including the non-refundable £30 deposit) comes back, but the unused £100 damage deposit is returned in full.

**Rests on:** hall-refunds.md 2.3, 2.5, 4.5

**Type:** exception or condition

## N16

**Answer:** The full hire charge, deposit included, is due at acceptance on 2 October 2025, because the booking was made fewer than 14 days before the event. The usual seven-day and 14-day deadlines do not apply.

**Rests on:** hall-fees.md 6.1, 6.2, 6.3

**Type:** exception or condition

## N17

**Answer:** £72. Sunday closing is 21:00 and clearing must finish within booked hours, so the longest booking from 15:00 is 6 hours at £12 per hour.

**Rests on:** hall-bookings.md 3.3, 3.4, 3.5; hall-fees.md 2.2, 2.5

**Type:** two documents

## N18

**Answer:** £130 in deposits: the £30 booking deposit required for every booking plus the £100 damage deposit required when alcohol is served, which are separate.

**Rests on:** hall-fees.md 5.1, 5.2, 5.3; hall-conduct.md 3.1, 3.3

**Type:** plain lookup

## N19

**Answer:** The papers do not answer this. Four trustees form a quorum, but the rules expressly do not specify whether trustees may attend remotely.

**Rests on:** hall-trustees.md 4.2, 6.3

**Type:** trap

## N20

**Answer:** The papers do not set any charge for a lost key. The key rules only cover collection and the ban on copying or passing keys on.

**Rests on:** hall-bookings.md 5.1, 5.2

**Type:** trap
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm/generator/new; grep -c '^## N' check.prompt.txt; grep -c '^> ' question-pool.md; grep -c 'Expected answer' check.prompt.txt; grep -c 'PASTE' check.prompt.txt",
  "description": "Verify check prompt has 20 prompts and no keys"
}
```

## Result

```
20
20
0
0
```

## Call: Bash

```json
{
  "command": "mkdir -p \"/c/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad\"; cat > \"/c/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/dedupe.mjs\" <<'EOF'\nimport { readFileSync } from 'node:fs';\nconst R = 'C:/GitHub/the-control-icm/';\nfunction parse(file, head) {\n  const t = readFileSync(R + file, 'utf8').replace(/\\r\\n/g, '\\n');\n  const out = [];\n  for (const m of t.matchAll(new RegExp(`^## (${head}\\\\d+)[\\\\s\\\\S]*?^\\\\*\\\\*Source:\\\\*\\\\* (.+)$`, 'gm'))) out.push({ id: m[1], src: m[2], set: sections(m[2]) });\n  return out;\n}\nfunction expand(a, b) {\n  const [am, as] = a.split('.'); const [bm, bs] = b.split('.');\n  if (as === undefined && bs === undefined) { const r = []; for (let i = +am; i <= +bm; i++) r.push(String(i)); return r; }\n  if (am !== bm) throw new Error(`range ${a}-${b}`);\n  const r = []; for (let i = +as; i <= +bs; i++) r.push(`${am}.${i}`); return r;\n}\nfunction sections(src) {\n  const map = new Map();\n  for (const g of src.replace(/\\.$/, '').split(';')) {\n    const m = g.trim().match(/^([\\w-]+\\.md),\\s*sections?\\s+(.*)$/);\n    if (!m) throw new Error('cannot parse: ' + g);\n    let rest = m[2].replace(/\\(([^)]*)\\)/g, (_, inner) => /^[\\d.\\s–to,and-]+$/.test(inner) ? ' ' + inner : '');\n    const s = map.get(m[1]) ?? new Set();\n    rest = rest.replace(/(\\d+(?:\\.\\d+)?)\\s*(?:–|-|to)\\s*(\\d+(?:\\.\\d+)?)/g, (_, a, b) => { expand(a, b).forEach((x) => s.add(x)); return ' '; });\n    for (const x of rest.match(/\\d+(?:\\.\\d+)?/g) ?? []) s.add(x);\n    map.set(m[1], s);\n  }\n  return [...map].map(([f, s]) => `${f}:${[...s].sort().join(',')}`).sort().join(' | ');\n}\nconst old = [...parse('questions.md', 'Q'), ...parse('questions-heldout.md', 'H')];\nconst neu = parse('generator/new/question-pool.md', 'N');\nfor (const n of neu) {\n  const same = old.filter((o) => o.set === n.set).map((o) => o.id);\n  console.log(n.id, same.length ? 'SAME-SOURCE ' + same.join(',') : 'ok', '\\n   ', n.set);\n}\nconsole.log('---old');\nfor (const o of old) console.log(o.id, o.set);\nEOF\ncd /c/GitHub/the-control-icm; node \"/c/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/dedupe.mjs\"",
  "description": "Compare new Source sections against existing questions"
}
```

## Result

```
Exit code 1
file:///C:/Users/JEFFVA%7E1/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/dedupe.mjs:6
  for (const m of t.matchAll(new RegExp(`^## (${head}\d+)[\s\S]*?^\*\*Source:\*\* (.+)$`, 'gm'))) out.push({ id: m[1], src: m[2], set: sections(m[2]) });
                             ^

SyntaxError: Invalid regular expression: /^## (Qd+)[sS]*?^**Source:** (.+)$/gm: Nothing to repeat
    at new RegExp (<anonymous>)
    at parse (file:///C:/Users/JEFFVA%7E1/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/dedupe.mjs:6:30)
    at file:///C:/Users/JEFFVA%7E1/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/dedupe.mjs:28:17
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.15.0
```

## Call: Bash

```json
{
  "command": "F=\"/c/Users/<user>/AppData/Local/Temp/claude/c--GitHub-gsd-todo-tutorial/2fb9ec64-8e96-443d-80ed-fec8743a0fec/scratchpad/dedupe.mjs\"; sed -n 6p \"$F\"; sed -i '6s/new RegExp(`/new RegExp(String.raw`/' \"$F\"; sed -i '6s/\\\\\\\\/\\\\/g' \"$F\"; sed -n 6p \"$F\"; cd /c/GitHub/the-control-icm; node \"$F\"",
  "description": "Fix regex and rerun comparison"
}
```

## Result

```
for (const m of t.matchAll(new RegExp(`^## (${head}\d+)[\s\S]*?^\*\*Source:\*\* (.+)$`, 'gm'))) out.push({ id: m[1], src: m[2], set: sections(m[2]) });
sed: -e expression #1, char 9: unterminated `s' command
  for (const m of t.matchAll(new RegExp(String.raw`^## (${head}\d+)[\s\S]*?^\*\*Source:\*\* (.+)$`, 'gm'))) out.push({ id: m[1], src: m[2], set: sections(m[2]) });
N1 ok 
    film-fees.md:2.3,2.4
N2 ok 
    film-fees.md:3.1,3.2,3.3
N3 ok 
    film-changes.md:1,1.2,1.3,1.4 | film-fees.md:1.1,4.5
N4 ok 
    film-changes.md:5,5.2,5.3 | film-screenings.md:3.1
N5 SAME-SOURCE H3 
    film-membership.md:3.1,3.2,3.3
N6 ok 
    film-refunds.md:1.3,2.2,2.3
N7 ok 
    film-conduct.md:4.1,4.4 | film-fees.md:2.1 | film-membership.md:5.4
N8 ok 
    film-equipment.md:2.1,2.2,5.2 | film-fees.md:3.1
N9 ok 
    film-changes.md:4 | film-equipment.md:1.2,2.2 | film-fees-archive.md:3.6,5.1
N10 ok 
    film-changes.md:1 | film-fees-archive.md:1.2,5.1 | film-fees.md:1.2
N11 SAME-SOURCE H8 
    hall-bookings.md:4.1,4.2,4.3,4.4
N12 ok 
    hall-fees.md:2.2,2.3,4.1,4.3
N13 ok 
    hall-changes.md:2,2.1,2.2,2.3 | hall-fees.md:2.1
N14 ok 
    hall-changes.md:6 | hall-refunds.md:1.4,2.2,2.4,2.5,2.6
N15 ok 
    hall-refunds.md:1.4,2.3,2.5,4.5
N16 ok 
    hall-fees.md:6.1,6.2,6.3
N17 ok 
    hall-bookings.md:3.3,3.5 | hall-fees.md:2.2,2.6
N18 ok 
    hall-conduct.md:3.1,3.3 | hall-fees.md:5.1,5.2,5.3
N19 ok 
    hall-trustees.md:4.1,4.2,4.3,6.3
N20 ok 
    hall-bookings.md:5.1,5.2 | hall-conduct.md:5.4,5.5 | hall-fees.md:5.2 | hall-refunds.md:4.2
---old
Q1 film-screenings.md:3.3,3.4
Q2 film-changes.md:1.1,1.2,1.3,1.4 | film-fees.md:1.1,4.5
Q3 film-conduct.md:2.1,2.2,2.3
Q4 film-fees.md:2.1,2.2 | film-membership.md:5.3,5.4
Q5 film-changes.md:1,2,3,4,5,6 | film-fees-archive.md:2.3,5.1,5.2 | film-fees.md:2.3
Q6 hall-fees.md:4.2,4.3,4.4
Q7 hall-changes.md:5.1,5.2,5.3 | hall-conduct.md:4.1
Q8 hall-changes.md:2.1,2.2,2.3 | hall-fees.md:2.1,2.4,3.1,3.2,3.3
Q9 hall-bookings.md:4.2,4.4 | hall-safety.md:3.1,3.2,3.3
Q10 hall-trustees.md:4.2,6.3
H1 film-fees.md:4.1,4.4
H2 film-changes.md:2.1,2.2,2.3,2.4 | film-equipment.md:1.4,3.1
H3 film-membership.md:3.1,3.2,3.3
H4 film-changes.md:4.1,4.2,4.3 | film-equipment.md:2.1,2.2 | film-fees.md:3.3
H5 film-changes.md:1.2,1.3,1.4 | film-fees-archive.md:1.1,5.1,5.2 | film-fees.md:1.1
H6 hall-trustees.md:2.1,4.2,4.3
H7 hall-changes.md:3.1,3.2,3.3 | hall-fees.md:2.2,3.1,3.2,3.3,3.4
H8 hall-bookings.md:4.1,4.2,4.3,4.4
H9 hall-conduct.md:3.1,3.2,3.3 | hall-fees.md:5.1,5.2,5.3,5.4
H10 hall-trustees.md:2.4,6.1
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm; printf 'N5 same-source\\nN11 same-source\\n' > generator/new/dropped.txt; node -e \"\nconst fs=require('fs');const p=fs.readFileSync('generator/new/question-pool.md','utf8');\nconst drop=new Set(fs.readFileSync('generator/new/dropped.txt','utf8').trim().split('\\n').map(l=>l.split(' ')[0]));\nconst parts=p.split(/(?=^## N\\d+$)/m);\nconst keep=parts.filter(s=>!drop.has(s.match(/^## (N\\d+)/)[1]));\nlet out=keep.join(''); if(!out.endsWith('\\n')) out+='\\n';\nfs.writeFileSync('questions-new.md',out);\nconsole.log(parts.length, keep.length, keep.map(s=>s.match(/^## (N\\d+)/)[1]+':'+s.match(/\\*\\*Set:\\*\\* (\\w+)/)[1]+':'+s.match(/\\*\\*Type:\\*\\* (.+)/)[1]).join('\\n'));\n\"; diff <(sed '/^## N5$/,/^## N6$/{/^## N6$/!d}' generator/new/question-pool.md | sed '/^## N11$/,/^## N12$/{/^## N12$/!d}') questions-new.md && echo SAME",
  "description": "Write dropped list and surviving questions file"
}
```

## Result

```
20 18 N1:film:plain lookup
N2:film:plain lookup
N3:film:changed rule
N4:film:changed rule
N6:film:exception or condition
N7:film:two documents
N8:film:two documents
N9:film:trap
N10:film:trap
N12:hall:plain lookup
N13:hall:changed rule
N14:hall:changed rule
N15:hall:exception or condition
N16:hall:exception or condition
N17:hall:two documents
N18:hall:two documents
N19:hall:trap
N20:hall:trap
SAME
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm; { cat <<'EOF'\n# Key check of the new questions\n\nDone on Thursday 2026-10-15. The rule is in `generator/key-check-prompt.md`, applied with two substitutions: the writer (called ChatGPT in the rule) is a Claude session on `claude-opus-5-5`, and the checker (called Gemini in the rule) is a Claude session on `claude-fable-5-1`. The questions were taken from the writer's raw answer (`write.answer.md`) by `tools/renumber-new.mjs`, which changes only the headings P1..P20 to N1..N20.\n\n## Who answered\n\n| Role | Model the session reported | Program | Session |\n|---|---|---|---|\n| Writer | claude-opus-5-5 | 2.1.300 | 350de3b9-2f0f-41e0-8e96-363b59deca22 |\n| Checker | claude-fable-5-1 | 2.1.300 | 3870dd06-0f83-4ebe-8d4d-010fc46e0701 |\n\nThe checker was run by `node tools/new-questions.mjs check`: a fresh session in an empty folder with no tools, given prompt one word for word with the 20 prompts pasted in and the 18 documents attached as two text files, one per organisation. The prompt it was sent (`check.prompt.txt`) holds the 20 prompts and no expected answers, no types and no \"Correct requires\" lines.\n\n## The comparison\n\nThe checker's answer to each question was compared with the expected answer on every amount, date, count and yes or no. On no question did the checker give a figure, a date, a count or a yes or no that differs from the key. No question went to a dispute round, so prompt two was not sent and no session was resumed.\n\n| Question | Key | Checker | Same |\n|---|---|---|---|\n| N1 | £8 (£5 + £3) | £8 (£3 + £5) | yes |\n| N2 | £46 (£23 a day, 2 days) | £46 (£23 a day, 2 days) | yes |\n| N3 | £28; received 2 July 2025 | £28; received 2 July 2025 | yes |\n| N4 | Yes; limit 42, 36 only from 1 June 2026 | Yes; 42, 36 only from 1 June 2026; 39 | yes |\n| N5 | 28 February 2027 | 28 February 2027 | yes |\n| N6 | No refund | No | yes |\n| N7 | £7 | £7 | yes |\n| N8 | £56 (£36 + £20); due back 12:00 6 June 2025; 27 hours late | £56 (£36 + £20); 12:00 6 June 2025; 27 hours | yes |\n| N9 | Yes, three days; two-day limit archived; five days from 1 April 2026 | Yes; same three limits and dates | yes |\n| N10 | £12 | £12 | yes |\n| N11 | No; combined limit 100 | No; 100 | yes |\n| N12 | £69 (£36 + £8 + £15 + £10) | £69 (£36 + £8 + £15 + £10) | yes |\n| N13 | £112 (4 h at £28) | £112 (4 h at £28) | yes |\n| N14 | 50%; £30 booking deposit not refunded; 17 days | 50%; deposit not returned; 17 days | yes |\n| N15 | £100 | £100 | yes |\n| N16 | Full payment at acceptance, 2 October 2025 | Full payment at acceptance, 2 October 2025 | yes |\n| N17 | £72 (6 h at £12) | £72 (6 h at £12) | yes |\n| N18 | £130 (£30 + £100) | £130 (£30 + £100) | yes |\n| N19 | The papers do not say; quorum four | The papers do not answer this; quorum four | yes |\n| N20 | No lost-key charge is set | No charge for a lost key is set | yes |\n\n### Figures in the key that the checker did not mention\n\nThe entry read a figure that is not mentioned as not a difference, and a figure stated differently as a difference. The same reading is used here. These expected answers carry figures the checker did not state; it stated nothing that conflicts with any of them:\n\n- N6: the 48-hour cancellation window.\n- N10: the archived £10 figure.\n- N11: the separate room limits of 90 and 24.\n- N16: the normal seven-day and 14-day deadlines (the checker says they do not apply, without the numbers).\n- N19: the majority rule and the six meetings a year.\n- N20: the 24-hour damage report, and the damage deposit for events serving alcohol.\n\nThe \"Correct requires\" lines of N19 and N20 ask for the nearby rules to be mentioned. The checker mentioned the quorum on N19 and the key rules on N20.\n\n## Types\n\nThe checker named the same type as the writer on 18 of 20. It called N10 \"plain lookup\" where the writer has \"trap\", and N18 \"plain lookup\" where the writer has \"two documents\". By the rule this is recorded and changes nothing.\n\n## De-duplication against the existing questions\n\nA new question is dropped (reason \"same-source\") when its **Source** names the same files and the same section numbers as any question in `questions.md` or `questions-heldout.md`. Only file names and section numbers were compared: ranges such as \"3.1–3.3\" and \"3.1 to 3.3\" were expanded, a parenthesis holding only section numbers was read as section numbers, and any other note in brackets was ignored. The sets had to be equal.\n\n| New | Same source as | Sections compared |\n|---|---|---|\n| N5 | H3 (`questions-heldout.md`) | film-membership.md 3.1, 3.2, 3.3 |\n| N11 | H8 (`questions-heldout.md`) | hall-bookings.md 4.1, 4.2, 4.3, 4.4 |\n\nNo other new question has a source set equal to an existing one. Near misses, left in because the sets differ:\n\n- N3 and Q2 share film-fees.md 1.1 and 4.5 and the film-changes.md subsections 1.2 to 1.4; N3 cites film-changes.md section 1 and Q2 cites 1.1.\n- N13 and Q8 share hall-changes.md 2.1 to 2.3 and hall-fees.md 2.1; Q8 also cites hall-fees.md 2.4 and 3.1 to 3.3.\n- N18 and H9 cite the same two files; H9 also cites hall-conduct.md 3.2 and hall-fees.md 5.4.\n- N19 and Q10 both rest on hall-trustees.md 4.2 and 6.3; N19 also cites 4.1 and 4.3.\n- N9 and H4 share film-equipment.md 2.2 and the film-changes.md section 4 decision, cited differently.\n\nThese overlap in rule, not only in section, but the rule fixed for this check compares section numbers only.\n\n## The result\n\nTwo questions are dropped, both for \"same-source\": N5 and N11 (`dropped.txt`). None is dropped for a dispute. The 18 that survive are in `questions-new.md` at the repo root, unchanged, under their N numbers: 9 film and 9 hall.\n\n| Type | Film | Hall |\n|---|---|---|\n| plain lookup | N1, N2 | N12 |\n| changed rule | N3, N4 | N13, N14 |\n| exception or condition | N6 | N15, N16 |\n| two documents | N7, N8 | N17, N18 |\n| trap | N9, N10 | N19, N20 |\n\n## What the writer reported about the documents\n\nSaved word for word in `contradictions.md`:\n\nEOF\ncat generator/new/contradictions.md; printf '\\n\\n## The checker'\"'\"'s answer, as returned\\n\\nFrom `check.answer.md`, unchanged.\\n\\n````\\n'; cat generator/new/check.answer.md; printf '\\n````\\n'; } > generator/new/key-check.md; tail -5 generator/new/key-check.md",
  "description": "Write the key-check record"
}
```

## Result

```
**Rests on:** hall-bookings.md 5.1, 5.2

**Type:** trap
````
```

## Call: Bash

```json
{
  "command": "cd /c/GitHub/the-control-icm; ls generator/new; git add tools/renumber-new.mjs generator/new/question-pool.md generator/new/contradictions.md generator/new/check.prompt.txt generator/new/check.stream.jsonl generator/new/check.answer.md generator/new/check.session.json generator/new/key-check.md generator/new/dropped.txt questions-new.md && git commit -q -F - <<'EOF'\nNew questions: written, key-checked and de-duplicated\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nEOF\ngit log --oneline -1; git status --short; git show --stat HEAD | tail -12",
  "description": "Commit created files and verify"
}
```

## Result

```
check.answer.md
check.prompt.txt
check.session.json
check.stream.jsonl
contradictions.md
dropped.txt
key-check.md
question-pool.md
write.answer.md
write.prompt.txt
write.session.json
write.stream.jsonl
136edcf New questions: written, key-checked and de-duplicated
?? generator/new/write.answer.md
?? generator/new/write.prompt.txt
?? generator/new/write.session.json
?? generator/new/write.stream.jsonl
?? tools/new-questions.mjs

 generator/new/check.answer.md    | 159 +++++++
 generator/new/check.prompt.txt   | 995 +++++++++++++++++++++++++++++++++++++++
 generator/new/check.session.json |   7 +
 generator/new/check.stream.jsonl |  27 ++
 generator/new/contradictions.md  |   3 +
 generator/new/dropped.txt        |   2 +
 generator/new/key-check.md       | 261 ++++++++++
 generator/new/question-pool.md   | 319 +++++++++++++
 questions-new.md                 | 287 +++++++++++
 tools/renumber-new.mjs           |  39 ++
 10 files changed, 2099 insertions(+)
```

## Call: SubagentHandback

```json
{
  "message": "Checked on 2026-10-15, about 09:36 to 09:45 MT. Repo: C:\\GitHub\\the-control-icm. 18 of the 20 new questions survive; 2 were dropped as same-source, and none were dropped for a dispute.\n\n**Models the sessions reported (from their init events):** the writer was claude-opus-5-5 and the checker was claude-fable-5-1, both on program 2.1.300. The checker model was available, so nothing was substituted.\n\n**Written:** 20 questions, N1 to N20. tools\\renumber-new.mjs changed exactly 20 lines (the headings). A diff confirmed nothing else changed.\n\n**Disputed:** none. The checker matched the key on every amount, date, count and yes or no. Some expected answers carry secondary figures the checker didn't mention. I read those as no difference, which is how the entry read them, and listed them in key-check.md. Since there were no disputes, no dispute round ran and neither session was resumed. On type, the checker disagreed with the writer on N10 and N18; by the rule that is recorded and changes nothing.\n\n**Dropped:** N5 same-source (matches H3) and N11 same-source (matches H8). The test was exact equality of file plus section numbers after expanding ranges. Five near-misses are recorded and were kept.\n\n**Surviving:** film 9 and hall 9. By type: plain lookup 3, changed rule 4, exception or condition 3, two documents 4, trap 4. Every type has at least one question for each organisation.\n\n**Commit:** 136edcf.\n\n**Things you should know:**\n- I committed only files I created. The writer's files (generator\\new\\write.*) and tools\\new-questions.mjs are still untracked, so the commit includes check.* output while the script that made it is not committed.\n- The de-duplication comparison script lives in my scratchpad, not the repo. Its method is written out in key-check.md."
}
```

## Result

```
{"success":true,"message":"Report delivered to your caller."}
```
