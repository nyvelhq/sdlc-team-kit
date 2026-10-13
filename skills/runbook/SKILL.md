---
name: runbook
description: Write an operational runbook for a service or recurring procedure, with verification, rollback, and escalation. Use when documenting deploys, incident response steps, or maintenance tasks.
---

# Write a runbook

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/runbook.md`.
2. Base steps on the actual scripts, config, and CI in the repo; quote real commands rather than invented ones.
3. Each step states the command or action and the expected output.
4. Include verification, rollback, and escalation — a runbook without rollback is incomplete.
5. Save to `docs/sdlc/runbooks/<slug>.md`. Mark `Last tested` as `Not yet tested` until someone runs it.
