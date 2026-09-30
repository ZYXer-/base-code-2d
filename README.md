# 2D Game Engine Base Code

A personal browser-based 2D game engine built in vanilla JavaScript and Canvas, developed by Henry Raymond over roughly a decade. Used as a starting point for game jams, game prototypes, and technical experiments.

## What This Is

This repo is **not a library you install** — it is a living, runnable template. You clone it, point it at your game idea, and build from there. It comes pre-wired with:

- A **game loop** with delta-time and frame-rate cap
- A **scene system** (show/hide/update/draw/resize lifecycle)
- **Keyboard + mouse + touch** input handling
- A **sound system** (Howler.js) with per-sound instance pooling and per-instance volume/fade control
- **Asset preloading** with a staged loading bar
- **Responsive canvas** with fixed aspect ratio, pixel-ratio support, and optional integer scaling
- **Particle system** (continuous stream or burst)
- **Text rendering** — web fonts and sprite-based pixel fonts
- **Buttons and tooltips**
- **Easing functions** and screen shake
- **2D/3D vector math**, geometry utilities, A* pathfinding
- **Box2D physics** (optional, library included)
- A **demo suite** showcasing most features out of the box
- A tiny **Express dev server**

## Requirements

- Node.js (for the dev server)
- A modern browser (Chrome, Firefox, Edge — no IE)

## Getting Started

```bash
git clone <this repo>
cd <repo>
npm install
npm start
```

Open `http://localhost:8080`. You should see the loading screen followed by the demo menu.

## Project Layout

```
index.htm             # HTML entry point — sets up the canvas
nodeServer.js         # Express dev server (port 8080)
js/
  main.js             # Bootstraps Game.start()
  Settings.js         # All tunable parameters
  Resources.js        # Asset registry (images, fonts, sounds)
  Scenes.js           # Which scene is initial / shown after loading
  CustomPreloading.js # Hook for custom preload logic
  core/               # Engine core (game loop, input, audio, viewport, timer…)
  utils/              # Reusable utilities, grouped by topic
    geometry/         # Vec2, Vec3, collision + math helpers
    data/             # Numbers, arrays/objects, strings, dates
    animation/        # Timer, easing, particles, shake, parallax
    rendering/        # Draw primitives, colour, offscreen canvas, scaling
    gui/              # Text, pixel text, buttons
    gameplay/         # Controls, pathfinding, terrain generation
  demos/              # Example scenes demonstrating engine features
  libs/               # Bundled third-party libraries
css/                  # Minimal layout styles + web fonts
img/                  # Image assets
audio/                # Sound assets
tools/                # check-imports.mjs (import-path guard)
test/                 # Engine boot smoke test — delete for a new project
docs/                 # Design decisions, terminology, style, plan docs
.claude/              # Claude Code skills (onboard, sync-docs, plan workflow) and the plan-worker agent
```

## Making a Game

1. Register your assets in `js/Resources.js`.
2. Create a scene (copy `js/EmptyScene.js`) and add your `update()`/`draw()` logic.
3. Set your scene as `SCENE_AFTER_LOADING` in `js/Scenes.js`.
4. Tweak canvas size, aspect ratio, and other settings in `js/Settings.js`.

The demo scenes in `js/demos/` show how to use particles, buttons, text, sounds, physics, and more — `js/demos/Demo.js` is the broadest of them.

## Developing the Base Code Itself

*(Skip this section if you are building a game — it is about maintaining the engine.)*

```bash
npm run lint     # verifies every import path resolves, then runs ESLint
npm test         # Playwright smoke test: does the engine still boot and render?
```

The `test/` suite exists to catch refactors that break the engine. It is **not**
useful for a game built on this repo — when you copy the base code for a new
project, delete it:

```bash
rm -rf test/
npm uninstall --save-dev @playwright/test
```

See `test/README.md` for the full removal steps. Keep `npm run lint` — it has no
dependencies and stays useful in a real project.

## Key Settings (`js/Settings.js`)

| Setting | Default | Description |
|---|---|---|
| `WIDTH` / `HEIGHT` | 800 / 450 | Canvas resolution |
| `AUTO_RESIZE` | `true` | Scale canvas to fill window |
| `FIXED_ASPECT_RATIO` | `true` | Letterbox to maintain 16:9 |
| `FIXED_SIZE_IN_UNITS` | `false` | Use world-units instead of pixels |
| `DEBUG` | `true` | Show FPS counter |
| `TIME_MULTIPLIER` | `1.0` | Global time scale |
| `PAUSE_ON_BLUR` | `false` | Pause when window loses focus |

## Global Controls (in-game)

| Key | Action |
|---|---|
| F11 | Toggle fullscreen |
| P | Pause / unpause |
| M | Mute / unmute |
| Q | Toggle particles |

## License

GPL-2.0-or-later
