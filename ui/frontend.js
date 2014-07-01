var express = require('express');
var app = express();
var firewallMode = true;
var http = require('http');
var url = require('url');
//app.use(express.static(__dirname + 'public'));
var serviceHost = 'techint-b117';
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

var counter = 0;
var counter2 = 0;

var associations = [];

var association = {
					'name' : 'association1', 
					'source' : 'resource1',
					'target' : 'resource2'
				  };

associations.push(association);

var associations2 = [];

var association2 = {
					'name' : 'association2', 
					'source' : 'resource2',
					'target' : 'resource2'
				  };

associations2.push(association2);

app.get('/server1', function(request, response) {
	
	counter = counter + 1;
	
	console.log('output for server1 ' + counter + ' ' + (counter % 1000));
	
	if(counter > 10) {
		counter = 0;
		
		var d = new Date();
		var n = d.getMilliseconds(); 
		
		//get the associations
		var returnedAssocations = associations;
		
		var association = {
				'name' : 'association-1-' + n, 
				'source' : 'resource-1-' + n,
				'target' : 'resource-1-' + n
			  };

		associations.push(association);
		
		response.send(returnedAssocations);
	}
	
});


app.get('/server2', function(request, response) {
	
	counter2 = counter2 + 1;
	
	console.log('output for server2 ' + counter2 + ' ' + (counter2 % 1000));
	
	//if(counter2 > 10) {
		counter2 = 0;
		
		var d = new Date();
		var n = d.getMilliseconds(); 
		
		//get the associations
		var returnedAssocations2 = associations2;
		
		var association2 = {
				'name' : 'association-2-' + n, 
				'source' : 'resource-2-' + n,
				'target' : 'resource-2-' + n
			  };

		associations2.push(association2);
		
		response.send(returnedAssocations2);
	//}
	
});


app.get("/", function(request, response) {
	  response.redirect('/workspace/users/j1s');
});

app.get("/settings/:user_id", function(request, response) {
	  console.log('\n\n---------in settings proxy for ' + request.params.user_id + '----------');
	
	  response.render("settings", { uid : request.params.user_id });
});

app.get("/workspace/:user_id", function(request, response) {
//<<<<<<< HEAD
  /* Original Version: */
  //response.render("index1", { uid : request.params.user_id });
//=======

  /* Version for when server is NOT working: */
//>>>>>>> 841c13079f4f626160c44a7e7b1624687ffa4ec2
	
	console.log('A GET for /workspace/:user_id has been issued.');
	  
	var options = {
	  host: 'localhost',
	  port: '1337',
	  path: '/offline',
	  method: 'GET'
	};
    var userObj = {"nid":39644,"uid":5112,"uname":"8xo","name":"John F. Harney","type":0,"email":"dillowda@ornl.gov"};

    //var req = http.request(options, function(resp) {
    if(firewallMode)
      response.render("index1", userObj);
      //console.log('The page has been rendered.');


});

			
	
  /* Version for when server is working:
	  
  var userObj = {};

<<<<<<< HEAD
  /* Make a request to return all user data, based on the username.*/
  
  /*
=======
  // Make a request to return all user data, based on the username.
>>>>>>> 841c13079f4f626160c44a7e7b1624687ffa4ec2
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
  });*/
		
//<<<<<<< HEAD
//  req.end();
  
//=======
  //req.end();
  
//});

app.get('/offline', function(request, response) {
  response.send('');
//>>>>>>> 841c13079f4f626160c44a7e7b1624687ffa4ec2
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
  if(firewallMode) {
	var groupObjsArr = [];
	
	var groupObj1 = {};
	groupObj1['nid'] = 54608;
	groupObj1['gid'] = 2184;
	groupObj1['gname'] = 'cli017dev';
	groupObj1['type'] = 1;
	groupObjsArr.push(groupObj1);
	
	var groupObj2 = {};
	groupObj2['nid'] = 53928;
	groupObj2['gid'] = 2058;
	groupObj2['gname'] = 'cli017';
	groupObj2['type'] = 1;
	groupObjsArr.push(groupObj2);
	
	var groupObj3 = {};
	groupObj3['nid'] = 54896;
	groupObj3['gid'] = 18626;
	groupObj3['gname'] = 'jamroz';
	groupObj3['type'] = 1;
	groupObjsArr.push(groupObj3);
	
	response.send(groupObjsArr);
  }	
  else {
    var res = groups.groupinfoHelper(request, response);  
  }
  
});

