# Definition of Done

A change is done when every applicable box below is checked — not when it
"looks right" or "the happy path works." These are the exit criteria
referenced by `TEST_PLAN.md` and by the QA pass in `docs/agent/RULES.md`.
Add project-specific boxes under **Project-specific** as incidents teach
you what to check.

## Every change

- [ ] The lint, test and build commands in `CLAUDE.md` all pass. A red or
      skipped test is not done; fix it or explain why in the PR, never
      silence it.
- [ ] The diff is the smallest change that satisfies the acceptance
      criteria — no drive-by refactors, no speculative abstractions.
- [ ] No secrets, tokens, or real credentials in the diff (check `.env`
      files and anything that looks like a key before committing).

## If it fixes a bug

- [ ] There's a test that fails against the old code and passes against
      the fix. Prove it: temporarily reintroduce the bug, watch the new
      test fail, then revert — don't just assume the test would have
      caught it.
- [ ] The root cause is documented (in the PR description or a code
      comment), not just the symptom.

## If it changes the data layer

- [ ] Every field the code writes is checked against the current schema and
      migrations.
- [ ] Any query rules listed under **Project rules** in `CLAUDE.md` are
      followed.

## If it changes the data model, access rules, or adds an integration

- [ ] A short ADR exists in `docs/adr/` explaining the decision.
- [ ] New schema changes live in a new, idempotent migration file. It is
      never run against production directly; it's listed under "Approver
      must do" in the PR.
- [ ] Every new or changed access rule is read and reasoned through (what
      role can do what, on which records). If tests don't exercise the real
      access rules, say so explicitly in the PR instead of asserting it's
      safe.

## If it changes UI

- [ ] It matches the approved design version recorded in the brief; any
      difference is listed in the PR.
- [ ] WCAG 2.1 AA pass (contrast, focus order, labels/roles, 44px touch
      targets).
- [ ] Loading, empty and error states are handled — a page must not crash
      or show a blank screen when there's no data.
- [ ] Works at 390px wide and in every theme the product supports.
- [ ] If the project has an e2e suite, the e2e tests for what changed are
      added or updated **in the same PR**. Never skip or delete a failing
      e2e test to get green.

## If it changes marketing or product-facing copy

- [ ] No fabricated claims, statistics, logos, or capabilities. A number
      shown must come from real data or be clearly marked illustrative.
- [ ] Claims with compliance weight (money, data handling, certifications)
      are checked against what the product actually does.

## Project-specific

- [ ] <Add checks here, e.g. "client env handling never throws at import".>

## Before opening the PR

- [ ] `docs/agent/STATUS.md` is updated in the same PR.
- [ ] The PR description includes: acceptance criteria with results, what
      changed, test evidence (the actual commands run and their output, not
      just "tests pass"), the design link, and an "Approver must do" list
      (migrations, env vars, what to verify live).
- [ ] Anything inferred rather than verified is labelled as such.
