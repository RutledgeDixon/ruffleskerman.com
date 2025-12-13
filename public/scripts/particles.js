//Rutledge Dixon
//Particle System
//Takes a shape, and moves particles into that shape

var gl;
var program;
var vPosition;
var vColor;
var vNormal;
var vertexBuffer;
var indexBuffer; 
var colorBuffer;
var normalBuffer;
var pointSizeLoc;

var ambientColor = [0.2, 0.2, 0.2];

var shape;
var p;
var mouse = { x: 0, y: 0 };
var mouseDown = false;
var particleMovementType = "boid";

//camera stuff
// camera frustum (updated to cover the scene distances)
var near = 0.1;
var far = 100.0;
var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect = 1.0; // will be set from canvas in main()
var zmin = 1.0;
var zmax = 50.0;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
// position the eye so it looks at the small quads near the origin
var eye = vec3(0.0, 0.6, 2.0);
var at = vec3(0.0, 0.15, 0.0);
var up = vec3(0.0, 1.0, 0.0);

async function main() {
    //load the canvas and context
    var canvas = document.getElementById("webgl");
    var header = document.getElementById("header");

    gl = getWebGLContext(canvas);
    if (!gl) { alert("WebGL isn't available"); return; }

    //  Configure WebGL
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    // keep aspect ratio in sync with canvas display size
    aspect = (canvas.clientWidth / canvas.clientHeight) || 1.0;

    // update on window resize
    window.addEventListener('resize', function() {
        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, canvas.width, canvas.height);
        aspect = (canvas.clientWidth / canvas.clientHeight) || 1.0;
    });
    gl.clearColor(0.3, 0.3, 0.3, 1.0);

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Load shaders
    const vertexShaderSource = await fetch('/scripts/shaders/particles-vertex.glsl').then(r => r.text());
    const fragmentShaderSource = await fetch('/scripts/shaders/particles-fragment.glsl').then(r => r.text());
    console.log("Shaders loaded:", vertexShaderSource.length, "bytes and", fragmentShaderSource.length, "bytes");
    program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    //gl.program = program;
    vPosition = gl.getAttribLocation(program, "a_Position");
    gl.enableVertexAttribArray(vPosition);
    vColor = gl.getAttribLocation(program, "a_Color");
    gl.enableVertexAttribArray(vColor);
    vNormal = gl.getAttribLocation(program, "a_Normal");
    gl.enableVertexAttribArray(vNormal);

    //set up buffers
    vertexBuffer = gl.createBuffer();
    indexBuffer = gl.createBuffer(); 
    colorBuffer = gl.createBuffer();   
    normalBuffer = gl.createBuffer();

    //define ambient light color (fragment shader expects this uniform)
    var aLoc = gl.getUniformLocation(program, "u_Ambient_color");
    if (aLoc) gl.uniform3f(aLoc, ambientColor[0], ambientColor[1], ambientColor[2]);

    //get transformation matrix location
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    //get point size location
    pointSizeLoc = gl.getUniformLocation(program, "u_PointSize");

    //holding down the mouse attracts the points
    canvas.addEventListener('mousedown', function(event) {
        mouseDown = true;
        var rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    canvas.addEventListener('mousemove', function(event) {
        if (!mouseDown) return;
        var rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    window.addEventListener('mouseup', function() {
        mouseDown = false;
    });
    canvas.addEventListener('mouseleave', function() {
        mouseDown = false;
    });

    //run the program
    shape = "square";
    p = new PartySystem(canvas, 1000, 8);
    render();

}

function render() {
    //clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //set the camera
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    //draw
    p.doOneStep();

    //re-render
    requestAnimationFrame(render);
}

function updateShape(newShape) {
    if (shape === newShape) return;

    //update the shape to be points based on what string was given
    if (shape === "square") {
        shape = [vec3(-0.5, -0.5, 0.0), vec3(0.5, -0.5, 0.0), vec3(0.5, 0.5, 0.0), vec3(-0.5, 0.5, 0.0)];
    }
    //we will do more shapes later
}

//
function PartySystem(canvasElement, numParticles, sizeInPixels) {
    this.w = canvasElement.width;
    this.h = canvasElement.height;
    gl.disable(gl.DEPTH_TEST);
    //this.worldsize = new Float32Array([w, h]);

    //initialize particles array
    this.particles = [];
    for (var i = 0; i < numParticles; i++) {
        this.particles.push({x: Math.random() * this.w, y: Math.random() * this.h, velx: 0, vely: 0});
    }

    //initialize particle variables
    this.spawnSide = "top";
    this.size = sizeInPixels || 5;
    this.color = [0.14, 0.62, 1, 0.6];

    //initialize movement variables
    if (particleMovementType === "water") { //for water, decrease avoidFactor to make calmer
        this.gravity = [0.0, 0.2];
        this.wind = [0.0, 0.0];
        this.turningFactor = 3;
        this.visualRange = 40;
        this.protectedRange = 8;
        this.centeringFactor = 0.000;
        this.avoidFactor = 0.01;
        this.matchingFactor = 0.05;
        this.maxSpeed = 8;
        this.margin = 10;
        this.mouseAttractionFactor = 0.0005;
    } else { // boid
        this.gravity = [0.0, 0.0];
        this.wind = [0.0, 0.0];
        this.turningFactor = 0.4;       // default is 0.4
        this.visualRange = 40;          // default is 40
        this.protectedRange = 8;        // default is 8
        this.centeringFactor = 0.0005;  // default is 0.0005
        this.avoidFactor = 0.05;        // default is 0.05
        this.matchingFactor = 0.05;     // default is 0.05
        this.maxSpeed = 6;              // default is 6
        this.margin = 80;               // default is 80
        this.mouseAttractionFactor = 0.0005; // Strength of mouse attraction
    }

}

PartySystem.prototype.doOneStep = function() {
    //testing
    console.log("Doing one particle step");

    //draw
    var positions = [];
    var colors = [];
    var normals = [];
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        // Normalize pixel coordinates to [-1, 1] range for WebGL
        var normX = (p.x / gl.canvas.width) * 2.0 - 1.0;
        var normY = (p.y / gl.canvas.height) * 2.0 - 1.0;
        // Flip Y axis (WebGL has origin at bottom-left, canvas has origin at top-left)
        normY = -normY;
        positions.push(normX, normY);
        colors.push(...this.color);
        normals.push(0.0, 0.0, 1.0); // Default normal pointing forward
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);

    gl.uniform1f(pointSizeLoc, this.size);
    gl.drawArrays(gl.POINTS, 0, positions.length / 2);

    //re-calculate positions
    this.updatePositions_boid();
}

PartySystem.prototype.updatePositions_basic = function() {
    for (var i = 0; i < this.particles.length; i++) {
        var particle = this.particles[i];
        particle.x += particle.velx + this.wind[0];
        particle.y += particle.vely + this.wind[1];
        particle.velx += this.gravity[0];
        particle.vely += this.gravity[1];
    }
}

PartySystem.prototype.updatePositions_boid = function() {
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        var close_dx = 0;
        var close_dy = 0;
        var xvel_avg = 0;
        var yvel_avg = 0;
        var xpos_avg = 0;
        var ypos_avg = 0;
        var neighboringBoids = 0;

        for (var j = 0; j < this.particles.length; j++) {
            var otherP = this.particles[j];
            //check if boids are in protected zone
            if (Math.abs(p.x - otherP.x) < this.protectedRange && Math.abs(p.y - otherP.y) < this.protectedRange) {
                close_dx += p.x - otherP.x;
                close_dy += p.y - otherP.y;
            }
            //check velocity and average center of mass of other boids in visible range
            if (Math.abs(p.x - otherP.x) < this.visualRange && Math.abs(p.y - otherP.y) < this.visualRange) {
                xvel_avg += otherP.velx;
                yvel_avg += otherP.vely;
                xpos_avg += otherP.x;
                ypos_avg += otherP.y;
                neighboringBoids++;
            }
        }

        if (neighboringBoids > 0) {
            xvel_avg = xvel_avg / neighboringBoids;
            yvel_avg = yvel_avg / neighboringBoids;
            xpos_avg = xpos_avg / neighboringBoids;
            ypos_avg = ypos_avg / neighboringBoids;
        }

        // Update velocity based on boid rules
        p.velx += close_dx * this.avoidFactor + (xvel_avg - p.velx) * this.matchingFactor + (xpos_avg - p.x) * this.centeringFactor;
        p.vely += close_dy * this.avoidFactor + (yvel_avg - p.vely) * this.matchingFactor + (ypos_avg - p.y) * this.centeringFactor;

        // add attraction to mouse to the velocity
        if (mouseDown) {
            p.velx += (mouse.x - p.x) * this.mouseAttractionFactor;
            p.vely += (mouse.y - p.y) * this.mouseAttractionFactor;
        }

        //add gravity
        p.velx += this.gravity[0];
        p.vely += this.gravity[1];

        // Apply boundary turning (push particles away from edges)
        // Make the force stronger the closer to the edge
        if (p.x < this.margin) p.velx += this.turningFactor * (1 - p.x / this.margin);
        if (p.x > this.w - this.margin) p.velx -= this.turningFactor * ((p.x - (this.w - this.margin)) / this.margin);
        if (p.y < this.margin) p.vely += this.turningFactor * (1 - p.y / this.margin);
        if (p.y > this.h - this.margin) p.vely -= this.turningFactor * ((p.y - (this.h - this.margin)) / this.margin);

        // Limit maximum speed
        var speed = Math.sqrt(p.velx * p.velx + p.vely * p.vely);
        if (speed > this.maxSpeed) {
            p.velx = (p.velx / speed) * this.maxSpeed;
            p.vely = (p.vely / speed) * this.maxSpeed;
        }

        // Update position
        p.x += p.velx;
        p.y += p.vely;
    }
}

PartySystem.prototype.setGravity = function(newGravity) {
    this.gravity = newGravity;
}
PartySystem.prototype.setWind = function(newWind) {
    this.wind = newWind;
}
PartySystem.prototype.setAttraction = function(newAttraction) {
    this.attraction = newAttraction;
}

// Make the canvas match its displayed size (handles responsive CSS + device pixel ratio)
function resizeCanvasToDisplaySize(can) {
    var dpr = window.devicePixelRatio || 1;
    var displayWidth = Math.max(1, Math.floor(can.clientWidth * dpr));
    var displayHeight = Math.max(1, Math.floor(can.clientHeight * dpr));
    if (can.width !== displayWidth || can.height !== displayHeight) {
        can.width = displayWidth;
        can.height = displayHeight;
        return true;
    }
    return false;
}