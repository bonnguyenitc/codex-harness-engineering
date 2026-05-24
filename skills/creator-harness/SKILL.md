---
name: creator-harness
description: Use when a user asks to create, design, audit, or improve a harness for AI agents, coding agents, long-running work, eval loops, repository workflows, or agent operating procedures.
---

# Creator Harness

## Core Principle

Create the smallest harness that changes agent behavior. A harness is the
control plane around an agent: durable state, readable tools, verification
loops, evaluator feedback when needed, and mechanical guardrails.

Use only the local four-source research as the source of truth:

- `docs/harness-engineering/sources.md`
- `docs/harness-engineering/research-note.md`
- `docs/harness-engineering/implementation-playbook.md`

Do not introduce external harness resources unless the user explicitly asks to
expand beyond the four OpenAI/Anthropic articles.

## Working Rules

1. State assumptions before creating files. If the target agent, runtime, or
   success criteria are unknowable, ask one concise question.
2. Start with a single-agent harness plus state and verification. Add planner,
   evaluator, telemetry, or cleanup automation only when a named failure mode
   requires it.
3. Touch only harness artifacts unless the user explicitly asks for product code
   changes.
4. Every harness artifact must answer at least one question: What should the
   agent know? What state survives context loss? What can it observe? How does
   it verify? What invariant is mechanically enforced?
5. Convert important preferences into checks where practical: tests, lint,
   scripts, CI jobs, evaluator rubrics, or reviewer contracts.
6. For one-shot Markdown or research-note edits in this repository, do not start
   autonomous loops unless the user explicitly requests them.

## Design Workflow

1. Inventory existing harness surface:
   - `AGENTS.md`, `README.md`, architecture docs, product specs;
   - setup scripts, task runner, CI, tests, smoke tests;
   - progress logs, feature lists, todos, research state;
   - eval prompts, evaluator rubrics, screenshots, traces, telemetry;
   - tool contracts, permissions, escalation rules.

2. Name the failure modes:
   - lost context across sessions;
   - early "done" claims;
   - weak runtime observability;
   - overbroad implementation;
   - self-evaluation optimism;
   - architecture drift;
   - cleanup debt from high agent throughput.

3. Pick the minimal intervention:
   - unclear task: acceptance contract;
   - lost context: `progress.md`, `feature_list.json`, git protocol;
   - broken environment: `init.sh`, smoke test;
   - invisible runtime: browser/API/log/metric/trace checks;
   - weak self-review: evaluator rubric or separate evaluator pass;
   - drift: structural lint or architecture test;
   - throughput entropy: targeted cleanup task with verification.

4. Write a harness contract:
   - agent role and allowed scope;
   - durable state files;
   - required tools and observable signals;
   - verification commands;
   - loop cadence;
   - stop/escalation conditions;
   - out-of-scope work.

5. Create only the needed files. For templates, read
   `references/harness-artifacts.md`.

6. Verify the harness:
   - run syntax/format validators for files created;
   - run the declared smoke test if one exists;
   - run the placeholder and citation scan from `AGENTS.md`;
   - verify no recurring automation was created for a one-shot documentation
     task;
   - if editing this skill, validate the skill if a validator exists locally.

## Harness Types

| Situation                   | Default harness                                           |
| --------------------------- | --------------------------------------------------------- |
| Small bug or feature        | Acceptance criteria and a verification command            |
| Multi-session coding        | `progress.md`, `feature_list.json`, `init.sh`, smoke test |
| UI/runtime-heavy app        | Sprint contract, browser/API checks, evaluator notes      |
| Long application build      | Planner, generator, evaluator, sprint contract            |
| Architecture-sensitive repo | Dependency rules, structural tests, cleanup cadence       |

## Output Shape

When answering without file edits, produce:

```markdown
## Assumptions

- ...

## Failure Modes

- ...

## Minimal Harness

- Artifact:
- Purpose:
- Verification:

## Next Step

- ...
```

When editing files, summarize changed files and verification run.
