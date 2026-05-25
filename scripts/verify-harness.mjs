#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REQUIRED_FILES = [
  "AGENTS.md",
  "README.md",
  "progress.md",
  "feature_list.json",
  "init.sh",
  "docs/harness-engineering/index.md",
  "docs/harness-engineering/research-note.md",
  "docs/harness-engineering/implementation-playbook.md",
  "docs/harness-engineering/sources.md",
  "skills/creator-harness/SKILL.md",
  "skills/acceptance-contract/SKILL.md",
  "skills/cleanup-harness/SKILL.md",
];
const README_MAPPED_FILES = REQUIRED_FILES.filter(
  (relativePath) => relativePath !== "AGENTS.md" && relativePath !== "README.md"
);
const STATE_FILES = ["feature_list.json", "progress.md"];
const BEHAVIOR_CHANGE_PATTERNS = [
  /^(scripts|tests|skills)\//,
  /^package(?:-lock)?\.json$/,
  /^init\.sh$/,
  /^AGENTS\.md$/,
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function markdownFiles(directory, relativeRoot) {
  if (!await exists(directory)) {
    return [];
  }

  const found = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.join(relativeRoot, entry.name);

    if (entry.isDirectory()) {
      found.push(...await markdownFiles(absolutePath, relativePath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      found.push(relativePath);
    }
  }

  return found;
}

function changesHarnessBehavior(relativePath) {
  return BEHAVIOR_CHANGE_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function changedFilesInGit(root) {
  try {
    const modified = execFileSync("git", ["diff", "--name-only", "HEAD", "--"], {
      cwd: root,
      encoding: "utf8",
    });
    const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], {
      cwd: root,
      encoding: "utf8",
    });
    return [...new Set(`${modified}\n${untracked}`.split("\n").filter(Boolean))];
  } catch {
    return [];
  }
}

function latestProgressEntry(progress) {
  const entryStart = progress.lastIndexOf("\n## ");
  return entryStart === -1 ? progress : progress.slice(entryStart + 1);
}

export async function verifyHarness(root = PACKAGE_ROOT, { changedFiles = [] } = {}) {
  const errors = [];

  for (const relativePath of REQUIRED_FILES) {
    if (!await exists(path.join(root, relativePath))) {
      errors.push(`${relativePath}: required artifact is missing`);
    }
  }

  const readmePath = path.join(root, "README.md");
  if (await exists(readmePath)) {
    const readme = await readFile(readmePath, "utf8");
    for (const relativePath of README_MAPPED_FILES) {
      if (!readme.includes(`\`${relativePath}\``)) {
        errors.push(`README.md: required artifact ${relativePath} is not referenced`);
      }
    }
  }

  const scannableFiles = [
    "AGENTS.md",
    "README.md",
    ...await markdownFiles(path.join(root, "docs", "harness-engineering"), "docs/harness-engineering"),
    ...await markdownFiles(path.join(root, "skills"), "skills"),
  ];

  for (const relativePath of scannableFiles) {
    const filePath = path.join(root, relativePath);
    if (!await exists(filePath)) {
      continue;
    }

    const contents = await readFile(filePath, "utf8");
    for (const match of contents.matchAll(/\[S(\d+)\]/g)) {
      const sourceNumber = Number(match[1]);
      if (sourceNumber < 1 || sourceNumber > 5) {
        errors.push(`${relativePath}: citation ${match[0]} is outside permitted range [S1]-[S5]`);
      }
    }
  }

  const behaviorChanges = changedFiles.filter(changesHarnessBehavior);
  if (behaviorChanges.length > 0) {
    for (const stateFile of STATE_FILES) {
      if (!changedFiles.includes(stateFile)) {
        errors.push(
          `${stateFile}: must be updated when implementation or harness behavior changes`
        );
      }
    }

    if (changedFiles.includes("progress.md") && await exists(path.join(root, "progress.md"))) {
      const progress = await readFile(path.join(root, "progress.md"), "utf8");
      const latestEntry = latestProgressEntry(progress);
      for (const relativePath of behaviorChanges) {
        if (!latestEntry.includes(`\`${relativePath}\``)) {
          errors.push(
            `progress.md: latest entry must reference changed behavior artifact ${relativePath}`
          );
        }
      }
    }
  }

  return errors;
}

function isDirectRun() {
  return Boolean(process.argv[1]) &&
    pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
}

if (isDirectRun()) {
  const errors = await verifyHarness(PACKAGE_ROOT, {
    changedFiles: changedFilesInGit(PACKAGE_ROOT),
  });

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    process.exitCode = 1;
  } else {
    console.log("Harness verification passed.");
  }
}
