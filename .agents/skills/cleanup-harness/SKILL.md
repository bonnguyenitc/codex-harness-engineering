---
name: cleanup-harness
description: Use when a user asks to design, scope, or run cleanup for agent-created code, documentation drift, repeated review defects, architecture drift, or accumulated harness debt.
---

# Cleanup Harness

## Core Principle

Treat cleanup as a scoped harness task, not opportunistic refactoring. Cleanup
needs a trigger, acceptance criteria, verification, and rollback path because
high agent throughput can spread weak patterns quickly.

In this repository, follow the local source policy: use only `[S1]-[S5]` for
harness claims. Read `docs/harness-engineering/sources.md` only when you need to
check that policy. For cleanup templates, prefer the relevant section of
`docs/harness-engineering/implementation-playbook.md` instead of loading the
whole research note.

## Cleanup Triggers

Start a cleanup task only when at least one trigger is visible:

- the same helper, workaround, or pattern appears repeatedly;
- a feature bypasses an architecture boundary;
- progress logs repeat the same failure;
- evaluator or review feedback catches the same defect class multiple times;
- docs, indexes, or `AGENTS.md` drift from the repository state;
- new work adds workaround code instead of fixing the cause.

If no trigger is visible, mention the potential issue but do not edit unrelated
code.

## Workflow

1. Identify the concrete trigger and evidence.
2. Define the smallest cleanup scope that removes the repeated problem.
3. List files likely to change.
4. Define acceptance criteria.
5. Define verification commands or observable signals.
6. Remove only debt inside the declared scope.
7. Convert repeated judgment into a mechanical guardrail when practical.
8. Record what was verified and any residual risk.

## Cleanup Task Template

```markdown
# Cleanup Task

## Trigger
- Evidence:

## Scope
- Clean up:
- Likely files:

## Acceptance Criteria
- [ ] Duplicate or drift source is removed.
- [ ] Behavior remains unchanged unless explicitly requested.
- [ ] Guardrail is added or the reason for not adding one is stated.

## Verification
- Tests:
- Lint/structural check:
- Runtime check:

## Rollback
- Safe restore point:
```

## Guardrail Guidance

Prefer a mechanical check when the same issue is likely to recur:

- lint or structural test for architecture boundaries;
- doc/index freshness check for repository source of truth;
- smoke test for setup or runtime drift;
- evaluator rubric for repeated subjective quality failures.

Do not add broad rules that protect no concrete invariant.

## Source Mapping

- Cleanup is part of repository-level harness maintenance when throughput
  increases entropy [S1].
- Mechanical guardrails are stronger than prose for repeated invariants [S1].
- Keep the intervention as simple as the failure mode allows [S3].
- Long-running work benefits from explicit state, verification, and recovery
  points [S2], [S4].
- AutoHarness can automatically enforce code constraints to reduce cleanup debt, and trajectory evaluation tracks whether cleanup alters agent execution paths [S5].
