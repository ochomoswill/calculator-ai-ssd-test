---
name: create-feature-spec
description: Run the Spec step of the Spec - Implement - Test - Docs - Merge loop. Reads the project constitution and design, picks the next planned roadmap feature, creates its spec branch, and writes requirements.md, plan.md and acceptance.md under specs/. Use when starting a new feature. Writes no code.
---

# Create the spec for the next feature

Input: optionally a feature name or roadmap row number. With no input, use the first roadmap row whose status is `planned`.

## 1. Read the constitution and the design

Read all of these before writing anything:

1. `AGENTS.md`: the project rules. Obey them literally, including any file to ignore.
2. `specs/brief.md`: the customer's requirements in their own words.
3. `specs/tech-design-web.md`: the implementation decisions. The spec must follow the relevant section exactly and link to it. Do not introduce a framework, build tool, library or pattern the design does not name. The first feature drifted to React and a bundler because the draft design named them; the correction cost a full rewrite of the plan and four other documents.
4. `specs/roadmap.md`: the ordered feature queue.
5. `docs/user-guide.md` and `CHANGELOG.md` if present, to learn what already exists.

## 2. Identify the feature

- Take the first row with status `planned`, or the row the user named.
- Confirm every row above it is `done`. If one is `in progress`, stop and report; features build on the rows before them.
- If the user's name for the feature differs from the roadmap row's name, use the user's name and rename the row to match in the same change, so branch, folder, roadmap and spec all agree. Say that you did this.
- Derive the slug: the row name in lower-case kebab-case (for example `calculation-engine-core`).

## 3. Create the branch

- Confirm the working tree is clean and `main` is checked out. If the folder is not a git repository yet, initialise it with `main` as the default branch, add a `.gitignore` that excludes any file `AGENTS.md` says to ignore plus `node_modules/`, and make an initial commit of the specs before branching.
- Create and check out `spec/YYYY-MM-DD-<slug>` using today's date.

## 4. Write the three spec files

Create `specs/YYYY-MM-DD-<slug>/` and write the files below. Every file starts with the feature title, the roadmap row number, the branch name, and a link to the governing section of `specs/tech-design-web.md`.

### requirements.md

- **Goal.** One paragraph: what the feature delivers to the user and how it relates to the rows before it.
- **Must do.** Numbered requirements `R1`, `R2`, ... grouped under short headings. Each is one testable sentence. Use the accessible names, values and behaviours the design specifies, word for word; the acceptance tests will assert on them. Include a requirement for the test layers the feature adds or extends.
- **Explicitly not included.** A bulleted list, each item naming the roadmap row that will deliver it. Every capability a reader might expect but that belongs to a later row goes here.

### plan.md

- Open with one sentence restating the stack from the design (plain HTML, CSS and JavaScript ES modules, no framework, no build step, Node's built-in test runner).
- Tables grouped by kind: Tooling, HTML, CSS, JavaScript, Tests. Each row is a file path and one sentence of purpose. Paths are relative to the repo root and follow the current layout (source under `src/`, tests under `test/`, tooling under `tools/`).
- List every file the feature will create or change, including helpers and tooling. The first plan named a serve script without listing its file, and the omission had to be patched after implementation.
- For files that already exist, say what changes.
- End with **Out of scope for this plan**: what the files deliberately do not contain.
- No code, no snippets, no markup.

### acceptance.md

- One line stating which scenarios are manual and which are automated.
- Numbered scenarios `A1`, `A2`, ... grouped under the same headings as the requirements. Each has a bold title and a single Given / When / Then sentence.
- Every requirement maps to at least one scenario, and every scenario is checkable by a test or by a specific manual step. Scenarios that need a committed repository (such as a fresh-clone check) are marked manual and run after the feature commit.
- Automated scenarios query the page by role and accessible name, never by class or tag, so the tests protect what users and assistive technology actually experience.

## 5. Update the roadmap

In `specs/roadmap.md`, set the feature row's status to `in progress` and append `Spec: [YYYY-MM-DD-<slug>](YYYY-MM-DD-<slug>/requirements.md).` to its Build line.

## 6. Check before reporting

- Grep the three new files and the roadmap for any technology the design does not name.
- Confirm the section anchors you linked exist in `specs/tech-design-web.md` (headings become lower-case, punctuation removed, spaces to hyphens).
- Confirm no code was written: the only changes are under `specs/` and the roadmap.

## 7. Report

Stage the changes but do not commit unless asked. Tell the user: the feature chosen and why, the branch name, any roadmap rename or scope interpretation you made, the count of requirements and scenarios, and that the next step is implementation once they approve the plan. Stop there; do not begin implementing.
