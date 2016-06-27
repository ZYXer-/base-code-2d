function Timer() {

    this.lastTime = 0;

    this.delta = 0.00001;

    this.callbacks = {};
    this.callbackCounter = 0;


    this.init = function() {
        var d = new Date();
        this.lastTime = (1000 * d.getSeconds()) + d.getMilliseconds();
    };


    this.update = function() {
        var d = new Date();
        var now = (1000 * d.getSeconds()) + d.getMilliseconds();
        if(now < this.lastTime) {
            this.lastTime -= 60000;
        }
        this.delta = (now - this.lastTime) / 1000;
        if(this.delta < 0.00001) {
            this.delta = 0.00001;
        }
        if(this.delta > 0.25) {
            this.delta = 0.25;
        }
        this.lastTime = now;
    };


    this.countdown = function(time, callback) {
        var timerCallback = new TimerCallback();
        timerCallback.init(time, null, callback, false);
        this.callbacks[this.callbackCounter] = timerCallback;
        this.callbackCounter++;
        return timerCallback;
    };


    this.doFor = function(time, callback) {
        var timerCallback = new TimerCallback();
        timerCallback.init(time, callback, null, false);
        this.callbacks[this.callbackCounter] = timerCallback;
        this.callbackCounter++;
        return timerCallback;
    };


    this.doForCountdown = function(time, updateCallback, endCallback) {
        var timerCallback = new TimerCallback();
        timerCallback.init(time, updateCallback, endCallback, false);
        this.callbacks[this.callbackCounter] = timerCallback;
        this.callbackCounter++;
        return timerCallback;
    };


    this.repeatEvery = function(interval, callback, skipFirst) {
        var timerCallback = new TimerCallback();
        timerCallback.init(interval, null, callback, true);
        if(typeof skipFirst === "undefined" || !skipFirst) {
            timerCallback.life = 0.0;
        }
        this.callbacks[this.callbackCounter] = timerCallback;
        this.callbackCounter++;
        return timerCallback;
    };


    this.updateCallbacks = function() {
        for(var callbackId in this.callbacks) {
            if(this.callbacks[callbackId].killed) {
                delete this.callbacks[callbackId];
            } else {
                this.callbacks[callbackId].update();
            }
        }
    };

}