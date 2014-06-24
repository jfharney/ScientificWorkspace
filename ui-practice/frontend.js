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

app.get('/sciworkspace1', function(request, response) {
	console.log('in sciworkspace 1');
	var jsonModel = {'a' : 'apple'};

	response.render("treeWithCards", jsonModel);
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

app.get('/jobsproxy/:username', function(request, response) {
  // jobsproxyHelper is defined in the file proxy/jobs.js.
  jobsproxyHelper(request, response);
  // We may reference :username with request.params.username.
});

//This function works with a URL containing or lacking a search parameter named "search". 
var jobsproxyHelper = function(request, response) {
  var path = '/jobs?username=' + request.params.username;

  var options = {
    host: 'localhost',
	port: servicePort,
	path: path,
	method: 'GET'
  };
  
  var args = url.parse(request.url, true).query;

  var responseData = '';
  var req = http.request(options, function(res) {
	res.on('data', function(chunk) {
	  responseData += chunk;	
	});
	
	res.on('end', function() {
      var jsonObj = JSON.parse(responseData);
			 
      var jobUuidsArr = new Array();
      var endTimeArr = new Array();
      var groupNameArr = new Array();
      var hostNameArr = new Array();
      var jobIdsArr = new Array();
	  var jobNamesArr = new Array();
	  var wallTimeArr = new Array();
	  
	  var startTimeArr = new Array();
	  
	  // Modularize the search refinement. 
	  var searchArg = '';
	  filterJobsProxyData(searchArg, jsonObj, jobUuidsArr, endTimeArr, groupNameArr, hostNameArr, jobIdsArr, jobNamesArr, startTimeArr, wallTimeArr);
      
	  var respArr = [];
      for(var i = 0; i < jobIdsArr.length; i++) {
    	var tooltip = 'Job ID: '+ jobIdsArr[i] + '\nJob Name: ' + jobNamesArr[i] + '\nStart Time: ' + formatTimestamp(startTimeArr[i]) + '\nEnd Time: ' + formatTimestamp(endTimeArr[i]) + '\nGroup Name: ' + groupNameArr[i]+ '\nHost Name: ' + hostNameArr[i] + '\nWall Time: ' + wallTimeArr[i];
        var respObj = {"title" : jobNamesArr[i], 
        			   "isFolder" : true, 
        			   "isLazy" : true, 
        			   "type" : "job", 
        			   "jobid" : jobIdsArr[i],
        			   "tooltip" :  tooltip,
        			   "uuid" : jobUuidsArr[i]};
        respArr.push(respObj);
      }
	  response.send(respArr);
    }); // End of res.on('end') callback.
	
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    var respText =	'[ {"title": "Item 11"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [{"title": "Sub-item 2.1", "children": [	{"title": "Sub-item 2.1.1",	"children": [{"title": "Sub-item 2.1.1.1"},	{"title": "Sub-item 2.1.2.2"}, {"title": "Sub-item 2.1.1.3"}, {"title": "Sub-item 2.1.2.4"}]}, {"title": "Sub-item 2.1.2"},	{"title": "Sub-item 2.1.3"}, {"title": "Sub-item 2.1.4"}]}, {"title": "Sub-item 2.2"}, {"title": "Sub-item 2.3 (lazy)", "isLazy": true }]}, {"title": "Folder 3", "isFolder": true, "key": "folder3", "children": [{"title": "Sub-item 3.1", "children": [{"title": "Sub-item 3.1.1"}, {"title": "Sub-item 3.1.2"}, {"title": "Sub-item 3.1.3"}, {"title": "Sub-item 3.1.4"}]}, {"title": "Sub-item 3.2"}, {"title": "Sub-item 3.3"}, {"title": "Sub-item 3.4"}]}, {"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"}, {"title": "Item 5"}]';										
	respText = '[{"title": "Jobs For eendeve11", "isFolder": true, "isLazy": true, "type" : "job" }]';
	var jsonObj = JSON.parse(respText);
	response.send(jsonObj)
  });

  req.end();
};

/* We want to take a time like this: 
 * 		2014-02-05T17:56:23.000Z
 * and turn it into: 
 * 		2014-02-05 17:56:23
 */
function formatTimestamp(timestamp) {
  timestamp = timestamp.replace('T', ' ');
  timestamp = timestamp.substring(0, timestamp.indexOf('Z')-4);
  return timestamp;
}

function filterJobsProxyData(searchArg, jsonObj, jobUuidsArr, endTimeArr, groupNameArr, hostNameArr, jobIdsArr, jobNamesArr, startTimeArr, wallTimeArr) {
  var colonIndex, searchPrefix, searchTerm;
  
  var searchTerm = '';
  
  var pattern = new RegExp(searchTerm);
	
  for(var key in jsonObj) {
    // The value of jsonObj is an array.
    for(var i = 0; i < jsonObj[key].length; i++) {
      if(searchTerm == '') { 
    	jobUuidsArr.push(jsonObj[key][i]['uuid']);
    	endTimeArr.push(jsonObj[key][i]['endtime']);
    	groupNameArr.push(jsonObj[key][i]['groupname']);
    	hostNameArr.push(jsonObj[key][i]['hostname']);
    	jobIdsArr.push(jsonObj[key][i]['jobid']);
        jobNamesArr.push(jsonObj[key][i]['jobname']);
        startTimeArr.push(jsonObj[key][i]['starttime']);
        wallTimeArr.push(jsonObj[key][i]['walltime']);
        
      }
      else if(searchPrefix == 'id') {
        if(pattern.test(jsonObj[key][i]['jobid'])) {
        	jobUuidsArr.push(jsonObj[key][i]['uuid']);
        	endTimeArr.push(jsonObj[key][i]['endtime']);
        	groupNameArr.push(jsonObj[key][i]['groupname']);
        	hostNameArr.push(jsonObj[key][i]['hostname']);
        	jobIdsArr.push(jsonObj[key][i]['jobid']);
            jobNamesArr.push(jsonObj[key][i]['jobname']);
            startTimeArr.push(jsonObj[key][i]['starttime']);
            wallTimeArr.push(jsonObj[key][i]['walltime']);
        }
      }
      else {
        if(pattern.test(jsonObj[key][i]['jobname'])) {
        	jobUuidsArr.push(jsonObj[key][i]['uuid']);
        	endTimeArr.push(jsonObj[key][i]['endtime']);
        	groupNameArr.push(jsonObj[key][i]['groupname']);
        	hostNameArr.push(jsonObj[key][i]['hostname']);
        	jobIdsArr.push(jsonObj[key][i]['jobid']);
            jobNamesArr.push(jsonObj[key][i]['jobname']);
            startTimeArr.push(jsonObj[key][i]['starttime']);
            wallTimeArr.push(jsonObj[key][i]['walltime']);
        }
      }
    }
  }
}

var jobsinfoHelper = function(request, response) {
  var path = '/jobs/' + request.params.job_id;
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,
			method: 'GET'
		  };
	
	 var responseData = '';

	 
	 var req = http.request(options, function(res) {
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end()
	
};

app.get('/jobsproxy/:username', function(request, response) {
  // jobsproxyHelper is defined in the file proxy/jobs.js.
  jobs.jobsproxyHelper(request, response);
  // We may reference :username with request.params.username.
});

app.get('/apps', function(request, response) {


});


http.createServer(app).listen(8001);
