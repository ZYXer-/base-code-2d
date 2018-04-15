function Preloader() {}

Preloader.prototype.sources = null;

Preloader.prototype.loadedAssets = 0;
Preloader.prototype.totalAssets = 0;

Preloader.prototype.fractionLoaded = 0;
Preloader.prototype.loaded = false;

Preloader.prototype.endCallback = null;


Preloader.prototype.setEndCallback = function(callback) {
    this.endCallback = callback;
};


Preloader.prototype.reportAssetLoaded = function() {
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
};


Preloader.prototype.getFractionLoaded = function() {
    return this.fractionLoaded;
};


Preloader.prototype.isLoaded = function() {
    return this.loaded;
};


function SoundManagerPreloader() {}
SoundManagerPreloader.prototype = Object.create(Preloader.prototype);


SoundManagerPreloader.prototype.load = function() {
    this.totalAssets = 1;
    var preloader = this;

    soundManager.setup({
        debugMode : Settings.Game.DEBUG,
        url : "swf/",
        onready : function() {
            preloader.reportAssetLoaded();
        },
        ontimeout : function() {
            alert("Error loading SoundManager2: cannot play any sounds.");
            preloader.reportAssetLoaded();
        }
    });
};


function SoundPreloader() {}
SoundPreloader.prototype = Object.create(Preloader.prototype);


SoundPreloader.prototype.load = function(sources) {
    this.sources = sources;
    for(var name in this.sources) {
        this.totalAssets += this.sources[name].instances;
    }
    var preloader = this;

    if(this.totalAssets === 0) {
        this.totalAssets = 1;
        this.reportAssetLoaded();
        return;
    }

    for(var name in this.sources) {
        Sound.assets[name] = { nextInstance : 0, numOfInstances : this.sources[name].instances, instances : [] };
        for(var i = 0; i < this.sources[name].instances; i++) {
            soundManager.createSound({
                id : name + "_instance_" + i,
                url : this.sources[name].source,
                autoLoad : true,
                volume : Settings.Game.DEFAULT_SOUND_VOLUME,
                multiShot : false,
                onload : function() {
                    preloader.reportAssetLoaded();
                }
            });
            Sound.assets[name].instances.push(new SoundInstance(name, i));
        }
    }
};


function ImagePreloader() {}
ImagePreloader.prototype = Object.create(Preloader.prototype);


ImagePreloader.prototype.load = function(sources) {
    this.sources = sources;
    this.totalAssets = Object.keys(this.sources).length;
    var preloader = this;

    if(this.totalAssets === 0) {
        this.totalAssets = 1;
        this.reportAssetLoaded();
        return;
    }

    for(var name in this.sources) {
        Img.assets[name] = new Image();
        Img.assets[name].onload = function() {
            preloader.reportAssetLoaded();
        };
        Img.assets[name].src = this.sources[name];
    }
};


function PixelFontPreloader() {}
PixelFontPreloader.prototype = Object.create(Preloader.prototype);


PixelFontPreloader.prototype.load = function(sources) {
    this.sources = sources;
    this.totalAssets = Object.keys(this.sources).length;

    if(this.totalAssets === 0) {
        this.totalAssets = 1;
        this.reportAssetLoaded();
        return;
    }

    for(var name in this.sources) {
        var source = this.sources[name];
        PixelFonts.create(name, Img.get(source["file"]), source["minCharSpacingInFile"], source["printCharSpacing"], source["printSpaceWidth"], source["glyphDetectionThresholds"], source["manualSpacing"]);
        this.reportAssetLoaded();
    }
};


function WebFontPreloader() {}
WebFontPreloader.prototype = Object.create(Preloader.prototype);


WebFontPreloader.prototype.load = function(sources) {
    this.sources = sources;
    this.totalAssets = this.sources.length;

    if(this.totalAssets === 0) {
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