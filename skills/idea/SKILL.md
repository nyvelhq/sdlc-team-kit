---
name: idea
description: Start a new idea (a feature, or a new website or app) through the agent team — requirements, then design (flows, look and feel, mockups and a clickable prototype), then architecture — and stop for the approver's design approval before any code. Use when the approver describes a new feature, idea or change, or points to a GitHub issue made from the Idea template.
argument-hint: <the idea in plain words, or a GitHub issue number>
---

# /idea — from an idea to an approved design

You are the lead. You run the stages in `docs/agent/SDLC.md`, delegate each
to its subagent with the Agent tool (the agents come from this plugin, so
they may be listed as `sdlc-team-kit:<name>`), and you are the only one who
talks to the approver named in `CLAUDE.md`. Read `CLAUDE.md`,
`docs/agent/RULES.md` and `docs/agent/SDLC.md` first. If they don't exist,
stop and tell the approver to run `/sdlc-team-kit:kit-init`.

1. **Take the idea.** From the arguments, or the GitHub issue they name.
   Pick an ID: a short prefix for the area plus the next free number in
   `docs/agent/STATUS.md` (e.g. `PAY-01`, `ONB-03`); check no open PR or
   `docs/ideas/` folder already uses it.
2. **Requirements:** run `requirements-analyst` with the idea, the ID and
   the folder `docs/ideas/<ID>/`. If it returns *blocking* questions for the
   approver, ask them now (all at once, numbered, each with your recommended
   answer) and stop until they answer.
3. **Brief review:** run `qa-engineer` in brief-review mode with only the
   brief path (not the analyst's reasoning). On FAIL, send its blocking
   issues back to `requirements-analyst` and review again; after two failed
   rounds, stop and put the open issues to the approver. Record the result
   under **Brief review** in the brief.
4. **Size it** (S/M/L, `SDLC.md`) and say which stages you'll skip and why.
5. **Design, before anything technical:** if a person will see the change,
   run `product-designer` with the brief.
   - M and L ideas: it returns after pass 2a (flows and screens map). Show
     the approver the canvas link and a short summary and wait for "go on"
     or changes; then run `product-designer` again for 2b and 2c.
   - New product or app: after 2b it returns two or three visual
     directions. Ask the approver to pick one, then run it again to finish.
6. **Architecture:** if the brief's triggers say so, run `architect` with
   the brief and the design link (it works from the flows).
7. **Record:** add each story to `docs/agent/STATUS.md`'s queue as
   "awaiting design approval" (or "ready" for S-size or no-UI stories). Put
   the brief, ADR and STATUS changes on branch `claude/<ID>-brief` and open
   a draft PR titled `<ID>: brief and design` so the plan is reviewable.
8. **Report to the approver,** short: the stories with sizes, the canvas
   link, the key design decisions, assumptions made, non-blocking
   questions, and what to do next: comment on the canvas or reply, then
   `/design <ID>` to revise or `/design <ID> approve`, then `/build <ID>.1`.

Never write application code in this command.
