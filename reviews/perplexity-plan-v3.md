# Perplexity's review of plan version 3

Thursday 2026-10-15, 9:42 AM Mountain, perplexity.ai, Jeff's account, in Chrome, with the model
Perplexity chose by default (not recorded). The prompt was the text in `reviews/perplexity-prompt.txt`
(a short instruction followed by `PLAN.md` version 3, commit f085c35), pasted by the build session. The
answer below was copied from the page as text. Perplexity listed 15 sources; their links were not
kept. Its links to "nature", "code.claude" and "github" were attached to notes 2, 3 and 7.

---

1. Review notes

MANDATORY — Attribution: icm versus docs or folder cannot identify a read-path effect: the plan itself acknowledges different wording, authorship and structure. Yet its verdict credits "the ICM read path." Fix: add icm-eager, loading the identical ICM instruction text initially rather than on demand; make that the mechanism comparison. Describe the existing comparisons only as workspace-bundle comparisons.

MANDATORY — The accuracy gate establishes an observed tolerance, not evidence that accuracy loss stays below that tolerance. Noninferiority requires an uncertainty bound against a justified margin, not merely a point difference smaller than M. Fix: either report this as a finite-benchmark decision rule without broader accuracy assurances, or preregister a paired, question-level uncertainty analysis and justify the acceptable loss.

MANDATORY — "Only CLAUDE.md loads by itself" is not a sufficient isolation specification. Claude Code also supports inherited instructions, rules and automatic memory; repository worktrees can share memory. Fix: specify clean session homes, disabled memory, excluded external instructions, exact model/settings/version and no resumption; archive the effective loaded context and tool permissions for every session.

DEFECT — folder-staged does not change "when the words load, nothing else": it adds routing instructions, changes placement and introduces navigation. Sentence preservation cannot establish the advertised manipulation. Fix: build one routing scaffold shared by eager and staged variants, differing only in loading policy—or label this a restructuring comparison and abandon the single-variable claim.

MANDATORY — The question-count rules are incomplete. Additional disputes or overlap exclusions can leave N below the supplied threshold table; the definition of "same source sections" is also unspecified. Fix: freeze an exclusion algorithm, minimum usable N, replacement policy and threshold computation covering every permitted N before question generation; otherwise abort.

MANDATORY — The supposedly mechanical fact count lacks a specified validity check. The plan does not say how patterns handle negation, contradictions, wrong attribution or equivalent wording. Fix: publish adversarial positive/negative fixtures for every pattern; call the result "pattern coverage," not correctness, unless validated against blinded semantic marking.

DEFECT — The ICM gate has competing authorities: the skill selects the form, but PO Verifier overrides its templates, and a local router limit also constrains it. ICM's architect explicitly selects among forms and validates through a walk test. Fix: freeze the exact PO exemplar and precedence rules, then require an independent method-fidelity decision before outcomes exist.

MANDATORY — The outside marker can disappear from the verdict merely by failing to finish, while batches pass through the build session. Fix: preregister export formatting, judge prompts, batch composition and missing-rating handling; require complete outside marking before any confirmatory verdict rather than silently weakening the gate.

MANDATORY — "Nothing is published without Jeff's go" leaves outcome-dependent publication possible. Fix: commit an unconditional release obligation covering frozen artifacts, all attempts and results—including voided runs—or identify the exercise as private exploratory work.

2. Anything to cut

Cut the empty-arm history, giveaway threshold and historical runtime from the confirmatory specification. Keep replication questions in a separate appendix. Drop folder-staged if replaced by the cleaner identical-text eager/staged comparison.

3. Acceptance

I would not accept a result as evidence for the read-path claim; the single most important change is an identical-content icm-eager versus icm-staged comparison, with the existing arms retained only as bundle benchmarks.
