import * as Settings from "../../Settings.js";
import * as SceneManager from "../SceneManager.js";
import * as Scenes from "../../Scenes.js";
import * as Utils from "../../utils/Utils.js";
import * as Timer from "../Timer.js";
import * as Resources from "../../Resources.js";
import * as CustomPreloading from "../../CustomPreloading.js";
import SoundManagerPreloader from "./SoundManagerPreloader.js";
import SoundPreloader from "./SoundPreloader.js";
import ImagePreloader from "./ImagePreloader.js";
import PixelFontPreloader from "./PixelFontPreloader.js";
import WebFontPreloader from "./WebFontPreloader.js";


const soundManagerPreloader = new SoundManagerPreloader();
const soundPreloader = new SoundPreloader();
const imagePreloader = new ImagePreloader();
const pixelFontPreloader = new PixelFontPreloader();
const webFontPreloader = new WebFontPreloader();

let fakeLoadingCountdown = Settings.Loading.FAKE_LOADING_TIME;
let soundLoadingCountdown = Settings.Loading.TIME_BEFORE_SOUND_LOADING_FAIL;


export function preload() {

    soundManagerPreloader.setEndCallback(() => {
        soundPreloader.load(Resources.sounds);
    });
    soundManagerPreloader.load();

    imagePreloader.setEndCallback(() => {
        pixelFontPreloader.load(Resources.pixelFonts);
    });
    imagePreloader.load(Resources.images);

    webFontPreloader.load(Resources.webFonts);
}


export function update() {

    if(imagePreloader.isLoaded()
        && pixelFontPreloader.isLoaded()
        && webFontPreloader.isLoaded()
        && ((soundManagerPreloader.isLoaded()
            && soundPreloader.isLoaded())
            || soundLoadingCountdown < 0)) {

        fakeLoadingCountdown -= Timer.delta;
        if(fakeLoadingCountdown < 0) {
            CustomPreloading.preload();
            SceneManager.changeScene(Scenes.SCENE_AFTER_LOADING);
        }
    }

    if(imagePreloader.isLoaded()
        && pixelFontPreloader.isLoaded()
        && webFontPreloader.isLoaded()
        && !soundPreloader.isLoaded()) {

        soundLoadingCountdown -= Timer.delta;
    }
}


export function getPercentageLoaded() {

    let soundManagerPercentage = soundManagerPreloader.getFractionLoaded();
    soundManagerPercentage *= Settings.Loading.SOUND_MANAGER_PERCENTAGE;

    let imagePercentage = imagePreloader.getFractionLoaded();
    imagePercentage *= Settings.Loading.IMAGE_PERCENTAGE;

    let soundPercentage = soundPreloader.getFractionLoaded();
    soundPercentage *= Settings.Loading.SOUND_PERCENTAGE;

    let pixelFontPercentage = pixelFontPreloader.getFractionLoaded();
    pixelFontPercentage *= Settings.Loading.PIXEL_FONT_PERCENTAGE;

    let webFontPercentage = webFontPreloader.getFractionLoaded();
    webFontPercentage *= Settings.Loading.WEB_FONT_PERCENTAGE;

    let fakeLoadingPercentage = 1.0;
    if(Settings.Loading.FAKE_LOADING_TIME !== 0.0)
    {
        fakeLoadingPercentage = (1.0 - (fakeLoadingCountdown / Settings.Loading.FAKE_LOADING_TIME));
    }
    fakeLoadingPercentage = Utils.clamp(fakeLoadingPercentage, 0.0, 1.0);
    fakeLoadingPercentage *= Settings.Loading.FAKE_PERCENTAGE;

    let percentage = soundManagerPercentage;
    percentage += imagePercentage;
    percentage += soundPercentage;
    percentage += pixelFontPercentage;
    percentage += webFontPercentage;
    percentage += fakeLoadingPercentage;
    return percentage;
}