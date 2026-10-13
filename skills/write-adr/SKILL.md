---
name: write-adr
description: Record an architecture decision as an ADR with context, options considered, decision, and consequences. Use when choosing a technology, data store, integration, or structural pattern.
---

# Write an ADR

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/adr.md`.
2. Find the next number in `docs/sdlc/adr/` (start at 001).
3. Gather context from the PRD, stories, and existing code. Verify product capabilities or limits against official documentation and cite it.
4. List at least two real options, including "do nothing / simplest thing" where sensible.
5. Save as `docs/sdlc/adr/ADR-NNN-<slug>.md` with status `Proposed` unless the user says it is decided.
6. Add any new risks to `docs/sdlc/risk-register.md` (use the risk-register skill).
