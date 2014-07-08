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
var tags = require('./proxy/tags.js');


var data = require('./data/firewall_sources.js');

if(proxy.firewallMode)
  console.log('firewall: ' + proxy.firewallMode);

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
	
  console.log('A GET for /workspace/:user_id has been issued.');
  
  var userObj = {"nid":39644,"uid":5112,"uname":"8xo","name":"John F. Harney","type":0,"email":"harneyjf@ornl.gov"};

  if(proxy.firewallMode) {
    response.render("index1", userObj);
  } 
  else {
    var options = {
      host: proxy.serviceHost,
      port: proxy.servicePort,
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
    	 
  }  
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


function isArray(what) 
{
    return Object.prototype.toString.call(what) === '[object Array]';
}


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

app.get('/appinfo', function(request, response) {
  if(proxy.firewallMode) {
	  
	  
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
	console.log('\n\n---------in tag proxy----------');
	
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



//-----------End Tags-----------//


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
	  
	  
	  //the source
	  var files = data.jsonFileResponse['files'];
	  
	  var dynatreeJSONArr = [];
	  
	  for(var i=0;i<files.length;i++) {
			
			var dynatreeJSONObj = {};
			
			
			//console.log('i: ' + i + ' ' + files[i]);
			var file = files[i];
			
			for(var key in file) {
				console.log('key: ' + key + ' value: ' + file[key]);
			}
			
			if(queriedPath == '|') {
				dynatreeJSONObj['title'] = '|' + file['name'];
				
				//directory if type is 5 otherwise it is a file
				if(file['type'] == 5) {
					dynatreeJSONObj['isFolder'] = false;
					dynatreeJSONObj['isLazy'] = false;
				} else { 
					dynatreeJSONObj['isFolder'] = false;
					dynatreeJSONObj['isLazy'] = false;
				}
				
				dynatreeJSONObj['path'] = '|' + file['name'];
				dynatreeJSONObj['nid'] = file['nid'];
			} else {
				dynatreeJSONObj['title'] = queriedPath + '|' + file['name'];
				if(file['type'] == 5) {
					dynatreeJSONObj['isFolder'] = true;
					dynatreeJSONObj['isLazy'] = true;
				} else { 
					dynatreeJSONObj['isFolder'] = false;
					dynatreeJSONObj['isLazy'] = false;
				}
				dynatreeJSONObj['path'] = queriedPath + '|' + file['name'];
				dynatreeJSONObj['nid'] = file['nid'];
			}
			
			//console.log('dynatreeJSONObj: ' + dynatreeJSONObj);
			
			dynatreeJSONArr.push(dynatreeJSONObj);
			
			
		}
	  

		response.send(dynatreeJSONArr);
	  
  } else {
	  
	  
	  var req = http.request(options, function(resp) {
			//console.log('Got response status code ' + resp.statusCode);
			
			var responseData = '';
			resp.on('data', function(chunk) {
				responseData += chunk;
			});
			
			resp.on('end', function() {
				console.log('in resp end for files... ' + responseData);
				var jsonObj = JSON.parse(responseData);
				
				var files = jsonObj['files'];
				
				var dynatreeJSONArr = [];
				
				if(files != undefined) {
					for(var i=0;i<files.length;i++) {
						
						var dynatreeJSONObj = {};
						
						//console.log('i: ' + i + ' ' + files[i]);
						var file = files[i];
						
						for(var key in file) {
							//console.log('key: ' + key + ' value: ' + file[key]);
						}
						
						if(queriedPath == '|') {
							dynatreeJSONObj['title'] = '|' + file['name'];
							
							//directory if type is 5 otherwise it is a file
							if(file['type'] == 5) {
								dynatreeJSONObj['isFolder'] = true;
								dynatreeJSONObj['isLazy'] = true;
							} else { 
								dynatreeJSONObj['isFolder'] = false;
								dynatreeJSONObj['isLazy'] = false;
							}
							
							dynatreeJSONObj['path'] = '|' + file['name'];
							dynatreeJSONObj['nid'] = file['nid'];
						} else {
							dynatreeJSONObj['title'] = queriedPath + '|' + file['name'];
							if(file['type'] == 5) {
								dynatreeJSONObj['isFolder'] = true;
								dynatreeJSONObj['isLazy'] = true;
							} else { 
								dynatreeJSONObj['isFolder'] = false;
								dynatreeJSONObj['isLazy'] = false;
							}
							dynatreeJSONObj['path'] = queriedPath + '|' + file['name'];
							dynatreeJSONObj['nid'] = file['nid'];
						}
						
						
						dynatreeJSONArr.push(dynatreeJSONObj);
						
					}
					
				} else {
					
				}
				
				
				//response.send(jsonObj);
				response.send(dynatreeJSONArr);
			});
			
			resp.on('error', function(e) {
				response.send('error: ' + e);
			});
		});
		
		req.end();

	  
	  
  }
  
  	
	
});



//files proxy service
app.get('/filesinfo', function(request,response) {
	
	
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
			host: proxy.serviceHost,
			port: proxy.servicePort,
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





http.createServer(app).listen(1337);









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







/* OLD
 * var numPipes = (args['path'].split('|')).length - 1;

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
response.send(respText);





*/
	




//--removed on 7-7

/*
//appsObjArr
var jsonFileResponse = {};

jsonFileResponse['nid'] = 200004;
jsonFileResponse['xuid'] = 0;
jsonFileResponse['xgid'] = 2329;
jsonFileResponse['name'] = 'stf008';
jsonFileResponse['ctime'] = 1380646733;
jsonFileResponse['type'] = 5;
jsonFileResponse['mtime'] = 1380646733;
jsonFileResponse['files'] = [];

var file1 = {};
file1['nid'] = 200008;
file1['xuid'] = 0;
file1['xgid'] = 2329;
file1['name'] = 'proj-shared1';
file1['fmode'] = 504;
file1['ctime'] = 1386265998;
file1['mtime'] = 1386265998;

var file2 = {};
file2['nid'] = 200008;
file2['xuid'] = 0;
file2['xgid'] = 2329;
file2['name'] = 'proj-shared2';
file2['fmode'] = 504;
file2['ctime'] = 1386265998;
file2['mtime'] = 1386265998;

jsonFileResponse['files'].push(file1);
jsonFileResponse['files'].push(file2);
*/



/*
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

if(i == 0) {
  respObj['title'] = jobsObj1['name'];
  respObj['isFolder'] = true;
  respObj['isLazy'] = true;
  respObj['type'] = 2;
  respObj['jobid'] = jobsObj1['jid'];
  respObj['tooltip'] = 'This is a tooltip.';
  respObj['nid'] = jobsObj1['nid'];
	
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
*/



/*
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
*/


/*
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
*/

//appsObjArr = data.appsObjArr;

/*
for(var i=0;i<temp.length;i++) {
	  for (var key in temp[i]) {
		  if(key == 'nid')
		  console.log('nid: ' + temp[i]['nid']);
	  }  
}
*/

/*
var jobsObjArr = data.jobsObjArr;

for(var i=0;i<jobsObjArr.length;i++) {
	  
	  var job = jobsObjArr[i];
	  console.log('i: ' + i + ' temp[i]: ' + jobsObjArr[i]);
	  for(var key in job) {
		  console.log('key: ' + key + ' value: ' + job[key]);
	  }
	  
	  var nid = jobsObjArr[i]['nid'];
	  console.log('nid: ' + nid);
  }

var respArr = [];

for(var i = 0; i < 2; i++) {
  var respObj = {};
  respObj['title'] = jobsObjArr[i]['name'];
  respObj['isFolder'] = true;
  respObj['isLazy'] = true;
  respObj['type'] = 2;
  respObj['jobid'] = jobsObjArr[i]['jid'];
  respObj['tooltip'] = 'This is a tooltip.';
  respObj['nid'] = jobsObjArr[i]['nid'];
  
    respArr.push(respObj);
}


response.send(respArr);
*/

/*
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
*/

/*
if(i == 0) {
  respObj['gname'] = groupObj1['gname'];
  respObj['isFolder'] = true;
  respObj['type'] = 2;
  respObj['gid'] = groupObj1['gid'];
  respObj['tooltip'] = 'This is a tooltip.';
  respObj['nid'] = groupObj1['nid'];
}
else if(i == 1) {
  respObj['gname'] = groupObj2['gname'];
  respObj['isFolder'] = true;
  respObj['type'] = 2;
  respObj['gid'] = groupObj2['gid'];
  respObj['tooltip'] = 'This is a tooltip.';
  respObj['nid'] = groupObj2['nid'];
}
else {
  respObj['gname'] = groupObj3['gname'];
  respObj['isFolder'] = true;
  respObj['type'] = 2;
  respObj['gid'] = groupObj3['gid'];
  respObj['tooltip'] = 'This is a tooltip.';
  respObj['nid'] = groupObj3['nid'];			
}
*/

/*
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
*/

/*
var groupGidArr = [];
for(var i = 0; i < groupObjsArr.length; i++)
  groupGidArr.push(groupObjsArr[i]['gid']);

var groupNidArr = [];
for(var i = 0; i < groupObjsArr.length; i++)
  groupNidArr.push(groupObjsArr[i]['nid']);

var groupNameArr = [];
for(var i = 0; i < groupObjsArr.length; i++)
  groupNameArr.push(groupObjsArr[i]['gname']);
*/


