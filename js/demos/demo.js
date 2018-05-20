/*
 This class was made to demonstrate the abilities of the Base Code
 */
function Demo() {


    // This is the constant (rainbow) particle system
    this.demoParticleSystem1 = new ParticleSystem({
        emitter : new Vec3(225, 300, 0),
        emitterSize : { x : 40.0, y : 10.0, z : 0.0 },
        v : { x : { min : -50.0, max : 50.0 }, y : { min : -250.0, max : -200.0 }, z : { min : 0.0, max : 0.0 }},
        a : { x : { min : -10.0, max : 10.0 }, y : { min : 0.0, max : 0.0 }, z : { min : 0.0, max : 0.0 }},
        friction : { x : 0.0, y : 100.0, z : 0.0 },
        life : { min : 1.0, max : 2.0 },
        init : function(particle) {
            particle.color = Color.fromHSL(Utils.randFloat(0.0, 1.0), 1.0, 0.5);
        },
        draw : function(particle) {
            var opacity = Utils.limit(particle.life / 2.0, 0.0, 1.0);
            c.fillStyle = "rgba(" + particle.color.r + ", " + particle.color.g + ", " + particle.color.b + ", " + opacity + ")";
            c.fillRect(particle.pos.x - 20, particle.pos.y - 20, 40, 40);
        }
    });

    // This is the (green) burst particle system
    this.demoParticleSystem2 = new ParticleSystem({
        mode : ParticleSystem.BURST_MODE,
        v : { x : { min : -240.0, max : 240.0 }, y : { min : -240.0, max : 240.0 }, z : { min : 0.0, max : 0.0 }},
        a : { x : { min : -6.0, max : 6.0 }, y : { min : -6.0, max : 6.0 }, z : { min : 0.0, max : 0.0 }},
        life : { min : 0.5, max : 0.7 },
        particlesPerTick : 50,
        draw : function(particle) {
            var opacity = Utils.limit(particle.life / 0.7, 0.0, 1.0);
            c.fillStyle = "rgba(0, 127, 0, " + opacity + ")";
            c.fillRect(particle.pos.x - 10, particle.pos.y - 10, 20, 20);
        }
    });

    // Reads data from an image and saves it a two-dimensional array
    this.demoMatrixFromImage = ImageProcessing.readMatrix("demoData", 10, 10, "empty", {
        "#000000" : "full"
    });

    // Allows for screen shaking
    this.demoShaking = new Shaking();

    // Rotation and position of rotating and draggable image (black square with cross)
    this.demoImageRotation = 0;
    this.demoImagePos = new Vec2(450, 300);

    // Vertical line with interpolated positions
    this.demoInterpolationPos = 0;
    this.demoInterpolationVelocity = 0.0;
    this.demoInterpolationTarget = 0;

    // Text based on web font
    this.demoText = new Text({
        size : 40,
        font : "komika",
        align : "right",
        color : "#fff",
        borderWidth : 5,
        borderColor : "#000",
        maxWidth : 250,
        lineHeight : 50,
        verticalAlign : "bottom",
        letterSpacing : 3,
        appearCharPerSec : 10,
        monospaced : 25
    });

    // Text based on pixel font
    this.demoPixelText = new PixelText();
    this.demoPixelText.setAlignment(Text.CENTER);
    this.demoPixelText.text("Hello World!");

    // Moving arrow-key-controllable pawn
    this.demoPawn = new Acceleratable(
        Acceleratable.DIM_MODE_2D,
        new Vec2(700, 300),
        new Vec2(200.0, 200.0),
        new Vec2(400.0, 400.0),
        new Vec2(100.0, 100.0),
        Acceleratable.ANGLE_MODE_8WAY
    );

    // Setup scale full integer, load images
    this.demoIntegerScaling = new IntegerScaling(2, 5, 360, 202);
    this.demoIntegerScaling.addScalableImage("demoData");
    this.demoIntegerScaling.setPivotPoints(new Vec2(0, Game.height), new Vec2(-8, 8));

    // Setup polygon and offset it
    this.demoPolygon = [[13, 45], [45, 89], [56, 200], [190, 30], [121, 17]];
    this.demoPolygon.push(this.demoPolygon[0]);
    this.demoPolygonOffset1 = (new Offset()).data(this.demoPolygon).offset(-5)[0];
    this.demoPolygonOffset2 = (new Offset()).data(this.demoPolygon).arcSegments(10).offset(50)[0];

}


