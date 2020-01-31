import Preloader from "./Preloader.js";
import * as ffo from "../../libs/fontfaceobserver.js";


class WebFontPreloader extends Preloader {


    load(sources) {
        this.sources = sources;
        this.totalAssets = this.sources.length;

        if(this.totalAssets === 0) {
            this.totalAssets = 1;
            this.reportAssetLoaded();
            return;
        }

        for(let i = 0; i < this.totalAssets; i++) {
            let font = this.sources[i];
            let fontObserver = new FontFaceObserver(font);
            jQuery("body").append("<div id=\"webfont_preload_" + font + "\" style=\"display: none; font-family: " + font + "\">" + font + "</div>");
            fontObserver.load().then(() => {
                jQuery("#webfont_preload_" + font).remove();
                this.reportAssetLoaded();
            }, () => {
                jQuery("#webfont_preload_" + font).remove();
                this.reportAssetLoaded();
            });
        }
    }

}


export default WebFontPreloader;