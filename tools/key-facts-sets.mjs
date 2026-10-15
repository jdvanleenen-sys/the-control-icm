// The key facts for the two later question sets: questions-new.md (ids N...) and
// questions-heldout.md (ids H...). Same format and same rules as FACTS in key-facts.mjs: one
// [name, pattern] pair for each thing the "must" half of a question's "Correct requires" line
// asks for, tried on the answer with its spaces squeezed and its case kept. The "it is wrong
// if" half needs a reader and is not here.
//
// Written from each question's Expected answer and Correct requires lines alone; no answer
// was read. Checked by verify/key-facts-sets.test.mjs against key-facts-sets.fixtures.mjs.
//
// Left out, because a pattern cannot match them fairly (reason codes):
//   YN = a yes/no or allowed/not-allowed conclusion; the pattern would match a denial too.
//   N4  YN  "say yes" (the person may be admitted)
//   N9  YN  "say yes" (three days are allowed)
//   H1  YN  "a £9 payment does not require a receipt"
//   H6  YN  "three are insufficient" (the meeting cannot decide)
//   H8  YN  "reject the proposed attendance"

// A pound figure that is not the start of a longer number: £8 matches "£8" and "£8.00", not
// "£80", "£8.50" or "£8,000".
const money = (n) => new RegExp(`£\\s?${n}(?!\\d)(?!\\.(?!00)\\d)(?!,\\d{3})`);
// A percentage that is not the tail or head of another number.
const percent = (n, word) => new RegExp(`(?<![\\d.])${n} ?(%|per ?cent)|\\b${word} per ?cent`, 'i');

// The papers are silent: the same wording the entry used for its own "not settled" fact.
const SILENT = /do(es)? not (say|address|cover|specify|state|define|settle|decide|set|establish)|don't (say|address|cover|specify|state|settle|set)|doesn't (say|address|cover|specify|state|settle|set)|not (addressed|covered|specified|stated|defined|settled|decided|set)|unspecified|undefined|silent|leaves? .{0,40}(open|undecided|unspecified|undefined)|left .{0,30}(open|undecided|unspecified|undefined)|no rule|cannot (say|tell|determine|be determined|establish)|can't (say|tell|determine)|not (able|possible) to (say|tell|determine)/i;

