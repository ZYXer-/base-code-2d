import * as Img from "../Img.js";
import Preloader from "./Preloader.js";


class ImagePreloader extends Preloader {


    load(sources) {
        this.sources = sources;
        this.totalAssets = this.sources.size;

        if(this.totalAssets === 0) {
            this.totalAssets = 1;
            this.reportAssetLoaded();
            return;
        }

        for(let [name, source] of this.sources) {
            const newImage = new Image();
            newImage.onload = () => {
                this.reportAssetLoaded();
            };
            newImage.onerror = () => {
                alert("Could not load image \"" + name + "\" from \"" + source + "\".");
            };
            newImage.src = source;
            Img.add(name, newImage);
        }
    }

}


export default ImagePreloader;