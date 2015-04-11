function Timer() {

	this.lastTime = 0;

	this.delta = 0.00001;


	this.init = function() {
		var d = new Date();
		this.lastTime = (1000 * d.getSeconds()) + d.getMilliseconds();
	};


	this.update = function() {
		var d = new Date();
		var now = (1000 * d.getSeconds()) + d.getMilliseconds();
		if(now < this.lastTime) {
			this.lastTime -= 60000;
		}
		this.delta = (now - this.lastTime) / 1000;
		if(this.delta < 0.00001) {
			this.delta = 0.00001;
		}
		if(this.delta > 0.25) {
			this.delta = 0.25;
		}
		this.lastTime = now;
	};

}