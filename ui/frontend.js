var express = require('express');
var app = express();

var firewallMode = false;

//var hbs = require('hbs');

var http = require('http');
var url = require('url');


app.use(express.static('public'));

var servicePort = 8080;


// Start Express
var express = require("express");
var app = express();

// Set the view directory to /views
app.set("views", __dirname + "/views");

app.use(express.static('public'));

// Let's use the Jade templating language
app.set("view engine", "jade");

var users = require('./proxy/users.js');

var groups = require('./proxy/groups.js');

var files = require('./proxy/files.js');

var jobs = require('./proxy/jobs.js');

var apps = require('./proxy/apps.js');

var associations = require('./proxy/associations.js');

var tags = require('./proxy/tags.js');


app.get("/", function(request, response) {
	  //response.render("index1", { message: "I love anime" });
	  //response.render("index1", { uid : "8xo" });
	  response.redirect('/workspace/users/j1s');
	});

app.get("/workspace/:user_id", function(request, response) {
	  //console.log('in /:user_id');
	  /*for(var key in request.params) {
		  console.log('key: ' + key + ' value: ' + request.params[key]);
	  }*/
	  //console.log('params: ' + request.params.user_id);
	
	  response.render("index1", { uid : request.params.user_id });
});




app.get("/userinfo/:user_id", function(request, response) {
	
	console.log('calling user info...' + request.params.user_id);

	//make a call to http://localhost:8080/users/<user_id>
	var path = '/users/' + request.params.user_id;
	
	//query the userlist service here
	var options = {
			host: 'localhost',
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
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  //console.log('ending user info...');
			  
			  //console.log('response data\n' + responseData);
			  
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end()
	
});

//--------groups API----------//


app.get("/groupinfo/:uid", function(request, response) {

	//console.log ('calling group info...');

	var res = groups.groupinfoHelper(request,response);
});




//groups on lazy read off of the tree
app.get('/groups/:gid',function(request,response) {
	//console.log('gid -> ' + request.params.gid);
	
	var res = groups.groupsHelper(request,response);
});


//--------end groups API----------//


//--------jobs API----------//





app.get('/jobsproxy/:username',function(request,response) {

	console.log('in apps proxy');

	var res = jobs.jobsproxyHelper(request,response);
	
});


app.get('/appsproxy',function(request,response) {

	//console.log('in apps proxy');

	var res = apps.appsproxyHelper(request,response);
	
});

app.get("/jobinfo/:job_id", function(request, response) {
	
	console.log ('calling jobs info...' + request.params.job_id);
	
	var res = jobs.jobsinfoHelper(request,response);
	
});


app.get("/appinfo/:app_id", function(request, response) {
	console.log ('calling user info...' + request.params.app_id);

	var res = apps.appsinfoHelper(request,response);

});




//-------end jobs API-------//





//-----------Tags-----------//

app.post('/tagproxy', function(request, response) {
	console.log('\n\n---------in tag proxy----------');
	
	var res = tags.tagsproxyHelper(request, response);
});



app.get('/tags', function(request, response) 
{	
	var args = url.parse(request.url, true).query;
	// query above is an object containing all the 
	// arguments in the URL as key-value pairs.
	console.log("In frontend.js (app.get '/tags'...), received: " + request.url);
	
	var arguments = '';
	
	for(i in args)
	  if(arguments == '')
		arguments = i + "=" + args[i];
	  else
		arguments += "&" + i + "=" + args[i];
	
	console.log("The value of arguments is " + args['uid']);
	
	var options = {
			host: 'localhost',
			port: 8080,
			path: "/tags?uid=" + args['uid'],
			method: 'GET'
	};
	
	var req = http.request(options, function(resp) {
		//console.log('Got response status code ' + resp.statusCode);
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			var jsonObj = JSON.parse(responseData);
			console.log(jsonObj);
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
			//console.log(jsonObj);
			response.send(jsonObj);
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();	
});



//-----------End Tags-----------//



//-----------Associations-----------//

app.post('/associationsproxy',function(request,response) {
	//console.log('In associationsproxy');
	var res = associations.associationsproxyHelper(request,response);
});


app.get('/associations', function(request, response) 
{
	//console.log('Received http://localhost:8001/associations');
	var args = url.parse(request.url, true).query;
	// query above is an object containing all the 
	// arguments in the URL as key-value pairs. 
	//console.log('args[edge]: ' + args['edge']);
	var options = {
			host: 'localhost',
			port: 8080,
			path: "/associations?edge=" + args['edge'],
			method: 'GET'
	};
	
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



//-----------End Associations-----------//














//--------files API---------//


//sample- initial files data proxy service
app.get('/initfilesdata',function(request,response) {

	//console.log('init files data');
	
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
								
	response.send(respText);


});



app.get('/userlist', function(request,response) {
	//console.log ('calling userlist...');
	
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
			  
			 // console.log('ending userlist...');
			 
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
	
	//console.log ('calling filesinfo proxy...');
	
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
				 
				  /*
				  for(var key in files) {
						console.log('key: ' + key + ' value: ' + files[key]);
					}
					*/
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
app.get('/initjobsdata',function(request,response) {

	//console.log('init jobs data');
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
	respText = '[{"title": "Jobs For eendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
							
	response.send(respText);


});



http.createServer(app).listen(1337);


