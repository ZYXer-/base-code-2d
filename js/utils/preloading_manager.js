function PreloadingManager() {

    this.soundManagerPreloader;
    this.imagePreloader;
    this.soundPreloader;
    this.pixelFontPreloader;
    this.webFontPreloader;


    this.preload = function() {

        this.soundManagerPreloader = new Preloader();
        this.imagePreloader = new Preloader();
        this.soundPreloader = new Preloader();
        this.pixelFontPreloader = new Preloader();
        this.webFontPreloader = new Preloader();

        this.soundManagerPreloader.setEndCallback(function() {
            preloadingManager.soundPreloader.loadSounds(resources.sounds);
        });
        this.soundManagerPreloader.loadSoundManager();

        this.imagePreloader.setEndCallback(function() {
            preloadingManager.pixelFontPreloader.loadPixelFonts(resources.pixelFonts);
        });
        this.imagePreloader.loadImages(resources.images);

        this.webFontPreloader.loadWebFonts(resources.webFonts);
    };
}