/*
 This is called when we enter the in-game state
 */
Demo.prototype.show = function() {

    // Register mouse click event so that when you click, you trigger a birst of the second particle system,
    // trigger the screen shake, play the cannon sound and set the new position of the interpolating line.
    Mouse.left.registerUpCallback("demoFire", function() {
        if(!Game.paused) {
            demo.demoParticleSystem2.setEmitter(Mouse.pos);
            demo.demoParticleSystem2.burst();
            demo.demoShaking.shake(6, 18, 2);
            Sound.play("cannon");
            demo.demoInterpolationTarget = Mouse.pos.x;
        }
    });

    // Make the rotating image (black square with cross) draggable
    Mouse.left.registerDraggableArea("demoDragAndDrop", 420, 270, 60, 60, function() {
        console.log("started dragging.");
    }, function() {
        demo.demoImagePos = demo.demoImagePos.add(Mouse.left.dragDelta);
    }, function() {
        console.log("end dragging.");
    });

    // When you press 'C' you trigger a Countdown
    Keyboard.registerKeyUpHandler(Keyboard.C, function() {
        Timer.doForCountdown(3.0, function(progress) {
            demo.demoPixelText.text("Progress: " + progress.toFixed(2));
        }, function() {
            demo.demoPixelText.text("Hello World!");
        });
    });



    this.demoSound = Sound.play("soundtrack");
};


/*
 This is called when we leave the in-game state
 */
Demo.prototype.hide = function() {

    // Remove the mouse event listener
    Mouse.left.deleteUpCallback("demoFire");

    // Remove draggable area listener
    Mouse.left.deleteDraggableArea("demoDragAndDrop");

    // Remove key stroke listener for 'C' key
    Keyboard.deleteKeyUpHandler(Keyboard.C);
};


/*
 This is called when the window is rescaled
 */
Demo.prototype.resize = function() {

    // Update integer are scaling
    this.demoIntegerScaling.resize();
};


/*
 This is called at each iteration of the game loop
 */
Demo.prototype.update = function() {

    // reset tooltip content
    Tooltip.reset();

    var oldRotation = this.demoImageRotation;

    // Rotate rotating image (black square with cross)
    this.demoImageRotation += 2.0 * Timer.delta;

    // Update all timed callbacks
    Timer.updateCallbacks();

    // Update interpolating vertical line
    var interpolate = Interpolate.accelerateToPos(
        this.demoInterpolationPos,
        this.demoInterpolationTarget,
        this.demoInterpolationVelocity,
        2000.0,
        5000.0
    );
    this.demoInterpolationPos = interpolate.pos;
    this.demoInterpolationVelocity = interpolate.velocity;

    // Get arrow key inputs and apply it to arrow-key-controlled pawn
    var arrowKeys = Utils.getArrowControls();
    this.demoPawn.update(arrowKeys);

    if(oldRotation < 3.0 && this.demoImageRotation >= 3.0) {
        this.demoSound.fadeOut(2.0);
    }

    if(oldRotation < 8.0 && this.demoImageRotation >= 8.0) {
        this.demoSound.fadeIn(2.0);
    }

    if(oldRotation < 15.0 && this.demoImageRotation >= 15.0) {
        this.demoSound.fadeTo(1.0, 100);
    }

    if(oldRotation < 90.0 && this.demoImageRotation >= 90.0) {
        this.demoSound.stop();
    }
};


/*
 This is called at each iteration of the game loop after update
 */
