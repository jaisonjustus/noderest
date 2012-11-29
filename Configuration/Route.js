var controllers = {}, server;

/** Getting the dependencies modules from parent **/
module.exports.app = module.parent.exports.app;

/** Getting server from the parent; **/
server = module.exports.app.server;

/**
 * Loading Controller modules;
 */
require("fs").readdirSync("./Controller/").forEach(function(file) {
 	controllers[file.replace("Controller.js",'')] = require("./../Controller/" + file);
});

/**
 * Method to open the registered routes;
 */
var open = function()	{
	for(var route in routeRegister)	{
		routeRegister[route];
	}	
};

module.exports = {
	open : open,
	controllers : controllers
};

var UserRoute = function()	{
	server.post('/user', controllers.User.addUserDetails);
	server.put('/user/:_id', controllers.User.updateUserDetails);
	server.get('/user/', controllers.User.getUserDetails);
	server.get('/user/:_id', controllers.User.getUserDetails);
	server.get('/user/:name', controllers.User.getUserDetails);
};

var imageRoute = function()	{
		server.post('/images', function(request, response, next)	{
		var file;

		file = require('fs')

		file.readFile(request.files.file.path, function (err, data) {
		  // ...
		  var newPath = __dirname + "/upload/" + request.files.file.name;
		  console.log(newPath, data);
		  file.writeFile(newPath, data, function (err) {
		    response.send({});
		  });
		});
	});

	server.get('/images/', function(request, response, next)	{
		response.send({});
	});
};

var routeRegister = {
	user : UserRoute(),
	image : imageRoute()
};

