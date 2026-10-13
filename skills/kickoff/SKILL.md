---
name: kickoff
description: Run a feature or project through the SDLC team end to end — PRD, stories, design, test plan, risks, release checklist. Use when starting a new feature or project and you want the full set of artifacts.
---

# SDLC kickoff

Drive a request through the team in phase order. Each phase produces a file under `docs/sdlc/` in the user's project (create the folder if missing). Templates live in `${CLAUDE_PLUGIN_ROOT}/templates/`.

| Phase | Agent | Skill | Output |
|---|---|---|---|
| 1. Define | product-manager | write-prd | `docs/sdlc/prd.md` |
| 2. Specify | business-analyst | write-stories | `docs/sdlc/stories/US-*.md` |
| 3. Design | architect | write-adr | `docs/sdlc/adr/ADR-*.md` |
| 4. Plan quality | qa-engineer | test-plan | `docs/sdlc/test-plan.md` |
| 5. Assess risk | architect + security-engineer | risk-register | `docs/sdlc/risk-register.md` |
| 6. Release prep | devops-engineer | release-check | `docs/sdlc/release-checklist.md` |

## Steps
1. Restate the request in one paragraph and list unknowns. Ask the user only the questions whose answers change scope; otherwise record them as `ASSUMPTION:`.
2. Run phases 1–6 in order, delegating each to its agent. Pass the previous phase's file as input.
3. Reviewer is never the author: after each phase, have a different agent check the output for testability and gaps (QA reviews the PRD and stories; security reviews the design).
4. Stop after phase 6 and summarize: files created, open questions, top three risks. Do not start implementation unless the user asks.
