# Coding Style

This document describes the coding style used in this project. It is enforced by ESLint (`eslint.config.mjs`). Run `npm run lint` to check. Bug-prevention rules are **errors**; style rules are **warnings**.

The style is close to AirBnB JavaScript with three deliberate differences noted below.

---

## Indentation

**4 spaces** (not tabs, not 2 spaces).

```js
function example() {
    if (condition) {
        doSomething();
    }
}
```

*Differs from AirBnB (2 spaces). 4 spaces reads better at the file sizes used in this project.*

---

## Quotes

**Double quotes** for all strings.

```js
const name = "player";
import { foo } from "./foo.js";
```

*Differs from AirBnB (single quotes). Personal preference.*

---

## Semicolons

Always. No ASI reliance.

```js
const x = 5;
doThing();
```

---

## Spacing around keywords

**Space required** between all keywords and their parenthesis. Matches AirBnB default.

```js
if (condition) { ... }
for (let i = 0; i < n; i++) { ... }
while (running) { ... }
switch (state) { ... }
```


---

## Blank lines between functions / methods

**Two blank lines** between top-level functions and between class methods.

```js
function foo() {
    ...
}


function bar() {
    ...
}
```

```js
class Foo {


    methodA() {
        ...
    }


    methodB() {
        ...
    }

}
```

*Differs from AirBnB (one blank line). Improves readability at a glance.*

---

## `const` vs `let`

Use `const` for anything that is never reassigned. Use `let` otherwise. Never use `var`.

```js
const pi = 3.14159;
let score = 0;
score += 10;  // let is correct here
```

---

## Equality

Always use `===` and `!==`. Never `==` or `!=`.

---

## Curly braces — always required

Every `if`, `else`, `for`, `while`, and `do` body must use curly braces, even for single-statement bodies. No braceless single-liners.

```js
// correct
if (condition) {
    doSomething();
}

// wrong — ESLint error
if (condition) doSomething();
```

---

## Brace style

Opening brace on the same line (1TBS / K&R style).

```js
if (condition) {
    ...
} else {
    ...
}
```

---

## Arrow functions

Use arrow functions for callbacks. Use named `function` declarations for top-level functions and class methods.

```js
// callbacks
Mouse.left.registerUpCallback("id", () => {
    doThing();
});

// top-level
export function update() {
    ...
}
```

---

## ES6 modules

Use `import`/`export`. No `require()` outside of `nodeServer.js`.

Namespace imports (`import * as Foo`) are preferred over named imports for module-level singletons, because they make the source of each call obvious at the call site (`Foo.bar()` vs bare `bar()`).

---

## Option defaults

Constructors and setters that take an `options` object read each option with `??`, so `0`, `false`, and `""` are kept as real values and only a missing (`undefined`/`null`) option falls back to the default. Structured options are filled in with a spread over the defaults, which also copies the object.

```js
this.x = options.x ?? 0;
this.active = options.active ?? true;
this.emitter = { x: 0.0, y: 0.0, z: 0.0, ...options.emitter };
```

Do not use `||` for defaults (it drops falsy values) and do not use `Object.hasOwn(options, "x")` for defaults (it is only for genuine key-existence checks on maps, e.g. a colour lookup table).

---

## Unused variables and arguments

Unused imports and variables are an **error** (`no-unused-vars`) — remove them. An argument that a stub or callback must accept but does not use is prefixed with `_`, which the rule ignores.

```js
draw(_direction, _x, _y) {
    // TODO
}
```

---

## Running the linter

```bash
npm run lint          # check all files
npm run lint -- --fix # auto-fix what ESLint can (style warnings only; errors need manual fixing)
```
