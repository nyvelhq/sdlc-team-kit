# ADR NNNN: <Decision title> (<idea or story ID>)

- Status: Proposed | Accepted | Superseded by ADR NNNN
- Date: YYYY-MM-DD

## Context

What problem forces a decision now. The facts: current behaviour (with
file paths), constraints, and requirements from the brief.

## Decision

What we will do, stated plainly. Include, where they apply:

- **Data model:** new tables/fields and why here rather than elsewhere.
- **Access:** who can read and write what, and where that is enforced.
- **Limits enforced on the server:** lengths, formats, server-set values.
- **Client:** how the app uses it and what happens on failure.
- **Migrations:** file names, and that they are idempotent.

## Consequences

- What must happen before the new code works (e.g. a migration the approver
  runs).
- What changes for users, including anything lost or re-entered.
- New risks or follow-up work.

## Alternatives rejected

- **<Option>:** why not.
