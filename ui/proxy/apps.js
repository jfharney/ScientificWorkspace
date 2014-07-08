console.log('Loading apps js');

var express = require('express');
var app = express();

var firewallMode = false;

var http = require('http');
var serviceHost = 'techint-b117';
var servicePort = '8080';

var data = require('../data/firewall_sources.js');


// Where/when is appsproxyHelper called? In frontend.js.
var appsproxyHelper = function(request, response) 
{
  // The problem here is that request.query.jid is undefined.
  var path = '/sws/apps?jid=' + request.query.jid;
  
  console.log('In apps.js, the value of path is ' + path);
	
  //query the userlist service here
  var options = {
    host: serviceHost,
	port: servicePort,
	path: path,
	method: 'GET'
  };
	
  console.log('path-> ' + path);
  var responseData = '';
	 
  var req = http.request(options, function(res) 
  {
    //console.log("Got response: " + res.statusCode);
	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.on('data', function (chunk) 
	{
	  responseData += chunk;	
    });

    res.on('end', function() 
    {
	  console.log(responseData);
	  var jsonObj = {};
	  jsonObj.apps = JSON.parse(responseData);

	  var appsArr = new Array();
	  var appuuidsArr = new Array();
			  		  
	  for(var key in jsonObj) {
	    // The value of jsonObj is an array.
		for(var i = 0; i < jsonObj[key].length; i++) {
		  var appid = jsonObj[key][i]['aid'];
		  var appuuid = jsonObj[key][i]['nid'];
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

	 //console.log ('calling user info...' + request.params.app_id + ' path: ' + path);
	 
	 var req = http.request(options, function(res) {
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
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

/*
  var respArr = [];
  for(var i = 0; i < appsArr.length; i++) {
	  var respObj = {};
	  if(i == 0) {
		  respObj['title'] = appObj1['aid'];
		  respObj['type'] = appObj1['type'];
		  respObj['jobid'] = appObj1['job'];
		  respObj['uuid'] = appObj1['nid'];
		  
	  } else {
		  respObj['title'] = appObj2['aid'];
		  respObj['type'] = appObj2['type'];
		  respObj['jobid'] = appObj2['job'];
		  respObj['uuid'] = appObj2['nid'];
	  }
	
    respArr.push(respObj);
  }
		  
  response.send(respArr);
*/
	
  response.send("hello");
	
	
};

module.exports.appsinfoHelperFirewall = appsinfoHelperFirewall;

