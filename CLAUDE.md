# CLAUDE.md — 2D Game Engine Base Code

This is a browser-based 2D game engine built in vanilla JavaScript and Canvas, developed by Henry Raymond over ~10 years. It is used as a personal starting point for game jams, game prototypes, and technical prototypes. There is no build step — it runs directly via a small Express dev server.

## How to Run

```bash
npm install      # only needed once
npm start
```
Then open `http://localhost:8080` in a browser. The entry point is `index.htm`.

## Architecture Overview

### Entry Point
- `index.htm` — Creates the canvas, loads jQuery and ES6 modules
- `js/main.js` — Calls `Game.start()` on document ready
- `js/Settings.js` — All tunable parameters (canvas size, timing, debug flags, etc.)
- `js/Resources.js` — Centralized registry of all image, font, and sound assets
- `js/Scenes.js` — Defines `INITIAL_SCENE` and `SCENE_AFTER_LOADING`
- `js/CustomPreloading.js` — Hook for game-specific preload logic

### Core Systems (`js/core/`)
| File | Role |
|---|---|
| `Game.js` | Main game loop (`requestAnimationFrame`), orchestrates all subsystems |
| `SceneManager.js` | Scene lifecycle: `show()`, `hide()`, `update()`, `draw()`, `resize()` |
| `Viewport.js` + `canvas.js` | Canvas setup, responsive resizing, pixel ratio, fullscreen |
| `Timer.js` | Delta time, timed callbacks: `countdown`, `doFor`, `repeatEvery` |
| `Sound.js` + `SoundInstance.js` | Audio via SoundManager2; per-sound instance pooling |
| `PerformanceMonitor.js` | FPS + per-stage timing display |
| `PageVisibility.js` | Pause on browser blur |
| `Tooltip.js` | Tooltip rendering |
| `GlobalControls.js` | Global keyboard shortcuts (F11=fullscreen, P=pause, M=mute, Q=particles) |

### Input (`js/core/input/`)
- `Keyboard.js` — Key press/release with key constants; `isPressed(keyCode)`, event handlers
- `Mouse.js` — Multi-button, hover areas, scroll, touch, drag-and-drop; `pos` Vec2 export

### Preloading (`js/core/resourcePreloading/`)
Staged loading with weighted percentages: SoundManager init (5%) → Images (30%) → Pixel fonts (5%) → Web fonts (10%) → Sounds (10%) → Fake delay (40%).

### Utilities (`js/utils/`)
| File | Role |
|---|---|
| `Vec2.js`, `Vec3.js` | 2D/3D vector math |
| `DrawUtils.js` | Shape primitives (circles, polygons, stars, rounded rects, Bezier) |
| `GeometryUtils.js` | Math constants, collision detection |
| `Utils.js` | Random, clamp, scale, unique IDs, matrix creation |
| `Text.js` | Web font text rendering with border, alignment, animation |
| `PixelText.js` | Sprite-based pixel font rendering |
| `Color.js` | RGB + HSL color class |
| `Button.js` | Interactive buttons with hover/press states and tooltips |
| `ParticleSystem.js` + `Particle.js` | Continuous/burst particle emitters with callbacks |
| `Easing.js` | Sin/quad/cubic easing + `accelerateToPos()` |
| `Shaking.js` | Screen shake with decaying amplitude |
| `IntegerScaling.js` | Pixel-perfect integer scaling for pixelated aesthetics |
| `Acceleratable.js` | Physics-based movement (acceleration, max velocity, 8-way input) |
| `PathFinding.js` | A* pathfinding |
| `PriorityQueue.js` | Priority queue (used by pathfinding) |
| `ImageProcessing.js` | Sample pixel data from images into 2D arrays |
| `Humanoid.js` | Character animation framework |

### Scenes (`js/`)
- `LoadingScene.js` — Loading bar, transitions to `SCENE_AFTER_LOADING` when done
- `DemoMenuScene.js` — Menu for demo scenes (current default after loading)
- `Demo.js` — Comprehensive feature showcase
- `IngameScene.js` — Template for main gameplay (replace for actual games)
- `EmptyScene.js` — Blank scene template
- `PauseScreen.js` — Pause overlay

### Third-Party Libraries (`js/libs/`)
- jQuery 3.4.1, SoundManager2, screenfull, Box2D, FontFaceObserver, polygon offset

## Conventions

- **No build step.** Pure ES6 modules, `import`/`export` throughout. Do not introduce bundlers or transpilers without discussion.
- **Scenes** are plain objects with lifecycle methods `show()`, `hide()`, `update(delta)`, `draw()`, `resize()`. Create new scenes by following `EmptyScene.js`.
- **Canvas context** is imported as `c` from `js/core/canvas.js`. Draw calls go directly on `c`.
- **Delta time** is imported as `delta` from `js/core/Timer.js` (milliseconds).
- **Assets** must be registered in `js/Resources.js` before use.
- **Settings** live in `js/Settings.js`. Do not hard-code tunable values elsewhere.
- **Global keyboard shortcuts** go in `js/GlobalControls.js`.

## Known Issues / Status

- Audio system (SoundManager2) uses Adobe Flash as a fallback — this is outdated and should be removed. See `AUD` items in BACKLOG.md.
- `Utils.js` was being split into `DrawUtils.js` and `GeometryUtils.js` (WIP per git history) — migration is incomplete.
- Documentation was essentially nonexistent before June 2026 — docs are being built up incrementally.

## Useful Commands

```bash
git log --oneline -10   # recent history
```
