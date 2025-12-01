// Computer Graphics Final Project
// Sorting Algorithm Visualization in 3D using WebGL
// Fall 25
// Brandon Bryant and Rutledge Dixon

var gl;
var program;
var vPosition;
var vColor;
var vNormal;
var vertexBuffer;
var indexBuffer; 
var colorBuffer;
var normalBuffer;

var ambientColor = [0.2, 0.2, 0.2];

var currentAlgorithm = 'bubble';
// generator/stepper for the currently-active sorting algorithm. This keeps state
// encapsulated so we don't need multiple global counters while allowing one
// swap per step.
var sortStepper = null;

var isSorting = false;
var count = 10;
var gap = 0.05;
var objYs = []; // array of just the y values for sorting
var spacing, totalWidth, startingX; //helper values for positioning
var rectProperties = { x: 0.0, z: 0.0, maxHeight: 0.5 } // the x and z properties of all rectangles

var waitTime = 50; //Amount of time in milliseconds between each swap

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

//sleep function
async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

function changeSpeed(value) {
    switch(value) {
        case 'slow': waitTime = 200; break;
        case 'fast': waitTime = 0; break;
        default: waitTime = 50;
    }
}

function main() {
    //load the canvas and context
    var canvas = document.getElementById("webgl");
    var header = document.getElementById("header");

    gl = getWebGLContext(canvas);
    if (!gl) { alert("WebGL isn't available"); }

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

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    if (!program) { return; }
    gl.useProgram(program);
    gl.program = program;
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

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    //initialize positioining variables
    changeCount(count);
    //start the render loop
    runProgram();
}

//does the next swap in the current algorithm
async function doOneSwap() {
    if (!sortStepper) {
        switch (currentAlgorithm) {
            case 'bubble': sortStepper = bubbleStepper(objYs); break;
            case 'selection': sortStepper = selectionStepper(objYs); break;
            case 'insertion': sortStepper = insertionStepper(objYs); break;
            case 'merge': sortStepper = mergeStepper(objYs); break;
            case 'quick': sortStepper = quickStepper(objYs); break;
            case 'heap': sortStepper = heapStepper(objYs); break;
            case 'shell': sortStepper = shellStepper(objYs); break;
            case 'bogo': sortStepper = bogoStepper(objYs); break;
        }
    }

    const s = sortStepper.next();
    if (s.done) {
        // finished sorting — clear state and stop
        sortStepper = null;
        toggleSorting();
    }
}

function changeAlgorithm(value) {
    currentAlgorithm = value;
}

async function runProgram() {
    //clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //set the camera
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    //loop through obj array and draw rectangles
    var offset = startingX
    for (var i = 0; i < objYs.length; i++) {
        var obj = {
            x: rectProperties.x,
            y: objYs[i],
            z: rectProperties.z,
        }
        drawRect(obj, offset);
        offset += spacing; 
    }

    // if sorting, do one step
    if (isSorting) {
        await sleep(waitTime);  //wait
        doOneSwap();
    }

    requestAnimationFrame(runProgram);
}

//takes an obj with x, y, z, id properties, and an extra x value, and draws a 3D rectangle
//can be called multiple times in a row and webgl will still draw multiple rectangles
function drawRect(obj, startingX) {
    //define rectangle vertices based on obj properties
    var rectVertices = [
        startingX, 0, 0,
        startingX + obj.x, 0, 0,
        startingX + obj.x, 0, obj.z,
        startingX, 0, obj.z,
        startingX, obj.y, 0,
        startingX + obj.x, obj.y, 0,
        startingX + obj.x, obj.y, obj.z,
        startingX, obj.y, obj.z
    ];
    var rectIndices = [
        0, 1, 2,   0, 2, 3, // front face
        4, 5, 6,   4, 6, 7, // back face
        0, 1, 5,   0, 5, 4, // bottom face
        2, 3, 7,   2, 7, 6, // top face
        0, 3, 7,   0, 7, 4, // left face
        1, 2, 6,   1, 6, 5  // right face
    ];
    var rectColors = [
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 0.7, 1.0,
        0.0, 0.0, 0.7, 1.0,
        0.0, 0.7, 0.0, 1.0,
        0.0, 0.7, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ];
    var rectNormals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    ];  
    //bind and set buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectVertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectColors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectNormals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rectIndices), gl.STATIC_DRAW);

    //draw the rectangle
    gl.drawElements(gl.TRIANGLES, rectIndices.length, gl.UNSIGNED_SHORT, 0);
}

function toggleSorting() {
    isSorting = !isSorting;
    var startButton = document.getElementById("start-button");
    startButton.textContent = isSorting ? "Pause" : "Start";
    console.log("Sorting " + (isSorting ? "started" : "paused"));
}

function randomizeArray() {
    objYs.sort(() => Math.random() - 0.5);
    // reset any in-progress stepper so future steps don't use stale state
    sortStepper = null;
    console.log("Object array randomized");
}

function changeCount(newCount) {
    count = newCount;
    objYs = [];
    for (var i = 1; i <= count; i++) {
        objYs.push(rectProperties.maxHeight * i / count);
    }
    // shrink the gap as count grows so gap stays roughly proportional to x
    var gapScale = Math.min(1, 20 / count); // full gap up to 20, then shrink
    gap = 0.05 * gapScale;

    // compute candidate x from remaining width and clamp it to a minimum
    var rawX = (2 - (count - 1) * gap) / count;
    rectProperties.x = Math.max(0.03, rawX);
    rectProperties.z = rectProperties.x;
    spacing = rectProperties.x + gap;
    //update starting x offset to center the rectangles
    totalWidth = (count * rectProperties.x) + ((count - 1) * gap);
    startingX = -totalWidth / 2;
    // reset stepper when the array contents/length change
    sortStepper = null;
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