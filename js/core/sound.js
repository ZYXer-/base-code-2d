function Sound() {}


Sound.muted = false;
Sound.assets = {};

Sound.fades = {};
Sound.fadeCounter = 0;


Sound.muteUnmute = function() {
    if(Sound.muted) {
        Sound.unmute();
    } else {
        Sound.mute();
    }
};


Sound.mute = function() {
    Sound.muted = true;
    soundManager.mute();
};


Sound.unmute = function() {
    Sound.muted = false;
    soundManager.unmute();
};


Sound.play = function(name, attributes) { // attributes example: { volume : 100, onfinish : foo(), loops : 3 }
    if(Sound.assets.hasOwnProperty(name)) {
        var asset = Sound.assets[name];
        var instance = asset.instances[asset.nextInstance];
        soundManager.play(instance.name, attributes);
        Sound.assets[name].nextInstance++;
        if(Sound.assets[name].nextInstance >= Sound.assets[name].numOfInstances) {
            Sound.assets[name].nextInstance = 0;
        }
        return instance;
    }
};


Sound.getLastInstance = function(name) {
    var position = Sound.assets[name].nextInstance - 1;
    if(position < 0) {
        position = Sound.assets[name].numOfInstances - 1;
    }
    return Sound.assets[name].instances[position];
};


Sound.stop = function(name) {
    Sound.getLastInstance(name).stop();
};


Sound.setVolume = function(name, volume) { // volume : 0 - 100
    Sound.getLastInstance(name).setVolume(volume);
};


Sound.fadeIn = function(name, length) {
    Sound.getLastInstance(name).fadeIn(length);
};


Sound.fadeOut = function(name, length) {
    Sound.getLastInstance(name).fadeOut(length);
};


Sound.fadeTo = function(name, length, targetVolume) {
    Sound.getLastInstance(name).fadeTo(length, targetVolume);
};


Sound.update = function() {
    var fade;
    for(var fadeId in Sound.fades) {
        fade = Sound.fades[fadeId];
        fade.timer += Timer.delta;
        if(fade.timer >= fade.length) {
            fade.instance.setVolume(fade.targetVolume);
            fade.instance.currentlyFading = false;
            delete Sound.fades[fadeId];
        } else {
            var deltaVolume = fade.targetVolume - fade.instance.volume;
            deltaVolume /= ((fade.length - fade.timer) / Timer.delta);
            fade.instance.setVolume(fade.instance.volume + deltaVolume);
        }
    }
};