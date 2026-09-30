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

**Constraint:** Only one canvas context at a time. Offscreen canvases for compositing must be created explicitly via `CanvasUtils.createCanvas()`.

---

## Delta Time in Seconds

**Decision:** `delta` (from `js/core/Clock.js`) is in **seconds**.

**Why:** Historical decision made early in development; all existing code uses it this way.

**Constraint:** All time-based calculations use seconds directly. Multiply velocity/speed by `delta` to get frame-rate-independent movement.

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

---

## `js/utils/` Grouped into Subfolders

**Decision:** Utility modules live in six topic subfolders under `js/utils/` — `geometry/`, `data/`, `animation/`, `rendering/`, `gui/`, `gameplay/` — rather than one flat directory.

**Why:** The flat directory had grown to ~29 modules, which made it hard to see what the engine offers at a glance. Grouping by topic makes the surface legible and gives new utilities an obvious home.

**Constraint:** Import specifiers are relative, so moving a module means rewriting every specifier both *into* it and *out of* it. There is no bundler or path-alias layer to absorb the change, and ESLint does not resolve import paths, so a broken specifier fails only at runtime in the browser. `tools/check-imports.mjs` guards this and runs as the first step of `npm run lint`.

---

## Tests Are For The Base Code, Not For Games Built On It

**Decision:** The Playwright suite in `test/` verifies that *the engine* boots and runs. It is development infrastructure for this repo only, and is expected to be deleted when the repo is copied as the starting point for an actual game.

**Why:** The engine is edited over years, increasingly by coding agents, and a refactor can silently break it — the 2026-06-12 `js/utils/` move left it unbootable for two months without any check noticing. A boot smoke test closes that gap. A game built on the base code has entirely different things worth testing, so shipping these tests downstream would just be noise the user has to delete.

**Constraint:** Everything test-related stays inside `test/` — including the Playwright config, which is *not* placed at the repo root. Playwright is a `devDependency`. Removal must stay a two-command operation, documented in `test/README.md`. Test code must never be imported by anything under `js/`, and no engine code may be added purely to make tests observable.

**Not covered:** Visual or pixel-snapshot regression testing. Particles, `Math.random`, and delta-time animation make snapshots flaky, and a flaky suite during a game jam is worse than none. Assertions stay structural.

---

## Library Globals Come From Side-Effect Imports

**Decision:** UMD bundles in `js/libs/` that assign a browser global (`offset.min.js` → `Offset`, `fontfaceobserver.js` → `FontFaceObserver`) are pulled in with a bare side-effect import (`import "../libs/offset.min.js";`), not a namespace import, and are declared in the `globals` block of `eslint.config.mjs`.

**Why:** These bundles have no ES exports, so a namespace import binds an empty object that ESLint then reports as an unused variable — inviting a "cleanup" that silently removes the assignment and breaks the feature at runtime. A bare import states the intent.

**Constraint:** Libraries loaded via `<script>` in `index.htm` (Howler) are not imported at all; they only need the ESLint global. Do not mix the two mechanisms for one library.

---

## Plan Docs Are Dated and Carry a Header

**Decision:** A plan is written by `/create-plan-doc` to `docs/plan-<YYYY-MM-DD>-<topic>.md`, dated the day it is first written, and opens with a **Created** / **Updated** / **Status** header followed by the sections Goal, Requirements, Decisions, Things that came up, and Work packages, in that order.

**Why:** Plans are worked across many sessions, increasingly by subagents (`/run-plan`) that see only the doc. A dated name and a maintained header let a fresh session tell at a glance which plan is current and where it stands; the fixed sections give it one place to look for the requirements, the settled decisions, and the questions that came up along the way.

**Constraint:** Every session that changes a plan's content refreshes **Updated** and rewrites **Status**; `/sync-docs` checks this. Work packages carry `<TOPIC>-<NUMBER>` ids numbered on from `BACKLOG.md` so the two never collide. A plan is retired only once nothing in it would be lost.
