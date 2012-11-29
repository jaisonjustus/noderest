module.exports = (function()	{
	if(module.parent.exports.schema)	{
		return new module.parent.exports.schema({
			id : String,
			name : String,
			email : {
				type: String, 
				index: {
					unique: true, 
					dropDups: true
				}
			},
			password : String
		});
	}else	{
		return false;
	}
})();