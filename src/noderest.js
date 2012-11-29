#!/usr/bin/env node

var program, arguments, argumentsLength, action, actionList, noderest, fs, path, color, content;

program = require('commander');
fs = require('fs');
path = require('path');
colors = require('colors');

noderest = {
	action : {
		name : '',
		type : '',
		file : ''
	},

	actionList : [
		'new',
		'help',
		'create',
		'set'
	],

	application : {
		name : '',
		description : '',
		version : '',
		path : ''
	},

	setActionDescriptor : function(actionDescriptor)	{
		this.action = actionDescriptor;
	},

	runAction : function()	{
		this.application.path = process.cwd();
		console.log("\n");
		console.log(content.welcome.join('\n').blue);
		switch(this.action.name)	{
			case 'new':
				console.log('\nCreating new Noderest application \n'.green.bold);
				this.promptNewApplication();
				break;

			case 'help':
				console.log('\nNoderest Command Line Help \n'.green.bold);
				console.log(content.help.join('\n').green);
				console.log("\n");
				break;

			case 'controller':
				console.log('\nCreating new Controller \n'.green.bold);
				this.createController();
				break;

			case 'schema':
				console.log('\nCreating new Schema \n'.green.bold);
				this.createSchema();
				break;

			default :
				console.log('** Oops, Wrong Action!!! Try noderest help'.red.bold);
				break;
		}
	},

	createController : function()	{
		var projectFolder, file, temp;

		projectFolder = path.join(this.application.path,"Controller");
		file = path.join(projectFolder, this.action.file)
		file = (file.match('.js')) ? file : file + '.js';

		if(fs.existsSync(projectFolder))	{
			fs.writeFileSync(
				file,
				content.controller.join('\n')
			);
			temp = '** Controller ' + this.action.file + " created @ " + file + "\n";
			console.log(temp.green.bold);
		}else	{
			console.log('** Oops, not a Noderest Folder. Controller folder not found!!!'.red.bold);
		}
	},

	createSchema : function()	{
		var projectFolder, file, temp;

		projectFolder = path.join(this.application.path,"Schema");
		file = path.join(projectFolder, this.action.file)
		file = (file.match('.js')) ? file : file + '.js';

		if(fs.existsSync(projectFolder))	{
			fs.writeFileSync(
				file,
				content.schema.join('\n')
			);
			temp = '** Schema ' + this.action.file + " created @ " + file + "\n";
			console.log(temp.green.bold);
		}else	{
			console.log('** Oops, not a Noderest Folder. Schema folder not found!!!'.red.bold);
		}
	},

	promptNewApplication : function()	{
		var self = this;

		program.prompt({
		  name: '* Name (eg : NoderestApp): ',
		  description: '* Description : ',
		  version: '* Version (eg : 0.0.0) : '
		}, function(input){
			self.application.name = (input.name.replace(' ','') == '') ? "NoderestApp" : input.name.replace(' ','');  
			self.application.description = input.description;
			self.application.version = (input.version == '') ? '0.0.0' : input.version;
			console.log('\n');
			if(self.makeProjectDirectory())	{
				self.makeSubFolders();
				console.log('** Creating package.json.'.green);
				self.createPackageJson();

				console.log('** Project created successfully!!!'.green.bold);
				console.log(content.footer.join('\n').blue);
			}else	{
				console.log('** Oops, Error creating project!!!'.red.bold);
			}
		  	
		  	process.stdin.destroy();
		});
	},

	makeProjectDirectory : function()	{
		var self = this, projectFolder, status = true;

		projectFolder = path.join(self.application.path, self.application.name);
		console.log('Creating Project @ '.green.bold + projectFolder.blue.bold);
		if(!fs.existsSync(projectFolder))	{
			fs.mkdirSync(projectFolder, function()	{
				console.log('** Project created successfully!!!'.green.bold);
				console.log(content.footer.join('\n').blue);
			});		
		}else	{
			status = false;
			console.log('** Folder with same project name exists!!!'.red.bold);
		}
		
		return status;
	},

	makeSubFolders : function()	{
		var self = this;

		projectFolder = path.join(self.application.path, self.application.name);

		self.createConfigurationFolder(projectFolder);
		
		console.log('** Creating Controller folder.'.green);
		fs.mkdirSync(path.join(projectFolder,'Controller'));
		
		console.log('** Creating Schema folder.'.green);
		fs.mkdirSync(path.join(projectFolder,'Schema'));

		console.log('** Creating server.js.'.green);
		self.createServerFile(projectFolder);
	},

	createConfigurationFolder : function(projectFolder)	{
		var configFiles, confPath = path.join(projectFolder,'Configuration'), temp = '';
		configFiles = ["App.js","Route.js"];

		console.log('** Creating Configuration folder.'.green);
		fs.mkdirSync(confPath);
		for(var i = 0; i < configFiles.length; i++)	{
			temp = '** Creating Configuration/'+ configFiles[i] +'.';
			console.log(temp.green);

			fs.writeFileSync(
				path.join(confPath, configFiles[i]),
				content[configFiles[i].replace(".js",'')].join('\n')
			);
		}
	},

	createServerFile : function(projectFolder)	{
		fs.writeFileSync(path.join(projectFolder, 'server.js'), content.server.join('\n'));
	},

	createPackageJson : function()	{
		var packageJson = {}, projectFolder;

		projectFolder = projectFolder = path.join(this.application.path, this.application.name);
		
		packageJson.name = this.application.name;
		packageJson.version = this.application.version;
		packageJson.author = "developer@" + this.application.name.toLowerCase() + '.com',
		packageJson.description = this.application.description;
		packageJson.dependencies = {
			underscore: "1.4.x",
		    mongoose: "3.4.x",
		    restify: "1.4.x"
		};
		packageJson.engines = {
			node: "0.8.x"
		};

		fs.writeFileSync(
			path.join(projectFolder, "package.json"),
			JSON.stringify(packageJson, null, 4)
		);
	}
};

