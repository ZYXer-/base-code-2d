
var QUART_PI = 0.785398;
var HALF_PI = 1.570796;
var PI = 3.141592;
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


Utils.intersectLines = function(line1point1, line1point2, line2point1, line2point2) {
    var x1 = line1point1.x;
    var y1 = line1point1.y;
    var x2 = line1point2.x;
    var y2 = line1point2.y;
    var x3 = line2point1.x;
    var y3 = line2point1.y;
    var x4 = line2point2.x;
    var y4 = line2point2.y;
    var demon = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
    if(demon === 0) {
        return null; // parallel
    }
    var x = (((x1 * y2) - (y1 * x2)) * (x3 - x4)) - ((x1 - x2) * ((x3 * y4) - (y3 * x4)));
    x /= demon;
    var y = (((x1 * y2) - (y1 * x2)) * (y3 - y4)) - ((y1 - y2) * ((x3 * y4) - (y3 * x4)));
    y /= demon;
    return new Vec2(x, y);
};


Utils.inPolygon = function(polygon, point) {
    var inside = false;
    var j = (polygon.length - 1);
    for(var i = 0; i < polygon.length; i++) {
        if(((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
                (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
            inside = !inside;
        }
        j = i;
    }
    return inside;
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


Utils.min = function(value, min) {
    if(value > min) {
        return min;
    }
    return value;
};


Utils.max = function(value, max) {
    if(value < max) {
        return max;
    }
    return value;
};


Utils.scale0to1 = function(value, min, max, reverse)
{
    reverse = (typeof reverse !== "undefined" ? reverse : false);
    if(min === max) {
        return 0.0;
    }
    value = (value - min) / (max - min);
    value = Utils.limit(value, 0.0, 1.0);

    if(reverse) {
        return (1.0 - value);
    } else {
        return value;
    }
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


Utils.drawPolygon = function(vec2List) {
    c.beginPath();
    var vec;
    if(vec2List.length > 0) {
        vec = vec2List[0];
        c.moveTo(vec.x, vec.y);
    }
    for(var i = 1; i < vec2List.length; i++) {
        vec = vec2List[i];
        c.lineTo(vec.x, vec.y);
    }
    c.closePath();
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


Utils.drawRing = function(c, x, y, innerRadius, outerRadius) {
    c.beginPath();
    c.arc(x, y, outerRadius, 0, TWO_PI, false);
    c.arc(x, y, innerRadius, TWO_PI, 0, true);
    c.closePath();
};


Utils.drawCircleSegment = function(c, x, y, radius, startAngle, endAngle) {
    c.beginPath();
    c.lineTo(x, y);
    c.arc(x, y, radius, startAngle, endAngle);
    c.closePath();
};


Utils.drawRingSegment = function(c, x, y, innerRadius, outerRadius, startAngle, endAngle) {
    c.beginPath();
    c.arc(x, y, outerRadius, startAngle, endAngle, false);
    c.arc(x, y, innerRadius, endAngle, startAngle, true);
    c.closePath();
};


Utils.drawRoundedCornerRect = function(x, y, w, h, r) {
    if(typeof r === "number") {
        r = [ r, r, r, r ];
    }
    c.beginPath();
    c.arc(x + r[0], y + r[0], r[0], PI, 3 * HALF_PI);
    c.arc(x + w - r[1], y + r[1], r[1], 3 * HALF_PI, TWO_PI);
    c.arc(x + w - r[2], y + h - r[2], r[2], 0, HALF_PI);
    c.arc(x + r[3], y + h - r[3], r[3], HALF_PI, PI);
    c.closePath();
};


Utils.drawStar = function(x, y, points, outerR, innerR) {
    var pointAngle = PI / points;
    c.save();
    c.translate(x, y);
    c.beginPath();
    c.moveTo(0, -outerR);
    c.lineTo(Math.sin(pointAngle) * innerR, -Math.cos(pointAngle) * innerR);
    for(var i = 1; i < points; i++) {
        c.lineTo(Math.sin((i * 2) * pointAngle) * outerR, -Math.cos((i * 2) * pointAngle) * outerR);
        c.lineTo(Math.sin(((i * 2) + 1) * pointAngle) * innerR, -Math.cos(((i * 2) + 1) * pointAngle) * innerR);
    }
    c.closePath();
    c.restore();
};


Utils.drawHeart = function(x, y, w, h, overhang) { // negative overhang = left, positive = right, best results h > w * 0.86 && h < w
    if(h < w * 0.86 || h > w) {
        console.warn("Utils.drawHeart() called with height that would not result in a heart shape. Parameter h should be greater than 0.86 * w and less than w.");
    }
    c.save();
    c.translate(x, y);
    var r = (h - (0.5 * w)) / 1.4142136;
    var a = (1.0 - 0.7071068) * r;
    var alpha = Math.acos(0.5 * (w - (2 * r)) / r);

    c.beginPath();
    c.moveTo(0.0, h * 0.5);
    c.lineTo((w * -0.5) + a, (h * 0.5) + a - (w * 0.5));

    c.arc((w * -0.5) + r, (h * -0.5) + r, r, 3 * QUART_PI, -alpha);
    if(overhang > 0.0) {
        c.arc((w * -0.5) + r, (h * -0.5) + r, r, -alpha, -alpha + overhang);
        c.arc((w * -0.5) + r, (h * -0.5) + r, r, -alpha + overhang, -alpha, true);
    }
    if(overhang < 0.0) {
        c.arc((w * 0.5) - r, (h * -0.5) + r, r, -PI + alpha, -PI + alpha + overhang, true);
        c.arc((w * 0.5) - r, (h * -0.5) + r, r, -PI + alpha + overhang, -PI + alpha);
    }
    c.arc((w * 0.5) - r, (h * -0.5) + r, r, -PI + alpha, QUART_PI);

    c.closePath();
    c.restore();
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


Utils.arrayShuffle = function(array) {
    var i = array.length;
    var temp;
    var randI;
    while (0 !== i) {
        randI = Math.floor(Math.random() * i);
        i -= 1;
        temp = array[i];
        array[i] = array[randI];
        array[randI] = temp;
    }
    return array;
};


Utils.mergeArrays = function(array1, array2) {
    return array1.concat(array2);
};


Utils.stopwatch = function(stopwatchTime, speed, min, max, callbacks) {

    var lastTime = stopwatchTime;
    stopwatchTime += speed * Timer.delta;
    stopwatchTime = Utils.limit(stopwatchTime, min, max);

    if(stopwatchTime === min) {
        if(lastTime > min && callbacks.hasOwnProperty("reachMin")) {
            callbacks.reachMin();
        }
        if(callbacks.hasOwnProperty("atMin")) {
            callbacks.atMin();
        }
    }

    if(stopwatchTime === max) {
        if(lastTime < max && callbacks.hasOwnProperty("reachMax")) {
            callbacks.reachMax();
        }
        if(callbacks.hasOwnProperty("atMax")) {
            callbacks.atMax();
        }
    }

    if(stopwatchTime < max && callbacks.hasOwnProperty("exceptMax")) {
        callbacks.exceptMax();
    }
    if(stopwatchTime > min && callbacks.hasOwnProperty("exceptMin")) {
        callbacks.exceptMin();
    }
    if(stopwatchTime > min && stopwatchTime < max && callbacks.hasOwnProperty("exceptMinMax")) {
        callbacks.exceptMinMax();
    }

    return stopwatchTime;
};


Utils.getArrowControls = function() {
    var moveUpPressed = Keyboard.isPressed(Keyboard.ARROW_UP) || Keyboard.isPressed(Keyboard.W) || Keyboard.isPressed(Keyboard.Z);
    var moveRightPressed = Keyboard.isPressed(Keyboard.ARROW_RIGHT) || Keyboard.isPressed(Keyboard.D);
    var moveDownPressed = Keyboard.isPressed(Keyboard.ARROW_DOWN) || Keyboard.isPressed(Keyboard.S);
    var moveLeftPressed = Keyboard.isPressed(Keyboard.ARROW_LEFT) || Keyboard.isPressed(Keyboard.A) || Keyboard.isPressed(Keyboard.Q);
    var vector = new Vec2(0.0, 0.0);
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
    return vector.normalize();
};


Utils.pad = function(number, length) {
    var numberString = number.toString();
    var pad = "00000000";
    return pad.substring(0, length - numberString.length) + numberString;
};


Utils.toFixedDecimal = function(number, numberOfDecimals) {
    return number.toFixed(numberOfDecimals);
};


Utils.titleCase = function(string) {
    return string.split(" ").map(function(word) {
        return word.charAt(0).toUpperCase() + word.substr(1);
    }).join(" ");
};