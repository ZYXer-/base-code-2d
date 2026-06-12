import * as Settings from "../Settings.js";
import * as NumberUtils from "../utils/data/NumberUtils.js";
import Timer from "../utils/animation/Timer.js";


export let delta = 0.00001;


let lastTime = 0;
const callbacks = new Set();


function construct() {
    const d = new Date();
    lastTime = (1000 * d.getSeconds()) + d.getMilliseconds();
}
construct();


export function update() {
    const d = new Date();
    const now = (1000 * d.getSeconds()) + d.getMilliseconds();
    if (now < lastTime) {
        lastTime -= 60000;
    }
    delta = Settings.Game.TIME_MULTIPLIER * (now - lastTime) / 1000;
    delta = NumberUtils.clamp(delta, 0.00001, Settings.Game.MAX_TIME_PER_FRAME);
    lastTime = now;
}


export function register(timer) {
    callbacks.add(timer);
}


export function countdown(time, callback) {
    return new Timer({ end: time, onEnd: callback });
}


export function doFor(time, callback) {
    return new Timer({ end: time, onProgress: callback });
}


export function doForCountdown(time, updateCallback, endCallback) {
    return new Timer({ end: time, onProgress: updateCallback, onEnd: endCallback });
}


export function repeatEvery(interval, callback, skipFirst) {
    const timer = new Timer({ end: interval, loops: 0, onLoop: callback });
    if (!skipFirst) {
        timer.value = timer.end;
    }
    return timer;
}


export function updateCallbacks() {
    for (const callback of callbacks) {
        if (callback.killed) {
            callbacks.delete(callback);
        } else {
            callback.update();
        }
    }
}
