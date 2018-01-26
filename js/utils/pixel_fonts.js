function PixelFonts() {}


PixelFonts.fonts = {};


PixelFonts.create = function(name, file, minCharSpacingInFile, printCharSpacing, printSpaceWidth, glyphDetectionThresholds, manualSpacing) {

    var fileWidth = file.naturalWidth;
    var fileHeight = file.naturalHeight;

    var fontCanvas = document.createElement("canvas");
    fontCanvas.width = fileWidth;
    fontCanvas.height = fileHeight;

    var fontContext = fontCanvas.getContext("2d");
    fontContext.fillStyle = "rgb(" + PixelFonts.EMPTY_R + ", " + PixelFonts.EMPTY_G + ", " + PixelFonts.EMPTY_B + ")";
    fontContext.fillRect(0, 0, fileWidth, fileHeight);

    fontContext.drawImage(file, 0, 0);
    var fontContextData = fontContext.getImageData(0, 0, fileWidth, fileHeight);
    var data = fontContextData.data;

    PixelFonts.fonts[name] = {
        name : name,
        file : file,
        charSpacing : printCharSpacing,
        charOffsets : [0],
        charWidths : [printSpaceWidth],
        charHeight : fileHeight
    };

    var x = 0;

    for(var i = 1; i < 94; i++) {

        while(x < fileWidth && PixelFonts.columnIsEmpty(x, data, fileWidth, fileHeight)) {
            x++;
        }
        if(x === fileWidth) {
            var char = String.fromCharCode(i + 32);
            console.log("Couldn't find the glyph '" + char + "' for font '" + name + "'.");
        }
        var thisCharOffset = x;

        var emptyColumns = 0;
        while(emptyColumns < minCharSpacingInFile && x < fileWidth) {
            if(PixelFonts.columnIsEmpty(x, data, fileWidth, fileHeight)) {
                emptyColumns++;
            } else {
                emptyColumns = 0;
            }
            x++;
        }

        var thisCharWidth = x - minCharSpacingInFile - thisCharOffset;

        if(thisCharWidth < 0) {
            var char = String.fromCharCode(i + 32);
            console.log("The glyph for '" + char + "' in font '" + name + "' has a width of 0.");
        }

        PixelFonts.fonts[name].charOffsets.push(thisCharOffset);
        PixelFonts.fonts[name].charWidths.push(thisCharWidth);
    }

    var totalFillValue = 0;
    var filledColumns = 0;
    for(var i = 0; i < 100; i++) {
        var fillValue = PixelFonts.columnFillValue(i, data, fileWidth, fileHeight);
        if(fillValue > 0) {
            totalFillValue += fillValue;
            filledColumns++;
        }
    }
    var averageFillValue = totalFillValue / filledColumns;

    for(var i = 1; i < 94; i++) {
        var firstColumn = PixelFonts.fonts[name].charOffsets[i];
        var firstColumnFill = PixelFonts.columnFillValue(firstColumn, data, fileWidth, fileHeight);
        var lastColumn = PixelFonts.fonts[name].charOffsets[i] + PixelFonts.fonts[name].charWidths[i] - 1;
        var lastColumnFill = PixelFonts.columnFillValue(lastColumn, data, fileWidth, fileHeight);

        if(firstColumnFill < averageFillValue * glyphDetectionThresholds[0]) {
            PixelFonts.fonts[name].charOffsets[i]++;
            PixelFonts.fonts[name].charWidths[i]--;
        }
        if(firstColumnFill > averageFillValue * glyphDetectionThresholds[1]) {
            PixelFonts.fonts[name].charOffsets[i]--;
            PixelFonts.fonts[name].charWidths[i]++;
        }

        if(lastColumnFill < averageFillValue * glyphDetectionThresholds[0]) {
            PixelFonts.fonts[name].charWidths[i]--;
        }
        if(lastColumnFill > averageFillValue * glyphDetectionThresholds[1]) {
            PixelFonts.fonts[name].charWidths[i]++;
        }
    }

    for(var i = 0; i < manualSpacing.length; i++) {
        var c = manualSpacing[i].char.charCodeAt(0) - 32;
        if(manualSpacing[i].hasOwnProperty("left")) {
            PixelFonts.fonts[name].charOffsets[c] -= manualSpacing[i]["left"];
            PixelFonts.fonts[name].charWidths[c] += manualSpacing[i]["left"];
        }
        if(manualSpacing[i].hasOwnProperty("right")) {
            PixelFonts.fonts[name].charWidths[c] += manualSpacing[i]["right"];
        }
    }

};


PixelFonts.columnIsEmpty = function(column, data, fileWidth, fileHeight) {
    for(var i = 0; i < fileHeight; i++) {
        if(data[(4 * ((fileWidth * i) + column))] !== PixelFonts.EMPTY_R ||
            data[(4 * ((fileWidth * i) + column)) + 1] !== PixelFonts.EMPTY_G ||
            data[(4 * ((fileWidth * i) + column)) + 2] !== PixelFonts.EMPTY_B) {
            return false;
        }
    }
    return true;
};


PixelFonts.columnFillValue = function(column, data, fileWidth, fileHeight) {
    var fill = 0;
    for(var i = 0; i < fileHeight; i++) {
        var r = data[(4 * ((fileWidth * i) + column))];
        var g = data[(4 * ((fileWidth * i) + column)) + 1];
        var b = data[(4 * ((fileWidth * i) + column)) + 2];
        var fillR = Math.abs((r - PixelFonts.EMPTY_R) / 255);
        var fillG = Math.abs((g - PixelFonts.EMPTY_G) / 255);
        var fillB = Math.abs((b - PixelFonts.EMPTY_B) / 255);
        fill += fillR + fillG + fillB;
    }
    return (fill / (fileHeight * 3));
};


PixelFonts.get = function(name) {
    return PixelFonts.fonts[name];
};


PixelFonts.EMPTY_R = 0;
PixelFonts.EMPTY_G = 255;
PixelFonts.EMPTY_B = 0;