function Scenes() {}


Scenes.load = function() {


    // First scene that is shown when game starts, typically loading scene
    SceneManager.INITIAL_SCENE = LoadingScene;


    // Scene that is shown when loading is over
    SceneManager.SCENE_AFTER_LOADING = DemoMenuScene;
    // SceneManager.SCENE_AFTER_LOADING = IngameScene;

};