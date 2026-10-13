---
name: write-stories
description: Break a PRD or feature description into INVEST user stories with Gherkin acceptance criteria and a traceability table. Use when requirements need to become buildable, testable stories.
---

# Write user stories

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/user-story.md` and the PRD (default `docs/sdlc/prd.md`).
2. Create one story per user-visible behavior. Each Must requirement maps to at least one story.
3. Write acceptance criteria as Given/When/Then: happy path, at least one negative path, and relevant edge cases. Add non-functional criteria (accessibility, performance, security) where they apply.
4. Save each story as `docs/sdlc/stories/US-NNN-<slug>.md`.
5. Write `docs/sdlc/stories/traceability.md`: requirement → story → test case (test cases may be TBD).
6. Report any requirement with no story, and any ambiguity, as open questions.
