//Rutledge Dixon
//Particle System (Boid's Algorithm)
//Takes a shape, and moves particles into that shape

var gl;
var program;
var vPosition;
var vColor;
var vNormal;
var vSize;
var vertexBuffer;
var indexBuffer; 
var colorBuffer;
var normalBuffer;
var sizeBuffer;

var ambientColor = [0.2, 0.2, 0.2];

var shape = {
    name: "circle",
    scale: 150,
    color: [0.84, 1, 0.93, 0.8],
    center: {
        x: 0.0,
        y: 0.0
    }
};
shape.equation = function(x, y) { //equation for circle
        // Translate to center and scale
        var px = (x - shape.center.x) / shape.scale;
        var py = -(y - shape.center.y) / shape.scale;
        // Distance from center minus 1 (so equation = 0 at circle edge)
        return Math.sqrt(Math.pow(px, 2) + Math.pow(py, 2)) - 1;
};
// Gradient (used for direction toward curve) - with larger delta for better accuracy
shape.gradient = function(x, y) {
    var h = 1.0; // Larger delta for better gradient estimation
    var dfdx = (shape.equation(x + h, y) - shape.equation(x - h, y)) / (2 * h);
    var dfdy = (shape.equation(x, y + h) - shape.equation(x, y - h)) / (2 * h);
    return { x: dfdx, y: dfdy };
}

var p;
var mouse = { x: 0, y: 0 };
var mouseDown = false;
var particleMovementType = "boid"; // default movement type

var typeMemory = "";

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
    
    var movementSelect = document.getElementById("movement-select");
    var shapeSelect = document.getElementById("shape-select");
    movementSelect.value = particleMovementType;
    shapeSelect.value = shape.name;

    gl = getWebGLContext(canvas);
    if (!gl) { alert("WebGL isn't available"); return; }

    //  Configure WebGL
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    // keep aspect ratio in sync with canvas display size
    aspect = (canvas.clientWidth / canvas.clientHeight) || 1.0;
    //update shape center to be center of canvas
    shape.center = {x: canvas.width / 2, y: canvas.height / 2};

    // update on window resize
    window.addEventListener('resize', function() {
        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, canvas.width, canvas.height);
        aspect = (canvas.clientWidth / canvas.clientHeight) || 1.0;
    });
    gl.clearColor(0.1, 0.1, 0.1, 1.0);

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

    vPosition = gl.getAttribLocation(program, "a_Position");
    gl.enableVertexAttribArray(vPosition);
    vColor = gl.getAttribLocation(program, "a_Color");
    gl.enableVertexAttribArray(vColor);
    // vNormal = gl.getAttribLocation(program, "a_Normal");
    // gl.enableVertexAttribArray(vNormal);
    vSize = gl.getAttribLocation(program, "a_Size");
    gl.enableVertexAttribArray(vSize);

    //set up buffers
    vertexBuffer = gl.createBuffer();
    indexBuffer = gl.createBuffer(); 
    colorBuffer = gl.createBuffer();   
    //normalBuffer = gl.createBuffer();
    sizeBuffer = gl.createBuffer();

    //define ambient light color (fragment shader expects this uniform)
    var aLoc = gl.getUniformLocation(program, "u_Ambient_color");
    if (aLoc) gl.uniform3f(aLoc, ambientColor[0], ambientColor[1], ambientColor[2]);

    //get transformation matrix location
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

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
    window.addEventListener('keydown', function(event) {
        // Store the key in typeMemory
        typeMemory += event.key;
        // If the user types "ruru", add a special typewriter card
        if (typeMemory.endsWith("ruru")) {
            updateShape("heart");
            updateMovementType("shape");
            if (window.addTypewriterCard) {
                window.addTypewriterCard("Eph 2:10", 
                    `For we are His workmanship, created in Christ Jesus for good works, 
which God prepared beforehand that we should walk in them.`
                );
                window.addTypewriterCard("To the Love of my Life",
                    `Ruthie, I love you SO MUCH!!! You are my sunflower, my world, my love,
and soon my wife. July 14!!! You are God's Masterpiece, and the biggest blessing to everyone around you,
especially me. I love you more than anything tootsie <3`
                );
            }
        }
    });

    //run the program
    updateShape("circle");
    p = new PartySystem(canvas, 1000);
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
    p.doOneStep(shape, particleMovementType);

    //re-render
    requestAnimationFrame(render);
}

function updateShape(newShape) {
    if (shape.name === newShape) return;
    
    //update the shape to be points based on what string was given
    shape.name = newShape;
    shape.center = {
        x: gl.canvas.width / 2,
        y: gl.canvas.height / 2
    };
    
    if (shape.name === "square") {
        shape.color = [1, 1, 1, 0.4];
        shape.scale = 180;
        shape.equation = function(x, y) {
            // Translate to center and scale
            var px = (x - shape.center.x) / shape.scale;
            var py = -(y - shape.center.y) / shape.scale;
            return Math.max(Math.abs(px), Math.abs(py)) - 1;
        };
    } else if (shape.name === "circle") {
        shape.color = [0.84, 1, 0.93, 0.7];
        shape.scale = 150; // Initial radius - can be changed dynamically
        shape.equation = function(x, y) {
            // Translate to center and scale
            var px = (x - shape.center.x) / shape.scale;
            var py = -(y - shape.center.y) / shape.scale;
            // Distance from center minus 1 (so equation = 0 at circle edge)
            return Math.sqrt(Math.pow(px, 2) + Math.pow(py, 2)) - 1;
        }
    } else if (shape.name === "heart") {
        shape.color = [1.0, 0.78, 0.92, 0.65];
        // Heart curve: (x^2 + y^2 - 1)^3 - x^2*y^3 = 0
        // Scale factor to fit on canvas
        shape.scale = 120;
        shape.equation = function(x, y) {
            // Translate to center and scale
            var px = (x - shape.center.x) / shape.scale;
            var py = -(y - shape.center.y) / shape.scale;
            // Heart curve equation
            return Math.pow(px * px + py * py - 1, 3) - px * px * py * py * py;
        };
    } else if (shape.name === "squircle") {
        shape.color = [0.6, 1, 1, 0.5];
        shape.scale = 180;
        shape.equation = function(x, y) {
            // Translate to center and scale
            var px = (x - shape.center.x) / shape.scale;
            var py = -(y - shape.center.y) / shape.scale;
            return Math.pow(Math.abs(px), 3) + Math.pow(Math.abs(py), 3) - 1;
        }
    }
    //testing
    console.log("Shape: " + shape.name);
    //we will do more shapes later

    // Update particle colors when shape changes
    if (p && p.updateParticleColors) {
        p.updateParticleColors(shape.color);
    }
}

function updatePixelSize(newSize) {
    var sizeInt = parseInt(newSize);
    if (isNaN(sizeInt) || sizeInt < 2 || sizeInt > 100) {
        console.warn("Invalid size input:", newSize);
        return;
    }
    p.setSize(sizeInt);
}

function updateMovementType(newType) {
    particleMovementType = newType;
    //p = new PartySystem(canvas, 1000, 5, particleMovementType);
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
