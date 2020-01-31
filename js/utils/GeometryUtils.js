import Vec2 from "./Vec2.js";


export const QUART_PI = 0.78539816339;
export const HALF_PI = 1.57079632679;
export const PI = 3.14159265359;
export const TWO_PI = 6.28318530718;


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