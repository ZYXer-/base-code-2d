import * as Settings from "../Settings.js";


const MEASUREMENT_TICK_INTERVAL = 20;

let lastTime = 0;
let fps = 0;

let measurementCountdown = 0;

const stopwatches = [];


function construct() {

    stopwatches[0] = { name : "total" };
    stopwatches[1] = { name : "update" };
    stopwatches[2] = { name : "draw" };

    if(Settings.Game.DEBUG) {

        lastTime = now();

        jQuery("#game_box").after("<div id=\"fps\"></div>");

        measurementCountdown = MEASUREMENT_TICK_INTERVAL;

        if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
            for(let i = 0; i < stopwatches.length; i++) {
                let stopwatch = stopwatches[i];
                stopwatch.timeTotal = 0.0;
                stopwatch.value = 0.0;
                stopwatch.lastTime = 0.0;
            }
        }
    }
}


export function startStopwatch(stopwatchId) {
    if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
        stopwatches[stopwatchId].lastTime = now();
    }
}


export function stopStopwatch(stopwatchId) {
    if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
        let stopwatch = stopwatches[stopwatchId];
        let time = now();
        if(time < stopwatch.lastTime) {
            stopwatch.lastTime -= 60000;
        }
        stopwatch.timeTotal += time - stopwatch.lastTime;
    }
}


export function update() {
    if(Settings.Game.DEBUG) {

        measurementCountdown--;
        if(measurementCountdown <= 0) {
            measurementCountdown = MEASUREMENT_TICK_INTERVAL;

            let time = now();
            if(time < lastTime) {
                lastTime -= 60000;
            }

            let delta = (time - lastTime);
            lastTime = time;

            if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
                for(let i = 0; i < stopwatches.length; i++) {
                    let stopwatch = stopwatches[i];
                    stopwatch.value = stopwatch.timeTotal / MEASUREMENT_TICK_INTERVAL;
                    stopwatch.timeTotal = 0.0;
                }
            }

            if(delta > 0) {
                fps = MEASUREMENT_TICK_INTERVAL * 1000 / delta;
                printFps();
            }
        }
    }
}


export function printFps() {
    let fpsContent = "";
    if(Settings.Game.SHOW_PERFORMANCE_DETAILS) {
        let stopwatch = stopwatches[0];
        let totalTime = stopwatch.value;
        if(totalTime > 0) {
            fpsContent += "<strong>Total: " + totalTime + " ms</strong><br />";
            for(let i = 1; i < stopwatches.length; i++) {
                stopwatch = stopwatches[i];
                fpsContent += stopwatch.name + ": " + stopwatch.value + " ms";
                fpsContent += " (" + Math.round(100 * stopwatch.value / totalTime) + "%)<br />";
            }
        }
    }
    fpsContent += "<strong>" + fps.toFixed(1) + " FPS</strong>";
    jQuery("#fps").html(fpsContent);
}


export function now() {
    return performance.now();
}


construct();