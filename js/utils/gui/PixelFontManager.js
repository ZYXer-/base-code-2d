const EMPTY_R = 0;
const EMPTY_G = 255;
const EMPTY_B = 0;


const fonts = new Map();


export function create(name, file, minCharSpacingInFile, printCharSpacing, printSpaceWidth, glyphDetectionThresholds, manualSpacing) {

    const fileWidth = file.naturalWidth;
    const fileHeight = file.naturalHeight;

    const fontCanvas = document.createElement("canvas");
    fontCanvas.width = fileWidth;
    fontCanvas.height = fileHeight;

    const fontContext = fontCanvas.getContext("2d");
    fontContext.fillStyle = "rgb(" + EMPTY_R + ", " + EMPTY_G + ", " + EMPTY_B + ")";
    fontContext.fillRect(0, 0, fileWidth, fileHeight);

    fontContext.drawImage(file, 0, 0);
    const fontContextData = fontContext.getImageData(0, 0, fileWidth, fileHeight);
    const data = fontContextData.data;

    const font = {
        name: name,
        file: file,
        charSpacing: printCharSpacing,
        charOffsets: [0],
        charWidths: [printSpaceWidth],
        charHeight: fileHeight
    };

    let x = 0;

    for (let i = 1; i < 94; i++) {

        while (x < fileWidth && columnIsEmpty(x, data, fileWidth, fileHeight)) {
            x++;
        }
        if (x === fileWidth) {
            const char = String.fromCharCode(i + 32);
            console.log("Couldn't find the glyph '" + char + "' for font '" + name + "'.");
        }
        const thisCharOffset = x;

        let emptyColumns = 0;
        while (emptyColumns < minCharSpacingInFile && x < fileWidth) {
            if (columnIsEmpty(x, data, fileWidth, fileHeight)) {
                emptyColumns++;
            } else {
                emptyColumns = 0;
            }
            x++;
        }

        const thisCharWidth = x - minCharSpacingInFile - thisCharOffset;

        if (thisCharWidth < 0) {
            const char = String.fromCharCode(i + 32);
            console.log("The glyph for '" + char + "' in font '" + name + "' has a width of 0.");
        }

        font.charOffsets.push(thisCharOffset);
        font.charWidths.push(thisCharWidth);
    }

    let totalFillValue = 0;
    let filledColumns = 0;
    for (let i = 0; i < 100; i++) {
        const fillValue = columnFillValue(i, data, fileWidth, fileHeight);
        if (fillValue > 0) {
            totalFillValue += fillValue;
            filledColumns++;
        }
    }
    const averageFillValue = totalFillValue / filledColumns;

    for (let i = 1; i < 94; i++) {
        const firstColumn = font.charOffsets[i];
        const firstColumnFill = columnFillValue(firstColumn, data, fileWidth, fileHeight);
        const lastColumn = font.charOffsets[i] + font.charWidths[i] - 1;
        const lastColumnFill = columnFillValue(lastColumn, data, fileWidth, fileHeight);

        if (firstColumnFill < averageFillValue * glyphDetectionThresholds[0]) {
            font.charOffsets[i]++;
            font.charWidths[i]--;
        }
        if (firstColumnFill > averageFillValue * glyphDetectionThresholds[1]) {
            font.charOffsets[i]--;
            font.charWidths[i]++;
        }

        if (lastColumnFill < averageFillValue * glyphDetectionThresholds[0]) {
            font.charWidths[i]--;
        }
        if (lastColumnFill > averageFillValue * glyphDetectionThresholds[1]) {
            font.charWidths[i]++;
        }
    }

    for (let i = 0; i < manualSpacing.length; i++) {
        const c = manualSpacing[i].char.charCodeAt(0) - 32;
        if (Object.hasOwn(manualSpacing[i], "left")) {
            font.charOffsets[c] -= manualSpacing[i]["left"];
            font.charWidths[c] += manualSpacing[i]["left"];
        }
        if (Object.hasOwn(manualSpacing[i], "right")) {
            font.charWidths[c] += manualSpacing[i]["right"];
        }
    }

    fonts.set(name, font);

}


export function get(name) {
    return fonts.get(name);
}


function columnIsEmpty(column, data, fileWidth, fileHeight) {
    for (let i = 0; i < fileHeight; i++) {
        if (data[(4 * ((fileWidth * i) + column))] !== EMPTY_R ||
            data[(4 * ((fileWidth * i) + column)) + 1] !== EMPTY_G ||
            data[(4 * ((fileWidth * i) + column)) + 2] !== EMPTY_B) {
            return false;
        }
    }
    return true;
}


function columnFillValue(column, data, fileWidth, fileHeight) {
    let fill = 0;
    for (let i = 0; i < fileHeight; i++) {
        const r = data[(4 * ((fileWidth * i) + column))];
        const g = data[(4 * ((fileWidth * i) + column)) + 1];
        const b = data[(4 * ((fileWidth * i) + column)) + 2];
        const fillR = Math.abs((r - EMPTY_R) / 255);
        const fillG = Math.abs((g - EMPTY_G) / 255);
        const fillB = Math.abs((b - EMPTY_B) / 255);
        fill += fillR + fillG + fillB;
    }
    return (fill / (fileHeight * 3));
}