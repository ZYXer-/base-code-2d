import { c } from "./core/canvas.js";
import * as Game from "./core/Game.js";
import * as Viewport from "./core/Viewport.js";
import Text from "./utils/Text.js";


export function draw() {

    if(Game.paused) {
        c.fillStyle = "rgba(0, 0, 0, 0.8)";
        c.fillRect(0, 0, Viewport.width, Viewport.height);
        Text.draw(Viewport.centerX, 100, 20, "opensans", "center", "#fff", "Paused - Press P to unpause");
    }

}