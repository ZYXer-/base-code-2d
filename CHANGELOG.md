# Changelog

Entries are in reverse chronological order. One bullet per change, one clause per bullet.

---

## 2026-09-30

- Moved the project skills from `.claude/commands/*.md` to `.claude/skills/<name>/SKILL.md`, Claude Code's documented layout; each now carries `name` and `description` frontmatter, and `onboard` and `create-plan-doc` are marked user-invoked only
- `/onboard` now ends by proposing the next work package (`Next up: <ID> — …`) instead of asking what to work on
- Rewrote `/create-plan-doc`: plans are saved as `docs/plan-<YYYY-MM-DD>-<topic>.md` with a Created/Updated/Status header and fixed Goal, Requirements, Decisions, Things that came up, and Work packages sections; packages use `<TOPIC>-<NUMBER>` ids numbered on from `BACKLOG.md`
- `/sync-docs` now also covers `docs/plan-*.md`, `docs/style.md`, and `test/README.md`, which were missing from its file list
- Added `/requirements-elicitation` (guided brain dump before planning) and `/run-plan` (one subagent per work package, plan doc kept current), plus the `plan-worker` agent definition in `.claude/agents/`
- Documented in `CLAUDE.md` that the `typescript-lsp` plugin is expected at user scope; `typescript-language-server`, `typescript@5.9.3`, and the plugin were already installed
- Recorded the plan-doc convention in `docs/decisions.md` and added "Plan Doc" and "Work Package" to `docs/terminology.md`
- Bumped transitive `qs` (6.15.2 → 6.16.0, via Express) and `brace-expansion` (5.0.9 → 5.0.12, via ESLint) to clear two Dependabot advisories; `npm audit` reports 0 vulnerabilities

---

## 2026-08-21

- Bumped `brace-expansion` 5.0.6 → 5.0.9 (dev-only, via `eslint` → `minimatch`) to clear GHSA-3jxr-9vmj-r5cp and two related DoS advisories
- Bumped `body-parser` 2.2.2 → 2.3.0 (via `express`) to clear GHSA-v422-hmwv-36x6; pulled in `content-type` 2.1.0 as a new transitive dependency
- `npm audit` now reports 0 vulnerabilities
- Backfilled the missing 2026-06-12 changelog entry for the `js/utils/` reorganisation
- Corrected `docs/decisions.md` heading "Delta Time in Milliseconds" to "Seconds" — the body, `CLAUDE.md`, and `Clock.js` (`/1000`) all already said seconds
- Corrected `update(delta)` units in `docs/terminology.md` from milliseconds to seconds
- Updated the `Utils.createCanvas()` reference in `docs/decisions.md` to `CanvasUtils.createCanvas()` (`Utils.js` was deleted in CLN-11)
- Rewrote the `js/utils/` table in `CLAUDE.md` around the six subfolders; added the previously undocumented `Img.js`, `DrawQueue.js`, `TerrainGeneration.js`, and `PixelFontManager.js`
- Moved the demo scenes in `CLAUDE.md` from `js/` to `js/demos/` and listed all six
- Added a `js/utils/` subfolder decision to `docs/decisions.md` and a `DrawQueue` entry to `docs/terminology.md`
- Filed ENG-17 (broken import paths), CLN-13 (18 ESLint errors), and INF-7/INF-8 (import-path linting, dev-server 404 masking)
- Repaired 42 stale relative import specifiers across 15 modules under `js/utils/`, left behind by the 2026-06-12 reorganisation (ENG-17) — the engine could not boot until now
- Added `tools/check-imports.mjs`, which asserts every relative import under `js/` resolves and carries a file extension (INF-7)
- Wired the import check into `npm run lint` ahead of ESLint, and exposed it standalone as `npm run check-imports`
- Verified the fix by walking the import graph from `js/main.js` (59 modules, 0 unresolved) and serving each over the dev server (59/59 returned `application/javascript`)
- Added a Playwright boot smoke test in `test/` — asserts no uncaught/console errors, every module served as JavaScript, canvas renders, and the render loop keeps ticking
- Scoped the suite as base-code-only infrastructure: config lives in `test/`, not the repo root, and `test/README.md` documents a two-command removal for downstream projects
- Added `npm test` and `npm run test:headed`; installed `@playwright/test` as a devDependency and gitignored Playwright artifacts
- Verified the suite fails on a reintroduced ENG-17 regression, reporting the offending URL in ~1s rather than a 25s blank-canvas timeout
- Fixed `PixelText.setFont()` calling undefined `PixelFont.get()` instead of the imported `PixelFontManager.get()` — a dormant ReferenceError (part of CLN-13)
- Converted the load-bearing namespace imports of `fontfaceobserver.js` and `offset.min.js` to bare side-effect imports with explanatory comments — ESLint reported the bindings as unused, inviting a "cleanup" that would have broken web fonts and polygon offsetting at runtime
- Added `FontFaceObserver` to the ESLint globals and clarified which library globals come from `<script>` tags versus side-effect imports
- ESLint errors down from 18 to 14; the remainder are unused imports and args with no runtime risk

