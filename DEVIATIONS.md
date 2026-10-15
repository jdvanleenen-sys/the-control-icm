# Deviations from the plan

Anything done differently from `PLAN.md`, in the order it happened, with the reason. Corrections to
the plan made before the build are in `DESIGN-LOG.md`.

## Thursday 2026-10-15: the gate failed once, and the builder's fifth round fixed it

The gate auditor (`builder/GATE.md`) passed every applicable item but one, counted twice: three rules
were written in three files each, against the method's "one home per fact" (walk test, invariant 8).
The plan said the ICM runs only if every applicable item passes, and allowed only four kinds of fix
after the switch to live documents; it did not say what follows a failed gate. We decided: the
builder used its fifth practice round, which the plan allowed and which had not been used, to fix only
the failing item (and to say plainly that the map script lives outside the workspace, which the
auditor also noted), on practice documents, with the six gate questions run again. The live document
list was then regenerated and the gate run again by a fresh auditor. The builder never saw the live
documents or any live question.
