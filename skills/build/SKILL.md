---
name: build
description: Build one approved story end to end — engineer, independent code and security review, QA — and open a draft PR for the approver to merge. Use when the approver says "/build <story-id>" or "build <story-id>".
argument-hint: <story-id, e.g. PAY-01.1>
---

# /build — from an approved story to a pull request

Read `CLAUDE.md`, `docs/agent/RULES.md`, `docs/agent/SDLC.md` and
`docs/ideas/<ID>/brief.md`. The approver is the person named in `CLAUDE.md`.
Agents may be listed as `sdlc-team-kit:<name>`.

1. **Check the gate.** Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/gate.mjs" <story-id>`.
   `GATE CLOSED` means stop: send the approver the reason and the canvas
   link. (The plugin's hook also refuses to create the `claude/<story-id>`
   branch while the gate is closed.) Check the story is "ready" and that no
   open PR already covers it.
2. **Base branch:** the one `CLAUDE.md` names (for example `staging` when
   staging mode is on), else the default branch. Create `claude/<story-id>`
   from it.
3. **Engineer:** run `engineer` with the story, the brief path, the ADR (if
   any), the design link and the branch.
   **Bug stories (Type: bug) go test-first, in two steps:**
   a. Run `engineer` to write only the failing test(s) that reproduce the
      bug, and commit them alone. Run the test yourself and confirm it
      fails for the reason in the bug report; record the command and output.
      If it passes, the bug isn't reproduced: stop and report.
   b. Lock those test files: write their repo-relative paths, one per line,
      to `.claude/sdlc-locks/tests` (gitignored; the plugin's hook then
      blocks edits to them). Run `engineer` again for the fix, telling it the
      tests are locked and the code must change, not the test. When QA has
      passed, delete the lock file. Pass the test commit's SHA to the
      reviewers and QA.
4. **Review, in parallel:** run `code-reviewer` and `security-reviewer`
   with only the story, the brief path, the base and the branch (and, for a
   bug, the failing-test commit SHA), not the engineer's report. Send blocker and major findings back to `engineer`;
   then review again. Stop after two rounds and carry what's left into the
   PR.
5. **QA:** run `qa-engineer` with the story, brief path, design link, base
   and branch. A failed criterion goes back to `engineer` once; anything
   still failing goes in the PR as a known issue. If an auth or access-rule
   change can't be verified by CI, stop and ask the approver (`RULES.md`).
6. **Pull request:** run the checks under **Commands** in `CLAUDE.md`
   yourself once more, push, and open a **draft** PR using
   `.github/pull_request_template.md`: summary, acceptance criteria with QA
   results, test evidence, design link and any differences, review findings
   and how each was handled, migrations, and "Approver must do / verify
   live". In the same PR, mark the story "in PR" in `docs/agent/STATUS.md`
   and add the PR link to the brief's **Pull requests** section.
   Then wait for CI on the PR's latest commit. Green: say so with the run
   link. Red: back to `engineer` as a failure, fix, push, check again.
   Still running when you must stop, or didn't run: report the PR as
   **blocked on CI**, never as done.
7. **Report to the approver** in five lines or fewer: the PR link, what it
   does, what's left for them, and the next story.

Never merge. Merging is Gate 2 and belongs to the approver.
