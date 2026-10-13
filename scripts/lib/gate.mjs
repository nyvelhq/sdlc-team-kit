// Design-gate check: may code be written for a story?
// Parses docs/ideas/<ID>/brief.md deterministically. Missing or unclear = blocked.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const STORY_RE = /^([A-Z][A-Z0-9]*-\d+)\.(\d+)$/;

function stripComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, "");
}

function section(text, title) {
  // Content of "## <title>" (optionally numbered, e.g. "## 5. Triggers") up to the next "## ".
  const re = new RegExp(`^##\\s+(?:\\d+\\.\\s*)?${title}\\b.*$`, "im");
  const m = re.exec(text);
  if (!m) return null;
  const rest = text.slice(m.index + m[0].length);
  const next = rest.search(/^##\s+/m);
  return next === -1 ? rest : rest.slice(0, next);
}

export function checkStory(repoRoot, storyId) {
  const m = STORY_RE.exec(storyId);
  if (!m) return { ok: false, reason: `"${storyId}" is not a story ID like ABC-01.1.` };
  const ideaId = m[1];
  const briefPath = join(repoRoot, "docs", "ideas", ideaId, "brief.md");
  if (!existsSync(briefPath)) {
    return { ok: false, reason: `No brief at docs/ideas/${ideaId}/brief.md. Run /idea first.` };
  }
  const brief = stripComments(readFileSync(briefPath, "utf8"));

  const stories = section(brief, "Stories") ?? "";
  const escaped = storyId.replace(/\./g, "\\.");
  if (!new RegExp(`^###\\s+${escaped}\\b`, "m").test(stories)) {
    return { ok: false, reason: `Story ${storyId} is not under "## Stories" in the brief.` };
  }

  const triggers = section(brief, "Triggers") ?? "";
  const dm = /Designer needed[^:\n]*:\s*\**\s*(yes|no)\b/i.exec(triggers);
  if (!dm) {
    return { ok: false, reason: `The brief's Triggers section doesn't say "Designer needed: yes/no", so the design gate can't be checked. Missing evidence = blocked.` };
  }
  if (dm[1].toLowerCase() === "no") return { ok: true, reason: "No UI: design gate not required." };

  const design = section(brief, "Design") ?? "";
  const versions = [...design.matchAll(/Version:?\**\s*v(\d+)/gi)].map((v) => Number(v[1]));
  if (versions.length === 0) {
    return { ok: false, reason: `The brief needs a design but its Design section has no "Version: v<N>" line.` };
  }
  const current = versions[versions.length - 1];

  const approval = section(brief, "Approval") ?? "";
  const events = [...approval.matchAll(/Design v(\d+) approved by (.+?) on (\d{4}-\d{2}-\d{2})|Approval withdrawn/gi)];
  if (events.length === 0) {
    return { ok: false, reason: `Design v${current} has not been approved. The approver must approve it (/design ${ideaId} approve) before any code.` };
  }
  const last = events[events.length - 1];
  if (/withdrawn/i.test(last[0])) {
    return { ok: false, reason: `The last design approval was withdrawn. Design v${current} needs a new approval.` };
  }
  if (Number(last[1]) !== current) {
    return { ok: false, reason: `Approval is for design v${last[1]}, but the current design is v${current}. Approvals are for an exact version.` };
  }
  return { ok: true, reason: `Design v${current} approved by ${last[2].trim()} on ${last[3]}.` };
}
