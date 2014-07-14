console.log('Loading jobs js');

var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var proxy = require('./proxyConfig.js');
var data = require('../data/firewall_sources.js');

// This function works with a URL containing or lacking a search parameter named "search". 
var jobsproxyHelper = function(request, response) {
  var path = '/sws/jobs?uid=' + request.params.userNum;

  var options = {
    host: proxy.serviceHost,
	port: proxy.servicePort,
	path: path,
	method: 'GET'
  };
  
  var args = url.parse(request.url, true).query;
  searchArg = args['search'];

  var responseData = '';
  var req = http.request(options, function(res) {

	res.on('data', function(chunk) {
	  responseData += chunk;	
	});
	
	res.on('end', function() {
	  var jobObjsArr = [];
	  jobObjsArr = JSON.parse(responseData);

      var jobNidArr = new Array();
      var jobJidArr = new Array();
      var jobStopArr = new Array();
      var jobHostArr = new Array();
      var jobStartArr = new Array();
	  var jobNameArr = new Array();
	  var jobWallArr = new Array();
	  
	  filterJobsProxyData(searchArg, jobObjsArr, jobNidArr, jobJidArr, jobStopArr, jobHostArr, jobStartArr, jobNameArr, jobWallArr);
      
	  var respArr = [];
      for(var i = 0; i < jobJidArr.length; i++) {
    	var tooltip = 'Job ID: '+ jobJidArr[i] + 
    	              '\nJob Name: ' + jobNameArr[i] + 
    	              '\nStart Time: ' + formatTimestamp(jobStartArr[i]) + 
    	              '\nEnd Time: ' + formatTimestamp(jobStopArr[i]) + 
    	              '\nHost Name: ' + jobHostArr[i] + 
    	              '\nWall Time: ' + jobWallArr[i];
        var respObj = {"title" : jobNameArr[i], 
        			   "isFolder" : true, 
        			   "isLazy" : true, 
        			   "type" : 2, 
        			   "jobid" : jobJidArr[i],
        			   "tooltip" : tooltip,
        			   "nid" : jobNidArr[i]};
        respArr.push(respObj);
      }
	  response.send(respArr);
    }); // End of res.on('end') callback.
	
  }).on('error', function(e) {
    console.log("jobs.js: Got error: " + e.message);
    var respText =	'[ {"title": "Item 11"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [{"title": "Sub-item 2.1", "children": [	{"title": "Sub-item 2.1.1",	"children": [{"title": "Sub-item 2.1.1.1"},	{"title": "Sub-item 2.1.2.2"}, {"title": "Sub-item 2.1.1.3"}, {"title": "Sub-item 2.1.2.4"}]}, {"title": "Sub-item 2.1.2"},	{"title": "Sub-item 2.1.3"}, {"title": "Sub-item 2.1.4"}]}, {"title": "Sub-item 2.2"}, {"title": "Sub-item 2.3 (lazy)", "isLazy": true }]}, {"title": "Folder 3", "isFolder": true, "key": "folder3", "children": [{"title": "Sub-item 3.1", "children": [{"title": "Sub-item 3.1.1"}, {"title": "Sub-item 3.1.2"}, {"title": "Sub-item 3.1.3"}, {"title": "Sub-item 3.1.4"}]}, {"title": "Sub-item 3.2"}, {"title": "Sub-item 3.3"}, {"title": "Sub-item 3.4"}]}, {"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"}, {"title": "Item 5"}]';										
	respText = '[{"title": "Jobs For eendeve11", "isFolder": true, "isLazy": true, "type" : "job" }]';
	var jsonObj = JSON.parse(respText);
	response.send(jsonObj)
  });

  req.end();
};

module.exports.jobsproxyHelper = jobsproxyHelper;



//This function works with a URL containing or lacking a search parameter named "search". 
var jobsproxyHelperFirewall = function(request, response) {

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
	
};

module.exports.jobsproxyHelperFirewall = jobsproxyHelperFirewall;



/* Taken from http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript */
function formatTimestamp(UNIX_timestamp) {
   var a = new Date(UNIX_timestamp * 1000);
   var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
   var year = a.getFullYear();
   var month = months[a.getMonth()];
   var date = a.getDate();
   var hour = a.getHours();
   var min = a.getMinutes();
   var sec = a.getSeconds();
   var time = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min + ':' + sec ;
   
   return time;
}

function filterJobsProxyData(searchArg, jobObjsArr, jobNidArr, jobJidArr, jobStopArr, jobHostArr, jobStartArr, jobNameArr, jobWallArr) {
  var colonIndex, searchPrefix, searchTerm;
  
  // If a search prefix is provided, like jobid:12345, then search over job IDs. 
  // If no search prefix is provided, search over job names by default. 
  
  // Remember that first char in JavaScript string has index 0.
  // Separate the user input into prefix and search term.
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

  for(var i = 0; i < jobObjsArr.length; i++) {
    if(searchTerm == '') { 
      jobNidArr.push(jobObjsArr[i]['nid']);
      jobJidArr.push(jobObjsArr[i]['jid']);
      jobStopArr.push(jobObjsArr[i]['stop']);
      jobHostArr.push(jobObjsArr[i]['host']);
      jobStartArr.push(jobObjsArr[i]['start']);
      jobNameArr.push(jobObjsArr[i]['name']);
      jobWallArr.push(jobObjsArr[i]['wall']);
    }
    else if(searchPrefix == 'id') {
      if(pattern.test(jobObjsArr[i]['jid'])) {
       	jobNidArr.push(jobObjsArr[i]['nid']);
      	jobJidArr.push(jobObjsArr[i]['jid']);
       	jobStopArr.push(jobObjsArr[i]['stop']);
       	jobHostArr.push(jobObjsArr[i]['host']);
        jobNameArr.push(jobObjsArr[i]['name']);
        jobStartArr.push(jobObjsArr[i]['start']);
        jobWallArr.push(jobObjsArr[i]['wall']);
      }
    }
    else {
      if(pattern.test(jobObjsArr[i]['name'])) {
       	jobNidArr.push(jobObjsArr[i]['nid']);
       	jobJidArr.push(jobObjsArr[i]['jobid']);
       	jobStopArr.push(jobObjsArr[i]['stop']);
       	jobHostArr.push(jobObjsArr[i]['host']);
        jobNameArr.push(jobObjsArr[i]['name']);
        jobStartArr.push(jobObjsArr[i]['start']);
        jobWallArr.push(jobObjsArr[i]['wall']);
      }
    }
  }
}

var jobsinfoHelper = function(request, response) 
{
	var path = '/sws/job?jid=' + request.params.job_id;
	
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
			  
			  console.log(responseData);
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("jobs.js -> jobsinfoHelper: Got error: " + e.message);
	 
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
	
	
	var fileResponseJSONObj = JSON.parse(responseData);
	  
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