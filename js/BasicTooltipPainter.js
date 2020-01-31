import Vec2 from "./utils/Vec2.js";
import Text from "./utils/Text.js";
import { c } from "./core/canvas.js";


export const DISTANCE_TO_MOUSE = 10;
export const DISTANCE_TO_WINDOW_BORDER = 20;
export const DISPLAY_DELAY = 0;

const HORIZONTAL_PADDING = 8;
const VERTICAL_PADDING = 6;


let textDrawable = null;


export function insertNewContent(content) {

    if(textDrawable === null) {
        initTextDrawable();
    }

    textDrawable.setText(content);
    let width = textDrawable.getWidth();
    let height = textDrawable.getHeight();

    width += 2 * HORIZONTAL_PADDING;
    height += 2 * VERTICAL_PADDING;

    return new Vec2(width, height);
}


export function draw(content, dimensions) {

    c.fillStyle = "#fff";
    c.fillRect(0, 0, dimensions.x, dimensions.y);

    c.strokeStyle = "#000";
    c.lineWidth = 1;
    c.strokeRect(-0.5, -0.5, dimensions.x + 1, dimensions.y + 1);

    c.translate(HORIZONTAL_PADDING, VERTICAL_PADDING);

    textDrawable.draw();
}


function initTextDrawable() {
    textDrawable = new Text({
        x : 0,
        y : 12, // set as distance from top of character to baseline
        size : 14,
        font : "opensans",
        align : "left",
        color : "#000",
        maxWidth : 150,
        lineHeight : 16
    });
}