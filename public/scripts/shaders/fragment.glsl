precision mediump float;
uniform float cx;
uniform float cy;
uniform float scale;
uniform float time;
uniform float maxIterations;
uniform float height;
uniform float width;

void main() {
    const float PI = 3.14159;
    float v;
    float x = (gl_FragCoord.x - width/2.0) / (min(width, height)*scale) + cx;
    float y = (gl_FragCoord.y - height/2.0) / (min(width, height)*scale) + cy;
    float ax=0.0, ay=0.0;
    float bx, by;
    float twist = 0.05 * cos(time/10.0) * cos(3.44 * atan(y, x)) / scale;
    int escaped = 0;
    for ( int k = 0; k < 100000; k++ ) {
        if (float(k) >= maxIterations) break;
        bx  = ax*ax-ay*ay;
        by = 2.0*ax*ay;
        ax = bx+x + twist;
        ay = by+y + twist;
        v = ax*ax+ay*ay;
        if (v > 4.0) {
            escaped = 1;
            break;
        }
    }
    if (escaped == 1) {
        gl_FragColor = vec4(0.08, 0.32, 0.18, 1.0); // green for background
    } else {
        v = min(v, 1.0);
        gl_FragColor.r = 0.5; //max(0.0, v-0.7);
        gl_FragColor.g = 0.3* sin( 1.0*PI*v) + 0.4;
        gl_FragColor.b = 0.5* cos( 4.0*PI*v) + 0.3;
        gl_FragColor.a = 1.0;
    }
}
