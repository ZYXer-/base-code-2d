function SceneManager() {}


SceneManager.scene = null;
SceneManager.nextScene = null;


SceneManager.init = function() {
    SceneManager.INITIAL_SCENE = LoadingScene;
    SceneManager.SCENE_AFTER_LOADING = DemoMenuScene;
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