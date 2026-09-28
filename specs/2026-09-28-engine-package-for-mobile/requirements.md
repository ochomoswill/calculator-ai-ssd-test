# Feature 15: Engine Package for Mobile — Requirements

Roadmap row 15. Branch `spec/2026-09-28-engine-package-for-mobile`.
Design authority: [Requirement 1 of the web technical design](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile) (the engine is a plain JavaScript ES module with no browser dependency, published as an internal package and consumed unchanged by a JavaScript-based mobile app; the web app has no build step).

## Goal

Turn the engine folder into a named internal package that the web app and, later, the mobile app consume by the same bare specifier. With no build step, the browser resolves the specifier through an import map on the page (a web standard), and Node resolves it through an npm workspace link, so the same import line works in both places and the engine's own tests keep running outside a browser.

## Must do

### Package
- R1. The engine folder gains a package manifest naming the package "@calculator/engine", marking it an ES module, exporting its entry module, and listing no dependencies.
- R2. The root package manifest declares the engine folder as an npm workspace so installing creates the link Node uses to resolve the bare specifier.
- R3. The engine's README states the package name and the rule that it may not import anything browser-specific.

### Consumption
- R4. The page carries an import map, placed before the module script, that maps the bare specifier to the engine's entry file, so the browser loads it with no bundler.
- R5. The wiring module imports the engine by the bare specifier only; no source module imports the engine by a relative path.
- R6. Every test that uses the engine imports it by the bare specifier, and the engine's unit tests run in Node's default environment with no DOM.

### Offline and serving
- R7. The precache list still names the engine file by its path, so the import map's target is cached and offline use is unaffected.

### Tests
- R8. Automated tests verify the package manifest fields, the workspace declaration, the import map's specifier and target, that the wiring module imports only the bare specifier, that the specifier resolves in Node to the engine's exports, and that no test or source file imports the engine by a relative path.

## Explicitly not included

- No mobile application itself (not on the roadmap; the brief's mobile app is a separate project that consumes this package).
- No publishing to a registry; the package is internal to this repository.
