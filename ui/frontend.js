var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var proxy = require('./proxy/proxyConfig.js');

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
var associationsfeed = require('./proxy/associationsfeed.js');
var tags = require('./proxy/tags.js');


var data = require('./data/firewall_sources.js');

if(proxy.firewallMode)
  console.log('firewall: ' + proxy.firewallMode);


/*************************************************************/

app.post('/search/:user_id',function(request,response) {
	console.log('\n\n---------in doi_send proxy post for ' + request.params.user_id + '----------');
	
	//console.log('rendering index2.jade');
	//response.render("index2", { uid : request.params.user_id });
	
	var model = {};
	model['uid'] = request.params.user_id;
	
	
	//console.log('Returning modell...');
	for(var key in model) {
		console.log('key: ' + key + ' model: ' + model[key]);
	}
	
	response.render("index3", model);
});


/*************************************************************/
/*
app.post('/doi/:user_id',function(request,response) {
	  console.log('\n\n---------in doi_send proxy get for ' + request.params.user_id + '----------');
	  response.render("index2", { uid : request.params.user_id });
});
*/

app.get('/doi/:user_id',function(request,response) {
	  console.log('\n\n---------in doi_send proxy get for ' + request.params.user_id + '----------');
	  response.render("index2", { uid : request.params.user_id });
	});

app.post('/doi/:user_id',function(request,response) {
	console.log('\n\n---------in doi_send proxy post for ' + request.params.user_id + '----------');
	
	//console.log('rendering index2.jade');
	//response.render("index2", { uid : request.params.user_id });
	
	var model = {};
	model['uid'] = request.params.user_id;
	for(var key in request['body']) {
		console.log('key: ' + key + ' value: ' + request['body'][key] + ' length: ' + request['body'][key].length + ' isArr: ' + isArray(request['body'][key]));
		
		if(key == 'resource' || key == 'group' || key == 'job') {
			var arr = request['body'][key].split(',');
			console.log('length: ' + arr.length);
			request['body'][key] = arr;
		} 
		
		if(isArray(request['body'][key])) {
			model[key] = request['body'][key];
		} else {
			var arr = new Array();
			arr.push(request['body'][key]);
			model[key] = arr;
			//console.log('arr: ' + arr);
		}
		console.log('key: ' + key + ' value: ' + request['body'][key] + ' length: ' + request['body'][key].length + ' model[] ' + model[key] + ' isArr: ' + isArray(model[key]));
		
	}
	
	//console.log('Returning modell...');
	for(var key in model) {
		console.log('key: ' + key + ' model: ' + model[key]);
	}
	
	response.render("index2", model);
});

/*************************************************************/

app.get("/settings/:user_id", function(request, response) {
	  console.log('\n\n---------in settings proxy for ' + request.params.user_id + '----------');
	  response.render("settings", { uid : request.params.user_id });
});


/*************************************************************/

app.get("/", function(request, response) {
  response.redirect('/workspace/users/j1s');
});


app.get("/workspace/:user_id", function(request, response) {
	
  console.log('A GET for /workspace/:user_id has been issued.');
  
  
  if(proxy.firewallMode) {
	  
	var userObj = data.userObj;
    response.render("index1", userObj);
    
  } 
  else {
	  
	var res = users.userHelper(request, response);  
	
  }  
});


/*************************************************************/




