function Mouse() {}


Mouse.pos = new Vec2(0, 0);

Mouse.downAreas = {};
Mouse.upAreas = {};
Mouse.draggableAreas = {};
Mouse.wheelAreas = {};

Mouse.down = false;
Mouse.downPos = new Vec2(0, 0);

Mouse.dragging = false;
Mouse.lastDrag = new Vec2(0, 0);
Mouse.dragDelta = new Vec2(0, 0);
Mouse.draggingCallback = null;
Mouse.dropCallback = null;


Mouse.init = function() {

    jQuery("body")
        .attr("unselectable", "on")
        .css("user-select", "none")
        .on("selectstart", false)

        .mousemove(function(event) {

        Mouse.updatePosition(event);

    }).mousedown(function(event) {
        if(event.which == 1) {

            Mouse.down = true;
            Mouse.downPos = Mouse.pos.copy();
            Mouse.updatePosition(event);

            for(var name in Mouse.draggableAreas) {
                var area = Mouse.draggableAreas[name];
                if(Mouse.isOver(area.x, area.y, area.w, area.h)) {

                    Mouse.dragging = true;
                    Mouse.lastDrag = Mouse.pos.copy();
                    Mouse.dragDelta = new Vec2(0, 0);

                    Mouse.draggingCallback = area.draggingCallback;
                    Mouse.dropCallback = area.dropCallback;
                    if(area.downCallback != null) {
                        area.downCallback();
                    }
                }
            }

            for(var name in Mouse.downAreas) {
                var area = Mouse.downAreas[name];
                if(Mouse.isOver(area.x, area.y, area.w, area.h)) {
                    area.callback();
                }
            }
        }

    }).mouseup(function(event) {
        if(event.which == 1) {

            Mouse.down = false;
            Mouse.updatePosition(event);

            if(Mouse.dragging) {
                Mouse.dragging = false;
                if(Mouse.dropCallback != null) {
                    Mouse.dropCallback();
                }
            }

            for(var name in Mouse.upAreas) {
                var area = Mouse.upAreas[name];
                if(Mouse.isOver(area.x, area.y, area.w, area.h)) {
                    area.callback();
                }
            }
        }

    }).on("mousewheel DOMMouseScroll", function(e) {
        var delta = (e.originalEvent.detail == undefined ? e.originalEvent.wheelDelta : e.originalEvent.detail);
        for(var name in Mouse.wheelAreas) {
            var area = Mouse.wheelAreas[name];
            if(Mouse.isOver(area.x, area.y, area.w, area.h)) {
                area.callback(delta);
            }
        }
        e.preventDefault();
    });
};


Mouse.updatePosition = function(event) {
    var offset = jQuery("#game").offset();
    Mouse.pos.x = ((event.pageX - offset.left) - Game.frameOffsetX) / Game.scaleX;
    Mouse.pos.y = ((event.pageY - offset.top) - Game.frameOffsetY) / Game.scaleY;
};


Mouse.update = function() {
    if(Mouse.dragging) {
        Mouse.dragDelta = Mouse.pos.subtract(Mouse.lastDrag);
        Mouse.lastDrag = Mouse.pos.copy();
        if(Mouse.draggingCallback != null) {
            Mouse.draggingCallback();
        }
    } else {
        Mouse.dragDelta = new Vec2(0, 0);
    }
};


Mouse.isOver = function(x, y, w, h) {
    return (Mouse.pos.x >= x && Mouse.pos.x < x + w && Mouse.pos.y >= y && Mouse.pos.y < y + h);
};


Mouse.isOverCircle = function(x, y, r) {
    var deltaX = Mouse.pos.x - x;
    var deltaY = Mouse.pos.y - y;
    return (deltaX * deltaX) + (deltaY * deltaY) < r * r;
};


Mouse.registerDownArea = function(name, x, y, w, h, callback) {
    Mouse.downAreas[name] = {
        name : name,
        x : x,
        y : y,
        w : w,
        h : h,
        callback : callback
    };
};


Mouse.deleteDownArea = function(name) {
    if(Mouse.downAreas.hasOwnProperty(name)) {
        delete Mouse.downAreas[name];
    }
};


Mouse.registerUpArea = function(name, x, y, w, h, callback) {
    Mouse.upAreas[name] = {
        name : name,
        x : x,
        y : y,
        w : w,
        h : h,
        callback : callback
    };
};


Mouse.deleteUpArea = function(name) {
    if(Mouse.upAreas.hasOwnProperty(name)) {
        delete Mouse.upAreas[name];
    }
};


Mouse.registerWheelArea = function(name, x, y, w, h, callback) {
    Mouse.wheelAreas[name] = {
        name : name,
        x : x,
        y : y,
        w : w,
        h : h,
        callback : callback
    };
};


Mouse.deleteWheelArea = function(name) {
    if(Mouse.wheelAreas.hasOwnProperty(name)) {
        delete Mouse.wheelAreas[name];
    }
};


Mouse.registerDraggableArea = function(name, x, y, w, h, downCallback, draggingCallback, dropCallback) {
    Mouse.draggableAreas[name] = {
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


Mouse.deleteDraggableArea = function(name) {
    if(Mouse.draggableAreas.hasOwnProperty(name)) {
        delete Mouse.draggableAreas[name];
    }
};


Mouse.startDragging = function(draggingCallback, dropCallback) {

    Mouse.dragging = true;
    Mouse.lastDrag = Mouse.pos.copy();
    Mouse.dragDelta = new Vec2(0, 0);

    Mouse.draggingCallback = draggingCallback;
    Mouse.dropCallback = dropCallback;
};
