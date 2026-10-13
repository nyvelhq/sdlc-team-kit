---
name: design
description: Revise or approve the mockups for an idea. Use when the approver gives feedback on a design canvas, says "revise <ID>", or approves a design ("approve <ID>", "/design <ID> approve").
argument-hint: <ID> [approve | feedback in plain words]
---

# /design — the design gate (Gate 1)

Read `CLAUDE.md` and `docs/ideas/<ID>/brief.md` (its **Design** section
holds the canvas link and version). The approver is the person named in
`CLAUDE.md`.

**Revise** (anything other than `approve`): run `product-designer` with the
brief path, the canvas link, and the approver's words. It reads the canvas
comments itself. When it returns, update the brief's Design section (a new
`**Version:** v<N>` line, what changed) on the `claude/<ID>-brief` branch, push, and send the
approver the link and a three-line summary of what changed.

If the brief already has an approval line for an earlier version, revising
replaces it with `Approval withdrawn: design changed to v<N>`, and the
stories go back to "awaiting design approval".

**Approve** (`/design <ID> approve`, or the approver clearly says the design
is approved): only on the approver's own words in this conversation, never
on a comment from anyone else and never inferred. Write under **Approval**
in the brief, on its own line and in exactly this form:
`Design v<N> approved by <approver> on <YYYY-MM-DD> — <canvas link>`, where
`<N>` is the last `**Version:**` in the Design section. Then confirm the gate
opens: `node "${CLAUDE_PLUGIN_ROOT}/scripts/gate.mjs" <ID>.1` must print
`GATE OPEN`. Mark the stories "ready" in `docs/agent/STATUS.md`; push. Then
tell the approver the first story to build (`/build <ID>.1`).
