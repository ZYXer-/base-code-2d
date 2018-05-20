function PerformanceMonitor() {}


PerformanceMonitor.lastTime = 0;
PerformanceMonitor.fps = 0;
PerformanceMonitor.MEASUREMENT_TICK_INTERVAL = 20;
PerformanceMonitor.measurementCountdown = 0;

PerformanceMonitor.stopwatches = [];
PerformanceMonitor.stopwatches[0] = { name : "total" };
PerformanceMonitor.stopwatches[1] = { name : "update" };
PerformanceMonitor.stopwatches[2] = { name : "draw" };


PerformanceMonitor.init = function() {
    if(Settings.Game.DEBUG) {

        PerformanceMonitor.lastTime = PerformanceMonitor.now();

        jQuery("#game_box").after("<div id=\"fps\"></div>");

        PerformanceMonitor.measurementCountdown = PerformanceMonitor.MEASUREMENT_TICK_INTERVAL;

        if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
            for(var i = 0; i < PerformanceMonitor.stopwatches.length; i++) {
                var stopwatch = PerformanceMonitor.stopwatches[i];
                stopwatch.timeTotal = 0.0;
                stopwatch.value = 0.0;
                stopwatch.lastTime = 0.0;
            }
        }
    }
};


PerformanceMonitor.startStopwatch = function(stopwatchId) {
    if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
        PerformanceMonitor.stopwatches[stopwatchId].lastTime = PerformanceMonitor.now();
    }
};


PerformanceMonitor.stopStopwatch = function(stopwatchId) {
    if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
        var stopwatch = PerformanceMonitor.stopwatches[stopwatchId];
        var now = PerformanceMonitor.now();
        if(now < stopwatch.lastTime) {
            stopwatch.lastTime -= 60000;
        }
        stopwatch.timeTotal += now - stopwatch.lastTime;
    }
};


PerformanceMonitor.update = function() {
    if(Settings.Game.DEBUG) {

        PerformanceMonitor.measurementCountdown--;
        if(PerformanceMonitor.measurementCountdown <= 0) {
            PerformanceMonitor.measurementCountdown = PerformanceMonitor.MEASUREMENT_TICK_INTERVAL;

            var now = PerformanceMonitor.now();
            if(now < PerformanceMonitor.lastTime) {
                PerformanceMonitor.lastTime -= 60000;
            }

            var delta = (now - PerformanceMonitor.lastTime);
            PerformanceMonitor.lastTime = now;

            if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
                for(var i = 0; i < PerformanceMonitor.stopwatches.length; i++) {
                    var stopwatch = PerformanceMonitor.stopwatches[i];
                    stopwatch.value = stopwatch.timeTotal / PerformanceMonitor.MEASUREMENT_TICK_INTERVAL;
                    stopwatch.timeTotal = 0.0;
                }
            }

            if(delta > 0) {
                PerformanceMonitor.fps = PerformanceMonitor.MEASUREMENT_TICK_INTERVAL * 1000 / delta;
                PerformanceMonitor.printFps();
            }
        }
    }
};


PerformanceMonitor.printFps = function() {
    var fpsContent = "";
    if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
        var stopwatch = PerformanceMonitor.stopwatches[0];
        var totalTime = stopwatch.value;
        if(totalTime > 0) {
            fpsContent += "<strong>Total: " + totalTime + " ms</strong><br />";
            for(var i = 1; i < PerformanceMonitor.stopwatches.length; i++) {
                stopwatch = PerformanceMonitor.stopwatches[i];
                fpsContent += stopwatch.name + ": " + stopwatch.value + " ms";
                fpsContent += " (" + Math.round(100 * stopwatch.value / totalTime) + "%)<br />";
            }
        }
    }
    fpsContent += "<strong>" + PerformanceMonitor.fps.toFixed(1) + " FPS</strong>";
    jQuery("#fps").html(fpsContent);
};


PerformanceMonitor.now = function() {
    return performance.now();
};