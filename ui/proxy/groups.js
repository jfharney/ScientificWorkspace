console.log('Loading groups js');

var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var proxy = require('./proxyConfig.js');
var data = require('../data/firewall_sources.js');

var groupinfoHelper = function(request, response) {
	
  var path = '/sws/groups?uid='+request.params.uid;
  
  // Query for all groups with the specified user number ('uid').
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
    res.on('data', function (chunk) {
      responseData += chunk;	
    });
    res.on('end', function() {
    	try {
		    //var jsonObj = JSON.parse(responseData);
	
    		console.log('groups.js responseData: ' + responseData);
		    var groupObjsArr = [];
			groupObjsArr = JSON.parse(responseData);

			//console.log('length: ' + groupObjsArr.length);
			
			var respArr = [];
			for(var i = 0; i < groupObjsArr.length; i++) {
				
			  for(var key in groupObjsArr[i])
				console.log(key + ': ' + groupObjsArr[i][key]);

				var tooltip = 'Group ID: '+ groupObjsArr[i]['gid'] + 
	              			  '\nGroup Name: ' + groupObjsArr[i]['gname'];
				
			    var child = {};
			    child['title'] = groupObjsArr[i]['gname'];
			    child['nid'] = groupObjsArr[i]['nid'];
			    child['isFolder'] = true;
			    child['type'] = 1;
			    child['isLazy'] = true;
				child['tooltip'] = tooltip;
			    child['id'] = groupObjsArr[i]['gid'];
			     
			    respArr.push(child);
			      
			}
			
			
		    //var filteredGroupsObj = {'groups' : []};
		    var filteredGroupsObj = {};
		    
			// Modularize the search refinement.
		    /*
		    if(searchArg != undefined && searchArg != '') {
			  filterGroupsProxyData(searchArg, jsonObj, filteredGroupsObj);
		    }
		    else {
		      console.log('Jobs jsonObj: ' + jsobObj);
	          response.send(jsonObj);
		    }
		    */
		    
			response.send(respArr);
	      
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



var groupinfoHelperFirewall = function(request, response) {

	var groupObjsArr = data.groupinfoObjsArr;
	
	var respArr = [];
    
	for(var i = 0; i < groupObjsArr.length; i++) {
	  var respObj = {};
	  
	  respObj['title'] = groupObjsArr[i]['gname'];
	  respObj['isFolder'] = true;
	  respObj['type'] = 2;
	  respObj['gid'] = groupObjsArr[i]['gid'];
	  respObj['tooltip'] = 'This is a tooltip.';
	  respObj['nid'] = groupObjsArr[i]['nid'];
	  
	  
	  respArr.push(respObj);
	}
	
	response.send(respArr);
	
};


module.exports.groupinfoHelperFirewall = groupinfoHelperFirewall;





/* This function is called in frontend.js to GET requests of the form: 
 * 		http://localhost:1337/groups/:gid
 * Its purpose is to retrieve the constituents of a group when the group's 
 * Dynatree node is activated. 
 */
var groupsHelper = function(request, response) {

  var path = '/sws/users?gid=' + request.params.gid;

  //console.log('group path --> ' + path);
  
  var options = {
    host: proxy.serviceHost,
    port: proxy.servicePort,
    path: path,
    method: 'GET'
  };
	
  var responseData = '';
	 
  var req = http.request(options, function(res) {
    res.on('data', function (chunk) {
      responseData += chunk;	
    });
		  
    res.on('end', function() {
      var jsonObj = {};
      jsonObj.members = JSON.parse(responseData);
      var uidArr = new Array();
      var unameArr = new Array();

      //console.log('users: ' + responseData);
      
      /* Get all the users associated with this group. */
      for(var key in jsonObj) {
        for(var i = 0; i < jsonObj[key].length; i++) {
          var uid = jsonObj[key][i]['uid'];
          var uname = jsonObj[key][i]['uname'];
          uidArr.push(uid);
          unameArr.push(uname);
        }
      }
      
      var groupmemberObjsArr = [];
	  groupmemberObjsArr = JSON.parse(responseData);

	  var respArr = [];
		for(var i = 0; i < groupmemberObjsArr.length; i++) {
			
			// fill in the tooltip
			/*var tooltip = 'Job ID: '+ jobJidArr[i] + 
            '\nJob Name: ' + jobNameArr[i] + 
            '\nStart Time: ' + formatTimestamp(jobStartArr[i]) + 
            '\nEnd Time: ' + formatTimestamp(jobStopArr[i]) + 
            '\nHost Name: ' + jobHostArr[i] + 
            '\nWall Time: ' + jobWallArr[i];*/
			
		    var child = {};
		    child['title'] = groupmemberObjsArr[i]['uname'];
		    child['isFolder'] = false;
		    child['type'] = 0;
		    child['isLazy'] = false;
			child['tooltip'] = 'tooltip';
		    child['id'] = groupmemberObjsArr[i]['uid'];
		     
		    respArr.push(child);
		      
		}
		
      

      response.send(respArr);
    });
		  
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
	var respText = '[{"title": "Jobs For eeendeve", "isFolder": true, "isLazy": true, "type" : "jobs" }]';
    response.send(respText);
  });
	
  req.end();

};


module.exports.groupsHelper = groupsHelper;



var groupsHelperFirewall = function(request, response) {
	
	var path = '/sws/users?gid=' + request.params.gid;

	console.log('group path --> ' + path);
	  
	var options = {
	    host: proxy.serviceHost,
	    port: proxy.servicePort,
	    path: path,
	    method: 'GET'
	};
		
	var responseData = '';
	 
	var req = http.request(options, function(res) {
	    res.on('data', function (chunk) {
	      responseData += chunk;	
	    });
			  
	    res.on('end', function() {
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
	
	      //console.log('respArr[0]: ' + respArr[0]);
	      response.send(respArr);
	   });
		  
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
	  var respText = '[{"title": "Jobs For eeendeve", "isFolder": true, "isLazy": true, "type" : "jobs" }]';
      response.send(respText);
  });
	
  req.end();
	
	
	
};

module.exports.groupsHelperFirewall = groupsHelperFirewall;


function filterGroupsProxyData(searchArg, jsonObj, filteredGroupsObj) {
  if(searchArg == '') {
	filteredGroupsObj = jsonObj;
	return;
  }
  
  var pattern = new RegExp(searchArg);
  
  for(var i in jsonObj['groups'])
	if(pattern.test(jsonObj['groups'][i]['gname'])) {
	  filteredGroupsObj['groups'].push(jsonObj['groups'][i]);
    }
  return;
}

