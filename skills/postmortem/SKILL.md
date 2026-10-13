---
name: postmortem
description: Write a blameless incident postmortem with timeline, root cause, and owned action items. Use after a production incident, escaped defect, or failed release.
---

# Write a postmortem

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/postmortem.md`.
2. Build the timeline from logs, chat exports, or notes the user provides; include timezone. Mark any reconstructed time as approximate.
3. Separate the trigger from the underlying cause. Keep language blameless — describe systems and decisions, not people.
4. Every action item has an owner, a due date, and a type (prevent / detect / mitigate).
5. Add any new risk to the risk register.
6. Save to `docs/sdlc/postmortems/YYYY-MM-DD-<slug>.md`.
