console.log('Loading files js');

var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var proxy = require('./proxyConfig.js');
var data = require('../data/firewall_sources.js');

var filesproxyHelper = function(request, response) {
	var usernum = request.params.userNum;
	var queriedPath =	request.query.path;
	var args = url.parse(request.url, true).query;
	var path = '/sws/files?uid=' + usernum + '&path=' + queriedPath;
	  
	path = path + '&list=retrieve';
	  
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
			var jsonObj = JSON.parse(responseData);
			var files = jsonObj['files'];
			var dynatreeJSONArr = [];
				
			if(files != undefined) {
				for(var i = 0; i < files.length; i++) {
					var dynatreeJSONObj = {};
					var file = files[i];
					if(queriedPath == '|') {
						dynatreeJSONObj['title'] = '|' + file['name'];
							
						//directory if type is 5 otherwise it is a file
						if(file['type'] == 5) {
							dynatreeJSONObj['isFolder'] = true;
							dynatreeJSONObj['isLazy'] = true;
						} 
						else { 
							dynatreeJSONObj['isFolder'] = false;
							dynatreeJSONObj['isLazy'] = false;
						}
							
						dynatreeJSONObj['path'] = '|' + file['name'];
						dynatreeJSONObj['nid'] = file['nid'];
					} 
					else {
						dynatreeJSONObj['title'] = queriedPath + '|' + file['name'];
						if(file['type'] == 5) {
							dynatreeJSONObj['isFolder'] = true;
							dynatreeJSONObj['isLazy'] = true;
						} 
						else { 
							dynatreeJSONObj['isFolder'] = false;
							dynatreeJSONObj['isLazy'] = false;
						}
						dynatreeJSONObj['path'] = queriedPath + '|' + file['name'];
						dynatreeJSONObj['nid'] = file['nid'];
					}
									
					dynatreeJSONArr.push(dynatreeJSONObj);
				}
			} 
			else {}
			response.send(dynatreeJSONArr);
		});
			
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
		
	req.end();
}

module.exports.filesproxyHelper = filesproxyHelper;


var filesproxyHelperFirewall = function(request, response) {

	  var usernum = request.params.userNum;
	  var queriedPath =	request.query.path;
	
	  //the source
	  var files = data.jsonFileResponse['files'];
  
	  var dynatreeJSONArr = [];
  
	  for(var i=0;i<files.length;i++) {
		
		var dynatreeJSONObj = {};
		var file = files[i];
				
		if(queriedPath == '|') {
			dynatreeJSONObj['title'] = '|' + file['name'];
			
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

module.exports.filesproxyHelperFirewall = filesproxyHelperFirewall;

