import * as NumberUtils from "./NumberUtils.js";
import * as DataUtils from "./DataUtils.js";
import { distance } from "./GeometryUtils.js";
import * as Easing from "./Easing.js";


export function perlinNoise(size, lowestOctave, highOctaveWeight) { // size and lowestOctave must be multiple of 2, highOctaveWeight must be 0.0 - 1.0

    const octaves = [];

    let octave;
    let x;
    let y;

    for (let octaveSize = size; octaveSize >= lowestOctave; octaveSize /= 2) {
        octave = DataUtils.createMatrix(octaveSize, octaveSize, 0);
        for (x = 0; x < octaveSize; x++) {
            for (y = 0; y < octaveSize; y++) {
                octave[x][y] = NumberUtils.randFloat(0.0, 1.0);
            }
        }
        octaves.push(octave);
    }

    const noise = DataUtils.createMatrix(size, size, 0);

    for (let i = 0; i < octaves.length; i++) {

        octave = octaves[i];
        const oS = octave.length;
        const interpolationSpan = size / oS;

        for (x = 0; x < size; x++) {
            for (y = 0; y < size; y++) {

                const baseX = Math.floor(x / interpolationSpan);
                const baseY = Math.floor(y / interpolationSpan);

                const offsetX = (x - (baseX * interpolationSpan)) / interpolationSpan;
                const offsetY = (y - (baseY * interpolationSpan)) / interpolationSpan;

                const x0y0 = octave[baseX][baseY];
                const x1y0 = octave[(baseX + 1) % oS][baseY];
                const x0y1 = octave[baseX][(baseY + 1) % oS];
                const x1y1 = octave[(baseX + 1) % oS][(baseY + 1) % oS];

                const interpolateX = NumberUtils.clamp(Easing.quad(offsetX), 0.0, 1.0);
                const interpolateY = NumberUtils.clamp(Easing.quad(offsetY), 0.0, 1.0);

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

    const sizeX = m.length;
    const sizeY = m[0].length;

    let minVal = m[0][0];
    let maxVal = m[0][0];

    let x;
    let y;

    for (x = 0; x < sizeX; x++) {
        for (y = 0; y < sizeY; y++) {
            if (minVal > m[x][y]) {
                minVal = m[x][y];
            }
            if (maxVal < m[x][y]) {
                maxVal = m[x][y];
            }
        }
    }

    const mid = (minVal + maxVal) / 2.0;
    const scale = 1.0 / (maxVal - minVal);

    const span = (max - min);
    const halfSpan = span * 0.5;

    for (x = 0; x < sizeX; x++) {
        for (y = 0; y < sizeY; y++) {
            m[x][y] = NumberUtils.clamp(min + halfSpan + ((m[x][y] - mid) * scale * span), min, max);
        }
    }
}


export function createIsland(mapSizeX, mapSizeY, posX, posY, radius, amplitude, callback) {

    const startX = NumberUtils.clamp(posX - (radius + amplitude), 0, mapSizeX - 1);
    const endX = NumberUtils.clamp(posX + (radius + amplitude), 0, mapSizeX - 1);
    const startY = NumberUtils.clamp(posY - (radius + amplitude), 0, mapSizeY - 1);
    const endY = NumberUtils.clamp(posY + (radius + amplitude), 0, mapSizeY - 1);

    const possibleFrequencies = [3, 5, 7, 9, 11];
    const frequency = possibleFrequencies[NumberUtils.rand(0, Math.ceil(radius / 3.0))];
    const offset = NumberUtils.randFloat(0.1, 2.5);

    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            const angle1 = offset + (Math.atan2(posX - x, posY - y) * frequency);
            const angle2 = (offset * 3) + (Math.atan2(posX - x, posY - y) * 3);
            const maxDist = radius + (0.5 * amplitude * Math.sin(angle1)) + (0.5 * amplitude * Math.sin(angle2));
            if (distance(x, y, posX, posY) < maxDist) {
                callback(x, y);
            }
        }
    }
}
