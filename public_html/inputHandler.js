//Listen for keyboard event.
onKeyDown : function(event) {
  event.preventDefault();

  if (event.keyCode == 16) { // Shift
    camera.translateZ(20); //Update camera, move player.
  }

  else if (event.keyCode == 90) { // Z
    controls.zeroSensor();  //Zero positional sensor.
  }   
}