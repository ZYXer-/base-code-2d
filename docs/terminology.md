# Terminology

Canonical terms used consistently in code, comments, and documentation. When in doubt, use the term as defined here.

---

## Scene

An object with lifecycle methods (`show`, `hide`, `update`, `draw`, `resize`) that represents a distinct game state — e.g. loading screen, main menu, gameplay, pause screen. Managed by `SceneManager`.

**Not:** "screen", "state", "view", "level" (unless the scene literally is a level).

---

## Scene Lifecycle

The five methods the engine calls on the active scene:
- `show()` — called when the scene becomes active
- `hide()` — called just before the scene is replaced
- `update(delta)` — called every frame before drawing; `delta` is time since last frame in milliseconds
- `draw()` — called every frame after update; draw to canvas here
- `resize()` — called when the viewport dimensions change

---

## Delta

The time elapsed since the last frame, in **milliseconds**. Imported as `delta` from `js/core/Timer.js`. Always multiply movement/velocity by `delta` (divided by a reference frame time) to achieve frame-rate-independent behaviour.

---

## Viewport

The canvas element and its scaling context. Managed by `js/core/Viewport.js`. The viewport handles responsive resizing, device pixel ratio compensation, aspect ratio letterboxing, and fullscreen toggling.

---

## Unit

When `FIXED_SIZE_IN_UNITS` is enabled, the game world is described in abstract units rather than pixels. One unit equals `WIDTH / FIXED_SIZE_IN_UNITS` pixels (or the analogous height value). Used to keep world coordinates consistent across display sizes.

---

## Sprite

A sub-region of a sprite sheet image, referenced by position and size within the sheet. Drawn via `Img.drawSprite()`.

---

## Particle / Particle System

A `Particle` is a single short-lived visual element (dot, shape, etc.) with position, velocity, acceleration, and lifetime. A `ParticleSystem` manages a collection of particles in either continuous (stream) or burst mode.

---

## Button

An interactive UI element (`js/utils/Button.js`) with a custom draw callback and hover/press/active states. Can have an associated Tooltip and supports drag-and-drop areas.

---

## Tooltip

A small text label that appears near a UI element on hover. Managed globally by `js/core/Tooltip.js`.

---

## Preloading Stage

One phase of the asset loading pipeline managed by `PreloadingManager`. Stages run sequentially; each has a weighted percentage contribution to the total loading bar.

---

## Resources

The centralized asset registry in `js/Resources.js`. Defines all images, fonts, and sounds that will be preloaded before the game begins.

---

## Timer Callback

A time-based callback registered via `Timer.countdown()`, `Timer.doFor()`, or `Timer.repeatEvery()`. All callbacks are updated each frame by the game loop.

---

## Acceleratable

A physics-style movement controller (`js/utils/Acceleratable.js`) that applies acceleration up to a maximum velocity, with optional 8-directional keyboard input mapping.

---

## Easing

A function that maps a linear `t ∈ [0, 1]` to a non-linear output, used for smooth transitions and animations. Available variants: `sin`, `quad`, `cube` — each with `in`, `out`, and `inOut` forms.

---

## Shaking

A screen-space offset effect that simulates camera shake. Triggered by `Shaking.shake(intensity, duration, frequency)` and applied automatically during draw.

---

## Integer Scaling

A rendering mode (`js/utils/IntegerScaling.js`) that scales the canvas by an integer factor, preserving pixel-perfect appearance for pixelated/retro aesthetics.
