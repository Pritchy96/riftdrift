var map = {} //Define Object map

//Instance Vars of map
map.material = null;
map.geometry = null;
map.mesh = null
map.noisemap = null;
map.size = 1000;

map.generateMap = function() {
  map.noisemap = generatePoints(map.size, map.size, 4);
  map.geometry = new THREE.PlaneBufferGeometry(map.size, map.size, map.size -1, map.size -1);

  var vertices = map.geometry.attributes.position.array;

  for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
    vertices[ j + 2 ] = Math.pow(map.noisemap[ (i%map.size) ][ Math.floor(i/map.size) ], 2) * 500;
  }

  //map.material = new THREE.MeshDepthMaterial( );
  map.material = new THREE.MeshPhongMaterial( { color: 0x999966, specular: 0x9999CC, shininess: 2, shading: THREE.FlatShading } );
  //map.material = new THREE.MeshLambertMaterial( { color: 0x999966,  } );
  map.geometry.rotateZ(Math.PI);
  map.geometry.center();
  map.geometry.scale(2000, 2000, 2000);
  map.mesh = new THREE.Mesh( map.geometry, map.material);

}



/*
  map.geometry = new THREE.BoxGeometry(1, 1, 1);
  map.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  map.geometry.translate(0, 0, -10);
  map.mesh = new THREE.Mesh( map.geometry, map.material);
  */
