import { c } from "../core/canvas.js";
import * as Viewport from "../core/Viewport.js";
import * as Mouse from "../core/input/Mouse.js";
import * as DemoMenuScene from "./DemoMenuScene.js";
import * as Tooltip from "../Tooltip.js";
import * as BasicTooltipPainter from "../BasicTooltipPainter.js";
import Demo from "./Demo.js";
import Text from "../utils/Text.js";


let demo;
let backButton;


export function show() {

    Tooltip.setPainter(BasicTooltipPainter);

    demo = new Demo();
    demo.show();

    backButton = DemoMenuScene.getBackButton(DemoMenuScene);
}


export function hide() {
    demo.hide();
    demo = null;
}


export function resize() {
    demo.resize();
}


export function update() {
    demo.update();
}


export function draw() {

    // fill canvas with white background
    c.fillStyle = "#fff";
    c.fillRect(0, 0, Viewport.width, Viewport.height);


    demo.draw();

    // draw title
    Text.draw(Viewport.centerX, 50, 24, "opensans", "center", "#06C", "Old Demo");

    backButton.draw();

    // draw tooltip
    Tooltip.draw();
}


