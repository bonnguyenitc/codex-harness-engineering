---
name: acceptance-contract
description: Use when a user asks to define success criteria, clarify scope, prevent premature done claims, or prepare an AI agent/coding agent task before implementation.
---

# Acceptance Contract

## Core Principle

Turn an unclear request into a small, verifiable contract before implementation.
Use this skill when "done" is ambiguous, the task could drift, or an agent may
claim completion without evidence.

In this repository, follow the local source policy: use only `[S1]-[S5]` for
harness claims. Read `docs/harness-engineering/sources.md` only when you need to
check that policy. For templates, prefer the relevant section of
`docs/harness-engineering/implementation-playbook.md` instead of loading the
whole research note.

## Workflow

1. State assumptions in one short list.
2. Name any ambiguity that changes implementation or verification.
3. Keep the scope smaller than the implementation work.
4. Define user-visible or system-visible behavior.
5. Define acceptance criteria that can be checked.
6. Define verification commands or observable signals.
7. Mark non-goals so the agent does not widen the task.
8. Implement only after the contract is clear enough to verify.

If the missing information cannot be inferred safely, ask one concise question
before writing code.

## Contract Template

```markdown
# Acceptance Contract

## Assumptions
- ...

## Scope
- Feature/fix:
- User-visible behavior:
- Likely files:

## Acceptance Criteria
- [ ] ...
- [ ] ...

## Verification
- Unit:
- Integration:
- Browser/API:
- Log/metric/trace:

## Out of Scope
- ...
```

## Verification Rules

- Prefer an existing project command over a new script.
- For code changes, run the narrowest test that proves the criteria.
- For UI/runtime behavior, use browser, API, log, metric, trace, or screenshot
  evidence when available.
- Do not mark criteria done until verification has run or the skipped check is
  explicitly explained.

## Source Mapping

- Small tasks should use the simplest sufficient workflow [S3].
- Long-running agent tasks need state and verification to avoid early done
  claims [S2].
- Runtime-visible checks improve agent feedback loops [S1], [S2], [S4].
- Sprint contracts and evaluator criteria help when task quality is subjective
  or multi-step [S4].
- Trajectory evaluation and LLM-as-a-judge monitor execution path quality, and AutoHarness enforces constraints when manual rules are too complex [S5].
