class Preloader {


    constructor() {
        
        this.sources = null;

        this.loadedAssets = 0;
        this.totalAssets = 0;

        this.fractionLoaded = 0;
        this.loaded = false;

        this.endCallback = null;

    }


    setEndCallback(callback) {
        this.endCallback = callback;
    }


    reportAssetLoaded() {
        this.loadedAssets++;
        this.fractionLoaded = 1.0;
        if(this.totalAssets !== 0)
        {
            this.fractionLoaded = this.loadedAssets / this.totalAssets;
        }
        if(this.loadedAssets === this.totalAssets) {
            this.loaded = true;
            if(this.endCallback !== null) {
                this.endCallback();
            }
        }
    }


    getFractionLoaded() {
        return this.fractionLoaded;
    }


    isLoaded() {
        return this.loaded;
    }

}


export default Preloader;