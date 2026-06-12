import * as Clock from "../core/Clock.js";
import * as NumberUtils from "./NumberUtils.js";


// Counts `value` from `start` to `end` at a given `speed` (units/sec).
// Supports looping, ping-pong oscillation, pause/resume, and per-frame callbacks.
// Registers with the game loop automatically unless `autoRegister` is false,
// in which case the caller is responsible for calling update() each frame.
// All setters return `this` for chaining.
class Timer {


    constructor(options = {}) {

        this.start = options.start ?? 0;                        // start boundary
        this.end = options.end ?? 1;                            // end boundary
        this.speed = options.speed ?? 1;                        // units/sec; can be negative
        this.loops = options.loops ?? 1;                        // loops before onEnd fires; 0 = infinite
        this.pingpong = options.pingpong ?? false;              // reverses direction at each boundary instead of resetting
        this.autoRegister = options.autoRegister ?? true;       // false = caller drives update() manually

        this.onStart = options.onStart ?? null;                 // fires once on construction
        this.onEnd = options.onEnd ?? null;                     // fires when all loops are exhausted
        this.onLoop = options.onLoop ?? null;                   // fires after each non-terminal loop
        this.onBounce = options.onBounce ?? null;               // fires when ping-pong reverses
        this.onUpdate = options.onUpdate ?? null;               // fires every frame with current value
        this.onProgress = options.onProgress ?? null;           // fires every frame with normalised progress [0–1]

        this.direction = 1;
        this.value = this.start;

        this.started = false;
        this.transits = 0;
        this.killed = false;
        this.paused = false;

        if (this.autoRegister) {
            Clock.register(this);
        }
    }


    update() {

        if (this.paused) {
            return;
        }

        const delta = this.speed * this.direction * Clock.delta;
        if (delta === 0.0) {
            return;
        }

        if (!this.started) {
            this.started = true;
            if (this.onStart !== null) {
                this.onStart();
            }
        }

        const low = this.start < this.end ? this.start : this.end;
        const high = this.start < this.end ? this.end : this.start;

        this.value += delta;
        this.value = NumberUtils.clamp(this.value, low, high);

        const target = delta > 0 ? high : low;

        if (this.value === target) {

            this.transits += 1;
            const targetTransits = this.loops > 0 ? ((this.pingpong ? 2 : 1) * this.loops) : Infinity;

            if (this.transits >= targetTransits) {
                this.finish();
                return;
            }

            if (this.pingpong) {
                this.direction = -1 * this.direction;
                if (this.onBounce !== null) {
                    this.onBounce();
                }
                if (this.transits % 2 === 0 && this.onLoop !== null) {
                    this.onLoop();
                }

            } else {
                this.value = this.start;
                if (this.onLoop !== null) {
                    this.onLoop();
                }
            }
        }

        if (this.onUpdate !== null) {
            this.onUpdate(this.value);
        }

        if (this.onProgress !== null) {
            const range = this.end - this.start;
            this.onProgress(range !== 0 ? (this.value - this.start) / range : 0);
        }
    }


    setStart(start) {
        this.start = start;
        return this;
    }


    setEnd(end) {
        this.end = end;
        return this;
    }


    setSpeed(speed) {
        this.speed = speed;
        return this;
    }


    setLoops(loops) {
        this.loops = loops;
        return this;
    }


    setPingpong(pingpong) {
        this.pingpong = pingpong;
        return this;
    }


    setOnStart(callback) {
        this.onStart = callback;
        return this;
    }


    setOnEnd(callback) {
        this.onEnd = callback;
        return this;
    }


    setOnLoop(callback) {
        this.onLoop = callback;
        return this;
    }


    setOnBounce(callback) {
        this.onBounce = callback;
        return this;
    }


    setOnUpdate(callback) {
        this.onUpdate = callback;
        return this;
    }


    setOnProgress(callback) {
        this.onProgress = callback;
        return this;
    }


    pause() {
        this.paused = true;
        return this;
    }


    unpause() {
        this.paused = false;
        return this;
    }


    togglePause() {
        this.paused = !this.paused;
        return this;
    }


    // Terminates the timer and fires onEnd.
    finish() {
        this.killed = true;
        if (this.onEnd !== null) {
            this.onEnd();
        }
        return this;
    }


    // Terminates the timer silently, without firing onEnd.
    kill() {
        this.killed = true;
        return this;
    }


    restart() {
        this.direction = 1;
        this.value = this.start;

        this.started = false;
        this.transits = 0;
        this.killed = false;

        return this;
    }


}


export default Timer;
