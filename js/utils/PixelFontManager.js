const EMPTY_R = 0;
const EMPTY_G = 255;
const EMPTY_B = 0;


const fonts = new Map();


export function create(name, file, minCharSpacingInFile, printCharSpacing, printSpaceWidth, glyphDetectionThresholds, manualSpacing) {

    let fileWidth = file.naturalWidth;
    let fileHeight = file.naturalHeight;

    let fontCanvas = document.createElement("canvas");
    fontCanvas.width = fileWidth;
    fontCanvas.height = fileHeight;

    let fontContext = fontCanvas.getContext("2d");
    fontContext.fillStyle = "rgb(" + EMPTY_R + ", " + EMPTY_G + ", " + EMPTY_B + ")";
    fontContext.fillRect(0, 0, fileWidth, fileHeight);

    fontContext.drawImage(file, 0, 0);
    let fontContextData = fontContext.getImageData(0, 0, fileWidth, fileHeight);
    let data = fontContextData.data;

    let font = {
        name : name,
        file : file,
        charSpacing : printCharSpacing,
        charOffsets : [0],
        charWidths : [printSpaceWidth],
        charHeight : fileHeight
    };

    let x = 0;

    for(let i = 1; i < 94; i++) {

        while(x < fileWidth && columnIsEmpty(x, data, fileWidth, fileHeight)) {
            x++;
        }
        if(x === fileWidth) {
            let char = String.fromCharCode(i + 32);
            console.log("Couldn't find the glyph '" + char + "' for font '" + name + "'.");
        }
        let thisCharOffset = x;

        let emptyColumns = 0;
        while(emptyColumns < minCharSpacingInFile && x < fileWidth) {
            if(columnIsEmpty(x, data, fileWidth, fileHeight)) {
                emptyColumns++;
            } else {
                emptyColumns = 0;
            }
            x++;
        }

        let thisCharWidth = x - minCharSpacingInFile - thisCharOffset;

        if(thisCharWidth < 0) {
            let char = String.fromCharCode(i + 32);
            console.log("The glyph for '" + char + "' in font '" + name + "' has a width of 0.");
        }

        font.charOffsets.push(thisCharOffset);
        font.charWidths.push(thisCharWidth);
    }

    let totalFillValue = 0;
    let filledColumns = 0;
    for(let i = 0; i < 100; i++) {
        let fillValue = columnFillValue(i, data, fileWidth, fileHeight);
        if(fillValue > 0) {
            totalFillValue += fillValue;
            filledColumns++;
        }
    }
    let averageFillValue = totalFillValue / filledColumns;

    for(let i = 1; i < 94; i++) {
        let firstColumn = font.charOffsets[i];
        let firstColumnFill = columnFillValue(firstColumn, data, fileWidth, fileHeight);
        let lastColumn = font.charOffsets[i] + font.charWidths[i] - 1;
        let lastColumnFill = columnFillValue(lastColumn, data, fileWidth, fileHeight);

        if(firstColumnFill < averageFillValue * glyphDetectionThresholds[0]) {
            font.charOffsets[i]++;
            font.charWidths[i]--;
        }
        if(firstColumnFill > averageFillValue * glyphDetectionThresholds[1]) {
            font.charOffsets[i]--;
            font.charWidths[i]++;
        }

        if(lastColumnFill < averageFillValue * glyphDetectionThresholds[0]) {
            font.charWidths[i]--;
        }
        if(lastColumnFill > averageFillValue * glyphDetectionThresholds[1]) {
            font.charWidths[i]++;
        }
    }

    for(let i = 0; i < manualSpacing.length; i++) {
        let c = manualSpacing[i].char.charCodeAt(0) - 32;
        if(manualSpacing[i].hasOwnProperty("left")) {
            font.charOffsets[c] -= manualSpacing[i]["left"];
            font.charWidths[c] += manualSpacing[i]["left"];
        }
        if(manualSpacing[i].hasOwnProperty("right")) {
            font.charWidths[c] += manualSpacing[i]["right"];
        }
    }

    fonts.set(name, font);

}


export function get(name) {
    return fonts.get(name);
}


function columnIsEmpty(column, data, fileWidth, fileHeight) {
    for(let i = 0; i < fileHeight; i++) {
        if(data[(4 * ((fileWidth * i) + column))] !== EMPTY_R ||
            data[(4 * ((fileWidth * i) + column)) + 1] !== EMPTY_G ||
            data[(4 * ((fileWidth * i) + column)) + 2] !== EMPTY_B) {
            return false;
        }
    }
    return true;
}


function columnFillValue(column, data, fileWidth, fileHeight) {
    let fill = 0;
    for(let i = 0; i < fileHeight; i++) {
        let r = data[(4 * ((fileWidth * i) + column))];
        let g = data[(4 * ((fileWidth * i) + column)) + 1];
        let b = data[(4 * ((fileWidth * i) + column)) + 2];
        let fillR = Math.abs((r - EMPTY_R) / 255);
        let fillG = Math.abs((g - EMPTY_G) / 255);
        let fillB = Math.abs((b - EMPTY_B) / 255);
        fill += fillR + fillG + fillB;
    }
    return (fill / (fileHeight * 3));
}