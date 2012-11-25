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
module.exports.addUser = function(request, response, next)	{
	if(UserSchema)	{
		var User;

		mongoose.model('user', UserSchema);
		User = mongoose.model('user');

		var user = new User();

		user.name = request.params.name;
		user.email = request.params.email;
		user.password = request.params.password;

		user.save(function()	{
			response.send = request.body;
		});

	}else	{
		throw new exception("bad schema");
	}
};

module.exports.checkUser = function(request, response, next)	{
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