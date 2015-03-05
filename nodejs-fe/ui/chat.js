var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var dois = require('./proxy/dois.js');
var url = require('url');
var proxy = require('./proxy/proxyConfig.js');

// Start Express
var express = require("express");
var app = express();


app.set("views", __dirname + "/views");

app.use(express.static(__dirname + '/public'));

app.set("view engine", "jade");


var server = http.createServer(app);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	
	for(var key in socket) {
		console.log('key: ' + key);
	}
	
    //our other events...
	socket.on('setPseudo', function (data) {
	    socket.pseudo = data;
	});
	
	socket.on('message', function (message) {
	    socket.get('pseudo', function (error, name) {
	        var data = { 'message' : message, pseudo : name };
	        socket.broadcast.emit('message', data);
	        console.log("user " + name + " send this : " + message);
	    })
	});
});


/*************************************************************/

app.get('/chat',function(request, response) {
	

	var obj = {};
	obj['user'] = '8xo';
	
	response.render("chat", obj);
	
});

server.listen(1444);
//http.createServer(app).listen('1444');