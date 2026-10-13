# <ID>: <short name>

| Field | Value |
|---|---|
| Size | S / M / L |
| Status | drafting / awaiting design approval / ready / in build / done |
| Issue | #<n> (if started from an Idea issue) |

## 1. Idea

> <The requester's words, unedited.>

## 2. Problem and who it's for

<Which role(s) from CLAUDE.md, and what they can't do today. Quote file
paths for current behaviour.>

## 3. Scope

**In**
-

**Out**
-

## 4. Stories

### <ID>.1 — <title>
- **Story:** As a <role>, I want <capability> so that <benefit>.
- **Type:** feature / bug · **Size:** S / M / L · **Depends on:** —
- **Acceptance criteria:**
  1. Given <context>, when <action>, then <observable result>.
  2.
  3.

### <ID>.2 — <title>
-

## 5. Triggers

- Architect needed (data model, access rules, integration, data flow): yes / no — why
- Designer needed (a user sees it): yes / no   <!-- keep this exact wording; the design gate reads it -->

- Flag for the approver (auth, payments, personal data): yes / no — why

## 6. Assumptions

-

## 7. Questions for the approver

1. <Question> — *blocking / non-blocking* — recommended answer: <…>

## 8. Risks

-

## Brief review

<!-- Filled by the lead from qa-engineer's brief review: PASS, or the blocking issues and how they were fixed. -->

## Design

<!-- Filled by product-designer: a line "**Version:** v<N>" (bumped on every revision; the gate reads the last one), the canvas link, what each pass contains, key decisions, design questions. -->

## Approval

<!-- Only the lead writes this, only on the approver's own words, one line per event, exactly:
Design v<N> approved by <approver> on <YYYY-MM-DD> — <canvas link>
Approval withdrawn: design changed to v<N>
The plugin's hook reads the last line: no code branch for a UI story until it approves the current version. -->

## Pull requests

<!-- <story-id>: <PR link> -->
