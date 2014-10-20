console.log('Loading DOIs js');

var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var proxy = require('./proxyConfig.js');
var data = require('../data/firewall_sources.js');

var doisProxyHelper = function(request, response) {
  var usernum = request.params.userNum;
  var path = '/sws/dois?uid=' + usernum;
	  
  // Query above is an object containing all the 
  // arguments in the URL as key-value pairs. 
  var options = {
    host: proxy.serviceHost,
	port: proxy.servicePort,
	path: path,
	method: 'GET'
  };
	
  var req = http.request(options, function(resp) {
			
    var responseData = '';
    resp.on('data', function(chunk) {
      responseData += chunk;
    });
		
    resp.on('end', function() {
      var jsonObjArr = JSON.parse(responseData);
      var dynatreeJsonArr = [];
      
      // Loop through the response array and map the data to the required Dynatree fields. 
      for(var i = 0; i < jsonObjArr.length; i++) {
    	var respObj = {
          'title' : jsonObjArr[i]['title'],		// Just a coincidence that these two fields have the same name.
          'name': jsonObjArr[i]['name'],
          'isFolder': true,
          'children': [
                        {
                          title: 'Metadata', 
                          doiName: jsonObjArr[i]['name'],
                          isFolder: true,
                          isLazy: true,
                        }, 
                        {
                          title: 'Linked Objects',
                          doiName: jsonObjArr[i]['name'], 
                          isFolder: true
                        }
                      ]
    	};
    	  
    	dynatreeJsonArr.push(respObj);
      }
      
      response.send(dynatreeJsonArr);
    });
			
    resp.on('error', function(e) {
      response.send('error: ' + e);
    });
  });
		
  req.end();
}

module.exports.doisProxyHelper = doisProxyHelper;


var doisProxyHelperFirewall = function(request, response) {

	  var usernum = request.params.userNum;
	  var queriedPath =	request.query.path;
	
	  //the source
	  var files = data.jsonFileResponse['files'];
  
	  var dynatreeJSONArr = [];
  
	  for(var i=0;i<files.length;i++) {
		
		var dynatreeJSONObj = {};
		var file = files[i];
				
		if(queriedPath == '|') {
			dynatreeJSONObj['title'] = '|'+file['name'];
			
			//directory if type is 5 otherwise it is a file
			if(file['type'] == 5) {
				dynatreeJSONObj['isFolder'] = false;
				dynatreeJSONObj['isLazy'] = false;
			} else { 
				dynatreeJSONObj['isFolder'] = false;
				dynatreeJSONObj['isLazy'] = false;
			}
			
			dynatreeJSONObj['path'] = '|' + file['name'];
			dynatreeJSONObj['nid'] = file['nid'];
		} else {
			dynatreeJSONObj['title'] = queriedPath + '|' + file['name'];
			if(file['type'] == 5) {
				dynatreeJSONObj['isFolder'] = true;
				dynatreeJSONObj['isLazy'] = true;
			} else { 
				dynatreeJSONObj['isFolder'] = false;
				dynatreeJSONObj['isLazy'] = false;
			}
			dynatreeJSONObj['path'] = queriedPath + '|' + file['name'];
			dynatreeJSONObj['nid'] = file['nid'];
		}
		
		dynatreeJSONArr.push(dynatreeJSONObj);
		
	  }

	  response.send(dynatreeJSONArr);

}

module.exports.doisProxyHelperFirewall = doisProxyHelperFirewall;

