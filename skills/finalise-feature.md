---
name: finalise-feature
description: Run the Merge step of the Spec - Implement - Test - Docs - Merge loop for a feature whose tests pass and whose docs are written. Appends the CHANGELOG entry, syncs specs/tech-design-web.md with what actually shipped, marks the roadmap row done, commits, merges the spec branch into main with a merge commit, verifies from a fresh clone, then replans the remaining roadmap. Use once per feature, after generate-docs.
---

# Finalise a feature

Input: the feature name or roadmap row number. With no input, use the roadmap row marked `in progress` and the `spec/YYYY-MM-DD-<slug>` branch that is checked out.

## 1. Confirm the feature is ready

Do all of these before changing anything. Stop and report if any fails.

- `AGENTS.md` has been read this session; obey it, including files to ignore.
- The spec branch for this feature is checked out and every earlier roadmap row is `done`.
- `npm test` passes. Paste the pass and fail counts in the report.
- Every automated acceptance scenario in `specs/YYYY-MM-DD-<slug>/acceptance.md` has a test. Manual scenarios that need a committed repository are run in step 6.
- `docs/user-guide.md` has a section for this feature (run the `generate-docs` skill first if not).
- No file outside the plan changed without the plan being updated to say so.

## 2. Append the CHANGELOG entry

Create `CHANGELOG.md` at the repo root with a `# Changelog` heading if it is missing. Append, separated by a blank line from the previous entry:

```
YYYY-MM-DD — <slug>
One sentence describing what was built.
```

Use today's date and the branch slug. The sentence describes what shipped, in past tense, naming the user-visible result first and the supporting work (tooling, tests) after. Never rewrite earlier entries.

## 3. Sync the technical design

Compare what shipped with `specs/tech-design-web.md`, section by section for the requirement this feature serves:

- Grep the design for every technology, pattern, element and API it names and check each against the code. The first feature shipped plain HTML, CSS and JavaScript after the design had named React and a bundler; the design, roadmap, requirements and acceptance all had to change together.
- If a decision differed, rewrite the design's sentence to state the actual decision and why, keep the MDN references accurate, and update the "Key design decisions" list. Then grep the roadmap and the feature spec for the old wording and fix those too.
- If nothing differed, say so explicitly in the report. Do not edit the design to describe layout or tooling that is not a design decision.

## 4. Mark the roadmap row done

In `specs/roadmap.md`, change the row's status from `in progress` to `done`. Confirm its Build line links to the feature spec folder. Change nothing else in the row here; replanning is step 7.

## 5. Commit and merge

- Stage everything and commit on the spec branch with a message whose first line is `Implement feature N: <row name>` (or `Finalise feature N: <row name>` if implementation was committed earlier), a body summarising what shipped and any spec changes, and the attribution line the session requires.
- Check out `main` and merge with a merge commit, never fast-forward, so the feature stays visible as one unit in history:
  `git merge --no-ff spec/YYYY-MM-DD-<slug>`
- Confirm the working tree is clean and `main` is checked out. Leave the spec branch in place unless the user asks to delete it.

## 6. Verify from a fresh clone

Manual acceptance scenarios that need a committed repository can only run now. Clone `main` into the session scratch directory, then run the documented install, test and serve commands in order. Confirm the test counts match step 1 and the server returns the page with status 200. Kill the server. Report the result; never assume it.

## 7. Replan the remaining roadmap

Reread `specs/roadmap.md` in the light of what this feature taught, and adjust only what the evidence supports:

- **Names.** If the shipped feature was renamed (row 1 became "Calculator interface"), check later rows still read correctly against it.
- **Scope shifts.** If this feature absorbed part of a later row, or left something out that a later row must now pick up, edit those rows' Delivers and Done-when lines and say so.
- **Build lines.** If the stack or tooling changed, make every remaining Build line consistent with the design (for example, "JavaScript ES module" rather than "TypeScript module").
- **Order.** Confirm each remaining row still depends only on rows above it. Reorder only if a dependency is now wrong.
- **Next feature.** Identify the first `planned` row and name it as the next feature. Do not create its branch or spec; that is the `create-feature-spec` skill.

Commit roadmap changes on `main` with a message beginning `Replan roadmap after feature N` only if something changed.

## 8. Report

In this order: the commits created and the merge commit hash; the changelog line; whether the design needed syncing and what changed; the fresh-clone result with test counts; any roadmap edits made in replanning; and the next feature's name and row number. Keep it under fifteen lines. Stop; do not start the next feature.
