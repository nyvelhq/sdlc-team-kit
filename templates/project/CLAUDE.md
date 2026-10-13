# <Project name>: briefing for every agent

Read this first. Then read `docs/agent/RULES.md` (hard rules, not optional)
and, for a new idea or feature, `docs/agent/SDLC.md` (how the team works).

This file holds everything specific to this project. The process docs in
`docs/agent/` are generic and refer back here.

## What it is

<One paragraph: what the product does and for whom.>

## Approver

**<Name>** is the owner and only approver. They approve every design
(Gate 1) and merge every pull request (Gate 2). Wherever the docs say
"the approver", it means them.

## User roles

| Role | What they do |
|---|---|
| <e.g. customer> | <…> |
| <e.g. admin> | <…> |

## Stack and layout

- <Framework, language, styling, backend/database, hosting.>
- `<path>`: <what lives there>
- `<path>`: <data-access layer, if any>
- `<path>`: <migrations folder, if any>
- Docs: `docs/adr/` (decision records), `docs/qa/` (test plan, Definition of
  Done, UI review checklist), `docs/agent/STATUS.md` (backlog and state),
  `docs/ideas/<ID>/` (one folder per idea: brief, stories, design link).

## Commands

| What | Command | Notes |
|---|---|---|
| Install | `<…>` | |
| Lint | `<…>` | |
| Unit tests | `<…>` | |
| Build | `<…>` | |
| Database / access-rule tests | `<…>` | optional |
| E2E | `<…>` | optional |
| Screenshots | `<…>` | optional; used by QA to compare with mockups |

The Definition of Done requires lint, tests and build to pass.

## Branches

- Feature branches: `claude/<story-id>`; PR base: `<main | staging>`.
- <Staging mode: on/off. If on, base branches and PRs on `staging`.>

## Design

- Design system: <link, or "none yet — the designer creates one for new products">.
- Design tool for mockups: Claude Design artifacts (default) <or Figma, etc.>.
- <Tokens / theme file in code, and anything unusual about it.>
- <Colour roles: brand, action, attention, error.>
- <Themes: light/dark; which pages are single-theme.>
- Everything works at 390px wide and meets WCAG 2.1 AA (text 4.5:1). See
  `docs/qa/UI_REVIEW_CHECKLIST.md`.
- Honesty: no fabricated numbers, logos, testimonials or claims anywhere a
  user can see them. Missing data is an honest empty state.

## Project rules

Rules specific to this codebase, on top of `docs/agent/RULES.md`. Add one
whenever an incident or review teaches the team something.

- <e.g. how to run migrations, client-side env handling, query patterns
  that must be followed.>
