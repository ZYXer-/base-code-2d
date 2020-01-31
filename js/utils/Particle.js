import * as Game from "../core/Game.js";
import * as Timer from "../core/Timer.js";
import * as Utils from "./Utils.js";


class Particle {


    constructor(drawFunction, emitter, emitterSize, initV, initA, friction, life, initFunction) {

        this.drawFunction = drawFunction;

        this.pos = { x : emitter.x, y : emitter.y, z : emitter.z };

        if(emitterSize.x !== 0.0) {
            this.pos.x += Utils.randFloat(-emitterSize.x, emitterSize.x);
        }
        if(emitterSize.y !== 0.0) {
            this.pos.y += Utils.randFloat(-emitterSize.y, emitterSize.y);
        }
        if(emitterSize.z !== 0.0) {
            this.pos.z += Utils.randFloat(-emitterSize.z, emitterSize.z);
        }

        this.v = {
            x : Utils.randFloat(initV.x.min, initV.x.max),
            y : Utils.randFloat(initV.y.min, initV.y.max),
            z : Utils.randFloat(initV.z.min, initV.z.max)
        };

        this.a = {
            x : { min : initA.x.min, max : initA.x.max },
            y : { min : initA.y.min, max : initA.y.max },
            z : { min : initA.z.min, max : initA.z.max }
        };

        this.fric = { x : friction.x, y : friction.y, z : friction.z };

        this.life = Utils.randFloat(life.min, life.max);

        if(initFunction != null) {
            initFunction(this);
        }
    }


    draw() {

        if(!Game.paused) {
            let delta = Timer.delta;

            this.pos.x += this.v.x * delta;
            this.pos.y += this.v.y * delta;
            this.pos.z += this.v.z * delta;

            this.v.x += ((this.fric.x * (this.v.x > 0.0 ? -1.0 : 1.0)) + this.a.x.min + ((this.a.x.max - this.a.x.min) * Math.random())) * delta;
            this.v.y += ((this.fric.y * (this.v.y > 0.0 ? -1.0 : 1.0)) + this.a.y.min + ((this.a.y.max - this.a.y.min) * Math.random())) * delta;
            this.v.z += ((this.fric.z * (this.v.z > 0.0 ? -1.0 : 1.0)) + this.a.z.min + ((this.a.z.max - this.a.z.min) * Math.random())) * delta;

            this.life -= delta;
        }

        this.drawFunction(this);
    }

}


export default Particle;