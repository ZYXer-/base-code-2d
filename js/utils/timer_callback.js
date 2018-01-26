function TimerCallback(life, updateCallback, endCallback, repeat) {

    this.fullLife = life;
    this.life = life;
    this.repeat = repeat;
    this.killed = false;
    this.paused = false;

    this.updateCallback = updateCallback;
    this.endCallback = endCallback;

}


TimerCallback.prototype.update = function() {
    if(!this.paused) {
        this.life -= Timer.delta;
    }
    if(this.life > 0.0) {
        if(this.updateCallback !== null) {
            var progress = 1.0;
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
};


TimerCallback.prototype.pause = function() {
    this.paused = true;
};


TimerCallback.prototype.unpause = function() {
    this.paused = false;
};


TimerCallback.prototype.togglePause = function() {
    this.paused = !this.paused;
};


TimerCallback.prototype.end = function() {
    this.life = 0.0;
};


TimerCallback.prototype.kill = function() {
    this.killed = true;
};


TimerCallback.prototype.restart = function() {
    this.killed = false;
    this.life = this.fullLife;
};