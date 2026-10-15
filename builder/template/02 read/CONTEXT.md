# 02 read: turn the documents into rows

## What this stage is for
The AI reads everything in the house's intake folder and writes it out as rows. Sam checks the
rows before anything is compared.

## What comes in
Everything in `../01 intake/<house>/`: each PO, each EPO, Sam's measurements, and the address,
lot, builder and dates he gave. The price list, as described in `../reference/price-list.md`.

## What is read from each PO
All of it, copied exactly as printed.
- **The PO number** (printed as ORDER #). It goes on every row read from that PO and follows
  the row through every later stage. It is how the builder finds the PO.
- About the PO: builder, community, cost code, vendor name and number, job name,
  job address, lot/block/unit, plan, elevation, date needed, price effective date, who submitted
  it and when, who approved it and when (if filled in).
- Each line: option number, SKU, description, unit, quantity, unit price, line total.
- Under each line: the special option information, every line of it. That means the option name,
  each selection, and any notes.
- The money at the bottom: subtotal, each tax line, total.

## What is read from each EPO
All of it, copied exactly as printed: who created it, community, job name, lot number, legal
lot and block, EPO name, EPO total, reason code, notes, account code, trade partner, date
requested, and its approval status. The EPO name carries the vendor number and the PO number it is
against. Record that PO number on the EPO row. An EPO has a total and no lines, so match it to the item it pays for, using its
account code and notes, and show that match to Sam like any other.
Also say which way the money goes. Most EPOs pay Sam. A back charge against Sam takes money from
him. A back charge against another trade, where the builder pays Sam to fix that trade's work,
still pays Sam. Sam confirms the direction with the rest of the table.

## What is read from Sam's measurements
One row per thing he measured, in his own words: what it is, its size or count, the colour, and
anything else he wrote.

## Matching to the price list
Each PO line and each thing Sam measured is matched to one item on the price list. The match is
shown in the table so Sam confirms it with everything else. If something fits no item, or could
fit two, it is listed as "no match" and Sam decides.

## What is checked before Sam sees it
1. Each line's quantity times its unit price equals its line total.
2. The lines add up to the subtotal printed on the PO.
3. The subtotal plus the taxes equals the total.
4. The job address on each PO matches the address Sam gave.
5. Anything on Sam's notes that is on no PO is listed as an extra item.
6. No PO number appears twice in the house folder. If one does, say which and stop. The same PO
   read twice would count its money twice.

If check 1, 2, 3, 4 or 6 fails, say which PO and stop.

## How Sam confirms
He sees one table of everything that was read and replies yes. If a row is wrong, he gives the
right number and the AI fixes that row, then shows the table again.

## What goes out
One file per house in this folder, `<house>/read-back.md`, holding the confirmed rows, Sam's yes,
and the date. The compare stage (`../03 compare/`) works from that file and nothing else.

## What must never happen here
The AI never guesses a number it cannot read. It never corrects a PO, even an obvious mistake.
It never changes the files in intake. Nothing is priced or compared here.

## Careful
These come from real builder POs.
- **The lines add up to the subtotal, not the total.** The total includes tax.
- **A quantity is not always a count.** One PO had a quantity of 0.1 against a lump-sum price.
  Copy it as printed.
- **The unit can be wrong.** One PO said EA on a line that was plainly priced per square foot.
  Copy the unit as printed and say so in the table.
- **The quantity and the selection can disagree.** One line had a quantity of 721 and a selection
  of 773. Record both. Do not pick one.
- **The notes under a line can change what it covers.** One said what the price does not include.
  Copy them in full.
- **A number can be printed oddly.** A selection of 1 can appear as `1.000000000000000e+000`.
- **One house has many POs to many trades.** The order number is the job number, a slash, and a
  running number. Every PO in a house folder should be to the same vendor.
- **Each PO has its own price effective date.** Record it. It says which price list the builder
  priced from.
