function Camera() {
  
  this.threeJSCamera;
  
  this.isometricXZ;
  this.isometricY;
  
  this.orthographicZ;
  
  this.raycaster;
  
  
  this.initPerspectiveCamera = function(fieldOfView, nearPlane, farPlane) {
    this.threeJSCamera = new THREE.PerspectiveCamera(
        fieldOfView,
        game.WIDTH / game.HEIGHT,
        nearPlane,
        farPlane
    );
    this.raycaster = new THREE.Raycaster();
  };
  
  
  this.initIsometricCamera = function(width, depthToWidthRatio, nearPlane, farPlane) {
    
    var aspectRatio = game.WIDTH / game.HEIGHT;
    var halfWidth = width / 2.0;
    var halfHeight = (width / aspectRatio) / 2.0;
    this.threeJSCamera = new THREE.OrthographicCamera(
        -halfWidth, halfWidth, 
        halfHeight, -halfHeight,
        nearPlane,
        farPlane
    );
    
    var halfDepth = (farPlane - nearPlane) / 2.0;
    var isometricXZ = Math.sqrt(halfDepth * halfDepth / 3.0);
    var isometricY = Math.sqrt(2.0 * isometricXZ * isometricXZ);
    isometricY *= Math.tan(Math.asin(depthToWidthRatio));
    this.isometricXZ = Math.sqrt(halfDepth * halfDepth / 3.0);
    this.isometricY = Math.sqrt(2.0 * this.isometricXZ * this.isometricXZ);
    this.isometricY *= Math.tan(Math.asin(depthToWidthRatio));
    this.setPosition(this.isometricXZ, this.isometricY, this.isometricXZ);
    this.lookAt(0.0, 0.0, 0.0);
    
    this.raycaster = new THREE.Raycaster();
  };
  
  
  this.initOrthographicCamera = function(scale, nearPlane, farPlane) {
    this.threeJSCamera = new THREE.OrthographicCamera(
        0, game.WIDTH / scale, 
        game.HEIGHT / scale, 0,
        nearPlane,
        farPlane
    );
    
    this.orthographicZ = (farPlane - nearPlane) / 2.0;
    this.setPosition(0.0, 0.0, this.orthographicZ);
    this.lookAt(0.0, 0.0, 0.0);
    
    this.raycaster = new THREE.Raycaster();
  };
  
  
  this.setPosition = function(x, y, z) {
    this.threeJSCamera.position.set(x, y, z);
  };
  
  
  this.getPosition = function(x, y, z) {
    var pos = this.threeJSCamera.position;
    return { x : pos.x, y : pos.y, z : pos.z };
  };
  
  
  this.setRotation = function(x, y, z, order) {
    this.threeJSCamera.rotation = new THREE.Euler(x, y, z, order);
  };
  
  
  this.lookAt = function(x, y, z) {
    this.threeJSCamera.lookAt(new THREE.Vector3(x, y, z));
  };
  
  
  this.isometricLookAt = function(x, y, z) {
    this.setPosition(x + this.isometricXZ, y + this.isometricY, z + this.isometricXZ);
  };
  
  
  this.orthographicLookAt = function(x, y) {
    this.setPosition(x, y, this.orthographicZ);
  };
  
  
  this.getObjectsAtCoords = function(x, y, objects) {
    var vector = new THREE.Vector3();
    vector.x = (2.0 * x / game.WIDTH) - 1.0;
    vector.y = 1.0 - (2.0 * y / game.HEIGHT);
    vector.z = 0.5;
    vector.unproject(this.threeJSCamera);
   this.raycaster.set(this.threeJSCamera.position, vector.sub(this.threeJSCamera.position).normalize());
    //this.raycaster.setFromCamera(vector, this.threeJSCamera);
    return this.raycaster.intersectObjects(objects);
  };
  
}

Camera.ISOMETRIC_30_DEGREES = 0.57735;