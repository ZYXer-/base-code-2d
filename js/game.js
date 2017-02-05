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

Game.state = null;
Game.nextState = null;

Game.paused = false;


Game.start = function() {

    jQuery("#game_box, #game").width(Game.width).height(Game.height);
    canvas.width = Game.width;
    canvas.height = Game.height;

    if(Settings.Size.AUTO_RESIZE) {
        jQuery(window).resize(function() {
            Game.resize();
        });
        Game.resize();
    }

    Keyboard.allowKey(Keyboard.F11);

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

    Game.setState(Settings.States.INITIAL_STATE);
    Game.startLoop();
};


Game.setState = function(state) {
    if(Settings.States.STATES.hasOwnProperty(state)) {
        this.nextState = Settings.States.STATES[state];
    } else {
        alert("ERROR: Could not find state: " + state);
    }
};


Game.startLoop = function() {
    this.interval = window.setInterval(function() {
        Game.loop();
    }, Settings.Game.TIME_PER_FRAME);
};


Game.loop = function() {
    Game.initState();
    Timer.update();
    Mouse.update();
    Game.update();
    Game.draw();
    PerformanceMonitor.update();
};


Game.initState = function() {

    if(Game.state != Game.nextState) {

        if(Game.state != null && Game.state.hasOwnProperty("hide")) {
            Game.state.hide();
        }

        Game.state = Game.nextState;
        if(Game.state.hasOwnProperty("show")) {
            Game.state.show();
            if(Settings.Size.AUTO_RESIZE) {
                Game.resize();
            }
        }
    }
};


Game.update = function() {
    if(Game.state.hasOwnProperty("update")) {
        Game.state.update();
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

    if(Game.state.hasOwnProperty("draw")) {
        Game.state.draw();
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
    jQuery("#paused").show();
};


Game.unpause = function() {
    Game.paused = false;
    jQuery("#paused").hide();
};


Game.pauseUnpause = function() {
    if(Game.paused) {
        Game.unpause();
    } else {
        Game.pause();
    }
};


Game.resize = function() {

    Game.canvasWidth = jQuery(window).width();
    Game.canvasWidth = Utils.limit(Game.canvasWidth, Settings.Size.MIN_WIDTH, Settings.Size.MAX_WIDTH);

    Game.canvasHeight = jQuery(window).height();
    Game.canvasHeight = Utils.limit(Game.canvasHeight, Settings.Size.MIN_HEIGHT, Settings.Size.MAX_HEIGHT);

    jQuery("#game_box, #game").width(Game.canvasWidth).height(Game.canvasHeight);
    canvas.width = Game.canvasWidth;
    canvas.height = Game.canvasHeight;

    Game.width = Game.canvasWidth;
    Game.height = Game.canvasHeight;

    if(Settings.Size.FIXED_ASPECT_RATIO) {
        var aspectRatio = Game.width / Game.height;
        if(aspectRatio > Settings.Size.ASPECT_RATIO) {
            this.frameOffsetX = 0.5 * (Game.width - (Game.height * Settings.Size.ASPECT_RATIO));
            this.frameOffsetY = 0;
        } else {
            this.frameOffsetX = 0;
            this.frameOffsetY = 0.5 * (Game.height - (Game.width / Settings.Size.ASPECT_RATIO));
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

    if(Game.state != null && Game.state.hasOwnProperty("resize")) {
        Game.state.resize();
    }
};


Game.makeFullScreen = function() {
    screenfull.request(jQuery("html")[0]);
};