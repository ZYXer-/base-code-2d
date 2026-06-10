import * as Settings from "../../Settings.js";
import * as Sound from "../Sound.js";
import Preloader from "./Preloader.js";


class SoundPreloader extends Preloader {


    load(sources) {
        this.sources = sources;

        if (sources.size === 0) {
            this.totalAssets = 1; // prevent division by 0
            this.reportAssetLoaded();
            return;
        }

        this.totalAssets = sources.size;

        for (const [name, source] of sources) {
            const howl = new Howl({
                src: source.source,
                pool: source.instances,
                volume: Settings.Game.DEFAULT_SOUND_VOLUME,
                onload: () => this.reportAssetLoaded(),
                onloaderror: (_, error) => {
                    console.warn("Failed to load sound '" + name + "':", error);
                    this.reportAssetLoaded();
                }
            });
            Sound.add(name, howl);
        }
    }


}


export default SoundPreloader;