function PageVisibility() {}

PageVisibility.visible = true;

PageVisibility.hiddenAttr = "hidden";

PageVisibility.blurHandlers = {};
PageVisibility.focusHandlers = {};


// Source: http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
PageVisibility.init = function() {
    // Standards:
    if(PageVisibility.hiddenAttr in document) {
        document.addEventListener("visibilitychange", PageVisibility.changeEvent);
    } else if((PageVisibility.hiddenAttr = "mozHidden") in document) {
        document.addEventListener("mozvisibilitychange", PageVisibility.changeEvent);
    } else if((PageVisibility.hiddenAttr = "webkitHidden") in document) {
        document.addEventListener("webkitvisibilitychange", PageVisibility.changeEvent);
    } else if((PageVisibility.hiddenAttr = "msHidden") in document) {
        document.addEventListener("msvisibilitychange", PageVisibility.changeEvent);
    } else if("onfocusin" in document) { // IE 9 and lower:
        document.onfocusin = document.onfocusout = PageVisibility.changeEvent;
    }
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = PageVisibility.changeEvent;

    // set the initial state (but only if browser supports the Page Visibility API)
    if(document[PageVisibility.hiddenAttr] !== undefined) {
        PageVisibility.changeEvent({
            type : document[PageVisibility.hiddenAttr] ? "blur" : "focus"
        });
    }
};


PageVisibility.changeEvent = function(evt) {
    var evtMap = {
        focus : true,
        focusin : true,
        pageshow : true,
        blur : false,
        focusout : false,
        pagehide : false
    };

    evt = evt || window.event;
    if(evt.type in evtMap) {
        PageVisibility.visible = evtMap[evt.type];
    } else {
        PageVisibility.visible = this[PageVisibility.hiddenAttr] ? false : true;
    }

    if(PageVisibility.visible) {
        for(var key in PageVisibility.focusHandlers) {
            PageVisibility.focusHandlers[key]();
        }
    } else {
        for(var key in PageVisibility.blurHandlers) {
            PageVisibility.blurHandlers[key]();
        }
    }
};


PageVisibility.registerBlurHandler = function(key, callback) {
    PageVisibility.blurHandlers[key] = callback;
};


PageVisibility.deleteBlurHandler = function(key) {
    if(PageVisibility.blurHandlers.hasOwnProperty(key)) {
        delete this.blurHandlers[key];
    }
};


PageVisibility.registerFocusHandler = function(key, callback) {
    PageVisibility.focusHandlers[key] = callback;
};


PageVisibility.deleteFocusHandler = function(key) {
    if(PageVisibility.focusHandlers.hasOwnProperty(key)) {
        delete this.focusHandlers[key];
    }
};