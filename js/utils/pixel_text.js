function PixelText() {

    this.x = 0;
    this.y = 0;

    this.chars = [[]];

    this.alignment = Text.LEFT;

    this.pixelFont = PixelFonts.get("black");

    this.lineHeight = this.pixelFont.charHeight;

    this.maxLineWidth = 0;

}


PixelText.prototype.pos = function(x, y) {
    this.x = x;
    this.y = y;
};


PixelText.prototype.text = function(text) {
    this.chars = [[]];

    var currentLine = 0;
    var lineWidths = [0];
    var lastSpaceInLine = 0;

    for(var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i) - 32;

        if(this.maxLineWidth > 0 && lineWidths[currentLine] > this.maxLineWidth) {

            if(lastSpaceInLine > 0) {
                for(var j = lastSpaceInLine - 1; j < this.chars[currentLine].length; j++) {
                    lineWidths[currentLine] -= this.chars[currentLine][j].w;
                }
                var goBack = this.chars[currentLine].length - lastSpaceInLine;
                i -= goBack;
                this.chars[currentLine] = this.chars[currentLine].splice(0, lastSpaceInLine - 1);
            }
            while(text.charCodeAt(i) === 32 && i < text.length - 1) {
                i++;
            }
            this.chars.push([]);
            lineWidths.push(0);
            currentLine++;
            c = text.charCodeAt(i) - 32;
        }

        if(c === -22) {
            this.chars.push([]);
            lineWidths.push(0);
            currentLine++;
            lastSpaceInLine = 0;

        } else {
            var charWidth = this.pixelFont.charWidths[c] + this.pixelFont.charSpacing;
            this.chars[currentLine].push({
                char : c,
                w : charWidth,
                x : lineWidths[currentLine],
                y : (this.lineHeight * currentLine)
            });
            lineWidths[currentLine] += charWidth;
            if(c === 0) {
                lastSpaceInLine = this.chars[currentLine].length;
            }
        }
    }

    for(var currentLine = 0; currentLine < lineWidths.length; currentLine++) {
        if(lineWidths[currentLine] > this.pixelFont.charSpacing) {
            lineWidths[currentLine] -= this.pixelFont.charSpacing;
        }
        if(this.alignment === Text.CENTER) {
            var halfWidth = Math.round(lineWidths[currentLine] / 2);
            for(var i = 0; i < this.chars[currentLine].length; i++) {
                this.chars[currentLine][i].x -= halfWidth;
            }
        } else if(this.alignment === Text.RIGHT) {
            var lineWidth = lineWidths[currentLine];
            for(var i = 0; i < this.chars[currentLine].length; i++) {
                this.chars[currentLine][i].x -= lineWidth;
            }
        }
    }
};


PixelText.prototype.setFont = function(font) {
    this.pixelFont = fonts.get(font);
};


PixelText.prototype.setAlignment = function(alignment) {
    this.alignment = alignment;
};


PixelText.prototype.setLineHeight = function(lineHeight) {
    this.lineHeight = lineHeight;
};


PixelText.prototype.setMaxLineWidth = function(maxLineWidth) {
    this.maxLineWidth = maxLineWidth;
};


PixelText.prototype.draw = function() {
    c.save();
    c.translate(this.x, this.y);
    var h = this.pixelFont.charHeight;
    for(var line = 0; line < this.chars.length; line++) {
        for(var i = 0; i < this.chars[line].length; i++) {
            var char = this.chars[line][i];
            if(char.char > 0) {
                var sx = this.pixelFont.charOffsets[char.char] - 1;
                var w = char.w + 2;
                c.drawImage(this.pixelFont.file, sx, 0, w, h, char.x - 1, char.y, w, h);
            }
        }
    }
    c.restore();
};


PixelText.LEFT = -1;
PixelText.CENTER = 0;
PixelText.RIGHT = 1;