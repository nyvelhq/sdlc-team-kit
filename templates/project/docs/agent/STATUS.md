# Agent status

The source of truth for the agent team and any orchestrator. Read at the
start of every run and updated in the same PR whenever a queue item moves.

_Last updated: <YYYY-MM-DD> (<what changed>)._

## Current state

- <What is live and working, in a few bullets.>
- <Anything pending the approver (migrations to run, settings to change).>
- Staging mode: <off | on — see CLAUDE.md>.

## Queue

Statuses: `awaiting design approval` · `ready` · `in progress` · `in PR` ·
`blocked` · `done`. Work top to bottom unless the approver reorders.

| # | ID | Story | Size | Status | Brief / PR |
|---|---|---|---|---|---|
| 1 | <ID>.1 | <one line> | S/M/L | ready | `docs/ideas/<ID>/brief.md` |

## Approver-owned

Decisions or dashboard work, not code. Done in parallel by the approver.

- [ ] <…>

## Blocked (skip)

| ID | Blocked on | Since |
|---|---|---|

## PR log

| Date | PR | Story | Result |
|---|---|---|---|
