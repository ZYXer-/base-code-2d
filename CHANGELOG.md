# Changelog

Entries are in reverse chronological order. One bullet per change, one clause per bullet.

---

## 2026-06-10

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
