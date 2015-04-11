function Img() {
  
  this.assets = {};
  
  
  this.get = function(name) {
    return this.assets[name];
  };
  
  
  this.texture = function(name) {
    var tex = new THREE.Texture(this.assets[name]);
    tex.needsUpdate = true;
    return tex;
  }
  
  
  this.material = function(name) {
    return new THREE.MeshLambertMaterial({ map : this.texture(name) });
  };
}