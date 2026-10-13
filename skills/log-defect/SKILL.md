---
name: log-defect
description: Write a clear, reproducible defect report from notes, screenshots, logs, or a description of a failure. Use when a bug is found during testing or reported by a user.
---

# Log a defect

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/defect-report.md`.
2. Extract environment, exact steps, expected vs actual, and evidence from what the user provides. If steps or environment are missing, ask for them — a defect that can't be reproduced can't be fixed.
3. Title format: what fails, where, under what condition (e.g., "Checkout: Pay button does nothing when card expiry is in current month").
4. Set severity by user impact using the guide in the template; set priority separately and say why if they differ.
5. Redact secrets and personal data from logs and screenshots descriptions.
6. Save to `docs/sdlc/defects/BUG-NNN-<slug>.md` (next free number), or output the report for pasting into the user's tracker if they say so.
