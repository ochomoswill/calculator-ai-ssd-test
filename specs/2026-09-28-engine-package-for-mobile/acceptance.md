# Feature 15: Engine Package for Mobile — Acceptance

All scenarios are automated under Node's built-in test runner.

**A1. Package manifest**
Given the engine folder's package manifest, then its name is "@calculator/engine", its type is module, its exports point at the engine entry file, and it declares no dependencies.

**A2. Workspace declared**
Given the root package manifest, then its workspaces list contains the engine folder path.

**A3. Import map on the page**
Given the page, then an import map script appears before the module script and maps "@calculator/engine" to "./js/engine/engine.js".

**A4. Bare specifier everywhere**
Given every module under the source folder and every test file, then none imports the engine by a relative path ending in engine.js, and the wiring module's import list is the bare specifier, the formatter and the storage module.

**A5. Resolves in Node**
Given the workspace is installed, when "@calculator/engine" is imported dynamically, then it exposes the initial-state function and the engine actions, and the engine's own tests run with no DOM.

**A6. Offline list unchanged**
Given the precache list, then it still contains the engine file path so the import map target is cached.
