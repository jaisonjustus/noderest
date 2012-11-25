var app, mongoose, schema;

/** Schema varaibles ; **/
var UserSchema;

/** Acquiring parent export modules; **/
app = module.parent.exports.app;
if(app.server && app.mongoose)	{
	mongoose = app.mongoose;
	schema = mongoose.Schema;
};

module.exports.schema = schema;

/** Exporting schemas for the controller; **/
UserSchema = require('./../schema/userschema');

/** 
 * Method to check user exist or not;
 */
module.exports.addUserData = function(request, response, next)	{
	if(UserSchema)	{
		var User;

		mongoose.model('user', UserSchema);
		User = mongoose.model('user');

		if(this.checkUserData(request.params.email))	{
			var user = new User();

			user.name = request.params.name;
			user.email = request.params.email;
			user.password = request.params.password;

			user.save(function()	{
				response.send = request.body;
			});
		}else	{
			var response = {
				error : 'user already exist',
				code : 'USER001'
			};

			response.send(response);
		}

	}else	{
		throw new exception("bad schema");
	}
};

module.exports.getUserData = function(request, response, next)	{
	if(UserSchema)	{
		var User;
		console.log('checking...');
		mongoose.model('user', UserSchema);
		User = mongoose.model('user');

		var user = new User();

		if(request.params.name)	{
			// var query = User.find({ 'name': request.params.name });
			//query.select('password');
			var query = User.find();
			query.exec(function (err, user) {
			  if (err) return handleError(err);
			  console.log(user);
			  for(var i = 0; i < user.length; i++)	{
			  	
			  }
			  response.send(user);
			});
		}

	}else	{
		console.log('error');
		throw new exception("bad schema");
	}
};

module.exports.checkUserData = function(email)	{
	var User, query;

	email = (!email) ? false : email;
	User = mongoose.model('user', UserSchema);

	if(email)	{
		query = User.find({
			'email' : email
		});
	}else	{
		query = User.find();
	}

	query.exec(function(error, user)	{
		if(error) return handleError(error);
		if(user.length == 0)	{
			return false;
		}else	{
			return true;
		}
	});
}