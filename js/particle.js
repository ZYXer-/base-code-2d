function Particle() {

	this.type;

	this.pos;  
	this.v;

	this.minA;
	this.maxA;

	this.fric;

	this.life;


	this.init = function(type, emitter, initMinV, initMaxV, initMinA, initMaxA, friction, lifeMin, lifeMax) {
		this.type = type;

		this.pos = { x : emitter.x, y : emitter.y, z : emitter.z };

		this.v = {
			x : initMinV.x + ((initMaxV.x - initMinV.x) * Math.random()),
			y : initMinV.y + ((initMaxV.y - initMinV.y) * Math.random()),
			z : initMinV.z + ((initMaxV.z - initMinV.z) * Math.random())
		}

		this.minA = { x : initMinA.x, y : initMinA.y, z : initMinA.z };
		this.maxA = { x : initMaxA.x, y : initMaxA.y, z : initMaxA.z };

		this.fric = { x : friction.x, y : friction.y, z : friction.z };

		this.life = randFloat(lifeMin, lifeMax);

	};


	this.draw = function() {

		if(!game.paused) {
			var delta = timer.delta;

			this.pos.x += this.v.x * delta;
			this.pos.y += this.v.y * delta;
			this.pos.z += this.v.z * delta;

			this.v.x += ((this.fric.x * (this.v.x > 0.0 ? -1.0 : 1.0)) + this.minA.x + ((this.maxA.x - this.minA.x) * Math.random())) * delta;
			this.v.y += ((this.fric.y * (this.v.y > 0.0 ? -1.0 : 1.0)) + this.minA.y + ((this.maxA.y - this.minA.y) * Math.random())) * delta;
			this.v.z += ((this.fric.z * (this.v.z > 0.0 ? -1.0 : 1.0)) + this.minA.z + ((this.maxA.z - this.minA.z) * Math.random())) * delta;

			this.life -= delta;
		}

		// implement particle types here:
		if(this.type == 1) {
			var opacity = limit(this.life / 2.0, 0.0, 1.0);
			c.fillStyle = "rgba(0, 0, 255, " + opacity + ")";
			c.fillRect(this.pos.x - 20, this.pos.y - 20, 40, 40);

		} else if(this.type == 2) {
			var opacity = limit(this.life / 0.7, 0.0, 1.0);
			c.fillStyle = "rgba(0, 127, 0, " + opacity + ")";
			c.fillRect(this.pos.x - 10, this.pos.y - 10, 20, 20);
		}
	};

}