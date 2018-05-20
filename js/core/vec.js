function Vec2(x, y) {

    this.x = x;
    this.y = y;

}


Vec2.prototype.copy = function() {
    return new Vec2(this.x, this.y);
};


Vec2.prototype.negative = function() {
    return new Vec2(-this.x, -this.y);
};


Vec2.prototype.abs = function() {
    return new Vec2(Math.abs(this.x), Math.abs(this.y));
};


Vec2.prototype.add = function(t) {
    return new Vec2(this.x + t.x, this.y + t.y);
};


Vec2.prototype.subtract = function(t) {
    return new Vec2(this.x - t.x, this.y - t.y);
};


Vec2.prototype.multiply = function(s) {
    return new Vec2(this.x * s, this.y * s);
};


Vec2.prototype.floor = function() {
    return new Vec2(Math.floor(this.x), Math.floor(this.y));
};


Vec2.prototype.round = function() {
    return new Vec2(Math.round(this.x), Math.round(this.y));
};


Vec2.prototype.ceil = function() {
    return new Vec2(Math.ceil(this.x), Math.ceil(this.y));
};


Vec2.prototype.min = function(minLength) {
    var currentLength = this.norm();
    if(currentLength < minLength) {
        return this.normalize().multiply(minLength);
    }
    return this.copy();
};


Vec2.prototype.max = function(maxLength) {
    var currentLength = this.norm();
    if(currentLength > maxLength) {
        return this.normalize().multiply(maxLength);
    }
    return this.copy();
};


Vec2.prototype.limit = function(minLength, maxLength) {
    var currentLength = this.norm();
    if(currentLength < minLength) {
        return this.normalize().multiply(minLength);
    } else if(currentLength > maxLength) {
        return this.normalize().multiply(maxLength);
    }
    return this.copy();
};


Vec2.prototype.norm = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};


Vec2.prototype.angle = function() {
    return Math.atan2(this.x, this.y);
};


Vec2.prototype.normalize = function() {
    var length = this.norm();
    if(length === 0) {
        return new Vec2(0.0, 0.0);
    }
    return new Vec2(this.x / length, this.y / length);
};


Vec2.prototype.rotate = function(angle) {
    return new Vec2(
        (this.x * Math.cos(angle)) - (this.y * Math.sin(angle)),
        (this.x * Math.sin(angle)) + (this.y * Math.cos(angle))
    );
};


Vec2.prototype.rotate90DegCW = function() {
    return new Vec2(this.y, -this.x);
};


Vec2.prototype.rotate90DegCCW = function() {
    return new Vec2(-this.y, this.x);
};


Vec2.prototype.toString = function() {
    return "x=" + this.x + " / y=" + this.y;
};


Vec2.prototype.toVec3 = function() {
    return new Vec3(this.x, this.y, 0.0);
};


Vec2.fromAngle = function(angle) {
    return new Vec2(Math.sin(angle), Math.cos(angle));
};


function Vec3(x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;

}


Vec3.prototype.copy = function() {
    return new Vec3(this.x, this.y, this.z);
};


Vec3.prototype.negative = function() {
    return new Vec3(-this.x, -this.y, -this.z);
};


Vec3.prototype.abs = function() {
    return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
};


Vec3.prototype.add = function(t) {
    return new Vec3(this.x + t.x, this.y + t.y, this.z + t.z);
};


Vec3.prototype.subtract = function(t) {
    return new Vec3(this.x - t.x, this.y - t.y, this.z - t.z);
};


Vec3.prototype.multiply = function(s) {
    return new Vec3(this.x * s, this.y * s, this.z * s);
};


Vec3.prototype.floor = function() {
    return new Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
};


Vec3.prototype.round = function() {
    return new Vec3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
};


Vec3.prototype.ceil = function() {
    return new Vec3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
};


Vec3.prototype.min = function(minLength) {
    var currentLength = this.norm();
    if(currentLength < minLength) {
        return this.normalize().multiply(minLength);
    }
    return this.copy();
};


Vec3.prototype.max = function(maxLength) {
    var currentLength = this.norm();
    if(currentLength > maxLength) {
        return this.normalize().multiply(maxLength);
    }
    return this.copy();
};


Vec3.prototype.limit = function(minLength, maxLength) {
    var currentLength = this.norm();
    if(currentLength < minLength) {
        return this.normalize().multiply(minLength);
    } else if(currentLength > maxLength) {
        return this.normalize().multiply(maxLength);
    }
    return this.copy();
};


Vec3.prototype.norm = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
};


Vec3.prototype.normalize = function() {
    var length = this.norm();
    if(length === 0) {
        return new Vec3(0.0, 0.0, 0.0);
    }
    return new Vec3(this.x / length, this.y / length, this.z / length);
};


Vec3.prototype.rotateX = function(angle) {
    return new Vec3(
        this.x,
        (this.y * Math.cos(angle)) - (this.z * Math.sin(angle)),
        (this.y * Math.sin(angle)) + (this.z * Math.cos(angle))
    );
};


Vec3.prototype.rotateY = function(angle) {
    return new Vec3(
        (this.z * Math.sin(angle)) + (this.x * Math.cos(angle)),
        this.y,
        (this.z * Math.cos(angle)) - (this.x * Math.sin(angle))
    );
};


Vec3.prototype.rotateZ = function(angle) {
    return new Vec3(
        (this.x * Math.cos(angle)) - (this.y * Math.sin(angle)),
        (this.x * Math.sin(angle)) + (this.y * Math.cos(angle)),
        this.z
    );
};


Vec3.prototype.toThree = function() {
    return new THREE.Vector3(this.x, this.y, this.z);
};


Vec3.prototype.toString = function() {
    return "x=" + this.x + " / y=" + this.y + " / z=" + this.z;
};


Vec3.prototype.toVec2 = function() {
    return new Vec2(this.x, this.y);
};