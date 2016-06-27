function Img() {

    this.assets = {};


    this.get = function(name) {
        return this.assets[name];
    };


    this.draw = function(name, x, y) {
        c.drawImage(this.assets[name], x, y);
    };


    this.drawSprite = function(name, x, y, w, h, posX, posY) {
        c.drawImage(this.assets[name], w * posX, h * posY, w, h, x, y, w, h);
    };


    this.drawRotated = function(name, x, y, centerX, centerY, angle) {
        c.save();
        c.translate(x, y);
        c.rotate(angle);
        c.translate(-centerX, -centerY);
        c.drawImage(this.assets[name], 0, 0);
        c.restore();
    };


    this.drawRotatedSprite = function(name, x, y, w, h, posX, posY, centerX, centerY, angle) {
        c.save();
        c.translate(x, y);
        c.rotate(angle);
        c.translate(-centerX, -centerY);
        c.drawImage(this.assets[name], w * posX, h * posY, w, h, 0, 0, w, h);
        c.restore();
    };


    this.add = function(name, image) {
        this.assets[name] = image;
    };

}