Demo.prototype.draw = function() {

    // Draw the matrix we loaded from an image
    for(var x = 0; x < 10; x++) {
        for(var y = 0; y < 10; y++) {
            if(this.demoMatrixFromImage[x][y] === "full") {
                c.fillStyle = "#ddd";
                c.fillRect(x * 20, y * 20, 20, 20);
                if(Mouse.isOver(x * 20, y * 20, 20, 20)) {
                    Tooltip.set("You are now over matrix field: " + x + "/" + y);
                }
            }
        }
    }

    // Draw vertical interpolating bar
    c.fillStyle = "#999";
    c.fillRect(this.demoInterpolationPos, 0, 1, Game.height);

    // Draw pixel text ("Hello World");
    this.demoPixelText.pos(Game.centerX, 20);
    this.demoPixelText.draw();

    // Apply screen shake
    this.demoShaking.apply();

    // Draw rotating image (black square with cross)
    Img.drawRotated("test", this.demoImagePos.x, this.demoImagePos.y, 38, 38, this.demoImageRotation);

    // Draw both particle systems
    // PerformanceMonitor.startStopwatch(3);
    this.demoParticleSystem1.draw();
    // PerformanceMonitor.stopStopwatch(3);
    // PerformanceMonitor.startStopwatch(4);
    this.demoParticleSystem2.draw();
    // PerformanceMonitor.stopStopwatch(4);

    // Draw texture we generated in custom_preloading.js
    Img.draw("demoGeneratedTexture", 740, 440);

    // Draw arrow-key-controlled pawn
    c.save();
    c.translate(this.demoPawn.pos.x, this.demoPawn.pos.y);
    c.rotate(this.demoPawn.angle * QUART_PI);

    // Check if mouse is hovering over pawn
    if(Mouse.isOverCircle(this.demoPawn.pos.x, this.demoPawn.pos.y, 12)) {
        c.fillStyle = "#f00";
    } else {
        c.fillStyle = "#c00";
    }

    Utils.drawCircle(c, 0, 0, 12);
    c.fill();

    c.fillStyle = "#fff";
    c.beginPath();
    c.moveTo(0, 10);
    c.lineTo(-5, -5);
    c.lineTo(5, -5);
    c.closePath();
    c.fill();

    c.restore();

    // Draw pixelated scaled image
    this.demoIntegerScaling.apply();
    this.demoIntegerScaling.draw("demoData", -5, -5);
    this.demoIntegerScaling.restore();

    // Draw integer scaled mask
    this.demoIntegerScaling.drawMask(-7, -193, 358, 200, "rgba(255, 0, 0, 0.1)");

    // Draw regular and offset polygons;
    c.save();
    c.translate(750, 100);
    c.strokeStyle = "#f00";
    c.beginPath();
    c.moveTo(this.demoPolygon[0][0], this.demoPolygon[0][1]);
    for(var i = 0; i < this.demoPolygon.length; i++) {
        c.lineTo(this.demoPolygon[i][0], this.demoPolygon[i][1]);
    }
    c.closePath();
    c.stroke();
    c.strokeStyle = "#0c0";
    c.beginPath();
    c.moveTo(this.demoPolygonOffset1[0][0], this.demoPolygonOffset1[0][1]);
    for(var i = 0; i < this.demoPolygonOffset1.length; i++) {
        c.lineTo(this.demoPolygonOffset1[i][0], this.demoPolygonOffset1[i][1]);
    }
    c.closePath();
    c.stroke();
    c.strokeStyle = "#00f";
    c.beginPath();
    c.moveTo(this.demoPolygonOffset2[0][0], this.demoPolygonOffset2[0][1]);
    for(var i = 0; i < this.demoPolygonOffset2.length; i++) {
        c.lineTo(this.demoPolygonOffset2[i][0], this.demoPolygonOffset2[i][1]);
    }
    c.closePath();
    c.stroke();
    c.restore();

    // Remove screen shake
    this.demoShaking.remove();

    // Draw web-font-based text (logo in bottom right)
    this.demoText.drawPosText(Game.width - 20, Game.height - 20, "ZYXer's Base Code");

};


/*
 This is called if the game is paused in the in-game state
 */
Demo.prototype.drawPausedScreen = function() {
    c.fillStyle = "rgba(0, 0, 0, 0.8)";
    c.fillRect(0, 0, Game.width, Game.height);

    Text.draw(Game.centerX, 100, 16, "komika", "center", "#fff", "Paused - Press P to unpause");
};