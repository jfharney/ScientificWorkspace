var express = require('express');
var app = express();

var firewallMode = false;

var hbs = require('hbs');

var http = require('http');
var url = require('url');


app.use(express.static('public'));

var servicePort = 8080;

app.get('/sciworkspace',function(req,res) {
	//res.sendfile('./views/charisma/index.html');
	res.render('./views/charisma/index.html',{a : 'a'});
});

//main page
//app.get('/sciworkspace/:user_id',function(req,res) {
app.get('/',function(req,res) {
		
//if()

	
	if(req.params.user_id == undefined) {
		console.log('No user given...use default');
	} else {
		console.log('User is ' + req.params.user_id);
	}
	
	
	/*
	console.log('params: ' + request.params.job_id);
	  
	var options = {
			host: 'localhost',
			port: servicePort,
			path: '/jobs/'+request.params.job_id,
			method: 'GET'
	};
	*/
	
	
	
	
    res.sendfile('./views/charisma/index.html');
});




var files = require('./proxy/files.js');


var jobs = require('./proxy/jobs.js');

var apps = require('./proxy/apps.js');





//users proxy service
app.get('/users',function(request,response) {
  
  
  var options = {
    host: 'localhost',
    port: servicePort,
    path: '/users',
    method: 'GET'
  };
  
  
  var responseData = '';
  
  if(firewallMode) {
	  
	  var jsonObj = JSON.parse(responseData);
	  response.send(jsonObj);
  } else {
	  
	  var req = http.request(options, function(res) {
		    console.log('STATUS: ' + res.statusCode);
		    res.setEncoding('utf8');
		    res.on('data', function (chunk) {
		    
		      responseData += chunk;

		    });
		     
		    res.on("end", function () {
		        // you can use res.send instead of console.log to output via express
		        response.send(responseData);
		    }); 
		     
		      
		  });
		  
		  req.on('error', function(e) {
		    console.log('problem with request: ' + e.message);
		  });
		  
		  // write data to request body
		  req.write('data\n');
		  req.write('data\n');
		  req.end();
		  
  }
  
  
});




/*
//apps proxy service
app.get('/apps',function(request,response) {
  var options = {
	host: 'localhost',
	port: servicePort,
	path: '/apps',
	method: 'GET'
  };
	  
  console.log('in service side /apps');
  
  var responseData = '';
	  
  var responseData = '';
  
  if(firewallMode) {
	  
	  var jsonObj = JSON.parse(responseData);
	  response.send(jsonObj);
  } else {
	  
  
	  var req = http.request(options, function(res) {
		    console.log('STATUS: ' + res.statusCode);
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
			  responseData += chunk;	
		    });
			     
		    res.on("end", function () {
		    	
		    	
		    	//console.log('apps responseData:\n ' + responseData);
		    	
		    	
		    	//var data = {
		    	//};
		    	
		    	//console.log('apps: ' );//+ data['jobs'][0]['user_id']);
		    	
		    	
		    	
		    //// you can use res.send instead of console.log to output via express
		    	//var jsonObj = JSON.parse(responseData);
		        ////response.send(jsonObj);
		        
		    	var data = {'app':'aaa'};
		    	response.send(data);
		    }); 
			     
			      
		  });
			  
		  req.on('error', function(e) {
		    console.log('problem with request: ' + e.message);
		  });
		   
		  // write data to request body
		  req.write('data\n');
		  req.write('data\n');
		  req.end();
	  
	  
  }
  
});
*/



