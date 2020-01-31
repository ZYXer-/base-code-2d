import { c } from "./core/canvas.js";
import * as Game from "./core/Game.js";
import * as Viewport from "./core/Viewport.js";
import * as Tooltip from "./Tooltip.js";
import * as BasicTooltipPainter from "./BasicTooltipPainter.js"
import * as PauseScreen from "./PauseScreen.js";
import * as Mouse from "./core/input/Mouse.js";


export function show() {

    Tooltip.setPainter(BasicTooltipPainter);

    // do stuff before we update and draw this scene for the first time

}


export function hide() {

    // do stuff before we draw and update the next scene

}


export function resize() {

    // do stuff when window is resized

}


export function click() {

    // do stuff when left mouse button is clicked

}


export function update() {

    // reset tooltip content
    Tooltip.reset();

    // update stuff here

    if(!Game.paused) {

        // update stuff except when paused

    }
}


export function draw() {

    // clear scene
    c.fillStyle = "#fff";
    c.fillRect(0, 0, Viewport.width, Viewport.height);

    // draw stuff here

    // draw tooltip
    Tooltip.draw();

    // draw pause screen when paused
    PauseScreen.draw();
}