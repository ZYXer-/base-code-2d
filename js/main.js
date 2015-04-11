var game;

var canvas;
var c;

var resources;
var img;
var fonts;
var sound;
var timer;

var preloadingManager;
var performanceMonitor;

var mouse;
var keyboard;


jQuery(document).ready(function() {

	canvas = document.getElementById("game");
	c = canvas.getContext("2d");
		  
	resources = new Resources();
	img = new Img();
	fonts = new Fonts();
	sound = new Sound();
	timer = new Timer();
	  
	preloadingManager = new PreloadingManager();
	performanceMonitor = new PerformanceMonitor();
	  
	mouse = new Mouse();
	keyboard = new Keyboard();
	  
	game = new Game();
	game.init();
  
});