console.log('Loading associationsfeed js');

var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var proxy = require('./proxyConfig.js');

var data = require('../data/firewall_sources.js');

var counter = 0;
var counter2 = 0;
var counter3 = 0;

var associations = [];

var association = {
					'name' : 'association1', 
					'source' : 'resource1',
					'target' : 'resource2'
				  };

associations.push(association);

var associations2 = [];

var association2 = {
					'name' : 'association2', 
					'source' : 'resource2',
					'target' : 'resource2'
				  };

associations2.push(association2);


var feed1 = function(request, response) {

	counter = counter + 1;
	
	console.log('output for server1 ' + counter + ' ' + (counter % 1000));
	
	if(counter > 10) {
		counter = 0;
		
		var d = new Date();
		var n = d.getMilliseconds(); 
		
		//get the associations
		var returnedAssocations = associations;
		
		var association = {
				'name' : 'association-1-' + n, 
				'source' : 'resource-1-' + n,
				'target' : 'resource-1-' + n
			  };

		associations.push(association);
		
		response.send(returnedAssocations);
	}
	
};

module.exports.feed1 = feed1;

var feed2 = function(request, response) {

	counter2 = counter2 + 1;
	
	console.log('output for server2 ' + counter2 + ' ' + (counter2 % 1000));
	
	//if(counter2 > 10) {
		counter2 = 0;
		
		var d = new Date();
		var n = d.getMilliseconds(); 
		
		//get the associations
		var returnedAssocations2 = associations2;
		
		var association2 = {
				'name' : 'association-2-' + n, 
				'source' : 'resource-2-' + n,
				'target' : 'resource-2-' + n
			  };

		associations2.push(association2);
		
		response.send(returnedAssocations2);
	//}
};

module.exports.feed2 = feed2;

var feed3 = function(request, response) {

	for (var key in response) {
		//console.log('key: ' + key + ' value: ' + response[key]);
	}
	
	console.log('in feed3');
	
	response.setHeader('content-type', 'text/event-stream');
	response.setHeader('cache-control', 'no-cache');
	response.send("data:hello");
	//response.send(JSON.parse('\n'));
	/*
	counter2 = counter2 + 1;
	
	console.log('output for server2 ' + counter2 + ' ' + (counter2 % 1000));
	
	//if(counter2 > 10) {
		counter2 = 0;
		
		var d = new Date();
		var n = d.getMilliseconds(); 
		
		//get the associations
		var returnedAssocations2 = associations2;
		
		var association2 = {
				'name' : 'association-2-' + n, 
				'source' : 'resource-2-' + n,
				'target' : 'resource-2-' + n
			  };

		associations2.push(association2);
		
		response.send(returnedAssocations2);
	//}
	*/
};

module.exports.feed3 = feed3;

