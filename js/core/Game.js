import { c, canvas } from "./canvas.js";
import * as Viewport from "./Viewport.js";
import * as Settings from "../Settings.js";
import * as SceneManager from "./SceneManager.js";
import * as Scenes from "../Scenes.js";
import * as Keyboard from "./input/Keyboard.js";
import * as Mouse from "./input/Mouse.js";
import * as GlobalControls from "../GlobalControls.js";
import * as PageVisibility from "./PageVisibility.js";
import * as PerformanceMonitor from "./PerformanceMonitor.js";
import * as Timer from "./Timer.js";
import * as Sound from "./Sound.js";
import Button from "../utils/Button.js";


export let paused = false;


export function start() {

    Viewport.init();

    for(let keyIndex in GlobalControls.allowDefaultBehavior) {
        Keyboard.allowKey(GlobalControls.allowDefaultBehavior[keyIndex]);
    }
    GlobalControls.loadCustomBehavior();

    Mouse.left.registerUpCallback("_leftClick", () => {
        SceneManager.callMethod("click");
    });
    Mouse.middle.registerUpCallback("_middleClick", () => {
        SceneManager.callMethod("middleClick");
    });
    Mouse.right.registerUpCallback("_rightClick", () =>{
        SceneManager.callMethod("rightClick");
    });
    Mouse.registerScrollCallback("_scroll", delta => {
        SceneManager.callMethodWithParam("scroll", delta);
    });

    Button.init();

    if(Settings.Game.PAUSE_ON_BLUR) {
        PageVisibility.registerBlurHandler("pause", () => {
            pause();
        });
    }

    PageVisibility.registerFocusHandler("resize", () => {
        Viewport.resize();
    });

    Scenes.load();
    SceneManager.changeScene(Scenes.INITIAL_SCENE);
    loop();
}


export function pause() {
    paused = true;
}


export function unpause() {
    paused = false;
}


export function pauseUnpause() {
    if(paused) {
        unpause();
    } else {
        pause();
    }
}


function loop() {

    const requestAnimationFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame;
    requestAnimationFrame(() => {
        loop();
    });

    PerformanceMonitor.startStopwatch(0);
    PerformanceMonitor.startStopwatch(1);

    SceneManager.update();
    Timer.update();
    Mouse.update();
    update();
    Sound.update();
    Button.reset();

    PerformanceMonitor.stopStopwatch(1);
    PerformanceMonitor.startStopwatch(2);

    Viewport.draw();

    PerformanceMonitor.stopStopwatch(2);
    PerformanceMonitor.stopStopwatch(0);

    PerformanceMonitor.update();
}


function update() {
    SceneManager.callMethod("update");
}