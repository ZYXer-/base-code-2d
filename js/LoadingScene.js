import { c } from "./core/canvas.js";
import * as Viewport from "./core/Viewport.js";
import * as Img from "./core/Img.js";
import * as PreloadingManager from "./core/resourcePreloading/PreloadingManager.js";
import Text from "./utils/Text.js";


let percentage = 0;


export function show() {
    PreloadingManager.preload();
}


export function hide() {
}


export function update() {
    PreloadingManager.update();
    percentage = PreloadingManager.getPercentageLoaded();
}


export function draw() {
    let gradient = c.createLinearGradient(0, 0, 0, Viewport.height);
    gradient.addColorStop(0, "#111");
    gradient.addColorStop(1, "#333");

    c.fillStyle = gradient;
    c.fillRect(0, 0, Viewport.width, Viewport.height);

    if(Img.isLoaded("loading")) {
        Img.draw("loading", Viewport.centerX - 200, Viewport.centerY - 200);
    }

    c.fillStyle = "#666";
    c.fillRect(Viewport.centerX - 100, Viewport.height - 60, 200, 10);

    c.fillStyle = "#eee";
    c.fillRect(Viewport.centerX - 100, Viewport.height - 60, 200 * (percentage / 100.0), 10);

    Text.draw(Viewport.centerX, Viewport.height - 70, 16, "sans-serif", "center", "#eee", Math.ceil(percentage) + "%");
}