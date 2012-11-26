/** Defining module varaibles; **/
var restify, mongoose, underscore, config, route;

/** Defining variables; **/
var server, db, schema;

/**
 * Including dependencies
 */
restify = require('restify');
mongoose = require('mongoose');
underscore = require('underscore');
config = require('./Configuration/App');


/**
 * Preparing Application server;
 */
server = restify.createServer();
server.use(restify.bodyParser());

/**
 * Preparing and connecting to Mongo Database;
 */
mongoose.connect(config.mongo.connectionString);

/**
 * Binding dependency modules for other tiers
 */
module.exports.app = {
	mongoose : mongoose,
	server : server,
	underscore : underscore
};

/**
 * Loading the route file and initializing it.
 */
route = require('./Configuration/Route');
route.open();

/** Server listening at port 8080 **/
server.listen(config.server.port);