function SceneManager() {}


SceneManager.scene = null;
SceneManager.nextScene = null;


SceneManager.init = function() {

    // First scene that is shown when game starts, typically loading scene
    SceneManager.INITIAL_SCENE = LoadingScene;

    // Scene that is shown when loading is over
    SceneManager.SCENE_AFTER_LOADING = DemoMenuScene;
    // SceneManager.SCENE_AFTER_LOADING = IngameScene;

};


SceneManager.changeScene = function(newScene) {
    this.nextScene = newScene;
};


SceneManager.update = function() {
    if(SceneManager.scene !== SceneManager.nextScene) {

        if(SceneManager.scene !== null && SceneManager.scene.hasOwnProperty("hide")) {
            SceneManager.scene.hide();
        }

        SceneManager.scene = SceneManager.nextScene;
        if(SceneManager.scene.hasOwnProperty("show")) {
            SceneManager.scene.show();
            if(Settings.Size.AUTO_RESIZE) {
                Game.resize();
            }
        }
    }
};