//groups on lazy read off of the tree
app.get('/groups/:gid',function(request, response) {
  //console.log('gid -> ' + request.params.gid);
  var res = groups.groupsHelper(request, response);
});

/*************************************************************/
//--------Jobs API----------//

app.get('/jobsproxy/:userNum', function(request, response) {
	if(firewallMode) {
		var jobsObjArr = [];
		var jobsObj1 = {};
		jobsObj1['nid'] = 88388;
		jobsObj1['nodes'] = 1;
		jobsObj1['jid'] = 1722972;
		jobsObj1['err'] = 0;
		jobsObj1['stop'] = 1378024278;
		jobsObj1['host'] = 'titan';
		jobsObj1['start'] = 1378024199;
		jobsObj1['name'] = 'swtc1';
		jobsObj1['type'] = 2;
		jobsObj1['wall'] = 0;
		jobsObj1['user'] = 9238;
		jobsObjArr.push(jobsObj1);

		var jobsObj2 = {};
		jobsObj2['nid'] = 88516;
		jobsObj2['nodes'] = 1;
		jobsObj2['jid'] = 1722981;
		jobsObj2['err'] = 0;
		jobsObj2['stop'] = 1378027579;
		jobsObj2['host'] = 'titan';
		jobsObj2['start'] = 1378027539;
		jobsObj2['name'] = 'swtc1-dg';
		jobsObj2['type'] = 2;
		jobsObj2['wall'] = 0;
		jobsObj2['user'] = 9238;
		jobsObjArr.push(jobsObj2);
		
		var jobJidArr = [];
		for(var i = 0; i < jobsObjArr.length; i++)
		  jobJidArr.push(jobsObjArr[i]['jid']);
		
		var jobNidArr = [];
		for(var i = 0; i < jobsObjArr.length; i++)
		  jobNidArr.push(jobsObjArr[i]['nid']);

		var jobNameArr = [];
		for(var i = 0; i < jobsObjArr.length; i++)
			jobNameArr.push(jobsObjArr[i]['name']);
		
		var respArr = [];
        
		for(var i = 0; i < 2; i++) {
		  var respObj = {};
			if(i == 0) {
			  respObj['title'] = jobsObj1['name'];
			  respObj['isFolder'] = true;
			  respObj['isLazy'] = true;
			  respObj['type'] = 2;
			  respObj['jobid'] = jobsObj1['jid'];
			  respObj['tooltip'] = 'This is a tooltip.';
			  respObj['nid'] = jobsObj1['nid'];
				
		  /*  respObj = {"title" : jobNameArr[i], 
 			   "isFolder" : true, 
 			   "isLazy" : true, 
 			   "type" : 2, 
 			   "jobid" : jobJidArr[i],
 			   "tooltip" : 'This is a tooltip.',
 			   "nid" : jobNidArr[i]};*/
			}
			else {
				  respObj['title'] = jobsObj2['name'];
				  respObj['isFolder'] = true;
				  respObj['isLazy'] = true;
				  respObj['type'] = 2;
				  respObj['jobid'] = jobsObj2['jid'];
				  respObj['tooltip'] = 'This is a tooltip.';
				  respObj['nid'] = jobsObj2['nid'];
			}
		  respArr.push(respObj);
		}
		
		
		response.send(respArr);
	}
  else {
	  // jobsproxyHelper is defined in the file proxy/jobs.js.
	  jobs.jobsproxyHelper(request, response);
	  // We may reference :userNum with request.params.userNum.}
		response.send(respObj);
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
	console.log('apps proxy?');
	if(firewallMode) {
		  var appsObjArr = [];
		  
		  var appObj1 = {};
		  appObj1['nid'] = 93636;
		  appObj1['nodes'] = 1;
		  appObj1['err'] = 0;
		  appObj1['stop'] = 1378024273;
		  appObj1['host'] = 'titan';
		  appObj1['start'] = 1378024204;
		  appObj1['cmd'] = '/usr/bin/aprun -n 16 /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/test_execs/swtcA/swtcA';
		  appObj1['type'] = 3;
		  appObj1['aid'] = 3498899;
		  appObj1['job'] = 1722972;
		  appsObjArr.push(appObj1);
		  
		  var appObj2 = {};
		  appObj2['nid'] = 93656;
		  appObj2['nodes'] = 1;
		  appObj2['err'] = 0;
		  appObj2['stop'] = 1378024274;
		  appObj2['host'] = 'titan';
		  appObj2['start'] = 1378024274;
		  appObj2['cmd'] = '/usr/bin/aprun -n 1 /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/utils/cprnc/bin/cprnc /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/tests/swtc1/movies/swtc11.nc /lustre/widow/scratch/jamroz/h';
		  appObj2['type'] = 3;
		  appObj2['aid'] = 3498904;
		  appObj2['job'] = 1722972;
		  appsObjArr.push(appObj2);
		  

		  var respArr = [];
		  for(var i = 0; i < 2; i++) {
			  var respObj = {};
			  if(i == 0) {
				  respObj['title'] = appObj1['aid'];
				  respObj['type'] = appObj1['type'];
				  respObj['jobid'] = appObj1['job'];
				  respObj['uuid'] = appObj1['nid'];
				  respObj['appid'] = appObj1['aid'];
				  
			  } else {
				  respObj['title'] = appObj2['aid'];
				  respObj['type'] = appObj2['type'];
				  respObj['jobid'] = appObj2['job'];
				  respObj['uuid'] = appObj2['nid'];
				  respObj['appid'] = appObj2['aid'];
			  }
			
	          respArr.push(respObj);
		  }
				  
		  response.send(respArr);
		  
	  } else {

		  var res = apps.appsproxyHelper(request,response);
	  }
});

app.get('/appinfo', function(request, response) {
  if(firewallMode) {
	  
	  
	  /*
	  var appsObjArr = [];
	  
	  var appObj1 = {};
	  appObj1['nid'] = 93636;
	  appObj1['nodes'] = 1;
	  appObj1['err'] = 0;
	  appObj1['stop'] = 1378024273;
	  appObj1['host'] = 'titan';
	  appObj1['start'] = 1378024204;
	  appObj1['cmd'] = '/usr/bin/aprun -n 16 /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/test_execs/swtcA/swtcA';
	  appObj1['type'] = 3;
	  appObj1['aid'] = 3498899;
	  appObj1['job'] = 1722972;
	  ppsObjArr.push(appObj1);
	  
	  var appObj2 = {};
	  appObj2['nid'] = 93656;
	  appObj2['nodes'] = 1;
	  appObj2['err'] = 0;
	  appObj2['stop'] = 1378024274;
	  appObj2['host'] = 'titan';
	  appObj2['start'] = 1378024274;
	  appObj2['cmd'] = '/usr/bin/aprun -n 1 /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/utils/cprnc/bin/cprnc /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/tests/swtc1/movies/swtc11.nc /lustre/widow/scratch/jamroz/h';
	  appObj2['type'] = 3;
	  appObj2['aid'] = 3498904;
	  appObj2['job'] = 1722972;
	  appsObjArr.push(appObj2);
	  

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
  }
  else {
    var res = apps.appsproxyHelper(request,response);
  }
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
			host: serviceHost,
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


