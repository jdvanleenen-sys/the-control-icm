# 05 request: build the VPO request

## What this stage is for
Turn Sam's approved rows into one request for the house, with the proof attached. Sam sends it to
the builder's site super, who writes the EPO.

## What comes in
- `../04 review/<house>/review.md`, with Sam's yes.
- `../03 compare/<house>/variance.md`, for the numbers.
- The original POs, EPOs and measurements in `../01 intake/<house>/`, as proof.

## What the request holds
- **The house:** address, lot, builder, community, job name.
- **The rows, grouped by PO number.** The site super writes one EPO per PO, so each PO gets its
  own group, headed by its PO number. Each row shows the item, the PO quantity and amount, Sam's measured quantity and
  value, the difference, and why.
- **Tax on every group.** For each PO group: the difference before tax, each tax line, and the
  total. Use the tax lines and rates printed on that PO, worked out from its own subtotal and tax
  amounts. Never assume a rate. Every request carries tax, because every sale has tax. The
  "no PO" group uses the rate on the house's other POs. If those POs carry different rates, stop
  and ask Sam.
- **Items on no PO** go in their own group, marked "no PO", so the site super knows a new PO
  or EPO is needed.
- **Credits** Sam chose to include, shown as minus rows inside their PO group.
- **The total for the house:** before tax, the tax, and the total.
- **The proof:** a list of every document attached.

## How it looks
Follow `../reference/request-layout.html`. A filled-in sample is
`../reference/request-layout-sample.pdf`. Show only the rows Sam approved. Matches, ignored rows
and rows Sam left off are not on the request.

## How the sums are done
Every difference is copied from the compare, never worked out again. The tax and the totals come
from a calculation, run and shown.

## What goes out
`<house>/vpo-request.pdf`, for Sam to check. Sam sends it to the site super himself.

## What must never happen here
Only rows Sam approved go on the request. The AI never sends it, and never contacts the builder
or the site super.
