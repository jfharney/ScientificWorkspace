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
  if (searchArg == undefined) searchArg = '';
  var responseData = '';
	
  var req = http.request(options, function(res) {
    res.on('data', function (chunk) {
      responseData += chunk;	
    });
    res.on('end', function() {
      try {
		var groupObjArr = JSON.parse(responseData);
		
		//if(searchArg != '')
		  //filterGroupsData(groupObjArr, searchArg);

        var respArr = [];
        for(var i = 0; i < groupObjArr.length; i++) {
          for(var key in groupObjArr[i])
            var tooltip = 'Group ID: '+ groupObjArr[i]['gid'] + '\nGroup Name: ' + groupObjArr[i]['gname'];
				
          var child = {};
          child['title'] = groupObjArr[i]['gname'];
          child['name'] = groupObjArr[i]['gname'];
		  child['isFolder'] = true;
		  child['type'] = 1;
		  child['isLazy'] = true;
		  child['tooltip'] = tooltip;
		  child['gid'] = groupObjArr[i]['gid'];
		  child['nid'] = groupObjArr[i]['nid'];
			     
		  respArr.push(child);
			      
		}

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

/* We decided on 11-04-14 that tree refinement would not be implemented before the SC demo. 
function filterGroupsData(groupObjArr, searchArg) {

  filteredGroupObjArr = [];
  
  var pattern = new RegExp(searchArg);
  
  for(var i in groupObjArr['groups'])
	if(pattern.test(groupObjArr['groups'][i]['gname'])) {
	  filteredGroupObjArr['groups'].push(groupObjArr['groups'][i]);
    }

  groupObjArr = filteredGroupObjArr;
  return;
}*/


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
      
      var groupMemberObjsArr = [];
	  groupMemberObjsArr = JSON.parse(responseData);

	  var respArr = [];
		for(var i = 0; i < groupMemberObjsArr.length; i++) {
		  var child = {};
		  child['title'] = groupMemberObjsArr[i]['uname'];
		  child['isFolder'] = false;
		  child['type'] = 0;
		  child['isLazy'] = false;
	      child['tooltip'] = 'tooltip';
		  child['uid'] = groupMemberObjsArr[i]['uid'];
		  child['nid'] = groupMemberObjsArr[i]['nid'];
		     
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


