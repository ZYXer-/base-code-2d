import Preloader from "./Preloader.js";
// Side-effect import: fontfaceobserver.js assigns window.FontFaceObserver.
// It has no exports — do not "clean up" this import, it is load-bearing.
import "../../libs/fontfaceobserver.js";


class WebFontPreloader extends Preloader {


    load(sources) {
        this.sources = sources;
        this.totalAssets = this.sources.length;

        if (this.totalAssets === 0) {
            this.totalAssets = 1;
            this.reportAssetLoaded();
            return;
        }

        for (let i = 0; i < this.totalAssets; i++) {
            const font = this.sources[i];
            const fontObserver = new FontFaceObserver(font);
            const probeDiv = document.createElement("div");
            probeDiv.id = "webfont_preload_" + font;
            probeDiv.style.display = "none";
            probeDiv.style.fontFamily = font;
            probeDiv.textContent = font;
            document.body.appendChild(probeDiv);
            fontObserver.load().then(() => {
                document.getElementById("webfont_preload_" + font).remove();
                this.reportAssetLoaded();
            }, () => {
                document.getElementById("webfont_preload_" + font).remove();
                this.reportAssetLoaded();
            });
        }
    }

}


export default WebFontPreloader;