function Text(options) {

    this.x = 0;
    if(options.hasOwnProperty("x")) {
        this.x = options.x;
    }

    this.y = 0;
    if(options.hasOwnProperty("y")) {
        this.y = options.y;
    }

    this.size = 16;
    if(options.hasOwnProperty("size")) {
        this.size = options.size;
    }

    this.font = "";
    if(options.hasOwnProperty("font")) {
        this.font = options.font;
    }

    this.align = "left";
    if(options.hasOwnProperty("align")) {
        this.align = options.align;
    }

    this.color = "#000";
    if(options.hasOwnProperty("color")) {
        this.color = options.color;
    }

    this.text = "";
    if(options.hasOwnProperty("text")) {
        this.text = options.text;
    }

    this.maxWidth = 0;
    if(options.hasOwnProperty("maxWidth")) {
        this.maxWidth = options.maxWidth;
    }

    this.lineHeight = 0;
    if(options.hasOwnProperty("lineHeight")) {
        this.lineHeight = options.lineHeight;
    }

    this.verticalAlign = "top";
    if(options.hasOwnProperty("verticalAlign")) {
        this.verticalAlign = options.verticalAlign;
    }

    this.appearCharPerSec = 0;
    if(options.hasOwnProperty("appearCharPerSec")) {
        this.appearCharPerSec = options.appearCharPerSec;
    }

    this.lines = [""];
    this.showLines = [""];
    this.appearPos = 0;
    this.appearChar = 0;
    this.appearLine = 0;
    this.finishedAppearing = true;

}


Text.prototype.setPos = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
};


Text.prototype.setSize = function(size) {
    this.size = size;
    return this;
};


Text.prototype.setFont = function(font) {
    this.font = font;
    return this;
};


Text.prototype.setAlign = function(align) {
    this.align = align;
    return this;
};


Text.prototype.setColor = function(color) {
    this.color = color;
    return this;
};


Text.prototype.setText = function(text) {
    if(this.appearCharPerSec != 0 && this.text != text) {
        this.resetAppear();
    }
    this.text = text;
    this.applyMultiline();
    return this;
};


Text.prototype.getWidth = function(text) {
    c.font = this.size + "px \"" + this.font + "\"";
    return c.measureText(text).width;
};


Text.prototype.multiline = function(maxWidth, lineHeight, verticalAlign) {
    this.maxWidth = maxWidth;
    this.lineHeight = lineHeight;
    this.verticalAlign = verticalAlign;
    return this;
};


Text.prototype.applyMultiline = function() {
    if(this.maxWidth == 0) {
        this.lines = this.text.split("\n");

    } else {

        c.font = this.size + "px \"" + this.font + "\"";
        this.lines = [];

        var tempLines = this.text.split("\n");
        for(var tempLineI = 0; tempLineI < tempLines.length; tempLineI++) {
            var words = tempLines[tempLineI].split(" ");

            var currentLine = "";
            for(var partI = 0; partI < words.length; partI++) {
                var testLine = currentLine;
                if(currentLine != "") {
                    testLine += " ";
                }
                testLine += words[partI];
                if(currentLine == "" || c.measureText(testLine).width <= this.maxWidth) {
                    currentLine = testLine;
                } else {
                    this.lines.push(currentLine);
                    currentLine = words[partI];
                }
            }
            if(currentLine != "" || tempLineI < tempLines.length) {
                this.lines.push(currentLine);
            }
        }
    }
};


Text.prototype.resetAppear = function() {
    this.showLines = [""];
    this.appearPos = 0;
    this.appearChar = 0;
    this.appearLine = 0;
    this.finishedAppearing = false;
};


Text.prototype.updateAppear = function() {
    this.appearPos += Timer.delta * this.appearCharPerSec;
    while(this.appearPos > 1.0) {
        this.appearPos -= 1.0;
        this.appearChar++;
        while(this.appearChar > this.lines[this.appearLine].length) {
            this.appearLine++;
            this.appearChar = 1;
            if(this.appearLine >= this.lines.length) {
                this.finishedAppearing = true;
                return;
            } else {
                this.showLines.push("");
            }
        }
        this.showLines[this.appearLine] += this.lines[this.appearLine].substring(this.appearChar - 1, this.appearChar);
    }
};


Text.prototype.draw = function() {
    if(this.lines.length == 0) {
        this.applyMultiline();
    }
    if(!this.finishedAppearing) {
        this.updateAppear();
    }
    c.fillStyle = this.color;
    c.font = this.size + "px \"" + this.font + "\"";
    c.textAlign = this.align;

    var y = 0;
    if(this.verticalAlign == "bottom") {
        y -= this.lineHeight * (this.lines.length - 1);
    } else if(this.verticalAlign == "center") {
        y -= this.lineHeight * 0.5 * (this.lines.length - 1);
    }
    if(this.finishedAppearing) {
        for(var i = 0; i < this.lines.length; i++) {
            c.fillText(this.lines[i], this.x, this.y + y);
            y += this.lineHeight;
        }
    } else {
        for(var i = 0; i < this.showLines.length; i++) {
            c.fillText(this.showLines[i], this.x, this.y + y);
            y += this.lineHeight;
        }
    }
};


Text.prototype.drawText = function(text) {
    this.setText(text);
    this.draw();
};


Text.prototype.drawPosText = function(x, y, text) {
    this.setPos(x, y);
    this.setText(text);
    this.draw();
};


Text.draw = function(x, y, size, font, align, color, text) {
    (new Text({
        x : x,
        y : y,
        size : size,
        font : font,
        align : align,
        color : color,
        text : text
    })).draw();
};