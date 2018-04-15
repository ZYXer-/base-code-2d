function SceneManager() {}


SceneManager.INITIAL_SCENE = null;
SceneManager.SCENE_AFTER_LOADING = null;


SceneManager.scene = null;
SceneManager.nextScene = null;


SceneManager.changeScene = function(newScene) {
    this.nextScene = newScene;
};


SceneManager.update = function() {
    if(SceneManager.scene !== SceneManager.nextScene) {

        SceneManager.callMethod("hide");

        SceneManager.scene = SceneManager.nextScene;
        if(SceneManager.scene.hasOwnProperty("show")) {
            SceneManager.scene.show();
            if(Settings.Size.AUTO_RESIZE) {
                Game.resize();
            }
        }
    }
};


SceneManager.callMethod = function(methodName) {
    if(SceneManager.scene !== null && SceneManager.scene.hasOwnProperty(methodName)) {
        SceneManager.scene[methodName]();
    }
};


SceneManager.callMethodWithParam = function(methodName, parameter) {
    if(SceneManager.scene !== null && SceneManager.scene.hasOwnProperty(methodName)) {
        SceneManager.scene[methodName](parameter);
    }
};