import Vec2 from "../../utils/Vec2.js";
import * as Mouse from "./Mouse.js";


export default class MouseButton {


    constructor() {
        this.downCallbacks = new Map();
        this.upCallbacks = new Map();
        this.downAreas = new Map();
        this.upAreas = new Map();
        this.draggableAreas = new Map();

        this.down = false;
        this.downPos = new Vec2(0, 0);

        this.dragging = false;
        this.lastDrag = new Vec2(0, 0);
        this.dragDelta = new Vec2(0, 0);
        this.draggingCallback = null;
        this.dropCallback = null;
    }


    triggerDown() {
        this.down = true;
        this.downPos = Mouse.pos.copy();

        for(let [_, area] of this.draggableAreas) {
            if(Mouse.isOver(area.x, area.y, area.w, area.h)) {

                this.dragging = true;
                this.lastDrag = Mouse.pos.copy();
                this.dragDelta = new Vec2(0, 0);

                this.draggingCallback = area.draggingCallback;
                this.dropCallback = area.dropCallback;
                if(area.downCallback !== null) {
                    area.downCallback();
                }
            }
        }
        for(let [_, callback] of this.downCallbacks) {
            callback.callback();
        }
        for(let [_, area] of this.downAreas) {
            if(Mouse.isOver(area.x, area.y, area.w, area.h)) {
                area.callback();
            }
        }
    }


    triggerUp() {
        this.down = false;

        if(this.dragging) {
            this.dragging = false;
            if(this.dropCallback !== null) {
                this.dropCallback();
            }
        } else {
            for(let [_, callback] of this.upCallbacks) {
                callback.callback();
            }
            for(let [_, area] of this.upAreas) {
                if(Mouse.isOver(area.x, area.y, area.w, area.h)) {
                    area.callback();
                }
            }
        }
    }


    update() {
        if(this.dragging) {
            this.dragDelta = Mouse.pos.subtract(this.lastDrag);
            this.lastDrag = Mouse.pos.copy();
            if(this.draggingCallback !== null) {
                this.draggingCallback();
            }
        } else {
            this.dragDelta = new Vec2(0, 0);
        }
    }


    registerDownCallback(name, callback) {
        this.downCallbacks.set(name, { name, callback });
    }


    deleteDownCallback(name) {
        this.downCallbacks.delete(name);
    }


    registerUpCallback(name, callback) {
        this.upCallbacks.set(name, { name, callback });
    }


    deleteUpCallback(name) {
        this.upCallbacks.delete(name);
    }


    registerDownArea(name, x, y, w, h, callback) {
        this.downAreas.set(name, { name, x, y, w, h, callback });
    }


    deleteDownArea(name) {
        this.downAreas.delete(name);
    }


    registerUpArea(name, x, y, w, h, callback) {
        this.upAreas.set(name, { name, x, y, w, h, callback });
    }


    deleteUpArea(name) {
        this.upAreas.delete(name);
    }


    registerDraggableArea(name, x, y, w, h, downCallback, draggingCallback, dropCallback) {
        this.draggableAreas.set(name, { name, x, y, w, h, downCallback, draggingCallback, dropCallback });
    }


    deleteDraggableArea(name) {
        this.draggableAreas.delete(name);
    }


    startDragging(draggingCallback, dropCallback) {
        this.dragging = true;
        this.lastDrag = Mouse.pos.copy();
        this.dragDelta = new Vec2(0, 0);

        this.draggingCallback = draggingCallback;
        this.dropCallback = dropCallback;
    }

}