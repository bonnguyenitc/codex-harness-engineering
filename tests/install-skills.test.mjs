import assert from "node:assert/strict";
import { chmod, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { installSkills, parseArgs, SKILL_NAMES } from "../scripts/install-skills.mjs";

test("installSkills copies skills into home and docs into the target project", async () => {
  const home = await mkdtemp(path.join(tmpdir(), "harness-skills-"));
  const projectRoot = await mkdtemp(path.join(tmpdir(), "harness-project-"));

  try {
    const result = await installSkills({ home, projectRoot });

    assert.deepEqual(result.installed.sort(), [...SKILL_NAMES].sort());

    for (const skillName of SKILL_NAMES) {
      const skillPath = path.join(home, ".agents", "skills", skillName, "SKILL.md");
      const content = await readFile(skillPath, "utf8");
      assert.match(content, /^---\nname:/);
    }

    const docsIndex = path.join(projectRoot, "docs", "harness-engineering", "index.md");
    const docsContent = await readFile(docsIndex, "utf8");
    assert.match(docsContent, /Harness Engineering/);
  } finally {
    await rm(home, { recursive: true, force: true });
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("parseArgs accepts init and init --force", () => {
  assert.deepEqual(parseArgs(["init"]), { command: "init", force: false });
  assert.deepEqual(parseArgs(["init", "--force"]), { command: "init", force: true });
});

test("CLI runs when invoked through a symlinked npm bin", async () => {
  const home = await mkdtemp(path.join(tmpdir(), "harness-skills-"));
  const projectRoot = await mkdtemp(path.join(tmpdir(), "harness-project-"));
  const binRoot = await mkdtemp(path.join(tmpdir(), "harness-bin-"));
  const scriptPath = path.resolve("scripts", "install-skills.mjs");
  const binPath = path.join(binRoot, "codex-harness-engineering");

  try {
    await chmod(scriptPath, 0o755);
    await symlink(scriptPath, binPath);

    const result = spawnSync(binPath, ["init"], {
      cwd: projectRoot,
      env: { ...process.env, HOME: home },
      encoding: "utf8",
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Installed 3 skills/);
    assert.match(result.stdout, /Copied docs/);
    assert.match(
      await readFile(path.join(home, ".agents", "skills", "creator-harness", "SKILL.md"), "utf8"),
      /^---\nname: creator-harness/m
    );
    assert.match(
      await readFile(path.join(projectRoot, "docs", "harness-engineering", "index.md"), "utf8"),
      /Harness Engineering/
    );
  } finally {
    await rm(home, { recursive: true, force: true });
    await rm(projectRoot, { recursive: true, force: true });
    await rm(binRoot, { recursive: true, force: true });
  }
});

test("installSkills refuses to overwrite existing targets without force", async () => {
  const home = await mkdtemp(path.join(tmpdir(), "harness-skills-"));
  const projectRoot = await mkdtemp(path.join(tmpdir(), "harness-project-"));

  try {
    await installSkills({ home, projectRoot });

    await assert.rejects(
      installSkills({ home, projectRoot }),
      /already exists.*--force/
    );
  } finally {
    await rm(home, { recursive: true, force: true });
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("installSkills overwrites existing targets with force", async () => {
  const home = await mkdtemp(path.join(tmpdir(), "harness-skills-"));
  const projectRoot = await mkdtemp(path.join(tmpdir(), "harness-project-"));

  try {
    await installSkills({ home, projectRoot });

    const skillPath = path.join(home, ".agents", "skills", "creator-harness", "SKILL.md");
    const docsIndex = path.join(projectRoot, "docs", "harness-engineering", "index.md");
    await mkdir(path.dirname(skillPath), { recursive: true });
    await writeFile(skillPath, "local edit", "utf8");
    await writeFile(docsIndex, "local edit", "utf8");

    await installSkills({ home, projectRoot, force: true });

    assert.match(await readFile(skillPath, "utf8"), /^---\nname: creator-harness/m);
    assert.match(await readFile(docsIndex, "utf8"), /Harness Engineering/);
  } finally {
    await rm(home, { recursive: true, force: true });
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("installSkills does not delete or fail when projectRoot is the same as packageRoot", async () => {
  const tempPackageRoot = await mkdtemp(path.join(tmpdir(), "harness-pkg-"));
  const home = await mkdtemp(path.join(tmpdir(), "harness-skills-"));

  try {
    const tempSkills = path.join(tempPackageRoot, "skills");
    const tempDocs = path.join(tempPackageRoot, "docs", "harness-engineering");

    await mkdir(tempSkills, { recursive: true });
    await mkdir(tempDocs, { recursive: true });

    for (const skillName of SKILL_NAMES) {
      const sDir = path.join(tempSkills, skillName);
      await mkdir(sDir, { recursive: true });
      await writeFile(path.join(sDir, "SKILL.md"), `---\nname: ${skillName}\n---`, "utf8");
    }

    await writeFile(path.join(tempDocs, "index.md"), "Harness Engineering", "utf8");

    const result = await installSkills({
      home,
      packageRoot: tempPackageRoot,
      projectRoot: tempPackageRoot,
      force: true
    });

    assert.deepEqual(result.installed.sort(), [...SKILL_NAMES].sort());

    const docsContent = await readFile(path.join(tempPackageRoot, "docs", "harness-engineering", "index.md"), "utf8");
    assert.match(docsContent, /Harness Engineering/);
  } finally {
    await rm(home, { recursive: true, force: true });
    await rm(tempPackageRoot, { recursive: true, force: true });
  }
});
