function Img() {}


Img.assets = {};


Img.get = function(name) {
    return Img.assets[name];
};


Img.draw = function(name, x, y) {
    c.drawImage(Img.assets[name], x, y);
};


Img.drawSprite = function(name, x, y, w, h, posX, posY) {
    c.drawImage(Img.assets[name], w * posX, h * posY, w, h, x, y, w, h);
};


Img.drawRotated = function(name, x, y, centerX, centerY, angle) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.translate(-centerX, -centerY);
    c.drawImage(Img.assets[name], 0, 0);
    c.restore();
};


Img.drawRotatedSprite = function(name, x, y, w, h, posX, posY, centerX, centerY, angle) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.translate(-centerX, -centerY);
    c.drawImage(Img.assets[name], w * posX, h * posY, w, h, 0, 0, w, h);
    c.restore();
};


Img.drawCustom = function(name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    c.drawImage(Img.get(name), sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
};


Img.add = function(name, image) {
    Img.assets[name] = image;
};