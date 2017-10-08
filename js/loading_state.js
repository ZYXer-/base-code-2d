function LoadingState() {}


LoadingState.percentage = 0;


LoadingState.show = function() {
    PreloadingManager.preload();
};


LoadingState.hide = function() {
};


LoadingState.update = function() {
    PreloadingManager.update();
    LoadingState.percentage = PreloadingManager.getPercentageLoaded();
};


LoadingState.draw = function() {

    c.fillStyle = "#ccc";
    c.fillRect(0, 0, Game.width, Game.height);

    if(Img.isLoaded("loading")) {
        Img.draw("loading", Game.centerX - 150, Game.centerY - 100);
    }

    c.fillStyle = "#fff";
    c.fillRect(Game.centerX - 100, Game.height - 60, 200, 10);

    c.fillStyle = "#000";
    c.fillRect(Game.centerX - 100, Game.height - 60, 200 * (LoadingState.percentage / 100.0), 10);

    Text.draw(Game.centerX, Game.height - 70, 16, "sans-serif", "center", "#000", Math.ceil(LoadingState.percentage) + "%");
};