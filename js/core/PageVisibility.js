

export let visible = true;

let hiddenAttr = "hidden";

const blurHandlers = {};
const focusHandlers = {};


function construct() {
    // Source: http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active

    // Standards:
    if(hiddenAttr in document) {
        document.addEventListener("visibilitychange", changeEvent);
    } else if((hiddenAttr = "mozHidden") in document) {
        document.addEventListener("mozvisibilitychange", changeEvent);
    } else if((hiddenAttr = "webkitHidden") in document) {
        document.addEventListener("webkitvisibilitychange", changeEvent);
    } else if((hiddenAttr = "msHidden") in document) {
        document.addEventListener("msvisibilitychange", changeEvent);
    } else if("onfocusin" in document) { // IE 9 and lower:
        document.onfocusin = document.onfocusout = changeEvent;
    }
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = changeEvent;

    // set the initial state (but only if browser supports the Page Visibility API)
    if(document[hiddenAttr] !== undefined) {
        changeEvent({
            type : document[hiddenAttr] ? "blur" : "focus"
        });
    }
}
construct();


export function registerBlurHandler(key, callback) {
    blurHandlers[key] = callback;
}


export function deleteBlurHandler(key) {
    if(blurHandlers.hasOwnProperty(key)) {
        delete blurHandlers[key];
    }
}


export function registerFocusHandler(key, callback) {
    focusHandlers[key] = callback;
}


export function deleteFocusHandler(key) {
    if(focusHandlers.hasOwnProperty(key)) {
        delete focusHandlers[key];
    }
}


function changeEvent(evt) {
    let evtMap = {
        focus : true,
        focusin : true,
        pageshow : true,
        blur : false,
        focusout : false,
        pagehide : false
    };

    evt = evt || window.event;
    if(evt.type in evtMap) {
        visible = evtMap[evt.type];
    } else {
        visible = document[hiddenAttr];
    }

    if(visible) {
        for(let key in focusHandlers) {
            focusHandlers[key]();
        }
    } else {
        for(let key in blurHandlers) {
            blurHandlers[key]();
        }
    }
}