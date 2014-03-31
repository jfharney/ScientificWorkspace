var firewallMode = false;

//var hbs = require('hbs');
var http = require('http');
var url = require('url');

//Start Express
var express = require("express");
var app = express();

app.use(express.static('public'));

var servicePort = 8080;

// Set the view directory to /views
app.set("views", __dirname + "/views");

// Use the Jade templating language
app.set("view engine", "jade");

app.get("/", function(request, response) 
{
	response.redirect('/sciworkspace');
});

/* This code was originally inside the succeeding function.
 * var query = url.parse(request.url, true).query;
console.log("The value of query.color is " + query);

for (var key in query) {
	console.log('key: ' + key + ' ' + query[key]);
}

<<<<<<< HEAD
app.post('/tagproxy',function(request,response) {
	
	console.log('in tag proxy');
	
	var request_obj = request['query'];
	
	//console.log('request_obj: ' + request_obj);

	//grab the tag parameters from the query parameter list
	var tag_name = '';
	var tag_description = '';
	
	tag_name = request_obj['tag_name'];
	tag_description = request_obj['tag_description'];
	
	
	//console.log('tag_name: ' + tag_name + ' tag_descrition: ' + tag_description + ' tagged_items: ' + tagged_items);
	
	
	//reassemble the url and query string given the query parameters
	
	 //curl -X POST 'http://localhost:8080/tags/tag100?uid=5112&desc=A_new_tag
	

	//forward the request to backend services
	//console.log('add tag ' + tag_name + ' to the data store');
	
	
	//console.log('connect tag ' + tag_name + ' to object(s): ' + tagged_items);
	
	//get response from backend services
	
	
	
	//make a call to http://localhost:8080/groups/<gid>
	var path = '/tags/' + tag_name + '?'+'uid=5112&desc=' + tag_description;
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,
			method: 'POST'
		  };
	
	 console.log('issuing query to -> ' + path);
	 var responseData = '';
	
	 
	 var req = http.request(options, function(res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  //console.log('on end response data...' + responseData + ' length: ' + responseData.length);
			  //response.send(responseData);

			  if(responseData == '' || responseData == ' ' || responseData == '\n') {
				  console.log('Response Data is empty');
				  
				  console.log('end tag proxy');
				  response.send('empty');
				  
			  } else {
				  console.log('Response Data is not empty...continue to parse JSON');
				  
				  var jsonObj = JSON.parse(responseData);
				  

				  console.log('end tag proxy');
				  response.send(jsonObj);
				  
				  
			  }
			  
			
		      
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
		  response.send("Error");
	 });
	
	
	//return "success" or "failure"

	 req.end();
});


app.post('/associationsproxy',function(request,response) {
	console.log('In associationsproxy');
	
	var request_obj = request['query'];
	
	var obj_uuid = request_obj['tagged_item'];
	var obj_type = request_obj['tagged_type'];
	var tag_uuid = request_obj['tag_uuid'];
	
	var associations_api_responseData = '';
	
	//console.log('tagged_item: ' + obj_uuid);
	//console.log('tagged_type: ' + obj_type)
	
	var associations_api_path = '/associations?' + 'edge=' + tag_uuid + '&node=' + obj_uuid + '&type=' + obj_type;
	console.log('issuing query to -> ' + associations_api_path);
		
	var associations_api_options = {
		host: 'localhost',
		port: servicePort,
		path: associations_api_path,
		method: 'PUT'
	};
	
	
	var associations_api_req = http.request(associations_api_options, function(associations_api_res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  associations_api_res.on('data', function (chunk) {
			  //console.log('\n\nchunk: ' + chunk);
			  associations_api_responseData += chunk;	
		  });
		  
		  associations_api_res.on('end',function() {
			  //console.log('on end...response data\n' + associations_api_responseData);
			  
			  console.log('end associations');
			  response.send('success');
		  });
		  
		  
	}).on('error', function(e) {
			 
		  console.log("Got error: " + e.message);
		  response.send("Error");
	});

	//console.log('End associations call');
	  
	associations_api_req.end();
	
	
=======
// How to add a key-value pair to an existing object:
jsonModel['color'] = query.color;*/

app.get('/sciworkspace', function(request, response) 
{
	var jsonModel = {'a' : 'apple'};

	response.render("index3", jsonModel);
});

app.get('/groups', function(request, response) 
{
	var query = url.parse(request.url, true).query;	
	console.log('Attempting to output ' + query.color + '.');
	response.send('<h3 style="color: ' + query.color + '">' + query.color + ' Output Data</h3>');
});

