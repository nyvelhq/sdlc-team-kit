---
name: release-check
description: Audit a release against its checklist — evidence for every item, a rollback plan, and a go / no-go recommendation for the approver. Use before a production deploy, a staging-to-production promotion, or an app store submission.
argument-hint: <version or release commit>
---

# release-check — is this exact commit ready?

Read `CLAUDE.md`, `docs/agent/RULES.md` and
`docs/ops/templates/release-checklist.md` (if missing, use
`${CLAUDE_PLUGIN_ROOT}/templates/project/docs/ops/templates/release-checklist.md`).

1. Pin the release to one commit. The approver's go covers that commit only;
   anything merged after it waits for the next release.
2. Work out what's included (merged PRs since the last release, the stories
   in `docs/agent/STATUS.md`).
3. Check every readiness item against evidence: CI runs on the release
   commit, QA reports, open bugs in `docs/qa/bugs/`, security findings,
   migrations, the approval lines in each brief. Tick only with a link.
   Missing, pending or unknown = open, and the release is **blocked** on it.
4. Require a concrete rollback trigger and steps. If rollback was never
   rehearsed, say so.
5. Save to `docs/ops/releases/<version>.md` on a `claude/release-<version>`
   branch and open a draft PR.
6. Report to the approver: go / no-go recommendation, every open blocker,
   and what only they can do (run migrations, approve the deploy).

Never deploy, tag, run migrations or push to a protected branch. The go and
the deploy belong to the approver.
