export function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}


export function getContext(canvas) {
    return canvas.getContext("2d");
}
