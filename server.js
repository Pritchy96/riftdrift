// Libraries
var express = require('express');
var morgan  = require('morgan');
var exec = require('child_process').exec;

// Create the server instance
var app = express();

// Report connections to console
app.use(morgan('dev'));

// Serve the web content
app.use(express.static('public_html'));

// Converts a serialized location string into a object
function convertLocation(location) {
	location = location.substring(1, location.length-2);
	var elements = location.replace(/\s+/g, " ").split(" ");
	var x = parseFloat(elements[0]);
	var y = parseFloat(elements[1]);
	var z = parseFloat(elements[2]);
	return {"x":x, "y": y, "z": z}
}

// Allow the user to specify their own date for the planet data
app.get('/api/planet_data/:year/:month/:day/:hour', function(req, res) {
	res.set({ 'Content-Type': 'application/json' });
	sendPlanetJSON(res, req, req.params.year, req.params.month, req.params.day, req.params.hour);
});

function sendPlanetJSON(res, req, Year, Month, Day, Hour) {
	var apiCall = "python script/better_skyfield.py " + Year + " " + Month + " " + Day + " " + Hour; 
	var json;
 	exec(apiCall, function(error, stdout, stderr) { res.end(stdout); });
}

// Start the server
var server = app.listen(80, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});
