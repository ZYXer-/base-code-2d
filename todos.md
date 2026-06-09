# TODOs

Collected from personal notes over the years. Each item is a standalone task.

---

## 1. Bug: Text.js — `drawPosIn`, `drawTextIn`, `drawPosTextIn` call wrong internal method

**File:** [js/utils/Text.js](js/utils/Text.js) — lines 379, 385, 391

The three "In" variant methods (`drawPosIn`, `drawTextIn`, `drawPosTextIn`) each accept a canvas context `c` as their first argument, but internally they call `this.draw(c)` instead of `this.drawIn(c)`. The problem is that `draw()` ignores its argument — it unconditionally draws to the globally imported canvas context. So passing a custom canvas context (e.g. an offscreen canvas) to any of these methods silently has no effect. The fix is to change the call inside each of those three methods from `this.draw(c)` to `this.drawIn(c)`.

---

## 2. Bug: Text.js — non-string `text` argument can cause a crash or infinite loop

**File:** [js/utils/Text.js](js/utils/Text.js)

If a caller passes a non-string value to `setText()` (e.g. a number like `42` or `0`), the value is stored directly as `this.text`. When `applyMultiline()` is subsequently called, it attempts `this.text.split("\n")`, which does not exist on numbers, causing a crash. In certain edge cases involving the word-wrap or appear animation logic, this could instead manifest as an infinite loop. The fix is to coerce the input to a string at the top of `setText()`: `text = String(text)`.

---

## 3. Feature: Integrate Howler.js as the audio library

