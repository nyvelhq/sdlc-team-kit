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
| `docs/agent/RISKS.md` | Project risk register |
| `docs/qa/templates/defect-report.md`, `docs/qa/templates/qa-status-report.md` | Bug report and QA status templates |
| `docs/ops/templates/release-checklist.md`, `docs/ops/templates/postmortem.md` | Release checklist with rollback, blameless postmortem |
| `.github/pull_request_template.md` | PR template with evidence and approver sections |
| `.claude/settings.json` | Permission deny rules backing the hard rules |
| `.github/ISSUE_TEMPLATE/idea.yml` | GitHub Idea issue form that feeds `/idea` |
| `.claude/skills/{idea,design,build,log-defect,release-check,qa-status}/SKILL.md` | Short aliases so these work without the `sdlc-team-kit:` prefix |

If the repo already has a skill with one of those names, it is skipped; tell
the user that name will run their existing skill and the kit's version is
`/sdlc-team-kit:<name>`.

## 2. Guardrails

- `.claude/settings.json` holds permission deny rules (force-push, push to
  `main`/`master`, `git reset --hard`, editing `.env`/key files). If the
  repo already had a `.claude/settings.json` (so the copy skipped it), show
  the user the kit's `permissions.deny` entries and offer to merge them in;
  don't merge without a yes.
- Append `.claude/sdlc-locks/` to `.gitignore` if it isn't there (create
  `.gitignore` if needed). It holds the temporary test lock used by `/build`
  for bug fixes.
- The plugin's own hooks (protected branches, design gate, secrets, locked
  tests) need `node` on the PATH, which Claude Code already requires. Check
  with `node --version`.

## 3. Fill in CLAUDE.md

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

## 4. Report

List created and skipped files, the placeholders still to fill in
`CLAUDE.md`, and the next step: commit these files, then
`/idea <your first idea>`. Don't commit or push unless the user asks.
