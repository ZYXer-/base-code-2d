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

    var gradient = c.createLinearGradient(0, 0, 0, Game.height);
    gradient.addColorStop(0, "#111");
    gradient.addColorStop(1, "#333");

    c.fillStyle = gradient;
    c.fillRect(0, 0, Game.width, Game.height);

    if(Img.isLoaded("loading")) {
        Img.draw("loading", Game.centerX - 200, Game.centerY - 200);
    }

    c.fillStyle = "#666";
    c.fillRect(Game.centerX - 100, Game.height - 60, 200, 10);

    c.fillStyle = "#eee";
    c.fillRect(Game.centerX - 100, Game.height - 60, 200 * (LoadingScene.percentage / 100.0), 10);

    Text.draw(Game.centerX, Game.height - 70, 16, "sans-serif", "center", "#eee", Math.ceil(LoadingScene.percentage) + "%");
};