---
name: test-plan
description: Write a test plan and derive test cases from user stories and acceptance criteria, covering functional, regression, accessibility, security, and platform scope. Use when planning QA for a feature, release, or client engagement.
---

# Write a test plan

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/test-plan.md`, the PRD, and the stories.
2. Confirm platform scope (browsers, iOS/Android versions, devices). If unknown, ask once; otherwise record an assumption.
3. Derive test cases from each acceptance criterion using equivalence partitioning, boundary values, and negative paths. Give each an ID (TC-NNN) and trace it to a story.
4. Include accessibility (WCAG 2.1 AA) and basic security checks by default.
5. Mark which cases are automation candidates (stable, high-value, repeated).
6. Set concrete, measurable entry and exit criteria.
7. Save to `docs/sdlc/test-plan.md` and update `docs/sdlc/stories/traceability.md` with the TC IDs.
8. Report any story with no test coverage.
