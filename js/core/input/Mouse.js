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

    document.addEventListener("contextmenu", event => {
        if (Settings.Game.PREVENT_CONTEXT_MENU) {
            event.preventDefault();
        }
    });

    document.body.setAttribute("unselectable", "on");
    document.body.style.userSelect = "none";
    document.body.addEventListener("selectstart", event => {
        event.preventDefault();
    });

    document.body.addEventListener("mousemove", event => {
        updatePosition(getPositionFromMouseEvent(event));
    });
    document.body.addEventListener("touchmove", event => {
        updatePosition(getPositionFromTouchEvent(event));
        event.preventDefault();
    }, { passive: false });
    document.body.addEventListener("mousedown", event => {
        updatePosition(getPositionFromMouseEvent(event));
        if (event.button === 0) {
            left.triggerDown();
        } else if (event.button === 1) {
            middle.triggerDown();
        } else if (event.button === 2) {
            right.triggerDown();
        }
        event.preventDefault();
    });
    document.body.addEventListener("touchstart", event => {
        left.triggerDown(getPositionFromTouchEvent(event));
        event.preventDefault();
    }, { passive: false });
    document.body.addEventListener("mouseup", event => {
        updatePosition(getPositionFromMouseEvent(event));
        if (event.button === 0) {
            left.triggerUp();
        } else if (event.button === 1) {
            middle.triggerUp();
        } else if (event.button === 2) {
            right.triggerUp();
        }
        event.preventDefault();
    });
    ["touchend", "touchleave", "touchcancel"].forEach(eventName => {
        document.body.addEventListener(eventName, event => {
            left.triggerUp(getPositionFromTouchEvent(event));
            event.preventDefault();
        }, { passive: false });
    });
    document.body.addEventListener("wheel", event => {
        triggerScroll(event);
    }, { passive: false });
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
    hoverAreas.set(name, { name, x, y, w, h, overCallback, outCallback, isOver: false });
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
    if (newPos !== null) {
        const rect = document.getElementById("game").getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        pos.x = ((ratio * (newPos.x - (rect.left + window.scrollX))) - Viewport.frameOffsetX) / Viewport.scaleX;
        pos.y = ((ratio * (newPos.y - (rect.top + window.scrollY))) - Viewport.frameOffsetY) / Viewport.scaleY;
    }
}


function updateHoverAreas() {
    for (const [name, area] of hoverAreas) {
        const isOver = isOver(area.x, area.y, area.w, area.h);
        if (isOver && !area.isOver) {
            area.overCallback();
            area.isOver = true;
        } else if (!isOver && area.isOver) {
            area.outCallback();
            area.isOver = false;
        }
    }
}


function getPositionFromMouseEvent(event) {
    return { x: event.pageX, y: event.pageY };
}


function getPositionFromTouchEvent(event) {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        return { x: touch.pageX, y: touch.pageY };
    } else {
        return null;
    }
}


function triggerScroll(event) {
    const delta = -event.deltaY;
    for (const [_, area] of scrollAreas) {
        if (isOver(area.x, area.y, area.w, area.h)) {
            area.callback(delta);
        }
    }
    for (const [_, callback] of scrollCallbacks) {
        callback.callback(delta);
    }
    event.preventDefault();
}