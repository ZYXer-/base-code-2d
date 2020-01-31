import * as Img from "../core/Img.js";
import * as Utils from "./Utils.js";
import Color from "./Color.js";


export function readData(image, width, height) {

    let readCanvas = Utils.createCanvas(width, height);
    let readContext = Utils.getContext(readCanvas);
    readContext.drawImage(Img.get(image), 0, 0);
    let readData = readContext.getImageData(0, 0, width, height).data;

    let data = Utils.createMatrix(width, height, [ 0, 0, 0, 0 ]);
    let i;

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            data[x][y] = [ readData[i], readData[i + 1], readData[i + 2], readData[i + 3] ];
        }
    }

    return data;
}


export function readMatrix(image, width, height, defaultValue, colorAllocation) {

    let data = readData(image, width, height);
    let matrix = Utils.createMatrix(width, height, defaultValue);
    let hexColor;

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            hexColor = Color.fromArray(data[x][y]).toHex();
            if(colorAllocation.hasOwnProperty(hexColor)) {
                matrix[x][y] = colorAllocation[hexColor];
            }
        }
    }

    return matrix;
}


export function replaceColors(source, target, colorMap) {

    let rgb;
    for(let sourceColor in colorMap) {
        rgb = Color.fromHex(colorMap[sourceColor]);
        colorMap[sourceColor] = rgb;
    }

    let sourceImage = Img.get(source);
    let width = sourceImage.width;
    let height = sourceImage.height;
    let sourceCanvas = Utils.createCanvas(width, height);
    let sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    let imageData = sourceC.getImageData(0, 0, width, height);
    let data = imageData.data;

    let i;
    let hexColor;

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            hexColor = Color.fromRGB(data[i], data[i + 1], data[i + 2]).toHex();
            if(colorMap.hasOwnProperty(hexColor)) {
                rgb = colorMap[hexColor];
                data[i] = rgb.r;
                data[i + 1] = rgb.g;
                data[i + 2] = rgb.b;
            }
        }
    }

    let targetCanvas = Utils.createCanvas(width, height);
    let targetC = Utils.getContext(targetCanvas);
    targetC.putImageData(imageData, 0, 0);

    Img.add(target, targetCanvas);
}


export function replaceColorsWithImageMap(source, target, imageMap, column) {

    let mapImage = Img.get(imageMap);
    let mapImageCanvas = Utils.createCanvas(mapImage.width, mapImage.height);
    let mapImageC = Utils.getContext(mapImageCanvas);
    mapImageC.drawImage(mapImage, 0, 0);
    let data = mapImageC.getImageData(0, 0, mapImage.width, mapImage.height).data;

    let colorMap = {};

    for(let y = 0; y < mapImage.height; y++) {
        let i = y * mapImage.width * 4;
        let sourceColor = Color.fromRGB(data[i], data[i + 1], data[i + 2]).toHex();
        i += column * 4;
        let targetColor = Color.fromRGB(data[i], data[i + 1], data[i + 2]).toHex();
        colorMap[sourceColor] = targetColor;
    }

    return replaceColors(source, target, colorMap);
}


export function removeSemitransparent(source, target) {

    let sourceImage = Img.get(source);
    let width = sourceImage.width;
    let height = sourceImage.height;
    let sourceCanvas = Utils.createCanvas(width, height);
    let sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    let imageData = sourceC.getImageData(0, 0, width, height);
    let data = imageData.data;

    let i;

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            if(data[i + 3] > 0 && data[i + 3] < 255) {
                data[i + 3] = 0;
            }
        }
    }

    let targetCanvas = Utils.createCanvas(width, height);
    let targetC = Utils.getContext(targetCanvas);
    targetC.putImageData(imageData, 0, 0);

    Img.add(target, targetCanvas);
}


export function setOpacity(source, target, opacity) {

    let sourceImage = Img.get(source);
    let width = sourceImage.width;
    let height = sourceImage.height;
    let sourceCanvas = Utils.createCanvas(width, height);
    let sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    let imageData = sourceC.getImageData(0, 0, width, height);
    let data = imageData.data;

    let i;

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            data[i + 3] = Math.round(data[i + 3] * opacity);
        }
    }

    let targetCanvas = Utils.createCanvas(width, height);
    let targetC = Utils.getContext(targetCanvas);
    targetC.putImageData(imageData, 0, 0);

    Img.add(target, targetCanvas);
}


