function Game() {}

Game.canvasWidth = Settings.Size.WIDTH;
Game.canvasHeight = Settings.Size.HEIGHT;

Game.width = Settings.Size.WIDTH;
Game.height = Settings.Size.HEIGHT;

Game.centerX = Math.round(Game.width / 2.0);
Game.centerY = Math.round(Game.height / 2.0);

Game.frameOffsetX = 0;
Game.frameOffsetY = 0;

Game.scaleX = 1.0;
Game.scaleY = 1.0;

Game.interval = null;

Game.paused = false;


Game.start = function() {

    jQuery("#game_box, #game").width(Game.width).height(Game.height);
    canvas.width = Game.width;
    canvas.height = Game.height;

    jQuery(window).ready(function() {
        window.onresize = function() {
            Game.resize();
        };
        Game.resize();
    });

    Keyboard.allowKey(Keyboard.F5);
    Keyboard.allowKey(Keyboard.F12);
    Keyboard.registerKeyUpHandler(Keyboard.F11, function() {
        Game.toggleFullScreen();
    });

    Keyboard.registerKeyUpHandler(Keyboard.P, function() {
        Game.pauseUnpause();
    });

    Keyboard.registerKeyUpHandler(Keyboard.M, function() {
        Sound.muteUnmute();
    });

    Keyboard.registerKeyUpHandler(Keyboard.Q, function() {
        ParticleSystem.particlesOn = !ParticleSystem.particlesOn;
    });

    if(Settings.Game.PAUSE_ON_BLUR) {
        PageVisibility.registerBlurHandler("pause", function() {
            Game.pause();
        });
    }

    PageVisibility.registerFocusHandler("resize", function() {
        Game.resize();
    });

    SceneManager.init();
    SceneManager.changeScene(SceneManager.INITIAL_SCENE);
    Game.loop();
};


Game.loop = function() {

    var requestAnimationFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame;
    requestAnimationFrame(Game.loop);

    SceneManager.update();
    Timer.update();
    Mouse.update();
    Game.update();
    Game.draw();
    PerformanceMonitor.update();
};


Game.update = function() {
    if(SceneManager.scene.hasOwnProperty("update")) {
        SceneManager.scene.update();
    }
};


Game.draw = function() {

    if(Settings.Size.FIXED_ASPECT_RATIO) {
        c.save();
        c.translate(this.frameOffsetX, this.frameOffsetY);
    }
    if(Settings.Size.FIXED_SIZE_IN_UNITS) {
        c.save();
        c.scale(Game.scaleX, Game.scaleY);
    }

    if(SceneManager.scene.hasOwnProperty("draw")) {
        SceneManager.scene.draw();
    }

    if(Settings.Size.FIXED_SIZE_IN_UNITS) {
        c.restore();
    }
    if(Settings.Size.FIXED_ASPECT_RATIO) {
        c.restore();

        c.fillStyle = Settings.Size.FRAME_COLOR;

        c.fillRect(-10, -10, Game.canvasWidth + 20, Game.frameOffsetY + 10);
        c.fillRect(-10, -10, Game.frameOffsetX + 10, Game.canvasHeight + 20);
        c.fillRect(Game.canvasWidth - Game.frameOffsetX, -10, Game.frameOffsetX + 10, Game.canvasHeight + 20);
        c.fillRect(-10, Game.canvasHeight - Game.frameOffsetY, Game.canvasWidth + 20, Game.frameOffsetY + 10);
    }
};


Game.pause = function() {
    Game.paused = true;
};


Game.unpause = function() {
    Game.paused = false;
};


Game.pauseUnpause = function() {
    if(Game.paused) {
        Game.unpause();
    } else {
        Game.pause();
    }
};


Game.resize = function() {

    var devicePixelRatio = window.devicePixelRatio || 1;

    var cssWidth = jQuery(window).width();
    var cssHeight = jQuery(window).height();

    cssWidth = Utils.limit(cssWidth, Settings.Size.MIN_WIDTH / devicePixelRatio, Settings.Size.MAX_WIDTH / devicePixelRatio);
    cssHeight = Utils.limit(cssHeight, Settings.Size.MIN_HEIGHT / devicePixelRatio, Settings.Size.MAX_HEIGHT / devicePixelRatio);

    jQuery("#game_box, #game").width(cssWidth).height(cssHeight);

    Game.canvasWidth = cssWidth * devicePixelRatio;
    Game.canvasWidth = Utils.limit(Game.canvasWidth, Settings.Size.MIN_WIDTH, Settings.Size.MAX_WIDTH);

    Game.canvasHeight = cssHeight * devicePixelRatio;
    Game.canvasHeight = Utils.limit(Game.canvasHeight, Settings.Size.MIN_HEIGHT, Settings.Size.MAX_HEIGHT);

    canvas.width = Game.canvasWidth;
    canvas.height = Game.canvasHeight;

    Game.width = Game.canvasWidth;
    Game.height = Game.canvasHeight;

    if(Settings.Size.FIXED_ASPECT_RATIO) {
        var aspectRatio = Game.width / Game.height;
        if(aspectRatio > Settings.Size.ASPECT_RATIO) {
            this.frameOffsetX = Math.round(0.5 * (Game.width - (Game.height * Settings.Size.ASPECT_RATIO)));
            this.frameOffsetY = 0;
        } else {
            this.frameOffsetX = 0;
            this.frameOffsetY = Math.round(0.5 * (Game.height - (Game.width / Settings.Size.ASPECT_RATIO)));
        }
        Game.width -= 2.0 * this.frameOffsetX;
        Game.height -= 2.0 * this.frameOffsetY;
    }

    if(Settings.Size.FIXED_SIZE_IN_UNITS) {
        Game.scaleX = (Game.canvasWidth - (2.0 * this.frameOffsetX)) / Settings.Size.WIDTH_IN_UNITS;
        Game.scaleY = (Game.canvasHeight - (2.0 * this.frameOffsetY)) / Settings.Size.HEIGHT_IN_UNITS;

        Game.width /= Game.scaleX;
        Game.height /= Game.scaleY;
    }

    Game.centerX = Math.round(Game.width / 2.0);
    Game.centerY = Math.round(Game.height / 2.0);

    if(SceneManager.scene !== null && SceneManager.scene.hasOwnProperty("resize")) {
        SceneManager.scene.resize();
    }
};


Game.isFullScreen = function() {
    return screenfull.isFullscreen;
};


Game.toggleFullScreen = function() {
    screenfull.toggle(jQuery("html")[0]);
};


Game.makeFullScreen = function() {
    screenfull.request(jQuery("html")[0]);
};


Game.exitFullScreen = function() {
    screenfull.exit();
};