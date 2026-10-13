# How the agent team works

An idea goes in; a reviewed, tested pull request comes out. The approver
(named in `CLAUDE.md`) approves twice: the **design** (before any code) and
the **merge**. Everything else is the team's job.

## The team

Each role is a subagent from the `sdlc-team-kit` plugin, with its own
instructions and only the tools its job needs. The lead (the main session,
or a scheduled orchestrator) runs the stages and talks to the approver; the
subagents never do.

| Role | Agent | Produces | Can change code? |
|---|---|---|---|
| Requirements analyst (BA + PM) | `requirements-analyst` | `docs/ideas/<ID>/brief.md`: problem, users, scope, acceptance criteria, stories | No (docs only) |
| Architect | `architect` | an ADR in `docs/adr/` when the data model, access rules, an integration or the data flow changes | No (docs only) |
| Lead product designer (UX + UI) | `product-designer` | before any code: user flows and screens map, look and feel, then full mockups and a clickable prototype on a design canvas | No |
| Engineer | `engineer` | the code and its tests for one story, committed on `claude/<story-id>` | Yes |
| Code reviewer | `code-reviewer` | findings on the diff, ranked | No (read-only) |
| Security reviewer | `security-reviewer` | findings on access rules, auth, secrets, input, storage | No (read-only) |
| QA engineer | `qa-engineer` | a pass/fail report per acceptance criterion, extra tests, screenshots | Tests only |

The reviewers and QA get the story and the branch, never the engineer's
reasoning, so they judge the code rather than agree with it.

## The pipeline

```
idea ─► 1 Requirements ─► 2 Experience design ─────────────────────────► [Gate 1: approver approves the design]
                          2a flows and screens map  ─► (check-in with the approver)
                          2b look and feel          ─► (approver picks a direction, new products only)
                          2c full mockups + clickable prototype
                          3 Architecture* (while the approver reviews the mockups)
     ─► 4 Build (per story) ─► 5 Review ─► 6 QA ─► 7 Pull request ─► [Gate 2: approver merges]
                                                                       * only when triggered
```

Design comes first, before any technical work: once we know what the idea
is for and who uses it, the designer works out how it will look and flow,
and that approved design is what everyone builds to.

1. **Requirements** (`/idea <text>`, or a GitHub issue from the *Idea*
   template). The analyst writes the brief: problem, who it's for (the
   roles in `CLAUDE.md`), in and out of scope, 3–7 testable acceptance
   criteria per story, risks, and open questions. A question only the
   approver can answer (pricing, legal, brand, money) stops the run and is
   asked; anything else is decided and written down as an assumption. Large
   ideas are split into stories `<ID>.1`, `<ID>.2`, … each small enough for
   one PR. Before design starts, the QA engineer reviews the brief for
   testability (vague criteria, missing negative paths, scope gaps, clashes
   with past ADRs); failures go back to the analyst, at most twice, then to
   the approver.
2. **Experience design**, for anything a person will see: a feature, a
   website, a web app or a mobile app. The designer takes its time and works
   in three passes, all on one design canvas the approver can open, click
   through and comment on:
   - **2a Flows and screens map.** Each person's journey step by step, the
     list of screens and how they connect (the information architecture),
     and rough wireframes with real wording. For M and L ideas the lead
     shows this to the approver first, so the direction can change before
     anything is polished.
   - **2b Look and feel.** For an existing product: its design system (fonts,
     colours, spacing, components; see `CLAUDE.md`); anything new it needs
     is proposed, not slipped in. For a **new product or app**: two or three
     distinct visual directions (typefaces, colour palette, button and card
     style, one sample screen each). The approver picks one, and the
     designer turns it into that product's own design system.
   - **2c Full mockups and prototype.** Every screen, final look: web at
     desktop and phone width; a mobile app phone-first (390×844, plus a
     360px check); light and dark where the product has both; empty,
     loading, error, full and success states; the main flow clickable; and
     notes on interactions (what a tap does, transitions, error messages).
   **Gate 1:** nothing is built until the approver approves. They comment
   on the canvas or reply in chat; `/design <ID>` revises (v2, v3, …) and
   `/design <ID> approve` records the approval in the brief.
3. **Architecture**, only if the idea changes the data model, access rules,
   an integration or the data flow: once the mockups are done, while the
   approver reviews them, the architect works from the flows and drafts an
   ADR and the migration(s) the stories will need. If the approver's
   feedback changes the flows, the ADR is updated before approval.
4. **Build** (`/build <story-id>`): the engineer implements one story on
   `claude/<story-id>`, matching existing patterns and the approved design,
   with unit tests, and runs the checks listed in `CLAUDE.md`. A bug story
   goes test-first: the failing test is committed alone and shown to fail,
   then locked while the engineer fixes the code.
5. **Review:** the code reviewer and the security reviewer run in parallel.
   Blocking findings go back to the engineer. After two rounds anything
   still open is reported in the PR, not hidden.
