import * as Settings from "../Settings.js";


class SoundInstance {


    constructor(howl, soundId) {
        this.howl = howl;
        this.soundId = soundId;
    }


    stop() {
        this.howl.stop(this.soundId);
    }


    setVolume(volume) {
        this.howl.volume(volume, this.soundId);
    }


    fadeIn(duration) {
        this.howl.fade(0, Settings.Game.DEFAULT_SOUND_VOLUME, duration, this.soundId);
    }


    fadeOut(duration) {
        this.howl.fade(this.howl.volume(this.soundId), 0, duration, this.soundId);
    }


    fadeTo(duration, targetVolume) {
        this.howl.fade(this.howl.volume(this.soundId), targetVolume, duration, this.soundId);
    }


}


export default SoundInstance;
