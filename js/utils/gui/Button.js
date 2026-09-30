import * as Mouse from "../../core/input/Mouse.js";
import * as Tooltip from "../../core/Tooltip.js";


class Button {


    constructor(options) {
        this.set(options);
    }


    set(options) {
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.w = options.w ?? 0;
        this.h = options.h ?? 0;
        this.clickCallback = options.click ?? null;
        this.drawCallback = options.draw ?? null;
        this.active = options.active ?? true;
        this.tooltip = options.tooltip ?? null;
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
        if (typeof optionsOrDrawFunction === "object") {
            this.set(optionsOrDrawFunction);
        }
        const isOver = Mouse.isOver(this.x, this.y, this.w, this.h);
        const down = isOver && Mouse.left.down;
        if (typeof optionsOrDrawFunction === "function") {
            optionsOrDrawFunction(this.x, this.y, this.w, this.h, isOver, down, this.active);
        } else if (this.drawCallback !== null) {
            this.drawCallback(this.x, this.y, this.w, this.h, isOver, down, this.active);
        }
        if (isOver && this.tooltip !== null) {
            Tooltip.set(this.tooltip);
        }
        Button.visibleButtonsInLastDrawCall.push(this);
    }


    checkClick() {
        if (Mouse.isOver(this.x, this.y, this.w, this.h) && this.clickCallback !== null && this.active) {
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
        for (let i = 0; i < Button.visibleButtonsInLastDrawCall.length; i++) {
            Button.visibleButtonsInLastDrawCall[i].checkClick();
        }
    }

}


Button.visibleButtonsInLastDrawCall = [];


export default Button;