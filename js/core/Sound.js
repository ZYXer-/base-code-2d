import * as Timer from "./Timer.js";
import * as sm2 from "../libs/soundmanager2.js";


export let muted = false;

export const assets = new Map();

export const fades = new Set();


export function add(name, sound) {
    assets.set(name, sound);
}


export function muteUnmute() {
    if(muted) {
        unmute();
    } else {
        mute();
    }
}


export function mute() {
    muted = true;
    soundManager.mute();
}


export function unmute() {
    muted = false;
    soundManager.unmute();
}


export function play(name, attributes) { // attributes example: { volume : 100, onfinish : foo(), loops : 3 }
    if(assets.has(name)) {
        let asset = assets.get(name);
        let instance = asset.instances[asset.nextInstance];
        soundManager.play(instance.name, attributes);
        asset.nextInstance++;
        if(asset.nextInstance >= asset.numOfInstances) {
            asset.nextInstance = 0;
        }
        return instance;
    } else {
        alert("There is no sound named '" + name + "'.");
        return null;
    }
}


export function stop(name) {
    getLastInstance(name).stop();
}


export function setVolume(name, volume) { // volume : 0 - 100
    getLastInstance(name).setVolume(volume);
}


export function fadeIn(name, length) {
    getLastInstance(name).fadeIn(length);
}


export function fadeOut(name, length) {
    getLastInstance(name).fadeOut(length);
}


export function fadeTo(name, length, targetVolume) {
    getLastInstance(name).fadeTo(length, targetVolume);
}


export function update() {
    for(let fade of fades) {
        fade.timer += Timer.delta;
        if(fade.timer >= fade.length) {
            fade.instance.setVolume(fade.targetVolume);
            fade.instance.currentlyFading = false;
            fades.delete(fade);
        } else {
            let deltaVolume = fade.targetVolume - fade.instance.volume;
            deltaVolume /= ((fade.length - fade.timer) / Timer.delta);
            fade.instance.setVolume(fade.instance.volume + deltaVolume);
        }
    }
}


function getLastInstance(name) {
    if(assets.has(name)) {
        let asset = assets.get(name);
        let position = asset.nextInstance - 1;
        if(position < 0) {
            position = asset.numOfInstances - 1;
        }
        return asset.instances[position];
    }
}