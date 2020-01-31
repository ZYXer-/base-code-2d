import * as Mouse from "../core/input/Mouse.js";
import * as Tooltip from "../Tooltip.js";


class Button {


    constructor(options) {
        this.set(options);
    }


    set(options) {
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
    }


    setPos(x, y) {
        this.x = x;
        this.y = y;
    }


    setDimensions(w, h) {
        this.w = w;
        this.h = h;
    }


    setClick(click) {
        this.clickCallback = click;
    }


    setActive(active) {
        this.active = active;
    }


    setTooltip(tooltip) {
        this.tooltip = tooltip;
    }


    draw(optionsOrDrawFunction) {
        if(typeof optionsOrDrawFunction === "object") {
            this.set(optionsOrDrawFunction);
        }
        let isOver = Mouse.isOver(this.x, this.y, this.w, this.h);
        let down = isOver && Mouse.left.down;
        if(typeof optionsOrDrawFunction === "function") {
            optionsOrDrawFunction(this.x, this.y, this.w, this.h, isOver, down, this.active);
        } else if(this.drawCallback !== null) {
            this.drawCallback(this.x, this.y, this.w, this.h, isOver, down, this.active);
        }
        if(isOver && this.tooltip !== null) {
            Tooltip.set(this.tooltip);
        }
        Button.visibleButtonsInLastDrawCall.push(this);
    }


    checkClick() {
        if(Mouse.isOver(this.x, this.y, this.w, this.h) && this.clickCallback !== null && this.active) {
            this.clickCallback();
        }
    }


    static init() {
        Mouse.left.registerUpCallback("_ButtonHandler", function() {
            Button.processClick();
        });
    }


    static reset() {
        Button.visibleButtonsInLastDrawCall = [];
    }


    static processClick() {
        for(let i = 0; i < Button.visibleButtonsInLastDrawCall.length; i++) {
            Button.visibleButtonsInLastDrawCall[i].checkClick();
        }
    }
    
}


Button.visibleButtonsInLastDrawCall = [];


export default Button;