---
name: log-defect
description: Write a clear, reproducible bug report from notes, screenshots, logs or a failed QA criterion. Use when QA finds a bug, a user reports one, or the approver says "log a bug" or "/log-defect".
argument-hint: <what went wrong, in plain words>
---

# log-defect — a bug report someone can act on

Read `CLAUDE.md` and `docs/qa/templates/defect-report.md` (if missing, use
`${CLAUDE_PLUGIN_ROOT}/templates/project/docs/qa/templates/defect-report.md`).

1. Gather environment, role, exact steps, expected vs actual and evidence
   from what you were given. If steps or environment are missing, ask once;
   a bug that can't be reproduced can't be fixed.
2. **Expected** comes from the acceptance criterion or approved design;
   quote it. If neither covers the case, say so.
3. Title: what fails, where, under what condition (e.g. "Checkout: Pay does
   nothing when card expiry is the current month").
4. Severity from `docs/qa/TEST_PLAN.md` §5; priority separately, with a
   reason if it differs.
5. Evidence only from what was observed. Without it, mark the bug
   **unconfirmed**. Redact secrets and personal data.
6. Save to `docs/qa/bugs/BUG-NNN-<slug>.md` (next free number), or, if
   `CLAUDE.md` names an issue tracker, draft it for that tracker and show it
   to the approver before filing — filing is a public action that needs their
   yes.
7. A bug in a story under build goes back to the engineer through `/build`;
   don't fix application code from this skill.