/*
//jobs proxy service
app.get('/jobs',function(request,response) {
  var options = {
	host: 'localhost',
	port: servicePort,
	path: '/jobs',
	method: 'GET'
  };
	  
  console.log('in service side /jobs');
  
  var responseData = '';
  
  if(firewallMode) {
      responseData = '{ "jobs" : [ { "job_id" : "job1"} , { "job_id" : "job2"} ] }'; 
      var jsonObj = JSON.parse(responseData);
      response.send(jsonObj);
  }	else {
	  
	  var req = http.request(options, function(res) {
	    console.log('STATUS: ' + res.statusCode);
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
		  responseData += chunk;	
	    });
		     
	    res.on("end", function () {
	    	
	    	var data = { 'jobs' : [  
	  	                         	{ 'job_id' : '1' , 'user_id' : 'j1s'},
	  	                         	{ 'job_id' : '2' , 'user_id' : 'j1s'},
	    	                      ]
	    	};
	    	
	    	console.log('jobs: ' + data['jobs'][0]['user_id']);
	    	
	    	console.log('jobs responseData:\n ' + responseData);
	    	
	    // you can use res.send instead of console.log to output via express
	    	var jsonObj = JSON.parse(responseData);
	        //response.send(jsonObj);
	    	response.send(data);
	    }); 
		     
		      
	  });
	 
		  
	  req.on('error', function(e) {
	    console.log('problem with request: ' + e.message);
	  });
	   
	  // write data to request body
	  req.write('data\n');
	  req.write('data\n');
	  req.end();
	   

  }
  
  var jsonObj = JSON.parse(responseData);
  response.send(jsonObj);
  
  
});
*/



//--------jobs API---------//


//sample- initial files data proxy service
app.get('/initjobsdata',function(request,response) {

	console.log('init jobs data');
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
	respText = '[{"title": "Jobs For eendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
							
	response.send(respText);


});



app.get('/jobs',function(request,response) {
	
	
	
	//grab all the parts of the url
	var url_parts = url.parse(request.url, true);
	
	
	var query = url_parts.query;
	
	var path = '/jobs?';
	
	//determine if it is a valid job - how?
	//API doc says that jobs must:
	//
	//
	var isJob = false;
	for(var key in query) {
		console.log('key: ' + key + ' value: ' + query[key]);
		if(key == 'path') {
			filePath = query[key];
		}
		if(key == 'type') {
			if(query[key] == 'jobs') {
				isJob = true;
			}
		}
		path += key + '=' + query[key] + '&';
	}
	
	console.log('query: ' + path);
	
	
	if(!firewallMode) {
		
		//find if it is a query for the jobs or the apps
		if(isJob) {
			
			//query the jobs service here
			var options = {
					host: 'localhost',
					port: servicePort,
					path: '/jobs?username=eendeve',
						//path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
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
					  
					  var jsonStr = jobs.doQueryJobs(responseData);
			    	  
			    	  
					  var respText = jsonStr; 
					  response.send(respText);
					  
					  
				  });
				  
			  
			 }).on('error', function(e) {
				 
				  console.log("Got error: " + e.message);
			 
			 });

			 req.end();
			 
				
			
		}
		//other wise send a message back to the front end indicating that it is an invalid job
		else {
			console.log('need to send app information back');
			
			//query the apps service here
			var options = {
					host: 'localhost',
					port: servicePort,
					path: '/apps?username=eendeve',
						//path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
					//path: '/apps',
					method: 'GET'
				  };
			
			var fileResponseJSONStr = '{ ' + 
			'"apps" : [' +
			'  {' + 
			'    "jobid" : 1723340,' +
			'    "starttime" : "2013-09-02T00:06:36.000Z", ' +
			'    "appid" : "3500338", ' +
			'    "command" : "/usr/bin/aprun -n65536 ./FreeStreaming2D3D_titan_cray ", ' +
			'    "endtime" : "2013-09-02T00:07:19.000Z", ' +
			'    "exitcode" : 137, ' +
			'    "hostname" : "titan", ' +
			'    "exitcode" : 4096 ' +
			'  },' +
			'  {' + 
			'    "jobid" : 1723340,' +
			'    "starttime" : "2013-10-02T00:06:36.000Z", ' +
			'    "appid" : "45003384500338450033845003384500338450033845003384500338", ' +
			'    "command" : "/usr/bin/aprun -n65536 ./FreeStreaming2D3D_titan_cray ", ' +
			'    "endtime" : "2013-10-02T00:07:19.000Z", ' +
			'    "exitcode" : 137, ' +
			'    "hostname" : "titan", ' +
			'    "exitcode" : 4096 ' +
			'  }' +
			//'  {' + 
			//'  }' +
			']' +
			'}';
			
			
			var jsonStr = apps.doQueryApps(fileResponseJSONStr);
			
			response.send(jsonStr);
		}
		
		
		
	}
	else {
		console.log('In firewall mode for jobs');
		
		
		//find if it is a query for the jobs or the apps
		if(isJob) {
			
			console.log('It is a job');
			

			var fileResponseJSONStr = '{ ' + 
				'"jobs" : [' +
				'  {' + 
				'    "jobid" : 1723340,' +
				'    "starttime" : "2013-09-02T00:06:36.000Z", ' +
				'    "endtime" : "2013-09-02T00:07:58.000Z", ' +
				'    "groupname" : "AST005", ' +
				'    "hostname" : "titan", ' +
				'    "joberr" : 137, ' +
				'    "jobname" : "Boltzmann2D3D", ' +
				'    "processors" : 4096, ' +
				'    "username" : "eendeve", ' +
				'    "processors" : 4096 ' +
				'  },' +
				'  {' + 
				'    "jobid" : 172334000000000,' +
				'    "starttime" : "2013-09-02T00:06:36.000Z",' +
				'    "endtime" : "2013-09-02T00:07:58.000Z", ' +
				'    "groupname" : "AST005", ' +
				'    "hostname" : "titan", ' +
				'    "joberr" : 137, ' +
				'    "jobname" : "Boltzmann2D3Dff", ' +
				'    "processors" : 4096, ' +
				'    "username" : "eendeve", ' +
				'    "processors" : 4096' +
				'  }' +
				//'  {' + 
				//'  }' +
				']' +
				'}';
			 
			 var jsonStr = jobs.doQueryJobs(fileResponseJSONStr);
			 //var jsonStr = fileResponseJSONStr;
			 
			 console.log('jsonStr: ' + jsonStr);
			 
			 var respText = jsonStr; 
			 response.send(respText);
			
		
		}
		else {

			console.log('It is an app');
			
			var fileResponseJSONStr = '{ ' + 
			'"apps" : [' +
			'  {' + 
			'    "jobid" : 1723340,' +
			'    "starttime" : "2013-09-02T00:06:36.000Z", ' +
			'    "appid" : "3500338", ' +
			'    "command" : "/usr/bin/aprun -n65536 ./FreeStreaming2D3D_titan_cray ", ' +
			'    "endtime" : "2013-09-02T00:07:19.000Z", ' +
			'    "exitcode" : 137, ' +
			'    "hostname" : "titan", ' +
			'    "exitcode" : 4096 ' +
			'  },' +
			'  {' + 
			'    "jobid" : 1723340,' +
			'    "starttime" : "2013-10-02T00:06:36.000Z", ' +
			'    "appid" : "45003384500338450033845003384500338450033845003384500338", ' +
			'    "command" : "/usr/bin/aprun -n65536 ./FreeStreaming2D3D_titan_cray ", ' +
			'    "endtime" : "2013-10-02T00:07:19.000Z", ' +
			'    "exitcode" : 137, ' +
			'    "hostname" : "titan", ' +
			'    "exitcode" : 4096 ' +
			'  }' +
			//'  {' + 
			//'  }' +
			']' +
			'}';
			
			
			var jsonStr = apps.doQueryApps(fileResponseJSONStr);
			
			response.send(jsonStr);
			
			
			
		}
		
		
		
	}
	
	
	
	
	 
	 
});


