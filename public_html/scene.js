// Camera view variables
var cameraMode = "DEFAULT";
var target = null;

// OpenGL dark magic
var scene = null;
var camera = null;
var controls = null;
var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
var ambientLight = new THREE.AmbientLight( 0x444444 ); // soft white light

// Invoked when the window loads and the app can be started
$(window).load(function() {
  //Pre scene creation code here.
  map.generateMap();
  // Call the main function to start the app, when window is loaded.
  main();
});

  // Move the camera to face the planet
  updateView();

// Updates the view of the camera
function updateView() {
  console.log("updateView has been invoked.");


  // If there is a target planet then look at the target planet
  if (target != null) {
    // The normalized angle
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(camera.matrix);

    var direction = new THREE.Vector3(0, 0, 1);
    matrix.multiplyVector3(direction);
    // normalized angle
    var newCameraPos = target.position.clone().add(direction.multiplyScalar(0.8*Math.pow(target.diameter,0.8)));
    console.log(newCameraPos);

    // Set the position of the camera to be by the planet
    camera.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z);
  }
}

// The main entry point for the application that gets calleddto start rendering things and other GL stuff.
function main() {
  // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
  // Only enable it if you actually need to.
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);

  // Append the canvas element created by the renderer to document body element.
  document.body.appendChild(renderer.domElement);

  // Create the camera.
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 999999999);

  // Call updateView of the first time so the camera is in the correct position
  updateView();

  // Apply VR headset positional data to camera.
  controls = new THREE.VRControls(camera);

  // Apply VR stereo rendering to renderer.
  var effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  // Create a VR manager helper to enter and exit VR mode.
  var params = { hideButton: false, isUndistorted: false };
  var manager = new WebVRManager(renderer, effect, params);

  // Animation loop
  var lastRender = 0;

  // Create a three.js scene.
  var scene = new THREE.Scene();

  //Lights
  hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
  hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  dirLight.position.set( -1, 0.75, 1 );
  dirLight.position.multiplyScalar(50);
  dirLight.name = "dirlight";
  // dirLight.shadowCameraVisible = true;
  dirLight.castShadow = true;
  dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;
  var d = 300;
  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;
  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.0001;
  dirLight.shadowDarkness = 0.35;
  scene.add( dirLight );

  scene.add( ambientLight );


  //Fog
  scene.fog = new THREE.FogExp2(0xDAFEFE, 0.00004);
  //scene.fog.color.setHSL( 0.51, 0.6, 0.6 );

  scene.add(map.mesh);
  camera.position.set(33417, 40774, 64990)
  camera.lookAt(map.mesh.position);

  //Skybox.
  var skyGeometry = new THREE.SphereGeometry(900000, 60, 40);
  var skyMaterial = new THREE.MeshPhongMaterial( 
        { map: THREE.ImageUtils.loadTexture('asset_src/textures/skySphere.jpg')} );
  skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  skyBox.scale.set(-1, 1, 1);  //Flip so it's internally textured.
  skyBox.eulerOrder = 'XZY';
  skyBox.renderDepth = 1000.0;
  scene.add(skyBox);

  //Water plane.
  var waterGeometry = new THREE.PlaneGeometry(900000, 900000, 1);
  var waterMaterial = new THREE.MeshPhongMaterial( { color: 0x263C49 });
  waterGeometry.center();
  waterGeometry.rotateX(-Math.PI/2)
  waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
  waterPlane.renderDepth = 1000.0;
  waterPlane.translateY(-40000);
  scene.add(waterPlane);

  // Create a VR manager helper to enter and exit VR mode.
  var params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
  };

  var manager = new WebVRManager(renderer, effect, params);

  // Request animation frame loop function
  var lastRender = 0;
  function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    //Move forward.
    camera.translateZ(-100);
    controls.update();

    // Render the scene through the manager.
    manager.render(scene, camera, timestamp);
    requestAnimationFrame(animate);
  }
// Kick off animation loop
animate(performance ? performance.now() : Date.now());
}

// Function that gets called whenever a key is pressed down
function onKey(event) {
  // key 

  switch (event.keyCode)
  {
    case(90): //Z
      controls.zeroSensor();
      break;
    case(87): //W
      camera.translateZ(-100);
      break;
    case(69): //E
      camera.translateZ(-1500);
      break;
    case(83): //S
      camera.translateZ(100);
      break;
    case(77): //M
      if (map.material.wireframe)
        map.material.wireframe = false;
      else
        map.material.wireframe = true;
      break;
  }
}
window.addEventListener('keydown', onKey, true);
