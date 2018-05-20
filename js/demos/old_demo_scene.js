function OldDemoScene() {}



OldDemoScene.show = function() {
    Mouse.left.registerUpArea("backToMenu", 20, 20, 150, 40, function() {
        SceneManager.changeScene(DemoMenuScene);
    });

    demo = new Demo();
    demo.show();
};


OldDemoScene.hide = function() {
    Mouse.left.deleteUpArea("backToMenu");
    demo.hide();
    demo = null;
};


OldDemoScene.resize = function() {
    demo.resize();
};


OldDemoScene.update = function() {
    demo.update();
};


OldDemoScene.draw = function() {

    // fill canvas with white background
    c.fillStyle = "#fff";
    c.fillRect(0, 0, Game.width, Game.height);


    demo.draw();

    // draw title
    Text.draw(Game.centerX, 50, 24, "opensans", "center", "#06C", "Old Demo");

    // draw back to menu button
    c.fillStyle = "#9cf";
    if(Mouse.isOver(20, 20, 150, 40)) {
        c.fillStyle = "#bdf";
    }
    c.fillRect(20, 20, 150, 40);

    // draw button label
    Text.draw(95, 45, 16, "opensans", "center", "#000", "< back to menu");

    // draw tooltip
    Tooltip.draw();
};