content = {
	App : [
		"module.exports = {",
		"\tserver : {",
		"\t\tport : 8080",
		"\t},",
		"\tmongo : {",
		"\t\tconnectionString : 'mongodb://<username>:<password>@<host>:<port>/<db-name>',",
		"\t\tdbName : 'collectionexchange'",
		"\t}",
		"};"
	],
	Route : [
		"var controllers = {}, server;\n",
		"/** Getting the dependencies modules from parent **/",
		"module.exports.app = module.parent.exports.app;\n",
		"/** Getting server from the parent; **/",
		"server = module.exports.app.server;\n",
		"/**",
		" * Loading Controller modules;",
		" */",
		'require("fs").readdirSync("./Controller/").forEach(function(file) {',
		 	'\tcontrollers[file.replace("Controller.js","")] = require("./../Controller/" + file);',
		"});\n",
		"/**",
		" * Method to open the registered routes;",
		" */",
		"var open = function()	{",
			"\tfor(var route in routeRegister)	{",
				"\t\trouteRegister[route];",
			"\t}",
		"};\n",
		"module.exports = {",
			"\nopen : open,",
			"\ncontrollers : controllers",
		"};\n",

		"var UserRoute = function()	{",
			"\t// Do the routing Here",
		"};\n",
		"var routeRegister = {",
			"\tuser : UserRoute()",
		"};"
	],
	server : [
		"/** Defining module varaibles; **/",
		"var restify, mongoose, underscore, config, route;\n",
		"/** Defining variables; **/",
		"var server, db, schema;\n",
		"/**",
		" * Including dependencies",
		"*/",
		"restify = require('restify');",
		"mongoose = require('mongoose');",
		"underscore = require('underscore');",
		"config = require('./Configuration/App');\n",
		"/**",
		" * Preparing Application server;",
		" */",
		"server = restify.createServer();",
		"server.use(restify.bodyParser());\n",
		"/**",
		" * Preparing and connecting to Mongo Database;",
		" */",
		"mongoose.connect(config.mongo.connectionString);\n",
		"/**",
		" * Binding dependency modules for other tiers",
		" */",
		"module.exports.app = {",
			"\tmongoose : mongoose,",
			"\tserver : server,",
			"\tunderscore : underscore",
		"};\n",
		"/**",
		" * Loading the route file and initializing it.",
		" */",
		"route = require('./Configuration/Route');",
		"route.open();\n",
		"/** Server listening at port 8080 **/",
		"server.listen(config.server.port);"
	],
	welcome : [
		"/**",
		" * Hola Amigos,",
		" * Welcome to Noderest Application Builder!!",
		" * ",
		" * Noderest is a frame built for developing RESTful server powered",
		" * by the mighty nodejs. The frame is also support with Mongoose",
		" * and Underscore. You have the full right to modify the frame.",
		" * ",
		" * src: github.com/jaisonjustus/noderest",
		" */"
	],
	footer : [
		"/**",
		" * Dont forget to run npm install to install the dependencies.",
		" * Also change the mongodb connection string on Configuration/App.js",
		" * else it will show error.",
		" * ENJOY NODEREST, CHEERS!!!!",
		" */"
	],
	help : [
		"Create new App 		: noderest new",
		"Create new Controller 	: noderest controller <controller-name>",
		"Create new Schema 	: noderest schema <schema-name>"
	],
	controller : [
		"var app, mongoose, underscore, schema;\n",
		"/** Acquiring parent export modules; **/",
		"app = module.parent.exports.app;",
		"if(app.server && app.mongoose && app.underscore)	{",
		"\tmongoose = app.mongoose;",
		"\tschema = mongoose.Schema;",
		"\tunderscore = app.underscore;",
		"};\n",
		"module.exports.schema = schema;"
	],
	schema : [
		"module.exports = (function()	{",
				"\tif(module.parent.exports.schema)	{",
					"\t\t/** Define Schema inside the method **/",
					"\t\treturn new module.parent.exports.schema({});",
				"\t}else	{",
					"\t\treturn false;",
				"\t}",
		"})();"
	]
};



arguments = process.argv;
argumentsLength = process.argv.length;

if(argumentsLength >= 3)	{

	var status = true, tempActionDescriptor = {};
	
	if(argumentsLength == 3)	{
		tempActionDescriptor.name = arguments[2];
	}else if(argumentsLength == 4)	{
		tempActionDescriptor.name = arguments[2];
		tempActionDescriptor.file = arguments[3];
	}else	{
		status = false;
		console.log('** Oops, Noderest doesn\'t understand you!!! Try noderest help'.red.bold);
	}

	if(status)	{
		noderest.setActionDescriptor(tempActionDescriptor);
		noderest.runAction(action);
	}
}else	{
	console.log('** Oops, Noderest doesn\'t understand you!!! Try noderest help'.red.bold);
}