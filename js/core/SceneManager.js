import * as Settings from "../Settings.js";
import * as Viewport from "./Viewport.js";


let scene = null;
let nextScene = null;


export function update() {
    if(scene !== nextScene) {

        callMethod("hide");

        scene = nextScene;

        callMethod("show");

        if(Settings.Size.AUTO_RESIZE) {
            Viewport.resize();
        }
    }
}


export function callMethod(methodName) {
    if(scene !== null && typeof scene[methodName] === "function") {
        scene[methodName]();
    }
}


export function callMethodWithParam(methodName, parameter) {
    if(scene !== null && typeof scene[methodName] === "function") {
        scene[methodName](parameter);
    }
}


export function changeScene(newScene) {
    nextScene = newScene;
}