console.log("PartySystem.js loading...");

function PartySystem(canvasElement, numParticles, sizeInPixels, particleMovementType) {
    this.w = canvasElement.width;
    this.h = canvasElement.height;
    gl.disable(gl.DEPTH_TEST);
    
    //initialize particle variables
    this.spawnSide = "top";
    this.size = sizeInPixels || 5;
    this.color = [0.34, 0.82, 1, 0.5];
    this.ttl = 500;

    //initialize particles array
    this.particles = [];
    for (var i = 0; i < numParticles; i++) {
        this.particles.push({
            x: Math.random() * this.w, 
            y: Math.random() * this.h, 
            velx: 0, 
            vely: 0, 
            ttl: Math.random() * this.ttl + 200
        });
    }

    // default movement vairables
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
    this.shapeAttractionFactor = 0;
    this.damping = 1.0;
}

PartySystem.prototype.doOneStep = function(shape, particleMovementType) {
    //testing
    console.log("Doing one particle step");

    //initialize movement variables based on particleMovementType
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
        this.shapeAttractionFactor = 0;
        this.damping = 1.0;
    } else if (particleMovementType === "shape") {
        this.gravity = [0.0, 0.0];
        this.wind = [0.0, 0.0];
        this.turningFactor = 0.4;       // default is 0.4
        this.visualRange = 40;          // default is 40
        this.protectedRange = 8;        // default is 8
        this.centeringFactor = 0;  // default is 0.0005
        this.avoidFactor = 0.02;        // default is 0.05
        this.matchingFactor = 0.05;     // default is 0.05
        this.maxSpeed = 1.5;              // default is 6
        this.margin = 80;               // default is 80
        this.mouseAttractionFactor = 0.005; // Strength of mouse attraction
        this.shapeAttractionFactor = 1;
        this.damping = 0.5;
    } else {    //default is boid
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
        this.shapeAttractionFactor = 0;
        this.damping = 1.0;
    }
    //draw
    var positions = [];
    var colors = [];
    //var normals = [];
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        if (particleMovementType === "shape" || particleMovementType === "water") {
            p.ttl--;
            if (p.ttl <= 0) {
                //'remove' and 'replace' by randomizing particle attributes
                this.particles[i] = {
                    x: Math.random() * this.w, 
                    y: Math.random() * this.h, 
                    velx: 0, 
                    vely: 0, 
                    ttl: Math.random() * this.ttl + 200
                };
                p = this.particles[i];
            }
        }
        // Normalize pixel coordinates to [-1, 1] range for WebGL
        var normX = (p.x / gl.canvas.width) * 2.0 - 1.0;
        var normY = (p.y / gl.canvas.height) * 2.0 - 1.0;
        // Flip Y axis (WebGL has origin at bottom-left, canvas has origin at top-left)
        normY = -normY;
        positions.push(normX, normY);
        colors.push(...this.color);
        //normals.push(0.0, 0.0, 1.0); // Default normal pointing forward
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

    // gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
    // gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);

    gl.uniform1f(pointSizeLoc, this.size);
    gl.drawArrays(gl.POINTS, 0, positions.length / 2);

    //re-calculate positions
    this.updatePositions_boid(shape);
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

PartySystem.prototype.updatePositions_boid = function(shape) {
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

        // Update velocity based on basic boid rules
        p.velx += close_dx * this.avoidFactor + (xvel_avg - p.velx) * this.matchingFactor + (xpos_avg - p.x) * this.centeringFactor;
        p.vely += close_dy * this.avoidFactor + (yvel_avg - p.vely) * this.matchingFactor + (ypos_avg - p.y) * this.centeringFactor;

        // add attraction to mouse to the velocity
        if (mouseDown) {
            p.velx += (mouse.x - p.x) * this.mouseAttractionFactor;
            p.vely += (mouse.y - p.y) * this.mouseAttractionFactor;
        }

        //compute attraction to shape based on gradient
        if (shape.equation) {
            var f = shape.equation(p.x, p.y);
            var grad = shape.gradient(p.x, p.y);
            var gradMag = Math.sqrt(grad.x * grad.x + grad.y * grad.y);

            if (gradMag > 0.001) {
                // Normalize gradient (set magnitude to 1)
                var normGx = grad.x / gradMag;
                var normGy = grad.y / gradMag;

                //gradient points away from the curve when f > 0, towards when f < 0
                var direction = f > 0 ? -1 : 1;

                p.velx += normGx * direction * this.shapeAttractionFactor;
                p.vely += normGy * direction * this.shapeAttractionFactor;
            }
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

console.log("PartySystem.js loaded successfully");