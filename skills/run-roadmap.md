---
name: run-roadmap
description: Unattended driver for the Spec - Implement - Test - Docs - Merge loop. Repeats create-feature-spec, implementation, generate-docs and finalise-feature for each roadmap row until no row is planned, or a stop condition fires. Use when the user asks to work through the roadmap without approving each step.
---

# Run the roadmap to completion

Input: none. State lives in `specs/roadmap.md`: the first row that is `in progress` or `planned` is the current feature.

## Unattended mode

This skill runs the other three skills with these overrides, and only these:

- `create-feature-spec` step 7: plan approval is implicit; continue straight to implementation.
- `generate-docs` step 7: committing is allowed; the commit happens in `finalise-feature` step 5.
- `finalise-feature` step 8: after reporting, continue with the next row instead of stopping.

Everything else in those skills applies unchanged, including reading `AGENTS.md`, following `specs/tech-design-web.md` exactly, linking spec sections, no-fast-forward merges, fresh-clone verification, and replanning.

## One iteration

1. Read `specs/roadmap.md`. If no row is `planned` or `in progress`, stop: the roadmap is complete.
2. Take the first row that is `in progress`, else the first `planned` row. Resume at the first step that row has not completed: a missing spec folder means start at the spec; a spec with no implementation means implement; passing tests with no guide section means docs; a guide section with the row not merged means finalise.
3. Run `create-feature-spec` for the row.
4. Implement every file in `plan.md`, write the tests `acceptance.md` calls for, and run `npm test`. If a test fails, fix the implementation or a defective test once. If it still fails, stop (see stop conditions).
5. Run `generate-docs`.
6. Run `finalise-feature`, including the fresh-clone verification and replanning.
7. Report for the feature in at most ten lines: row, commits and merge hash, test counts, unverified manual scenarios, replanning edits. Then return to step 1.

## Stop conditions

Stop the loop, leave the working tree in a committed or clearly described state, and report when any of these happens:

- Tests still fail after one fix attempt.
- A spec or implementation would need a framework, library, build tool or pattern that `specs/tech-design-web.md` does not name.
- A decision in `specs/tech-design-web.md` would have to change, other than recording a clarification of the kind `finalise-feature` step 3 allows.
- A row cannot be implemented without a browser-only capability the tests cannot cover at all and the row's done criterion depends on it.
- Anything would delete or rewrite committed history, earlier guide sections or earlier changelog entries.

## Manual scenarios

Scenarios the DOM implementation cannot exercise (real-browser keyboard activation, installability, offline behaviour, visual layout and themes) are implemented and covered by the closest automated check available, marked `manual` in `acceptance.md`, listed as unverified in the feature report, and gathered into a final list when the roadmap completes. They never block the loop.

## Final report

When the roadmap is complete, report: features shipped this run with their merge hashes, the final test counts, every manual scenario still unverified with the exact steps to verify it, and any replanning edits made along the way.
