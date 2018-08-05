function Button(options) {
    this.set(options);
}


Button.prototype.set = function(options) {

    this.x = 0;
    if(options.hasOwnProperty("x")) {
        this.x = options.x;
    }

    this.y = 0;
    if(options.hasOwnProperty("y")) {
        this.y = options.y;
    }

    this.w = 0;
    if(options.hasOwnProperty("w")) {
        this.w = options.w;
    }

    this.h = 0;
    if(options.hasOwnProperty("h")) {
        this.h = options.h;
    }

    this.clickCallback = null;
    if(options.hasOwnProperty("click")) {
        this.clickCallback = options.click;
    }

    this.drawCallback = null;
    if(options.hasOwnProperty("draw")) {
        this.drawCallback = options.draw;
    }

    this.active = true;
    if(options.hasOwnProperty("active")) {
        this.active = options.active;
    }

    this.tooltip = null;
    if(options.hasOwnProperty("tooltip")) {
        this.tooltip = options.tooltip;
    }

};


Button.prototype.setPos = function(x, y) {
    this.x = x;
    this.y = y;
};


Button.prototype.setDimensions = function(w, h) {
    this.w = w;
    this.h = h;
};


Button.prototype.setClick = function(click) {
    this.clickCallback = click;
};


Button.prototype.setActive = function(active) {
    this.active = active;
};


Button.prototype.setTooltip = function(tooltip) {
    this.tooltip = tooltip;
};


Button.prototype.draw = function(optionsOrDrawFunction) {
    if(typeof optionsOrDrawFunction === "object") {
        this.set(optionsOrDrawFunction);
    }
    var isOver = Mouse.isOver(this.x, this.y, this.w, this.h);
    var down = isOver && Mouse.left.down;
    if(typeof optionsOrDrawFunction === "function") {
        optionsOrDrawFunction(this.x, this.y, this.w, this.h, isOver, down, this.active);
    } else if(this.drawCallback !== null) {
        this.drawCallback(this.x, this.y, this.w, this.h, isOver, down, this.active);
    }
    if(isOver && this.tooltip !== null) {
        Tooltip.set(this.tooltip);
    }
    Button.visibleButtonsInLastDrawCall.push(this);
};


Button.prototype.checkClick = function() {
    if(Mouse.isOver(this.x, this.y, this.w, this.h) && this.clickCallback !== null && this.active) {
        this.clickCallback();
    }
};


Button.visibleButtonsInLastDrawCall = [];


Button.init = function() {
    Mouse.left.registerUpCallback("_ButtonHandler", function() {
        Button.processClick();
    });
};


Button.reset = function() {
    Button.visibleButtonsInLastDrawCall = [];
};


Button.processClick = function() {
    for(var i = 0; i < Button.visibleButtonsInLastDrawCall.length; i++) {
        Button.visibleButtonsInLastDrawCall[i].checkClick();
    }
};