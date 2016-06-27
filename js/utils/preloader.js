function Preloader() {

    this.sources;

    this.loadedAssets = 0;
    this.totalAssets = 0;

    this.fractionLoaded = 0;
    this.loaded = false;

    this.endCallback = null;


    this.loadImages = function(sources) {
        this.sources = sources;
        this.totalAssets = Object.keys(this.sources).length;
        var preloader = this;

        if(this.totalAssets == 0) {
            this.totalAssets = 1;
            this.reportAssetLoaded();
            return;
        }

        for(var name in this.sources) {
            img.assets[name] = new Image();
            img.assets[name].onload = function() {
                preloader.reportAssetLoaded();
            };
            img.assets[name].src = this.sources[name];
        }
    };


    this.loadSoundManager = function() {
        this.totalAssets = 1;
        var preloader = this;

        soundManager.setup({
            debugMode : game.DEBUG,
            url : "swf/",
            onready : function() {
                preloader.reportAssetLoaded();
            },
            ontimeout : function() {
                alert("Cannot play sound!");
                preloader.reportAssetLoaded();
            }
        });
    };


    this.loadSounds = function(sources) {
        this.sources = sources;
        Object.keys(this.sources).length;
        for(var name in this.sources) {
            this.totalAssets += this.sources[name].instances;
        }
        var preloader = this;

        if(this.totalAssets == 0) {
            this.totalAssets = 1;
            this.reportAssetLoaded();
            return;
        }

        for(var name in this.sources) {
            for(var i = 0; i < this.sources[name].instances; i++) {
                soundManager.createSound({
                    id : name + "_instance_" + i,
                    url : this.sources[name].source,
                    autoLoad : true,
                    volume : 50,
                    multiShot : false,
                    onload : function() {
                        preloader.reportAssetLoaded();
                    }
                });
            }
            sound.assets[name] = { position : 0, count : this.sources[name].instances };
        }
    };


    this.loadPixelFonts = function(sources) {
        this.sources = sources;
        this.totalAssets = Object.keys(this.sources).length;

        if(this.totalAssets == 0) {
            this.totalAssets = 1;
            this.reportAssetLoaded();
            return;
        }

        for(var name in this.sources) {
            var source = this.sources[name];
            pixelFonts.create(name, img.get(source["file"]), source["minCharSpacingInFile"], source["printCharSpacing"], source["printSpaceWidth"], source["glyphDetectionThresholds"], source["manualSpacing"]);
            this.reportAssetLoaded();
        }
    };


    this.loadWebFonts = function(sources) {
        this.sources = sources;
        this.totalAssets = this.sources.length;

        if(this.totalAssets == 0) {
            this.totalAssets = 1;
            this.reportAssetLoaded();
            return;
        }

        var preloader = this;
        for(var i = 0; i < this.totalAssets; i++) {
            var font = this.sources[i];
            var fontObserver = new FontFaceObserver(font);
            jQuery("body").append("<div id=\"webfont_preload_" + font + "\" style=\"display: none; font-family: " + font + "\">" + font + "</div>");
            fontObserver.load().then(function() {
                jQuery("#webfont_preload_" + font).remove();
                preloader.reportAssetLoaded();
            }, function() {
                jQuery("#webfont_preload_" + font).remove();
                preloader.reportAssetLoaded();
            });
        }
    };


    this.setEndCallback = function(callback) {
        this.endCallback = callback;
    };


    this.reportAssetLoaded = function() {
        this.loadedAssets++;
        this.fractionLoaded = this.loadedAssets / this.totalAssets;
        if(this.loadedAssets == this.totalAssets) {
            this.loaded = true;
            if(this.endCallback != null) {
                this.endCallback();
            }
        }
    };


    this.getFractionLoaded = function() {
        return this.fractionLoaded;
    };


    this.isLoaded = function() {
        return this.loaded;
    };

}