# Harness Artifact Templates

Use these templates selectively. Do not create every artifact by default.

Each artifact must answer at least one question:

- What should the agent know?
- What state survives context loss?
- What can the agent observe?
- How does the agent verify work?
- What constraint is mechanically enforced?

## Contents

- Minimal Repository Harness
- AGENTS.md
- progress.md
- feature_list.json
- init.sh
- Makefile
- Acceptance Contract
- Sprint Contract
- Evaluator Notes
- Cleanup Task

## Minimal Repository Harness

Start here unless a named failure mode requires more.

```text
AGENTS.md
README.md
progress.md
feature_list.json
init.sh
Makefile or task runner
tests/ or smoke test
```

Optional only when needed:

```text
docs/architecture.md
docs/product-spec.md
docs/tool-contracts.md
evals/
cleanup.md
```

## AGENTS.md

```markdown
# Agent Instructions

## Start Here
1. Read `README.md`.
2. Read latest entries in `progress.md`.
3. Check `feature_list.json`.
4. Run `./init.sh` or the standard setup command.
5. Run the cheapest smoke test before editing.

## Commands
- Setup:
- Test:
- Lint:
- Build:
- Smoke:

## Rules
- Keep changes scoped to the requested feature/fix.
- Update feature status only after verification passes.
- Record durable progress before ending a long session.
- Do not refactor unrelated code.
```

## progress.md

```markdown
# Progress

## YYYY-MM-DD

### Context
- Task:
- Current branch:
- Relevant files:

### Done
- ...

### Verification
- Command:
- Result:

### Open Issues
- ...

### Next
- ...
```

Keep entries short and recoverable. Prefer file paths, command names, failing
test names, and artifact paths over vague prose.

## feature_list.json

```json
[
  {
    "id": "F001",
    "title": "Feature or capability",
    "status": "not_started",
    "acceptance": [
      "User can ...",
      "System rejects ...",
      "Regression check passes ..."
    ],
    "verify": [
      "make test",
      "make smoke"
    ],
    "evidence": []
  }
]
```

Use status values consistently: `not_started`, `in_progress`, `blocked`,
`verified`. Only set `verified` after listed checks pass.

## init.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Keep this script idempotent. It should be safe for a new session to run first.
make setup
make smoke
```

## Makefile

```makefile
.PHONY: setup test lint build smoke verify

setup:
	# install dependencies or prepare local environment

test:
	# run unit tests

lint:
	# run lint or structural checks

build:
	# run build

smoke:
	# run the cheapest end-to-end confidence check

verify: lint test build smoke
```

Keep command names stable. Agent instructions should point to these targets
instead of repeating long command lines across files.

## Acceptance Contract

Use this for a small bug or feature when planner/evaluator would be too much.

```markdown
# Acceptance Contract

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

## Sprint Contract

Use this when work spans multiple files, runtime behavior, or subjective quality.

```markdown
# Sprint Contract

## Scope
- Feature:
- User path:
- API/data path:
- Likely files/modules:

## Done Means
- [ ] User can ...
- [ ] API or data reflects ...
- [ ] Error state handles ...
- [ ] No regression in ...

## Verification
- Unit:
- Integration:
- Browser/API:
- Log/metric/trace:

## Evaluator Focus
- Runtime behavior:
- Negative cases:
- UX or quality concerns:

## Out of Scope
- ...
```

If the sprint contract becomes longer than the work, split the work or fall back
to a smaller acceptance contract.

## Evaluator Notes

Use this when generator self-review is not enough.

```markdown
# Evaluator Notes

## Contract
- Sprint:
- Expected behavior:

## Checks Run
- Command/check:
- Result:
- Artifact:

## Findings
- [ ] P0/P1/P2:
  - Evidence:
  - Repro:
  - Suggested next step:

## Verdict
- pass/fail:
- Reason:
```

Evaluator feedback should cite observed evidence: screenshots, DOM state, API
response, database state, logs, traces, or command output.

## Legibility Map

Use this when the agent cannot see enough runtime behavior.

```markdown
# Legibility Map

| Area | Signal | How to collect | Owner/check |
| --- | --- | --- | --- |
| UI | Screenshot/DOM |  |  |
| API | Request/response |  |  |
| Backend runtime | Structured log/trace |  |  |
| Data | Schema/query/seed |  |  |
| Build | Build log/CI log |  |  |
| Architecture | Lint/structural test |  |  |
```

## Cleanup Task

Use this when agent throughput creates repeated drift.

```markdown
# Cleanup Task

## Trigger
- Repeated pattern:
- Evidence:

## Scope
- Include:
- Exclude:

## Acceptance Criteria
- [ ] ...

## Verification
- Lint:
- Test:
- Smoke:

## Rollback
- ...
```
