function Game() {

	this.WIDTH = 900;
	this.HEIGHT = 600;

	this.DEBUG = true;

	this.TIME_PER_FRAME = 20;

	this.STATES = {
		"loading" : new LoadingState(),
		"ingame" : new IngameState()
	};

	this.INITIAL_STATE = "loading";

	this.interval;

	this.state = null;
	this.nextState = null;


	this.init = function() {

		timer.init();
		performanceMonitor.init();

		keyboard.init();
		mouse.init();

		keyboard.registerKeyUpHandler(Keyboard.P, function() {
			game.paused = !game.paused;
		});

		keyboard.registerKeyUpHandler(Keyboard.M, function() {
			sound.muteUnmute();
		});

		for(var stateName in this.STATES) {
			if(this.STATES[stateName].hasOwnProperty("init")) {
				this.STATES[stateName].init();
			}
		}
		this.setState(this.INITIAL_STATE);
		this.startLoop();
	};


	this.setState = function(state) {
		if(this.STATES.hasOwnProperty(state)) {
			this.nextState = this.STATES[state];
		} else {
			alert("ERROR: Could not find state: " + state);
		}
	};


	this.startLoop = function() {
		this.interval = window.setInterval(function() {
			game.loop();
		}, this.TIME_PER_FRAME);
	};


	this.loop = function() {
		this.initState();
		timer.update();
		mouse.update();
		this.update();
		this.draw();
		performanceMonitor.update();
	};


	this.initState = function() {

		if(this.state != this.nextState) {

			if(this.state != null) {
				if(this.state.hasOwnProperty("hide")) {
					this.state.hide();
				}
			}

			this.state = this.nextState;
			if(this.state.hasOwnProperty("show")) {
				this.state.show();
			}
		}
	};


	this.update = function() {
		if(this.state.hasOwnProperty("update")) {
			this.state.update();
		}
	};


	this.draw = function() {
		if(this.state.hasOwnProperty("draw")) {
			this.state.draw();
		}
	};

}