function LoadingScene() {}


LoadingScene.percentage = 0;


LoadingScene.show = function() {
    PreloadingManager.preload();
};


LoadingScene.hide = function() {
};


LoadingScene.update = function() {
    PreloadingManager.update();
    LoadingScene.percentage = PreloadingManager.getPercentageLoaded();
};


LoadingScene.draw = function() {

    c.fillStyle = "#ccc";
    c.fillRect(0, 0, Game.width, Game.height);

    if(Img.isLoaded("loading")) {
        Img.draw("loading", Game.centerX - 150, Game.centerY - 100);
    }

    c.fillStyle = "#fff";
    c.fillRect(Game.centerX - 100, Game.height - 60, 200, 10);

    c.fillStyle = "#000";
    c.fillRect(Game.centerX - 100, Game.height - 60, 200 * (LoadingScene.percentage / 100.0), 10);

    Text.draw(Game.centerX, Game.height - 70, 16, "sans-serif", "center", "#000", Math.ceil(LoadingScene.percentage) + "%");
};