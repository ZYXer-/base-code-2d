import { c } from "../core/canvas.js";
import * as Viewport from "../core/Viewport.js";
import * as Mouse from "../core/input/Mouse.js";
import * as SceneManager from "../core/SceneManager.js";
import * as DemoBox2dScene from "./DemoBox2dScene.js";
import * as DemoParticlesScene from "./DemoParticlesScene.js";
import * as DemoSoundScene from "./DemoSoundScene.js";
import * as OldDemoScene from "./OldDemoScene.js";
import Button from "../utils/Button.js";
import Text from "../utils/Text.js";


let demoSceneOptions;
let buttons = new Set();
let backButton = null;


export function show() {

    // create array of menu items
    demoSceneOptions = new Set([
        { label : "Physics with Box2D", scene : DemoBox2dScene },
        { label : "Particle systems", scene : DemoParticlesScene },
        { label : "Sound and music", scene : DemoSoundScene },
        { label : "Old demo", scene : OldDemoScene }
    ]);

    let position = 0;
    for(let option of demoSceneOptions) {
        buttons.add(new Button({
            x: Viewport.centerX + (250 * Math.floor(position / 6)) - 225,
            y: 85 + (70 * (position % 6)),
            w: 200,
            h: 50,
            click() {
                SceneManager.changeScene(option.scene);
            },
            draw(x, y, w, h, isOver, down) {
                c.fillStyle = "#9cf";
                if(isOver) {
                    c.fillStyle = "#bdf";
                    if(down) {
                        y += 2;
                    }
                }
                c.fillRect(x, y, w, h);
                Text.draw(x + (w / 2), y + 32, 16, "opensans", "center", "#000", option.label);
            }
        }));
        position++;
    }
}


export function hide() {
}


export function resize() {
}


export function click() {
}


export function update() {
}


export function draw() {

    // fill canvas with white background
    c.fillStyle = "#fff";
    c.fillRect(0, 0, Viewport.width, Viewport.height);

    // draw title
    Text.draw(Viewport.centerX, 50, 24, "opensans", "center", "#06C", "ZYXer's Base Code Demos");

    for(let button of buttons) {
        button.draw();
    }
}


export function getBackButton(targetScene) {
    if(backButton === null) {
        backButton = new Button({
            x: 20,
            y: 20,
            w: 150,
            h: 40,
            click() {
                SceneManager.changeScene(targetScene);
            },
            draw(x, y, w, h, isOver, down) {
                c.fillStyle = "#9cf";
                if(isOver) {
                    c.fillStyle = "#bdf";
                    if(down) {
                        y += 2;
                    }
                }
                c.fillRect(x, y, w, h);
                Text.draw(x + (w / 2), y + 25, 16, "opensans", "center", "#000", "< back to menu");
            }
        })
    }
    return backButton;
}