# 04 review: Sam decides

## What this stage is for
Sam decides what goes on the request to the builder. The AI lays it out; Sam makes every call.

## What comes in
`../03 compare/<house>/variance.md`.

## What Sam sees
Every row shows its PO number, grouped by PO.
- **Flagged rows.** These go on the request unless Sam takes one off. If he takes one off, he
  gives a few words on why.
- **Sam's-call rows.** He says chase or leave for each. If he says nothing, the row is left off.
- **Credits back to the builder,** shown as minus rows. Each one is Sam's call, like the rows
  above. A credit is left off unless he says to include it.
- **If the house total is flagged:** every ignore row as well, so he sees the small ones together.
- **Not-comparable rows,** for his information only. They have no call.

## How Sam answers
One table for the house. He replies yes to accept it as shown, or names the rows he wants to
change. The AI updates the table and shows it again until he says yes.

## What goes out
`<house>/review.md`, holding each row with Sam's decision, the reason for any flagged row he took
off, his yes, his name and the date. There is one request per house. The request stage
(`../05 request/`) works from that file.

## What must never happen here
The AI never makes a call for Sam and never fills in a decision he did not give. A row Sam did
not choose never goes on the request.
