# Design Decisions

Locked decisions that constrain ongoing development. These rule out alternatives — do not re-litigate without good reason. Add new decisions here as they are made; remove or correct superseded ones.

---

## No Build Step

**Decision:** The engine runs as pure ES6 modules served directly by a static file server. No transpilation, bundling, or compilation.

**Why:** Simplicity and portability. Any game jam submission or prototype can be opened in a browser with minimal friction. No toolchain to maintain or debug.

**Constraint:** No npm packages that require bundling. No CommonJS (`require`). All third-party libraries must be pre-bundled into `js/libs/` as browser-compatible globals or ES modules.

---

## Scene as Plain Object

**Decision:** Scenes are plain JS objects (or modules exporting an object) with lifecycle methods `show()`, `hide()`, `update(delta)`, `draw()`, `resize()`. No class-based scene hierarchy.

**Why:** Keeps scenes lightweight and easy to write. No inheritance chains to navigate. Fits the game-jam iteration style where scenes are written fast.

**Constraint:** No base class or mixin is enforced. Scenes just need to implement the methods the engine calls.

---

## Canvas Context as Global Import

**Decision:** The 2D canvas context is exported as `c` from `js/core/canvas.js` and imported directly wherever drawing is needed.

**Why:** Eliminates passing the context as a parameter through every function. Consistent with the single-canvas model.

**Constraint:** Only one canvas context at a time. Offscreen canvases for compositing must be created explicitly via `Utils.createCanvas()`.

---

## Delta Time in Milliseconds

**Decision:** `delta` (from `js/core/Timer.js`) is in **milliseconds**, not seconds.

**Why:** Historical decision made early in development; all existing code uses it this way.

**Constraint:** All time-based calculations must divide by 1000 if seconds are needed, or use consistent millisecond arithmetic. Do not change this without updating all callers.

---

## Asset Registry Before Use

**Decision:** All images, fonts, and sounds must be registered in `js/Resources.js` before being referenced elsewhere.

**Why:** Centralized preloading. The `PreloadingManager` reads this registry to know what to load and track progress.

**Constraint:** Never load assets ad-hoc at runtime. If an asset is needed, add it to `Resources.js` first.

---

## Settings in One Place

**Decision:** All tunable game parameters live in `js/Settings.js`. No hard-coded magic numbers for things like canvas size, timing caps, or debug flags.

**Why:** Makes it easy to adjust behavior when reusing the engine for a new project without hunting through source files.

---

## Fixed Aspect Ratio with Letterboxing (Default)

**Decision:** Default canvas behavior is `FIXED_ASPECT_RATIO: true`, which letterboxes the canvas (black bars) to maintain a 16:9 ratio.

**Why:** Consistent game world coordinates regardless of browser window size. Important for games that rely on precise layout.

**Constraint:** Game logic should use canvas-unit coordinates, not pixel coordinates, when `AUTO_RESIZE` is enabled.

---

## Howler.js for Audio

**Decision:** Audio is handled via [Howler.js](https://howlerjs.com/), loaded as a pre-bundled global in `js/libs/howler.min.js`.

**Why:** Howler abstracts the Web Audio API with a clean, well-maintained API; handles polyphony (via `pool`), cross-browser codec fallbacks, and per-instance control via sound IDs. Replaced SoundManager2 (which relied on a Flash fallback) in June 2026.

**Constraint:** Sounds must be registered in `js/Resources.js` with a `source` array (multiple formats for codec fallback) and an `instances` count for the pool size. Audio is managed via `Sound.js` (sound-level) and `SoundInstance.js` (per-instance control).
