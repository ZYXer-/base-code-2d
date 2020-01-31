import * as Settings from "../../Settings.js";
import * as Sound from "../Sound.js";
import * as sm2 from "../../libs/soundmanager2.js";
import Preloader from "./Preloader.js";
import SoundInstance from "../SoundInstance.js";


class SoundPreloader extends Preloader {


    load(sources) {
        this.sources = sources;
        for(let [_, source] of this.sources) {
            this.totalAssets += source.instances;
        }

        if(this.totalAssets === 0) {
            this.totalAssets = 1; // prevent division by 0
            this.reportAssetLoaded();
            return;
        }

        for(let [name, source] of this.sources) {
            let newSound = {
                nextInstance : 0,
                numOfInstances : source.instances,
                instances : []
            };
            for(let i = 0; i < source.instances; i++) {
                soundManager.createSound({
                    id : name + "_instance_" + i,
                    url : source.source,
                    autoLoad : true,
                    volume : Settings.Game.DEFAULT_SOUND_VOLUME,
                    multiShot : false,
                    onload : () => {
                        this.reportAssetLoaded();
                    }
                });
                newSound.instances.push(new SoundInstance(name, i));
            }
            Sound.add(name, newSound);
        }
    }

}


export default SoundPreloader;