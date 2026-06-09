import * as Settings from "../Settings.js";
import SoundInstance from "./SoundInstance.js";


export let muted = false;

export const assets = new Map();


export function add(name, howl) {
    assets.set(name, howl);
}


export function muteUnmute() {
    if (muted) {
        unmute();
    } else {
        mute();
    }
}


export function mute() {
    muted = true;
    Howler.mute(true);
}


export function unmute() {
    muted = false;
    Howler.mute(false);
}


// options: { volume: 0–1, loop: bool, onEnd: callback fired when the sound finishes }
export function play(name, options = {}) {
    if (!assets.has(name)) {
        alert("There is no sound named '" + name + "'.");
        return null;
    }
    const howl = assets.get(name);
    const soundId = howl.play();
    if (options.volume !== undefined) {
        howl.volume(options.volume, soundId);
    }
    if (options.loop !== undefined) {
        howl.loop(options.loop, soundId);
    }
    if (options.onEnd !== undefined) {
        howl.once("end", options.onEnd, soundId);
    }
    return new SoundInstance(howl, soundId);
}


export function stop(name) {
    if (assets.has(name)) {
        assets.get(name).stop();
    }
}


export function setVolume(name, volume) {
    if (assets.has(name)) {
        assets.get(name).volume(volume);
    }
}


export function fadeIn(name, duration) {
    if (assets.has(name)) {
        const howl = assets.get(name);
        howl.fade(0, Settings.Game.DEFAULT_SOUND_VOLUME, duration);
    }
}


export function fadeOut(name, duration) {
    if (assets.has(name)) {
        const howl = assets.get(name);
        howl.fade(howl.volume(), 0, duration);
    }
}


export function fadeTo(name, duration, targetVolume) {
    if (assets.has(name)) {
        const howl = assets.get(name);
        howl.fade(howl.volume(), targetVolume, duration);
    }
}

