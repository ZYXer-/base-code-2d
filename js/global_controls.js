function GlobalControls() {}


// These keys will perform default browser when pressed

GlobalControls.allowDefaultBehavior = [
    Keyboard.F5,
    Keyboard.F12
];


// Define custom keyboard key behaviors

GlobalControls.loadCustomBehavior = function()  {

    Keyboard.registerKeyUpHandler(Keyboard.F11, function() {
        Game.toggleFullScreen();
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

};