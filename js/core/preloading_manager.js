function PreloadingManager() {}

PreloadingManager.soundManagerPreloader = null;
PreloadingManager.imagePreloader = null;
PreloadingManager.soundPreloader = null;
PreloadingManager.pixelFontPreloader = null;
PreloadingManager.webFontPreloader = null;

PreloadingManager.fakeLoadingCountdown = 0.0;
PreloadingManager.soundLoadingCountdown = 0.0;


PreloadingManager.preload = function() {

    PreloadingManager.fakeLoadingCountdown = Settings.Loading.FAKE_LOADING_TIME;
    PreloadingManager.soundLoadingCountdown = Settings.Loading.TIME_BEFORE_SOUND_LOADING_FAIL;

    PreloadingManager.soundManagerPreloader = new SoundManagerPreloader();
    PreloadingManager.soundPreloader = new SoundPreloader();
    PreloadingManager.imagePreloader = new ImagePreloader();
    PreloadingManager.pixelFontPreloader = new PixelFontPreloader();
    PreloadingManager.webFontPreloader = new WebFontPreloader();

    PreloadingManager.soundManagerPreloader.setEndCallback(function() {
        PreloadingManager.soundPreloader.load(Resources.sounds);
    });
    PreloadingManager.soundManagerPreloader.load();

    PreloadingManager.imagePreloader.setEndCallback(function() {
        PreloadingManager.pixelFontPreloader.load(Resources.pixelFonts);
    });
    PreloadingManager.imagePreloader.load(Resources.images);

    PreloadingManager.webFontPreloader.load(Resources.webFonts);
};


PreloadingManager.update = function() {

    if(PreloadingManager.imagePreloader.isLoaded()
        && PreloadingManager.pixelFontPreloader.isLoaded()
        && PreloadingManager.webFontPreloader.isLoaded()
        && ((PreloadingManager.soundManagerPreloader.isLoaded()
        && PreloadingManager.soundPreloader.isLoaded())
        || this.soundLoadingCountdown < 0)) {

        this.fakeLoadingCountdown -= Timer.delta;
        if(this.fakeLoadingCountdown < 0) {
            CustomPreloading.preload();
            SceneManager.changeScene(SceneManager.SCENE_AFTER_LOADING);
        }
    }

    if(PreloadingManager.imagePreloader.isLoaded()
        && PreloadingManager.pixelFontPreloader.isLoaded()
        && PreloadingManager.webFontPreloader.isLoaded()
        && !PreloadingManager.soundPreloader.isLoaded()) {

        this.soundLoadingCountdown -= Timer.delta;
    }
};


PreloadingManager.getPercentageLoaded = function() {

    var soundManagerPercentage = PreloadingManager.soundManagerPreloader.getFractionLoaded();
    soundManagerPercentage *= Settings.Loading.SOUND_MANAGER_PERCENTAGE;

    var imagePercentage = PreloadingManager.imagePreloader.getFractionLoaded();
    imagePercentage *= Settings.Loading.IMAGE_PERCENTAGE;

    var soundPercentage = PreloadingManager.soundPreloader.getFractionLoaded();
    soundPercentage *= Settings.Loading.SOUND_PERCENTAGE;

    var pixelFontPercentage = PreloadingManager.pixelFontPreloader.getFractionLoaded();
    pixelFontPercentage *= Settings.Loading.PIXEL_FONT_PERCENTAGE;

    var webFontPercentage = PreloadingManager.webFontPreloader.getFractionLoaded();
    webFontPercentage *= Settings.Loading.WEB_FONT_PERCENTAGE;

    var fakeLoadingPercentage = 1.0;
    if(Settings.Loading.FAKE_LOADING_TIME !== 0.0)
    {
        fakeLoadingPercentage = (1.0 - (this.fakeLoadingCountdown / Settings.Loading.FAKE_LOADING_TIME));
    }
    fakeLoadingPercentage = Utils.limit(fakeLoadingPercentage, 0.0, 1.0);
    fakeLoadingPercentage *= Settings.Loading.FAKE_PERCENTAGE;

    var percentage = soundManagerPercentage;
    percentage += imagePercentage;
    percentage += soundPercentage;
    percentage += pixelFontPercentage;
    percentage += webFontPercentage;
    percentage += fakeLoadingPercentage;
    return percentage;
};