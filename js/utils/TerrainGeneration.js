import { clamp, createMatrix, randFloat, rand } from "./Utils.js";
import { PI, distance } from "./GeometryUtils.js";
import * as Easing from "./Easing.js";


export function perlinNoise(size, lowestOctave, highOctaveWeight) { // size and lowestOctave must be multiple of 2, highOctaveWeight must be 0.0 - 1.0

    let octaves = [];

    let octave;
    let x;
    let y;

    for(let octaveSize = size; octaveSize >= lowestOctave; octaveSize /= 2) {
        octave = createMatrix(octaveSize, octaveSize, 0);
        for(x = 0; x < octaveSize; x++) {
            for(y = 0; y < octaveSize; y++) {
                octave[x][y] = randFloat(0.0, 1.0);
            }
        }
        octaves.push(octave);
    }

    let noise = createMatrix(size, size, 0);

    for(let i = 0; i < octaves.length; i++) {

        octave = octaves[i];
        let oS = octave.length;
        let interpolationSpan = size / oS;

        for(x = 0; x < size; x++) {
            for(y = 0; y < size; y++) {

                let baseX = Math.floor(x / interpolationSpan);
                let baseY = Math.floor(y / interpolationSpan);

                let offsetX = (x - (baseX * interpolationSpan)) / interpolationSpan;
                let offsetY = (y - (baseY * interpolationSpan)) / interpolationSpan;

                let x0y0 = octave[baseX][baseY];
                let x1y0 = octave[(baseX + 1) % oS][baseY];
                let x0y1 = octave[baseX][(baseY + 1) % oS];
                let x1y1 = octave[(baseX + 1) % oS][(baseY + 1) % oS];

                let interpolateX = clamp(Easing.quad(offsetX), 0.0, 1.0);
                let interpolateY = clamp(Easing.quad(offsetY), 0.0, 1.0);

                let value = x0y0 * (1.0 - interpolateX) * (1.0 - interpolateY);
                value += x1y0 * interpolateX * (1.0 - interpolateY);
                value += x0y1 * (1.0 - interpolateX) * interpolateY;
                value += x1y1 * interpolateX * interpolateY;
                noise[x][y] = (noise[x][y] * highOctaveWeight) + (value * (1.0 - highOctaveWeight));
            }
        }
    }

    return noise;
}


export function clampMatrix(m, min, max) {

    let sizeX = m.length;
    let sizeY = m[0].length;

    let minVal = m[0][0];
    let maxVal = m[0][0];

    let x;
    let y;

    for(x = 0; x < sizeX; x++) {
        for(y = 0; y < sizeY; y++) {
            if(minVal > m[x][y]) {
                minVal = m[x][y];
            }
            if(maxVal < m[x][y]) {
                maxVal = m[x][y];
            }
        }
    }

    let mid = (minVal + maxVal) / 2.0;
    let scale = 1.0 / (maxVal - minVal);

    let span = (max - min);
    let halfSpan = span * 0.5;

    for(x = 0; x < sizeX; x++) {
        for(y = 0; y < sizeY; y++) {
            m[x][y] = clamp(min + halfSpan + ((m[x][y] - mid) * scale * span), min, max);
        }
    }
}


export function createIsland(mapSizeX, mapSizeY, posX, posY, radius, amplitude, callback) {

    let startX = clamp(posX - (radius + amplitude), 0, mapSizeX - 1);
    let endX = clamp(posX + (radius + amplitude), 0, mapSizeX - 1);
    let startY = clamp(posY - (radius + amplitude), 0, mapSizeY - 1);
    let endY = clamp(posY + (radius + amplitude), 0, mapSizeY - 1);

    let possibleFrequencies = [3, 5, 7, 9, 11];
    let frequency = possibleFrequencies[rand(0, Math.ceil(radius / 3.0))];
    let offset = randFloat(0.1, 2.5);

    for(let x = startX; x <= endX; x++) {
        for(let y = startY; y <= endY; y++) {
            let angle1 = offset + (Math.atan2(posX - x, posY - y) * frequency);
            let angle2 = (offset * 3) + (Math.atan2(posX - x, posY - y) * 3);
            let maxDist = radius + (0.5 * amplitude * Math.sin(angle1)) + (0.5 * amplitude * Math.sin(angle2));
            if(distance(x, y, posX, posY) < maxDist) {
                callback(x, y);
            }
        }
    }
}
