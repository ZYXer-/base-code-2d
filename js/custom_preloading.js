function CustomPreloading() {}


CustomPreloading.preload = function() {

    // Here you can preload custom things, like generating textures

    ImageProcessing.replaceColors("test2", "test2recolored", {
        "#ff0000" : "#336600"
    });

    ImageProcessing.pixelate("test2recolored", "test2recoloredResized", 3);

    var demoCanvas = Utils.createCanvas(150, 150);
    var demoC = Utils.getContext(demoCanvas);
    demoC.fillStyle = "#000";
    demoC.fillRect(0, 0, 150, 150);
    demoC.drawImage(Img.get("test2recoloredResized"), 0, 0);
    Img.add("demoGeneratedTexture", demoCanvas);
};