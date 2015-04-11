/**
 *
 * Created by janmeier on 19.01.15.
 */

function Position2D() {
   this.x = 0;
   this.y = 0;

   this.init = function(x, y) {
      this.x = x;
      this.y = y;
   };

   this.getZ = function(){
      return -(this.x - this.y);

   }
}

Position2D.makePosition = function(x, y) {
   var position = new Position2D();
   position.init(x,y);
   return position;

};

Position2D.Origin = Position2D.makePosition(0, 0);

function Vector3D() {
   this.x = 0;
   this.y = 0;
   this.z = 0;

   this.init = function(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
   };

   this.isOrthogonalToBaseVector = function() {
     return this.x == 0 || this.y == 0 || this.z ==0;
   }


}
Vector3D.makeVector = function(x, y, z) {
   var vector = new Vector3D();
   vector.init(x, y, z);
   return vector;
}


function Tile() {
   this.position = new Position2D();

   this.map;
   this.uniforms;


   this.init = function(x, y, map) {
      this.map = map;
      this.position.init(x,y)
   };
}

function DrawableHexagonTile(tile) {
   this.tile = tile;
   this.shape = null;


   this.update = function(delta){
      var uniforms = this.getUniforms();
      uniforms.time.value += delta;
      uniforms.uCol.value = new THREE.Color( 0xffaa00 );
      uniforms.amplitude.value = Math.sin(timer.lastTime * 0.0005)*0.2;
   };


   this.getShape = function(){
      if (! this.shape){
         this.shape = this.createShape();
      }
      return this.shape;
   };


   this.createShape = function(){
      var material = this.getMaterial();
      var hexagon = Shapes3D.makeHexagon(material);

      var tPosition = this.getTranslatedPosition();
      hexagon.position.set(tPosition.x - this.tile.map.radius, 1, tPosition.y - this.tile.map.radius);
      return hexagon;

   };


   this.getTranslatedPosition = function(){
      if (!this.translatedPosition) {
         this.translatedPosition = this.tile.map.pointInOrthogonalCoordinates(this.tile.position);
      }
      return this.translatedPosition;
   };


   this.getColorCode = function() {
      var distance = this.tile.map.getDistanceToCenter(this.tile.position);
      var color;
      if (distance == 0) {
         color = 0x000000;
      }
      else if (distance == 1) {
         color = 0xFF0000;
      }
      else if (distance == 2) {
         color = 0x00FF00;
      }
      else if (distance == 3) {
         color = 0x0000FF;
      }
      else if (distance == 4) {
         color = 0xFF00FF;
      }
      else {
         color = Math.random() * 0xffffff;
      }
      return color;

   };


   this.getMaterial = function(){
      var material = new THREE.ShaderMaterial({
         uniforms: this.getUniforms(),
         attributes: this.getAttributes(),
         vertexShader: shaders.floatingHexagon.vertex,
         fragmentShader: shaders.floatingHexagon.fragment
      });
      return material;
   };


   this.getUniforms = function(){
      if (!this.uniforms) {
         this.uniforms = {
            time: {type: "f", value: 0},
            "uCol" : { type: "c", value: new THREE.Color( 0xffaa00 ) },
            amplitude: {type: "f", value: 0}
         };
      }
      return this.uniforms;
   };


   this.getAttributes = function(){
      if (!this.attributes) {
         this.attributes = {
            "aX": {type: 'f', value: []},
            "aY": {type: 'f', value: []},
            "aCol" : { type: "c", value:[]}
         };

         var tPosition = this.getTranslatedPosition();
         var color = this.getColorCode();
         for (var v = 0; v < 10; v++) {
            this.attributes.aCol.value.push(new THREE.Color(color));
            this.attributes.aX.value.push(tPosition.x);
            this.attributes.aY.value.push(tPosition.y);
         }
      }
      return this.attributes;
   }
}

