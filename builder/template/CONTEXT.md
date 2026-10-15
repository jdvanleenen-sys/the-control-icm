# PO Verifier: the map

## What this is
It checks a builder's POs against what the trade measured on site, and builds the request for the
difference. This is a practice build. The data is made up and nothing is ever sent.

## What is here

| Folder or file | What it holds |
|---|---|
| `reference/price-list.md` | Where the price list lives and how to read it |
| `01 intake/` | What arrives for each house, untouched |
| `02 read/` | The documents turned into rows, confirmed by Sam |
| `03 compare/` | The difference, worked out by calculation |
| `04 review/` | Sam's decisions |
| `05 request/` | The request for the site super |

Each stage folder has a `CONTEXT.md` that says what happens there. Read it before working in it.

## How a house moves through
A house goes through the stages in order, 01 to 05. In every stage it has its own folder, named for
its address, such as `77-mockup-drive`. A stage only starts when the one before it has finished. The original documents stay in
`01 intake` and are never moved or copied. Each later stage reads what the stage before it wrote,
and writes only its own output into its own house folder.

## How things are named
- **PO number:** the ORDER # printed on a PO. It is the job number, a slash, and a running number.
  It goes on every row and is never dropped.
- **EPO:** the builder's extra PO. It has a total and no lines, and names the PO it belongs to.
- **VPO:** what Sam asks for. The site super writes it as an EPO.

## What the numbers mean
- Variance is measured value minus PO amount. A plus is money owed to Sam. A minus is a credit
  back to the builder.
- The calls ($0, under $50, $50 to under $100, $100 and up) and the house-total rule are in
  `03 compare/CONTEXT.md`.
- Tax is taken from each PO's own figures. See `05 request/CONTEXT.md`.

## What lives somewhere else
- The price list is in Airtable. See `reference/price-list.md`.
- The POs come from the builder's ordering system (OrderDesk). The files here are copies.
- EPOs are written and approved in the builder's system, not here.

## Where Sam is asked
Twice: in `02 read`, to confirm what was read, and in `04 review`, to decide what to chase.
Everything else runs without him.

## What must never happen
- Nothing in `01 intake` is ever changed.
- No dollar amount is written by judgment. Every one comes from a calculation.
- The AI never makes a call for Sam and never sends anything.
- If something is unclear, stop and ask Sam. Never guess.
