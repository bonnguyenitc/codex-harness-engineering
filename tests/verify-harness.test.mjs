import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { verifyHarness } from "../scripts/verify-harness.mjs";

const REQUIRED_FILES = {
  "AGENTS.md": "Nguon duoc phep: [S1], [S2], [S3], [S4], [S5].\n",
  "README.md": [
    "`docs/harness-engineering/index.md` [S1]",
    "`docs/harness-engineering/research-note.md` [S2]",
    "`docs/harness-engineering/implementation-playbook.md` [S3]",
    "`docs/harness-engineering/sources.md` [S4]",
    "`skills/creator-harness/SKILL.md` [S5]",
    "`skills/acceptance-contract/SKILL.md`",
    "`skills/cleanup-harness/SKILL.md`",
    "`progress.md`",
    "`feature_list.json`",
    "`init.sh`",
  ].join("\n"),
  "progress.md": "# Progress\n",
  "feature_list.json": "[]\n",
  "init.sh": "#!/usr/bin/env bash\n",
  "docs/harness-engineering/index.md": "# Index [S1]\n",
  "docs/harness-engineering/research-note.md": "# Research [S2]\n",
  "docs/harness-engineering/implementation-playbook.md": "# Playbook [S3]\n",
  "docs/harness-engineering/sources.md": "# Sources [S4]\n",
  "skills/creator-harness/SKILL.md": "# Creator [S5]\n",
  "skills/acceptance-contract/SKILL.md": "# Acceptance [S1]\n",
  "skills/cleanup-harness/SKILL.md": "# Cleanup [S1]\n",
};

async function createHarness(overrides = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "verify-harness-"));
  const files = { ...REQUIRED_FILES, ...overrides };

  for (const [relativePath, contents] of Object.entries(files)) {
    const filePath = path.join(root, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents, "utf8");
  }

  return root;
}

test("verifyHarness accepts the minimal repository harness", async () => {
  const root = await createHarness();

  try {
    assert.deepEqual(await verifyHarness(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("verifyHarness rejects citations outside S1 through S5", async () => {
  const root = await createHarness({
    "docs/harness-engineering/research-note.md": "# Research [S6]\n",
  });

  try {
    const errors = await verifyHarness(root);
    assert.equal(errors.length, 1);
    assert.match(errors[0], /research-note\.md.*\[S6\]/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("verifyHarness reports a missing required artifact", async () => {
  const root = await createHarness();
  await rm(path.join(root, "progress.md"));

  try {
    const errors = await verifyHarness(root);
    assert.equal(errors.length, 1);
    assert.match(errors[0], /progress\.md.*missing/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("verifyHarness reports a required artifact missing from the README map", async () => {
  const root = await createHarness({
    "README.md": REQUIRED_FILES["README.md"].replace("`progress.md`\n", ""),
  });

  try {
    const errors = await verifyHarness(root);
    assert.equal(errors.length, 1);
    assert.match(errors[0], /README\.md.*progress\.md.*not referenced/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
