function LoadingState() {}


LoadingState.percentage = 0;


LoadingState.show = function() {
    PreloadingManager.preload();
};


LoadingState.hide = function() {
    jQuery("#loading").hide();
};


LoadingState.update = function() {
    PreloadingManager.update();
    LoadingState.percentage = PreloadingManager.getPercentageLoaded();
};


LoadingState.draw = function() {
    jQuery("#loading_text").text(Math.ceil(LoadingState.percentage) + "%");
    jQuery("#loading_bar").width(jQuery("#loading_bar_box").width() * (LoadingState.percentage / 100.0));
};