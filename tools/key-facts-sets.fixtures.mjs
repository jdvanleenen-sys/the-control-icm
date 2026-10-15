// Fixtures for tools/key-facts-sets.mjs. For each fact of each question: one sentence that must
// match (taken from or closely paraphrasing the expected answer) and at least one that names
// the fact wrongly and must not match (a nearby wrong figure, the wrong date, or the hasty
// reader's answer from "Correct requires"). knownLimits lists honest wrong sentences that a
// pattern still matches, because it cannot tell a denial from an assertion; they are kept here
// rather than weakening the test, and the test checks that they still match as recorded.

export const FIXTURES_NEW = {
  N1: {
    '£8, the total': { positive: 'The two tickets cost £8 in total.', negatives: ['The two tickets cost £6 in total.', 'The two tickets cost £9.', 'That is £80 altogether.'] },
    '£5, the 12-to-15 child': { positive: 'A child aged 12 to 15 pays £5.', negatives: ['A child aged 12 to 15 pays £4.', 'Each child pays £3, so £6.'] },
    '£3, the under-12 child': { positive: 'A child under 12 accompanied by an adult pays £3.', negatives: ['A child under 12 pays £4.', 'Both children pay standard admission of £7, £14 in all.'] },
  },
  N2: {
    '£46': { positive: 'Two days at £23 is £46.', negatives: ['The hire is £52 in total.', 'The hire is £47.', 'Two days at £19 is £38.'] },
  },
  N3: {
    '£28': { positive: 'You should have paid £28.', negatives: ['You should have paid £24.', 'You should have paid £27.'] },
    'the transfer clearing on 2 July 2025': { positive: 'A bank transfer counts as received when it clears, which was 2 July 2025.', negatives: ['The transfer was sent on 30 June 2025, so it counts as received then.', 'It cleared on 12 July 2025.', 'It cleared on 3 July 2025.'] },
  },
  N4: {
    'the limit of 42': { positive: 'On 30 May 2026 the limit is still 42 people, excluding duty volunteers.', negatives: ['The limit is now 36, so no.', 'The limit is 41 people.', 'The room holds 420 people.'] },
  },
  N6: {
    'no refund, £0': { positive: 'No, nothing is refunded.', negatives: ['You get a full £4 refund under the film-change rule.', 'The society cancelled, so a full refund applies.'] },
    'because the member entered after being told': { positive: 'Someone who enters after being told about the change loses that option.', negatives: ['The advertised film changed, so you can ask for a full refund of £4.'] },
  },
  N7: {
    '£7, standard admission': { positive: 'They pay £7, the standard admission.', negatives: ['They pay the current member price of £5.', 'They pay the original member price of £4.', 'They pay £8.'] },
    'a suspended member cannot claim member prices': { positive: 'During a suspension the membership rules bar the member from claiming member prices.', negatives: ['A suspended member still pays the member price of £5.', 'A suspended member cannot attend at all.'] },
  },
  N8: {
    '£56, the total': { positive: 'You owe £56 in total.', negatives: ['You owe £46 in total.', 'You owe £66 in total.', 'You owe £57.'] },
    '£36, the hire': { positive: 'Projector hire is £18 a day, which is £36.', negatives: ['Hire is £46 at the combined rate.', 'Hire is £37.'] },
    '£20, the late charge': { positive: 'The return started two late periods at £10 each, adding £20.', negatives: ['One late period adds a charge, £10 on top of the hire.', 'The late charge is £30.'] },
  },
  N9: {
    'the three-day limit': { positive: 'From 1 March 2025 the hire limit is three consecutive booking days.', negatives: ['The limit is two days, so no.', 'You may book up to five days.', 'The limit is 13 days.'] },
  },
  N10: {
    '£12': { positive: 'Annual membership for people aged 16 or 17 costs £12.', negatives: ['It costs £10, the archived figure.', 'It costs £28.', 'It costs £24.', 'It costs £13.'] },
  },
  N12: {
    '£69': { positive: 'The total hire charge is £69.', negatives: ['The total is £64.', 'The total is £105.', 'The total is £56.', 'The total is £68.'] },
  },
  N13: {
    '£112': { positive: 'Four hours at £28 is £112.', negatives: ['Four hours at £24 is £96.', 'Four hours at £20 is £80.', 'The charge is £113.'] },
  },
  N14: {
    '50%': { positive: 'You get back 50% of room, kitchen and equipment hire charges.', negatives: ['You get back 25% of the hire charges.', 'You get back 5% of the hire charges.', 'You get back 150% of nothing.'] },
    'the booking deposit is kept': { positive: 'The £30 booking deposit is not refunded.', negatives: ['The £30 booking deposit is refunded too.', 'You get the £30 deposit back.'] },
  },
  N15: {
    '£100': { positive: 'You get back £100.', negatives: ['You get back £0.', 'You get back £130.', 'You get back £160.', 'You get back £10.'] },
    'the damage deposit': { positive: 'An unused damage deposit is returned in full after a hirer cancellation.', negatives: ['Nothing is returned, not even the booking deposit.'] },
  },
  N16: {
    'full payment': { positive: 'The full hire charge, including the booking deposit, is due at acceptance on 2 October 2025.', negatives: ['The deposit is due by 9 October 2025 and the balance by 28 September 2025.', 'The balance is due on 5 October 2025.'] },
    'on 2 October 2025': { positive: 'Payment is due at acceptance on 2 October 2025.', negatives: ['The deposit is due by 9 October 2025.', 'The balance is due on 5 October 2025.', 'The money is due on 12 October 2025.', 'It is due on 22 October 2025.'] },
  },
  N17: {
    '£72': { positive: 'The most you can be charged is £72.', negatives: ['The most is £84.', 'The most is £96.', 'The most is £144.', 'The most is £71.'] },
    '6 hours': { positive: 'The booking can run at most from 15:00 to 21:00, which is 6 hours.', negatives: ['The booking can run 7 hours, to 22:00.', 'The booking can run 8 hours, to 23:00.', 'The booking can run 16 hours.', 'The booking can run five hours.'] },
  },
  N18: {
    '£130, the total': { positive: 'The deposits total £130.', negatives: ['The deposits total £95.', 'The deposits total £131.'] },
    '£30, the booking deposit': { positive: 'Every booking needs a £30 booking deposit.', negatives: ['The booking deposit is £20, plus £75.', 'You need only the £100 damage deposit.'] },
    '£100, the damage deposit': { positive: 'The damage deposit is £100 and separate from the booking deposit.', negatives: ['The damage deposit is £75.', 'You need only the £30 booking deposit.'] },
  },
  N19: {
    'the four-trustee quorum': { positive: 'Four trustees form a quorum.', negatives: ['Only three count, so it is not quorate.', 'The quorum is five trustees.'] },
    'remote attendance': { positive: 'The rules do not specify whether trustees may attend remotely.', negatives: ['The fourth trustee counts, so the meeting is quorate.'] },
    'that the papers do not settle it': { positive: 'The papers do not say.', negatives: ['Yes, the fourth trustee counts, so the meeting is quorate with four.', 'No, only three count, so it is not quorate.'] },
  },
  N20: {
    'no lost-key charge is set': { positive: 'The papers do not set a charge for a lost key.', negatives: ['The hirer forfeits the £30 booking deposit for the lost key.', 'The charge is deducted from the £100 damage deposit.'] },
    'the key rules nearby': { positive: 'Keys are collected from the booking officer by arrangement and may not be copied or passed to another hirer.', negatives: ['The hirer pays £30 for the lost key.'] },
  },
};

