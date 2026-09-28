---
name: generate-docs
description: Run the documentation step of the Spec - Implement - Test - Docs - Merge loop for a finished feature. Updates docs/user-guide.md from the feature spec and the real implementation, reviews the guide against the code, aligns the specs, and marks the roadmap row done. Use after a feature's tests pass and before merging.
---

# Generate docs for a finished feature

Input: the feature name or roadmap row number. If neither is given, use the roadmap row marked `in progress`.

## 1. Read the sources

Read, in this order, and do not write anything until all are read:

1. `specs/brief.md`: the customer's language for what the product does.
2. `specs/roadmap.md`: find the feature's row; note its name, "Delivers" sentence and "Done when" line.
3. `specs/YYYY-MM-DD-<feature>/requirements.md`, `plan.md` and `acceptance.md`.
4. The implementation files listed in `plan.md`. The guide must describe what the code does, not what the spec hoped for.
5. `docs/user-guide.md` if it exists, to learn the existing sections and table of contents.

## 2. Create the guide if it does not exist

Create `docs/` at the repo root if missing. If `docs/user-guide.md` is missing, start it with:

- A title: `# <Product> — User Guide`.
- An "About this application" section: two or three sentences in plain language saying what the application does and what problem it solves. No technical terms (no "browser API", "ES module", "accessible name"). Say that the guide grows with each feature.
- A "Table of contents" section: a numbered list linking to every feature section.

## 3. Add the feature section

Append one section per feature, headed with the roadmap row's name, in roadmap order. Each section has exactly these four subsections:

- **What this feature does.** One paragraph. Describe the user-visible result, drawn from the roadmap "Delivers" sentence and the requirements. If the feature is deliberately partial (for example, an interface whose keys do nothing yet), say so plainly so the user is not confused.
- **Setup.** Any one-time configuration before first use. If none, say "No setup is needed" and point to the README for running locally. Do not repeat the commands; link to where they live.
- **How to use.** Numbered steps from the user's point of view. Each step is one action and, where useful, what the user will see. Cover keyboard and screen-reader use whenever the feature has a visible interface.
- **Related features.** A placeholder listing which later roadmap rows will connect to this one. Replace placeholders in earlier sections with real links once those features ship.

Then add the new section to the table of contents.

## 4. Review the guide against the code

The guide is wrong whenever it disagrees with the implementation. Check each of these against the actual source files, not the spec:

- **Names and order.** Every control the guide names must exist in the markup with that accessible name, in the order the guide lists. In this project the keys' accessible names come from the visually hidden text or the button text in `src/index.html`; read them from there. The first implementation exposed "AC" and "C" as key names while the spec said "Clear all" and "Clear entry"; the tests caught it, and the guide must use the names the code exposes after the fix.
- **Behaviour claims.** Do not claim a key does something unless a handler exists for it. Check the entry module and engine folder.
- **Paths.** After any file move, grep the whole repo (excluding `node_modules/`) for the old paths. When the source moved into `src/`, references had to change in the test helper, the test stylesheet check, the static server root, the engine README's relative link, the feature plan and the README. The guide must not mention paths at all unless the user has to type them.
- **Plain language.** Reread the "About" and "What this feature does" text and remove any term the brief would not use.

Fix the guide, not the code. If the code is wrong, stop and report it; it is an implementation defect, not a docs task.

## 5. Align the specs

The docs step is the last chance to catch spec drift before merge:

- If implementation deviated from `plan.md` (a file added, such as a serve script the plan named but did not list; a command changed, such as scoping the test runner to test files), record the deviation in `plan.md` so the plan matches what shipped.
- If a stack or tooling decision changed during the feature, update `specs/tech-design-web.md`, `specs/roadmap.md` and the feature `requirements.md` and `acceptance.md` in the same change, and grep for the old terms to make sure none remain.
- Confirm every acceptance scenario has been run. Manual scenarios such as a fresh-clone check can only run once a commit exists; run them from a scratch clone and report the result rather than assuming.

## 6. Mark the roadmap row done

In `specs/roadmap.md`, change the feature row's status from `in progress` to `done` and make sure its "Build" line links to the feature spec folder.

## 7. Report

Tell the user, in this order: which guide sections were added or changed, any mismatch found between guide, spec and code and how it was resolved, any acceptance scenario still unverified, and that the changes are staged but uncommitted. Commit only when asked. Commit messages end with the attribution line the session requires.

## Style rules for the guide

- Second person ("you"), present tense, one action per step.
- No code, no file paths, no HTML element names. Describe what the user sees.
- Keep each subsection short. A user should be able to read a feature section in under a minute.
- Never delete an earlier feature's section. Update it only to replace a placeholder or correct a claim that a later feature changed.
