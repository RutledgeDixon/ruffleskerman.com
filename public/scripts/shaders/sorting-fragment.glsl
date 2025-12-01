// Fragment shader for sorting visualization
precision mediump float;

varying vec4 v_Color;
varying vec3 v_Normal;

uniform vec3 u_Ambient_color;

void main() {
    vec3 normal = normalize(v_Normal);
    vec3 lightDir = normalize(vec3(0.0, 0.0, 1.0));
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 base = v_Color.rgb * (u_Ambient_color + 0.6 * diff);
    gl_FragColor = vec4(base, v_Color.a);
}
