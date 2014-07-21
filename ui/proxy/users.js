console.log('Loading users js');

var express = require('express');
var app = express();
var http = require('http');

var proxy = require('./proxyConfig.js');


var userHelper = function(request, response) {

	var options = {
      host: proxy.serviceHost,
      port: proxy.servicePort,
      path: "/sws/user?uname=" + request.params.user_id,
      method: 'GET'
    };

    var req = http.request(options, function(resp) {
    
	var responseData = '';
	resp.on('data', function(chunk) {
        responseData += chunk;
	});

	resp.on('end', function() {
		console.log('users responseData: ' + responseData);
        var userObj = JSON.parse(responseData);
        response.render("workspace", userObj);
	});

	resp.on('error', function(e) {
        response.send('error: ' + e);
      });
      
    });
    	 
    req.end();
		    	 
	
};


module.exports.userHelper = userHelper;


