---
name: write-prd
description: Write a product requirements document from an idea, brief, or notes. Use when a feature or product needs a problem statement, goals, scope, and testable requirements.
---

# Write a PRD

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/prd.md`.
2. Gather inputs: the user's request, any linked docs, and existing code or docs in the repo.
3. Fill every section. Mark unknowns as `ASSUMPTION:` or `QUESTION:` — never invent metrics or user research.
4. Give each requirement an ID (FR-001…, NFR-001…) and make it testable.
5. Save to `docs/sdlc/prd.md` (or the path the user names).
6. Reply with the file path, the open questions, and a one-line scope summary.
