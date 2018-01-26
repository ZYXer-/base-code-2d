function Timer() {}


Timer.lastTime = 0;

Timer.delta = 0.00001;

Timer.callbacks = {};
Timer.callbackCounter = 0;


Timer.init = function() {
    var d = new Date();
    Timer.lastTime = (1000 * d.getSeconds()) + d.getMilliseconds();
};


Timer.update = function() {
    var d = new Date();
    var now = (1000 * d.getSeconds()) + d.getMilliseconds();
    if(now < Timer.lastTime) {
        Timer.lastTime -= 60000;
    }
    Timer.delta = Settings.Game.TIME_MULTIPLIER * (now - Timer.lastTime) / 1000;
    Timer.delta = Utils.limit(Timer.delta, 0.00001, Settings.Game.MAX_TIME_PER_FRAME);
    Timer.lastTime = now;
};


Timer.countdown = function(time, callback) {
    var timerCallback = new TimerCallback(time, null, callback, false);
    Timer.callbacks[Timer.callbackCounter] = timerCallback;
    Timer.callbackCounter++;
    return timerCallback;
};


Timer.doFor = function(time, callback) {
    var timerCallback = new TimerCallback(time, callback, null, false);
    Timer.callbacks[Timer.callbackCounter] = timerCallback;
    Timer.callbackCounter++;
    return timerCallback;
};


Timer.doForCountdown = function(time, updateCallback, endCallback) {
    var timerCallback = new TimerCallback(time, updateCallback, endCallback, false);
    Timer.callbacks[Timer.callbackCounter] = timerCallback;
    Timer.callbackCounter++;
    return timerCallback;
};


Timer.repeatEvery = function(interval, callback, skipFirst) {
    var timerCallback = new TimerCallback(interval, null, callback, true);
    if(typeof skipFirst === "undefined" || !skipFirst) {
        timerCallback.life = 0.0;
    }
    Timer.callbacks[Timer.callbackCounter] = timerCallback;
    Timer.callbackCounter++;
    return timerCallback;
};


Timer.updateCallbacks = function() {
    for(var callbackId in Timer.callbacks) {
        if(Timer.callbacks[callbackId].killed) {
            delete Timer.callbacks[callbackId];
        } else {
            Timer.callbacks[callbackId].update();
        }
    }
};