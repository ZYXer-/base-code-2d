function IntegerScaling(minScale, maxScale, minUnitsPerWidth, minUnitsPerHeight) {

    this.minScale = minScale;
    this.maxScale = maxScale;

    this.minUnitsPerWidth = minUnitsPerWidth;
    this.minUnitsPerHeight = minUnitsPerHeight;

    this.s = minScale;

    this.unscaledPivot = new Vec2(0, 0);
    this.scaledPivot = new Vec2(0, 0);

    this.gameWidth = 0.0;
    this.gameHeight = 0.0;

    this.mousePos = new Vec2(0, 0);

    this.resize();

    if(Settings.Size.FIXED_SIZE_IN_UNITS) {
        console.warn("Do not use FIXED_SIZE_IN_UNITS and IntegerScaling at the same time, as this might lead to unexpected results.");
    }
}


IntegerScaling.prototype.setPivotPoints = function(unscaledPivot, scaledPivot) {
    this.unscaledPivot = unscaledPivot;
    this.scaledPivot = scaledPivot;
};


IntegerScaling.prototype.addScalableImage = function(name) {
    for(var scale = this.minScale; scale <= this.maxScale; scale++) {
        ImageProcessing.pixelate(name, name + scale, scale);
    }
};


IntegerScaling.prototype.resize = function() {

    var widthScale = Math.floor(Game.width / this.minUnitsPerWidth);
    var heightScale = Math.floor(Game.height / this.minUnitsPerHeight);

    this.s = widthScale;
    if(widthScale > heightScale) {
        this.s = heightScale;
    }

    this.s = Utils.limit(this.s, this.minScale, this.maxScale);

    this.gameWidth = Game.width / this.s;
    this.gameHeight = Game.height / this.s;
};


IntegerScaling.prototype.screenToWorld = function(point) {
    return point.subtract(this.unscaledPivot).multiply(1.0 / this.s).add(this.scaledPivot);
};


IntegerScaling.prototype.worldToScreen = function(point) {
    return point.subtract(this.scaledPivot).multiply(this.s).add(this.unscaledPivot);
};


IntegerScaling.prototype.apply = function() {
    c.save();
    c.translate(this.unscaledPivot.x, this.unscaledPivot.y);
    c.scale(this.s, this.s);
    c.translate(-this.scaledPivot.x, -this.scaledPivot.y);
    this.mousePos = this.screenToWorld(Mouse.pos);
};


IntegerScaling.prototype.restore = function() {
    c.restore();
};


IntegerScaling.prototype.drawMask = function(x, y, w, h, color) {
    var maskL = this.unscaledPivot.x + ((-this.scaledPivot.x + x) * this.s);
    var maskR = this.unscaledPivot.x + ((-this.scaledPivot.x + x + w) * this.s);
    var maskT = this.unscaledPivot.y + ((-this.scaledPivot.y + y) * this.s);
    var maskB = this.unscaledPivot.y + ((-this.scaledPivot.y + y + h) * this.s);

    c.fillStyle = color;

    c.fillRect(-10, -10, Game.width + 20, maskT + 10);
    c.fillRect(-10, -10, maskL + 10, Game.height + 20);
    c.fillRect(maskR, -10, Game.width + 10 - maskR, Game.height + 20);
    c.fillRect(-10, maskB, Game.width + 20, Game.height + 10 - maskB);
};


IntegerScaling.prototype.mouseIsOver = function(x, y, w, h) {
    return (this.mousePos.x >= x && this.mousePos.x < x + w && this.mousePos.y >= y && this.mousePos.y < y + h);
};


IntegerScaling.prototype.mouseIsOverCircle = function(x, y, r) {
    var deltaX = this.mousePos.x - x;
    var deltaY = this.mousePos.y - y;
    return (deltaX * deltaX) + (deltaY * deltaY) <= r * r;
};


IntegerScaling.prototype.get = function(name) {
    return Img.get(name + this.s);
};


IntegerScaling.prototype.draw = function(name, x, y) {
    var img = this.get(name);
    c.drawImage(img, 0, 0, img.width, img.height, x, y, img.width / this.s, img.height / this.s);
};


IntegerScaling.prototype.drawSprite = function(name, x, y, w, h, posX, posY) {
    var img = this.get(name);
    c.drawImage(img, posX * w * this.s, posY * h * this.s, w * this.s, h * this.s, x, y, w, h);
};


IntegerScaling.prototype.drawRotated = function(name, x, y, centerX, centerY, angle) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.translate(-centerX, -centerY);
    this.draw(name, 0, 0);
    c.restore();
};


IntegerScaling.prototype.drawRotatedSprite = function(name, x, y, w, h, posX, posY, centerX, centerY, angle) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.translate(-centerX, -centerY);
    this.drawSprite(name, 0, 0, w, h, posY, posY);
    c.restore();
};


IntegerScaling.prototype.drawCustom = function(name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    var img = this.get(name);
    c.drawImage(img, sourceX * this.s, sourceY * this.s, sourceWidth * this.s, sourceHeight * this.s, targetX, targetY, targetWidth, targetHeight);
};


IntegerScaling.prototype.drawIn = function(context, name, x, y) {
    var img = this.get(name);
    context.drawImage(img, 0, 0, img.width, img.height, x, y, img.width / this.s, img.height / this.s);
};


IntegerScaling.prototype.drawSpriteIn = function(context, name, x, y, w, h, posX, posY) {
    var img = this.get(name);
    context.drawImage(img, posX * w * this.s, posY * h * this.s, w * this.s, h * this.s, x, y, w, h);
};


IntegerScaling.prototype.drawCustomIn = function(context, name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    var img = this.get(name);
    context.drawImage(img, sourceX * this.s, sourceY * this.s, sourceWidth * this.s, sourceHeight * this.s, targetX, targetY, targetWidth, targetHeight);
};
