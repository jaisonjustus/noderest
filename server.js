var restify, mongoose, config;

var server, db, schema;

/**
 * Including dependencies
 */
restify = require('restify');
mongoose = require('mongoose');
config = require('./config');

/**
 * Preparing Application server and Database connection;
 */
server = restify.createServer();
server.use(restify.bodyParser());
mongoose.connect(config.mongo.connectionString);

module.exports.app = {
	mongoose : mongoose,
	server : server
};

var logincontroller = require("./controller/usercontroller");
server.post('/user', logincontroller.addUserData);
server.get('/user/:id', logincontroller.getUserData);

/** Server listening at port 8080 **/
server.listen(8080);