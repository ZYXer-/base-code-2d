import { c, canvas } from "./canvas.js";
import * as Settings from "../Settings.js";
import * as SceneManager from "./SceneManager.js";
import * as sf from "../libs/screenfull.min.js";
import { clamp } from "../utils/Utils.js";


export let canvasWidth = 1;
export let canvasHeight = 1;

export let width = 1;
export let height = 1;

export let centerX = 0;
export let centerY = 0;

export let frameOffsetX = 0;
export let frameOffsetY = 0;

export let scaleX = 1.0;
export let scaleY = 1.0;


export function init() {

    canvasWidth = Settings.Size.WIDTH;
    canvasHeight = Settings.Size.HEIGHT;

    width = Settings.Size.WIDTH;
    height = Settings.Size.HEIGHT;

    centerX = Math.round(width / 2.0);
    centerY = Math.round(height / 2.0);

    jQuery("#game_box, #game").width(width).height(height);
    canvas.width = width;
    canvas.height = height;

    jQuery(window).ready(() => {
        window.onresize = () => {
            resize();
        };
        resize();
    });
}


export function isFullScreen() {
    return screenfull.isFullscreen;
}


export function makeFullScreen() {
    screenfull.request(jQuery("html")[0]);
}


export function exitFullScreen() {
    screenfull.exit();
}


export function toggleFullScreen() {
    screenfull.toggle(jQuery("html")[0]);
}


export function resize() {

    const devicePixelRatio = window.devicePixelRatio || 1;

    let cssWidth = jQuery(window).width();
    let cssHeight = jQuery(window).height();

    cssWidth = clamp(cssWidth, Settings.Size.MIN_WIDTH / devicePixelRatio, Settings.Size.MAX_WIDTH / devicePixelRatio);
    cssHeight = clamp(cssHeight, Settings.Size.MIN_HEIGHT / devicePixelRatio, Settings.Size.MAX_HEIGHT / devicePixelRatio);

    jQuery("#game_box, #game").width(cssWidth).height(cssHeight);

    canvasWidth = cssWidth * devicePixelRatio;
    canvasWidth = clamp(canvasWidth, Settings.Size.MIN_WIDTH, Settings.Size.MAX_WIDTH);

    canvasHeight = cssHeight * devicePixelRatio;
    canvasHeight = clamp(canvasHeight, Settings.Size.MIN_HEIGHT, Settings.Size.MAX_HEIGHT);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    width = canvasWidth;
    height = canvasHeight;

    if(Settings.Size.FIXED_ASPECT_RATIO) {
        let aspectRatio = width / height;
        if(aspectRatio > Settings.Size.ASPECT_RATIO) {
            frameOffsetX = Math.round(0.5 * (width - (height * Settings.Size.ASPECT_RATIO)));
            frameOffsetY = 0;
        } else {
            frameOffsetX = 0;
            frameOffsetY = Math.round(0.5 * (height - (width / Settings.Size.ASPECT_RATIO)));
        }
        width -= 2.0 * frameOffsetX;
        height -= 2.0 * frameOffsetY;
    }

    if(Settings.Size.FIXED_SIZE_IN_UNITS) {
        scaleX = (canvasWidth - (2.0 * frameOffsetX)) / Settings.Size.WIDTH_IN_UNITS;
        scaleY = (canvasHeight - (2.0 * frameOffsetY)) / Settings.Size.HEIGHT_IN_UNITS;

        width /= scaleX;
        height /= scaleY;
    }

    centerX = Math.round(width / 2.0);
    centerY = Math.round(height / 2.0);

    SceneManager.callMethod("resize");
}


export function draw() {

    applyScaling();

    SceneManager.callMethod("draw");

    removeScaling();

    drawFrame();
}


function applyScaling() {
    if(Settings.Size.FIXED_ASPECT_RATIO) {
        c.save();
        c.translate(frameOffsetX, frameOffsetY);
    }
    if(Settings.Size.FIXED_SIZE_IN_UNITS) {
        c.save();
        c.scale(scaleX, scaleY);
    }
}


function removeScaling() {
    if(Settings.Size.FIXED_SIZE_IN_UNITS) {
        c.restore();
    }
    if(Settings.Size.FIXED_ASPECT_RATIO) {
        c.restore();
    }
}


function drawFrame() {
    if(Settings.Size.FIXED_ASPECT_RATIO) {
        c.fillStyle = Settings.Size.FRAME_COLOR;

        c.fillRect(-10, -10, canvasWidth + 20, frameOffsetY + 10);
        c.fillRect(-10, -10, frameOffsetX + 10, canvasHeight + 20);
        c.fillRect(canvasWidth - frameOffsetX, -10, frameOffsetX + 10, canvasHeight + 20);
        c.fillRect(-10, canvasHeight - frameOffsetY, canvasWidth + 20, frameOffsetY + 10);
    }
}