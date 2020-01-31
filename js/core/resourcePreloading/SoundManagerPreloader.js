import * as Settings from "../../Settings.js";
import * as sm2 from "../../libs/soundmanager2.js";
import Preloader from "./Preloader.js";


class SoundManagerPreloader extends Preloader {


    load() {

        this.totalAssets = 1;

        soundManager.setup({
            debugMode : Settings.Game.DEBUG,
            url : "swf/",
            onready : () => {
                this.reportAssetLoaded();
            },
            ontimeout : () => {
                alert("Error loading SoundManager2: cannot play any sounds.");
                this.reportAssetLoaded();
            }
        });
    }

}


export default SoundManagerPreloader;