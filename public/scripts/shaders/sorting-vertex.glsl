attribute vec3 a_Position;
attribute vec4 a_Color;
attribute vec3 a_Normal;

varying vec4 v_Color;
varying vec3 v_Normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
    v_Color = a_Color;
    v_Normal = a_Normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(a_Position, 1.0);
}
