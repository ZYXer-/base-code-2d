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
        timerCallback.init(time, null, callback);
        this.callbacks[this.callbackCounter] = timerCallback;
        this.callbackCounter++;
    };


    this.forDo = function(time, callback) {
        var timerCallback = new TimerCallback();
        timerCallback.init(time, callback, null);
        this.callbacks[this.callbackCounter] = timerCallback;
        this.callbackCounter++;
    };


    this.forDoCallback = function(time, updateCallback, endCallback) {
        var timerCallback = new TimerCallback();
        timerCallback.init(time, updateCallback, endCallback);
        this.callbacks[this.callbackCounter] = timerCallback;
        this.callbackCounter++;
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