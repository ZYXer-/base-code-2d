import { c } from "../core/canvas.js";
import { QUART_PI, HALF_PI, PI, TWO_PI } from "./GeometryUtils.js";


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