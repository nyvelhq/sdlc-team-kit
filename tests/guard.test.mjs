// Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const GUARD = join(dirname(fileURLToPath(import.meta.url)), "..", "scripts", "guard.mjs");

function repo(branch = "claude/work") {
  const dir = mkdtempSync(join(tmpdir(), "kit-"));
  const g = (...a) => execFileSync("git", a, { cwd: dir, stdio: "ignore" });
  g("init", "-q", "-b", "main");
  g("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "init");
  if (branch !== "main") g("checkout", "-q", "-b", branch);
  return dir;
}

function run(cwd, tool_name, tool_input) {
  const r = spawnSync("node", [GUARD], { input: JSON.stringify({ cwd, tool_name, tool_input }), encoding: "utf8" });
  return { code: r.status, err: r.stderr };
}
const bash = (cwd, command) => run(cwd, "Bash", { command });

const BRIEF = ({ designer = "yes", version = 2, approval = "Design v2 approved by Pat on 2026-10-12 — https://example" } = {}) => `# SHOP-01: store

## 4. Stories

### SHOP-01.1 — catalog
- stuff

## 5. Triggers

- Architect needed: no
- Designer needed (a user sees it): ${designer}

## Design

<!-- Design v9 approved by Nobody on 2026-01-01 -->
**Version:** v1
**Version:** v${version}

## Approval

<!-- Design v<N> approved by <approver> on <YYYY-MM-DD> -->
${approval}

## Pull requests
`;

function withBrief(dir, opts) {
  mkdirSync(join(dir, "docs/ideas/SHOP-01"), { recursive: true });
  writeFileSync(join(dir, "docs/ideas/SHOP-01/brief.md"), BRIEF(opts));
}

test("blocks push to main by refspec", () => {
  assert.equal(bash(repo(), "git push origin main").code, 2);
  assert.equal(bash(repo(), "git push origin HEAD:main").code, 2);
  assert.equal(bash(repo(), "git push origin HEAD:refs/heads/main").code, 2);
});

test("blocks bare push and commit while on a protected branch", () => {
  const d = repo("main");
  assert.equal(bash(d, "git push").code, 2);
  assert.equal(bash(d, "git push origin HEAD").code, 2);
  assert.equal(bash(d, 'git commit -m "x"').code, 2);
});

test("blocks force pushes", () => {
  const d = repo();
  for (const c of ["git push -f origin claude/work", "git push --force origin claude/work", "git push --force-with-lease", "git push origin +claude/work"]) {
    assert.equal(bash(d, c).code, 2, c);
  }
});

test("blocks protected push hidden in a compound command or behind -C", () => {
  const d = repo();
  assert.equal(bash(d, "npm test && git push origin main").code, 2);
  assert.equal(bash(d, "git -C . push origin main").code, 2);
});

test("-C <dir> checks the branch of that directory, not the current one", () => {
  const work = repo();
  const onMain = repo("main");
  assert.equal(bash(work, `git -C ${onMain} push`).code, 2);
  assert.equal(bash(work, `git -C ${onMain} commit -m "x"`).code, 2);
  assert.equal(bash(onMain, `git -C ${work} push`).code, 0);
});

test("GitHub MCP tools: no writes to protected branches, no merges", () => {
  const d = repo();
  const gh = (op, input) => run(d, `mcp__github__${op}`, input).code;
  assert.equal(gh("push_files", { branch: "main", files: [] }), 2);
  assert.equal(gh("create_or_update_file", { branch: "refs/heads/main", path: "a" }), 2);
  assert.equal(gh("delete_file", { path: "a" }), 2, "no branch means the default branch");
  assert.equal(gh("merge_pull_request", { pullNumber: 1 }), 2);
  assert.equal(gh("enable_pr_auto_merge", { pullNumber: 1 }), 2);
  assert.equal(run(d, "mcp__plugin_github_github__merge_pull_request", { pullNumber: 1 }).code, 2);
  assert.equal(gh("push_files", { branch: "claude/work", files: [] }), 0);
  assert.equal(gh("create_pull_request", { head: "claude/work", base: "main" }), 0);
  assert.equal(gh("pull_request_read", { pullNumber: 1 }), 0);
});

test("allows normal work on a claude branch", () => {
  const d = repo();
  assert.equal(bash(d, "git push -u origin claude/work").code, 0);
  assert.equal(bash(d, 'git commit -m "feat"').code, 0);
  assert.equal(bash(d, "npm test").code, 0);
  assert.equal(bash(d, "git checkout -b claude/SHOP-01-brief").code, 0);
});

test("design gate: blocks story branch without a brief", () => {
  assert.equal(bash(repo(), "git checkout -b claude/SHOP-01.1").code, 2);
});

test("design gate: opens with an approval for the current version", () => {
  const d = repo();
  withBrief(d);
  assert.equal(bash(d, "git checkout -b claude/SHOP-01.1").code, 0);
  assert.equal(bash(d, "git switch -c claude/SHOP-01.1").code, 0);
});

test("design gate: ignores approval text inside HTML comments", () => {
  const d = repo();
  withBrief(d, { approval: "" });
  assert.equal(bash(d, "git checkout -b claude/SHOP-01.1").code, 2);
});

test("design gate: approval for an older version does not count", () => {
  const d = repo();
  withBrief(d, { version: 3 });
  const r = bash(d, "git checkout -b claude/SHOP-01.1");
  assert.equal(r.code, 2);
  assert.match(r.err, /v2.*v3/);
});

test("design gate: withdrawn approval blocks", () => {
  const d = repo();
  withBrief(d, { approval: "Design v2 approved by Pat on 2026-10-12\nApproval withdrawn: design changed to v3" });
  assert.equal(bash(d, "git checkout -b claude/SHOP-01.1").code, 2);
});

test("design gate: no-UI story needs no approval; unknown trigger blocks", () => {
  const d = repo();
  withBrief(d, { designer: "no", approval: "" });
  assert.equal(bash(d, "git checkout -b claude/SHOP-01.1").code, 0);
  const e = repo();
  mkdirSync(join(e, "docs/ideas/SHOP-01"), { recursive: true });
  writeFileSync(join(e, "docs/ideas/SHOP-01/brief.md"), "## Stories\n\n### SHOP-01.1 — x\n");
  assert.equal(bash(e, "git checkout -b claude/SHOP-01.1").code, 2);
});

test("design gate: story missing from brief blocks", () => {
  const d = repo();
  withBrief(d);
  assert.equal(bash(d, "git checkout -b claude/SHOP-01.7").code, 2);
});

test("blocks writes to secret files, allows examples", () => {
  const d = repo();
  assert.equal(run(d, "Write", { file_path: join(d, ".env") }).code, 2);
  assert.equal(run(d, "Edit", { file_path: join(d, "config/.env.production") }).code, 2);
  assert.equal(run(d, "Write", { file_path: join(d, "certs/server.pem") }).code, 2);
  assert.equal(run(d, "Write", { file_path: join(d, ".env.example") }).code, 0);
  assert.equal(run(d, "Write", { file_path: join(d, "src/app.js") }).code, 0);
});

test("locked tests cannot be edited; the lock itself cannot be edited", () => {
  const d = repo();
  mkdirSync(join(d, ".claude/sdlc-locks"), { recursive: true });
  writeFileSync(join(d, ".claude/sdlc-locks/tests"), "# locked\nsrc/cart.test.js\n");
  assert.equal(run(d, "Edit", { file_path: join(d, "src/cart.test.js") }).code, 2);
  assert.equal(run(d, "Edit", { file_path: "src/cart.test.js" }).code, 2);
  assert.equal(run(d, "Write", { file_path: join(d, ".claude/sdlc-locks/tests") }).code, 2);
  assert.equal(run(d, "Edit", { file_path: join(d, "src/cart.js") }).code, 0);
});

test("malformed input never blocks", () => {
  const r = spawnSync("node", [GUARD], { input: "not json", encoding: "utf8" });
  assert.equal(r.status, 0);
});
