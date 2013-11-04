
/**
	* Node.js Login Boilerplate
	* More Info : http://bit.ly/LsODY8
	* Copyright (c) 2013 Stephen Braitsch
**/

var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app)
var io = require("socket.io").listen(server);

// Display command line arguments
console.log("Usage:")
console.log("	node app [--port|-p number]");
console.log()

// Properties
var port = 8080
// Process command line arguments
process.argv.forEach(function (val, index, array) {
  // console.log(index + ': ' + val);
  
  // Customize port number, "[-p #]"
  if (val === "-p" || val === "--port") {
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

app.configure(function() {
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

server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
})

// Chat
var chat = {
	room: "chat",
	history: [ ]
};
// Socket.io
io.sockets.on('connection', function (socket) {
	
	// Join chat room
	socket.join(chat.room);
	// Broadcast join	
	socket.broadcast.to(chat.room).emit('sendChat', {"name":"Server", "msg": "User joined."});

	socket.on("disconnect", function(data) {
		console.log("Disconnected ");
	});

	socket.on("sendChat", function(data) {
		socket.broadcast.to(chat.room).emit('sendChat', data);
	});

	/*
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
	*/

});


