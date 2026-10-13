# sdlc-team-kit

A virtual SDLC team for [Claude Code](https://code.claude.com): seven role agents, eleven phase skills, and ten document templates that the skills fill in.

## Install

```bash
claude plugin marketplace add nyvelhq/sdlc-team-kit
claude plugin install sdlc-team-kit@nyvel
```

Or try it locally without installing:

```bash
claude --plugin-dir ./sdlc-team-kit
```

## What's inside

### Agents (`agents/`)
| Agent | Role |
|---|---|
| `product-manager` | Problem framing, scope, PRDs |
| `business-analyst` | User stories, Gherkin acceptance criteria, traceability |
| `architect` | System design, data models, ADRs |
| `software-engineer` | Implementation with unit tests |
| `qa-engineer` | Test plans, test cases, defects, status reports |
| `security-engineer` | STRIDE threat models, OWASP Top 10 / MASVS review |
| `devops-engineer` | CI/CD, releases, runbooks, postmortems |

Reviewer is never the author: the engineer builds, QA and security review.

### Skills (`skills/`) — invoke as `/sdlc-team-kit:<name>`
| Skill | Produces |
|---|---|
| `kickoff` | Runs phases PRD → stories → ADR → test plan → risks → release checklist |
| `write-prd` | `docs/sdlc/prd.md` |
| `write-stories` | `docs/sdlc/stories/US-*.md` + traceability |
| `write-adr` | `docs/sdlc/adr/ADR-*.md` |
| `test-plan` | `docs/sdlc/test-plan.md` |
| `log-defect` | `docs/sdlc/defects/BUG-*.md` |
| `risk-register` | `docs/sdlc/risk-register.md` |
| `qa-status` | `docs/sdlc/status/QA-status-*.md` |
| `release-check` | `docs/sdlc/release-checklist-*.md` |
| `runbook` | `docs/sdlc/runbooks/*.md` |
| `postmortem` | `docs/sdlc/postmortems/*.md` |

### Templates (`templates/`)
`prd`, `user-story`, `adr`, `test-plan`, `defect-report`, `risk-register`, `release-checklist`, `qa-status-report`, `runbook`, `postmortem`. Usable on their own without Claude.

## Example

```text
/sdlc-team-kit:kickoff Add guest checkout to the web store
/sdlc-team-kit:log-defect Pay button unresponsive on iOS 18 Safari when card expires this month
/sdlc-team-kit:qa-status weekly report for build 1.4.2
```

## Validate

```bash
claude plugin validate .
```
