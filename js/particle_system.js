function ParticleSystem() {

	this.mode = ParticleSystem.CONTINUOUS_MODE;

	this.type;

	this.emitter = { x : 0.0, y : 0.0, z : 0.0 };

	this.initMinV = { x : 0.0, y : 0.0, z : 0.0 };
	this.initMaxV = { x : 0.0, y : 0.0, z : 0.0 };

	this.initMinA = { x : 0.0, y : 0.0, z : 0.0 };
	this.initMaxA = { x : 0.0, y : 0.0, z : 0.0 };

	this.friction = { x : 0.0, y : 0.0, z : 0.0 };

	this.lifeMin = 0.0;
	this.lifeMax = 0.0;

	this.particlesPerTick = 1;

	this.particles = {};
	this.particleCounter = 0;

	this.isOn = true;

	this.burstNow = false;


	this.setMode = function(mode) {
		this.mode = mode;
	};


	this.setType = function(type) {
		this.type = type;
	};


	this.setEmitter = function(emitterX, emitterY, emitterZ) {
		this.emitter = { x : emitterX, y : emitterY, z : emitterZ };
	};


	this.setV = function(initMinVx, initMaxVx, initMinVy, initMaxVy, initMinVz, initMaxVz) {
		this.initMinV = { x : initMinVx, y : initMinVy, z : initMinVz };
		this.initMaxV = { x : initMaxVx, y : initMaxVy, z : initMaxVz };
	};


	this.setA = function(initMinAx, initMaxAx, initMinAy, initMaxAy, initMinAz, initMaxAz) {
		this.initMinA = { x : initMinAx, y : initMinAy, z : initMinAz };
		this.initMaxA = { x : initMaxAx, y : initMaxAy, z : initMaxAz };
	};


	this.setFriction = function(frictionX, frictionY, frictionZ) {
		this.friction = { x : frictionX, y : frictionY, z : frictionZ };
	};


	this.setLife = function(lifeMin, lifeMax) {
		this.lifeMin = lifeMin;
		this.lifeMax = lifeMax;
	};


	this.setParticlesPerTick = function(particlesPerTick) {
		this.particlesPerTick = particlesPerTick;
	};


	this.on = function() {
		this.isOn = true;
	};


	this.off = function() {
		this.isOn = false;
	};


	this.burst = function() {
		this.burstNow = true;
	};


	this.draw = function() {
		if(this.isOn && !game.paused) {
			if(this.mode == ParticleSystem.CONTINUOUS_MODE || (this.mode == ParticleSystem.BURST_MODE && this.burstNow)) {
				this.burstNow = false;
				for(var i = 0; i < this.particlesPerTick; i++) {
					this.particles[this.particleCounter] = new Particle();
					this.particles[this.particleCounter].init(this.type, this.emitter, this.initMinV, this.initMaxV, this.initMinA, this.initMaxA, this.friction, this.lifeMin, this.lifeMax);
					this.particleCounter++;
				}
			}
		}

		for(var particleId in this.particles) {
			if(this.particles[particleId].life < 0) {
				delete this.particles[particleId];
			} else {
				this.particles[particleId].draw();
			}
		}
	};

}


ParticleSystem.CONTINUOUS_MODE = 0;
ParticleSystem.BURST_MODE = 1;
