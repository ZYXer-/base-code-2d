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

    this.borderWidth = 0;
    if(options.hasOwnProperty("borderWidth")) {
        this.borderWidth = options.borderWidth;
    }

    this.borderColor = "#000";
    if(options.hasOwnProperty("borderColor")) {
        this.borderColor = options.borderColor;
    }

    this.borderLineJoin = "round";
    if(options.hasOwnProperty("borderLineJoin")) {
        this.borderLineJoin = options.borderLineJoin;
    }

    this.monospaced = -1;
    if(options.hasOwnProperty("monospaced")) {
        this.monospaced = options.monospaced;
    }

    this.lines = [""];
    this.showLines = [""];
    this.appearPos = 0;
    this.appearChar = 0;
    this.appearLine = 0;
    this.finishedAppearing = true;

    this.maxWidth = 0;
    if(options.hasOwnProperty("maxWidth")) {
        this.maxWidth = options.maxWidth;
    }

    this.lineHeight = 0;
    if(options.hasOwnProperty("lineHeight")) {
        this.lineHeight = options.lineHeight;
    } else if(options.hasOwnProperty("size")) {
        this.lineHeight = options.size;
    }

    this.verticalAlign = "top";
    if(options.hasOwnProperty("verticalAlign")) {
        this.verticalAlign = options.verticalAlign;
    }

    this.letterSpacing = 0;
    if(options.hasOwnProperty("letterSpacing")) {
        this.letterSpacing = options.letterSpacing;
    }

    this.appearCharPerSec = 0;
    if(options.hasOwnProperty("appearCharPerSec")) {
        this.appearCharPerSec = options.appearCharPerSec;
    }

    this.text = "";
    if(options.hasOwnProperty("text")) {
        this.setText(options.text);
    }
}


Text.prototype.setPos = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
};


Text.prototype.setSize = function(size) {
    this.size = size;
    if(this.lineHeight === 0) {
        this.lineHeight = size;
    }
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


Text.prototype.setBorder = function(borderWidth, borderColor, borderLineJoin) {
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.borderLineJoin = borderLineJoin;
};


Text.prototype.setText = function(text) {
    if(this.appearCharPerSec !== 0 && this.text !== text) {
        this.resetAppear();
    }
    this.text = text;
    this.applyMultiline();
    return this;
};


Text.prototype.measureWidth = function(text) {
    c.font = this.size + "px \"" + this.font + "\"";
    return c.measureText(text).width + (this.letterSpacing * (text.length - 1));
};


Text.prototype.getWidth = function() {
    var max = 0;
    for(var i = 0; i < this.lines.length; i++) {
        var lineWidth = this.measureWidth(this.lines[i]);
        if(max < lineWidth) {
            max = lineWidth;
        }
    }
    return max;
};


Text.prototype.getNumOfLines = function() {
    if(this.lines.length === 0) {
        this.applyMultiline();
    }
    return this.lines.length;
};


Text.prototype.getHeight = function() {
    return this.getNumOfLines() * this.lineHeight;
};


Text.prototype.multiline = function(maxWidth, lineHeight, verticalAlign) {
    this.maxWidth = maxWidth;
    this.lineHeight = lineHeight;
    this.verticalAlign = verticalAlign;
    return this;
};


Text.prototype.applyMultiline = function() {
    if(this.maxWidth === 0) {
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
                if(currentLine !== "") {
                    testLine += " ";
                }
                testLine += words[partI];
                if(currentLine === "" || c.measureText(testLine).width <= this.maxWidth) {
                    currentLine = testLine;
                } else {
                    this.lines.push(currentLine);
                    currentLine = words[partI];
                }
            }
            if(currentLine !== "" || tempLineI < tempLines.length) {
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
    if(this.lines.length === 0) {
        this.applyMultiline();
    }
    if(!this.finishedAppearing) {
        this.updateAppear();
    }
    c.fillStyle = this.color;
    c.font = this.size + "px \"" + this.font + "\"";
    if(this.letterSpacing === 0) {
        c.textAlign = this.align;
    } else {
        c.textAlign = "left";
    }

    if(this.borderWidth > 0) {
        c.lineWidth = this.borderWidth * 2;
        c.strokeStyle = this.borderColor;
        c.lineJoin = this.borderLineJoin;
        this.drawLines(true);
        c.lineJoin = "miter";
    }

    this.drawLines(false);
};


Text.prototype.drawLines = function(drawBorder) {
    var y = 0;
    if(this.verticalAlign === "bottom") {
        y -= this.lineHeight * (this.lines.length - 1);
    } else if(this.verticalAlign === "center") {
        y -= this.lineHeight * 0.5 * (this.lines.length - 1);
    }
    if(this.finishedAppearing) {
        for(var i = 0; i < this.lines.length; i++) {
            this.drawLine(this.lines[i], this.lines[i], this.x, this.y + y, drawBorder);
            y += this.lineHeight;
        }
    } else {
        for(var i = 0; i < this.showLines.length; i++) {
            this.drawLine(this.showLines[i], this.lines[i], this.x, this.y + y, drawBorder);
            y += this.lineHeight;
        }
    }
};


Text.prototype.drawLine = function(line, fullLine, x, y, drawBorder) {
    if(this.letterSpacing === 0 && this.monospaced === -1) {
        if(this.finishedAppearing || this.align === "left") {
            if(drawBorder) {
                c.strokeText(line, x, y);
            } else {
                c.fillText(line, x, y);
            }
        } else {
            var appearOffset = this.measureWidth(fullLine) - this.measureWidth(line);
            if(this.align === "center") {
                appearOffset /= 2;
            }
            if(drawBorder) {
                c.strokeText(line, x - appearOffset, y);
            } else {
                c.fillText(line, x - appearOffset, y);
            }
        }
    } else {
        var offsetX = 0;
        var letterWidth;
        if(this.align === "center") {
            if(this.monospaced >= 0) {
                offsetX = -((this.monospaced + this.letterSpacing) * fullLine.length) / 2;
            } else {
                offsetX = -this.measureWidth(fullLine) / 2;
            }
        } else if(this.align === "right") {
            if(this.monospaced >= 0) {
                offsetX = -((this.monospaced + this.letterSpacing) * fullLine.length);
            } else {
                offsetX = -this.measureWidth(fullLine);
            }
        }
        for(var i = 0; i < line.length; i++) {
            letterWidth = this.measureWidth(line[i]);
            if(this.monospaced >= 0) {
                offsetX += (this.monospaced - letterWidth) * 0.5;
            }
            if(drawBorder) {
                c.strokeText(line[i], x + offsetX, y);
            } else {
                c.fillText(line[i], x + offsetX, y);
            }
            if(this.monospaced >= 0) {
                offsetX += ((this.monospaced - letterWidth) * -0.5) + this.monospaced + this.letterSpacing;
            } else {
                offsetX += letterWidth + this.letterSpacing;
            }
        }
    }
};


Text.prototype.drawPos = function(x, y) {
    this.setPos(x, y);
    this.draw();
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