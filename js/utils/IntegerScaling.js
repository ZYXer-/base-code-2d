import { c } from "../core/canvas.js";
import * as Viewport from "../core/Viewport.js";
import * as Settings from "../Settings.js";
import * as Img from "../core/Img.js";
import * as Mouse from "../core/input/Mouse.js";
import * as ImageProcessing from "./ImageProcessing.js";
import { clamp } from "./Utils.js";
import Vec2 from "./Vec2.js";


class IntegerScaling {


    constructor(minScale, maxScale, minUnitsPerWidth, minUnitsPerHeight) {

        this.minScale = minScale;
        this.maxScale = maxScale;

        this.minUnitsPerWidth = minUnitsPerWidth;
        this.minUnitsPerHeight = minUnitsPerHeight;

        this.s = minScale;

        this.gameWidth = 0;
        this.gameHeight = 0;

        this.unscaledPivot = new Vec2(0, 0);
        this.scaledPivot = new Vec2(0, 0);

        this.mousePos = new Vec2(0, 0);

        this.resize();

        if(Settings.Size.FIXED_SIZE_IN_UNITS) {
            console.warn("Do not use FIXED_SIZE_IN_UNITS and IntegerScaling at the same time, as this might lead to unexpected results.");
        }
    }


    setPivotPoints(unscaledPivot, scaledPivot) {
        this.unscaledPivot = unscaledPivot;
        this.scaledPivot = scaledPivot;
    }


    addScalableImage(name) {
        for(let scale = this.minScale; scale <= this.maxScale; scale++) {
            ImageProcessing.pixelate(name, name + scale, scale);
        }
    }


    resize() {

        let widthScale = Math.floor(Viewport.width / this.minUnitsPerWidth);
        let heightScale = Math.floor(Viewport.height / this.minUnitsPerHeight);

        this.s = widthScale;
        if(widthScale > heightScale) {
            this.s = heightScale;
        }

        this.s = clamp(this.s, this.minScale, this.maxScale);

        this.gameWidth = Viewport.width / this.s;
        this.gameHeight = Viewport.height / this.s;
    }


    screenToWorld(point) {
        return point.subtract(this.unscaledPivot).multiply(1.0 / this.s).add(this.scaledPivot);
    }


    worldToScreen(point) {
        return point.subtract(this.scaledPivot).multiply(this.s).add(this.unscaledPivot);
    }


    apply() {
        c.save();
        c.translate(this.unscaledPivot.x, this.unscaledPivot.y);
        c.scale(this.s, this.s);
        c.translate(-this.scaledPivot.x, -this.scaledPivot.y);
        this.mousePos = this.screenToWorld(Mouse.pos);
    }


    restore() {
        c.restore();
    }


    drawMask(x, y, w, h, color) {
        let maskL = this.unscaledPivot.x + ((-this.scaledPivot.x + x) * this.s);
        let maskR = this.unscaledPivot.x + ((-this.scaledPivot.x + x + w) * this.s);
        let maskT = this.unscaledPivot.y + ((-this.scaledPivot.y + y) * this.s);
        let maskB = this.unscaledPivot.y + ((-this.scaledPivot.y + y + h) * this.s);

        c.fillStyle = color;

        c.fillRect(-10, -10, Viewport.width + 20, maskT + 10);
        c.fillRect(-10, -10, maskL + 10, Viewport.height + 20);
        c.fillRect(maskR, -10, Viewport.width + 10 - maskR, Viewport.height + 20);
        c.fillRect(-10, maskB, Viewport.width + 20, Viewport.height + 10 - maskB);
    }


    mouseIsOver(x, y, w, h) {
        return (this.mousePos.x >= x && this.mousePos.x < x + w && this.mousePos.y >= y && this.mousePos.y < y + h);
    }


    mouseIsOverCircle(x, y, r) {
        let deltaX = this.mousePos.x - x;
        let deltaY = this.mousePos.y - y;
        return (deltaX * deltaX) + (deltaY * deltaY) <= r * r;
    }


    get(name) {
        return Img.get(name + this.s);
    }


    draw(name, x, y) {
        let img = this.get(name);
        c.drawImage(img, 0, 0, img.width, img.height, x, y, img.width / this.s, img.height / this.s);
    }


    drawSprite(name, x, y, w, h, posX, posY) {
        let img = this.get(name);
        c.drawImage(img, posX * w * this.s, posY * h * this.s, w * this.s, h * this.s, x, y, w, h);
    }


    drawRotated(name, x, y, centerX, centerY, angle) {
        c.save();
        c.translate(x, y);
        c.rotate(angle);
        c.translate(-centerX, -centerY);
        this.draw(name, 0, 0);
        c.restore();
    }


    drawRotatedSprite(name, x, y, w, h, posX, posY, centerX, centerY, angle) {
        c.save();
        c.translate(x, y);
        c.rotate(angle);
        c.translate(-centerX, -centerY);
        this.drawSprite(name, 0, 0, w, h, posY, posY);
        c.restore();
    }
    

    drawCustom(name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
        let img = this.get(name);
        c.drawImage(img, sourceX * this.s, sourceY * this.s, sourceWidth * this.s, sourceHeight * this.s, targetX, targetY, targetWidth, targetHeight);
    }


    drawIn(context, name, x, y) {
        let img = this.get(name);
        context.drawImage(img, 0, 0, img.width, img.height, x, y, img.width / this.s, img.height / this.s);
    }


    drawSpriteIn(context, name, x, y, w, h, posX, posY) {
        let img = this.get(name);
        context.drawImage(img, posX * w * this.s, posY * h * this.s, w * this.s, h * this.s, x, y, w, h);
    }


    drawCustomIn(context, name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
        let img = this.get(name);
        context.drawImage(img, sourceX * this.s, sourceY * this.s, sourceWidth * this.s, sourceHeight * this.s, targetX, targetY, targetWidth, targetHeight);
    }
    
}


export default IntegerScaling;