# Figures beside the verdicts

Run sup2. Sessions: 456; with a fault: 0.

## Means per session, new questions (the primary set)

| Arm | Document steps | Instruction steps | Total steps | Characters loaded first | Characters fetched | Text in all | Answer words | Tokens in | Seconds | Holds every key fact | Right, Opus | Right, Gemini |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| docs | 5.44 | 0.00 | 5.44 | 0 | 8171 | 8171 | 166 | 22711 | 7.8 | 49 of 54 | 52 of 54 | 50 of 54 |
| folder | 2.46 | 0.00 | 2.46 | 5261 | 5186 | 10447 | 85 | 18372 | 4.0 | 50 of 54 | 52 of 54 | 52 of 54 |
| icm | 3.61 | 2.00 | 5.61 | 902 | 16879 | 17781 | 312 | 26876 | 9.0 | 53 of 54 | 54 of 54 | 54 of 54 |
| icm-eager | 3.89 | 1.96 | 5.85 | 11886 | 17322 | 29208 | 318 | 28090 | 8.7 | 54 of 54 | 54 of 54 | 54 of 54 |

## Replication check: the entry's folder against the documents alone, on the entry's 20 questions

The entry found the folder took clearly fewer steps, put more text in front of the model, and held every key fact in fewer answers. Not marked; key facts counted by script.

| Set | Questions | Steps, folder lower / higher / equal | Steps, folder / docs | Text, folder / docs | Holds every key fact, folder / docs |
|---|---|---|---|---|---|
| exam | 10 | 10 / 0 / 0 (clear at 9) | 2.37 / 5.30 | 9218 / 7659 | 23 / 30 of 30 |
| heldout | 10 | 10 / 0 / 0 (clear at 9) | 2.37 / 5.13 | 9488 / 7646 | 25 / 30 of 30 |

## Planted answers of known grade

| Number | Known grade | Opus | Gemini |
|---|---|---|---|
| 3760 | insufficient | insufficient | insufficient |
| 2711 | incorrect | incorrect | incorrect |
| 6049 | insufficient | insufficient | insufficient |
| 3927 | incorrect | incorrect | incorrect |

## Giveaway check: how often each marker guessed the arm

An arm counts as guessed when the guess matches how its instructions arrived: `loaded` for folder and icm-eager, `staged` for icm, `none` for docs. At 70% or more the answers gave the arm away.

| Marker | Guessed right | Of | Share |
|---|---|---|---|
| Claude Opus 5.5 | 95 | 216 | 0.44 |
| Gemini | 69 | 216 | 0.32 |

## Per question, new set: mean document steps and text per arm, and answers right by each reading

| Question | docs steps | folder steps | icm steps | icm-eager steps | docs text | folder text | icm text | icm-eager text | Answers not right (docs / folder / icm / icm-eager), key facts · Opus · Gemini |
|---|---|---|---|---|---|---|---|---|---|
| N1 | 6.33 | 3.00 | 3.33 | 4.00 | 9140 | 11954 | 17313 | 29628 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N2 | 4.33 | 3.00 | 3.33 | 3.33 | 7334 | 11915 | 17274 | 28258 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N3 | 6.00 | 2.00 | 3.00 | 3.00 | 9365 | 9799 | 16489 | 27473 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N4 | 5.00 | 2.00 | 2.00 | 2.33 | 7564 | 9956 | 14650 | 26352 | 0·1·1 / 0·0·0 / 0·0·0 / 0·0·0 |
| N6 | 6.33 | 2.00 | 4.00 | 4.00 | 8955 | 10033 | 18880 | 26846 | 3·0·2 / 3·0·0 / 1·0·0 / 0·0·0 |
| N7 | 6.33 | 4.33 | 5.00 | 5.00 | 9652 | 14666 | 20797 | 31781 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N8 | 5.33 | 3.00 | 4.00 | 4.00 | 8200 | 11915 | 18841 | 29825 | 1·1·1 / 0·0·0 / 0·0·0 / 0·0·0 |
| N9 | 5.00 | 2.00 | 2.00 | 2.00 | 7558 | 9917 | 14611 | 25595 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N10 | 5.00 | 3.00 | 3.00 | 3.00 | 7418 | 11795 | 16489 | 27473 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N12 | 5.67 | 2.00 | 3.00 | 3.00 | 8917 | 9816 | 16548 | 27532 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N13 | 5.00 | 2.00 | 3.00 | 3.00 | 7412 | 9816 | 16548 | 27532 | 0·0·0 / 1·1·1 / 0·0·0 / 0·0·0 |
| N14 | 5.67 | 2.00 | 4.00 | 4.00 | 8964 | 9919 | 18688 | 29672 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N15 | 5.00 | 2.00 | 5.00 | 5.00 | 7572 | 9919 | 20814 | 31798 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N16 | 6.00 | 2.00 | 3.00 | 4.00 | 9596 | 9816 | 16548 | 29672 | 0·0·0 / 0·1·1 / 0·0·0 / 0·0·0 |
| N17 | 4.33 | 3.00 | 4.00 | 5.00 | 7367 | 11854 | 18674 | 31745 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N18 | 6.33 | 3.00 | 5.00 | 6.00 | 10187 | 11500 | 20814 | 33885 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N19 | 4.00 | 2.00 | 2.00 | 2.33 | 2942 | 7191 | 14387 | 25458 | 0·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
| N20 | 6.33 | 2.00 | 6.33 | 7.00 | 8927 | 6261 | 21698 | 35224 | 1·0·0 / 0·0·0 / 0·0·0 / 0·0·0 |
