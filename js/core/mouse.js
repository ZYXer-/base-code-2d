function Mouse() {}


Mouse.pos = new Vec2(0, 0);

Mouse.left = null;
Mouse.middle = null;
Mouse.right = null;

Mouse.scrollAreas = {};
Mouse.scrollCallbacks = {};


Mouse.init = function() {

    Mouse.left = new MouseButton();
    Mouse.middle = new MouseButton();
    Mouse.right = new MouseButton();

    jQuery(document).bind("contextmenu", function(event) {
        if(Settings.Game.PREVENT_CONTEXT_MENU) {
            event.preventDefault();
        }
    });

    jQuery("body")
        .attr("unselectable", "on")
        .css("user-select", "none")
        .on("selectstart", false)

        .mousemove(function(event) {
            Mouse.updatePosition(Mouse.getPositionFromMouseEvent(event));
        })
        .bind("touchmove", function(event) {
            Mouse.updatePosition(Mouse.getPositionFromTouchEvent(event));
            event.preventDefault();
        })
        .mousedown(function(event) {
            Mouse.updatePosition(Mouse.getPositionFromMouseEvent(event));
            if(event.which === 1) {
                Mouse.left.triggerDown();
            } else if(event.which === 2) {
                Mouse.middle.triggerDown();
            } else if(event.which === 3) {
                Mouse.right.triggerDown();
            }
            event.preventDefault();
        })
        .bind("touchstart", function(event) {
            Mouse.left.triggerDown(Mouse.getPositionFromTouchEvent(event));
            event.preventDefault();
        })
        .mouseup(function(event) {
            Mouse.updatePosition(Mouse.getPositionFromMouseEvent(event));
            if(event.which === 1) {
                Mouse.left.triggerUp();
            } else if(event.which === 2) {
                Mouse.middle.triggerUp();
            } else if(event.which === 3) {
                Mouse.right.triggerUp();
            }
            event.preventDefault();
        })
        .bind("touchend touchleave touchcancel", function(event) {
            Mouse.left.triggerUp(Mouse.getPositionFromTouchEvent(event));
            event.preventDefault();
        })
        .on("mousewheel DOMMouseScroll", function(event) {
            Mouse.triggerScroll(event);
        });
};


Mouse.getPositionFromMouseEvent = function(event) {
    return { x : event.pageX, y : event.pageY };
};


Mouse.getPositionFromTouchEvent = function(event) {
    if(event.originalEvent.touches.length > 0) {
        var touch = event.originalEvent.touches[0];
        return { x : touch.pageX, y : touch.pageY };
    } else {
        return null;
    }
};


Mouse.triggerScroll = function(event) {
    var delta = (event.originalEvent.detail === undefined ? event.originalEvent.wheelDelta : event.originalEvent.detail);
    var name;
    for(name in Mouse.scrollAreas) {
        var area = Mouse.scrollAreas[name];
        if(Mouse.isOver(area.x, area.y, area.w, area.h)) {
            area.callback(delta);
        }
    }
    for(name in Mouse.scrollCallbacks) {
        Mouse.scrollCallbacks[name].callback(delta);
    }
    event.preventDefault();
};


Mouse.updatePosition = function(pos) {
    if(pos !== null) {
        var offset = jQuery("#game").offset();
        var ratio = window.devicePixelRatio || 1;
        Mouse.pos.x = ((ratio * (pos.x - offset.left)) - Game.frameOffsetX) / Game.scaleX;
        Mouse.pos.y = ((ratio * (pos.y - offset.top)) - Game.frameOffsetY) / Game.scaleY;
    }
};


Mouse.update = function() {
    Mouse.left.update();
    Mouse.middle.update();
    Mouse.right.update();
};


Mouse.isOver = function(x, y, w, h) {
    return (Mouse.pos.x >= x && Mouse.pos.x < x + w && Mouse.pos.y >= y && Mouse.pos.y < y + h);
};


Mouse.isOverCircle = function(x, y, r) {
    var deltaX = Mouse.pos.x - x;
    var deltaY = Mouse.pos.y - y;
    return (deltaX * deltaX) + (deltaY * deltaY) <= r * r;
};


Mouse.registerScrollCallback = function(name, callback) {
    this.scrollCallbacks[name] = {
        name : name,
        callback : callback
    };
};


Mouse.deleteScrollCallback = function(name) {
    if(this.scrollCallbacks.hasOwnProperty(name)) {
        delete this.scrollCallbacks[name];
    }
};


Mouse.registerScrollArea = function(name, x, y, w, h, callback) {
    Mouse.scrollAreas[name] = {
        name : name,
        x : x,
        y : y,
        w : w,
        h : h,
        callback : callback
    };
};


Mouse.deleteScrollArea = function(name) {
    if(Mouse.scrollAreas.hasOwnProperty(name)) {
        delete Mouse.scrollAreas[name];
    }
};
