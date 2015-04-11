function Renderer() {
  
  this.threeJSRenderer;
  
  
  this.init = function(antiAliasing, showShadows) {
    this.threeJSRenderer = new THREE.WebGLRenderer({
      canvas : document.getElementById("game"),
      antialias : antiAliasing
    });
    this.threeJSRenderer.setSize(game.WIDTH, game.HEIGHT);
    this.setShadows(showShadows);
  };
  
  
  this.setShadows = function(showShadows) {
    this.threeJSRenderer.shadowMapEnabled = showShadows;
    this.threeJSRenderer.shadowMapType = THREE.PCFSoftShadowMap;
  };
  
  
  this.getShadows = function() {
    return this.threeJSRenderer.shadowMapEnabled;
  };
  
  
  this.setClearColor = function(color) {
    this.threeJSRenderer.setClearColor(color);
  };
  
  
  this.render = function(scene, camera) {
    this.threeJSRenderer.render(scene, camera.threeJSCamera);
  };  
  
}