export const FACTS_NEW = {
  N1: [['£8, the total', money(8)], ['£5, the 12-to-15 child', money(5)], ['£3, the under-12 child', money(3)]],
  N2: [['£46', money(46)]],
  N3: [['£28', money(28)], ['the transfer clearing on 2 July 2025', /(?<!\d)2(nd)? July|July 2(nd)?(?!\d)/i]],
  N4: [['the limit of 42', /(?<!\d)42(?!\d)|forty-two/i]],
  N6: [['no refund, £0', /no refund|nothing (is |will be |can be )?(refunded|returned|back)|not (be )?(entitled to a )?refund(ed|able)?|non-?refundable|£\s?0(?!\d)/i],
    ['because the member entered after being told', /(enter(ed|s|ing)?|went in|go(es)? in|going in|admitted).{0,80}(told|informed|notified|aware|knowing)|(told|informed|notified|aware|knowing).{0,80}(enter(ed|s|ing)?|went in|go(es)? in|going in|admitted)/i]],
  N7: [['£7, standard admission', money(7)],
    ['a suspended member cannot claim member prices', /(cannot|can't|can not|not (entitled|allowed|eligible|permitted)|bar(red|s)?|lose|loses|no longer|may not|ineligible|not claim).{0,60}member (price|rate|discount)/i]],
  N8: [['£56, the total', money(56)], ['£36, the hire', money(36)], ['£20, the late charge', money(20)]],
  N9: [['the three-day limit', /(?<!\d)3(-| )(consecutive )?(booking )?days?|\bthree(-| )(consecutive )?(booking )?days?/i]],
  N10: [['£12', money(12)]],
  N12: [['£69', money(69)]],
  N13: [['£112', money(112)]],
  N14: [['50%', /(?<![\d.])50 ?(%|per ?cent)|\bfifty per ?cent|\bhalf\b/i],
    ['the booking deposit is kept', /deposit.{0,40}(is not|isn't|not be|will not be|won't be|not) (refunded|returned|repaid|given back)|deposit.{0,40}(kept|retained|forfeit|non-?refundable)|non-?refundable.{0,30}deposit|(keep|keeps|retain|retains|forfeit|forfeits) .{0,30}deposit/i]],
  N15: [['£100', money(100)], ['the damage deposit', /damage deposit/i]],
  N16: [['full payment', /(full|whole|entire|total) .{0,30}(hire charge|payment|amount|charge|sum)|all (of )?the (hire )?charge|in full/i],
    ['on 2 October 2025', /(?<!\d)2(nd)? October|October 2(nd)?(?!\d)/i]],
  N17: [['£72', money(72)], ['6 hours', /(?<!\d)6(-| )hours?|\bsix(-| )hours?|15[:.]00 ?(to|-|–|until|till) ?21[:.]00/i]],
  N18: [['£130, the total', money(130)], ['£30, the booking deposit', money(30)], ['£100, the damage deposit', money(100)]],
  N19: [['the four-trustee quorum', /quorum\b.{0,40}\b(four|4)\b|\b(four|4)(-| )trustees?\b.{0,40}quorum|\b(four|4)(-| )trustee quorum/i],
    ['remote attendance', /remote|video/i], ['that the papers do not settle it', SILENT]],
  N20: [['no lost-key charge is set', /no (set |specified |stated |fixed |particular )?(charge|fee|figure|amount|price|cost|penalty)|do(es)? not (set|specify|state|say|give|provide|mention|cover|address|fix)|doesn't (set|specify|state|say|give|provide|mention|cover|address)|don't (set|specify|state|say|give|provide|mention|cover|address)|not (set|specified|stated|covered|addressed)|silent|no rule/i],
    ['the key rules nearby', /copied|copy|booking officer|pass(ed)? .{0,20}another hirer/i]],
};

export const FACTS_HELDOUT = {
  H1: [['£10, the receipt threshold', money(10)]],
  H2: [['£100, the deposit', money(100)], ['£20, the additional sum', money(20)]],
  H3: [['28 February 2027', /28(th)? Feb(ruary)?,? 2027|Feb(ruary)? 28(th)?,? 2027|28[/.-]0?2[/.-](20)?27(?!\d)/i],
    ['the February joining rule', /(join|joins|joined|joining|enrol|enrols|enrolled|enrolling|enrolment|pay|pays|paid|payment) .{0,30}(during|in) February|February[- ](join|joiner|enrol|rule|condition|provision|exception|clause|specific)/i]],
  H4: [['£46', money(46)], ['£23, the combined rate', money(23)],
    ['noon-to-noon booking days', /noon (to|until|till|-|–) noon|noon.{0,40}following day|midday (to|until|till|-|–) midday|12[:.]00 (to|until|till|-|–) 12[:.]00/i],
    ['returned by noon on 14 May 2026', /(noon|midday|12[:.]00|12 ?pm).{0,30}(?<!\d)14(th)? May|(?<!\d)14(th)? May.{0,30}(noon|midday|12[:.]00|12 ?pm)/i]],
  H5: [['£24', money(24)],
    ['the archived £20 rejected', /£\s?20(?!\d).{0,80}(supersed|archiv|outdated|out of date|no longer|replaced|expired|obsolete|not (apply|valid|current)|does not apply|doesn't apply|applied only|only applied)|(supersed|archiv|outdated|out of date|no longer|replaced|expired|obsolete).{0,80}£\s?20(?!\d)/i]],
  H6: [['a quorum of four', /quorum\b.{0,40}\b(four|4)\b|\b(four|4)(-| )trustees?\b/i]],
  H7: [['25%', percent(25, 'twenty-five')], ['£36', money(36)]],
  H8: [['100, the combined maximum', /(?<![\d.£,])100(?!\d)|one hundred/i],
    ['the excess of 12', /(exceed|exceeds|exceeded|exceeding|over|excess|too many|above|more than|beyond).{0,40}\b(12|twelve)\b(?! (October|Oct)\b)|\b(12|twelve) (people|persons|attendees|guests|too many|over|above|more)\b/i]],
  H9: [['prior written permission', /written permission|permission in writing|written (consent|approval)/i],
    ['£100, the damage deposit', money(100)], ['£30, the booking deposit', money(30)], ['£130, the total', money(130)]],
  H10: [['no maximum is specified', new RegExp(`no (maximum|max|limit|cap|upper limit)|(maximum|limit|cap).{0,40}(not (specified|defined|set|stated|given|established)|undefined|unspecified)|${SILENT.source}`, 'i')],
    ['the two-year term', /(?<!\d)2(-| )years?|\btwo(-| )years?/i],
    ['may stand again', /stand (again|for re-?election)|re-?elect|seek re-?election|eligible (for|to)/i]],
};

export const squeeze = (text) => String(text ?? '').replace(/[   ]/g, ' ').replace(/\s+/g, ' ');

// Which of a question's facts an answer leaves out, as missingFacts() does in key-facts.mjs.
export function missingFactsIn(table, question, answer) {
  const text = squeeze(answer);
  return (table[question] ?? []).filter(([, pattern]) => !pattern.test(text)).map(([name]) => name);
}
