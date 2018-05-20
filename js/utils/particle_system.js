function ParticleSystem(options) {

    this.mode = ParticleSystem.CONTINUOUS_MODE;
    if(options.hasOwnProperty("mode")) {
        this.mode = options.mode;
    }

    this.emitter = {x : 0.0, y : 0.0, z : 0.0};
    if(options.hasOwnProperty("emitter")) {
        this.emitter = { x : options.emitter.x, y : options.emitter.y, z : options.emitter.z };
    }
    this.emitterSize = {x : 0.0, y : 0.0, z : 0.0};
    if(options.hasOwnProperty("emitterSize")) {
        this.emitterSize = { x : options.emitterSize.x, y : options.emitterSize.y, z : options.emitterSize.z };
    }

    this.initV = {x : { min : 0.0, max : 0.0 }, y : { min : 0.0, max : 0.0 }, z : { min : 0.0, max : 0.0 }};
    if(options.hasOwnProperty("v")) {
        this.initV = {
            x : { min : options.v.x.min, max : options.v.x.max },
            y : { min : options.v.y.min, max : options.v.y.max },
            z : { min : options.v.z.min, max : options.v.z.max }
        };
    }

    this.initA = {x : { min : 0.0, max : 0.0 }, y : { min : 0.0, max : 0.0 }, z : { min : 0.0, max : 0.0 }};
    if(options.hasOwnProperty("a")) {
        this.initA = {
            x : { min : options.a.x.min, max : options.a.x.max },
            y : { min : options.a.y.min, max : options.a.y.max },
            z : { min : options.a.z.min, max : options.a.z.max }
        };
    }

    this.friction = {x : 0.0, y : 0.0, z : 0.0};
    if(options.hasOwnProperty("friction")) {
        this.friction = { x : options.friction.x, y : options.friction.y, z : options.friction.z };
    }

    this.life = { min : 0.0, max : 0.0 };
    if(options.hasOwnProperty("life")) {
        this.life = { min : options.life.min, max : options.life.max };
    }

    this.particlesPerTick = 1;
    if(options.hasOwnProperty("particlesPerTick")) {
        this.particlesPerTick = options.particlesPerTick;
    }

    this.initFunction = null;
    if(options.hasOwnProperty("init")) {
        this.initFunction = options.init;
    }

    this.drawFunction = null;
    if(options.hasOwnProperty("draw")) {
        this.drawFunction = options.draw;
    }

    this.particles = {};
    this.particleCounter = 0;

    this.isOn = true;

    this.burstNow = false;

}


ParticleSystem.prototype.setMode = function(mode) {
    this.mode = mode;
};


ParticleSystem.prototype.setType = function(type) {
    this.type = type;
};


ParticleSystem.prototype.setEmitter = function(emitter) {
    this.emitter = { x : emitter.x, y : emitter.y, z : emitter.z };
};


ParticleSystem.prototype.setEmitterSize = function(size) {
    this.emitterSize = { x : size.x, y : size.y, z : size.z };
};


ParticleSystem.prototype.setV = function(v) {
    this.initV = {
        x : { min : v.x.min, max : v.x.max },
        y : { min : v.y.min, max : v.y.max },
        z : { min : v.z.min, max : v.z.max }
    };
};


ParticleSystem.prototype.setA = function(a) {
    this.initA = {
        x : { min : a.x.min, max : a.x.max },
        y : { min : a.y.min, max : a.y.max },
        z : { min : a.z.min, max : a.z.max }
    };
};


ParticleSystem.prototype.setFriction = function(friction) {
    this.friction = { x : friction.x, y : friction.y, z : friction.z };
};


ParticleSystem.prototype.setLife = function(life) {
    this.life = { min : life.min, max : life.max };
};


ParticleSystem.prototype.setParticlesPerTick = function(particlesPerTick) {
    this.particlesPerTick = particlesPerTick;
};


ParticleSystem.prototype.on = function() {
    this.isOn = true;
};


ParticleSystem.prototype.off = function() {
    this.isOn = false;
};


ParticleSystem.prototype.burst = function() {
    this.burstNow = true;
};


ParticleSystem.prototype.reset = function() {
    this.particles = {};
    this.particleCounter = 0;
};


ParticleSystem.prototype.draw = function() {
    if(!ParticleSystem.particlesOn) {
        this.particles = {};
        this.particleCounter = 0;
        return;
    }
    if(this.isOn && !Game.paused) {
        if(this.mode === ParticleSystem.CONTINUOUS_MODE || (this.mode === ParticleSystem.BURST_MODE && this.burstNow)) {
            this.burstNow = false;
            for(var i = 0; i < this.particlesPerTick; i++) {
                this.particles[this.particleCounter] = new Particle(this.drawFunction, this.emitter, this.emitterSize, this.initV, this.initA, this.friction, this.life, this.initFunction);
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


ParticleSystem.particlesOn = true;


ParticleSystem.CONTINUOUS_MODE = 0;
ParticleSystem.BURST_MODE = 1;
