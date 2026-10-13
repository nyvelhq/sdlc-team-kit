---
name: risk-register
description: Create or update a project risk register with likelihood × impact scoring, owners, mitigations, and triggers. Use at kickoff, after design decisions, and before releases.
---

# Maintain the risk register

1. Read `${CLAUDE_PLUGIN_ROOT}/templates/risk-register.md`. If `docs/sdlc/risk-register.md` exists, update it instead of replacing it.
2. Write each risk as cause → event → effect, so it is specific and actionable.
3. Score likelihood and impact 1–5 and compute the score. Give a one-line reason for any score of 4 or 5.
4. Every risk scoring Medium or High needs an owner, a mitigation, and a contingency trigger.
5. Move resolved risks to the Closed table with the outcome; never delete history.
6. Report the top three risks by score.
