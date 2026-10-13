# Release <version>: checklist

| Field | Value |
|---|---|
| Release commit | `<sha>` — approval covers this exact commit only |
| Approver go / no-go | Pending / Go / No-go — `<approver>`, `<date>`, in their own words |
| Target window | |
| Stories included | `<ID>.<n>` (PR #), … |

Tick an item only with evidence (link it). No evidence = open = **blocked**.

## Readiness
- [ ] Every included story's PR merged by the approver with CI green on its last commit
- [ ] CI green on the release commit (lint, tests, build, plus the project's other checks)
- [ ] QA exit criteria met (`docs/qa/DEFINITION_OF_DONE.md`); QA reports linked
- [ ] No open Critical/High bugs, or each has a written waiver from the approver
- [ ] Security review findings resolved or accepted by the approver
- [ ] UI matches the approved design versions; accessibility checks passed
- [ ] Migrations listed, reviewed, idempotent, and a backup or reverse path exists
- [ ] Config, env vars and feature flags set per environment (listed, not pasted)
- [ ] Release notes / changelog written
- [ ] Monitoring and alerts cover what changed

## Deploy (approver or the person they name)
- [ ] Staging deployed and smoke-tested (link result)
- [ ] Migrations run by the approver
- [ ] Production deployed
- [ ] Production smoke test (link result)
- [ ] Mobile: store submission / phased rollout % set

## Rollback
- Trigger: <e.g. error rate above X% for Y minutes, a Critical bug in a core flow>
- Steps: <exact commands or console actions>
- Owner:
- Last rehearsed: <YYYY-MM-DD, or "not rehearsed" — say so>

## After release
- [ ] Watch metrics for <N> hours
- [ ] Update `docs/agent/STATUS.md`
- [ ] Postmortem opened if the rollback trigger fired (`docs/ops/templates/postmortem.md`)
