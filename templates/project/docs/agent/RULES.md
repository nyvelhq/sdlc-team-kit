# Agent rules

These are the operating rules for the agent team (and any autonomous
orchestrator) working on this repo. They are read at the start of every run
alongside `CLAUDE.md` and `docs/agent/STATUS.md`. How the team is organised
(roles, stages, the design and merge gates, the `/idea`, `/design` and
`/build` commands): `docs/agent/SDLC.md`. Project-specific rules live under
**Project rules** in `CLAUDE.md` and carry the same weight as these.

## Role passes

Always run these:

1. **BA** — write 3-7 testable acceptance criteria.
2. **SWE** — implement the smallest change that matches existing patterns.
3. **Security** — review access rules, auth, secrets and input handling.
4. **QA** — the checks under **Commands** in `CLAUDE.md` (at least install,
   tests and build) must pass. If they fail, fix it or stop and report.

Add these only when triggered:

- **Architect** — runs before SWE if the item changes the data model,
  access rules, an integration or the data flow. Write a short ADR in
  `docs/adr/`.
- **Design** — runs before SWE for anything a user sees: the
  `product-designer` makes mockups on a design canvas built on the
  project's design system, and the approver approves them before any code
  (the design gate). Run a WCAG 2.1 AA check after SWE. Queue items from
  before the kit was installed (no `docs/ideas/<ID>/brief.md`) follow their
  own description instead.
- **DevOps** — for CI/CD, env vars, hosting config, monitoring.
- **Copy** — for marketing text. Keep it honest: no fabricated claims, logos
  or metrics.

## Hard rules

- Never push to or merge into the default branch. Only use `claude/`
  branches and PRs. Never label a PR `hotfix` yourself.
- If `CLAUDE.md` says staging mode is on, base `claude/` branches on
  `staging` and open PRs against it.
- Never run SQL or migrations against production. Put migrations in the
  project's migrations folder and list them under "Approver must do".
- If a change touches auth or access rules in a way CI can't verify, stop
  and report instead of guessing.
- Report honestly: mark anything you inferred rather than verified.
- Never write code for a UI story whose brief has no design approval line,
  and never write that line without the approver's own words approving it.
  An approval is for one design version; a later change needs a new one.
- Never report something as passed without evidence: a green CI check on
  the PR's latest commit, a named test, or an observed result. A missing,
  pending or unknown result is **blocked**, not passed, and the PR says so.
- Never put secrets, tokens or real credentials in code, docs or commits.
- Check for an open PR on an item before starting it, not just at the top of
  a run; another session may have opened one.