export const FIXTURES_HELDOUT = {
  H1: {
    '£10, the receipt threshold': { positive: 'The treasurer must issue a receipt for payments of £10 or more.', negatives: ['Every cash payment needs a receipt, even £9.', 'Receipts are needed above £11.', 'Receipts are needed from £100.'] },
  },
  H2: {
    '£100, the deposit': { positive: 'The required security deposit is £100.', negatives: ['The deposit is £80 because the booking was confirmed in September.', 'The deposit is £60, the archived figure.', 'The deposit is £101.'] },
    '£20, the additional sum': { positive: 'An additional £20 is required if £80 was already paid.', negatives: ['Nothing more is due; £80 stands.', 'A further £25 is due.', 'A further £200 is due.'] },
  },
  H3: {
    '28 February 2027': { positive: 'The membership expires on 28 February 2027.', negatives: ['It ends on 28 February 2026.', 'It ends on 12 February 2027.', 'It ends on 28 February 2028.'] },
    'the February joining rule': { positive: 'Someone joining during February receives membership until 28 February of the following year.', negatives: ['Membership lasts until 28 February following payment, so it ends on 28 February 2026.', 'Membership lasts exactly 12 months from 12 February 2026.'] },
  },
  H4: {
    '£46': { positive: 'The total hire charge is £46.', negatives: ['The total is £52.', 'The total is £38.', 'The total is £69.', 'The total is £45.'] },
    '£23, the combined rate': { positive: 'Two booking days at the combined projector-and-screen rate of £23 per day.', negatives: ['£18 + £8 = £26 a day.', 'The archived combined rate of £19 a day.'] },
    'noon-to-noon booking days': { positive: 'Each booking day runs from noon until noon the following day.', negatives: ['Each booking day runs from midnight to midnight.', 'A booking day is a calendar day.'] },
    'returned by noon on 14 May 2026': { positive: 'The two-day hire period ends at noon on 14 May 2026.', negatives: ['Return it by noon on 13 May 2026.', 'Return it by noon on 15 May 2026.', 'Return it on 14 May 2026 by midnight.'] },
  },
  H5: {
    '£24': { positive: 'The correct charge is £24.', negatives: ['Charge £20 from the fee sheet.', 'Charge £28.', 'Charge £25.'] },
    'the archived £20 rejected': { positive: 'The £20 adult membership fee belongs to a superseded schedule.', negatives: ['The treasurer should collect £20, the adult subscription.', 'The fee is £28; ignore the fee sheet.'] },
  },
  H6: {
    'a quorum of four': { positive: 'The required quorum is four trustees.', negatives: ['The quorum is five because the committee must have at least five trustees.', 'Three trustees are enough because they agree unanimously.'] },
  },
  H7: {
    '25%': { positive: 'The group receives a 25% room-hire discount.', negatives: ['The group receives a 20% discount.', 'The group receives a 15% discount.', 'The discount is 2.5%.', 'The discount is 125%.'] },
    '£36': { positive: 'The 25% discount is £12, leaving a room charge of £36.', negatives: ['The room charge is £38.40.', 'The room charge is £40.80.', 'The room charge is £35.', 'The room charge is £36.50.'] },
  },
  H8: {
    '100, the combined maximum': { positive: 'Combined events are subject to a separate maximum of 100 people in the building.', negatives: ['The combined maximum is 114, the sum of the rooms.', 'The combined limit is 110 people.'] },
    'the excess of 12': { positive: 'The proposed total is 89 + 23 = 112 people, which exceeds the combined limit by 12.', negatives: ['It exceeds the limit by 2 people.', 'Neither room is over capacity on 12 October, so it is permitted.', 'It exceeds the limit by 14.'] },
  },
  H9: {
    'prior written permission': { positive: 'The hirer must obtain prior written permission to serve alcohol.', negatives: ['The £30 booking deposit alone is sufficient.'] },
    '£100, the damage deposit': { positive: 'The hirer must provide the separate £100 damage deposit.', negatives: ['The damage deposit is £75.', 'The damage deposit is £105 in total.'] },
    '£30, the booking deposit': { positive: 'Every booking also requires the £30 booking deposit.', negatives: ['The damage deposit replaces the booking deposit, so £100.', 'The booking deposit is £20.'] },
    '£130, the total': { positive: 'The combined deposits are therefore £130.', negatives: ['The total is £105.', 'The total is £100.', 'The total is £131.'] },
  },
  H10: {
    'no maximum is specified': { positive: 'The papers do not specify a maximum number of consecutive trustee terms.', negatives: ['The maximum is two consecutive terms, four years.', 'A trustee may serve at most three terms.'] },
    'the two-year term': { positive: 'Each trustee serves for two years and may stand again.', negatives: ['Each trustee serves a three-year term.', 'Each trustee serves for 12 years.'] },
    'may stand again': { positive: 'Each trustee serves for two years and may stand again.', negatives: ['The trustee is automatically entitled to remain in office without another election.'] },
  },
};

