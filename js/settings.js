function Settings() {}



// General Settings
Settings.Game = function() {};

Settings.Game.DEBUG = true;
Settings.Game.TIME_PER_FRAME = 20;
Settings.Game.PAUSE_ON_BLUR = false;



// Game Window Size
Settings.Size = function() {};

Settings.Size.WIDTH = 800;
Settings.Size.HEIGHT = 450;

Settings.Size.AUTO_RESIZE = true;
Settings.Size.MIN_WIDTH = 800;
Settings.Size.MIN_HEIGHT = 450;
Settings.Size.MAX_WIDTH = 1920;
Settings.Size.MAX_HEIGHT = 1080;

Settings.Size.FIXED_ASPECT_RATIO = true;
Settings.Size.ASPECT_RATIO = 16.0 / 9.0;
Settings.Size.FRAME_COLOR = "#000";

Settings.Size.FIXED_SIZE_IN_UNITS = false;
Settings.Size.WIDTH_IN_UNITS = 1920;
Settings.Size.HEIGHT_IN_UNITS = 1080;



// States
Settings.States = function() {};

Settings.States.STATES = {
    "loading" : LoadingState,
    "ingame" : IngameState
};

Settings.States.INITIAL_STATE = "loading";
Settings.States.STATE_AFTER_LOADING = "ingame";



// Loading Settings
Settings.Loading = function() {};

Settings.Loading.SOUND_MANAGER_PERCENTAGE = 5;
Settings.Loading.IMAGE_PERCENTAGE = 30;
Settings.Loading.SOUND_PERCENTAGE = 10;
Settings.Loading.PIXEL_FONT_PERCENTAGE = 5;
Settings.Loading.WEB_FONT_PERCENTAGE = 10;
Settings.Loading.FAKE_PERCENTAGE = 40;

Settings.Loading.FAKE_LOADING_TIME = 2.0;

Settings.Loading.TIME_BEFORE_SOUND_LOADING_FAIL = 5.0;