6. **QA:** checks every acceptance criterion with evidence (see *Evidence
   and approvals* below), adds missing tests, checks accessibility, and
   compares the built screens with the approved mockups (screenshots of the
   running app are QA's tool for this comparison, not a design step), then
   lists what only the approver can verify live.
7. **Pull request:** draft PR with the acceptance criteria, what changed,
   test evidence, the design link, review and QA results, and an "Approver
   must do" list. `docs/agent/STATUS.md` is updated in the same PR.
   **Gate 2:** the approver merges when CI is green.

## Around the pipeline

The same evidence rules apply outside a single story:

- **Bugs** (`/log-defect`): found by QA or reported by a user, written from
  `docs/qa/templates/defect-report.md` into `docs/qa/bugs/`. A bug with no
  observed evidence is *unconfirmed*. Fixing one is an S-size idea.
- **Releases** (`/release-check`): before production, every item on
  `docs/ops/templates/release-checklist.md` needs evidence, there must be a
  rollback trigger, and the approver's go covers one commit.
- **Status** (`/qa-status`): execution and bug counts from evidence only;
  unknown numbers are written as unknown.
- **Incidents:** a postmortem from `docs/ops/templates/postmortem.md`; each
  lasting lesson becomes a project rule in `CLAUDE.md` or a Definition of
  Done box.
- **Risks** that outlive one brief live in `docs/agent/RISKS.md`.

## Sizing: not every idea needs every stage

| Size | Example | Stages |
|---|---|---|
| S | copy fix, small bug, one-file change | Requirements (short) → Build → Review → QA → PR (a small visual change gets one mockup first) |
| M | a new screen or a new action on one | all; design passes 2a and 2c (2b only if the look changes) |
| L | a new area (e.g. billing), a new website or app | all, every design pass, split into stories, one PR per story |

The lead picks the size and says which stages it skipped and why.

## Evidence and approvals

Agents produce work; they never decide that their own work passed.

- **A pass needs evidence:** a green CI check on the pull request's latest
  commit, a named test that proves the criterion, or a result someone
  actually observed (with the command and its output). "Should work" is not
  evidence.
- **Missing means blocked.** If CI didn't run or hasn't finished, a review
  or QA didn't report, or a result can't be checked here, the story is
  blocked, not passed. The PR says so; nothing is reported as done.
- **Approvals are for an exact version.** A design approval is for one
  canvas version (`Design v3 approved…`); if the design changes afterwards,
  the approval no longer counts and the approver approves the new version.
  A production release is approved for one commit; commits merged after
  that wait for the next release.
- **The record is GitHub plus the brief.** Pull requests, CI runs, and
  environment approvals carry who, what and when; the brief carries the
  design approvals. No second log to keep in sync.

## What is enforced, not just asked

Instructions to agents are advice; these rules are checked by code, so they
hold even when a prompt is ignored:

| Rule | Enforced by |
|---|---|
| No push or commit to protected branches (`main`, `master`, `staging`, `production`, the remote default); no force-push | Plugin hook on every shell command, plus deny rules in `.claude/settings.json` |
| No story branch `claude/<ID>.<n>` for a UI story until the brief approves the current design version | Plugin hook (design gate) and `scripts/gate.mjs` in `/build` |
| No writes to `.env`, key or secrets files | Plugin hook, plus deny rules |
| No edits to a bug's failing test while it is locked | Plugin hook reading `.claude/sdlc-locks/tests` |
| Merge only by the approver | Branch protection on GitHub (set it up: require a PR and passing checks on the default branch) |

The hooks match the commands agents normally write. They are a guardrail,
not a security boundary: someone determined can work around them, which is
why the merge gate stays with a human and branch protection.

## Where things live

- `docs/ideas/<ID>/brief.md`: the brief, the stories, the design link and
  version, the approval line, and links to the PRs.
- `docs/adr/NNNN-*.md`: decisions.
- The design canvas: a private Claude Design artifact (or the tool
  `CLAUDE.md` names), linked from the brief. The approver can comment on any
  artboard.
- `docs/agent/STATUS.md`: the queue. Each story becomes a queue item.
- `docs/agent/RISKS.md`: project-level risks.
- `docs/qa/bugs/`, `docs/qa/status/`: bug reports and QA status reports.
- `docs/ops/releases/`: release checklists, one per release.

## What the team can't do

- Decide product, pricing, legal, brand or spending questions. It asks.
- Verify things only a real account or dashboard shows (a live sign-in,
  hosting or database console settings). Those go on the "Approver must
  do" list.
- Guarantee correctness. Reviews, QA and CI lower the risk; the approver
  still reads the PR summary before merging, and auth, access-rule and money
  changes are always flagged for a closer look.

## Cost

Every stage is a model run. A full M-size idea runs six or seven agents; an
S-size fix runs four. Use the sizing table rather than running everything
for a typo.
