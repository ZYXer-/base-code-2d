function DemoMenuScene() {}



DemoMenuScene.show = function() {

    // create array of menu items
    demo = [
        { label : "Physics with Box2D", scene : DemoBox2dScene },
        { label : "Particle systems", scene : DemoParticlesScene },
        { label : "Sound and music", scene : DemoSoundScene },
        { label : "Old demo", scene : OldDemoScene }
    ];

    // register a callback function for left-click events
    Mouse.left.registerUpCallback("demoMenu", function() {
        DemoMenuScene.click();
    });
};


DemoMenuScene.hide = function() {
    // remove the callback function for left-click events
    Mouse.left.deleteUpCallback("demoMenu");
};


DemoMenuScene.resize = function() {
};


DemoMenuScene.click = function() {

    // loop through all menu elements
    for(var i = 0; i < demo.length; i++) {
        var menuElement = demo[i];

        // calculate top left corner of button
        var x = Game.centerX + (250 * Math.floor(i / 6)) - 225;
        var y = 85 + (70 * (i % 6));

        // set button background color
        c.fillStyle = "#9cf";

        // if mouse is over button, change scene
        if(Mouse.isOver(x, y, 200, 50)) {
            SceneManager.changeScene(menuElement.scene);
        }
    }
};


DemoMenuScene.update = function() {
};


DemoMenuScene.draw = function() {

    // fill canvas with white background
    c.fillStyle = "#fff";
    c.fillRect(0, 0, Game.width, Game.height);

    // draw title
    Text.draw(Game.centerX, 50, 24, "opensans", "center", "#06C", "ZYXer's Base Code Demos");

    // loop through all menu elements
    for(var i = 0; i < demo.length; i++) {
        var menuElement = demo[i];

        // calculate top left corner of button
        var x = Game.centerX + (250 * Math.floor(i / 6)) - 225;
        var y = 85 + (70 * (i % 6));

        // set button background color
        c.fillStyle = "#9cf";

        // create hover effect by changing color when mouse is over button
        if(Mouse.isOver(x, y, 200, 50)) {
            c.fillStyle = "#bdf";

            // create mouse down effect by moving button down by two pixels when button is pressed
            if(Mouse.left.down) {
                y += 2;
            }
        }

        // draw button backgrounds
        c.fillRect(x, y, 200, 50);

        // draw button label
        Text.draw(x + 100, y + 32, 16, "opensans", "center", "#000", menuElement.label);

    }
};
