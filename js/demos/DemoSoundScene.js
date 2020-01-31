import { c } from "../core/canvas.js";
import * as Viewport from "../core/Viewport.js";
import * as DemoMenuScene from "./DemoMenuScene.js";
import Text from "../utils/Text.js";


let backButton;


export function show() {
    backButton = DemoMenuScene.getBackButton(DemoMenuScene);
}


export function hide() {
}


export function resize() {
}


export function update() {
}


export function draw() {

    // fill canvas with white background
    c.fillStyle = "#fff";
    c.fillRect(0, 0, Viewport.width, Viewport.height);


    // draw title
    Text.draw(Viewport.centerX, 50, 24, "opensans", "center", "#06C", "Music and Sound Demo");

    backButton.draw();
}