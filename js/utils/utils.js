
var HALF_PI = 1.570796;
var PI = 3.141593;
var TWO_PI = 6.283185;


function Utils() {}


Utils.rand = function(min, max) {
    return min + Math.floor((1 + max - min) * Math.random());
};


Utils.randFloat = function(min, max) {
    return min + ((max - min) * Math.random());
};


Utils.uniqueId = function(length) {
    var id = Math.random().toString(16).substr(2, 1);
    if(length > 1) {
        id += Utils.uniqueId(length - 1);
    }
    return id;
};


Utils.trueOrFalse = function(probabilityOfTrue) {
    return Utils.randFloat(0.0, 1.0) < probabilityOfTrue;
};


Utils.distance = function(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt((dx * dx) + (dy * dy));
};


Utils.angle = function(x1, y1, x2, y2) {
    return Math.atan2(x1 - x2, y2 - y1);
};


Utils.toRad = function(degrees) {
    return degrees * 0.0174532;
};


Utils.angleDelta = function(angleA, angleB) {
    var angleDelta = angleB - angleA;
    while(angleDelta > PI) {
        angleDelta -= TWO_PI;
    }
    while(angleDelta <= -PI) {
        angleDelta += TWO_PI;
    }
    return angleDelta;
};


Utils.inPolygon = function(polygon, pointX, pointY) {
    var inside = false;
    var j = (polygon.length - 1);
    for(var i = 0; i < polygon.length; i++) {
        if(((polygon[i].y > pointY) != (polygon[j].y > pointY)) &&
                (pointX < (polygon[j].x - polygon[i].x) * (pointY - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
            inside = !inside;
        }
        j = i;
    }
    return inside;
};


Utils.normalize = function(vector) {
    var length = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    if(length == 0) {
        return { x : 0, y : 0 };
    }
    return { x : (vector.x / length), y : (vector.y / length) };
};


Utils.limit = function(value, min, max) {
    if(value < min) {
        return min;
    }
    if(value > max) {
        return max;
    }
    return value;
};


Utils.createMatrix = function(width, height, defaultValue) {
    var matrix = [];
    for(var x = 0; x < width; x++) {
        matrix[x] = [];
        for(var y = 0; y < height; y++) {
            if(typeof defaultValue === "object") {
                matrix[x][y] = Utils.shallowCopy(defaultValue);
            } else {
                matrix[x][y] = defaultValue;
            }
        }
    }
    return matrix;
};


Utils.createCanvas = function(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
};


Utils.getContext = function(canvas) {
    return canvas.getContext("2d");
};


Utils.drawCircle = function(c, x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, TWO_PI);
    c.closePath();
};


Utils.drawEllipse = function(c, x, y, w, h) {
    var kappa = 0.5522848;
    var ox = (w / 2) * kappa;
    var oy = (h / 2) * kappa;
    var xe = x + w;
    var ye = y + h;
    var xm = x + w / 2;
    var ym = y + h / 2;

    c.beginPath();
    c.moveTo(x, ym);
    c.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    c.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    c.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    c.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    c.closePath();
};


Utils.drawRoundedCornerRect = function(x, y, w, h, r) {
    if(typeof r == "number") {
        r = [ r, r, r, r ];
    }
    c.beginPath();
    c.arc(x + r[0], y + r[0], r[0], PI, 3 * HALF_PI);
    c.arc(x + w - r[1], y + r[1], r[1], 3 * HALF_PI, TWO_PI);
    c.arc(x + w - r[2], y + h - r[2], r[2], 0, HALF_PI);
    c.arc(x + r[3], y + h - r[3], r[3], HALF_PI, PI);
    c.closePath();
};


Utils.parallaxCalculator = function(scale, pos, shift, textureWidth, tileWidth, screenWidth, overflow) {
    pos *= scale;
    pos += shift;
    var startingTile = Math.floor(pos / tileWidth);
    var tileOffset = pos - (tileWidth * startingTile);
    var numOfTilesInTex = Math.floor(textureWidth / tileWidth);
    var endTile = Math.ceil((pos + screenWidth + overflow + overflow) / tileWidth);
    var firstTileX = -tileOffset - overflow;
    var firstTileIndex = startingTile % numOfTilesInTex;
    var numOfTiles = endTile - startingTile;
    return { firstTileX : firstTileX, firstTileIndex : firstTileIndex, numOfTiles : numOfTiles };
};


Utils.shallowCopy = function(object) {
    return jQuery.extend({}, object);
};


Utils.deepCopy = function(object) {
    return jQuery.extend(true, {}, object);
};


Utils.removeFromArray = function(array, value) {
    var i = array.indexOf(value);
    if(i > -1) {
        array.splice(i, 1);
    }
    return array;
};


Utils.isInArray = function(array, value) {
    return array.indexOf(value) > -1;
};


Utils.getArrowControls = function() {
    var moveUpPressed = keyboard.isPressed(Keyboard.ARROW_UP) || keyboard.isPressed(Keyboard.W) || keyboard.isPressed(Keyboard.Z);
    var moveRightPressed = keyboard.isPressed(Keyboard.ARROW_RIGHT) || keyboard.isPressed(Keyboard.D);
    var moveDownPressed = keyboard.isPressed(Keyboard.ARROW_DOWN) || keyboard.isPressed(Keyboard.S);
    var moveLeftPressed = keyboard.isPressed(Keyboard.ARROW_LEFT) || keyboard.isPressed(Keyboard.A) || keyboard.isPressed(Keyboard.Q);
    var vector = { x : 0.0, y : 0.0 };
    if(moveUpPressed && !moveDownPressed) {
        vector.y -= 1.0;
    } else if(moveDownPressed && !moveUpPressed) {
        vector.y += 1.0;
    }
    if(moveRightPressed && !moveLeftPressed) {
        vector.x += 1.0;
    } else if(moveLeftPressed && !moveRightPressed) {
        vector.x -= 1.0;
    }
    return Utils.normalize(vector);
};