app.get('/tags', function(request, response) 
{
	console.log('Received http://localhost:8001/tags');
	
	var args = url.parse(request.url, true).query;
	// query above is an object containing all the 
	// arguments in the URL as key-value pairs. 
	
	for(i in args)
	  console.log(args[i]);
	
	var options = {
			host: 'localhost',
			port: 8080,
			path: "/tags?uid=" + args['uid'],
			method: 'GET'
	};
	
	var req = http.request(options, function(resp) {
		console.log('Got response status code ' + resp.statusCode);
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			var jsonObj = JSON.parse(responseData);
			response.send(jsonObj);
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
});

app.get('/associations', function(request, response) 
{
	console.log('Received http://localhost:8001/associations');
	var args = url.parse(request.url, true).query;
	// query above is an object containing all the 
	// arguments in the URL as key-value pairs. 
	console.log('args[edge]: ' + args['edge']);
	var options = {
			host: 'localhost',
			port: 8080,
			path: "/associations?edge=" + args['edge'],
			method: 'GET'
	};
	
	var req = http.request(options, function(resp) {
		console.log('Got response status code ' + resp.statusCode);
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			var jsonObj = JSON.parse(responseData);
			response.send(jsonObj);
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();	
});

app.get('/jobs', function(request, response) {
	console.log('Received http://localhost:8001/jobs');
	var args = url.parse(request.url, true).query;
	var options = {
			host: 'localhost',
			port: 8080,
			path: '/jobs?uuid=' + args['uuid'],
			method: 'GET'
	};
	
	var req = http.request(options, function(resp) {
		console.log('Got response status code ' + resp.statusCode);
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			var jsonObj = JSON.parse(responseData);
			response.send(jsonObj);
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
});

// Calls Dale's service. 
app.get('/groupsproxy', function(request, response) 
{
	console.log('in get groups proxy');
	
	//console.log(request['query']);
	console.log('gid -> ' + request.params.gid);
	
	//make a call to http://localhost:8080/groups/<gid>
	var path = '/groups/' + '6969';
	
	//query the user list service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,
			method: 'GET',
		  };
	
	 console.log('path-> ' + path);
	 var responseData = '';
	
	 var req = http.request(options, function(res) {
		  console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  
		  // Because the data is not sent all at once. 
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;
		  });
		  
		  // When the last of the response data is received. 
		  res.on('end', function() {
			  
			  console.log('ending groups/gid...');  
			  console.log('response data\n' + responseData);
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);
			 
			  var uidArr = new Array();
			  
			  var uidNameArr = new Array();
			  
			  //get all the users associated with this group
			  for(var key in jsonObj) {
				  for(var i=0; i < jsonObj[key].length; i++) {
					  var uid = jsonObj[key][i]['uid'];
					  var uidName = jsonObj[key][i]['username'];
					  uidArr.push(uid);
					  uidNameArr.push(uidName);
				  }
			  }
			  
			  console.log(uidArr);
			  
			  var respArr = [];
			  for(var i=0; i<uidArr.length; i++) {
				  var respObj = {"title" : uidArr[i], "id" : uidArr[i] , 'username' : uidNameArr[i]}; 
				  respArr.push(respObj);
			  }
			  
			  response.send(respArr);
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
		  var respText = '[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
		  //respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
		  respText = '[{"title": "Jobs For eeendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
									
		  response.send(respText);	  
	 });
	
	 req.end();	 
	
});

http.createServer(app).listen(8001);


/*
app.get("/workspace/:user_id", function(request, response) {
	  console.log('in /:user_id');
	  for(var key in request.params) {
		  console.log('key: ' + key + ' value: ' + request.params[key]);
	  }
	  //console.log('params: ' + request.params.user_id);
	
	  response.render("index1", { uid : request.params.user_id });
	});



app.get("/groupinfo/:uid", function(request, response) {

	console.log ('calling group info...');

	//make a call to http://localhost:8080/users/<user_id>
	var path = '/groups?uid='+request.params.uid;
	
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

app.get("/userinfo/:user_id", function(request, response) {
	
	console.log ('calling user info...' + request.params.user_id);

	//make a call to http://localhost:8080/users/<user_id>
	var path = '/users/'+request.params.user_id;
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';

	 console.log ('calling user info...' + request.params.user_id + ' path: ' + path);
	 
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

//--------groups API----------//


//sample- initial files data proxy service
app.get('/initgroupsdata',function(request,response) {

	//console.log('init groups data');
	for(var key in request) {
	//	console.log('key: ' + key);
	}
	
	//console.log(request['query']);
	
	
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
	respText = '[{"title": "Jobs For eeendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
							
	response.send(respText);

	
});



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



//--------jobs API----------//


//sample- initial files data proxy service
app.get('/initjobsdata',function(request,response) {

	//console.log('init jobs data');
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
	respText = '[{"title": "Jobs For eendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
							
	response.send(respText);


});



//
app.get('/jobsproxy/:username',function(request,response) {


	//console.log(request['query']);
	console.log('username -> ' + request.params.username);
	
	
	//make a call to http://localhost:8080/groups/<gid>
	var path = '/jobs?username='+request.params.username;
	
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
			  
			  
			  var jsonResponse = JSON.parse(responseData);
			  
			  var jsonArr = [];
			  
			  for(var key in jsonResponse) {
				  console.log('key: ' + key + '->' + ' value: ' + jsonResponse[key]);
			  }
			  
			  
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);
			 
			  var jobsArr = new Array();
			  
			  var jobNamesArr = new Array();
			  
			  for(var key in jsonObj) {
				  //the value of jsonObj is an aray
				  for(var i=0;i<jsonObj[key].length;i++) {
					  var jobid = jsonObj[key][i]['jobid'];
					  var jobname = jsonObj[key][i]['jobname'];
					  jobsArr.push(jobid);
					  jobNamesArr.push(jobname);
				  }
			  }
			  console.log(jobsArr);
			  
			  
			  var respArr = [];
			  for(var i=0;i<jobsArr.length;i++) {
				  var respObj = {"title" : jobNamesArr[i], 'isFolder' : true, "isLazy" : true, "type" : "jobs", "jobid" : jobsArr[i]};
				  respArr.push(respObj);
			  }
			  
			  console.log('respArr: ' + respArr);
			  
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



app.get('/apps',function(request,response) {

	//make a call to http://localhost:8080/groups/<gid>
	var path = '/apps?jobid='+request.query.jobid;
	
	for(var key in request.query) {
		console.log('key: ' + key);
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
			  
			  console.log('ending groups/gid...');
			  
			  
			  console.log('response data\n' + responseData);
			  
			  
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);
			 
			  var appsArr = new Array();
			  
			  
			  for(var key in jsonObj) {
				  //the value of jsonObj is an aray
				  for(var i=0;i<jsonObj[key].length;i++) {
					  var appid = jsonObj[key][i]['appid'];
					  appsArr.push(appid);
				  }
			  }
			  console.log(appsArr);
			  
			  
			  var respArr = [];
			  for(var i=0;i<appsArr.length;i++) {
				  var respObj = {"title" : appsArr[i], "type" : "apps", "appid" : appsArr[i], "jobid" : request.query.jobid };
				  respArr.push(respObj);
			  }
			  
			  console.log('respArr: ' + respArr);
			  
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
	
	 
	 
	 
	 
	
	
	var respText =	'[ {"title": "Item 11"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
	respText = '[{"title": "Jobs For eendeve11", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
							
	var jsonObj = JSON.parse(respText);
	response.send(jsonObj);
	
	
});


app.get("/jobinfo/:job_id", function(request, response) {
	
	console.log ('calling user info...' + request.params.job_id);

	//make a call to http://localhost:8080/users/<user_id>
	var path = '/jobs/'+request.params.job_id;
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';

	 console.log ('calling job info...' + request.params.job_id + ' path: ' + path);
	 
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




//-------end jobs API-------//



//--------files API---------//


//sample- initial files data proxy service
app.get('/initfilesdata',function(request,response) {

	console.log('init files data');
	
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
								
	response.send(respText);


});



app.get('/userlist', function(request,response) {
	console.log ('calling userlist...');
	
	var path = '/users?retrieve=username';
	
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
			  
			  console.log('ending userlist...');
			 
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end();
});



//files proxy service
app.get('/filesinfo',function(request,response) {
	
	console.log ('calling filesinfo proxy...');
	
	//grab the different components of the url
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	
	var path = '/files?';
	
	for(var key in query) {
		if(key == 'path') {
			filePath = query[key];
		}
		path += key + '=' + query[key] + '&';
	}
	
	//console.log('filesproxyquery: ' + path);
	
	//query the file service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';
	
	 
	 if(!firewallMode) {
		 var req = http.request(options, function(res) {
			  //console.log("Got response: " + res.statusCode);
			  //console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.on('data', function (chunk) {
				  //console.log('\n\n\n\nchunk: ' + chunk);
				  responseData += chunk;	
					
			  });
			  res.on('end',function() {
				  
				  console.log('ending filesproxy...');
				 
				  var jsonObj = JSON.parse(responseData);
			      response.send(jsonObj);
				 
				  
			  });
			  
		  
		 }).on('error', function(e) {
			 
			  console.log("Got error: " + e.message);
		 
		 });
		 
		 req.end();
	 }
	 else {
		 console.log('firewall mode on in file info');
		 
		 var fileResponseJSONStr = '{ ' + 
			'"name" : "lgt006" , ' +
			'"uid" : 0 , ' + 
			'"gid" : 16854 , ' +
			'"filecount" : 203350 , ' +
			'"isFile" : false , ' + 
			'"files" : [ ' +
			'  {' + 
			'    "name" : "ChromaBuilds1",' +
			'    "uid" : 63015,' +
			'    "gid" : 16854,' +
			'    "filecount" : 196168,' +
			'    "isfile" : false' +
			'  },' +
			'  {' + 
			'    "name" : "ChromaBuilds2",' +
			'    "uid" : 63015,' +
			'    "gid" : 16854,' +
			'    "filecount" : 196168,' +
			'    "isfile" : false' +
			'  }' +
			//'  {' + 
			//'  }' +
			']' +
			'}';
		 
		 //get the file response string here
		 //var jsonStr = files.doQueryFiles(fileResponseJSONStr);
		 var jsonStr = fileResponseJSONStr;
		 
		 //var jsonObj = JSON.parse(jsonStr);
	  
		 var respText = jsonStr; 
		 response.send(respText);
		 
	 }
	 
	 
	 
});






//files proxy service
app.get('/files',function(request,response) {
	
	
	console.log ('calling files...\n\n\n\n\n\n\n');
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	
	
	
	var path = '/files?';
	
	var filePath = '';
	
	for(var key in query) {
		//console.log('key: ' + key + ' value: ' + query[key]);
		if(key == 'path') {
			filePath = query[key];
		}
		path += key + '=' + query[key] + '&';
		console.log('path: ' + path);
	}
	
	console.log('files query: ' + path);
	
	//query the file service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';
	
	 if(firewallMode) {
		//use hard coded values
		 
		 console.log('\n\nfirewall mode for file --> off\n\n')
		 
		 var fileResponseJSONStr = '{ ' + 
			'"name" : "lgt006" , ' +
			'"uid" : 0 , ' + 
			'"gid" : 16854 , ' +
			'"filecount" : 203350 , ' +
			'"isFile" : false , ' + 
			'"files" : [ ' +
			'  {' + 
			'    "name" : "ChromaBuilds1",' +
			'    "uid" : 63015,' +
			'    "gid" : 16854,' +
			'    "filecount" : 196168,' +
			'    "isfile" : false' +
			'  },' +
			'  {' + 
			'    "name" : "ChromaBuilds2",' +
			'    "uid" : 63015,' +
			'    "gid" : 16854,' +
			'    "filecount" : 196168,' +
			'    "isfile" : false' +
			'  }' +
			//'  {' + 
			//'  }' +
			']' +
			'}';
		 
		 
		 var jsonStr = files.doQueryFiles(fileResponseJSONStr);
	  
	  
		 var respText = jsonStr; //'[ {"title": "SubItem 1", "isLazy": true }, 	{"title": "SubFolder 2", "isFolder": true, "isLazy": true } ]';
		 response.send(respText);
		 //response.send('returning message');
		 
		 
	 } 
	 //call the service for the data
	 else {
		 
		 console.log('\n\nfirewall mode for file --> off\n\n')
		 
		 var req = http.request(options, function(res) {
			  //console.log("Got response: " + res.statusCode);
			  //console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.on('data', function (chunk) {
				  //console.log('\n\n\n\nchunk: ' + chunk);
				  responseData += chunk;	
				  
				  
				  // you can use res.send instead of console.log to output via express
				  //var jsonObj = JSON.parse(responseData);
			      //response.send(jsonObj);
			     
		    	  //construct the respText array
		    	  //var a = '{"title": "SubItem 1", "isLazy": true }';
		    	  
		    	  //jsonStr = '[{ "title" : "ChromaBuilds1",  "isLazy" : true ,  "isFolder" : true} , { "title" : "ChromaBuilds2",  "isLazy" : true ,  "isFolder" : true}]';

		    	
			  });
			  res.on('end',function() {
				 
				  
				  for(var key in files) {
						console.log('key: ' + key + ' value: ' + files[key]);
					}
					
				  var jsonStr = files.doQueryFiles(responseData,filePath);
		    	  
				  console.log('ending...');
		    	  
				 var respText = jsonStr; //'[ {"title": "SubItem 1", "isLazy": true }, 	{"title": "SubFolder 2", "isFolder": true, "isLazy": true } ]';
		    	  response.send(respText);
				  
			  });
			  
	   	  
		 }).on('error', function(e) {
			 
			  console.log("Got error: " + e.message);
		 
		 });

		 req.end();
	 }
	 
	 
	
	


});





//--------End files API---------//
*/
