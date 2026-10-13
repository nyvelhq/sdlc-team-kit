---
name: release-check
description: Prepare and audit a release checklist with go/no-go criteria and a rollback plan. Use before any production deploy or app store submission.
---

# Release checklist

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/release-checklist.md`.
2. Check each readiness item against evidence in the repo: CI status, test plan exit criteria, open defects, security findings, migrations, changelog. Tick an item only with evidence; otherwise leave it open and note what's missing.
3. Require a concrete rollback trigger and steps.
4. Save to `docs/sdlc/release-checklist-<version>.md`.
5. Give a go / no-go recommendation listing every unchecked blocker.
6. Never deploy, tag, or push as part of this skill. Those need explicit user approval.
