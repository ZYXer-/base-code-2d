function Particle() {

    this.type;

    this.pos;
    this.v;

    this.minA;
    this.maxA;

    this.fric;

    this.life;


    this.init = function(type, emitter, emitterSize, initMinV, initMaxV, initMinA, initMaxA, friction, lifeMin, lifeMax) {
        this.type = type;

        this.pos = { x : emitter.x, y : emitter.y, z : emitter.z };

        if(emitterSize.x != 0.0) {
            this.pos.x += randFloat(-emitterSize.x, emitterSize.x);
        }
        if(emitterSize.y != 0.0) {
            this.pos.y += randFloat(-emitterSize.y, emitterSize.y);
        }
        if(emitterSize.z != 0.0) {
            this.pos.z += randFloat(-emitterSize.z, emitterSize.z);
        }

        this.v = {
            x : randFloat(initMinV.x, initMaxV.x),
            y : randFloat(initMinV.y, initMaxV.y),
            z : randFloat(initMinV.z, initMaxV.z)
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

        ParticleDrawable.draw(this);
    };

}