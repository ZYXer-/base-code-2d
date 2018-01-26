function ImageProcessing() {}


ImageProcessing.readData = function(image, width, height) {

    var readCanvas = Utils.createCanvas(width, height);
    var readContext = Utils.getContext(readCanvas);
    readContext.drawImage(Img.get(image), 0, 0);
    var readData = readContext.getImageData(0, 0, width, height).data;

    var data = Utils.createMatrix(width, height, [ 0, 0, 0, 0 ]);
    var i;

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            data[x][y] = [ readData[i], readData[i + 1], readData[i + 2], readData[i + 3] ];
        }
    }

    return data;
};


ImageProcessing.readMatrix = function(image, width, height, defaultValue, colorAllocation) {

    var data = ImageProcessing.readData(image, width, height);
    var matrix = Utils.createMatrix(width, height, defaultValue);
    var hexColor;

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {
            hexColor = Color.fromArray(data[x][y]).toHex();
            if(colorAllocation.hasOwnProperty(hexColor)) {
                matrix[x][y] = colorAllocation[hexColor];
            }
        }
    }

    return matrix;
};


ImageProcessing.replaceColors = function(source, target, colorMap) {

    var rgb;
    for(var sourceColor in colorMap) {
        rgb = Color.fromHex(colorMap[sourceColor]);
        colorMap[sourceColor] = rgb;
    }

    var sourceImage = Img.get(source);
    var width = sourceImage.width;
    var height = sourceImage.height;
    var sourceCanvas = Utils.createCanvas(width, height);
    var sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    var imageData = sourceC.getImageData(0, 0, width, height);
    var data = imageData.data;

    var i;
    var hexColor;

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {
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

    var targetCanvas = Utils.createCanvas(width, height);
    var targetC = Utils.getContext(targetCanvas);
    targetC.putImageData(imageData, 0, 0);

    Img.add(target, targetCanvas);
};


ImageProcessing.replaceColorsWithImageMap = function(source, target, imageMap, column) {

    var mapImage = Img.get(imageMap);
    var mapImageCanvas = Utils.createCanvas(mapImage.width, mapImage.height);
    var mapImageC = Utils.getContext(mapImageCanvas);
    mapImageC.drawImage(mapImage, 0, 0);
    var data = mapImageC.getImageData(0, 0, mapImage.width, mapImage.height).data;

    var colorMap = {};

    for(var y = 0; y < mapImage.height; y++) {
        var i = y * mapImage.width * 4;
        var sourceColor = Color.fromRGB(data[i], data[i + 1], data[i + 2]).toHex();
        i += column * 4;
        var targetColor = Color.fromRGB(data[i], data[i + 1], data[i + 2]).toHex();
        colorMap[sourceColor] = targetColor;
    }

    return ImageProcessing.replaceColors(source, target, colorMap);
};


ImageProcessing.removeSemitransparent = function(source, target) {

    var sourceImage = Img.get(source);
    var width = sourceImage.width;
    var height = sourceImage.height;
    var sourceCanvas = Utils.createCanvas(width, height);
    var sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    var imageData = sourceC.getImageData(0, 0, width, height);
    var data = imageData.data;

    var i;

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            if(data[i + 3] > 0 && data[i + 3] < 255) {
                data[i + 3] = 0;
            }
        }
    }

    var targetCanvas = Utils.createCanvas(width, height);
    var targetC = Utils.getContext(targetCanvas);
    targetC.putImageData(imageData, 0, 0);

    Img.add(target, targetCanvas);
};


ImageProcessing.setOpacity = function(source, target, opacity) {

    var sourceImage = Img.get(source);
    var width = sourceImage.width;
    var height = sourceImage.height;
    var sourceCanvas = Utils.createCanvas(width, height);
    var sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    var imageData = sourceC.getImageData(0, 0, width, height);
    var data = imageData.data;

    var i;

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            data[i + 3] = Math.round(data[i + 3] * opacity);
        }
    }

    var targetCanvas = Utils.createCanvas(width, height);
    var targetC = Utils.getContext(targetCanvas);
    targetC.putImageData(imageData, 0, 0);

    Img.add(target, targetCanvas);
};


