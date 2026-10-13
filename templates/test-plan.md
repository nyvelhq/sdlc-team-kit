# Test Plan: <Product / Release>

| Field | Value |
|---|---|
| QA owner | |
| Version | |
| Last updated | YYYY-MM-DD |

## 1. Scope
**In scope:** features, platforms (web browsers, iOS/Android versions, devices).
**Out of scope:**

## 2. Test approach
| Level / type | Approach | Tools | Automated? |
|---|---|---|---|
| Unit | Owned by engineering | | Yes |
| API / integration | | | |
| UI / end-to-end | | | |
| Regression | | | |
| Accessibility (WCAG 2.1 AA) | Automated scan + manual keyboard and screen reader | | Partial |
| Security | OWASP Top 10 / MASVS checks | | Partial |
| Performance | | | |
| Exploratory | Charter-based sessions on new / risky areas | | No |
| Beta / UAT | | | No |

## 3. Environments and test data
Environments, URLs/builds, accounts, data setup and cleanup.

## 4. Entry criteria
- Build deployed to test environment and smoke test passes
- Stories meet definition of ready with acceptance criteria

## 5. Exit criteria
- 100% of Must-priority test cases executed
- No open Critical or High defects without an approved waiver
- Pass rate ≥ <N>% on regression
- Accessibility: no unresolved WCAG 2.1 AA failures on in-scope flows

## 6. Test cases
| TC ID | Traces to | Title | Steps | Expected result | Priority | Status |
|---|---|---|---|---|---|---|

## 7. Risks and mitigations
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|

## 8. Schedule and roles
| Activity | Owner | Start | End |
|---|---|---|---|

## 9. Deliverables
Test cases, defect log, status reports, sign-off.
