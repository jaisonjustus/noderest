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
//schema = mongoose.Schema;

module.exports.app = {
	mongoose : mongoose,
	server : server
};

var logincontroller = require("./controller/usercontroller");
server.post('/user', logincontroller.addUser);
server.get('/user/:name', logincontroller.checkUser);

/** Server listening at port 8080 **/
server.listen(8080);