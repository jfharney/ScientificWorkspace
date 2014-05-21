console.log('Loading apps js');

var express = require('express');
var app = express();

var firewallMode = false;

var http = require('http');

var servicePort = 8080;


var appsproxyHelper = function(request, response) 
{
  var path = '/apps?jobid='+request.query.jobid;
	
  //query the userlist service here
  var options = {
    host: 'localhost',
	port: servicePort,
	path: path,
	//path: '/apps',
	method: 'GET'
  };
	
  console.log('path-> ' + path);
  var responseData = '';
	 
  var req = http.request(options, function(res) 
  {
    console.log("Got response: " + res.statusCode);
	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.on('data', function (chunk) 
	{
	  responseData += chunk;	
    });

    res.on('end', function() 
    {
	  var jsonObj = JSON.parse(responseData);

	  var appsArr = new Array();
	  var appuuidsArr = new Array();
			  		  
	  for(var key in jsonObj) {
	    // The value of jsonObj is an array.
		for(var i = 0; i < jsonObj[key].length; i++) {
		  var appid = jsonObj[key][i]['appid'];
		  var appuuid = jsonObj[key][i]['uuid'];
		  appsArr.push(appid);
		  appuuidsArr.push(appuuid);
		}
	  }
			  
	  var respArr = [];
	  for(var i = 0; i < appsArr.length; i++) {
		var respObj = {"title" : appsArr[i], 
				       "type" : "app", 
				       "appid" : appsArr[i], 
				       "jobid" : request.query.jobid, 
				       "uuid" : appuuidsArr[i] };
        respArr.push(respObj);
	  }
			  
	  response.send(respArr);
    });
		  
  }).on('error', function(e) 
  {
    console.log("Got error: " + e.message);
	var respText =	'[ {"title": "Item 11"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';
	var jsonObj = JSON.parse(respText);
	response.send(jsonObj);
  });
	
  req.end();
}


module.exports.appsproxyHelper = appsproxyHelper;


var appsinfoHelper = function(request, response) {

	//make a call to http://localhost:8080/users/<user_id>
	var path = '/apps/'+request.params.app_id+"?jobid="+request.query.jobid;
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';

	 //console.log ('calling user info...' + request.params.app_id + ' path: ' + path);
	 
	 var req = http.request(options, function(res) {
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end();
	
	
};

module.exports.appsinfoHelper = appsinfoHelper;

