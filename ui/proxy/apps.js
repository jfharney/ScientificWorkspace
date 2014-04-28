console.log('Loading apps js');

var express = require('express');
var app = express();

var firewallMode = false;

var http = require('http');

var servicePort = 8080;


var appsproxyHelper = function(request, response) {
	
	//make a call to http://localhost:8080/groups/<gid>
	var path = '/apps?jobid='+request.query.jobid;
	
	for(var key in request.query) {
		//console.log('key: ' + key);
	}
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 console.log('path-> ' + path);
	 var responseData = '';
	
	 
	 var req = http.request(options, function(res) {
		  console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  //console.log('ending groups/gid...');
			  
			  
			  //console.log('response data\n' + responseData);
			  
			  
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);

			  var appsArr = new Array();
			  var appuuidsArr = new Array();
			  
			  
			  for(var key in jsonObj) {
				  //the value of jsonObj is an aray
				  for(var i=0;i<jsonObj[key].length;i++) {
					  var appid = jsonObj[key][i]['appid'];
					  var appuuid = jsonObj[key][i]['uuid'];
					  appsArr.push(appid);
					  appuuidsArr.push(appuuid);
				  }
			  }
			  //console.log(appsArr);
			  
			  
			  var respArr = [];
			  for(var i=0;i<appsArr.length;i++) {
				  var respObj = {"title" : appsArr[i], "type" : "app", "appid" : appsArr[i], "jobid" : request.query.jobid, 'uuid' : appuuidsArr[i] };
				  respArr.push(respObj);
			  }
			  
			  console.log('apps respArr: ' + respArr);
			  
				response.send(respArr);
			  
			  
			  

				
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
		//console.log('init jobs data');
			var respText =	'[ {"title": "Item 11"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
			//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
			respText = '[{"title": "Jobs For eendeve11", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
									
			var jsonObj = JSON.parse(respText);
			response.send(jsonObj);
			//response.send(respText);

		  
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

	 console.log ('calling user info...' + request.params.app_id + ' path: ' + path);
	 
	 var req = http.request(options, function(res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  console.log('ending user info...');
			  
			  console.log('response data\n' + responseData);
			  
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end();
	
	
};

module.exports.appsinfoHelper = appsinfoHelper;

/*
app.get("/appinfo/:app_id", function(request, response) {
	
	console.log ('calling user info...' + request.params.app_id);

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

	 console.log ('calling user info...' + request.params.app_id + ' path: ' + path);
	 
	 var req = http.request(options, function(res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  console.log('ending user info...');
			  
			  console.log('response data\n' + responseData);
			  
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end()
	
});
*/



/*
app.get('/appsproxy',function(request,response) {

	console.log('in apps proxy');
	
	//make a call to http://localhost:8080/groups/<gid>
	var path = '/apps?jobid='+request.query.jobid;
	
	for(var key in request.query) {
		//console.log('key: ' + key);
	}
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 console.log('path-> ' + path);
	 var responseData = '';
	
	 
	 var req = http.request(options, function(res) {
		  console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  //console.log('ending groups/gid...');
			  
			  
			  //console.log('response data\n' + responseData);
			  
			  
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);

			  var appsArr = new Array();
			  var appuuidsArr = new Array();
			  
			  
			  for(var key in jsonObj) {
				  //the value of jsonObj is an aray
				  for(var i=0;i<jsonObj[key].length;i++) {
					  var appid = jsonObj[key][i]['appid'];
					  var appuuid = jsonObj[key][i]['uuid'];
					  appsArr.push(appid);
					  appuuidsArr.push(appuuid);
				  }
			  }
			  //console.log(appsArr);
			  
			  
			  var respArr = [];
			  for(var i=0;i<appsArr.length;i++) {
				  var respObj = {"title" : appsArr[i], "type" : "app", "appid" : appsArr[i], "jobid" : request.query.jobid, 'uuid' : appuuidsArr[i] };
				  respArr.push(respObj);
			  }
			  
			  //console.log('respArr: ' + respArr);
			  
				response.send(respArr);
			  
			  
			  

				
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
		//console.log('init jobs data');
			var respText =	'[ {"title": "Item 11"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
			//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
			respText = '[{"title": "Jobs For eendeve11", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
									
			var jsonObj = JSON.parse(respText);
			response.send(jsonObj);
			//response.send(respText);

		  
	 });
	
	

	 req.end();
	
	 
	 
});
*/

