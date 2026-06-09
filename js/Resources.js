import * as DataUtils from "./utils/DataUtils.js";


// Images

export const images = DataUtils.objectToMap({
    loading : "img/loading.png",
    test : "img/test.png",
    test2 : "img/test2.png",
    fontBlack : "img/font_black.png",
    demoData : "img/demo_data.png"
});


// Webfonts

export const webFonts = [
    "komika",
    "opensans"
];


// Sprite-based Fonts

export const pixelFonts = DataUtils.objectToMap({
    black : {
        file : "fontBlack",
        minCharSpacingInFile : 1,
        printCharSpacing : 1,
        printSpaceWidth : 5,
        glyphDetectionThresholds : [0.25, 1.2],
        manualSpacing : [{ char : "'", left : 2 }, { char : ":", left : 2 }, { char : "t", left : 1 }]
    }
});


// Sounds

export const sounds = DataUtils.objectToMap({
    cannon : { source : ["audio/cannon.wav", "audio/cannon.mp3"], instances : 3 },
    soundtrack : { source : ["audio/soundtrack.ogg", "audio/soundtrack.mp3"], instances : 1 }
});