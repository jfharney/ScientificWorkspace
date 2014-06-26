console.log('Loading apps js');

var express = require('express');
var app = express();
var firewallMode = false;
var http = require('http');
var serviceHost = '160.91.210.32';
var servicePort = '8080';
 
/* This function is called when a single job node in the Jobs tree is "activated".
 * It provides an array of apps belonging to a given job, which is the node in this
 * context. 
 */
var appsproxyHelper = function(request, response) {
  // A sample jid value is 1722972. 
  var path = '/sws/apps?jid=' + request.query.jid;
	
  var options = {
    host: serviceHost,
	port: servicePort,
	path: path,
	method: 'GET'
  };

  var responseData = '';
	 
  var req = http.request(options, function(res) {
	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.on('data', function (chunk) {
	  responseData += chunk;	
    });

    res.on('end', function() {
      /* Get an array of app objects. */
  	  var appObjsArr = JSON.parse(responseData);
  			  		  
	  var respArr = [];
	  for(var i = 0; i < appObjsArr.length; i++) {
        var tooltip = 'App ID: ' + appObjsArr[i]['aid'] + 
                      '\nStart Time: ' + formatTimestamp(appObjsArr[i]['start']) + 
                      '\nEnd Time: ' + formatTimestamp(appObjsArr[i]['stop']);
        var respObj = {"title" : appObjsArr[i]['aid'], 
                       "type" : "app", 
		               "appid" : appObjsArr[i]['aid'], 
					   "jobid" : request.query.jobid, 
					   "nid" : appObjsArr[i]['nid'], 
					   "jobid" : appObjsArr[i]['jid'],
	                   "tooltip" : tooltip };
	    respArr.push(respObj);
	  }
			  
	  response.send(respArr);
    });
  }).on('error', function(e) {
    console.log("apps.js: Got error: " + e.message);
	var respText =	'[{"title": "Item 11"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [{"title": "Sub-item 2.1","children": [{"title": "Sub-item 2.1.1","children": [{"title": "Sub-item 2.1.1.1"},{"title": "Sub-item 2.1.2.2"},{"title": "Sub-item 2.1.1.3"},{"title": "Sub-item 2.1.2.4"}]},{"title": "Sub-item 2.1.2"},{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}]},{"title": "Sub-item 2.2"},{"title": "Sub-item 2.3 (lazy)", "isLazy": true }]},{"title": "Folder 3", "isFolder": true, "key": "folder3","children": [{"title": "Sub-item 3.1","children":[{"title": "Sub-item 3.1.1"},{"title": "Sub-item 3.1.2"},{"title":"Sub-item 3.1.3"},{"title": "Sub-item 3.1.4"}]},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},{"title": "Sub-item 3.4"}]},{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';
	var jsonObj = JSON.parse(respText);
	response.send(jsonObj);
  });
	
  req.end();
}

/* We want to take a time like this: 
 * 		2014-02-05T17:56:23.000Z
 * and turn it into: 
 * 		2014-02-05 17:56:23
 */
function formatTimestamp(UNIX_timestamp) {
  /* Taken from http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript */
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

module.exports.appsproxyHelper = appsproxyHelper;

