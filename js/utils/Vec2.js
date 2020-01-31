export default class Vec2 {


    constructor(x, y) {
        this.x = x;
        this.y = y;
    }


    equals(other) {
        return (this.x === other.x && this.y === other.y);
    }


    copy() {
        return new Vec2(this.x, this.y);
    }


    negative() {
        return new Vec2(-this.x, -this.y);
    }


    abs() {
        return new Vec2(Math.abs(this.x), Math.abs(this.y));
    }


    add(t) {
        return new Vec2(this.x + t.x, this.y + t.y);
    }


    subtract(t) {
        return new Vec2(this.x - t.x, this.y - t.y);
    }


    multiply(s) {
        return new Vec2(this.x * s, this.y * s);
    }


    floor() {
        return new Vec2(Math.floor(this.x), Math.floor(this.y));
    }


    round() {
        return new Vec2(Math.round(this.x), Math.round(this.y));
    }


    ceil() {
        return new Vec2(Math.ceil(this.x), Math.ceil(this.y));
    }


    min(minLength) {
        let currentLength = this.norm();
        if(currentLength < minLength) {
            return this.normalize().multiply(minLength);
        }
        return this.copy();
    }


    max(maxLength) {
        let currentLength = this.norm();
        if(currentLength > maxLength) {
            return this.normalize().multiply(maxLength);
        }
        return this.copy();
    }


    clamp(minLength, maxLength) {
        let currentLength = this.norm();
        if(currentLength < minLength) {
            return this.normalize().multiply(minLength);
        } else if(currentLength > maxLength) {
            return this.normalize().multiply(maxLength);
        }
        return this.copy();
    }


    norm() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }


    angle() {
        return Math.atan2(this.x, this.y);
    }


    normalize() {
        let length = this.norm();
        if(length === 0) {
            return new Vec2(0.0, 0.0);
        }
        return new Vec2(this.x / length, this.y / length);
    }


    rotate(angle) {
        return new Vec2(
            (this.x * Math.cos(angle)) - (this.y * Math.sin(angle)),
            (this.x * Math.sin(angle)) + (this.y * Math.cos(angle))
        );
    }


    rotate90DegCW() {
        return new Vec2(this.y, -this.x);
    }


    rotate90DegCCW() {
        return new Vec2(-this.y, this.x);
    }


    toString() {
        return "x=" + this.x + " / y=" + this.y;
    }


    toVec3() {
        return new Vec3(this.x, this.y, 0.0);
    }


    static fromAngle(angle) {
        return new Vec2(Math.sin(angle), Math.cos(angle));
    }

}