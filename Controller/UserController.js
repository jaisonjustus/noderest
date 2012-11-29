var app, mongoose, underscore, schema;

/** Schema varaibles ; **/
var UserSchema;

/** Acquiring parent export modules; **/
app = module.parent.exports.app;
if(app.server && app.mongoose && app.underscore)	{
	mongoose = app.mongoose;
	schema = mongoose.Schema;
	underscore = app.underscore;
};

module.exports.schema = schema;

/** Exporting schemas for the controller; **/
UserSchema = require('./../Schema/UserSchema');

/** 
 * Method to check user exist or not;
 */
module.exports.addUserDetails = function(request, response, next)	{
	if(UserSchema)	{
		var UserModel, user, reply, attributes;

		attributes = request.params;

		/** Registering User Model; **/
		mongoose.model('user', UserSchema);
		UserModel = mongoose.model('user');

		user = new UserModel();
		user.name = attributes.name;
		user.email = attributes.email;
		user.password = attributes.password;

		user.save(function(error)	{
			if(error)	{
				reply = {
					id : user._id,
					name : user.name,
					email : user.email,
					saved : false
				};
			}else	{
				reply = {
					id : user._id,
					name : user.name,
					email : user.email,
					saved : true
				};
			}

			response.send(reply);
		});
	}else	{
		throw new exception("bad schema");
	}
};

module.exports.getUserDetails = function(request, response, next)	{
	if(UserSchema)	{
		var UserModel, user, reply, attributes;

		attributes = request.params;

		/** Registering User Model; **/
		mongoose.model('user', UserSchema);
		UserModel = mongoose.model('user');

		UserModel.find(attributes,'name email', function(error, user)	{
			reply = user;
			response.send(reply);
		});
	}else	{
		throw new exception("bad schema");
	}
};

module.exports.updateUserDetails = function(request, response, next)	{
	if(UserSchema)	{
		var UserModel, reply, attributes, id;

		attributes = request.params;
		console.log(attributes);
		id = attributes._id;
		delete attributes._id;

		mongoose.model('user', UserSchema);
		UserModel = mongoose.model('user');
		console.log(attributes);

		UserModel.update({ _id : id}, attributes, function(error, user)	{
			console.log(error);
			reply = user;
			response.send(reply);
		});

	}else	{
		response.send({
			error : true,
			code : 'USR-CTRL-0001',
			message : 'Could not connect to the database.',
			debug : 'user schema not found in user controller'
		})
	}
};