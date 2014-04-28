console.log('Loading jobs js');

var express = require('express');
var app = express();

var firewallMode = false;

var http = require('http');

var servicePort = 8080;



var jobsproxyHelper = function(request, response) {

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
			  
			  //console.log('ending groups/gid...');
			  //console.log('response data\n' + responseData);
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);
			 
			  var jobsArr = new Array();
			  var jobNamesArr = new Array();
			  var jobuuidsArr = new Array();
			  
			  for(var key in jsonObj) {
				  //the value of jsonObj is an aray
				  for(var i=0;i<jsonObj[key].length;i++) {
					  var jobid = jsonObj[key][i]['jobid'];
					  var jobname = jsonObj[key][i]['jobname'];
					  var jobuuid = jsonObj[key][i]['uuid'];
					  jobsArr.push(jobid);
					  jobNamesArr.push(jobname);
					  jobuuidsArr.push(jobuuid);
				  }
			  }
			  //console.log(jobsArr);
			  
			  
			  var respArr = [];
			  for(var i=0;i<jobsArr.length;i++) {
				  var respObj = {"title" : jobNamesArr[i], 'isFolder' : true, "isLazy" : true, "type" : "job", "jobid" : jobsArr[i], 'uuid' : jobuuidsArr[i]};
				  respArr.push(respObj);
			  }
			  
			  console.log('respArrrrr: ' + respArr[0]);
			  for(var key in respArr[0]) {
				  console.log('key: ' + key + ' ' + respArr[0][key]);
			  }
			  response.send(respArr);
			  
			  
			 
				
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
		//console.log('init jobs data');
			var respText =	'[ {"title": "Item 11"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
			//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
			respText = '[{"title": "Jobs For eendeve11", "isFolder": true, "isLazy": true	, "type" : "job" } ]';
									
			var jsonObj = JSON.parse(respText);
			response.send(jsonObj);
			//response.send(respText);

		  
	 });
	
	

	 req.end();
};

var jobsinfoHelper = function(request, response) {

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
	
};


module.exports.jobsinfoHelper = jobsinfoHelper;

exports.doQueryJobs = function(responseData) {
	
	//console.log('responseData: \n' + responseData);
	
	console.log('---------------')
	var fileResponseJSONObj = JSON.parse(responseData);//JSON.parse(fileResponseJSONStr);////
	  
	var hasJobs = false;
	for(var key in fileResponseJSONObj) {
		//console.log('doqueryjobskey: ' + key + ' value: ' + fileResponseJSONObj[key] + ' LENGTH: ' + fileResponseJSONObj[key].length);
		if(fileResponseJSONObj[key].length > 0) {
			hasJobs = true;
		}
		var jobsObj = fileResponseJSONObj[key];
		for(var keykey in jobsObj) {
			var jobObj = jobsObj[keykey];
			//for(var keykeykey in jobObj) 
				//console.log('\t' + keykeykey + ' val: ' + jobObj[keykeykey]);
		}
	}
	

	console.log('---------------')
	
	var jobsArr = fileResponseJSONObj['jobs'];
	//console.log(jobsArr.length);
	var jsonStr = '[';
	for(var i=0;i<jobsArr.length;i++) {
		jsonStr += '{"title": "' + jobsArr[i]['jobname'] + ' (' + jobsArr[i]['jobid'] + ')' + '", "isFolder": true, "isLazy": true , "type" : "apps" }';
		if(i < jobsArr.length-1) {
			jsonStr += ',';
		}
	}
	jsonStr += ']';
	//fileResponseJSONStr = '[{"title": "aTitle", "isFolder": true, "isLazy": true , "type" : "apps" }]';
	fileResponseJSONStr = jsonStr;
	
	//console.log('fileResponse: ' + fileResponseJSONStr);
	
	return fileResponseJSONStr;
	
}


module.exports.jobsproxyHelper = jobsproxyHelper;







/*
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
			  
			  //console.log('ending groups/gid...');
			  //console.log('response data\n' + responseData);
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);
			 
			  var jobsArr = new Array();
			  var jobNamesArr = new Array();
			  var jobuuidsArr = new Array();
			  
			  for(var key in jsonObj) {
				  //the value of jsonObj is an aray
				  for(var i=0;i<jsonObj[key].length;i++) {
					  var jobid = jsonObj[key][i]['jobid'];
					  var jobname = jsonObj[key][i]['jobname'];
					  var jobuuid = jsonObj[key][i]['uuid'];
					  jobsArr.push(jobid);
					  jobNamesArr.push(jobname);
					  jobuuidsArr.push(jobuuid);
				  }
			  }
			  //console.log(jobsArr);
			  
			  
			  var respArr = [];
			  for(var i=0;i<jobsArr.length;i++) {
				  var respObj = {"title" : jobNamesArr[i], 'isFolder' : true, "isLazy" : true, "type" : "job", "jobid" : jobsArr[i], 'uuid' : jobuuidsArr[i]};
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
			respText = '[{"title": "Jobs For eendeve11", "isFolder": true, "isLazy": true	, "type" : "job" } ]';
									
			var jsonObj = JSON.parse(respText);
			response.send(jsonObj);
			//response.send(respText);

		  
	 });
	
	

	 req.end();
	
	 
	 
});
*/


/*
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
*/



