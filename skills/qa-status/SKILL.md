---
name: qa-status
description: Produce a short QA status report for the approver, stakeholders or a client — execution counts, bugs by severity, risks, and a recommendation backed by evidence. Use for daily, weekly or end-of-cycle QA updates.
argument-hint: <period, build or commit>
---

# qa-status — where quality stands, honestly

Read `CLAUDE.md` and `docs/qa/templates/qa-status-report.md` (if missing,
use `${CLAUDE_PLUGIN_ROOT}/templates/project/docs/qa/templates/qa-status-report.md`).

1. Pull numbers from evidence: QA reports in merged and open PRs, CI runs,
   `docs/qa/bugs/`, `docs/agent/STATUS.md`, `docs/agent/RISKS.md`. Never
   estimate a count; if a number isn't available, write "unknown" and why.
2. Not run or not observable = **blocked**, never pass.
3. Overall status is 🔴 if any exit criterion can't be met on schedule.
4. Lead with the recommendation and the one reason that drives it; keep the
   summary to three bullets.
5. Save to `docs/qa/status/<YYYY-MM-DD>.md`, or output it ready to paste
   into email or Slack if asked. Don't send it anywhere yourself.
