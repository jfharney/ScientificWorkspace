var express = require('express');
var app = express();
var firewallMode = false;
var http = require('http');
var url = require('url');
var servicePort = 8080;

// This function works with a URL containing or lacking a search parameter named "search". 
var jobsproxyHelper = function(request, response) {
  var path = '/jobs?username=' + request.params.username;

  var options = {
    host: 'localhost',
	port: servicePort,
	path: path,
	method: 'GET'
  };
  
  var args = url.parse(request.url, true).query;
  console.log('searchArg is ' + args['search']);
  searchArg = args['search'];

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
	  filterJobsProxyData(searchArg, jsonObj, jobUuidsArr, endTimeArr, groupNameArr, hostNameArr, jobIdsArr, jobNamesArr, startTimeArr, wallTimeArr);
      
	  var respArr = [];
      for(var i = 0; i < jobIdsArr.length; i++) {
    	var tooltip = 'Job ID: '+ jobIdsArr[i] + '\nJob Name: ' + jobNamesArr[i] + '\nStart Time: ' + formatTimestamp(startTimeArr[i]) + '\nEnd Time: ' + formatTimestamp(endTimeArr[i]) + '\nGroup Name: ' + groupNameArr[i]+ '\nHost Name: ' + hostNameArr[i] + '\nWall Time: ' + wallTimeArr[i];
        var respObj = {"title" : jobNamesArr[i], 
        			   "isFolder" : true, 
        			   "isLazy" : true, 
        			   "type" : "job", 
        			   "jobid" : jobIdsArr[i],
        			   //"tooltip" :  tooltip,
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
  
  // If a search prefix is provided, like jobid:12345, then search over job IDs. 
  // If no search prefix is provided, search over job names by default. 
  
  // Remember that first char in JavaScript string has index 0.
  // Separate the user input into prefix and search term.
  console.log('searchArg: ' + searchArg);
  colonIndex = searchArg.indexOf(':');		// indexOf returns -1 when not found.
  if(colonIndex == -1) {
	searchPrefix = null;
    searchTerm = searchArg;
  }
  else {
	searchPrefix = searchArg.substring(0, colonIndex);
	searchTerm = searchArg.substring(colonIndex+1);
  }
  
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

var jobsinfoHelper = function(request, response) 
{
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

module.exports.jobsinfoHelper = jobsinfoHelper;


var jobsUuidHelper = function(request, response) {

  var path = '/jobs?uuid='+request.params.job_uuid;
  var options = {
	host: 'localhost',
	port: servicePort,
	path: path,
	method: 'GET'
  };
	
	var responseData = '';

	 
	var req = http.request(options, function(res) 
	{
		 res.on('data', function (chunk) 
		 {
			 responseData += chunk;	
		 });
		 res.on('end',function() 
		 { 
			  
			 var jsonObj = JSON.parse(responseData);
		     response.send(jsonObj); 
		 });
	}).on('error', function(e) 
	{	 
		console.log("Got error: " + e.message);
	});
	 
	req.end()
	
};

module.exports.jobsUuidHelper = jobsUuidHelper;


exports.doQueryJobs = function(responseData) {
	
	
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
	
	fileResponseJSONStr = jsonStr;
	
	
	return fileResponseJSONStr;
	
}


module.exports.jobsproxyHelper = jobsproxyHelper;