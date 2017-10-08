function IntegerScaling(minScale, maxScale, minUnitsPerWidth, minUnitsPerHeight) {

    this.minScale = minScale;
    this.maxScale = maxScale;

    this.minUnitsPerWidth = minUnitsPerWidth;
    this.minUnitsPerHeight = minUnitsPerHeight;

    this.s = minScale;

    this.unscaledPivot = new Vec2(0, 0);
    this.scaledPivot = new Vec2(0, 0);

    this.resize();
}


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
};


IntegerScaling.prototype.apply = function(unscaledPivot, scaledPivot) {
    this.unscaledPivot = unscaledPivot;
    this.scaledPivot = scaledPivot;
    c.save();
    c.translate(unscaledPivot.x, unscaledPivot.y);
    c.scale(this.s, this.s);
    c.translate(-scaledPivot.x, -scaledPivot.y);
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


IntegerScaling.prototype.get = function(name) {
    return Img.get(name + this.s);
};


IntegerScaling.prototype.draw = function(name, x, y) {
    var img = this.get(name);
    c.drawImage(img, 0, 0, img.width, img.height, x, y, img.width / this.s, img.height / this.s);
};


IntegerScaling.prototype.drawSprite = function(name, x, y, w, h, posX, posY) {
    var img = this.get(name);
    c.drawImage(img, posX * w * this.s, posY * h * this.s, w, h, x, y, w, h);
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
    context.drawImage(img, posX * w * this.s, posY * h * this.s, w, h, x, y, w, h);
};


IntegerScaling.prototype.drawCustomIn = function(context, name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    var img = this.get(name);
    context.drawImage(img, sourceX * this.s, sourceY * this.s, sourceWidth * this.s, sourceHeight * this.s, targetX, targetY, targetWidth, targetHeight);
};
