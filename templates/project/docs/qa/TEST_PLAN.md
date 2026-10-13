# Test plan: <Project>

What we actually test, how, and why, given the product's current state.
Say plainly what isn't covered; an honest gap beats an imagined pass.

_Last updated: <YYYY-MM-DD>_

## 1. Scope

**In scope:**
- <Code areas, data layer, schema and access rules, public site copy.>

**Out of scope (for now):**
- <e.g. load testing, payment processing — and why.>

## 2. Test types and where they live

| Type | Tool | Where | What it catches |
|---|---|---|---|
| Unit — pure logic | <…> | <…> | Calculation and derivation bugs |
| Data layer | <…> | <…> | Wrong fields, payload shape, guard conditions |
| Component / integration | <…> | <…> | Multi-step UI flows |
| Access rules | <…> | <…> | Users reading or writing what they shouldn't |
| End-to-end | <…> | <…> | Core user journeys in a real browser |
| Accessibility | <…> | <…> | WCAG 2.1 AA failures |
| Copy regression | <…> | <…> | Fabricated or risky claims reappearing |
| Manual / exploratory | A human, against a preview or staging build | — | Live behaviour, visual regressions, anything CI can't see |

## 3. Environments

- **Local:** <how to run with test data>.
- **CI:** <what runs on every PR>.
- **Staging / preview:** <if any>.
- **Production:** never touched by automated tests; migrations and live
  checks only, by the approver.

## 4. Entry / exit criteria

**Entry:** acceptance criteria written in the brief; ADR first if the data
model, access rules or an integration change; approved design for UI work.

**Exit:** `DEFINITION_OF_DONE.md`. In short: lint, tests and build pass;
every acceptance criterion has evidence; access-rule changes reasoned about
or flagged as unverified.

## 5. Severity and priority

| Severity | Definition | Example |
|---|---|---|
| Critical | Data loss, security or access-rule bypass, or the app fails to start | <…> |
| High | A core flow is broken for a whole role | <…> |
| Medium | Works but degrades UX or shows wrong (not fake) data | <…> |
| Low | Cosmetic, copy, or an edge case with a workaround | <…> |

Priority is severity adjusted by how many real users hit it today.

## 6. Regression strategy

- Every bug fix gets a test that fails on the old code and passes on the fix
  (prove it by reintroducing the bug).
- Derived numbers (dashboards, totals) are computed by pure, exported
  functions so they can be tested without rendering.
- Copy that makes a factual or compliance claim gets a regression test.

## 7. Roles

BA writes acceptance criteria, the engineer implements and adds tests,
security reviews access rules and secrets, QA runs the exit criteria and
reports evidence. On a small team this can be one person moving through the
passes in order; the point is doing each pass deliberately.
