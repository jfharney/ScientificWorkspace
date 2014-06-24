console.log('Loading groups js');

var express = require('express');
var app = express();
var firewallMode = false;
var http = require('http');
var url = require('url');
var serviceHost = '160.91.210.32';
var servicePort = '8080';

var groupinfoHelper = function(request, response) {
	
  console.log('Inside groupinfoHelper in proxy/groups.js...');
  
  var path = '/sws/groups?uid='+request.params.uid;
  console.log('In groupinfoHelper, the value of request.params.uid is ' + request.params.uid);
	
  // Query for all groups with the specified user number ('uid').
  var options = {
	host: serviceHost,
	port: servicePort,
	path: path,
	method: 'GET'
  };
  
  var args = url.parse(request.url, true).query;
  searchArg = args['search'];
  var responseData = '';
	
  var req = http.request(options, function(res) {
    res.on('data', function (chunk) {
      responseData += chunk;	
    });
    res.on('end', function() {
      try {
	    var jsonObj = JSON.parse(responseData);
	    var filteredGroupsObj = {'groups' : []};
	    
		// Modularize the search refinement.
	    if(searchArg != undefined && searchArg != '') {
		  filterGroupsProxyData(searchArg, jsonObj, filteredGroupsObj);
	      response.send(filteredGroupsObj);
	    }
	    else
          response.send(jsonObj);
      } 
      catch (e) {
        var emptyReturnObj = { groups : [] };		
        response.send(emptyReturnObj);
      }
	});
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
	 
  req.end();
};

module.exports.groupinfoHelper = groupinfoHelper;

function filterGroupsProxyData(searchArg, jsonObj, filteredGroupsObj) {
  if(searchArg == '') {
	filteredGroupsObj = jsonObj;
	return;
  }
  
  var pattern = new RegExp(searchArg);
  
  for(var i in jsonObj['groups'])
	if(pattern.test(jsonObj['groups'][i]['gname'])) {
	  filteredGroupsObj['groups'].push(jsonObj['groups'][i]);
    }c
  return;
}

/* This function is called in frontend.js to GET requests of the form: 
 * 		http://localhost:1337/groups/:gid
 * Its purpose is to retrieve the constituents of a group when the group's 
 * Dynatree node is activated. 
 */
var groupsHelper = function(request, response) {

  var path = '/sws/users?gid=' + request.params.gid;

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
		  
    res.on('end', function() {
      //console.log("End of users per group call...");
      //console.log(responseData);
      var jsonObj = {};
      jsonObj.members = JSON.parse(responseData);
      var uidArr = new Array();
      var unameArr = new Array();

      /* Get all the users associated with this group. */
      for(var key in jsonObj) {
        for(var i = 0; i < jsonObj[key].length; i++) {
          var uid = jsonObj[key][i]['uid'];
          var uname = jsonObj[key][i]['uname'];
          uidArr.push(uid);
          unameArr.push(uname);
        }
      }
      var respArr = [];
      for(var i = 0; i < uidArr.length; i++) {
        var respObj = {"title" : uidArr[i], "id" : uidArr[i] , 'username' : unameArr[i]};
        respArr.push(respObj);
      }

      response.send(respArr);
    });
		  
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
	var respText = '[{"title": "Jobs For eeendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
    response.send(respText);
  });
	
  req.end();

};


module.exports.groupsHelper = groupsHelper;