"use strict";

//
// Display a Mandelbrot set
//

var canvas;
var gl;


/* default data*/

/* N x M array to be generated */

var scale = 0.125;
var time = 0.0;
// originally cs -2.0, cy -1.0
var cx = 0.0;             /* center of window in complex plane */
var cy = 0.0;
var max = 200;             /* number of interations per point */

var program;
var scaleText;
var centerText;
//----------------------------------------------------------------------------

async function init() {
    canvas = document.getElementById( "gl-canvas" );
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    scaleText = document.getElementById("Scale");
    scaleText.innerHTML = "Scale " + scale;
    centerText = document.getElementById("Center");
    centerText.innerHTML = "Center (" + cx.toFixed(3) + ", " + cy.toFixed(3) + ")";

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );


    // Create and initialize a buffer object
    var points = [
        vec4(-1.0, -1.0, 0.0, 1.0),
        vec4(-1.0,  1.0, 0.0, 1.0),
        vec4( 1.0,  1.0, 0.0, 1.0),
        vec4( 1.0,  1.0, 0.0, 1.0),
        vec4( 1.0, -1.0, 0.0, 1.0),
        vec4(-1.0, -1.0, 0.0, 1.0)
    ];

    // Load shaders and use the resulting shader program

    // Load shaders
    const vertexShaderSource = await fetch('/scripts/shaders/vertex.glsl').then(r => r.text());
    const fragmentShaderSource = await fetch('/scripts/shaders/fragment.glsl').then(r => r.text());
    program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    // set up vertex arrays
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    var vPosition = gl.getAttribLocation( program, "vPosition" );

    gl.enableVertexAttribArray( vPosition );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0,0);
    gl.bufferData( gl.ARRAY_BUFFER,  flatten(points), gl.STATIC_DRAW );

    gl.uniform1f( gl.getUniformLocation(program, "scale"), scale);
    gl.uniform1f( gl.getUniformLocation(program, "cx"), cx);
    gl.uniform1f( gl.getUniformLocation(program, "cy"), cy);
    gl.uniform1f( gl.getUniformLocation(program, "maxIterations"), max);

    //pass shaders width and height
    gl.uniform1f( gl.getUniformLocation(program, "width"), canvas.width );
    gl.uniform1f( gl.getUniformLocation(program, "height"), canvas.height );

    this.document.onwheel = function(event) {
        // Update scale
        if (event.deltaY < 0) {
            scale = scale * 0.9;
        } else {
            scale = scale * 1.1;
        }
        gl.uniform1f( gl.getUniformLocation(program, "scale"), scale);
        scaleText.innerHTML = "Scale " + scale.toFixed(2);
    }

    //dragging
    let isDragging = false;
    let lastX, lastY;
    this.document.onmousedown = function(event) {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    }
    this.document.onmousemove = function(event) {
        if (!isDragging) return;
        let dx = event.clientX - lastX;
        let dy = event.clientY - lastY;
        lastX = event.clientX;
        lastY = event.clientY;
        //update center
        cx -= dx / (canvas.width * scale);
        cy += dy / (canvas.height * scale);
        gl.uniform1f( gl.getUniformLocation(program, "cx"), cx);
        gl.uniform1f( gl.getUniformLocation(program, "cy"), cy);
        centerText.innerHTML = "Center (" + cx.toFixed(3) + ", " + cy.toFixed(3) + ")";
    }
    this.document.onmouseup = function(event) {
        isDragging = false;
    }

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.viewport(0, 0, canvas.width, canvas.height);
    render();
}

window.onload = init;
//----------------------------------------------------------------------------

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var crosshairCanvas = document.getElementById("crosshair-canvas");
    crosshairCanvas.width = window.innerWidth;
    crosshairCanvas.height = window.innerHeight;
    drawCrosshair();
    if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        //pass shaders width and height
        gl.uniform1f( gl.getUniformLocation(program, "width"), canvas.width );
        gl.uniform1f( gl.getUniformLocation(program, "height"), canvas.height );
    }
}

function drawCrosshair() {
    var crosshairCanvas = document.getElementById("crosshair-canvas");
    var ctx = crosshairCanvas.getContext("2d");
    ctx.clearRect(0, 0, crosshairCanvas.width, crosshairCanvas.height);
    var w = crosshairCanvas.width;
    var h = crosshairCanvas.height;
    var centerX = w / 2;
    var centerY = h / 2;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;

    //horizontal line
    ctx.beginPath();
    ctx.moveTo(centerX  -15, centerY);
    ctx.lineTo(centerX + 15, centerY);
    ctx.stroke();

    //vertical line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 15);
    ctx.lineTo(centerX, centerY + 15);
    ctx.stroke();

    ctx.restore();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    time += 0.1;
    gl.uniform1f(gl.getUniformLocation(program, "time"), time);

    gl.drawArrays( gl.TRIANGLES, 0, 6 );
    requestAnimFrame(render);
}
