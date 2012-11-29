var UserModel = Backbone.Model.extend({
	
	urlRoot: 'http://localhost:8080/user/',
	idAttribute : '_id',

	initialize : function()	{
		console.log('user model initialize');
		
		this.bind('change:name', function()	{
			console.log('name changed to ' + this.get("name"));
		});

		this.bind('change:email', function()	{
			console.log('email change to ' + this.get("email"));
		});
	},

	defaults : {
		_id : null,
		name : 'person',
		email : 'person@email.com',
		password : 'person_password'
	},

	changeName : function(name)	{
		this.set({name : name});
	},

	changeEmail : function(email)	{
		this.set({email : email});
	},

	validate : function(attributes)	{
		if(attributes.password == '12345')	{
			console.log('poor password');
			return "poor password";
		}
	}
});