---

## 2026-06-12

- Reorganised `js/utils/` into six subfolders: `geometry/`, `data/`, `animation/`, `rendering/`, `gui/`, `gameplay/`
- Updated import paths in all consuming files under `js/`, `js/core/`, and `js/demos/`
- Left intra-`js/utils/` import paths unrewritten in the 14 moved modules that import siblings or reach up into `js/core/` — 42 specifiers still point at pre-move locations (tracked as ENG-17)

---

## 2026-06-11

- Standardised `c` parameter in `DrawUtils.js` (CLN-9): added `c` as first parameter to `drawPolygon`, `drawRoundedCornerRect`, `drawStar`, and `drawHeart` to match the existing convention in `drawCircle`, `drawEllipse`, `drawRing`, `drawCircleSegment`, and `drawRingSegment`; removed the now-unused `import { c }` from `canvas.js`
- Renamed `js/core/Timer.js` → `Clock.js`; updated all 11 importing files to use the `Clock` namespace
- Replaced `js/utils/TimerCallback.js` with a new `Timer` class (`js/utils/Timer.js`): options-object constructor, fluent setters, `pause`/`unpause`/`togglePause`, `finish`/`kill`, `restart`, ping-pong oscillation, configurable loop count, and per-frame callbacks (`onStart`, `onUpdate`, `onProgress`, `onLoop`, `onBounce`, `onEnd`); updated `Clock.js` factory functions to use the new API
- Expanded `StringUtils.js` with `isString`, `isEmptyString`, `isNonemptyString`, and `clip` (CLN-10)
- Added `isNumber` and `toPercentage` to `NumberUtils.js` (CLN-10)
- Removed `Utils.stopwatch()` — superseded by `Timer`; was unused in the codebase; removed now-dead `Clock` and `NumberUtils` imports from `Utils.js`
- Moved `createCanvas` and `getContext` from `Utils.js` into new `js/utils/CanvasUtils.js`; updated `CustomPreloading.js` and `ImageProcessing.js` to import from the new module
- Created `js/utils/DateUtils.js` with `getTimestamp`, `isOlderThan`, `getNiceDateString`, and `getShortDateString`
- Created `js/utils/ControlUtils.js`; moved `getArrowControls` from `Utils.js`; updated `Demo.js` call site
- Created `js/utils/ParallaxUtils.js`; rewrote `parallaxCalculator` as `calculateParallaxLayer` with clearer parameter and variable names; deleted `Utils.js` (CLN-11)

---

## 2026-06-10