//files proxy service
app.get('/jobsinfo',function(request,response) {
	
	console.log ('calling jobs proxy...');
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;

	var path = '/jobs';
	
	var isJob = false;
	
	for(var key in query) {
		//console.log('jobsinfo key: ' + key + ' value: ' + query[key]);
		if(key == 'path') {
			filePath = query[key];
		}
		if(key == 'type') {
			if(query[key] == 'jobs') {
				isJob = true;
			}
		}
		path += key + '=' + query[key] + '&';
	}
	
	path = '/jobs/job_id';
	
	if(!firewallMode) {
		if(isJob) {
			
		} 
		else {
			
		}
		
	} else {
		
		if(isJob) {
			var fileResponseJSONStr = '{ ' + 
			'    "jobid" : 1723340,' +
			'    "starttime" : "2013-09-02T00:06:36.000Z", ' +
			'    "endtime" : "2013-09-02T00:07:58.000Z", ' +
			'    "groupname" : "AST005", ' +
			'    "hostname" : "titan", ' +
			'    "joberr" : 137, ' +
			'    "jobname" : "Boltzmann2D3D", ' +
			'    "processors" : 4096, ' +
			'    "username" : "eendeve", ' +
			'    "processors" : 4096 ' +
			'  }';
			
			var jsonStr = fileResponseJSONStr;
			 
			//var jsonObj = JSON.parse(jsonStr);
		  
			var respText = jsonStr; 
			response.send(respText);
			
		}
		else {
			
			var fileResponseJSONStr = '{ ' + 
			'    "appid" : 1723340,' +
			'    "starttime" : "2013-09-02T00:06:36.000Z", ' +
			'    "endtime" : "2013-09-02T00:07:58.000Z", ' +
			'    "groupname" : "AST005", ' +
			'    "hostname" : "titan", ' +
			'    "joberr" : 137, ' +
			'    "jobname" : "Boltzmann2D3D", ' +
			'    "processors" : 4096, ' +
			'    "username" : "eendeve", ' +
			'    "processors" : 4096 ' +
			'  }';
			
			var jsonStr = fileResponseJSONStr;
			 
			//var jsonObj = JSON.parse(jsonStr);
		  
			var respText = jsonStr; 
			response.send(respText);
			
		}
		
	}
	
	/*
	var path = '/jobs?';
	
	var filePath = '';
	
	for(var key in query) {
		//console.log('key: ' + key + ' value: ' + query[key]);
		if(key == 'path') {
			filePath = query[key];
		}
		path += key + '=' + query[key] + '&';
	}
	
	console.log('filesproxyquery: ' + path);
	
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
				  console.log('\n\n\n\nchunk: ' + chunk);
				  responseData += chunk;	
				  
				  
				  // you can use res.send instead of console.log to output via express
				  
			     
		    	  //construct the respText array
		    	  //var a = '{"title": "SubItem 1", "isLazy": true }';
		    	  
		    	  //jsonStr = '[{ "title" : "ChromaBuilds1",  "isLazy" : true ,  "isFolder" : true} , { "title" : "ChromaBuilds2",  "isLazy" : true ,  "isFolder" : true}]';

		    	
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
	 */
	 
	 
});







