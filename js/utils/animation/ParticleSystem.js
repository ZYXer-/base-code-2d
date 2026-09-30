import * as Game from "../../core/Game.js";
import Particle from "./Particle.js";


class ParticleSystem {


    constructor(options) {

        this.mode = options.mode ?? ParticleSystem.CONTINUOUS_MODE;

        this.emitter = { x: 0.0, y: 0.0, z: 0.0, ...options.emitter };
        this.emitterSize = { x: 0.0, y: 0.0, z: 0.0, ...options.emitterSize };

        const v = options.v ?? {};
        this.initV = {
            x: { min: 0.0, max: 0.0, ...v.x },
            y: { min: 0.0, max: 0.0, ...v.y },
            z: { min: 0.0, max: 0.0, ...v.z }
        };

        const a = options.a ?? {};
        this.initA = {
            x: { min: 0.0, max: 0.0, ...a.x },
            y: { min: 0.0, max: 0.0, ...a.y },
            z: { min: 0.0, max: 0.0, ...a.z }
        };

        this.friction = { x: 0.0, y: 0.0, z: 0.0, ...options.friction };

        this.life = { min: 0.0, max: 0.0, ...options.life };

        this.particlesPerTick = options.particlesPerTick ?? 1;
        this.initFunction = options.init ?? null;
        this.drawFunction = options.draw ?? null;

        this.particles = {};
        this.particleCounter = 0;

        this.isOn = true;

        this.burstNow = false;

    }


    setMode(mode) {
        this.mode = mode;
    }


    setType(type) {
        this.type = type;
    }


    setEmitter(emitter) {
        this.emitter = { x: emitter.x, y: emitter.y, z: emitter.z };
    }


    setEmitterSize(size) {
        this.emitterSize = { x: size.x, y: size.y, z: size.z };
    }


    setV(v) {
        this.initV = {
            x: { min: v.x.min, max: v.x.max },
            y: { min: v.y.min, max: v.y.max },
            z: { min: v.z.min, max: v.z.max }
        };
    }


    setA(a) {
        this.initA = {
            x: { min: a.x.min, max: a.x.max },
            y: { min: a.y.min, max: a.y.max },
            z: { min: a.z.min, max: a.z.max }
        };
    }


    setFriction(friction) {
        this.friction = { x: friction.x, y: friction.y, z: friction.z };
    }


    setLife(life) {
        this.life = { min: life.min, max: life.max };
    }


    setParticlesPerTick(particlesPerTick) {
        this.particlesPerTick = particlesPerTick;
    }


    on() {
        this.isOn = true;
    }


    off() {
        this.isOn = false;
    }


    burst() {
        this.burstNow = true;
    }


    reset() {
        this.particles = {};
        this.particleCounter = 0;
    }


    draw() {
        if (!ParticleSystem.particlesOn) {
            this.particles = {};
            this.particleCounter = 0;
            return;
        }
        if (this.isOn && !Game.paused) {
            if (this.mode === ParticleSystem.CONTINUOUS_MODE || (this.mode === ParticleSystem.BURST_MODE && this.burstNow)) {
                this.burstNow = false;
                for (let i = 0; i < this.particlesPerTick; i++) {
                    this.particles[this.particleCounter] = new Particle(this.drawFunction, this.emitter, this.emitterSize, this.initV, this.initA, this.friction, this.life, this.initFunction);
                    this.particleCounter++;
                }
            }
        }

        for (const particleId in this.particles) {
            if (this.particles[particleId].life < 0) {
                delete this.particles[particleId];
            } else {
                this.particles[particleId].draw();
            }
        }
    }
}


ParticleSystem.particlesOn = true;


ParticleSystem.CONTINUOUS_MODE = 0;
ParticleSystem.BURST_MODE = 1;


export default ParticleSystem;