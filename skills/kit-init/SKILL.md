---
name: kit-init
description: Set up the SDLC team kit in the current repository — copy in the process docs, templates, PR and issue templates, short /idea /design /build aliases, and a starter CLAUDE.md filled in for this project. Use when the user says "kit-init", "kit init", "set up the sdlc kit", or when /idea or /build finds docs/agent/SDLC.md missing.
argument-hint: [approver name]
---

# kit-init — install the kit into this repo

Invoked as `/sdlc-team-kit:kit-init` (plugin skills keep their prefix).

Work from the repository root (`git rev-parse --show-toplevel`). Never
overwrite an existing file without asking.

## 1. Copy the templates

Run this as one command (it works on macOS and Linux, and never overwrites):

```bash
SRC="${CLAUDE_PLUGIN_ROOT}/templates/project"; DST="$(git rev-parse --show-toplevel)"; (cd "$SRC" && find . -type f) | while IFS= read -r f; do if [ -e "$DST/$f" ]; then echo "skipped $f"; else mkdir -p "$DST/$(dirname "$f")" && cp "$SRC/$f" "$DST/$f" && echo "created $f"; fi; done
```

Report the skipped files; don't merge them unless the user asks.

This installs:

| Path | What it is |
|---|---|
| `CLAUDE.md` | Project briefing: approver, roles, stack, commands, design system, project rules |
| `docs/agent/SDLC.md` | The pipeline, the two gates, sizing, evidence and approvals |
| `docs/agent/RULES.md` | Hard rules every agent follows |
| `docs/agent/STATUS.md` | The queue / backlog |
| `docs/ideas/README.md`, `docs/ideas/_template/brief.md` | One folder per idea; the brief template |
| `docs/adr/0000-template.md` | ADR template |
| `docs/qa/DEFINITION_OF_DONE.md` | Exit criteria for every change |
| `docs/qa/TEST_PLAN.md` | Test plan template |
| `docs/qa/UI_REVIEW_CHECKLIST.md` | UI review checklist |
| `.github/pull_request_template.md` | PR template with evidence and approver sections |
| `.github/ISSUE_TEMPLATE/idea.yml` | GitHub Idea issue form that feeds `/idea` |
| `.claude/skills/{idea,design,build}/SKILL.md` | Short aliases so `/idea`, `/design`, `/build` work without the `sdlc-team-kit:` prefix |

If the repo already has its own `idea`, `design` or `build` skill, it is
skipped; tell the user those names will run their existing skill and the
kit's versions are `/sdlc-team-kit:idea` etc.

## 2. Fill in CLAUDE.md

If `CLAUDE.md` was just created, replace its `<...>` placeholders using
what you can verify in the repo:

- **Commands:** read `package.json` scripts, `Makefile`, `pyproject.toml`,
  `Cargo.toml`, `go.mod` or CI workflows (`.github/workflows/`) and fill in
  the real install, lint, test and build commands. Leave a placeholder for
  anything you can't find; never guess a command.
- **Stack and layout:** from the manifest and top-level folders.
- **Approver:** the argument, or ask once. Ask, too, for the user roles
  (e.g. customer, admin) and the design system link if there is one. Leave
  placeholders for what the user doesn't know yet.

If `CLAUDE.md` already existed, don't rewrite it. Show the user the kit's
sections (`Approver`, `User roles`, `Commands`, `Design`, `Project rules`)
that their file lacks and offer to append them.

## 3. Report

List created and skipped files, the placeholders still to fill in
`CLAUDE.md`, and the next step: commit these files, then
`/idea <your first idea>`. Don't commit or push unless the user asks.
