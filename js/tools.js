
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


function createCanvas(width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}


function createGeometryFromVertices(vertices) {
  var geometry = new THREE.Geometry();
  for(var i = 0; i + 2 < vertices.length; i++) {
    geometry.vertices.push(
        vertices[i],
        vertices[i + 1],
        vertices[i + 2]
    );
    geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
  }
  geometry.computeBoundingSphere();
  return geometry;
}