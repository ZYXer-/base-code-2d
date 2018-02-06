function SoundInstance(soundAsset, id) {

    this.soundAsset = soundAsset;
    this.id = id;

    this.name = this.soundAsset + "_instance_" + id;
    this.volume = Settings.Game.DEFAULT_SOUND_VOLUME;

    this.currentlyFading = false;
}


SoundInstance.prototype.stop = function() {
    soundManager.stop(this.name);
};


SoundInstance.prototype.setVolume = function(volume) { // volume : 0 - 100
    this.volume = volume;
    soundManager.setVolume(this.name, volume);
};


SoundInstance.prototype.fadeIn = function(length) {
    this.fadeTo(length, Settings.Game.DEFAULT_SOUND_VOLUME);
};


SoundInstance.prototype.fadeOut = function(length) {
    this.fadeTo(length, 0);
};


SoundInstance.prototype.fadeTo = function(length, targetVolume) {
    if(this.currentlyFading) {
        for(var fadeId in Sound.fades) {
            if(Sound.fades[fadeId].name === this.name) {
                delete Sound.fades[fadeId];
            }
        }
    }
    Sound.fades[Sound.fadeCounter] = {
        name : this.name,
        instance : this,
        timer : 0.0,
        length : length,
        targetVolume : targetVolume
    };
    Sound.fadeCounter++;
};