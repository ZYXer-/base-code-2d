function IngameState() {}



IngameState.show = function() {

    // do stuff before we start in-game state, example:

    demo = new Demo();
    demo.show();
};


IngameState.hide = function() {

    // do stuff before we end in-game state, example:

    demo.hide();
};


IngameState.resize = function() {

    // do stuff when window is resized, example:

    demo.resize();
};


IngameState.update = function() {

    // update stuff here:

    if(!Game.paused) {
        demo.update();
    }
};


IngameState.draw = function() {

    c.fillStyle = "#fff";
    c.fillRect(0, 0, Game.width, Game.height);

    // draw stuff here, examples:

    demo.draw();

    if(Game.paused) {
        demo.drawPausedScreen();
    }
};
