import * as Img from "../Img.js";
import * as PixelFontManager from "../../utils/PixelFontManager.js";
import Preloader from "./Preloader.js";


class PixelFontPreloader extends Preloader {


    load(sources) {
        this.sources = sources;
        this.totalAssets = this.sources.size;

        if(this.totalAssets === 0) {
            this.totalAssets = 1;
            this.reportAssetLoaded();
            return;
        }

        for(let [name, source] of this.sources) {
            PixelFontManager.create(name, Img.get(source["file"]), source["minCharSpacingInFile"], source["printCharSpacing"], source["printSpaceWidth"], source["glyphDetectionThresholds"], source["manualSpacing"]);
            this.reportAssetLoaded();
        }
    }

}


export default PixelFontPreloader;