function EmptyScene() {}


EmptyScene.show = function() {


    // do stuff before we update and draw this scene for the first time


};


EmptyScene.hide = function() {


    // do stuff before we draw and update the next scene


};


EmptyScene.resize = function() {


    // do stuff when window is resized


};


EmptyScene.click = function() {


    // do stuff when left mouse button is clicked


};


EmptyScene.update = function() {

    // reset tooltip content
    Tooltip.reset();



    // update stuff here



    if(!Game.paused) {



        // update stuff except when paused



    }
};


EmptyScene.draw = function() {

    // clear scene
    c.fillStyle = "#fff";
    c.fillRect(0, 0, Game.width, Game.height);



    // draw stuff here



    // draw tooltip
    Tooltip.draw();

    // draw pause screen when paused
    PauseScreen.draw();
};