// Honest wrong sentences the pattern still matches. The test asserts each still matches, so a
// pattern change that fixes one shows up and the entry can be removed.
export const knownLimits = [
  { set: 'new', id: 'N6', fact: 'no refund, £0', sentence: 'It is wrong to say there is no refund; you get £4 back.', why: 'a pattern cannot tell a denial of "no refund" from the claim' },
  { set: 'new', id: 'N7', fact: 'a suspended member cannot claim member prices', sentence: 'It is not true that they cannot claim member prices; they pay £5.', why: 'denial of the bar reads the same as the bar' },
  { set: 'new', id: 'N14', fact: 'the booking deposit is kept', sentence: 'Nothing says the deposit is kept, so it comes back.', why: 'denial of the deposit being kept reads the same as the claim' },
  { set: 'new', id: 'N16', fact: 'full payment', sentence: 'You do not need to pay in full until 28 September 2025.', why: 'denial of full payment reads the same as the claim' },
  { set: 'new', id: 'N19', fact: 'that the papers do not settle it', sentence: 'The papers do not say he is excluded, so yes, he counts.', why: 'silence wording can sit inside a yes/no answer' },
  { set: 'new', id: 'N20', fact: 'no lost-key charge is set', sentence: 'The papers do not mention a separate fee, so the £30 booking deposit is kept for the key.', why: 'silence wording can sit inside an answer that then states a charge' },
  { set: 'heldout', id: 'H5', fact: 'the archived £20 rejected', sentence: 'Collect £20 as shown in the archived document.', why: 'naming the archive while applying it reads the same as rejecting it' },
  { set: 'heldout', id: 'H6', fact: 'a quorum of four', sentence: 'The quorum is not four; three is enough.', why: 'denial of the four-trustee quorum reads the same as the claim' },
  { set: 'heldout', id: 'H10', fact: 'may stand again', sentence: 'The trustee may not stand again after two terms.', why: 'denial of standing again reads the same as the claim' },
];
