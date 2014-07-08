console.log('Loading tags js');

var express = require('express');
var app = express();
var http = require('http');
var proxy = require('./proxyConfig.js');

var tagsproxyHelper = function(request,response) {
	
	var request_obj = request['query'];
	
	//console.log('request_obj: ' + request_obj);

	//grab the tag parameters from the query parameter list
	var tag_name = '';
	var tag_description = '';
	var uid = '';
	
	tag_name = request_obj['tag_name'];
	tag_description = request_obj['tag_description'];
	uid = request_obj['uid'];
	
	//reassemble the url and query string given the query parameters
	
	

	//forward the request to backend services
	
	//get response from backend services
	
	

	 //curl -X POST 'http://localhost:8080/tags/tag100?uid=5112&desc=A_new_tag
	var path = '/tags/' + tag_name + '?'+'uid=' + uid + '&desc=' + tag_description;
	
	//query the userlist service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,
			method: 'POST'
		  };
	
	 console.log('issuing query to -> ' + path);
	 var responseData = '';
	
	 
	 var req = http.request(options, function(res) {
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  //console.log('on end response data...' + responseData + ' length: ' + responseData.length);
			  //response.send(responseData);

			  if(responseData == '' || responseData == ' ' || responseData == '\n') {
				  response.send('empty');
				  
			  } else {
				  var jsonObj = JSON.parse(responseData);
				  
				  response.send(jsonObj);
			  }
			  
			
		      
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
		  response.send("Error");
	 });
	
	
	//return "success" or "failure"

	 req.end();
	
	
}

module.exports.tagsproxyHelper = tagsproxyHelper;

var tagLinksProxHelper = function(request, response) {
  console.log('The value of request.params.tag_nid is ' + request.params.tag_nid);

  var path = '/sws/nodes?tag-nid=' + request.params.tag_nid;
  
  console.log('In tags.js, The value of path is ' + path);
  console.log('proxy.serviceHost is ' + proxy.serviceHost + ', proxy.servicePort is ' + proxy.servicePort);
	
  //query the userlist service here
  var options = {
	host: proxy.servicePort,
	port: proxy.servicePort,
	path: path,
	method: 'GET'
  };
  
  var req = http.request(options, function(resp) {
    var responseData = '';
    resp.on('data', function(chunk) {
      console.log(responseData);
	  responseData += chunk;
    });
		
    resp.on('end', function() {
      console.log(responseData);
      response.send(responseData);
    });
		
    resp.on('error', function(e) {
      response.send('error: ' + e);
    });
  });
	
  req.end();
  
}

module.exports.tagLinksProxHelper = tagLinksProxHelper;