ImageProcessing.pixelate = function(source, target, scale) {

    var sourceImage = Img.get(source);
    var width = sourceImage.width;
    var height = sourceImage.height;
    var sourceCanvas = Utils.createCanvas(width, height);
    var sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    var data = sourceC.getImageData(0, 0, width, height).data;

    var targetCanvas = Utils.createCanvas(width * scale, height * scale);
    var targetC = Utils.getContext(targetCanvas);
    var targetImageData = targetC.getImageData(0, 0, width * scale, height * scale);
    var targetData = targetImageData.data;

    var i;
    var j;
    var r;
    var g;
    var b;
    var a;

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {
            i = ((y * width) + x) * 4;
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];
            a = data[i + 3];
            for(var x2 = x * scale; x2 < (x + 1) * scale; x2++) {
                for(var y2 = y * scale; y2 < (y + 1) * scale; y2++) {
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
};


ImageProcessing.isometricProjection = function(source, target, tileSize, scale, side) {
    // scale should be an even number.
    // side can be "top", "left" or "right"

    var sourceImage = Img.get(source);
    var width = sourceImage.width;
    var height = sourceImage.height;
    var sourceCanvas = Utils.createCanvas(width, height);
    var sourceC = Utils.getContext(sourceCanvas);
    sourceC.drawImage(sourceImage, 0, 0);
    var data = sourceC.getImageData(0, 0, width, height).data;

    var tilesX = width / tileSize;
    var tilesY = height / tileSize;

    var targetWidth = width * scale;
    var targetHeight = height * scale;
    if(side === "top") {
        targetWidth *= 2;
    } else {
        targetHeight *= 1.5;
    }

    var targetCanvas = Utils.createCanvas(targetWidth, targetHeight);
    var targetC = Utils.getContext(targetCanvas);
    var targetImageData = targetC.getImageData(0, 0, targetWidth, targetHeight);
    var targetData = targetImageData.data;

    for(var tileX = 0; tileX < tilesX; tileX++) {
        for(var tileY = 0; tileY < tilesY; tileY++) {
            for(var x = 0; x < tileSize; x++) {
                for(var y = 0; y < tileSize; y++) {
                    var i = ((tileY * tileSize) + y) * width;
                    i += (tileX * tileSize) + x;
                    i *= 4;
                    var r = data[i];
                    var g = data[i + 1];
                    var b = data[i + 2];
                    var a = data[i + 3];

                    if(side === "top") {
                        var midX = ((tileX * tileSize * 2) + tileSize + x - y) * scale;
                        var midY = ((tileY * tileSize * 2) + x + y + 1) * scale / 2;
                        for(var cX = -scale; cX < scale; cX++) {
                            for(var cY = -(scale / 2); cY < (scale / 2); cY++) {
                                var ci = (midX + cX + ((midY + cY) * width * scale * 2)) * 4;
                                if(Math.abs(cX + 0.5) + (2 * Math.abs(cY + 0.5)) <= scale) {
                                    targetData[ci] = r;
                                    targetData[ci + 1] = g;
                                    targetData[ci + 2] = b;
                                    targetData[ci + 3] = a;
                                }
                            }
                        }

                    } else if(side === "left") {
                        var cornerX = ((tileX * tileSize) + x) * scale;
                        var cornerY = ((tileY * tileSize * 1.5) + y + (x * 0.5)) * scale;
                        for(var cX = 0; cX < scale; cX++) {
                            for(var cY = 0; cY < scale; cY++) {
                                var ci = (cornerX + cX + ((cornerY + cY + Math.ceil(cX / 2)) * width * scale)) * 4;
                                targetData[ci] = r;
                                targetData[ci + 1] = g;
                                targetData[ci + 2] = b;
                                targetData[ci + 3] = a;
                            }
                        }

                    } else if(side === "right") {
                        var cornerX = ((tileX * tileSize) + x) * scale;
                        var cornerY = ((tileY * tileSize * 1.5) + (tileSize * 0.5) + y - (x * 0.5)) * scale;
                        for(var cX = 0; cX < scale; cX++) {
                            for(var cY = 0; cY < scale; cY++) {
                                var ci = (cornerX + cX + ((cornerY + cY - Math.ceil(cX / 2)) * width * scale)) * 4;
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
};


ImageProcessing.outputImage = function(name) {
    var oImage = Img.get(name);
    var outputCanvas = Utils.createCanvas(oImage.width, oImage.height);
    var context = Utils.getContext(outputCanvas);
    context.drawImage(oImage, 0, 0);

    var image = new Image();
    image.src = outputCanvas.toDataURL("image/png");
    jQuery("body").append(image);
};

