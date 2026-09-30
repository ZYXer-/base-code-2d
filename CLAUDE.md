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
- `index.htm` — Creates the canvas, loads Howler.js and ES6 modules
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
| `Img.js` | Image drawing: `drawSprite`, `drawSpriteScaled`, transforms |
| `Clock.js` | Delta time, timed callbacks: `countdown`, `doFor`, `repeatEvery` |
| `Sound.js` + `SoundInstance.js` | Audio via Howler.js; per-instance control via sound IDs and `SoundInstance` wrapper |
| `PerformanceMonitor.js` | FPS + per-stage timing display |
| `PageVisibility.js` | Pause on browser blur |
| `Tooltip.js` | Tooltip rendering |
| `GlobalControls.js` | Global keyboard shortcuts (F11=fullscreen, P=pause, M=mute, Q=particles) |

### Input (`js/core/input/`)
- `Keyboard.js` — Key press/release with key constants; `isPressed(keyCode)`, event handlers
- `Mouse.js` — Multi-button, hover areas, scroll, touch, drag-and-drop; `pos` Vec2 export

### Preloading (`js/core/resourcePreloading/`)
Staged loading with weighted percentages: Images (30%) → Pixel fonts (5%) → Web fonts (10%) → Sounds (15%) → Fake delay (40%).

### Utilities (`js/utils/`)
Grouped into six topic subfolders. Import paths are relative; `npm run check-imports` verifies they all resolve.

**`geometry/`**
| File | Role |
|---|---|
| `Vec2.js`, `Vec3.js` | 2D/3D vector math |
| `GeometryUtils.js` | Math constants, collision detection |

**`data/`**
| File | Role |
|---|---|
| `NumberUtils.js` | Random, clamp, min/max, scale, number formatting |
| `DataUtils.js` | Arrays, objects, matrix creation, unique IDs, shallow/deep copy |
| `StringUtils.js` | String helpers (`isString`, `isEmptyString`, `isNonemptyString`, `titleCase`, `clip`) |
| `DateUtils.js` | Timestamp, date formatting (`getNiceDateString`, `getShortDateString`), `isOlderThan` |

**`animation/`**
| File | Role |
|---|---|
| `Timer.js` | Time-based value animator; looping, ping-pong, pause/resume, per-frame callbacks |
| `Easing.js` | Sin/quad/cubic easing + `accelerateToPos()` |
| `Acceleratable.js` | Physics-based movement (acceleration, max velocity, 8-way input) |
| `ParticleSystem.js` + `Particle.js` | Continuous/burst particle emitters with callbacks |
| `Shaking.js` | Screen shake with decaying amplitude |
| `ParallaxUtils.js` | Tile layout calculator for parallax scrolling backgrounds |
| `Humanoid.js` | Character animation framework |

**`rendering/`**
| File | Role |
|---|---|
| `DrawUtils.js` | Shape primitives (circles, polygons, stars, rounded rects, Bezier) |
| `CanvasUtils.js` | Offscreen canvas creation and 2D context helper |
| `Color.js` | RGB + HSL color class |
| `DrawQueue.js` | Batched list of drawables with a `needsUpdate` dirty flag |
| `ImageProcessing.js` | Sample pixel data from images into 2D arrays |
| `IntegerScaling.js` | Pixel-perfect integer scaling for pixelated aesthetics |

**`gui/`**
| File | Role |
|---|---|
| `Text.js` | Web font text rendering with border, alignment, animation |
| `PixelText.js` | Sprite-based pixel font rendering |
| `PixelFontManager.js` | Registry of loaded pixel fonts |
| `Button.js` | Interactive buttons with hover/press states and tooltips |

**`gameplay/`**
| File | Role |
|---|---|
| `ControlUtils.js` | Arrow/WASD input → normalised `Vec2` direction |
| `PathFinding.js` | A* pathfinding |
| `PriorityQueue.js` | Priority queue (used by pathfinding) |
| `TerrainGeneration.js` | Perlin noise and terrain heightmap generation |

### Scenes (`js/` and `js/demos/`)
- `js/LoadingScene.js` — Loading bar, transitions to `SCENE_AFTER_LOADING` when done
- `js/IngameScene.js` — Template for main gameplay (replace for actual games)
- `js/EmptyScene.js` — Blank scene template
- `js/PauseScreen.js` — Pause overlay
- `js/demos/DemoMenuScene.js` — Menu for demo scenes (current default after loading)
- `js/demos/Demo.js` — Comprehensive feature showcase
- `js/demos/DemoParticlesScene.js`, `DemoSoundScene.js`, `DemoBox2dScene.js` — Focused feature demos
- `js/demos/OldDemoScene.js` — Legacy demo, slated for removal (DEMO-5)

### Third-Party Libraries (`js/libs/`)
- Howler.js 2.2.4, Box2D, FontFaceObserver, polygon offset

## Conventions

- **No build step.** Pure ES6 modules, `import`/`export` throughout. Do not introduce bundlers or transpilers without discussion.
- **Scenes** are plain objects with lifecycle methods `show()`, `hide()`, `update(delta)`, `draw()`, `resize()`. Create new scenes by following `EmptyScene.js`.
- **Canvas context** is imported as `c` from `js/core/canvas.js`. Draw calls go directly on `c`.
- **Delta time** is imported as `delta` from `js/core/Clock.js` (seconds).
- **Assets** must be registered in `js/Resources.js` before use.
- **Settings** live in `js/Settings.js`. Do not hard-code tunable values elsewhere.
- **Global keyboard shortcuts** go in `js/GlobalControls.js`.
- **Language servers:** the `typescript-lsp` plugin should be installed at user scope for this repo's language (JavaScript). If the LSP tool is missing or a go-to-definition fails, tell the user rather than working around it.

## Testing

`test/` holds a Playwright boot smoke test for **the engine itself** — it asserts modules execute, the canvas renders, and the render loop keeps ticking. It is base-code infrastructure and is meant to be deleted when this repo is copied to start a real game; see `test/README.md`.

It complements `check-imports`: that guard proves modules *resolve*, the suite proves they *execute*. Neither replaces the other. Keep assertions structural — no pixel snapshots.

## Known Issues / Status

- The dev server's `app.get("/{*path}")` fallback in `nodeServer.js` returns `index.htm` (`text/html`) for missing files, so a bad module path surfaces as a MIME-type error rather than a 404. `npm run check-imports` catches this class of break at lint time; narrowing the fallback itself is tracked as INF-8.
- `npm run lint` reports 14 pre-existing errors (unused imports and unused function args; no runtime risk). Tracked as CLN-13.
- Documentation was essentially nonexistent before June 2026 — docs are being built up incrementally.

## Useful Commands

```bash
npm run lint            # import-path check, then ESLint
npm run check-imports   # import-path check on its own
npm test                # Playwright engine boot smoke test
git log --oneline -10   # recent history
```

`npm run lint` runs `tools/check-imports.mjs` **before** ESLint: there is no build step, so nothing rewrites import paths when a module moves, and ESLint does not resolve specifiers. Any relative import under `js/` that does not resolve — or that omits its file extension — fails the run.
