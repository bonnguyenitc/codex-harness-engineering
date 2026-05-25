#!/usr/bin/env node

import { realpathSync } from "node:fs";
import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, "..");

export const SKILL_NAMES = [
  "acceptance-contract",
  "cleanup-harness",
  "creator-harness",
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function assertCanWrite(target, force) {
  if (!force && await exists(target)) {
    throw new Error(`${target} already exists. Re-run with --force to overwrite it.`);
  }
}

export async function installSkills({
  packageRoot = PACKAGE_ROOT,
  projectRoot = process.cwd(),
  force = false,
} = {}) {
  const sourceRoot = path.join(packageRoot, "skills");
  const targetRoot = path.join(projectRoot, ".agents", "skills");
  const docsSource = path.join(packageRoot, "docs", "harness-engineering");
  const docsTarget = path.join(projectRoot, "docs", "harness-engineering");
  const installed = [];

  await mkdir(targetRoot, { recursive: true });

  for (const skillName of SKILL_NAMES) {
    const source = path.join(sourceRoot, skillName);
    const target = path.join(targetRoot, skillName);

    if (path.resolve(source) !== path.resolve(target)) {
      await assertCanWrite(target, force);
      await rm(target, { recursive: true, force: true });
      await cp(source, target, { recursive: true, force: true });
    }
    installed.push(skillName);
  }

  if (path.resolve(docsSource) !== path.resolve(docsTarget)) {
    await assertCanWrite(docsTarget, force);
    await rm(docsTarget, { recursive: true, force: true });
    await cp(docsSource, docsTarget, { recursive: true, force: true });
  }

  return { targetRoot, docsTarget, installed };
}

export function parseArgs(args) {
  const [command, ...flags] = args;

  if (command !== "init") {
    throw new Error("Usage: codex-harness-engineering init [--force]");
  }

  const unknownFlag = flags.find((flag) => flag !== "--force");
  if (unknownFlag) {
    throw new Error(`Unknown option: ${unknownFlag}`);
  }

  return { command, force: flags.includes("--force") };
}

function isDirectRun() {
  if (!process.argv[1]) {
    return false;
  }

  return pathToFileURL(realpathSync(process.argv[1])).href ===
    pathToFileURL(realpathSync(fileURLToPath(import.meta.url))).href;
}

if (isDirectRun()) {
  try {
    const { force } = parseArgs(process.argv.slice(2));
    const { targetRoot, docsTarget, installed } = await installSkills({ force });

    console.log(`Installed ${installed.length} skills to ${targetRoot}`);
    for (const skillName of installed) {
      console.log(`- ${skillName}`);
    }
    console.log(`Copied docs to ${docsTarget}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
