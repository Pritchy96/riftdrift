// Camera view variables
var cameraMode = "DEFAULT";
var target = null;

// OpenGL dark magic
var scene = null;
var camera = null;
var controls = null;

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
  var renderer = new THREE.WebGLRenderer({antialias: false});
  renderer.setPixelRatio(window.devicePixelRatio);

  // Append the canvas element created by the renderer to document body element.
  document.body.appendChild(renderer.domElement);

  // Create the camera.
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 0;

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
  scene.add( new THREE.AmbientLight(0x444444));

  //Skybox.
  var geometry = new THREE.SphereGeometry(9000, 60, 40);
  var material = new THREE.MeshPhongMaterial( { map: 
  THREE.ImageUtils.loadTexture('asset_src/textures/skySphere.jpg') } );
  skyBox = new THREE.Mesh(geometry, material);
  skyBox.scale.set(-1, 1, 1);  //Flip so it's internally textured.
  skyBox.eulerOrder = 'XZY';
  skyBox.renderDepth = 1000.0;
  scene.add(skyBox);

  scene.add(map.mesh);

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
  // key ','
  if (event.keyCode == 90 /*z*/){	    
    controls.zeroSensor();
  } else if (event.keyCode == 87) {
    camera.translateZ(-2);
  }
  
}
window.addEventListener('keydown', onKey, true);
