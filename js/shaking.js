function Shaking() {

	this.offsetX = 0;
	this.offsetY = 0;

	this.timer = 0;
	this.timerStart = 0;

	this.amplitude = 0;


	this.shake = function(amplitude, length, delay) {
		this.timer = length;
		this.timerStart = length - delay;
		this.amplitude = amplitude;
	};


	this.apply = function() {
		if(!game.paused) {
			if(this.timer > 0 && this.timer <= this.timerStart) {

				var maxShake = Math.ceil(this.amplitude * (1 - Math.sin(1.2 * (this.timerStart - this.timer) / this.timerStart)));
				var minShake = Math.floor(maxShake * 0.7);
				this.offsetX = rand(minShake, maxShake);
				this.offsetY = rand(minShake, maxShake);

				if(this.timer % 2 == 0) {
					this.offsetX = -this.offsetX;
				}
				if(this.timer % 4 < 1) {
					this.offsetY = -this.offsetY;
				}

			} else {
				this.offsetX = 0;
				this.offsetY = 0;
			}

			if(this.timer > 0) {
				this.timer--;
			}
		}
		c.save();
		c.translate(this.offsetX, this.offsetY);
	};


	this.remove = function() {
		c.restore();
	};


}