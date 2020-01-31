import * as Keyboard from "../core/input/Keyboard.js";
import Vec2 from "./Vec2.js";


export const QUART_PI = 0.78539816339;
export const HALF_PI = 1.57079632679;
export const PI = 3.14159265359;
export const TWO_PI = 6.28318530718;


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


export function distance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt((dx * dx) + (dy * dy));
}


export function angle(x1, y1, x2, y2) {
    return Math.atan2(x1 - x2, y2 - y1);
}


export function toRad(degrees) {
    return degrees * 0.0174532;
}


export function angleDelta(angleA, angleB) {
    let angleDelta = angleB - angleA;
    while(angleDelta > PI) {
        angleDelta -= TWO_PI;
    }
    while(angleDelta <= -PI) {
        angleDelta += TWO_PI;
    }
    return angleDelta;
}


export function intersectLines(line1point1, line1point2, line2point1, line2point2) {
    let x1 = line1point1.x;
    let y1 = line1point1.y;
    let x2 = line1point2.x;
    let y2 = line1point2.y;
    let x3 = line2point1.x;
    let y3 = line2point1.y;
    let x4 = line2point2.x;
    let y4 = line2point2.y;
    let demon = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
    if(demon === 0) {
        return null; // parallel
    }
    let x = (((x1 * y2) - (y1 * x2)) * (x3 - x4)) - ((x1 - x2) * ((x3 * y4) - (y3 * x4)));
    x /= demon;
    let y = (((x1 * y2) - (y1 * x2)) * (y3 - y4)) - ((y1 - y2) * ((x3 * y4) - (y3 * x4)));
    y /= demon;
    return new Vec2(x, y);
}


export function inPolygon(polygon, point) {
    let inside = false;
    let j = (polygon.length - 1);
    for(let i = 0; i < polygon.length; i++) {
        if(((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
            (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
            inside = !inside;
        }
        j = i;
    }
    return inside;
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


export function drawPolygon(vec2List) {
    c.beginPath();
    let vec;
    if(vec2List.length > 0) {
        vec = vec2List[0];
        c.moveTo(vec.x, vec.y);
    }
    for(let i = 1; i < vec2List.length; i++) {
        vec = vec2List[i];
        c.lineTo(vec.x, vec.y);
    }
    c.closePath();
}


export function drawCircle(c, x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, TWO_PI);
    c.closePath();
}


export function drawEllipse(c, x, y, w, h) {
    let kappa = 0.5522848;
    let ox = (w / 2) * kappa;
    let oy = (h / 2) * kappa;
    let xe = x + w;
    let ye = y + h;
    let xm = x + w / 2;
    let ym = y + h / 2;

    c.beginPath();
    c.moveTo(x, ym);
    c.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    c.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    c.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    c.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    c.closePath();
}


export function drawRing(c, x, y, innerRadius, outerRadius) {
    c.beginPath();
    c.arc(x, y, outerRadius, 0, TWO_PI, false);
    c.arc(x, y, innerRadius, TWO_PI, 0, true);
    c.closePath();
}


export function drawCircleSegment(c, x, y, radius, startAngle, endAngle) {
    c.beginPath();
    c.lineTo(x, y);
    c.arc(x, y, radius, startAngle, endAngle);
    c.closePath();
}


export function drawRingSegment(c, x, y, innerRadius, outerRadius, startAngle, endAngle) {
    c.beginPath();
    c.arc(x, y, outerRadius, startAngle, endAngle, false);
    c.arc(x, y, innerRadius, endAngle, startAngle, true);
    c.closePath();
}


export function drawRoundedCornerRect(x, y, w, h, r) {
    if(typeof r === "number") {
        r = [ r, r, r, r ];
    }
    c.beginPath();
    c.arc(x + r[0], y + r[0], r[0], PI, 3 * HALF_PI);
    c.arc(x + w - r[1], y + r[1], r[1], 3 * HALF_PI, TWO_PI);
    c.arc(x + w - r[2], y + h - r[2], r[2], 0, HALF_PI);
    c.arc(x + r[3], y + h - r[3], r[3], HALF_PI, PI);
    c.closePath();
}


export function drawStar(x, y, points, outerR, innerR) {
    let pointAngle = PI / points;
    c.save();
    c.translate(x, y);
    c.beginPath();
    c.moveTo(0, -outerR);
    c.lineTo(Math.sin(pointAngle) * innerR, -Math.cos(pointAngle) * innerR);
    for(let i = 1; i < points; i++) {
        c.lineTo(Math.sin((i * 2) * pointAngle) * outerR, -Math.cos((i * 2) * pointAngle) * outerR);
        c.lineTo(Math.sin(((i * 2) + 1) * pointAngle) * innerR, -Math.cos(((i * 2) + 1) * pointAngle) * innerR);
    }
    c.closePath();
    c.restore();
}


export function drawHeart(x, y, w, h, overhang) { // negative overhang = left, positive = right, best results h > w * 0.86 && h < w
    if(h < w * 0.86 || h > w) {
        console.warn("Utils.drawHeart() called with height that would not result in a heart shape. Parameter h should be greater than 0.86 * w and less than w.");
    }
    c.save();
    c.translate(x, y);
    let r = (h - (0.5 * w)) / 1.4142136;
    let a = (1.0 - 0.7071068) * r;
    let alpha = Math.acos(0.5 * (w - (2 * r)) / r);

    c.beginPath();
    c.moveTo(0.0, h * 0.5);
    c.lineTo((w * -0.5) + a, (h * 0.5) + a - (w * 0.5));

    c.arc((w * -0.5) + r, (h * -0.5) + r, r, 3 * QUART_PI, -alpha);
    if(overhang > 0.0) {
        c.arc((w * -0.5) + r, (h * -0.5) + r, r, -alpha, -alpha + overhang);
        c.arc((w * -0.5) + r, (h * -0.5) + r, r, -alpha + overhang, -alpha, true);
    }
    if(overhang < 0.0) {
        c.arc((w * 0.5) - r, (h * -0.5) + r, r, -PI + alpha, -PI + alpha + overhang, true);
        c.arc((w * 0.5) - r, (h * -0.5) + r, r, -PI + alpha + overhang, -PI + alpha);
    }
    c.arc((w * 0.5) - r, (h * -0.5) + r, r, -PI + alpha, QUART_PI);

    c.closePath();
    c.restore();
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
