import * as Img from "./core/Img.js";
import * as CanvasUtils from "./utils/rendering/CanvasUtils.js";
import * as ImageProcessing from "./utils/rendering/ImageProcessing.js";


export function preload() {

    // Here you can preload custom things, like generating textures

    ImageProcessing.replaceColors("test2", "test2recolored", {
        "#ff0000": "#336600"
    });

    ImageProcessing.pixelate("test2recolored", "test2recoloredResized", 3);

    const demoCanvas = CanvasUtils.createCanvas(150, 150);
    const demoC = CanvasUtils.getContext(demoCanvas);
    demoC.fillStyle = "#000";
    demoC.fillRect(0, 0, 150, 150);
    demoC.drawImage(Img.get("test2recoloredResized"), 0, 0);
    Img.add("demoGeneratedTexture", demoCanvas);
}