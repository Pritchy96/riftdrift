var map = {} //Define Object map

//Instance Vars of map
map.material = null;
map.geometry = null;
map.mesh = null

map.generateMap = function() {
  map.geometry = new THREE.BoxGeometry(1, 1, 1);
  map.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  map.mesh = new THREE.Mesh( map.geometry, map.material);
}
