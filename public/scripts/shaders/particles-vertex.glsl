attribute vec2 a_Position;
attribute vec4 a_Color;
attribute vec3 a_Normal;

varying vec4 v_Color;
varying vec3 v_Normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float u_PointSize;

void main() {
    v_Color = a_Color;
    v_Normal = a_Normal;
    gl_PointSize = u_PointSize;
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(a_Position, 0.0, 1.0);
    // For now, render particles directly in normalized coordinates [-1, 1]
    // Assuming particles are created in [0, canvas] space and already normalized by caller
    gl_Position = vec4(a_Position, 0.0, 1.0);
}
