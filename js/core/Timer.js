import * as Settings from "../Settings.js";
import { clamp } from "../utils/Utils.js";
import TimerCallback from "../utils/TimerCallback.js";


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
    if(now < lastTime) {
        lastTime -= 60000;
    }
    delta = Settings.Game.TIME_MULTIPLIER * (now - lastTime) / 1000;
    delta = clamp(delta, 0.00001, Settings.Game.MAX_TIME_PER_FRAME);
    lastTime = now;
}


export function countdown(time, callback) {
    const timerCallback = new TimerCallback(time, null, callback, false);
    callbacks.add(timerCallback);
    return timerCallback;
}


export function doFor(time, callback) {
    const timerCallback = new TimerCallback(time, callback, null, false);
    callbacks.add(timerCallback);
    return timerCallback;
}


export function doForCountdown(time, updateCallback, endCallback) {
    const timerCallback = new TimerCallback(time, updateCallback, endCallback, false);
    callbacks.add(timerCallback);
    return timerCallback;
}


export function repeatEvery(interval, callback, skipFirst) {
    const timerCallback = new TimerCallback(interval, null, callback, true);
    if(typeof skipFirst === "undefined" || !skipFirst) {
        timerCallback.life = 0.0;
    }
    callbacks.add(timerCallback);
    return timerCallback;
}


export function updateCallbacks() {
    for(let callback of callbacks) {
        if(callback.killed) {
            callbacks.delete(callback)
        } else {
            callback.update();
        }
    }
}
