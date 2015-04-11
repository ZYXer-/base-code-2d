function PreloadingManager() {

	this.soundManagerPreloader;
	this.imagePreloader;
	this.soundPreloader;
	this.fontPreloader;


	this.preload = function() {

		this.soundManagerPreloader = new Preloader();
		this.imagePreloader = new Preloader();
		this.soundPreloader = new Preloader();
		this.fontPreloader = new Preloader();

		this.soundManagerPreloader.setEndCallback(function() {
			preloadingManager.soundPreloader.loadSounds(resources.sounds);
		});
		this.soundManagerPreloader.loadSoundManager();

		this.imagePreloader.setEndCallback(function() {
			preloadingManager.fontPreloader.loadFonts(resources.fonts);
		});
		this.imagePreloader.loadImages(resources.images);
	};

}