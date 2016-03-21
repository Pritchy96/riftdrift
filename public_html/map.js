var map = {} //Define Object map

//Instance Vars of map
map.material = [];
map.geometry = [];
map.mesh = null
map.noisemap = null;
map.size = 1000;

map.generateMap = function() {
  map.noisemap = generatePoints(map.size, map.size, 2);
  //map.noisemap = makeCircularGradient(map.size, map.size);
  map.geometry = new THREE.PlaneBufferGeometry(map.size, map.size, map.size -1, map.size -1);

  var vertices = map.geometry.attributes.position.array;
  var colour = new Float32Array(vertices.length * 3);
  for ( var i = 0, j = 0; i < vertices.length; i ++, j += 3 ) {
    var noisemapValue = map.noisemap[ (i%map.size) ][ Math.floor(i/map.size)];  //Between 0 and 1.
    var heightMultipler = 20;
    var height = Math.pow(noisemapValue*heightMultipler, 2) ;
    var maxHeight = Math.pow(1*heightMultipler, 2); //maximum noisemaValue = 1.


    if (height < (maxHeight/10)) {
      //Shallow Sea.
      colour[j + 0] = 0.149;
      colour[j + 1] = 0.235;
      colour[j + 2] = 0.286;
    } else if (height < (maxHeight/7)) {
      //SubTropical Desert
      colour[j + 0] = 0.851;
      colour[j + 1] = 0.745;
      colour[j + 2] = 0.553;
    } else if (height < (maxHeight/6)) {
      //Grassland
      colour[j + 0] = 0.525;
      colour[j + 1] = 0.667;
      colour[j + 2] = 0.298;
    } else if (height < (maxHeight/2)) {
      //Bare
      colour[j + 0] = 0.447;
      colour[j + 1] = 0.447;
      colour[j + 2] = 0.447;
    } else {
      //Snow
      colour[j + 0] = 0.980;
      colour[j + 1] = 0.980;
      colour[j + 2] = 0.980;
    }

    //Modfy generated z values of the plane array.
    vertices[ j + 2 ] = height;
  }

  map.geometry.addAttribute('color', new THREE.BufferAttribute(colour, 3));
  //map.material = new THREE.MeshPhongMaterial( { color: 0x999966, specular: 0x9999CC, shininess: 2, shading: THREE.FlatShading } );
  map.material = new THREE.MeshLambertMaterial( {  vertexColors: THREE.VertexColors, shading: THREE.SmoothShading} );
 
  //Adjust position and scale in world.
  map.geometry.rotateX(-Math.PI/2)
  map.geometry.center();
  map.geometry.scale(2000, 2000, 2000);

  //Attempts to make this work.
  map.material.needsUpdate = true;
  map.geometry.computeVertexNormals();
  map.geometry.buffersNeedUpdate = true;
  map.geometry.computeTangents();

  map.mesh = new THREE.Mesh( map.geometry, map.material);
}


/*
  for ( var i = 0; i < map.geometry.faces.length; i ++ ) {

    var face = geometry.faces[ i ];
    face.materials = [ new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) ];

}
*/

/*  

  map.geometry = new THREE.BoxGeometry(1, 1, 1);
  map.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  map.geometry.translate(0, 0, -10);
  map.mesh = new THREE.Mesh( map.geometry, map.material);
  */

/*
  var colour = [];
  for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
    var noisemapValue = map.noisemap[ (i%map.size) ][ Math.floor(i/map.size)];  //Between 0 and 1.
    var heightMultipler = 20;
    var height = Math.pow(noisemapValue*heightMultipler, 2) ;
    var maxHeight = Math.pow(1*heightMultipler, 2); //maximum noisemaValue = 1.
*/