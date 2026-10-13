---
name: qa-status
description: Produce a concise QA status report for stakeholders or clients — execution numbers, defect counts by severity, risks, and a release recommendation. Use for daily, weekly, or end-of-cycle QA updates.
---

# QA status report

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/qa-status-report.md`.
2. Pull numbers from the test plan, defect files in `docs/sdlc/defects/`, or data the user supplies. Do not estimate counts — if a number is unknown, say so.
3. Pick the overall status honestly: Blocked if any exit criterion can't be met on schedule.
4. Lead with the release recommendation and the single reason that drives it.
5. Keep the summary to three bullets; detail goes in the tables.
6. Save to `docs/sdlc/status/QA-status-YYYY-MM-DD.md`, or output for email/Slack if asked.
