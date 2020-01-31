

// General Settings
export const Game = {

    MAX_TIME_PER_FRAME: 0.1,
    TIME_MULTIPLIER: 1.0,

    PAUSE_ON_BLUR: false,
    PREVENT_CONTEXT_MENU: true,

    DEFAULT_SOUND_VOLUME: 50,

    DEBUG: true,
    SHOW_PERFORMANCE_DETAILS: false
};


// Game Window Size
export const Size = {

    WIDTH: 800,
    HEIGHT: 450,

    AUTO_RESIZE: true,
    MIN_WIDTH: 800,
    MIN_HEIGHT: 450,
    MAX_WIDTH: 3840,
    MAX_HEIGHT: 2160,

    FIXED_ASPECT_RATIO: true,
    ASPECT_RATIO: 16.0 / 9.0,
    FRAME_COLOR: "#000",

    FIXED_SIZE_IN_UNITS: false,
    WIDTH_IN_UNITS: 1920,
    HEIGHT_IN_UNITS: 1080
};


// Loading Settings
export const Loading = {

    SOUND_MANAGER_PERCENTAGE: 5,
    IMAGE_PERCENTAGE: 30,
    SOUND_PERCENTAGE: 10,
    PIXEL_FONT_PERCENTAGE: 5,
    WEB_FONT_PERCENTAGE: 10,
    FAKE_PERCENTAGE: 40,

    FAKE_LOADING_TIME: 2.0,

    TIME_BEFORE_SOUND_LOADING_FAIL: 5.0
};