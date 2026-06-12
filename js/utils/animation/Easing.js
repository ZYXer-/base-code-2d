import * as NumberUtils from "./NumberUtils.js";
import * as Clock from "../core/Clock.js";
import { HALF_PI, PI } from "./GeometryUtils.js";


export function sin(x) {
    return NumberUtils.clamp(0.5 - (0.5 * Math.cos(PI * x)), 0.0, 1.0);
}


export function sinOut(x) {
    return NumberUtils.clamp(Math.sin(HALF_PI * x), 0.0, 1.0);
}


export function sinIn(x) {
    return NumberUtils.clamp(1.0 - Math.cos(HALF_PI * x), 0.0, 1.0);
}


export function quad(x) {
    x *= 2.0;
    if (x < 1.0) {
        return NumberUtils.clamp(0.5 * x * x, 0.0, 1.0);
    } else {
        x = 2.0 - x;
        return NumberUtils.clamp(1.0 - (0.5 * x * x), 0.0, 1.0);
    }
}


export function quadOut(x) {
    return -1.0 + (2.0 * quad(0.5 + (x * 0.5)));
}


export function quadIn(x) {
    return 2.0 * quad(x * 0.5);
}


export function cube(x) {
    x *= 2.0;
    if (x < 1.0) {
        return NumberUtils.clamp(0.5 * x * x * x, 0.0, 1.0);
    } else {
        x = 2.0 - x;
        return NumberUtils.clamp(1.0 - (0.5 * x * x * x), 0.0, 1.0);
    }
}


export function cubeOut(x) {
    return -1.0 + (2.0 * cube(0.5 + (x * 0.5)));
}


export function cubeIn(x) {
    return 2.0 * cube(x * 0.5);
}


export function accelerateToPos(currentPos, targetPos, velocity, acceleration, maxV) {
    let newPos = currentPos;
    let newVelocity = velocity;
    if (currentPos !== targetPos) {
        const dstToTarget = targetPos - currentPos;

        let neededBrakingA = velocity * velocity / (2.0 * dstToTarget);
        if ((velocity > 0.0 && dstToTarget < 0.0) ||
            (velocity < 0.0 && dstToTarget > 0.0)) {
            neededBrakingA = -neededBrakingA;
        }
        let a = 0;
        if (Math.abs(neededBrakingA) >= acceleration) {
            a = -NumberUtils.clamp(neededBrakingA, -acceleration * 1.2, acceleration * 1.2);
        } else if (Math.abs(neededBrakingA) * 1.2 < acceleration) { // no acceleration during 0.2 sec
            if (dstToTarget < 0) {
                a = -acceleration;
            } else {
                a = acceleration;
            }
        }
        newVelocity += a * Clock.delta;
        newVelocity = NumberUtils.clamp(newVelocity, -maxV, maxV);
        newPos += newVelocity * Clock.delta;
        const threshold = Math.abs(newVelocity * Clock.delta);
        if (newPos > targetPos - threshold && newPos < targetPos + threshold) {
            newPos = targetPos;
            newVelocity = 0;
        }
    } else {
        newVelocity = 0;
    }
    return { pos: newPos, velocity: newVelocity };
}