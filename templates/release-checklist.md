# Release Checklist: <Version>

| Field | Value |
|---|---|
| Release owner | |
| Target date | |
| Go / No-go decision | Pending / Go / No-go (by whom, when) |

## Readiness
- [ ] All in-scope stories meet acceptance criteria
- [ ] QA exit criteria met (link test summary)
- [ ] No open Critical/High defects without an approved waiver
- [ ] Security review complete; findings resolved or accepted
- [ ] Accessibility checks passed for changed flows
- [ ] CI green on the release commit (build, lint, tests, dependency scan)
- [ ] Database migrations reviewed and reversible (or backup taken)
- [ ] Feature flags and config set per environment
- [ ] Release notes / changelog written
- [ ] Monitoring and alerts in place for new functionality
- [ ] Support / stakeholders notified

## Deployment
- [ ] Deploy to staging and smoke test
- [ ] Deploy to production (window: )
- [ ] Production smoke test
- [ ] Mobile: store submission / phased rollout percentage set

## Rollback plan
- Trigger: (e.g., error rate > X% for Y minutes, Critical defect in core flow)
- Steps:
- Owner:
- Tested on: YYYY-MM-DD

## Post-release
- [ ] Watch metrics for <N> hours
- [ ] Close release ticket; schedule retro
