import * as Timer from "../core/Timer.js";


class TimerCallback {


    constructor(life, updateCallback, endCallback, repeat) {

        this.fullLife = life;
        this.life = life;
        this.repeat = repeat;
        this.killed = false;
        this.paused = false;

        this.updateCallback = updateCallback;
        this.endCallback = endCallback;

    }


    update() {
        if(!this.paused) {
            this.life -= Timer.delta;
        }
        if(this.life > 0.0) {
            if(this.updateCallback !== null) {
                let progress = 1.0;
                if(this.fullLife !== 0.0) {
                    progress = 1.0 - (this.life / this.fullLife);
                }
                this.updateCallback(progress);
            }
        } else {
            if(this.endCallback !== null) {
                this.endCallback();
            }
            if(this.repeat) {
                this.life = this.fullLife;
            } else if(this.life <= 0.0) {
                this.killed = true;
            }
        }
    }


    pause() {
        this.paused = true;
    }


    unpause() {
        this.paused = false;
    }


    togglePause() {
        this.paused = !this.paused;
    }


    end() {
        this.life = 0.0;
    }


    kill() {
        this.killed = true;
    }


    restart() {
        this.killed = false;
        this.life = this.fullLife;
    }

}


export default TimerCallback;