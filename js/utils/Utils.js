import * as Keyboard from "../core/input/Keyboard.js";
import Vec2 from "./Vec2.js";





export function rand(min, max) {
    return min + Math.floor((1 + max - min) * Math.random());
}


export function randFloat(min, max) {
    return min + ((max - min) * Math.random());
}


export function uniqueId(length) {
    let id = Math.random().toString(16).substr(2, 1);
    if(length > 1) {
        id += uniqueId(length - 1);
    }
    return id;
}


export function trueOrFalse(probabilityOfTrue) {
    return randFloat(0.0, 1.0) < probabilityOfTrue;
}





export function clamp(value, min, max) {
    if(value < min) {
        return min;
    }
    if(value > max) {
        return max;
    }
    return value;
}


export function min(value, min) {
    if(value > min) {
        return min;
    }
    return value;
}


export function max(value, max) {
    if(value < max) {
        return max;
    }
    return value;
}


export function scale0to1(value, min, max, reverse) {
    reverse = (typeof reverse !== "undefined" ? reverse : false);
    if(min === max) {
        return 0.0;
    }
    value = (value - min) / (max - min);
    value = clamp(value, 0.0, 1.0);

    if(reverse) {
        return (1.0 - value);
    } else {
        return value;
    }
}


export function createMatrix(width, height, defaultValue) {
    let matrix = [];
    for(let x = 0; x < width; x++) {
        matrix[x] = [];
        for(let y = 0; y < height; y++) {
            if(typeof defaultValue === "object") {
                matrix[x][y] = shallowCopy(defaultValue);
            } else {
                matrix[x][y] = defaultValue;
            }
        }
    }
    return matrix;
}


export function createCanvas(width, height) {
    let canvas = document.createElement("canvas");
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
    let startingTile = Math.floor(pos / tileWidth);
    let tileOffset = pos - (tileWidth * startingTile);
    let numOfTilesInTex = Math.floor(textureWidth / tileWidth);
    let endTile = Math.ceil((pos + screenWidth + overflow + overflow) / tileWidth);
    let firstTileX = -tileOffset - overflow;
    let firstTileIndex = startingTile % numOfTilesInTex;
    let numOfTiles = endTile - startingTile;
    return { firstTileX : firstTileX, firstTileIndex : firstTileIndex, numOfTiles : numOfTiles };
}


export function shallowCopy(object) {
    return jQuery.extend({}, object);
}


export function deepCopy(object) {
    return jQuery.extend(true, {}, object);
}


export function removeFromArray(array, value) {
    return array.filter(item => item !== value);
}


export function isInArray(array, value) {
    return array.indexOf(value) > -1;
}


export function arrayShuffle(array) {
    let i = array.length;
    let temp;
    let randI;
    while (0 !== i) {
        randI = Math.floor(Math.random() * i);
        i -= 1;
        temp = array[i];
        array[i] = array[randI];
        array[randI] = temp;
    }
    return array;
}


export function mergeArrays(array1, array2) {
    return array1.concat(array2);
}


export function objectToMap(obj) {
    const map = new Map();
    for(let key in obj) {
        map.set(key, obj[key]);
    }
    return map;
}


export function stopwatch(stopwatchTime, speed, min, max, callbacks) {

    let lastTime = stopwatchTime;
    stopwatchTime += speed * Timer.delta;
    stopwatchTime = clamp(stopwatchTime, min, max);

    if(stopwatchTime === min) {
        if(lastTime > min && callbacks.hasOwnProperty("reachMin")) {
            callbacks.reachMin();
        }
        if(callbacks.hasOwnProperty("atMin")) {
            callbacks.atMin();
        }
    }

    if(stopwatchTime === max) {
        if(lastTime < max && callbacks.hasOwnProperty("reachMax")) {
            callbacks.reachMax();
        }
        if(callbacks.hasOwnProperty("atMax")) {
            callbacks.atMax();
        }
    }

    if(stopwatchTime < max && callbacks.hasOwnProperty("exceptMax")) {
        callbacks.exceptMax();
    }
    if(stopwatchTime > min && callbacks.hasOwnProperty("exceptMin")) {
        callbacks.exceptMin();
    }
    if(stopwatchTime > min && stopwatchTime < max && callbacks.hasOwnProperty("exceptMinMax")) {
        callbacks.exceptMinMax();
    }

    return stopwatchTime;
}


export function getArrowControls() {
    let moveUpPressed = Keyboard.isPressed(Keyboard.ARROW_UP) || Keyboard.isPressed(Keyboard.W) || Keyboard.isPressed(Keyboard.Z);
    let moveRightPressed = Keyboard.isPressed(Keyboard.ARROW_RIGHT) || Keyboard.isPressed(Keyboard.D);
    let moveDownPressed = Keyboard.isPressed(Keyboard.ARROW_DOWN) || Keyboard.isPressed(Keyboard.S);
    let moveLeftPressed = Keyboard.isPressed(Keyboard.ARROW_LEFT) || Keyboard.isPressed(Keyboard.A) || Keyboard.isPressed(Keyboard.Q);
    let vector = new Vec2(0.0, 0.0);
    if(moveUpPressed && !moveDownPressed) {
        vector.y -= 1.0;
    } else if(moveDownPressed && !moveUpPressed) {
        vector.y += 1.0;
    }
    if(moveRightPressed && !moveLeftPressed) {
        vector.x += 1.0;
    } else if(moveLeftPressed && !moveRightPressed) {
        vector.x -= 1.0;
    }
    return vector.normalize();
}


export function pad(number, length) {
    let numberString = number.toString();
    let pad = "00000000";
    return pad.substring(0, length - numberString.length) + numberString;
}


export function toFixedDecimal(number, numberOfDecimals) {
    return number.toFixed(numberOfDecimals);
}


export function titleCase(string) {
    return string.split(" ").map(word => {
        return word.charAt(0).toUpperCase() + word.substr(1);
    }).join(" ");
}
