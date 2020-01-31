import { c } from "../core/canvas.js";
import * as Game from "../core/Game.js";
import * as Utils from "./Utils.js";
import Vec2 from "./Vec2.js";


class Shaking {


    constructor() {
        this.offset = new Vec2(0.0, 0.0);

        this.timer = 0;
        this.timerStart = 0;

        this.amplitude = 0;
    }


    shake(amplitude, length, delay) {
        this.timer = length;
        this.timerStart = length - delay;
        this.amplitude = amplitude;
    }


    apply() {
        if(!Game.paused) {
            if(this.timer > 0 && this.timer <= this.timerStart) {

                let maxShake = Math.ceil(this.amplitude * (1 - Math.sin(1.2 * (this.timerStart - this.timer) / this.timerStart)));
                let minShake = Math.floor(maxShake * 0.7);
                this.offset.x = Utils.rand(minShake, maxShake);
                this.offset.y = Utils.rand(minShake, maxShake);

                if(this.timer % 2 === 0) {
                    this.offset.x = -this.offset.x;
                }
                if(this.timer % 4 < 1) {
                    this.offset.y = -this.offset.y;
                }

            } else {
                this.offset.x = 0;
                this.offset.y = 0;
            }

            if(this.timer > 0) {
                this.timer--;
            }
        }
        c.save();
        c.translate(this.offset.x, this.offset.y);
    }


    remove() {
        c.restore();
    }

}


export default Shaking;