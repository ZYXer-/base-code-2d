export let visible = true;

const blurHandlers = {};
const focusHandlers = {};


export function registerBlurHandler(key, callback) {
    blurHandlers[key] = callback;
}


export function deleteBlurHandler(key) {
    if (Object.hasOwn(blurHandlers, key)) {
        delete blurHandlers[key];
    }
}


export function registerFocusHandler(key, callback) {
    focusHandlers[key] = callback;
}


export function deleteFocusHandler(key) {
    if (Object.hasOwn(focusHandlers, key)) {
        delete focusHandlers[key];
    }
}


function changeEvent(evt) {
    const evtMap = {
        focus: true,
        pageshow: true,
        blur: false,
        pagehide: false
    };

    if (evt.type in evtMap) {
        visible = evtMap[evt.type];
    } else {
        visible = !document.hidden;
    }

    if (visible) {
        for (const key in focusHandlers) {
            focusHandlers[key]();
        }
    } else {
        for (const key in blurHandlers) {
            blurHandlers[key]();
        }
    }
}


function construct() {
    document.addEventListener("visibilitychange", changeEvent);
    window.addEventListener("focus", changeEvent);
    window.addEventListener("blur", changeEvent);
    window.addEventListener("pageshow", changeEvent);
    window.addEventListener("pagehide", changeEvent);

    changeEvent({ type: document.hidden ? "blur" : "focus" });
}
construct();
