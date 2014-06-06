console.log('Loading groups js');

var express = require('express');
var app = express();

var firewallMode = false;
var http = require('http');
var url = require('url');
var servicePort = 8080;

var groupinfoHelper = function(request, response) {
  
  var path = '/groups?uid='+request.params.uid;
	
  // Query for all groups with the specified user number ('uid').
  var options = {
	host: 'localhost',
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
	if(pattern.test(jsonObj['groups'][i]['groupname'])) {
	  filteredGroupsObj['groups'].push(jsonObj['groups'][i]);
    }
  return;
}

var groupsHelper = function(request, response) {


	
	//make a call to http://localhost:8080/groups/<gid>
	var path = '/groups/'+request.params.gid;
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';
	
	 
	 var req = http.request(options, function(res) {
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  
			  var jsonObj = JSON.parse(responseData);
		      //response.send(jsonObj);
			 
			  var uidArr = new Array();
			  
			  var uidNameArr = new Array();
			  
			  //get all the users associated with this group
			  for(var key in jsonObj) {
				  for(var i=0;i<jsonObj[key].length;i++) {
					  var uid = jsonObj[key][i]['uid'];
					  var uidName = jsonObj[key][i]['username'];
					  uidArr.push(uid);
					  uidNameArr.push(uidName);
				  }
			  }
			  
			  
			  var respArr = [];
			  for(var i=0;i<uidArr.length;i++) {
				  var respObj = {"title" : uidArr[i], "id" : uidArr[i] , 'username' : uidNameArr[i]};
				  respArr.push(respObj);
			  }
			  
			  
				response.send(respArr);
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
		  var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
			//respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
			respText = '[{"title": "Jobs For eeendeve", "isFolder": true, "isLazy": true	, "type" : "jobs" } ]';
									
			response.send(respText);

		  
	 });
	
	

	 req.end();
	

};


module.exports.groupsHelper = groupsHelper;




