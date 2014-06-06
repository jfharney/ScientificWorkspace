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

// Use the Jade templating language
app.set("view engine", "jade");


app.get("/", function(request, response) {

	//response.redirect('/workspace/users/j1s');
	
});

app.get('/sciworkspace',function(request,response) {
	var jsonModel = {a : 'a'};
	//res.sendfile('./views/charisma/index.html');
	//res.render('./views/index.html',jsonModel);
	response.render("index", { uid : request.params.user_id });
});


app.get('/sciworkspace1', function(request, response) {
	console.log('in sciworkspace 1');
	var jsonModel = {'a' : 'apple'};

	response.render("fancytree", jsonModel);
});


app.get('/tags', function(request, response) 
{
	
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


app.get('/jobs', function(request, response) 
{

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

app.get('/apps', function(request, response) {


});





app.post('/tagproxy',function(request,response) {
	
	console.log('in tag proxy');
	
	var request_obj = request['query'];
	
	//console.log('request_obj: ' + request_obj);

	//grab the tag parameters from the query parameter list
	var tag_name = '';
	var tag_description = '';
	
	tag_name = request_obj['tag_name'];
	tag_description = request_obj['tag_description'];
	
	
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
	
	
});


app.get('/groups', function(request,response) {
	
	console.log('in get groups');
	
	response.send('\ngroups data\n');
	
});




app.get('/groupsproxy', function(request,response) {
	
	console.log('in get groups proxy');
	
	//console.log(request['query']);
	console.log('gid -> ' + request.params.gid);
	
	
	
	//make a call to http://localhost:8080/groups/<gid>
	var path = '/groups/'+'6969';
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,
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
			respText = '[{"title": "Jobs For eeendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
									
			response.send(respText);

		  
	 });
	
	

	 req.end();
	 
	
});

http.createServer(app).listen(8001);

