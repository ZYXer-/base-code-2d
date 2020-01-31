import * as Settings from "../../Settings.js";
import * as Viewport from "../Viewport.js";
import Vec2 from "../../utils/Vec2.js";
import MouseButton from "./MouseButton.js";


export const pos = new Vec2(0, 0);

export const left = new MouseButton();
export const middle = new MouseButton();
export const right = new MouseButton();


const hoverAreas = new Map();
const scrollAreas = new Map();
const scrollCallbacks = new Map();


function construct() {

    jQuery(document).bind("contextmenu", event => {
        if(Settings.Game.PREVENT_CONTEXT_MENU) {
            event.preventDefault();
        }
    });

    jQuery("body")
        .attr("unselectable", "on")
        .css("user-select", "none")
        .on("selectstart", false)

        .mousemove(event => {
            updatePosition(getPositionFromMouseEvent(event));
        })
        .bind("touchmove", event => {
            updatePosition(getPositionFromTouchEvent(event));
            event.preventDefault();
        })
        .mousedown(event => {
            updatePosition(getPositionFromMouseEvent(event));
            if(event.which === 1) {
                left.triggerDown();
            } else if(event.which === 2) {
                middle.triggerDown();
            } else if(event.which === 3) {
                right.triggerDown();
            }
            event.preventDefault();
        })
        .bind("touchstart", event => {
            left.triggerDown(getPositionFromTouchEvent(event));
            event.preventDefault();
        })
        .mouseup(event => {
            updatePosition(getPositionFromMouseEvent(event));
            if(event.which === 1) {
                left.triggerUp();
            } else if(event.which === 2) {
                middle.triggerUp();
            } else if(event.which === 3) {
                right.triggerUp();
            }
            event.preventDefault();
        })
        .bind("touchend touchleave touchcancel", event => {
            left.triggerUp(getPositionFromTouchEvent(event));
            event.preventDefault();
        })
        .on("mousewheel DOMMouseScroll", event => {
            triggerScroll(event);
        });
}
construct();


export function update() {
    left.update();
    middle.update();
    right.update();
    updateHoverAreas();
}


export function isOver(x, y, w, h) {
    return (pos.x >= x && pos.x < x + w && pos.y >= y && pos.y < y + h);
}


export function isOverCircle(x, y, r) {
    const deltaX = pos.x - x;
    const deltaY = pos.y - y;
    return (deltaX * deltaX) + (deltaY * deltaY) <= r * r;
}


export function registerHoverArea(name, x, y, w, h, overCallback, outCallback) {
    hoverAreas.set(name, { name, x, y, w, h, overCallback, outCallback, isOver : false });
}


export function deleteHoverArea(name) {
    hoverAreas.delete(name);
}


export function registerScrollArea(name, x, y, w, h, callback) {
    scrollAreas.set(name, { name, x, y, w, h, callback });
}


export function deleteScrollArea(name) {
    scrollAreas.delete(name);
}


export function registerScrollCallback(name, callback) {
    scrollCallbacks.set(name, {
        name,
        callback
    });
}


export function deleteScrollCallback(name) {
    scrollCallbacks.delete(name);
}


function updatePosition(newPos) {
    if(newPos !== null) {
        const offset = jQuery("#game").offset();
        const ratio = window.devicePixelRatio || 1;
        pos.x = ((ratio * (newPos.x - offset.left)) - Viewport.frameOffsetX) / Viewport.scaleX;
        pos.y = ((ratio * (newPos.y - offset.top)) - Viewport.frameOffsetY) / Viewport.scaleY;
    }
}


function updateHoverAreas() {
    for(let [name, area] of hoverAreas) {
        const isOver = isOver(area.x, area.y, area.w, area.h);
        if(isOver && !area.isOver) {
            area.overCallback();
            area.isOver = true;
        } else if(!isOver && area.isOver) {
            area.outCallback();
            area.isOver = false;
        }
    }
}


function getPositionFromMouseEvent(event) {
    return { x : event.pageX, y : event.pageY };
}


function getPositionFromTouchEvent(event) {
    if(event.originalEvent.touches.length > 0) {
        const touch = event.originalEvent.touches[0];
        return { x : touch.pageX, y : touch.pageY };
    } else {
        return null;
    }
}


function triggerScroll(event) {
    const delta = (event.originalEvent.detail === undefined ? event.originalEvent.wheelDelta : event.originalEvent.detail);
    for(let [_, area] of scrollAreas) {
        if(isOver(area.x, area.y, area.w, area.h)) {
            area.callback(delta);
        }
    }
    for(let [_, callback] of scrollCallbacks) {
        callback.callback(delta);
    }
    event.preventDefault();
}