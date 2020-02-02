import * as Keyboard from "./core/input/Keyboard.js";
import * as Game from "./core/Game.js";
import * as Viewport from "./core/Viewport.js";
import * as Sound from "./core/Sound.js";
import ParticleSystem from "./utils/ParticleSystem.js";


export const allowDefaultBehavior = [

    // These keys will perform default browser behavior when pressed

    Keyboard.F5,
    Keyboard.F12
];


export function loadCustomBehavior()  {

    // Define custom keyboard key behaviors

    Keyboard.registerKeyUpHandler(Keyboard.F11, function() {
        Viewport.toggleFullScreen();
    });

    Keyboard.registerKeyUpHandler(Keyboard.P, function() {
        Game.pauseUnpause();
    });

    Keyboard.registerKeyUpHandler(Keyboard.M, function() {
        Sound.muteUnmute();
    });

    Keyboard.registerKeyUpHandler(Keyboard.Q, function() {
        ParticleSystem.particlesOn = !ParticleSystem.particlesOn;
    });

}