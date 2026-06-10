import * as Img from "../core/Img.js";
import * as Utils from "./Utils.js";
import * as DataUtils from "./DataUtils.js";
import Color from "./Color.js";


export function readData(image, width, height) {

    const readCanvas = Utils.createCanvas(width, height);
    const readContext = Utils.getContext(readCanvas);
    readContext.drawImage(Img.get(image), 0, 0);
    const readData = readContext.getImageData(0, 0, width, height).data;

    const data = DataUtils.createMatrix(width, height, [ 0, 0, 0, 0 ]);
    let i;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            data[x][y] = [ readData[i], readData[i + 1], readData[i + 2], readData[i + 3] ];
        }
    }

    return data;
}


export function readMatrix(image, width, height, defaultValue, colorAllocation) {

    const data = readData(image, width, height);
    const matrix = DataUtils.createMatrix(width, height, defaultValue);
    let hexColor;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            hexColor = Color.fromArray(data[x][y]).toHex();
            if (Object.hasOwn(colorAllocation, hexColor)) {
                matrix[x][y] = colorAllocation[hexColor];
            }
        }
    }

    return matrix;
}


export function replaceColors(source, target, colorMap) {

    let rgb;
    for (const sourceColor in colorMap) {
        rgb = Color.fromHex(colorMap[sourceColor]);
        colorMap[sourceColor] = rgb;
    }

    const sourceImage = Img.get(source);
    const width = sourceImage.width;
    const height = sourceImage.height;
    const sourceCanvas = Utils.createCanvas(width, height);
    const sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    const imageData = sourceC.getImageData(0, 0, width, height);
    const data = imageData.data;

    let i;
    let hexColor;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            hexColor = Color.fromRGB(data[i], data[i + 1], data[i + 2]).toHex();
            if (Object.hasOwn(colorMap, hexColor)) {
                rgb = colorMap[hexColor];
                data[i] = rgb.r;
                data[i + 1] = rgb.g;
                data[i + 2] = rgb.b;
            }
        }
    }

    const targetCanvas = Utils.createCanvas(width, height);
    const targetC = Utils.getContext(targetCanvas);
    targetC.putImageData(imageData, 0, 0);

    Img.add(target, targetCanvas);
}


export function replaceColorsWithImageMap(source, target, imageMap, column) {

    const mapImage = Img.get(imageMap);
    const mapImageCanvas = Utils.createCanvas(mapImage.width, mapImage.height);
    const mapImageC = Utils.getContext(mapImageCanvas);
    mapImageC.drawImage(mapImage, 0, 0);
    const data = mapImageC.getImageData(0, 0, mapImage.width, mapImage.height).data;

    const colorMap = {};

    for (let y = 0; y < mapImage.height; y++) {
        let i = y * mapImage.width * 4;
        const sourceColor = Color.fromRGB(data[i], data[i + 1], data[i + 2]).toHex();
        i += column * 4;
        const targetColor = Color.fromRGB(data[i], data[i + 1], data[i + 2]).toHex();
        colorMap[sourceColor] = targetColor;
    }

    return replaceColors(source, target, colorMap);
}


export function removeSemitransparent(source, target) {

    const sourceImage = Img.get(source);
    const width = sourceImage.width;
    const height = sourceImage.height;
    const sourceCanvas = Utils.createCanvas(width, height);
    const sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    const imageData = sourceC.getImageData(0, 0, width, height);
    const data = imageData.data;

    let i;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            if (data[i + 3] > 0 && data[i + 3] < 255) {
                data[i + 3] = 0;
            }
        }
    }

    const targetCanvas = Utils.createCanvas(width, height);
    const targetC = Utils.getContext(targetCanvas);
    targetC.putImageData(imageData, 0, 0);

    Img.add(target, targetCanvas);
}


export function setOpacity(source, target, opacity) {

    const sourceImage = Img.get(source);
    const width = sourceImage.width;
    const height = sourceImage.height;
    const sourceCanvas = Utils.createCanvas(width, height);
    const sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    const imageData = sourceC.getImageData(0, 0, width, height);
    const data = imageData.data;

    let i;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            data[i + 3] = Math.round(data[i + 3] * opacity);
        }
    }

    const targetCanvas = Utils.createCanvas(width, height);
    const targetC = Utils.getContext(targetCanvas);
    targetC.putImageData(imageData, 0, 0);

    Img.add(target, targetCanvas);
}


