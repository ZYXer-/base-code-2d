import * as LoadingScene from "./LoadingScene.js";
import * as DemoMenuScene from "./demos/DemoMenuScene.js";
import * as IngameScene from "./IngameScene.js";


export let INITIAL_SCENE;
export let SCENE_AFTER_LOADING;


export function load() {


    // First scene that is shown when game starts, typically loading scene
    INITIAL_SCENE = LoadingScene;


    // Scene that is shown when loading is over
    SCENE_AFTER_LOADING = DemoMenuScene;
    // SceneManager.SCENE_AFTER_LOADING = IngameScene;

}