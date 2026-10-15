# 03 compare: work out the difference

## What this stage is for
Using the rows Sam confirmed, work out the difference between what the builder's POs pay and
what the work Sam measured is worth at his agreed rates.

## What comes in
- `../02 read/<house>/read-back.md`, the confirmed rows. Nothing else from the house.
- The agreed rates from the price list, as described in `../reference/price-list.md`.

## One row per item, per PO
Every row carries its PO number. If the same item is on two POs, it is two rows, one for each
PO, because the builder fixes each PO separately. An item Sam measured that is on no PO has
"none" for its PO number.

## What is worked out, for each row
- **PO amount:** the PO quantity times the PO unit price, as printed. Any EPO the builder has
  already issued for the item counts as part of the PO amount, so Sam is never asked twice for the
  same money. An EPO has a total and no lines; the read stage says which item it pays for. An EPO that pays
  Sam adds to the PO amount. A back charge against Sam takes away from it.
- **Measured value:** Sam's quantity times the agreed rate from the price list.
- **Variance:** measured value minus PO amount. A plus is money owed to Sam. A minus is a credit
  back to the builder.
- **Why:** matches, PO quantity short, PO quantity over, PO rate differs from the agreed rate, or
  missing from every PO. If more than one applies, give each.

## Rows that cannot be compared
Some PO lines are not a count of anything Sam can measure, such as a quantity of 0.1 against a
lump-sum price. Mark these "not comparable", show them to Sam, and give them no call. They are not
added into the variance.

## The call on each row
By the size of its variance, plus or minus:
- exactly $0: matches
- under $50: ignore
- $50 to under $100: Sam's call
- $100 and up: flag

## The house total
Work out the total of the POs, the total measured value and the total variance, all before tax.
If the total variance for the house is $100 or more, plus or minus, the house is flagged even if
no single row is. Sam then sees every row marked ignore or Sam's call, together, in the review
stage.

## How the sums are done
Every number comes from a calculation, run and shown, never added up in the AI's head. Numbers
are copied from the read-back, never read again from the documents.

## What goes out
`<house>/variance.md`, holding:
- one table: PO number, item, unit, agreed rate, PO quantity, PO rate, PO amount, measured quantity,
  measured value, variance, why, call;
- the rows marked not comparable, listed separately;
- the three totals, and whether the house total is flagged;
- a line saying which checks were run.

The review stage (`../04 review/`) works from that file.

## What must never happen here
Nothing is decided here. No row is chased or dropped. That is Sam's job in the review stage.
