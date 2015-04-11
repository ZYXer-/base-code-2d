/**
 *
 * Created by janmeier on 20.01.15.
 */


Shapes3D = function () {

}

Shapes3D.makeHexagon = function (material) {
    var hexagonGeometry = new THREE.Geometry();
    hexagonGeometry.vertices.push(new THREE.Vector3(0.5, 0.0, -0.25));
    hexagonGeometry.vertices.push(new THREE.Vector3(0.5, 0.0, 0.25));
    hexagonGeometry.vertices.push(new THREE.Vector3(0.0, 0.0, -0.5));
    hexagonGeometry.vertices.push(new THREE.Vector3(0.0, 0.0, 0.0));
    hexagonGeometry.vertices.push(new THREE.Vector3(0.0, 0.0, 0.5));
    hexagonGeometry.vertices.push(new THREE.Vector3(-0.5, 0.0, -0.25));
    hexagonGeometry.vertices.push(new THREE.Vector3(-0.5, 0.0, 0.25));
    hexagonGeometry.faces.push(new THREE.Face3(3, 1, 0));
    hexagonGeometry.faces.push(new THREE.Face3(3, 4, 1));
    hexagonGeometry.faces.push(new THREE.Face3(3, 6, 4));
    hexagonGeometry.faces.push(new THREE.Face3(3, 5, 6));
    hexagonGeometry.faces.push(new THREE.Face3(3, 2, 5));
    hexagonGeometry.faces.push(new THREE.Face3(3, 0, 2));

    var hexagon = new THREE.Mesh(hexagonGeometry, material);
    return hexagon;

}


