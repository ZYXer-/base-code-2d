/*
 This class was made to demonstrate the abilities of the Base Code
 */
function Demo() {


    // This is the constant (blue) particle system
    this.demoParticleSystem1 = new ParticleSystem(1, {
        emitter : new Vec3(225, 300, 0),
        emitterSize : { x : 40.0, y : 10.0, z : 0.0 },
        v : { x : { min : -50.0, max : 50.0 }, y : { min : -250.0, max : -200.0 }, z : { min : 0.0, max : 0.0 }},
        a : { x : { min : -10.0, max : 10.0 }, y : { min : 0.0, max : 0.0 }, z : { min : 0.0, max : 0.0 }},
        friction : { x : 0.0, y : 100.0, z : 0.0 },
        life : { min : 1.0, max : 2.0 }
    });

    // This is the (green) burst particle system
    this.demoParticleSystem2 = new ParticleSystem(2, {
        mode : ParticleSystem.BURST_MODE,
        v : { x : { min : -240.0, max : 240.0 }, y : { min : -240.0, max : 240.0 }, z : { min : 0.0, max : 0.0 }},
        a : { x : { min : -6.0, max : 6.0 }, y : { min : -6.0, max : 6.0 }, z : { min : 0.0, max : 0.0 }},
        life : { min : 0.5, max : 0.7 },
        particlesPerTick : 50
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
        appearCharPerSec : 10
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
    this.demoParticleSystem1.draw();
    this.demoParticleSystem2.draw();

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