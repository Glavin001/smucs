
/**
	* Node.js Login Boilerplate
	* More Info : http://bit.ly/LsODY8
	* Copyright (c) 2013 Stephen Braitsch
**/

var express = require('express');
var http = require('http');
var app = express();

// Properties
var port = 8080
// Process command line arguments
process.argv.forEach(function (val, index, array) {
  // console.log(index + ': ' + val);
  
  // Customize port number, "[-p #]"
  if (val == "-p") {
  	//
  	var newPort = parseInt( array[index+1] );
  	if (! isNaN(newPort )) {
  		//console.log("New port #:", newPort);
  		port = newPort;
  	} else {
  		console.error("Invalid custom port number: ", newPort);
  	}
  }

}); 

app.configure(function(){
	app.set('port', port);
	app.set('views', __dirname + '/app/server/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
//	app.use(express.favicon());
//	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'super-duper-secret-secret' }));
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
	app.use(express.static(__dirname + '/app/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

require('./app/server/router')(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
})