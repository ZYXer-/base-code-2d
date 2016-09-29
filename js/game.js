function Game() {

    this.width = 900;
    this.height = 600;

    this.AUTO_RESIZE = true;

    this.MIN_WIDTH = 900;
    this.MIN_HEIGHT = 600;

    this.MAX_WIDTH = 1920;
    this.MAX_HEIGHT = 1080;

    this.centerX = 450;
    this.centerY = 300;

    this.DEBUG = true;

    this.TIME_PER_FRAME = 20;

    this.STATES = {
        "loading" : new LoadingState(),
        "ingame" : new IngameState()
    };

    this.INITIAL_STATE = "loading";

    this.interval = null;

    this.state = null;
    this.nextState = null;

    this.paused = false;
    this.particlesOn = true;


    this.init = function() {

        PageVisibility.init();

        timer.init();
        performanceMonitor.init();

        keyboard.init();
        keyboard.allowKey(Keyboard.F11);
        mouse.init();

        if(this.AUTO_RESIZE) {
            jQuery(window).resize(function() {
                game.resize();
            });
            this.resize();
        }

        keyboard.registerKeyUpHandler(Keyboard.P, function() {
            game.pauseUnpause();
        });

        keyboard.registerKeyUpHandler(Keyboard.M, function() {
            sound.muteUnmute();
        });

        keyboard.registerKeyUpHandler(Keyboard.Q, function() {
            game.particlesOn = !game.particlesOn;
        });

        PageVisibility.registerBlurHandler("pause", function() {
            game.pause();
        });

        for(var stateName in this.STATES) {
            if(this.STATES[stateName].hasOwnProperty("init")) {
                this.STATES[stateName].init();
            }
        }
        this.setState(this.INITIAL_STATE);
        this.startLoop();
    };


    this.setState = function(state) {
        if(this.STATES.hasOwnProperty(state)) {
            this.nextState = this.STATES[state];
        } else {
            alert("ERROR: Could not find state: " + state);
        }
    };


    this.startLoop = function() {
        this.interval = window.setInterval(function() {
            game.loop();
        }, this.TIME_PER_FRAME);
    };


    this.loop = function() {
        this.initState();
        timer.update();
        mouse.update();
        this.update();
        this.draw();
        performanceMonitor.update();
    };


    this.initState = function() {

        if(this.state != this.nextState) {

            if(this.state != null) {
                if(this.state.hasOwnProperty("hide")) {
                    this.state.hide();
                }
            }

            this.state = this.nextState;
            if(this.state.hasOwnProperty("show")) {
                this.state.show();
                if(this.AUTO_RESIZE) {
                    this.resize();
                }
            }
        }
    };


    this.update = function() {
        if(this.state.hasOwnProperty("update")) {
            this.state.update();
        }
    };


    this.draw = function() {
        if(this.state.hasOwnProperty("draw")) {
            this.state.draw();
        }
    };


    this.pause = function() {
        this.paused = true;
        jQuery("#paused").show();
    };


    this.unpause = function() {
        this.paused = false;
        jQuery("#paused").hide();
    };


    this.pauseUnpause = function() {
        if(this.paused) {
            this.unpause();
        } else {
            this.pause();
        }
    };


    this.resize = function() {

        this.width = jQuery(window).width();
        this.width = Utils.limit(this.width, this.MIN_WIDTH, this.MAX_WIDTH);

        this.height = jQuery(window).height();
        this.height = Utils.limit(this.height, this.MIN_HEIGHT, this.MAX_HEIGHT);


        jQuery("#game_box, #game").width(this.width).height(this.height);
        canvas.width = this.width;
        canvas.height = this.height;

        this.centerX = Math.round(this.width / 2.0);
        this.centerY = Math.round(this.height / 2.0);

        if(this.state != null && this.state.hasOwnProperty("resize")) {
            this.state.resize();
        }
    };


    this.makeFullScreen = function() {
        screenfull.request(jQuery("html")[0]);
    };

}