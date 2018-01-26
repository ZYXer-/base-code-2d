function MouseButton() {

    this.downCallbacks = {};
    this.upCallbacks = {};
    this.downAreas = {};
    this.upAreas = {};
    this.draggableAreas = {};

    this.down = false;
    this.downPos = new Vec2(0, 0);

    this.dragging = false;
    this.lastDrag = new Vec2(0, 0);
    this.dragDelta = new Vec2(0, 0);
    this.draggingCallback = null;
    this.dropCallback = null;
}


MouseButton.prototype.triggerDown = function() {
    this.down = true;
    this.downPos = Mouse.pos.copy();

    var name;
    var area;
    for(name in this.draggableAreas) {
        area = this.draggableAreas[name];
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
    for(name in this.downCallbacks) {
        var callback = this.downCallbacks[name];
        callback.callback();
    }
    for(name in this.downAreas) {
        area = this.downAreas[name];
        if(Mouse.isOver(area.x, area.y, area.w, area.h)) {
            area.callback();
        }
    }
};


MouseButton.prototype.triggerUp = function() {
    this.down = false;

    if(this.dragging) {
        this.dragging = false;
        if(this.dropCallback !== null) {
            this.dropCallback();
        }
    } else {
        var name;
        for(name in this.upCallbacks) {
            var callback = this.upCallbacks[name];
            callback.callback();
        }
        for(name in this.upAreas) {
            var area = this.upAreas[name];
            if(Mouse.isOver(area.x, area.y, area.w, area.h)) {
                area.callback();
            }
        }
    }
};


MouseButton.prototype.update = function() {
    if(this.dragging) {
        this.dragDelta = Mouse.pos.subtract(this.lastDrag);
        this.lastDrag = Mouse.pos.copy();
        if(this.draggingCallback !== null) {
            this.draggingCallback();
        }
    } else {
        this.dragDelta = new Vec2(0, 0);
    }
};


MouseButton.prototype.registerDownCallback = function(name, callback) {
    this.downCallbacks[name] = {
        name : name,
        callback : callback
    };
};


MouseButton.prototype.deleteDownCallback = function(name) {
    if(this.downCallbacks.hasOwnProperty(name)) {
        delete this.downCallbacks[name];
    }
};


MouseButton.prototype.registerUpCallback = function(name, callback) {
    this.upCallbacks[name] = {
        name : name,
        callback : callback
    };
};


MouseButton.prototype.deleteUpCallback = function(name) {
    if(this.upCallbacks.hasOwnProperty(name)) {
        delete this.upCallbacks[name];
    }
};


MouseButton.prototype.registerDownArea = function(name, x, y, w, h, callback) {
    this.downAreas[name] = {
        name : name,
        x : x,
        y : y,
        w : w,
        h : h,
        callback : callback
    };
};


MouseButton.prototype.deleteDownArea = function(name) {
    if(this.downAreas.hasOwnProperty(name)) {
        delete this.downAreas[name];
    }
};


MouseButton.prototype.registerUpArea = function(name, x, y, w, h, callback) {
    this.upAreas[name] = {
        name : name,
        x : x,
        y : y,
        w : w,
        h : h,
        callback : callback
    };
};


MouseButton.prototype.deleteUpArea = function(name) {
    if(this.upAreas.hasOwnProperty(name)) {
        delete this.upAreas[name];
    }
};


MouseButton.prototype.registerDraggableArea = function(name, x, y, w, h, downCallback, draggingCallback, dropCallback) {
    this.draggableAreas[name] = {
        name : name,
        x : x,
        y : y,
        w : w,
        h : h,
        downCallback : downCallback,
        draggingCallback : draggingCallback,
        dropCallback : dropCallback
    };
};


MouseButton.prototype.deleteDraggableArea = function(name) {
    if(this.draggableAreas.hasOwnProperty(name)) {
        delete this.draggableAreas[name];
    }
};


MouseButton.prototype.startDragging = function(draggingCallback, dropCallback) {
    this.dragging = true;
    this.lastDrag = Mouse.pos.copy();
    this.dragDelta = new Vec2(0, 0);

    this.draggingCallback = draggingCallback;
    this.dropCallback = dropCallback;
};