Replace the current SoundManager2 audio backend with [Howler.js](https://howlerjs.com/), a modern JavaScript audio library built on the Web Audio API. Howler supports sprites, fading, spatial audio, and works across all current browsers without any Flash fallback. This is a more opinionated version of the general AUD-2 task — the target library is specifically Howler.js rather than rolling a raw Web Audio API implementation.

---

## 4. Bug: Mouse.js — `getPositionFromTouchEvent` should use `.changedTouches`, not `.touches`

**File:** [js/core/input/Mouse.js](js/core/input/Mouse.js)

The `getPositionFromTouchEvent` function reads touch coordinates from `event.touches`. This is wrong for `touchend` events: when a finger lifts off the screen, `.touches` no longer contains that touch (it lists only currently active touches), so the position would be missing or incorrect. The correct property is `event.changedTouches`, which always lists the touches that triggered the current event — including a finger that just lifted. Change the read from `.touches[0]` to `.changedTouches[0]`.

---

## 5. Feature: Add `lighten()` to ImageProcessing.js

**File:** [js/utils/ImageProcessing.js](js/utils/ImageProcessing.js)

From GTC Game Jam 2023. Add a `lighten()` function to `ImageProcessing.js` that brightens the pixel data sampled from an image. The existing file already reads pixel data into 2D arrays; `lighten()` would post-process those values to increase brightness (e.g. by scaling RGB channels upward or blending toward white by a given factor).

---

## 6. Bug: Vec3.js does not import Vec2

**File:** [js/utils/Vec3.js](js/utils/Vec3.js)

`Vec3.js` references `Vec2` (likely in a method that constructs or returns a Vec2, such as a projection helper), but never imports it. This causes a `ReferenceError` at runtime whenever that code path is hit. The fix is to add the appropriate `import Vec2 from "./Vec2.js"` at the top of the file.

---

## 7. Feature: Add a "download file" utility function

Add a utility function to the engine (likely in `Utils.js` or a new `FileUtils.js`) that triggers a browser file download from JavaScript, without any server round-trip. The technique: create an `<a>` element, set its `href` to a data URI containing the file content (e.g. `data:text/csv;charset=utf-8,...`), set the `download` attribute to the desired filename, and programmatically call `.click()` on it. Useful for exporting game data, level saves, or debug stats as CSV or JSON files directly from the game. The reference implementation is in `how_to_make_downloadable_file_in_js.txt` in the base code folder.

---

## 8. Feature: Add `darken()`, `lighten()`, and `setSaturation()` to Color.js

**File:** [js/utils/Color.js](js/utils/Color.js)

Add three new instance methods to the `Color` class:

- `darken(amount)` — decreases the lightness/brightness of the color
- `lighten(amount)` — increases the lightness/brightness of the color
- `setSaturation(value)` — sets the saturation of the color to a given level (HSL-based)

Reference implementations exist in the LD42 project. These operations are most naturally expressed in HSL space; `Color` already tracks RGB and HSL, so the additions should be straightforward.

---

## 9. Refactor: Improve folder structure — move current content into an `example/` subfolder

The current repository root mixes engine code with game-specific demo/example content (scenes, assets, entry point). The goal is to restructure the repo so that a clean `example/` folder contains everything that currently lives at the root (including `index.htm`, demo scenes, assets, etc.), while the engine library code lives clearly at the top level or in a `lib/` folder. This would make it easier to copy just the engine into a new project without also copying all the demo scaffolding.

---

## 10. Refactor: Clearly separate library code from boilerplate code

Related to item 9 above. Right now, engine code (core systems, utilities) and game-specific boilerplate (scene templates, demo content, entry point) are intermingled. The goal is a clear boundary: one part of the codebase is the reusable engine (you copy it into every project), and another part is the example/starter scaffolding (you copy it once, then replace it). This may overlap significantly with item 9 depending on how the folder restructure is done.

---

## 11. Refactor: Complete the `Utils.js` split into per-functionality files

**Files:** [js/utils/Utils.js](js/utils/Utils.js), [js/utils/DrawUtils.js](js/utils/DrawUtils.js), [js/utils/GeometryUtils.js](js/utils/GeometryUtils.js)

The split of the monolithic `Utils.js` into separate files was started (per git history) but never finished. The work involves migrating all remaining utility functions out of `Utils.js` into appropriately named files (e.g. `DrawUtils.js` for canvas drawing helpers, `GeometryUtils.js` for math/collision, possibly others), then updating all import sites. Already tracked as CLN-1 and CLN-2 in BACKLOG.md.

---

## 12. Feature: Create an Img demo scene (with transform and rotation)

Create a new demo scene that showcases the image/sprite rendering capabilities of the engine, specifically:
- Drawing images at arbitrary positions
- Applying transforms (scale, translate)
- Rotating images around a pivot point

This would join the existing demo scenes in `DemoMenuScene.js` and serve as a live reference for how to draw images using the engine's APIs.

---

## 13. Feature: Create a DrawUtils demo scene

Create a new demo scene that visually showcases all of the drawing primitives available in `DrawUtils.js` — circles, polygons, stars, rounded rectangles, Bezier curves, etc. Useful both as a visual test and as a live reference for what the drawing API can do.

---

## 14. Feature: Create a Tooltip demo scene

Create a new demo scene that demonstrates the Tooltip system: how to attach tooltips to UI elements (Buttons), how they appear on hover, and how to configure their content and positioning. Useful as a live reference and regression check for Tooltip behaviour.

---

## 15. Housekeeping: Commit accumulated changes to Git

A reminder (from an earlier point in time) to commit a batch of uncommitted or staged changes to the git repository. The original note said "Git2" — this was likely just a typo or stray character. At the time of writing this was an actual outstanding action item; it may already be done.

---

## 16. Feature: Integrate voxel model renderer from LD42

Port the voxel graphics renderer from the Ludum Dare 42 project into the base code engine. This is a 2D renderer that draws voxel-style graphics onto the canvas — it works in the 2D context but renders objects that look like stacked 3D voxels, likely by drawing layered quads or shapes with appropriate shading. The renderer would pair naturally with the Camera/projection object described in item 17.

---

## 17. Feature: Port the Camera / projection object from LD42

Port the `Camera` object from LD42 (currently saved in [temp/camera.js](temp/camera.js)) into the engine as a reusable utility. This camera implements an oblique/isometric projection with a configurable angle, mapping 3D world coordinates `(x, y, z)` to 2D screen coordinates using a matrix of projection parameters. Key methods:

- `worldToScreen(x, y)` — projects a 2D world position to screen space
- `worldToScreen3D(x, y, z)` — projects a 3D world position (including height) to screen space
- `screenToWorld(pos)` — inverse projection from screen back to world space
- `apply()` / `restore()` — wraps the canvas context transform so all drawing after `apply()` is automatically offset by the camera position

The camera also integrates with `Acceleratable` for smooth keyboard-driven panning with acceleration. It would be used together with the voxel renderer from item 16.
