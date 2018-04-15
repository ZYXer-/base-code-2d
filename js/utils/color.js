function Color(r, g, b) {

    this.r = r;
    this.g = g;
    this.b = b;

}


Color.prototype.toHex = function() {
    var hex = ((this.r * 65536) + (this.g * 256) + this.b).toString(16);
    return "#" + ("000000".substring(0, 6 - hex.length)) + hex;
};


Color.prototype.clone = function() {
    return new Color(this.r, this.g, this.b);
};


Color.fromRGB = function(r, g, b) {
    return new Color(r, g, b);
};


Color.fromArray = function(a) {
    return new Color(a[0], a[1], a[2]);
};


Color.fromHex = function(hex) {
    var r = parseInt(hex.substring(1,3), 16);
    var g = parseInt(hex.substring(3,5), 16);
    var b = parseInt(hex.substring(5,7), 16);
    return new Color(r, g, b);
};


Color.fromHSL = function(h, s, l) { // h, s and l are all values from 0.0 to 1.0
    if(s === 0) {
        return { r : Math.round(l * 255), g : Math.round(l * 255), b : Math.round(l * 255) };
    }

    var q;
    if(l < 0.5) {
        q = l * (1 + s);
    } else {
        q = l + s - (l * s);
    }
    var p = (2 * l) - q;

    return new Color(
        Math.round(Color.hueToRGB(p, q, h + (1 / 3)) * 255),
        Math.round(Color.hueToRGB(p, q, h) * 255),
        Math.round(Color.hueToRGB(p, q, h - (1 / 3)) * 255)
    );
};


Color.hueToRGB = function(p, q, t) {
    if(t < 0) {
        t += 1;
    }
    if(t > 1) {
        t -= 1;
    }

    if(t < 1 / 6) {
        return p + (6 * (q - p) * t);
    } else if(t < 1 / 2) {
        return q;
    } else if(t < 2/3) {
        return p + (6 * (q - p) * ((2 / 3) - t));
    } else {
        return p;
    }
};