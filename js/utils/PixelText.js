import { c } from "../core/canvas.js";
import * as PixelFontManager from "./PixelFontManager.js";


class PixelText {


    constructor() {

        this.x = 0;
        this.y = 0;

        this.chars = [[]];

        this.alignment = Text.LEFT;

        this.pixelFont = PixelFontManager.get("black");

        this.lineHeight = this.pixelFont.charHeight;

        this.maxLineWidth = 0;

    }


    pos(x, y) {
        this.x = x;
        this.y = y;
    }


    text(text) {
        this.chars = [[]];

        let currentLine = 0;
        let lineWidths = [0];
        let lastSpaceInLine = 0;

        for(let i = 0; i < text.length; i++) {
            let c = text.charCodeAt(i) - 32;

            if(this.maxLineWidth > 0 && lineWidths[currentLine] > this.maxLineWidth) {

                if(lastSpaceInLine > 0) {
                    for(let j = lastSpaceInLine - 1; j < this.chars[currentLine].length; j++) {
                        lineWidths[currentLine] -= this.chars[currentLine][j].w;
                    }
                    let goBack = this.chars[currentLine].length - lastSpaceInLine;
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
                let charWidth = this.pixelFont.charWidths[c] + this.pixelFont.charSpacing;
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

        for(let currentLine = 0; currentLine < lineWidths.length; currentLine++) {
            if(lineWidths[currentLine] > this.pixelFont.charSpacing) {
                lineWidths[currentLine] -= this.pixelFont.charSpacing;
            }
            if(this.alignment === Text.CENTER) {
                let halfWidth = Math.round(lineWidths[currentLine] / 2);
                for(let i = 0; i < this.chars[currentLine].length; i++) {
                    this.chars[currentLine][i].x -= halfWidth;
                }
            } else if(this.alignment === Text.RIGHT) {
                let lineWidth = lineWidths[currentLine];
                for(let i = 0; i < this.chars[currentLine].length; i++) {
                    this.chars[currentLine][i].x -= lineWidth;
                }
            }
        }
    }


    setFont(font) {
        this.pixelFont = PixelFont.get(font);
    }


    setAlignment(alignment) {
        this.alignment = alignment;
    }


    setLineHeight(lineHeight) {
        this.lineHeight = lineHeight;
    }


    setMaxLineWidth(maxLineWidth) {
        this.maxLineWidth = maxLineWidth;
    }


    draw() {
        c.save();
        c.translate(this.x, this.y);
        let h = this.pixelFont.charHeight;
        for(let line = 0; line < this.chars.length; line++) {
            for(let i = 0; i < this.chars[line].length; i++) {
                let char = this.chars[line][i];
                if(char.char > 0) {
                    let sx = this.pixelFont.charOffsets[char.char] - 1;
                    let w = char.w + 2;
                    c.drawImage(this.pixelFont.file, sx, 0, w, h, char.x - 1, char.y, w, h);
                }
            }
        }
        c.restore();
    }

}


PixelText.LEFT = -1;
PixelText.CENTER = 0;
PixelText.RIGHT = 1;


export default PixelText;