export function pixelate(source, target, scale) {

    let sourceImage = Img.get(source);
    let width = sourceImage.width;
    let height = sourceImage.height;
    let sourceCanvas = Utils.createCanvas(width, height);
    let sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    let data = sourceC.getImageData(0, 0, width, height).data;

    let targetCanvas = Utils.createCanvas(width * scale, height * scale);
    let targetC = Utils.getContext(targetCanvas);
    let targetImageData = targetC.getImageData(0, 0, width * scale, height * scale);
    let targetData = targetImageData.data;

    let i;
    let j;
    let r;
    let g;
    let b;
    let a;

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];
            a = data[i + 3];
            for(let x2 = x * scale; x2 < (x + 1) * scale; x2++) {
                for(let y2 = y * scale; y2 < (y + 1) * scale; y2++) {
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

    let sourceImage = Img.get(source);
    let width = sourceImage.width;
    let height = sourceImage.height;
    let sourceCanvas = Utils.createCanvas(width, height);
    let sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    let data = sourceC.getImageData(0, 0, width, height).data;

    let tilesX = width / tileSize;
    let tilesY = height / tileSize;

    let targetWidth = width * scale;
    let targetHeight = height * scale;
    if(side === "top") {
        targetWidth *= 2;
    } else {
        targetHeight *= 1.5;
    }

    let targetCanvas = Utils.createCanvas(targetWidth, targetHeight);
    let targetC = Utils.getContext(targetCanvas);
    let targetImageData = targetC.getImageData(0, 0, targetWidth, targetHeight);
    let targetData = targetImageData.data;

    for(let tileX = 0; tileX < tilesX; tileX++) {
        for(let tileY = 0; tileY < tilesY; tileY++) {
            for(let x = 0; x < tileSize; x++) {
                for(let y = 0; y < tileSize; y++) {
                    let i = ((tileY * tileSize) + y) * width;
                    i += (tileX * tileSize) + x;
                    i *= 4;
                    let r = data[i];
                    let g = data[i + 1];
                    let b = data[i + 2];
                    let a = data[i + 3];

                    if(side === "top") {
                        let midX = ((tileX * tileSize * 2) + tileSize + x - y) * scale;
                        let midY = ((tileY * tileSize * 2) + x + y + 1) * scale / 2;
                        for(let cX = -scale; cX < scale; cX++) {
                            for(let cY = -(scale / 2); cY < (scale / 2); cY++) {
                                let ci = (midX + cX + ((midY + cY) * width * scale * 2)) * 4;
                                if(Math.abs(cX + 0.5) + (2 * Math.abs(cY + 0.5)) <= scale) {
                                    targetData[ci] = r;
                                    targetData[ci + 1] = g;
                                    targetData[ci + 2] = b;
                                    targetData[ci + 3] = a;
                                }
                            }
                        }

                    } else if(side === "left") {
                        let cornerX = ((tileX * tileSize) + x) * scale;
                        let cornerY = ((tileY * tileSize * 1.5) + y + (x * 0.5)) * scale;
                        for(let cX = 0; cX < scale; cX++) {
                            for(let cY = 0; cY < scale; cY++) {
                                let ci = (cornerX + cX + ((cornerY + cY + Math.ceil(cX / 2)) * width * scale)) * 4;
                                targetData[ci] = r;
                                targetData[ci + 1] = g;
                                targetData[ci + 2] = b;
                                targetData[ci + 3] = a;
                            }
                        }

                    } else if(side === "right") {
                        let cornerX = ((tileX * tileSize) + x) * scale;
                        let cornerY = ((tileY * tileSize * 1.5) + (tileSize * 0.5) + y - (x * 0.5)) * scale;
                        for(let cX = 0; cX < scale; cX++) {
                            for(let cY = 0; cY < scale; cY++) {
                                let ci = (cornerX + cX + ((cornerY + cY - Math.ceil(cX / 2)) * width * scale)) * 4;
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
    let oImage = Img.get(name);
    let outputCanvas = Utils.createCanvas(oImage.width, oImage.height);
    let context = Utils.getContext(outputCanvas);
    context.drawImage(oImage, 0, 0);

    let image = new Image();
    image.src = outputCanvas.toDataURL("image/png");
    jQuery("body").append(image);
}