//--------end jobs API---------//









//--------files API---------//


//sample- initial files data proxy service
app.get('/initfilesdata',function(request,response) {

	console.log('init files data');
	
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
								
	response.send(respText);


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
	
	console.log('filesproxyquery: ' + path);
	
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
				  console.log('\n\n\n\nchunk: ' + chunk);
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
	
	
	console.log ('calling files...');
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	
	
	
	var path = '/files?';
	
	var filePath = '';
	
	for(var key in query) {
		console.log('key: ' + key + ' value: ' + query[key]);
		if(key == 'path') {
			filePath = query[key];
		}
		path += key + '=' + query[key] + '&';
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
				  console.log('\n\n\n\nchunk: ' + chunk);
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









app.listen(3000);









































/*
//olds jobs proxy service
app.get('/jobs/:job_id',function(request,response) {
  console.log('params: ' + request.params.job_id);
	  
  var options = {
    host: 'localhost',
	port: servicePort,
	path: '/jobs/'+request.params.job_id,
	method: 'GET'
  };
	  
  var responseData = '';
	
  if(firewallMode) {
	  
	  if(request.params.job_id == 'job1') {
		  responseData = '{ "apps" : [ { "app_id" : "app1" } , { "app_id" : "app2" } ] }';
	  } else { 
		  responseData = '{ "apps" : [ { "app_id" : "app3" } , { "app_id" : "app4" } ] }'; 
	  }
  
	  var jsonObj = JSON.parse(responseData);
	  response.send(jsonObj);
  } else {
	  
  //
  //var req = http.request(options, function(res) {
  //  console.log('STATUS: ' + res.statusCode);
//res.setEncoding('utf8');
//	res.on('data', function (chunk) {
//	  responseData += chunk;	
 //   });
	     
//    res.on("end", function () {
 //   // you can use res.send instead of console.log to output via express
  //  	var jsonObj = JSON.parse(responseData);
   //     response.send(jsonObj);
   // }); 
	     
	      
 // });
	  
//  req.on('error', function(e) {
 //   console.log('problem with request: ' + e.message);
  //});
	  
//  // write data to request body
  //req.write('data\n');
  //req.write('data\n');
  //req.end();
  //
	  
  }

  
  
  
});
*/






