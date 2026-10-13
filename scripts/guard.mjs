#!/usr/bin/env node
// PreToolUse guard for the sdlc-team-kit plugin.
// Exit 2 blocks the tool call and tells Claude why; exit 0 leaves the normal permission flow alone.
// Enforces, deterministically:
//   1. No pushes or commits to protected branches, no force-pushes.
//   2. The design gate when a story branch claude/<ID>.<n> is created.
//   3. No edits to secret files, or to tests locked during a bug fix.
//   4. The same branch rules for GitHub MCP tools: no file writes to protected branches, no merges.
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, relative, basename, isAbsolute } from "node:path";
import { checkStory } from "./lib/gate.mjs";

const PROTECTED = new Set(["main", "master", "staging", "production", "prod", "release"]);

function block(reason) {
  process.stderr.write(`sdlc-team-kit: blocked. ${reason}\n`);
  process.exit(2);
}

function git(cwd, args) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function protectedBranches(cwd) {
  const set = new Set(PROTECTED);
  const head = git(cwd, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"]); // e.g. origin/main
  if (head) set.add(head.replace(/^origin\//, ""));
  return set;
}

// Split a shell command into simple segments on ; && || | and newlines (good enough for typical agent commands).
function segments(cmd) {
  return cmd.split(/;|&&|\|\||\||\n/).map((s) => s.trim()).filter(Boolean);
}

function tokens(seg) {
  return (seg.match(/"[^"]*"|'[^']*'|\S+/g) || []).map((t) => t.replace(/^['"]|['"]$/g, ""));
}

// Return [gitSubcommand, argsAfterSubcommand, dir] or null. Skips git global options like -c k=v;
// dir is where git runs, following -C <dir> (relative to cwd, and to each other, as git does).
function parseGit(tok, cwd) {
  let i = tok.findIndex((t) => t === "git" || t.endsWith("/git"));
  if (i === -1) return null;
  i++;
  let dir = cwd;
  while (i < tok.length && tok[i].startsWith("-")) {
    if (tok[i] === "-C" && i + 1 < tok.length) dir = resolve(dir, tok[i + 1]);
    if (["-C", "-c", "--git-dir", "--work-tree", "--namespace"].includes(tok[i])) i++;
    i++;
  }
  if (i >= tok.length) return null;
  return [tok[i], tok.slice(i + 1), dir];
}

function checkBash(command, cwd) {
  for (const seg of segments(command)) {
    const parsed = parseGit(tokens(seg), cwd);
    if (!parsed) continue;
    const [sub, args, dir] = parsed;
    const prot = protectedBranches(dir);
    const current = git(dir, ["rev-parse", "--abbrev-ref", "HEAD"]);
    const root = git(dir, ["rev-parse", "--show-toplevel"]) || dir;

    if (sub === "push") {
      if (args.some((a) => a === "-f" || a === "--force" || a.startsWith("--force-with-lease") || a === "--mirror" || /^\+/.test(a) || /^-[a-zA-Z]*f/.test(a))) {
        block("Force-pushes are not allowed. Push a normal commit, or ask the approver.");
      }
      const positional = args.filter((a) => !a.startsWith("-"));
      const refspecs = positional.slice(1); // first positional is the remote
      if (refspecs.length === 0 && prot.has(current)) {
        block(`You are on protected branch "${current}". Work on a claude/<id> branch and open a PR; the approver merges.`);
      }
      for (const spec of refspecs) {
        const dst = (spec.includes(":") ? spec.split(":").pop() : spec).replace(/^refs\/heads\//, "");
        const src = spec.includes(":") ? spec.split(":")[0] : spec;
        if (prot.has(dst) || (src === "HEAD" && !spec.includes(":") && prot.has(current))) {
          block(`Pushing to protected branch "${dst || current}" is not allowed. Open a PR from a claude/<id> branch; the approver merges.`);
        }
      }
    }

    if (sub === "commit" && prot.has(current)) {
      block(`Committing directly on protected branch "${current}" is not allowed. Create a claude/<id> branch first.`);
    }

    // Story branch creation → design gate.
    let newBranch = null;
    if ((sub === "checkout" || sub === "switch") ) {
      const i = args.findIndex((a) => ["-b", "-B", "-c", "-C", "--create", "--force-create"].includes(a));
      if (i !== -1) newBranch = args[i + 1];
    } else if (sub === "branch") {
      newBranch = args.find((a) => !a.startsWith("-"));
    } else if (sub === "worktree" && args[0] === "add") {
      const i = args.findIndex((a) => a === "-b" || a === "-B");
      if (i !== -1) newBranch = args[i + 1];
    }
    const sm = newBranch && /^claude\/([A-Z][A-Z0-9]*-\d+\.\d+)$/.exec(newBranch);
    if (sm) {
      const result = checkStory(root, sm[1]);
      if (!result.ok) block(`Design gate for ${sm[1]}: ${result.reason}`);
    }
  }
}

function isSecretFile(p) {
  const name = basename(p);
  if (/^\.env(\..+)?$/.test(name) && !/\.(example|sample|template)$/.test(name)) return true;
  if (/\.(pem|key|p12|pfx)$/i.test(name)) return true;
  if (/^id_(rsa|ed25519|ecdsa|dsa)(\.pub)?$/.test(name)) return true;
  if (/(^|\/)secrets?\//i.test(p)) return true;
  return false;
}

function checkEdit(filePath, cwd) {
  if (!filePath) return;
  const root = git(cwd, ["rev-parse", "--show-toplevel"]) || cwd;
  const abs = isAbsolute(filePath) ? filePath : resolve(cwd, filePath);
  const rel = relative(root, abs).split("\\").join("/");

  if (isSecretFile(rel)) {
    block(`"${rel}" looks like a secrets file. Agents never write secrets; list the variable under "Approver must do" instead.`);
  }

  const lockFile = resolve(root, ".claude/sdlc-locks/tests");
  if (rel === ".claude/sdlc-locks/tests") {
    block("The test lock is managed by the /build lead, not edited by agents.");
  }
  if (existsSync(lockFile)) {
    const locked = readFileSync(lockFile, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
    if (locked.includes(rel)) {
      block(`"${rel}" is the failing test committed for this bug fix and is locked until the fix is in. Change the code, not the test.`);
    }
  }
}

// GitHub MCP tools write to GitHub directly, so git hooks and the checks above never see them.
// Tool names look like mcp__github__push_files or mcp__plugin_github_github__push_files.
const GITHUB_WRITES = new Set(["push_files", "create_or_update_file", "delete_file"]);
const GITHUB_MERGES = new Set(["merge_pull_request", "enable_pr_auto_merge"]);

function checkGithubTool(toolName, ti, cwd) {
  const m = /^mcp__.*github.*__([a-z_]+)$/i.exec(toolName);
  if (!m) return;
  const op = m[1];
  if (GITHUB_MERGES.has(op)) {
    block("Agents never merge pull requests or turn on auto-merge. Leave the PR for the approver to merge.");
  }
  if (GITHUB_WRITES.has(op)) {
    const branch = String(ti.branch || "").replace(/^refs\/heads\//, "");
    if (!branch) {
      block(`${op} without a branch writes to the repository's default branch. Name a claude/<id> branch.`);
    }
    // Only this repo's default branch is known locally; for other repos the fixed list applies.
    if (protectedBranches(cwd).has(branch)) {
      block(`Writing to protected branch "${branch}" is not allowed. Use a claude/<id> branch and open a PR; the approver merges.`);
    }
  }
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0); // not our input; never break the session
  }
  const cwd = input.cwd || process.cwd();
  const ti = input.tool_input || {};
  if (input.tool_name === "Bash") checkBash(String(ti.command || ""), cwd);
  else if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(input.tool_name)) checkEdit(ti.file_path || ti.notebook_path, cwd);
  else checkGithubTool(String(input.tool_name || ""), ti, cwd);
  process.exit(0);
});
