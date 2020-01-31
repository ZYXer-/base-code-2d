import { c } from "./canvas.js";


const assets = new Map();


export function add(name, image) {
    assets.set(name, image);
}


export function isLoaded(name) {
    return assets.has(name);
}


export function get(name) {
    if(assets.has(name)) {
        return assets.get(name);
    } else {
        alert("There is no image named '" + name + "'.");
        return null;
    }
}


export function draw(name, x, y) {
    c.drawImage(get(name), x, y);
}


export function drawSprite(name, x, y, w, h, posX, posY) {
    c.drawImage(get(name), w * posX, h * posY, w, h, x, y, w, h);
}


export function drawRotated(name, x, y, centerX, centerY, angle) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.translate(-centerX, -centerY);
    c.drawImage(get(name), 0, 0);
    c.restore();
}


export function drawRotatedSprite(name, x, y, w, h, posX, posY, centerX, centerY, angle) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.translate(-centerX, -centerY);
    c.drawImage(get(name), w * posX, h * posY, w, h, 0, 0, w, h);
    c.restore();
}


export function drawCustom(name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    c.drawImage(get(name), sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
}


export function drawScaled(name, x, y, scale) {
    c.save();
    c.translate(x, y);
    c.scale(scale, scale);
    draw(name, 0, 0);
    c.restore();
}


export function drawSpriteScaled(name, x, y, targetW, targetH, posX, posY, scale) {
    c.save();
    c.translate(x, y);
    c.scale(scale, scale);
    drawSprite(name, 0, 0, targetW / scale, targetH / scale, posX, posY);
    c.restore();
}


export function drawIn(context, name, x, y) {
    context.drawImage(get(name), x, y);
}


export function drawSpriteIn(context, name, x, y, w, h, posX, posY) {
    context.drawImage(get(name), w * posX, h * posY, w, h, x, y, w, h);
}


export function drawCustomIn(context, name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    context.drawImage(get(name), sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
}


export function drawScaledIn(context, name, x, y, scale) {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    drawIn(context, name, 0, 0);
    context.restore();
}


export function drawSpriteScaledIn(context, name, x, y, targetW, targetH, posX, posY, scale) {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    drawSpriteIn(context, name, 0, 0, targetW / scale, targetH / scale, posX, posY);
    context.restore();
}