import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
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