- Added `import Vec3` to `Vec2.js` to fix `toVec3()` referencing an undefined global (ENG-6)
- Removed `Vec3.toThree()` — Three.js is not a dependency and the method was dead code (ENG-7)
- Marked ENG-12 closed — `Vec3.js` already had `import Vec2` from a prior change
- Replaced `var` with `let` in `Text.js` (CLN-7): two loop variables in `drawLines()`
- Removed jQuery (CLN-5): replaced all source-file usages with vanilla JS equivalents across `PerformanceMonitor.js`, `Viewport.js`, `Keyboard.js`, `Mouse.js`, `WebFontPreloader.js`, `main.js`, `DataUtils.js`, and `ImageProcessing.js`; deleted `js/libs/jquery-3.4.1.min.js`
- Modernised `Mouse.js` as part of CLN-5: switched `event.which` → `event.button`, `mousewheel`/`DOMMouseScroll` → `wheel`, unwrapped `event.originalEvent` touch/scroll references, added `{ passive: false }` where `preventDefault()` is called
- Replaced `jQuery.extend(true, ...)` with `structuredClone` in `DataUtils.deepCopy`
- Updated `CLAUDE.md` to remove jQuery from entry-point description and third-party libs list
- Replaced `screenfull.js` with the native Fullscreen API (ENG-3): rewrote `isFullScreen`, `makeFullScreen`, `exitFullScreen`, and `toggleFullScreen` in `Viewport.js` using `document.fullscreenElement`, `requestFullscreen()`, and `exitFullscreen()`; deleted `js/libs/screenfull.min.js`
- Removed stale `screenfull`, `jQuery`, and `$` ESLint globals from `eslint.config.mjs`
- Applied keyword-spacing fix (CLN-8) across 28 files via `npm run lint -- --fix`: `if(` → `if (`, `for(` → `for (`, `while(` → `while (`, etc.; also removed two stray leading blank lines in `canvas.js`
- Modernised `PageVisibility.js` (ENG-4): removed vendor-prefix detection (`mozHidden`, `webkitHidden`, `msHidden`), removed IE 9 fallback, switched from property assignment to `addEventListener` for `focus`/`blur`/`pageshow`/`pagehide`, replaced `document[hiddenAttr]` with `document.hidden`, replaced `hasOwnProperty` with `Object.hasOwn`
- Changed object literal colon spacing style from `{ key : value }` to `{ key: value }` (AirBnB default); updated `eslint.config.mjs` (`key-spacing` simplified to `"warn"`), removed the now-standard section from `docs/style.md`, and updated the deviation count from four to three
- Applied key-spacing fix across 43 files via `npm run lint -- --fix`
- Fixed unhandled Promise rejections in `Viewport.makeFullScreen` / `exitFullScreen` — added `.catch(() => {})` to `requestFullscreen()` and `exitFullscreen()` calls
- Fixed `isOver` TDZ variable shadow in `Mouse.updateHoverAreas` — `const isOver = isOver(...)` caused a ReferenceError; renamed local to `hovering` and unused destructured `name` to `_`
- Fixed missing trailing newlines in `js/main.js`, `js/utils/ImageProcessing.js`, `js/BasicTooltipPainter.js`
- Replaced `hasOwnProperty` with `Object.hasOwn` (CLN-6) across `Button.js`, `ParticleSystem.js`, `Text.js`, `Utils.js`, `ImageProcessing.js`, and `PixelFontManager.js`
- Deleted orphaned `js/libs/soundmanager2.js` — not referenced anywhere after the Howler migration
- Renamed backlog topic abbreviation `DEM` → `DEMO`; moved CLN-3 and CLN-4 (demo assets and `OldDemoScene.js`) into the DEMO section as DEMO-4 and DEMO-5

---

## 2026-06-09

- Replaced SoundManager2 with Howler.js: rewrote `Sound.js` and `SoundInstance.js` around the Howler API; replaced `SoundPreloader.js` to create `Howl` objects (with `pool` for polyphony); deleted `SoundManagerPreloader.js` and removed its init stage from `PreloadingManager.js`
- Removed manual fade loop from `Sound.js` — fades now delegated to `Howler.fade()`
- Changed `DEFAULT_SOUND_VOLUME` from 0–100 scale to 0–1 to match Howler; updated `SOUND_PERCENTAGE` from 10 to 15 (absorbed the removed SM2 init stage's 5%)
- Added `howler.min.js` to `js/libs/` and wired it as a script tag in `index.htm`
- Added `curly` ESLint rule (error) to enforce braces on all control-flow bodies; documented in `docs/style.md`
- Updated `docs/decisions.md` to document Howler.js as the audio library (superseding SoundManager2 entry); removed completed AUD items from `BACKLOG.md`
- Initialized project documentation: `CLAUDE.md`, `README.md`, `BACKLOG.md`, `CHANGELOG.md`, `docs/decisions.md`, `docs/terminology.md`
- Added `.claude/commands/onboard.md` and `.claude/commands/sync-docs.md` skills for AI-assisted development
- Split `Utils.js` into `NumberUtils.js` (numeric/random helpers), `DataUtils.js` (arrays, objects, matrix, IDs), and `StringUtils.js` (string helpers); `Utils.js` retains canvas creation, parallax, stopwatch, and arrow-key controls
- Updated all callers across `js/core/` and `js/utils/` to import from the new modules using namespace imports (`* as NumberUtils`, `* as DataUtils`)
- Auto-fixed keyword-spacing, prefer-const, and trailing-space warnings across all `js/utils/` files via ESLint `--fix`
- Fixed `!=` → `!==` in `Particle.js`, removed unused GeometryUtils imports in `Easing.js` and `TerrainGeneration.js`, added missing `Timer` import to `Utils.js` `stopwatch`
- Added backlog items CLN-9 (DrawUtils `c` param inconsistency), CLN-10 (expand StringUtils), CLN-11 (rehome remaining Utils.js functions)

---

## 2022 (approximate) — Post-LD50 Update

- `FIXED_SIZE_IN_UNITS` can now be used to constrain only one viewport dimension (previously required both)

---

## ~2020 — Pre-Ludum-Dare / GGJ Fixes

- Fixed `PauseScreen` missing `Text` import
- Fixed Tooltip dimension reading
- Fixed Tooltip deep compare for object content
- Started splitting `Utils.js` into `DrawUtils.js` and `GeometryUtils.js` (WIP)
- Various minor bugfixes discovered during GGJ 2020
- Updated Express dependency
