console.log('Loading files js');


var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var proxy = require('./proxyConfig.js');

var data = require('../data/firewall_sources.js');


var filesproxyHelper = function(request, response) {

	console.log('usernum: ' + request.params.userNum);
	  var usernum = request.params.userNum;
	  var queriedPath =	request.query.path;
		
	  //console.log('in get files for queriedPath ... ' + queriedPath);
	  var args = url.parse(request.url, true).query;
	  //var path = "/sws/files?uid=5112&path=|"; 			// + args['path'];
		
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

	  //console.log('path->' + path);
	

	var req = http.request(options, function(resp) {
			//console.log('Got response status code ' + resp.statusCode);
			
		  var responseData = '';
		  resp.on('data', function(chunk) {
			  responseData += chunk;
		  });
		
		  resp.on('end', function() {
			  //console.log('in resp end for files... ' + responseData);
			  var jsonObj = JSON.parse(responseData);
				
			  var files = jsonObj['files'];
				
				var dynatreeJSONArr = [];
				
				if(files != undefined) {
					for(var i=0;i<files.length;i++) {
						
						var dynatreeJSONObj = {};
						
						//console.log('i: ' + i + ' ' + files[i]);
						var file = files[i];
						
						for(var key in file) {
							//console.log('key: ' + key + ' value: ' + file[key]);
						}
						
						if(queriedPath == '|') {
							dynatreeJSONObj['title'] = '|' + file['name'];
							
							//directory if type is 5 otherwise it is a file
							if(file['type'] == 5) {
								dynatreeJSONObj['isFolder'] = true;
								dynatreeJSONObj['isLazy'] = true;
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
					
				} else {
					
				}
				
				
				//response.send(jsonObj);
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


	  console.log('usernum: ' + request.params.userNum);
	  var usernum = request.params.userNum;
	  var queriedPath =	request.query.path;
	
	  //the source
	  var files = data.jsonFileResponse['files'];
  
	  var dynatreeJSONArr = [];
  
	  for(var i=0;i<files.length;i++) {
		
		var dynatreeJSONObj = {};
		
		
		//console.log('i: ' + i + ' ' + files[i]);
		var file = files[i];
		
		for(var key in file) {
			console.log('key: ' + key + ' value: ' + file[key]);
		}
		
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
		
		//console.log('dynatreeJSONObj: ' + dynatreeJSONObj);
		
		dynatreeJSONArr.push(dynatreeJSONObj);
		
		
	  }
  

	  response.send(dynatreeJSONArr);

}

module.exports.filesproxyHelperFirewall = filesproxyHelperFirewall;

/*
exports.doQueryFiles = function(responseData, filePath) {
	
	//translate Name : '<name>' -> title : '<name>' 
	  // if isfile is false then isLazy is false and isfolder is false ... else isLazy is true and isFolder is true
	  var fileResponseJSONStr = '{ ' + 
	  							'"name" : "lgt006" , ' +
	  							'"uid" : 0 , ' + 
	  							'"gid" : 16854 , ' +
	  							'"filecount" : 203350 , ' +
	  							'"isFile" : false , ' + 
	  							'"files" : [ ' +
	  							'  {' + 
	  							'    "name" : "ChromaBuilds1",' +
	  							'    "uid" : 63015,' +
	  							'    "gid" : 16854,' +
	  							'    "filecount" : 196168,' +
	  							'    "isfile" : false' +
	  							'  },' +
	  							'  {' + 
	  							'    "name" : "ChromaBuilds2",' +
	  							'    "uid" : 63015,' +
	  							'    "gid" : 16854,' +
	  							'    "filecount" : 196168,' +
	  							'    "isfile" : false' +
	  							'  }' +
	  							//'  {' + 
	  							//'  }' +
	  							']' +
	  							'}';
		
	  
	  var fileResponseJSONObj = JSON.parse(responseData);////JSON.parse(fileResponseJSONStr);//
	  
	  //for(var key in fileResponseJSONObj) {
	  //	  console.log('fjson key: ' + key);
	  //}
	  
	  if(fileResponseJSONObj['files'] == undefined) {
		  return '[]';
	  } else {
		  var fileObjArr = fileResponseJSONObj['files'];
		  
		  console.log(fileObjArr.length);
		  
		  var fileNameArr = new Array();
		  var isFileArr = new Array();
		  
		  var jsonStr = '[';
		  
		  
		  for(var i=0;i<fileObjArr.length;i++) {
			  jsonStr += '{';
			  
			  var fileObj = fileObjArr[i];

			  var fileName = fileObj['name'];
			  //fileNameArr.push(isFileArr);
			  
			  var isFile = fileObj['isfile'];
			  //isFileArr.push(isFile);
			  
			  //{"title": "SubItem 1", "isLazy": true }
			  jsonStr += ' "title" : "' + fileName + '", ';
			  if(isFile == true) {
				  jsonStr += ' "isLazy" : ' + 'false , ';
				  jsonStr += ' "isFolder" : ' + 'false, ';
			  } else {
				  jsonStr += ' "isLazy" : ' + 'true , ';
				  jsonStr += ' "isFolder" : ' + 'true, ';
			  }

			  
			  jsonStr += ' "path" : ' + '"' + filePath + '|' +fileName+'"';

			  
			  jsonStr += '}';

			  if(i < fileObjArr.length-1) {
				  jsonStr += ' , '
			  }
			  
		  }
		  
		  jsonStr += ']';
		
		  return jsonStr;
	  }
	  
}
*/