app.get("/userinfo/:user_id", function(request, response) {
	
	console.log('calling user info...' + request.params.user_id);

	var path = '/sws/users/' + request.params.user_id;
	
	//query the userlist service here
	var options = {
			host: proxy.serviceHost,
			port: proxy.servicePort,
			path: path,
			method: 'GET'
		  };
	
	 var responseData = '';

	 console.log ('calling user info...' + request.params.user_id + ' path: ' + path);
	 
	 var req = http.request(options, function(res) {
		  console.log("Got response: " + res.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(res.headers));
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


//information feeds
app.get('/server1', function(request, response) {
	
	
	if(proxy.firewallMode) {
		var res = associationsfeed.feed1(request, response);
	} else {
		var res = associationsfeed.feed1(request, response);
	}
	
	
});


app.get('/server2', function(request, response) {
	
	if(proxy.firewallMode) {
		var res = associationsfeed.feed2(request, response);
	} else {
		var res = associationsfeed.feed2(request, response);
	}
	
	
});
app.get('/server3', function(request, response) {
	
	if(proxy.firewallMode) {
		var res = associationsfeed.feed3(request, response);
	} else {
		var res = associationsfeed.feed3(request, response);
	}
	
	
});


/*************************************************************/

//--------Groups API----------//

app.get("/groupinfo/:uid", function(request, response) {
	console.log('in groupinfo...');
  if(proxy.firewallMode) {
	  
	var res = groups.groupinfoHelperFirewall(request, response);  
	
  }	
  else {
	  
    var res = groups.groupinfoHelper(request, response);  
    
  }
  
});

//groups on lazy read off of the tree
app.get('/groups/:gid',function(request, response) {
  console.log('gid -> ' + request.params.gid);

  if(proxy.firewallMode) {
	  
	  var res = groups.groupsHelperFirewall(request, response);

  } else {
	  
	  var res = groups.groupsHelper(request, response);
	  
  }
  
  

});



/*************************************************************/

//--------Jobs API----------//

app.get('/jobsproxy/:userNum', function(request, response) {

	console.log('in jobsproxy');
  if(proxy.firewallMode) {
	
	jobs.jobsproxyHelperFirewall(request, response);
	
  } else {
	  
	jobs.jobsproxyHelper(request, response);
	
  }
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
	if(proxy.firewallMode) {
		
	  var res = apps.appsproxyHelperFirewall(request,response);
	  
	} else {

	  var res = apps.appsproxyHelper(request,response);
	}
	
});

app.get('/appinfo/:appnum', function(request, response) {
  if(proxy.firewallMode) {
	  
	var res = apps.appsinfoHelperFirewall(request,response);
	  
  }
  else {
    
	  var res = apps.appsinfoHelper(request,response);
    
  }
});

/*************************************************************/

//-----------Tags-----------//

app.get('/tag1/:user_id', function(request, response) 
{
	console.log('\n\n---------in tag proxy 1----------');
	response.send("response");
});


app.post('/tagproxy/:user_id', function(request, response) {
	console.log('\n\n---------in tag proxy----------');
	console.log('Adding tag');
	
	var args = url.parse(request.url, true).query;
	
	for (var key in args) {
		console.log('key: ' + key + ' value: ' + args[key]);
	}
	
	var user_id = request.params.user_id;
	var name = args['name'];
	var description = args['description'];
	
	console.log('user_id: ' + user_id);
	
	var options = {
			host: proxy.serviceHost,
			port: proxy.servicePort,
			path: "/sws/tag?uid=" + user_id + '&name='+name+'&description='+description,
			method: 'POST'
	};
	
	console.log('')
	
	//curl -X POST 'http://160.91.210.19:8080/sws/tag?name=tag11&uid=5112'
	
	var req = http.request(options, function(resp) {
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			//response.send(responseData);
			console.log('tag post responseData: ' + responseData);
			

		    var jsonObj = JSON.parse(responseData);
			
			response.send(jsonObj);
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
	
	
	
	
	//var res = tags.tagsproxyHelper(request, response);
	
	
});

app.post('/associationproxy/:user_id',function(request,response){
	console.log('\n\n---------in association proxy----------');
	var user_id = request.params.user_id;
	
	var args = url.parse(request.url, true).query;
	
	var tag_nid = args['tag_nid'];
	var resource_nid = args['resource_nid'];
	var type = args['type'];
	
	
	console.log('Adding association for user_id: ' + user_id + ' for type: ' + type);
	console.log('Connecting tag: ' + tag_nid + ' to resouce: ' + resource_nid);
	
	console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + resource_nid); //?name='+tagName+'&uid=5112');
	 
	
	var options = {
			host: proxy.serviceHost,
			port: proxy.servicePort,
			//path: "/sws/tags?uid=" + args['uid'],
			path: '/sws/tag/' + tag_nid + '/link/' + resource_nid,
			method: 'POST'
	};
	
	console.log('path -> ' + options['path']);
	
	
	var req = http.request(options, function(resp) {
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			console.log('associations proxy response data: ' + responseData);

		    //var jsonObj = JSON.parse(responseData);
		    
			//response.send(jsonObj);
			response.send("response");
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
	

	//response.send("Response");
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
			host: proxy.serviceHost,
			port: proxy.servicePort,
			path: "/sws/tags?uid=" + args['uid'],
			method: 'GET'
	};
	
	var req = http.request(options, function(resp) {
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			console.log('tag responseData: \n' + responseData);
			response.send(responseData);
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

app.get('/tags/links/:tag_nid', function(request, response) {
  
	var res = tags.tagLinksProxHelper(request, response);
	
		
});

app.get('/tagsTable/:uid', function(request, response) {
  console.log('The HTTP request /tagsTable/:uid has been caught in frontend.js.');
  var res = tags.tagsTableProxy(request, response);
});


//-----------End Tags-----------//

/*************************************************************/

//--------Files API---------//

app.get('/files/:userNum', function(request, response) {
	
	
  console.log('usernum: ' + request.params.userNum);
  var usernum = request.params.userNum;
  var queriedPath =	request.query.path;
	
  console.log('in get files for queriedPath ... ' + queriedPath);
  var args = url.parse(request.url, true).query;
  //var path = "/sws/files?uid=5112&path=|"; 			// + args['path'];
	
  var path = '/sws/files?uid=' + usernum + '&path=' + queriedPath;
  
  path = path + '&list=retrieve';
  
  // Query above is an object containing all the 
  // arguments in the URL as key-value pairs. 
  var options = {
    host: proxy.serviceHost,
	port: proxy.servicePort,
	path: path,
	method: 'GET'
  };

  console.log('path->' + path);
  
  
  if(proxy.firewallMode) {
	  
	  var res = files.filesproxyHelperFirewall(request, response);
	  
  } else {

	  var res = files.filesproxyHelper(request, response);
	  
  }
  
  	
	
});


/*************************************************************/

function isArray(what) 
{
    return Object.prototype.toString.call(what) === '[object Array]';
}






http.createServer(app).listen(1337);
