import Vec2 from "./Vec2.js";


export default class Vec3 {


    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    equals(other) {
        return (this.x === other.x && this.y === other.y && this.z === other.z);
    }


    copy() {
        return new Vec3(this.x, this.y, this.z);
    }


    negative() {
        return new Vec3(-this.x, -this.y, -this.z);
    }


    abs() {
        return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }


    add(t) {
        return new Vec3(this.x + t.x, this.y + t.y, this.z + t.z);
    }


    subtract(t) {
        return new Vec3(this.x - t.x, this.y - t.y, this.z - t.z);
    }


    multiply(s) {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }


    floor() {
        return new Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }


    round() {
        return new Vec3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
    }


    ceil() {
        return new Vec3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
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
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }


    normalize() {
        let length = this.norm();
        if(length === 0) {
            return new Vec3(0.0, 0.0, 0.0);
        }
        return new Vec3(this.x / length, this.y / length, this.z / length);
    }


    rotateX(angle) {
        return new Vec3(
            this.x,
            (this.y * Math.cos(angle)) - (this.z * Math.sin(angle)),
            (this.y * Math.sin(angle)) + (this.z * Math.cos(angle))
        );
    }


    rotateY(angle) {
        return new Vec3(
            (this.z * Math.sin(angle)) + (this.x * Math.cos(angle)),
            this.y,
            (this.z * Math.cos(angle)) - (this.x * Math.sin(angle))
        );
    }


    rotateZ(angle) {
        return new Vec3(
            (this.x * Math.cos(angle)) - (this.y * Math.sin(angle)),
            (this.x * Math.sin(angle)) + (this.y * Math.cos(angle)),
            this.z
        );
    }


    toThree() {
        return new THREE.Vector3(this.x, this.y, this.z);
    }


    toString() {
        return "x=" + this.x + " / y=" + this.y + " / z=" + this.z;
    }


    toVec2() {
        return new Vec2(this.x, this.y);
    }

}