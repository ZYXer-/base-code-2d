function PerformanceMonitor() {}


PerformanceMonitor.lastTime = 0;
PerformanceMonitor.fps = 0;
PerformanceMonitor.MEASUREMENT_TICK_INTERVAL = 10;
PerformanceMonitor.measurementCountdown = 0;


PerformanceMonitor.init = function() {
    if(Settings.Game.DEBUG) {
        var d = new Date();
        PerformanceMonitor.lastTime = (1000 * d.getSeconds()) + d.getMilliseconds();
        jQuery("#game_box").after("<div id=\"fps\"></div>");
        PerformanceMonitor.measurementCountdown = PerformanceMonitor.MEASUREMENT_TICK_INTERVAL;
    }
};


PerformanceMonitor.update = function() {
    if(Settings.Game.DEBUG) {

        PerformanceMonitor.measurementCountdown--;
        if(PerformanceMonitor.measurementCountdown <= 0) {
            PerformanceMonitor.measurementCountdown = PerformanceMonitor.MEASUREMENT_TICK_INTERVAL;

            var d = new Date();
            var now = (1000 * d.getSeconds()) + d.getMilliseconds();
            if(now < PerformanceMonitor.lastTime) {
                PerformanceMonitor.lastTime -= 60000;
            }
            var delta = (now - PerformanceMonitor.lastTime);
            PerformanceMonitor.lastTime = now;

            if(delta > 0) {
                PerformanceMonitor.fps = PerformanceMonitor.MEASUREMENT_TICK_INTERVAL * 1000 / delta;
                PerformanceMonitor.printFps();
            }
        }
    }
};


PerformanceMonitor.printFps = function() {
    jQuery("#fps").html("FPS: " + PerformanceMonitor.fps.toFixed(1));
};