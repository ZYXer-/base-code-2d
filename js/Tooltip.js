import { c } from "./core/canvas.js";
import * as Viewport from "./core/Viewport.js";
import * as Mouse from "./core/input/Mouse.js";
import * as Timer from "./core/Timer.js";
import Vec2 from "./utils/Vec2.js";


let show = false;
let content = null;
let dimensions = new Vec2();

let displayDelayCountdown = 0.0;

let overridePosition = null;

let painter = null;


export function setPainter(newPainter) {
    painter = newPainter;
}


export function reset() {
    show = false;
}


export function set(newContent) {

    if(painter) {

        show = true;
        overridePosition = null;

        if(content !== newContent) {
            content = newContent;

            dimensions = painter.insertNewContent(content);

            displayDelayCountdown = painter.DISPLAY_DELAY;
        }
    }
}


export function setOverridePosition(pos) {
    overridePosition = new Vec2(pos.x, pos.y);
}


export function draw() {

    if(painter && show) {

        if(displayDelayCountdown > 0.0) {
            displayDelayCountdown -= Timer.delta;

        } else {
            let pos = Mouse.pos.add(new Vec2(painter.DISTANCE_TO_MOUSE, painter.DISTANCE_TO_MOUSE));
            if(overridePosition !== null) {
                pos = overridePosition;
            }

            const maxX = pos.x + dimensions.width + painter.DISTANCE_TO_WINDOW_BORDER;
            if(maxX >= Viewport.width) {
                pos.x = Mouse.pos.x - (dimensions.width + painter.DISTANCE_TO_MOUSE);
            }

            const maxY = pos.y + dimensions.height + painter.DISTANCE_TO_WINDOW_BORDER;
            if(maxY >= Viewport.height) {
                pos.y = Mouse.pos.y - (dimensions.height + painter.DISTANCE_TO_MOUSE);
            }

            c.save();
            c.translate(pos.x, pos.y);

            painter.draw(content, dimensions);

            c.restore();

        }

    } else {
        content = null;
        displayDelayCountdown = 0.0;
    }

}


