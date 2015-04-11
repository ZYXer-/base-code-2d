/**
 * Created by janmeier on 20.01.15.
 */
uniform float time;
uniform float amplitude;
attribute vec3 aCol;
attribute float aX;
attribute float aY;
varying vec3 vColor;

void main() {
    vec3 newPosition = vec3(position * 1.0);
    newPosition.y += sin(time+aX) * sin(time+aY)*sin(time+aY) * amplitude ;
    vColor = aCol;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
