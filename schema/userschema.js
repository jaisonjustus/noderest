module.exports = (function()	{
	if(module.parent.exports.schema)	{
		return new module.parent.exports.schema({
			id : String,
			name : String,
			email : String,
			password : String
		});
	}else	{
		return false;
	}
})();