function TimerCallback() {


    this.fullLife = 0.0;
    this.life = 0.0;
    this.killed = false;
    this.paused = false;

    this.updateCallback = null;
    this.endCallback = null;


    this.init = function(life, updateCallback, endCallback) {
        this.fullLife = life;
        this.life = life;

        this.updateCallback = updateCallback;
        this.endCallback = endCallback;
    };


    this.update = function() {
        if(!this.paused) {
            this.life -= timer.delta;
        }
        if(this.life > 0.0) {
            if(this.updateCallback != null) {
                var progress = 1.0;
                if(this.fullLife != 0.0) {
                    progress = 1.0 - (this.life / this.fullLife);
                }
                this.updateCallback(progress);
            }
        } else {
            if(this.endCallback != null) {
                this.endCallback();
            }
            this.killed = true;
        }
    };


    this.pause = function() {
        this.paused = true;
    };


    this.unpause = function() {
        this.paused = false;
    };


    this.togglePause = function() {
        this.paused = !this.paused;
    };


    this.end = function() {
        this.life = 0.0;
    };


    this.kill = function() {
        this.killed = true;
    };

}