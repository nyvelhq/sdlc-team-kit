#!/usr/bin/env node
// Usage: node gate.mjs <story-id> [repo-root]
// Exit 0 = the story may be built. Exit 1 = blocked (reason on stderr).
import { execFileSync } from "node:child_process";
import { checkStory } from "./lib/gate.mjs";

const [storyId, rootArg] = process.argv.slice(2);
if (!storyId) {
  console.error("Usage: node gate.mjs <story-id> [repo-root]");
  process.exit(1);
}
let root = rootArg;
if (!root) {
  try {
    root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
  } catch {
    console.error("Not inside a git repository.");
    process.exit(1);
  }
}
const result = checkStory(root, storyId);
(result.ok ? console.log : console.error)(`${result.ok ? "GATE OPEN" : "GATE CLOSED"}: ${result.reason}`);
process.exit(result.ok ? 0 : 1);
