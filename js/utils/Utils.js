import * as Keyboard from "../core/input/Keyboard.js";
import Vec2 from "./Vec2.js";
import * as NumberUtils from "./NumberUtils.js";
import * as Timer from "../core/Timer.js";


export function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}


export function getContext(canvas) {
    return canvas.getContext("2d");
}


export function parallaxCalculator(scale, pos, shift, textureWidth, tileWidth, screenWidth, overflow) {
    pos *= scale;
    pos += shift;
    const startingTile = Math.floor(pos / tileWidth);
    const tileOffset = pos - (tileWidth * startingTile);
    const numOfTilesInTex = Math.floor(textureWidth / tileWidth);
    const endTile = Math.ceil((pos + screenWidth + overflow + overflow) / tileWidth);
    const firstTileX = -tileOffset - overflow;
    const firstTileIndex = startingTile % numOfTilesInTex;
    const numOfTiles = endTile - startingTile;
    return { firstTileX : firstTileX, firstTileIndex : firstTileIndex, numOfTiles : numOfTiles };
}


export function stopwatch(stopwatchTime, speed, min, max, callbacks) {

    const lastTime = stopwatchTime;
    stopwatchTime += speed * Timer.delta;
    stopwatchTime = NumberUtils.clamp(stopwatchTime, min, max);

    if (stopwatchTime === min) {
        if (lastTime > min && callbacks.hasOwnProperty("reachMin")) {
            callbacks.reachMin();
        }
        if (callbacks.hasOwnProperty("atMin")) {
            callbacks.atMin();
        }
    }

    if (stopwatchTime === max) {
        if (lastTime < max && callbacks.hasOwnProperty("reachMax")) {
            callbacks.reachMax();
        }
        if (callbacks.hasOwnProperty("atMax")) {
            callbacks.atMax();
        }
    }

    if (stopwatchTime < max && callbacks.hasOwnProperty("exceptMax")) {
        callbacks.exceptMax();
    }
    if (stopwatchTime > min && callbacks.hasOwnProperty("exceptMin")) {
        callbacks.exceptMin();
    }
    if (stopwatchTime > min && stopwatchTime < max && callbacks.hasOwnProperty("exceptMinMax")) {
        callbacks.exceptMinMax();
    }

    return stopwatchTime;
}


export function getArrowControls() {
    const moveUpPressed = Keyboard.isPressed(Keyboard.ARROW_UP) || Keyboard.isPressed(Keyboard.W) || Keyboard.isPressed(Keyboard.Z);
    const moveRightPressed = Keyboard.isPressed(Keyboard.ARROW_RIGHT) || Keyboard.isPressed(Keyboard.D);
    const moveDownPressed = Keyboard.isPressed(Keyboard.ARROW_DOWN) || Keyboard.isPressed(Keyboard.S);
    const moveLeftPressed = Keyboard.isPressed(Keyboard.ARROW_LEFT) || Keyboard.isPressed(Keyboard.A) || Keyboard.isPressed(Keyboard.Q);
    const vector = new Vec2(0.0, 0.0);
    if (moveUpPressed && !moveDownPressed) {
        vector.y -= 1.0;
    } else if (moveDownPressed && !moveUpPressed) {
        vector.y += 1.0;
    }
    if (moveRightPressed && !moveLeftPressed) {
        vector.x += 1.0;
    } else if (moveLeftPressed && !moveRightPressed) {
        vector.x -= 1.0;
    }
    return vector.normalize();
}
