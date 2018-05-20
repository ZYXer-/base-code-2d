function Tooltip() {}


Tooltip.VERTICAL_PADDING = 6;
Tooltip.HORIZONTAL_PADDING = 8;
Tooltip.DISTANCE_TO_MOUSE = 10;
Tooltip.DISTANCE_TO_WINDOW_BORDER = 20;

Tooltip.show = false;
Tooltip.text = "";

Tooltip.textDrawable = null;
Tooltip.width = 0;
Tooltip.height = 0;


Tooltip.reset = function() {
    Tooltip.show = false;
};


Tooltip.initTextDrawable = function() {
    Tooltip.textDrawable = new Text({
        x : 0,
        y : 12, // set as distance from top of character to baseline
        size : 14,
        font : "opensans",
        align : "left",
        color : "#000",
        maxWidth : 150,
        lineHeight : 16
    });
};


Tooltip.set = function(text) {
    if(!Tooltip.show || Tooltip.text !== text.trim()) {

        Tooltip.show = true;
        Tooltip.text = text.trim();

        if(Tooltip.textDrawable === null) {
            Tooltip.initTextDrawable();
        }

        Tooltip.textDrawable.setText(Tooltip.text);
        Tooltip.width = Tooltip.textDrawable.getWidth();
        Tooltip.height = Tooltip.textDrawable.getHeight();

        Tooltip.width += 2 * Tooltip.HORIZONTAL_PADDING;
        Tooltip.height += 2 * Tooltip.VERTICAL_PADDING;
    }
};


Tooltip.draw = function() {

    if(Tooltip.show) {

        var pos = Mouse.pos.add(new Vec2(Tooltip.DISTANCE_TO_MOUSE, Tooltip.DISTANCE_TO_MOUSE));
        if(pos.x + Tooltip.width + Tooltip.DISTANCE_TO_WINDOW_BORDER >= Game.width) {
            pos.x = Mouse.pos.x - (Tooltip.width + Tooltip.DISTANCE_TO_MOUSE);
        }
        if(pos.y + Tooltip.height + Tooltip.DISTANCE_TO_WINDOW_BORDER >= Game.height) {
            pos.y = Mouse.pos.y - (Tooltip.height + Tooltip.DISTANCE_TO_MOUSE);
        }

        c.save();
        c.translate(pos.x, pos.y);

        c.fillStyle = "#fff";
        c.fillRect(0, 0, Tooltip.width, Tooltip.height);

        c.strokeStyle = "#000";
        c.lineWidth = 1;
        c.strokeRect(-0.5, -0.5, Tooltip.width + 1, Tooltip.height + 1);

        c.translate(Tooltip.HORIZONTAL_PADDING, Tooltip.VERTICAL_PADDING);

        Tooltip.textDrawable.draw();

        c.restore();
    }

};