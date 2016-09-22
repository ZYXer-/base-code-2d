function Keyboard() {

    this.allowDefault = false;
    this.allowKeys = [];

    this.keyPressed = {};

    this.keyDownHandlers = {};
    this.keyUpHandlers = {};


    this.init = function() {
        jQuery(window).keydown(function(event) {
            if(!keyboard.allowDefault && keyboard.allowKeys.indexOf(event.which) == -1) {
                event.preventDefault();
                keyboard.keyPressed[event.which] = true;
                if(keyboard.keyDownHandlers.hasOwnProperty(event.which)) {
                    keyboard.keyDownHandlers[event.which].callback();
                }
            }

        }).keyup(function(event) {
            if(!keyboard.allowDefault && keyboard.allowKeys.indexOf(event.which) == -1) {
                event.preventDefault();
                keyboard.keyPressed[event.which] = false;
                if(keyboard.keyUpHandlers.hasOwnProperty(event.which)) {
                    keyboard.keyUpHandlers[event.which].callback();
                }
            }
        });
    };


    this.isPressed = function(key) {
        if(!this.keyPressed.hasOwnProperty(key)) {
            return false;
        }
        return this.keyPressed[key];
    };


    this.registerKeyDownHandler = function(key, callback) {
        this.keyDownHandlers[key] = { key : key, callback : callback };
    };


    this.deleteKeyDownHandler = function(key) {
        if(this.keyDownHandlers.hasOwnProperty(key)) {
            delete this.keyDownHandlers[key];
        }
    };


    this.registerKeyUpHandler = function(key, callback) {
        this.keyUpHandlers[key] = { key : key, callback : callback };
    };


    this.deleteKeyUpHandler = function(key) {
        if(this.keyUpHandlers.hasOwnProperty(key)) {
            delete this.keyUpHandlers[key];
        }
    };


    this.setAllowDefault = function(allowDefault) {
        this.allowDefault = allowDefault;
    };


    this.allowKey = function(key) {
        var i = this.allowKeys.indexOf(key);
        if(i == -1) {
            this.allowKeys.push(key);
        }
    };


    this.preventKey = function(key) {
        var i = this.allowKeys.indexOf(key);
        if(i > -1) {
            this.allowKeys.splice(i, 1);
        }
    };

}

Keyboard.ARROW_LEFT = 37;
Keyboard.ARROW_UP = 38;
Keyboard.ARROW_RIGHT = 39;
Keyboard.ARROW_DOWN = 40;

Keyboard.KEY_0 = 48;
Keyboard.KEY_1 = 49;
Keyboard.KEY_2 = 50;
Keyboard.KEY_3 = 51;
Keyboard.KEY_4 = 52;
Keyboard.KEY_5 = 53;
Keyboard.KEY_6 = 54;
Keyboard.KEY_7 = 55;
Keyboard.KEY_8 = 56;
Keyboard.KEY_9 = 57;

Keyboard.A = 65;
Keyboard.B = 66;
Keyboard.C = 67;
Keyboard.D = 68;
Keyboard.E = 69;
Keyboard.F = 70;
Keyboard.G = 71;
Keyboard.H = 72;
Keyboard.I = 73;
Keyboard.J = 74;
Keyboard.K = 75;
Keyboard.L = 76;
Keyboard.M = 77;
Keyboard.N = 78;
Keyboard.O = 79;
Keyboard.P = 80;
Keyboard.Q = 81;
Keyboard.R = 82;
Keyboard.S = 83;
Keyboard.T = 84;
Keyboard.U = 85;
Keyboard.V = 86;
Keyboard.W = 87;
Keyboard.X = 88;
Keyboard.Y = 89;
Keyboard.Z = 90;

Keyboard.SEMI_COLON = 186;
Keyboard.EQUALS = 187;
Keyboard.COMMA = 188;
Keyboard.DASH = 189;
Keyboard.PERIOD = 190;
Keyboard.SLASH = 191;
Keyboard.OPEN_BRACKET = 219;
Keyboard.BACKSLASH = 220;
Keyboard.CLOSE_BRACKET = 221;

Keyboard.SPACE_BAR = 32;
Keyboard.ENTER = 13;
Keyboard.BACKSPACE = 8;

Keyboard.ESCAPE = 27;
Keyboard.TAB = 9;
Keyboard.SHIFT = 16;
Keyboard.CTRL = 17;
Keyboard.ALT = 18;
Keyboard.PAUSE = 19;
Keyboard.CAPS_LOCK = 20;
Keyboard.PAGE_UP = 33;
Keyboard.PAGE_DOWN = 34;
Keyboard.END = 35;
Keyboard.HOME = 36;
Keyboard.INSERT = 45;
Keyboard.DELETE = 46;

Keyboard.F1 = 112;
Keyboard.F2 = 113;
Keyboard.F3 = 114;
Keyboard.F4 = 115;
Keyboard.F5 = 116;
Keyboard.F6 = 117;
Keyboard.F7 = 118;
Keyboard.F8 = 119;
Keyboard.F9 = 120;
Keyboard.F10 = 121;
Keyboard.F11 = 122;
Keyboard.F12 = 123;