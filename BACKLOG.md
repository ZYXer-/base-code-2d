# Backlog

Format: `<TOPIC>-<NUMBER>` — check off items as they are completed.

## Topics
- **CLN** — Cleanup / refactoring
- **DEMO** — Demo scenes
- **DOC** — Documentation
- **ENG** — Engine core
- **INF** — Infrastructure / tooling
- **UI** — UI components

---

## CLN — Cleanup / Refactoring

- [x] **CLN-1** Complete the `Utils.js` → `DrawUtils.js` + `GeometryUtils.js` split (started per git history, WIP)
- [x] **CLN-2** Remove or replace remaining references to the old `Utils.js` once the split is complete
- [x] **CLN-5** Review jQuery usage — most usages are simple DOM ops that could be replaced with vanilla JS
- [x] **CLN-6** Replace `options.hasOwnProperty(x)` with `Object.hasOwn(options, x)` throughout (ESLint `no-prototype-builtins` — ~48 occurrences, mainly in `Button.js` and `ParticleSystem.js`)
- [x] **CLN-7** Replace `var` with `let`/`const` in `Text.js` (15 occurrences flagged by ESLint)
- [x] **CLN-8** Add space between control-flow keywords and `(` across all source files — `if(` → `if (`, `for(` → `for (`, etc. (ESLint `keyword-spacing` auto-fixable: `npm run lint -- --fix`)
- [x] **CLN-9** Fix inconsistent `c` parameter in `DrawUtils.js`
- [x] **CLN-10** Expand `StringUtils.js` with more string utility functions (user has additional string utils to add)
- [x] **CLN-11** Move remaining `Utils.js` functions (`parallaxCalculator`, `getArrowControls`) to appropriate files; `Utils.js` should eventually be empty
- [ ] **CLN-12** Audit `Object.hasOwn` usages added in CLN-6 — many were originally existence checks used as a proxy for truthiness (written before `?.` existed); where the option value is never a falsy non-default (e.g. `0`, `false`, `""`), replace with optional chaining (`options.x ?? default`) for cleaner intent

---

## DEMO — Demo Scenes

- [ ] **DEMO-1** Create an Img demo scene showcasing image drawing with transforms and rotation
- [ ] **DEMO-2** Create a DrawUtils demo scene showing all drawing primitives (circles, polygons, stars, rounded rects, Bezier, etc.)
- [ ] **DEMO-3** Create a Tooltip demo scene showing tooltip attachment, hover behaviour, and configuration options
- [ ] **DEMO-4** Audit and remove unused demo assets (`test.png`, `test2.png`, `demo_data.png`, cannon sounds)
- [ ] **DEMO-5** Remove or consolidate `OldDemoScene.js` (legacy)

---

## DOC — Documentation

- [ ] **DOC-1** Add JSDoc comments to all `js/core/` modules
- [ ] **DOC-2** Add JSDoc comments to all `js/utils/` modules
- [ ] **DOC-3** Document the scene lifecycle (show/hide/update/draw/resize) with an example
- [ ] **DOC-4** Document the asset preloading stages and how to add new asset types

---

## ENG — Engine Core

- [ ] **ENG-1** Fix Tooltip dimension reading (noted as broken in git history)
- [ ] **ENG-2** Verify `FIXED_SIZE_IN_UNITS` works correctly when constraining only one dimension (fixed in LD50 update — add a regression test or demo)
- [x] **ENG-3** Replace `screenfull.js` with the native Fullscreen API (broadly supported now)
- [x] **ENG-4** Review `PageVisibility.js` for edge cases (e.g. resize event on focus regain)
- [ ] **ENG-5** Add TypeScript type definitions or JSDoc types for the public API surface
- [x] **ENG-6** Fix `Vec2.toVec3()` — calls `new Vec3()` but `Vec3` is never imported in `Vec2.js` (ESLint `no-undef`)
- [x] **ENG-7** Fix or remove `Vec3.toTHREE()` — calls `new THREE.Vector3()` but Three.js is not a dependency (ESLint `no-undef`)
- [ ] **ENG-8** Fix `Text.js` — `drawPosIn`, `drawTextIn`, `drawPosTextIn` call `this.draw(c)` instead of `this.drawIn(c)`, so the passed canvas context is silently ignored and drawing always goes to the global canvas
- [ ] **ENG-9** Fix `Text.js` — coerce `text` argument to string in `setText()` (`String(text)`); a non-string value (e.g. a number) causes `applyMultiline()` to crash or loop when it calls `.split()` on the value
- [ ] **ENG-10** Fix `Mouse.js` `getPositionFromTouchEvent` — use `.changedTouches` instead of `.touches`; on `touchend` events `.touches` is empty (finger already lifted), so position is lost
- [ ] **ENG-11** Add `lighten()` function to `ImageProcessing.js` (from GTC Game Jam 2023) — brightens sampled pixel data by scaling RGB channels toward white by a given factor
- [x] **ENG-12** Fix `Vec3.js` — add missing `import Vec2` (symmetric bug to ENG-6; `Vec3` references `Vec2` without importing it)
- [ ] **ENG-13** Add a download-file utility function — triggers a browser file download from JS (data URI + `<a>` element trick); reference snippet in `how_to_make_downloadable_file_in_js.txt`
- [ ] **ENG-14** Add `Color.darken()`, `Color.lighten()`, `Color.setSaturation()` to `Color.js`; operate in HSL space; reference implementations from LD42
- [ ] **ENG-15** Port voxel graphics renderer from LD42 into the engine — 2D renderer that draws voxel-style stacked graphics onto the canvas
- [ ] **ENG-16** Port `Camera` / projection object from LD42 (`temp/camera.js`) — oblique/isometric projection with `worldToScreen`, `screenToWorld`, `worldToScreen3D`, and `apply`/`restore` canvas helpers; pairs with ENG-15

---

## INF — Infrastructure

- [x] **INF-1** Add a `package.json` start script (`"start": "npm start"`)
- [ ] **INF-3** Add a `.editorconfig` for consistent indentation across editors
- [x] **INF-4** Set up ESLint with a custom config matching project style
- [ ] **INF-5** Restructure repo — move current root content (demos, assets, entry point) into an `example/` subfolder so the engine and the example game are clearly separated
- [ ] **INF-6** Clearly separate engine/library code from game boilerplate so the engine can be copied into a new project without carrying demo scaffolding (related to INF-5)

---

## UI — UI Components

- [ ] **UI-1** Add keyboard navigation support to `Button.js`
- [ ] **UI-2** Review `PauseScreen.js` imports (noted as broken in git history — `Text` import missing)
