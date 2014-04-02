console.log('Loading groups js');

var express = require('express');
var app = express();

var firewallMode = false;

var http = require('http');

var servicePort = 8080;

var groupinfoHelper = function(request,response) {
	
	//make a call to http://localhost:8080/users/<user_id>
	var path = '/groups?uid='+request.params.uid;
	
	console.log('path: ' + path);
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';
	
	 
	 var req = http.request(options, function(res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  console.log('ending group info...');
			 
			  console.log('response data\n' + responseData);
			  
			  try {
				  var jsonObj = JSON.parse(responseData);
			      response.send(jsonObj);
				} catch (e) {
					var emptyReturnObj = { groups : [] };
					response.send(emptyReturnObj);
				}
			  
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end();
	
	
};

module.exports.groupinfoHelper = groupinfoHelper;

var groupsHelper = function(request, response) {


	
	//make a call to http://localhost:8080/groups/<gid>
	var path = '/groups/'+request.params.gid;
	
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
			  
			  console.log('ending groups/gid...');
			  
			  console.log('response data\n' + responseData);
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);
			 
			  var uidArr = new Array();
			  
			  var uidNameArr = new Array();
			  
			  //get all the users associated with this group
			  for(var key in jsonObj) {
				  for(var i=0;i<jsonObj[key].length;i++) {
					  var uid = jsonObj[key][i]['uid'];
					  var uidName = jsonObj[key][i]['username'];
					  uidArr.push(uid);
					  uidNameArr.push(uidName);
				  }
			  }
			  
			  console.log(uidArr);
			  
			  var respArr = [];
			  for(var i=0;i<uidArr.length;i++) {
				  var respObj = {"title" : uidArr[i], "id" : uidArr[i] , 'username' : uidNameArr[i]};
				  respArr.push(respObj);
			  }
			  
			  
				response.send(respArr);
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
		  var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
			//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
			respText = '[{"title": "Jobs For eeendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
									
			response.send(respText);

		  
	 });
	
	

	 req.end();
	

};


module.exports.groupsHelper = groupsHelper;




/*
app.get("/groupinfo/:uid", function(request, response) {

	console.log ('calling group info...');

	//make a call to http://localhost:8080/users/<user_id>
	var path = '/groups?uid='+request.params.uid;
	
	console.log('path: ' + path);
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';
	
	 
	 var req = http.request(options, function(res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  console.log('ending group info...');
			 
			  console.log('response data\n' + responseData);
			  
			  try {
				  var jsonObj = JSON.parse(responseData);
			      response.send(jsonObj);
				} catch (e) {
					var emptyReturnObj = { groups : [] };
					response.send(emptyReturnObj);
				}
			  
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end();
	

});
*/



/*
//groups on lazy read off of the tree
app.get('/groups/:gid',function(request,response) {

	//console.log('init groups data');
	for(var key in request) {
	//	console.log('key: ' + key);
	}
	
	//console.log(request['query']);
	console.log('gid -> ' + request.params.gid);
	
	
	
	//make a call to http://localhost:8080/groups/<gid>
	var path = '/groups/'+request.params.gid;
	
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
			  
			  console.log('ending groups/gid...');
			  
			  console.log('response data\n' + responseData);
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);
			 
			  var uidArr = new Array();
			  
			  var uidNameArr = new Array();
			  
			  //get all the users associated with this group
			  for(var key in jsonObj) {
				  for(var i=0;i<jsonObj[key].length;i++) {
					  var uid = jsonObj[key][i]['uid'];
					  var uidName = jsonObj[key][i]['username'];
					  uidArr.push(uid);
					  uidNameArr.push(uidName);
				  }
			  }
			  
			  console.log(uidArr);
			  
			  var respArr = [];
			  for(var i=0;i<uidArr.length;i++) {
				  var respObj = {"title" : uidArr[i], "id" : uidArr[i] , 'username' : uidNameArr[i]};
				  respArr.push(respObj);
			  }
			  
			  
				response.send(respArr);
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
		  var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
			//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
			respText = '[{"title": "Jobs For eeendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
									
			response.send(respText);

		  
	 });
	
	

	 req.end();
	
	
	
});
*/


