console.log('Loading apps js');

var express = require('express');
var app = express();

var firewallMode = false;

var http = require('http');
var serviceHost = 'techint-b117';
var servicePort = '8080';

var data = require('../data/firewall_sources.js');

// appsproxyHelper is called in frontend.js.
var appsproxyHelper = function(request, response) 
{
  var path = '/sws/apps?jid=' + request.query.jid;
  
  var options = {
    host: serviceHost,
	port: servicePort,
	path: path,
	method: 'GET'
  };

  var responseData = '';
	 
  var req = http.request(options, function(res) 
  {
	res.on('data', function (chunk) {
	  responseData += chunk;	
    });

    res.on('end', function() {
      var jsonObjArr = [];
      jsonObjArr = JSON.parse(responseData);
      
      var respArr = [];     // An array of objects which contain app data. 
      for(var i = 0; i < jsonObjArr.length; i++) {
        var respObj = {"title" : jsonObjArr[i]['aid'], 
                       "type" : 3, 
                       "appid" : jsonObjArr[i]['aid'], 
                       "jobid" : request.query.jobid, 
                       "nid" : jsonObjArr[i]['nid'] };
        respArr.push(respObj);
      }
      
      response.send(respArr);
    });
		  
  }).on('error', function(e) 
  {
    console.log("apps.js: Got error: " + e.message);
	var respText =	'[ {"title": "Item 11"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';
	var jsonObj = JSON.parse(respText);
	response.send(jsonObj);
  });
	
  req.end();
}


module.exports.appsproxyHelper = appsproxyHelper;


var appsproxyHelperFirewall = function(request, response) {
	
	var appsObjArr = data.appsObjArr;
	  
	var respArr = [];
	for(var i=0;i<appsObjArr.length;i++) {
	  var respObj = {};

	  respObj['title'] = appsObjArr[i]['aid'];
	  respObj['type'] = appsObjArr[i]['type'];
	  respObj['jobid'] = appsObjArr[i]['job'];
	  respObj['uuid'] = appsObjArr[i]['nid'];
	  respObj['appid'] = appsObjArr[i]['aid'];
	  respArr.push(respObj);
	}
	  
	response.send(respArr);
	
};


module.exports.appsproxyHelperFirewall = appsproxyHelperFirewall;



var appsinfoHelper = function(request, response) {

	var path = '/sws/app?aid='+request.params.app_id+"&jid="+request.query.jid;
	
	console.log('app path: ' + path);
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,
			method: 'GET'
		  };
	
	 var responseData = '';
	 
	 var req = http.request(options, function(res) {
		  res.on('data', function (chunk) {
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  var jsonObj = {};
			  jsonObj.apps = JSON.parse(responseData);
		      response.send(jsonObj.apps);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end();
	
	
};

module.exports.appsinfoHelper = appsinfoHelper;



var appsinfoHelperFirewall = function(request, response) {
	
  response.send("hello");
	
};

module.exports.appsinfoHelperFirewall = appsinfoHelperFirewall;

