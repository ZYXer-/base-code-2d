function IngameState() {

	// just for demonstration purposes:

	this.demoText;
	
	this.demoParticleSystem1;
	this.demoParticleSystem2;
	
	this.demoShaking;
	
	this.demoImageRotation = 0;
	this.demoImageX = 450;
	this.demoImageY = 300;


	this.init = function() {
		
		// setup stuff here, examples:

		this.demoParticleSystem1 = new ParticleSystem();
		this.demoParticleSystem1.setType(1);
		this.demoParticleSystem1.setEmitter(225, 300, 0);
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
		
		this.demoText = new Text();
		this.demoText.pos(450, 20);
		this.demoText.setAlignment(Text.CENTER);
		this.demoText.text("Hello World!");

		mouse.registerUpArea("demoFire", 0, 0, game.WIDTH, game.HEIGHT, function() {
			if(!game.paused) {
				game.state.demoParticleSystem2.setEmitter(mouse.x, mouse.y);
				game.state.demoParticleSystem2.burst();
				game.state.demoShaking.shake(6, 18, 2);
				sound.play("cannon");
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
	};


	this.hide = function() {

		// do stuff before we end in-game state, examples:

		mouse.deleteUpArea("demoFire");
		
		mouse.deleteDraggableArea("demoDragAndDrop");
	};


	this.update = function() {

		// update stuff here:

		if(!game.paused) {
			this.demoImageRotation += 10 * timer.delta;
		}
	};


	this.draw = function() {

		// draw stuff here, examples:

		c.fillStyle = "#fff";
		c.fillRect(0, 0, game.WIDTH, game.HEIGHT);

		this.demoText.draw();

		this.demoShaking.apply();

		img.drawRotated("test", this.demoImageX, this.demoImageY, 38, 38, this.demoImageRotation);

		this.demoParticleSystem1.draw();
		this.demoParticleSystem2.draw();

		this.demoShaking.remove();
	};

}
