var map = {} //Define Object map

//Instance Vars of map
map.material = [];
map.geometry = [];
map.mesh = null
map.noisemap = null;
map.gradientmap = null; //creates center-centric (hurr) islands.
map.size = 1000;

map.generateMap = function() {
  //Create basic plane to be modified.
  map.geometry = new THREE.PlaneBufferGeometry(map.size, map.size, map.size -1, map.size -1);
  var vertices = map.geometry.attributes.position.array;  //Get position verts to be modified.
  var colour = new Float32Array(vertices.length * 3); //Create colour buffer.

  //Generate basic maps.
  map.noisemap = noise.generatePoints(map.size, map.size, 12);
  map.gradientmap = noise.makeCircularGradient(map.size, map.size);
  var detailmap = noise.generatePoints(map.size, map.size, 200);

  var scaleValue = 500;  //Scale from 0-1 to real height values.

  for ( var i = 0, j = 0; i < vertices.length; i ++, j += 3 ) {

    var x = i%map.size; var y = Math.floor(i/map.size);
    //Interpolate noise map with gradient map to create general terrain look.
    var height = noise.interpolateVals(map.noisemap[x][y], map.gradientmap[x][y], 0.4, 0.6);
    //exponentialise (Makes taller bits taller).
    height = Math.pow(height, 2);

    //use second noise map to perturb (create texture/dunes)
    //height = noise.interpolateVals(detailmap[x][y], height, 0.005, 1);

    height *= scaleValue; //Scale up to real values from 0-1.

    var maxHeight = Math.pow(1.3, 2); //maximum noisemaValue = 3.
    maxHeight*=scaleValue;
  

    if (height < (maxHeight/10)) {
      //Bare
      colour[j + 0] = 0.447;
      colour[j + 1] = 0.447;
      colour[j + 2] = 0.447;
    } else if (height < (maxHeight/3)) {
      //Grass
      colour[j + 0] = 0.525;
      colour[j + 1] = 0.667;
      colour[j + 2] = 0.298;

      colour[j + 0] = 0.747;
      colour[j + 1] = 0.747;
      colour[j + 2] = 0.747;
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
  map.geometry.scale(200, 200, 200);

  //Attempts to make this work.
  //map.geometry.computeTangents();
  map.geometry.computeFaceNormals();
  map.geometry.computeVertexNormals();
  map.material.needsUpdate = true;
  //map.geometry.buffersNeedUpdate = true;
  //

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