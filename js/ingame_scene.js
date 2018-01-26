function IngameScene() {}



IngameScene.show = function() {

    // do stuff before we update and draw this scene for the first time
};


IngameScene.hide = function() {

    // do stuff before we draw and update the next scene
};


IngameScene.resize = function() {

    // do stuff when window is resized
};


IngameScene.update = function() {

    // update stuff here

    if(!Game.paused) {

        // update stuff except when paused
    }
};


IngameScene.draw = function() {

    // clear scene
    c.fillStyle = "#fff";
    c.fillRect(0, 0, Game.width, Game.height);

    // draw stuff here

    // draw pause screen when paused
    if(Game.paused) {
        c.fillStyle = "rgba(0, 0, 0, 0.8)";
        c.fillRect(0, 0, Game.width, Game.height);
        Text.draw(Game.centerX, 100, 16, "opensans", "center", "#fff", "Paused - Press P to unpause");
    }
};
