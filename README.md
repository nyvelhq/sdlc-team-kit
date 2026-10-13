# sdlc-team-kit

A design-first agent team for [Claude Code](https://code.claude.com). An idea goes in; a reviewed, tested pull request comes out. A human approver signs off twice: the **design** before any code, and the **merge**. Everything in between is done by seven subagents, and nothing counts as passed without evidence.

```
idea ─► Requirements ─► Design (flows → look and feel → mockups + prototype) ─► [Gate 1: approver approves the design]
     ─► Architecture* ─► Build ─► Code + security review ─► QA ─► Draft PR ─► [Gate 2: approver merges]
                                                                     * only when the data model, access rules or an integration change
```

## Install in a new repo

1. **Add the marketplace and install the plugin** (from your shell, once per machine):

   ```bash
   claude plugin marketplace add nyvelhq/sdlc-team-kit
   claude plugin install sdlc-team-kit@nyvel
   ```

   Inside Claude Code you can do the same with `/plugin marketplace add nyvelhq/sdlc-team-kit`, then `/plugin install sdlc-team-kit@nyvel`.

2. **Set up the repo.** Open Claude Code in the repo root and run:

   ```text
   /sdlc-team-kit:kit-init <approver name>
   ```

   Claude Code always prefixes plugin commands with the plugin name, so this is the full form (typing "run kit-init" in plain words also works). It copies in the process docs and templates, skips any file you already have, adds short `/idea`, `/design` and `/build` aliases to the repo, and writes a starter `CLAUDE.md` with the commands it finds in your repo.

3. **Fill in `CLAUDE.md`.** Everything specific to your project lives there: the approver, user roles, stack, real lint/test/build commands, design system link, branch and staging setup, and project rules (e.g. how to run migrations, query patterns that caused incidents). `kit-init` lists the placeholders it couldn't fill.

4. **Commit the new files**, then start your first idea:

   ```text
   /idea Let admins export the user list as CSV
   ```

To try the plugin without installing it: `claude --plugin-dir /path/to/sdlc-team-kit`.

## Commands

After `kit-init`, the short names below work in that repo. The plugin's own names are `/sdlc-team-kit:idea`, `/sdlc-team-kit:design` and `/sdlc-team-kit:build`.

| Command | What it does |
|---|---|
| `/sdlc-team-kit:kit-init [approver]` | Installs the docs and templates below into the current repo and drafts `CLAUDE.md` |
| `/idea <text or #issue>` | Requirements → design → architecture; opens a draft `<ID>: brief and design` PR; stops at Gate 1 |
| `/design <ID> [feedback]` | Revises the mockups (v2, v3, …) and withdraws any earlier approval |
| `/design <ID> approve` | Records `Design v<N> approved by <approver> on <date>` in the brief — only on the approver's own words |
| `/build <story-id>` | Engineer → parallel code and security review (max two rounds) → QA → draft PR; waits for CI; never merges |

## Agents

| Agent | Produces | Changes code? |
|---|---|---|
| `requirements-analyst` | `docs/ideas/<ID>/brief.md`: problem, users, scope, stories, acceptance criteria | No |
| `product-designer` | Flows and screens map, look and feel, full mockups and a clickable prototype on a design canvas | No |
| `architect` | An ADR and migration plan, only when triggered | No |
| `engineer` | Code and tests for one story on `claude/<story-id>` | Yes |
| `code-reviewer` | Ranked findings on the diff | No (read-only) |
| `security-reviewer` | Ranked findings on access rules, auth, secrets, input, storage | No (read-only) |
| `qa-engineer` | Pass / fail / blocked per acceptance criterion, with evidence | Tests only |

Reviewers and QA get the story and the branch, never the engineer's reasoning.

## What `kit-init` installs

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Per-project briefing (approver, roles, stack, commands, design, project rules) |
| `docs/agent/SDLC.md` | Pipeline, the two gates, sizing table (S/M/L), evidence and approvals |
| `docs/agent/RULES.md` | Hard rules for every agent |
| `docs/agent/STATUS.md` | Queue / backlog |
| `docs/ideas/_template/brief.md` | Brief: problem, users, scope, stories, acceptance criteria, design link, approval line, PRs |
| `docs/adr/0000-template.md` | ADR |
| `docs/qa/DEFINITION_OF_DONE.md` | Exit criteria |
| `docs/qa/TEST_PLAN.md` | Test plan |
| `docs/qa/UI_REVIEW_CHECKLIST.md` | UI review checklist |
| `.github/pull_request_template.md` | PR template with evidence table and approver sign-off |
| `.github/ISSUE_TEMPLATE/idea.yml` | GitHub Idea issue form that feeds `/idea` |
| `.claude/skills/{idea,design,build}/` | Short aliases for the plugin's skills |

## The rules that don't bend

- **Two human gates.** No code for a UI story without a recorded design approval for the current version; no merge except by the approver.
- **Approvals are for an exact version.** Changing the design withdraws the approval.
- **Missing evidence = blocked.** A pass needs a green CI check on the latest commit, a named test, or an observed result. Anything pending, unrun or unknown is reported as blocked, never as done.
- **Agents never decide their own work passed**, never push to the default branch, and never run migrations against production.

## Requirements and notes

- The designer defaults to Claude Design artifacts for the canvas. Where those aren't available, name your design tool in `CLAUDE.md`.
- Draft PRs and CI checks use GitHub.
- Every stage is a model run. An M-size idea runs six or seven agents; use the sizing table rather than the full pipeline for a typo.

## Validate

```bash
claude plugin validate . --strict
```
