function Sound() {}


Sound.muted = false;
Sound.assets = {};


Sound.play = function(name, attributes) { // attributes example: { volume : 100, onfinish : foo(), loops : 3 }
    if(Sound.assets.hasOwnProperty(name)) {
        soundManager.play(name + "_instance_" + Sound.assets[name].position, attributes);
        Sound.assets[name].position++;
        if(Sound.assets[name].position >= Sound.assets[name].count) {
            Sound.assets[name].position = 0;
        }
    }
};


Sound.stop = function(name) {
    var position = Sound.assets[name].position - 1;
    if(position < 0) {
        position = Sound.assets[name].count - 1;
    }
    soundManager.stop(name + "_instance_" + position);
};


Sound.setVolume = function(name, volume) { // volume : 0 - 100
    var position = Sound.assets[name].position - 1;
    if(position < 0) {
        position = Sound.assets[name].count - 1;
    }
    soundManager.setVolume(name + "_instance_" + position, volume);
};


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