function PauseScreen() {}


PauseScreen.draw = function() {

    if(Game.paused) {
        c.fillStyle = "rgba(0, 0, 0, 0.8)";
        c.fillRect(0, 0, Game.width, Game.height);
        Text.draw(Game.centerX, 100, 20, "opensans", "center", "#fff", "Paused - Press P to unpause");
    }

};