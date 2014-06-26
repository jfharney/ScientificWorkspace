var express = require('express');
var app = express();
var firewallMode = false;
var http = require('http');
var url = require('url');
//app.use(express.static(__dirname + 'public'));
var serviceHost = '160.91.210.32';
var servicePort = '8080';

// Start Express
var express = require("express");
var app = express();

// Set the view directory to /views
console.log('__dirname: ' + __dirname);
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());

// Let's use the Jade templating language.
app.set("view engine", "jade");

var users = require('./proxy/users.js');
var groups = require('./proxy/groups.js');
var files = require('./proxy/files.js');
var jobs = require('./proxy/jobs.js');
var apps = require('./proxy/apps.js');
var associations = require('./proxy/associations.js');
var tags = require('./proxy/tags.js');

app.get("/", function(request, response) {
	  response.redirect('/workspace/users/j1s');
});

app.get("/settings/:user_id", function(request, response) {
	  console.log('\n\n---------in settings proxy for ' + request.params.user_id + '----------');
	
	  response.render("settings", { uid : request.params.user_id });
});

app.get("/workspace/:user_id", function(request, response) {
  /* Original Version: */
  //response.render("index1", { uid : request.params.user_id });
	
  /* New Version:*/ 
	  
  var userObj = {};

  /* Make a request to return all user data, based on the username.*/
  var options = {
    host: serviceHost,
    port: servicePort,
    path: "/sws/user?uname=" + request.params.user_id,
    method: 'GET'
  };
		
  var req = http.request(options, function(resp) {
		
    var responseData = '';
    resp.on('data', function(chunk) {
      responseData += chunk;
    });
    
    resp.on('end', function() {
      var userObj = JSON.parse(responseData);
      response.render("index1", userObj);
    });
			
    resp.on('error', function(e) {
      response.send('error: ' + e);
    });
  });
		
  req.end();
  
});

app.get('/doi/:user_id',function(request,response) {
	console.log('\n\n---------in doi_send proxy for ' + request.params.user_id + '----------');

	response.render("index2", { uid : request.params.user_id });
});

app.post('/doi/:user_id',function(request,response) {
	console.log('\n\n---------in doi_send proxy for ' + request.params.user_id + '----------');
	
	//console.log('rendering index2.jade');
	//response.render("index2", { uid : request.params.user_id });
	
	var model = {};
	for(var key in request['body']) {
		console.log('key: ' + key + ' value: ' + request['body'][key]);
		model[key] = request['body'][key];
	}
	
	//response.redirect('/doi/'+ request.params.user_id,model);
	//response.send("doi_send");
	response.render("index2", { uid : request.params.user_id });
});

/*
app.get("/doi/:user_id", function(request, response) {
	  console.log('in /:user_id');
	  
	  
	  //for(var key in request.params) {
	  //	  console.log('key: ' + key + ' value: ' + request.params[key]);
	  //}

	  var model = {};
	  var request_obj = request['query'];
	  
	  var resources = request_obj['resource'];
	  model['resources'] = [];
	  if(resources != undefined) {
		  //this is called if there is only one
		  if(!isArray(resources)) {

			  model['resources'] = [ resources ];
		  } else {
			  model['resources'] = resources;
		  }
	  }
	  
	  
	  var creators = request_obj['creator'];
	  model['creators'] = [];
	  if(creators != undefined) {
		  console.log('typeof: ' + isArray(creators));
		  //this is called if there is only one
		  if(!isArray(creators)) {

			  model['creators'] = [ creators ];
		  } else {
			  model['creators'] = creators;
		  }
	  } 
	  
	  var creators_email = request_obj['creator_email'];
	  model['creators_email'] = [];
	  if(creators_email != undefined) {
		  console.log('typeof: ' + isArray(creators_email));
		  //this is called if there is only one
		  if(!isArray(creators_email)) {

			  model['creators_email'] = [ creators_email ];
		  } else {
			  model['creators_email'] = creators_email;
		  }
	  } 
	  
	  if(model['creators_email'].length != model['creators'].length) {

		  model['creators_email'] = [];
		  model['creators'] = [];
		  
	  }

	  
	  
	  model['default_title'] = 'doi_' + (new String(new Date().getTime()));
	  
	  model['uid'] = request.params.user_id;
	  //model['creators'] = ['a','b','c'];
	  //response.render("index2", { uid : request.params.user_id });
	  response.render("index2", model);
	});

*/

