
var HALF_PI = 1.570796;
var PI = 3.141593;
var TWO_PI = 6.283185;


function rand(min, max) {
	return min + Math.floor((1 + max - min) * Math.random());
}


function randFloat(min, max) {
	return min + ((max - min) * Math.random());
}


function zeroOrOne(probabilityOfOne) {
	return randFloat(0.0, 1.0) < probabilityOfOne;
}


function distance(x1, y1, x2, y2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	return Math.sqrt((dx * dx) + (dy * dy));
}


function angle(x1, y1, x2, y2) {
	return Math.atan2(x1 - x2, y2 - y1);
}


function toRad(degrees) {
	return degrees * 0.0174532;
}


function angleDelta(angleA, angleB) {
    var angleDelta = angleB - angleA;
    while(angleDelta > PI) {
        angleDelta -= TWO_PI;
    }
    while(angleDelta <= -PI) {
        angleDelta += TWO_PI;
    }
    return angleDelta;
}


function rgbToHex(r, g, b) {
    var hex = ((r * 65536) + (g * 256) + b).toString(16);    
    return "#" + ("000000".substring(0, 6 - hex.length)) + hex;
}


function hexToRGB(hex) {
	var r = parseInt(hex.substring(1,3), 16);
	var g = parseInt(hex.substring(3,5), 16);
	var b = parseInt(hex.substring(5,7), 16);
	return { r : r, g : g, b : b };
}


function hslToRGB(h, s, l) {
    
    if(s == 0) {
        return { r : Math.round(l * 255), g : Math.round(l * 255), b : Math.round(l * 255) };
    }
    
    var q;
    if(l < 0.5) {
        q = l * (1 + s);
    } else {
        q = l + s - (l * s);
    }
    var p = (2 * l) - q;

    return {
        r : Math.round(hueToRGB(p, q, h + (1 / 3)) * 255),
        g : Math.round(hueToRGB(p, q, h) * 255),
        b : Math.round(hueToRGB(p, q, h - (1 / 3)) * 255)
    };
}


function hueToRGB(p, q, t) {
	
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
}


function arrayToHex(colorArray) {
    return rgbToHex(colorArray[0], colorArray[1], colorArray[2]);
}


function inPolygon(polygon, pointX, pointY) {
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
}


function normalize(vector) {
	var length = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
	if(length == 0) {
		return { x : 0, y : 0 };
	}
	return { x : (vector.x / length), y : (vector.y / length) };
}


function limit(value, min, max) {
	if(value < min) {
		return min;
	}
	if(value > max) {
		return max;
	}
	return value;
}


function createMatrix(width, height, defaultValue) {
	var matrix = [];
	for(var x = 0; x < width; x++) {
		matrix[x] = [];
		for(var y = 0; y < height; y++) {
			matrix[x][y] = defaultValue;
		}
	}
	return matrix;
}


function createCanvas(width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas;
}


function getContext(canvas) {
	return canvas.getContext("2d");
}


function drawEllipse(c, x, y, w, h) {
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
	c.stroke();
}