export function pixelate(source, target, scale) {

    const sourceImage = Img.get(source);
    const width = sourceImage.width;
    const height = sourceImage.height;
    const sourceCanvas = Utils.createCanvas(width, height);
    const sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    const data = sourceC.getImageData(0, 0, width, height).data;

    const targetCanvas = Utils.createCanvas(width * scale, height * scale);
    const targetC = Utils.getContext(targetCanvas);
    const targetImageData = targetC.getImageData(0, 0, width * scale, height * scale);
    const targetData = targetImageData.data;

    let i;
    let j;
    let r;
    let g;
    let b;
    let a;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];
            a = data[i + 3];
            for (let x2 = x * scale; x2 < (x + 1) * scale; x2++) {
                for (let y2 = y * scale; y2 < (y + 1) * scale; y2++) {
                    j = ((y2 * width * scale) + x2) * 4;
                    targetData[j] = r;
                    targetData[j + 1] = g;
                    targetData[j + 2] = b;
                    targetData[j + 3] = a;
                }
            }
        }
    }

    targetC.putImageData(targetImageData, 0, 0);
    Img.add(target, targetCanvas);
}


export function isometricProjection(source, target, tileSize, scale, side) {
    // scale should be an even number.
    // side can be "top", "left" or "right"

    const sourceImage = Img.get(source);
    const width = sourceImage.width;
    const height = sourceImage.height;
    const sourceCanvas = Utils.createCanvas(width, height);
    const sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    const data = sourceC.getImageData(0, 0, width, height).data;

    const tilesX = width / tileSize;
    const tilesY = height / tileSize;

    let targetWidth = width * scale;
    let targetHeight = height * scale;
    if (side === "top") {
        targetWidth *= 2;
    } else {
        targetHeight *= 1.5;
    }

    const targetCanvas = Utils.createCanvas(targetWidth, targetHeight);
    const targetC = Utils.getContext(targetCanvas);
    const targetImageData = targetC.getImageData(0, 0, targetWidth, targetHeight);
    const targetData = targetImageData.data;

    for (let tileX = 0; tileX < tilesX; tileX++) {
        for (let tileY = 0; tileY < tilesY; tileY++) {
            for (let x = 0; x < tileSize; x++) {
                for (let y = 0; y < tileSize; y++) {
                    let i = ((tileY * tileSize) + y) * width;
                    i += (tileX * tileSize) + x;
                    i *= 4;
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];

                    if (side === "top") {
                        const midX = ((tileX * tileSize * 2) + tileSize + x - y) * scale;
                        const midY = ((tileY * tileSize * 2) + x + y + 1) * scale / 2;
                        for (let cX = -scale; cX < scale; cX++) {
                            for (let cY = -(scale / 2); cY < (scale / 2); cY++) {
                                const ci = (midX + cX + ((midY + cY) * width * scale * 2)) * 4;
                                if (Math.abs(cX + 0.5) + (2 * Math.abs(cY + 0.5)) <= scale) {
                                    targetData[ci] = r;
                                    targetData[ci + 1] = g;
                                    targetData[ci + 2] = b;
                                    targetData[ci + 3] = a;
                                }
                            }
                        }

                    } else if (side === "left") {
                        const cornerX = ((tileX * tileSize) + x) * scale;
                        const cornerY = ((tileY * tileSize * 1.5) + y + (x * 0.5)) * scale;
                        for (let cX = 0; cX < scale; cX++) {
                            for (let cY = 0; cY < scale; cY++) {
                                const ci = (cornerX + cX + ((cornerY + cY + Math.ceil(cX / 2)) * width * scale)) * 4;
                                targetData[ci] = r;
                                targetData[ci + 1] = g;
                                targetData[ci + 2] = b;
                                targetData[ci + 3] = a;
                            }
                        }

                    } else if (side === "right") {
                        const cornerX = ((tileX * tileSize) + x) * scale;
                        const cornerY = ((tileY * tileSize * 1.5) + (tileSize * 0.5) + y - (x * 0.5)) * scale;
                        for (let cX = 0; cX < scale; cX++) {
                            for (let cY = 0; cY < scale; cY++) {
                                const ci = (cornerX + cX + ((cornerY + cY - Math.ceil(cX / 2)) * width * scale)) * 4;
                                targetData[ci] = r;
                                targetData[ci + 1] = g;
                                targetData[ci + 2] = b;
                                targetData[ci + 3] = a;
                            }
                        }
                    }
                }
            }
        }
    }

    targetC.putImageData(targetImageData, 0, 0);
    Img.add(target, targetCanvas);
}


export function outputImage(name) {
    const oImage = Img.get(name);
    const outputCanvas = Utils.createCanvas(oImage.width, oImage.height);
    const context = Utils.getContext(outputCanvas);
    context.drawImage(oImage, 0, 0);

    const image = new Image();
    image.src = outputCanvas.toDataURL("image/png");
    document.body.appendChild(image);
}