function isArray(what) 
{
    return Object.prototype.toString.call(what) === '[object Array]';
}



app.get("/userinfo/:user_id", function(request, response) {
	
	console.log('calling user info...' + request.params.user_id);

	var path = '/sws/users/' + request.params.user_id;
	
	//query the userlist service here
	var options = {
			host: serviceHost,
			port: servicePort,
			path: path,
			method: 'GET'
		  };
	
	 var responseData = '';

	 //console.log ('calling user info...' + request.params.user_id + ' path: ' + path);
	 
	 var req = http.request(options, function(res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
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
	
});


/*************************************************************/
//--------Groups API----------//

app.get("/groupinfo/:uid", function(request, response) {
  //console.log ('calling group info...');
  var res = groups.groupinfoHelper(request, response);
});

//groups on lazy read off of the tree
app.get('/groups/:gid',function(request, response) {
  //console.log('gid -> ' + request.params.gid);
  var res = groups.groupsHelper(request, response);
});

/*************************************************************/
//--------Jobs API----------//

app.get('/jobsproxy/:userNum', function(request, response) {
  // jobsproxyHelper is defined in the file proxy/jobs.js.
  jobs.jobsproxyHelper(request, response);
  // We may reference :userNum with request.params.userNum.
});

app.get("/jobinfo/:job_id", function(request, response) {
  console.log('calling jobs info with job_id ' + request.params.job_id);
  var res = jobs.jobsinfoHelper(request, response);
});

// This method has been added to solve the problem of finding a job name
// given its UUID (from the associations table). 
app.get("/jobUuid/:job_uuid", function(request, response) {	
  //console.log ('Calling jobUuid on ' + request.params.job_uuid);	
  var res = jobs.jobsUuidHelper(request, response);
});

/*************************************************************/
//--------Apps API----------//

// Where/when is this URL issued? In file jobinfo.js, in the onLazyRead field of the Dynatree constructor (in buildJobsTree).
app.get('/appsproxy', function(request, response) {
  var res = apps.appsproxyHelper(request,response);
});

/*************************************************************/





//-----------Tags-----------//

app.post('/tagproxy', function(request, response) {
	//console.log('\n\n---------in tag proxy----------');
	
	var res = tags.tagsproxyHelper(request, response);
});



app.get('/tags', function(request, response) 
{	
	var args = url.parse(request.url, true).query;
	// query above is an object containing all the 
	// arguments in the URL as key-value pairs.
	//console.log("In frontend.js (app.get '/tags'...), received: " + request.url);
	
	var arguments = '';
	
	for(i in args)
	  if(arguments == '')
		arguments = i + "=" + args[i];
	  else
		arguments += "&" + i + "=" + args[i];
	
	var options = {
			host: '160.91.210.32',
			port: servicePort,
			path: "sws/tags?uid=" + args['uid'],
			method: 'GET'
	};
	
	var req = http.request(options, function(resp) {
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			//var jsonObj = JSON.parse(responseData);
			var jsonObj = {};
			jsonObj.tags = responseData;
			response.send(jsonObj);
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
});

app.get('/tags/:tag_name', function(request, response) 
{	
	//console.log ('calling tags info...' + request.params.tag_name);
	var args = url.parse(request.url, true).query;
	
	var options = {
			host: 'localhost',
			port: 8080,
			path: "/tags/" + request.params.tag_name + "?uid=" + args['uid'],
			method: 'GET'
	};
	
	//console.log("Sending path " + options['path']);
	
	var req = http.request(options, function(resp) {
		//console.log('Got response status code ' + resp.statusCode);
		
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



//-----------End Tags-----------//


//--------Files API---------//

app.get('/files/:userNum', function(request, response) {
  var args = url.parse(request.url, true).query;
  var path = "/sws/files?uid=5112&path=|"; 			// + args['path'];
	
  // Query above is an object containing all the 
  // arguments in the URL as key-value pairs. 
  var options = {
    host: serviceHost,
	port: servicePort,
	path: path,
	method: 'GET'
  };

  /*var numPipes = (args['path'].split('|')).length - 1;

  var respJSON = {};
  respJSON['title'] = args['path'] + '|' + '8xo' + 'level' + numPipes;
  respJSON['isFolder'] = true;
  respJSON['isLazy'] = true;
  respJSON['type'] = 'file';
  respJSON['uuid'] = args['path'] + '|' + '8xo' + 'level' + numPipes;
  respJSON['path'] = args['path']
  respJSON['key'] = args['path'] + '|' + '8xo' + 'level' + numPipes;

  var respArr = [];
  respArr.push(respJSON);

  for(var i = 0; i < numPipes; i++) {
    respJSON = {};
    respJSON['title'] = args['path'] + '|' + '8xo' + 'level' + (numPipes-1) + 'file' + i + '.nc';
    respJSON['isFolder'] = false;
    respJSON['type'] = 'file';
    respJSON['uuid'] = args['path'] + '|' + '8xo' + 'level' + numPipes;
    respJSON['path'] = args['path']
    respJSON['key'] = args['path'] + '|' + '8xo' + 'level' + (numPipes-1) + 'file' + i + '.nc';
    respArr.push(respJSON);
  }
	
  // What does stringify do as opposed to parse? 
  var respText = JSON.stringify(respArr);
  response.send(respText);*/
	
  var req = http.request(options, function(resp) {
		//console.log('Got response status code ' + resp.statusCode);
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			//console.log('in resp end for files... ' + responseData);
			var jsonObj = JSON.parse(responseData);
		response.send(jsonObj);
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
	
	
});



//sample- initial files data proxy service
app.get('/initfilesdata',function(request,response) {

	//console.log('init files data');
	
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
								
	response.send(respText);


});

//files proxy service
app.get('/filesinfo',function(request,response) {
	
	
	//grab the different components of the url
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	
	var path = '/files?';
	
	/*for(var key in query) {
		if(key == 'path') {
			filePath = query[key];
		}
		path += key + '=' + query[key] + '&';
	}*/
	
	//console.log('filesproxyquery: ' + path);
	
	//query the file service here
	var options = {
			host: serviceHost,
			port: servicePort,
			path: path,
			method: 'GET'
		  };
	
	 var responseData = '';
	
	 
	 if(!firewallMode) {
		 var req = http.request(options, function(res) {
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
app.get('/files', function(request,response) {
	
	
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
			host: serviceHost,
			port: servicePort,
			path: path,
			method: 'GET'
		  };
	
	 var responseData = '';
	
	 if(firewallMode) {
		//use hard coded values
		 
		 //console.log('\n\nfirewall mode for file --> off\n\n')
		 
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
		 
		 //console.log('\n\nfirewall mode for file --> off\n\n')
		 
		 var req = http.request(options, function(res) {
			  //console.log("Got response: " + res.statusCode);
			  //console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.on('data', function (chunk) {
				  //console.log('\n\n\n\nchunk: ' + chunk);
				  responseData += chunk;	
				  
				  
		    	
			  });
			  res.on('end',function() {
				 
				  var jsonStr = files.doQueryFiles(responseData,filePath);
		    	  
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



app.get('/userlist', function(request,response) {
	
	var path = '/users?retrieve=username';
	
	//query the userlist service here
	var options = {
			host: serviceHost,
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
			  
			 
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end();
});



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


//sample- initial files data proxy service
/*app.get('/initjobsdata',function(request,response) {

	//console.log('init jobs data');
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
	respText = '[{"title": "Jobs For eendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
							
	response.send(respText);


});*/



http.createServer(app).listen(1337);


