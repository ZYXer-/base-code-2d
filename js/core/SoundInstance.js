import * as Settings from "../Settings.js";
import * as Sound from "./Sound.js";
import * as sm2 from "../libs/soundmanager2.js";


class SoundInstance {

    
    constructor(soundAsset, id) {

        this.soundAsset = soundAsset;
        this.id = id;

        this.name = this.soundAsset + "_instance_" + id;
        this.volume = Settings.Game.DEFAULT_SOUND_VOLUME;

        this.currentlyFading = false;
    }


    stop() {
        soundManager.stop(this.name);
    }


    setVolume(volume) { // volume : 0 - 100
        this.volume = volume;
        soundManager.setVolume(this.name, volume);
    }


    fadeIn(length) {
        this.fadeTo(length, Settings.Game.DEFAULT_SOUND_VOLUME);
    }


    fadeOut(length) {
        this.fadeTo(length, 0);
    }


    fadeTo(length, targetVolume) {
        if(this.currentlyFading) {
            for(let fade of Sound.fades) {
                if(fade.name === this.name) {
                    Sound.fades.delete(fade);
                }
            }
        }
        Sound.fades.add({
            name : this.name,
            instance : this,
            timer : 0.0,
            length : length,
            targetVolume : targetVolume
        });
    }

}


export default SoundInstance;