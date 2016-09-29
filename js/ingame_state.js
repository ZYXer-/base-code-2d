function IngameState() {

    // just for demonstration purposes:

    this.demoText = null;

    this.demoParticleSystem1 = null;
    this.demoParticleSystem2 = null;

    this.demoMatrixFromImage = null;

    this.demoShaking = null;

    this.demoImageRotation = 0;
    this.demoImageX = 450;
    this.demoImageY = 300;

    this.demoInterpolationPos = 0;
    this.demoInterpolationVelocity = 0.0;
    this.demoInterpolationTarget = 0;


    this.init = function() {

        // setup stuff here, examples:

        this.demoParticleSystem1 = new ParticleSystem();
        this.demoParticleSystem1.setType(1);
        this.demoParticleSystem1.setEmitter(225, 300, 0);
        this.demoParticleSystem1.setEmitterSize(40.0, 10.0, 0.0);
        this.demoParticleSystem1.setV(-50.0, 50.0, -250.0, -200.0, 0.0, 0.0);
        this.demoParticleSystem1.setA(-10.0, 10.0, 0.0, 0.0, 0.0, 0.0);
        this.demoParticleSystem1.setFriction(0.0, 100.0, 100.0);
        this.demoParticleSystem1.setLife(1.0, 2.0);

        this.demoParticleSystem2 = new ParticleSystem();
        this.demoParticleSystem2.setMode(ParticleSystem.BURST_MODE);
        this.demoParticleSystem2.setType(2);
        this.demoParticleSystem2.setV(-240.0, 240.0, -240.0, 240.0, 0.0, 0.0);
        this.demoParticleSystem2.setA(-6.0, 6.0, -6.0, 6.0, 0.0, 0.0);
        this.demoParticleSystem2.setLife(0.5, 0.7);
        this.demoParticleSystem2.setParticlesPerTick(50);

        this.demoShaking = new Shaking();

    };


    this.show = function() {

        // do stuff before we start in-game state, examples:

        this.demoMatrixFromImage = ImageProcessing.readMatrix("demoData", 10, 10, "empty", {
            "#000000" : "full"
        });

        this.demoText = new Text();
        this.demoText.pos(game.centerX, 20);
        this.demoText.setAlignment(Text.CENTER);
        this.demoText.text("Hello World!");

        mouse.registerUpArea("demoFire", 0, 0, game.width, game.height, function() {
            if(!game.paused) {
                game.state.demoParticleSystem2.setEmitter(mouse.x, mouse.y);
                game.state.demoParticleSystem2.burst();
                game.state.demoShaking.shake(6, 18, 2);
                sound.play("cannon");
                game.state.demoInterpolationTarget = mouse.x;
            }
        });

        mouse.registerDraggableArea("demoDragAndDrop", 420, 270, 60, 60, function() {
            console.log("started dragging.");
        }, function() {
            game.state.demoImageX += mouse.dragDeltaX;
            game.state.demoImageY += mouse.dragDeltaY;
        }, function() {
            console.log("end dragging.");
        });

        keyboard.registerKeyUpHandler(Keyboard.C, function() {
            timer.doForCountdown(3.0, function(progress) {
                game.state.demoText.text("Progress: " + progress.toFixed(2));
            }, function() {
                game.state.demoText.text("Hello World!");
            });
        });
    };


    this.hide = function() {

        // do stuff before we end in-game state, examples:

        mouse.deleteUpArea("demoFire");

        mouse.deleteDraggableArea("demoDragAndDrop");
    };


    this.update = function() {

        // update stuff here:

        if(!game.paused) {
            this.demoImageRotation += 2.0 * timer.delta;
            timer.updateCallbacks();

            var interpolate = Interpolate.accelerateToPos(
                this.demoInterpolationPos,
                this.demoInterpolationTarget,
                this.demoInterpolationVelocity,
                2000.0,
                5000.0
            );
            this.demoInterpolationPos = interpolate.pos;
            this.demoInterpolationVelocity = interpolate.velocity;
        }
    };


    this.draw = function() {

        // draw stuff here, examples:

        c.fillStyle = "#fff";
        c.fillRect(0, 0, game.width, game.height);

        for(var x = 0; x < 10; x++) {
            for(var y = 0; y < 10; y++) {
                if(this.demoMatrixFromImage[x][y] == "full") {
                    c.fillStyle = "#ddd";
                    c.fillRect(x * 20, y * 20, 20, 20);
                }
            }
        }

        c.fillStyle = "#999";
        c.fillRect(this.demoInterpolationPos, 0, 1, game.height);

        this.demoText.draw();

        this.demoShaking.apply();

        img.drawRotated("test", this.demoImageX, this.demoImageY, 38, 38, this.demoImageRotation);

        this.demoParticleSystem1.draw();
        this.demoParticleSystem2.draw();

        img.draw("demoGeneratedTexture", 740, 440);

        this.demoShaking.remove();
    };

}
