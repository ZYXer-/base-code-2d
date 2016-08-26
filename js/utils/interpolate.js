function Interpolate() {}


Interpolate.sin = function(x) {
    return limit(0.5 - (0.5 * Math.cos(PI * x)), 0.0, 1.0);
};


Interpolate.sinIn = function(x) {
    return limit(Math.sin(HALF_PI * x), 0.0, 1.0);
};


Interpolate.sinOut = function(x) {
    return limit(1.0 - Math.cos(HALF_PI * x), 0.0, 1.0);
};


Interpolate.quad = function(x) {
    x *= 2.0;
    if(x < 1.0) {
        return limit(0.5 * x * x, 0.0, 1.0);
    } else {
        x = 2.0 - x;
        return limit(1.0 - (0.5 * x * x), 0.0, 1.0);
    }
};


Interpolate.quadIn = function(x) {
    return -1.0 + (2.0 * Interpolate.quad(0.5 + (x * 0.5)));
};


Interpolate.quadOut = function(x) {
    return 2.0 * Interpolate.quad(x * 0.5);
};


Interpolate.cube = function(x) {
    x *= 2.0;
    if(x < 1.0) {
        return limit(0.5 * x * x * x, 0.0, 1.0);
    } else {
        x = 2.0 - x;
        return limit(1.0 - (0.5 * x * x * x), 0.0, 1.0);
    }
};


Interpolate.cubeIn = function(x) {
    return -1.0 + (2.0 * Interpolate.cube(0.5 + (x * 0.5)));
};


Interpolate.cubeOut = function(x) {
    return 2.0 * Interpolate.cube(x * 0.5);
};