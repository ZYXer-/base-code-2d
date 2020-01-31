

export let allowDefault = false;


let allowKeys = [];

let keyPressed = new Map();

let keyDownHandlers = new Map();
let keyUpHandlers = new Map();


function construct() {
    jQuery(document).keydown(event => {
        if(!allowDefault && allowKeys.indexOf(event.which) === -1) {
            event.preventDefault();
            keyPressed[event.which] = true;
            if(keyDownHandlers.hasOwnProperty(event.which)) {
                keyDownHandlers[event.which].callback();
            }
        }

    }).keyup(event => {
        if(!allowDefault && allowKeys.indexOf(event.which) === -1) {
            event.preventDefault();
            keyPressed[event.which] = false;
            if(keyUpHandlers.hasOwnProperty(event.which)) {
                keyUpHandlers[event.which].callback();
            }
        }
    });

}
construct();


export function isPressed(key) {
    if(!keyPressed.hasOwnProperty(key)) {
        return false;
    }
    return keyPressed[key];
}


export function registerKeyDownHandler(key, callback) {
    keyDownHandlers.set(key, { key, callback });
}


export function deleteKeyDownHandler(key) {
    keyDownHandlers.delete(key);
}


export function registerKeyUpHandler(key, callback) {
    keyUpHandlers.set(key, { key, callback });
}


export function deleteKeyUpHandler(key) {
    keyUpHandlers.delete(key);
}


export function setAllowDefault(newAllowDefault) {
    allowDefault = newAllowDefault;
}


export function allowKey(key) {
    let i = allowKeys.indexOf(key);
    if(i === -1) {
        allowKeys.push(key);
    }
}


export function preventKey(key) {
    let i = allowKeys.indexOf(key);
    if(i > -1) {
        allowKeys.splice(i, 1);
    }
}


export const ARROW_LEFT = 37;
export const ARROW_UP = 38;
export const ARROW_RIGHT = 39;
export const ARROW_DOWN = 40;

export const KEY_0 = 48;
export const KEY_1 = 49;
export const KEY_2 = 50;
export const KEY_3 = 51;
export const KEY_4 = 52;
export const KEY_5 = 53;
export const KEY_6 = 54;
export const KEY_7 = 55;
export const KEY_8 = 56;
export const KEY_9 = 57;

export const A = 65;
export const B = 66;
export const C = 67;
export const D = 68;
export const E = 69;
export const F = 70;
export const G = 71;
export const H = 72;
export const I = 73;
export const J = 74;
export const K = 75;
export const L = 76;
export const M = 77;
export const N = 78;
export const O = 79;
export const P = 80;
export const Q = 81;
export const R = 82;
export const S = 83;
export const T = 84;
export const U = 85;
export const V = 86;
export const W = 87;
export const X = 88;
export const Y = 89;
export const Z = 90;

export const SEMI_COLON = 186;
export const EQUALS = 187;
export const COMMA = 188;
export const DASH = 189;
export const PERIOD = 190;
export const SLASH = 191;
export const OPEN_BRACKET = 219;
export const BACKSLASH = 220;
export const CLOSE_BRACKET = 221;

export const SPACE_BAR = 32;
export const ENTER = 13;
export const BACKSPACE = 8;

export const ESCAPE = 27;
export const TAB = 9;
export const SHIFT = 16;
export const CTRL = 17;
export const ALT = 18;
export const PAUSE = 19;
export const CAPS_LOCK = 20;
export const PAGE_UP = 33;
export const PAGE_DOWN = 34;
export const END = 35;
export const HOME = 36;
export const INSERT = 45;
export const DELETE = 46;

export const F1 = 112;
export const F2 = 113;
export const F3 = 114;
export const F4 = 115;
export const F5 = 116;
export const F6 = 117;
export const F7 = 118;
export const F8 = 119;
export const F9 = 120;
export const F10 = 121;
export const F11 = 122;
export const F12 = 123;