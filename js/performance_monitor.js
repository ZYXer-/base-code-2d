function PerformanceMonitor() {

	this.lastTime = 0;

	this.fps = 0;

	this.MEASUREMENT_TICK_INTERVAL = 10;

	this.measurementCountdown = 0;


	this.init = function() {
		if(game.DEBUG) {
			var d = new Date();
			this.lastTime = (1000 * d.getSeconds()) + d.getMilliseconds();
			jQuery("#game_box").after("<div id=\"fps\"></div>");
			this.measurementCountdown = this.MEASUREMENT_TICK_INTERVAL;
		}
	};


	this.update = function() {
		if(game.DEBUG) {

			this.measurementCountdown--;
			if(this.measurementCountdown <= 0) {
				this.measurementCountdown = this.MEASUREMENT_TICK_INTERVAL;

				var d = new Date();
				var now = (1000 * d.getSeconds()) + d.getMilliseconds();
				if(now < this.lastTime) {
					this.lastTime -= 60000;
				}
				var delta = (now - this.lastTime);
				this.lastTime = now;

				if(delta > 0) {
					this.fps = this.MEASUREMENT_TICK_INTERVAL * 1000 / delta;
					this.printFps();
				}
			}
		}
	};


	this.printFps = function() {
		jQuery("#fps").html("FPS: " + this.fps.toFixed(1));
	};

}