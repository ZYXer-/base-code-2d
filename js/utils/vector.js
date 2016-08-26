function Vector(x, y, z) {


    this.x = x;
    this.y = y;
    this.z = z;


    this.translate = function(t) {
        var x = this.x + t.x;
        var y = this.y + t.y;
        var z = this.z + t.z;
        return new Vector(x, y, z);
    };


    this.scale = function(s) {
        var x = this.x * s.x;
        var y = this.y * s.y;
        var z = this.z * s.z;
        return new Vector(x, y, z);
    };


    this.rotateX = function(angle) {
        var x = this.x;
        var y = (this.y * Math.cos(angle)) - (this.z * Math.sin(angle));
        var z = (this.y * Math.sin(angle)) + (this.z * Math.cos(angle));
        return new Vector(x, y, z);
    };


    this.rotateY = function(angle) {
        var x = (this.z * Math.sin(angle)) + (this.x * Math.cos(angle));
        var y = this.y;
        var z = (this.z * Math.cos(angle)) - (this.x * Math.sin(angle));
        return new Vector(x, y, z);
    };


    this.rotateZ = function(angle) {
        var x = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        var y = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));
        var z = this.z;
        return new Vector(x, y, z);
    };

}