function Img() {}


Img.assets = {};


Img.add = function(name, image) {
    Img.assets[name] = image;
};


Img.isLoaded = function(name) {
    return Img.assets.hasOwnProperty(name);
};


Img.get = function(name) {
    var img = Img.assets[name];
    if(img === undefined) {
        alert("There is no image named '" + name + "'.");
    }
    return img;
};


Img.draw = function(name, x, y) {
    c.drawImage(Img.get(name), x, y);
};


Img.drawSprite = function(name, x, y, w, h, posX, posY) {
    c.drawImage(Img.get(name), w * posX, h * posY, w, h, x, y, w, h);
};


Img.drawRotated = function(name, x, y, centerX, centerY, angle) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.translate(-centerX, -centerY);
    c.drawImage(Img.get(name), 0, 0);
    c.restore();
};


Img.drawRotatedSprite = function(name, x, y, w, h, posX, posY, centerX, centerY, angle) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.translate(-centerX, -centerY);
    c.drawImage(Img.get(name), w * posX, h * posY, w, h, 0, 0, w, h);
    c.restore();
};


Img.drawCustom = function(name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    c.drawImage(Img.get(name), sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
};


Img.drawScaled = function(name, x, y, scale) {
    c.save();
    c.translate(x, y);
    c.scale(scale, scale);
    Img.draw(name, 0, 0);
    c.restore();
};


Img.drawSpriteScaled = function(name, x, y, targetW, targetH, posX, posY, scale) {
    c.save();
    c.translate(x, y);
    c.scale(scale, scale);
    Img.drawSprite(name, 0, 0, targetW / scale, targetH / scale, posX, posY);
    c.restore();
};


Img.drawIn = function(context, name, x, y) {
    context.drawImage(Img.get(name), x, y);
};


Img.drawSpriteIn = function(context, name, x, y, w, h, posX, posY) {
    context.drawImage(Img.get(name), w * posX, h * posY, w, h, x, y, w, h);
};


Img.drawCustomIn = function(context, name, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    context.drawImage(Img.get(name), sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
};


Img.drawScaledIn = function(context, name, x, y, scale) {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    Img.drawIn(context, name, 0, 0);
    context.restore();
};


Img.drawSpriteScaledIn = function(context, name, x, y, targetW, targetH, posX, posY, scale) {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    Img.drawSpriteIn(context, name, 0, 0, targetW / scale, targetH / scale, posX, posY);
    context.restore();
};


