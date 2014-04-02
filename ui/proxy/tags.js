console.log('Loading tags js');

var express = require('express');
var app = express();

var firewallMode = false;

var http = require('http');

var servicePort = 8080;


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
	
	//console.log('tag_name: ' + tag_name + ' tag_descrition: ' + tag_description + ' tagged_items: ' + tagged_items);
	
	
	//reassemble the url and query string given the query parameters
	
	

	//forward the request to backend services
	//console.log('add tag ' + tag_name + ' to the data store');
	
	
	//console.log('connect tag ' + tag_name + ' to object(s): ' + tagged_items);
	
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
		  console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  //console.log('on end response data...' + responseData + ' length: ' + responseData.length);
			  //response.send(responseData);

			  if(responseData == '' || responseData == ' ' || responseData == '\n') {
				  console.log('Response Data is empty');
				  
				  console.log('end tag proxy');
				  response.send('empty');
				  
			  } else {
				  console.log('Response Data is not empty...continue to parse JSON');
				  
				  var jsonObj = JSON.parse(responseData);
				  

				  console.log('end tag proxy');
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



/*
app.post('/tagproxy',function(request,response) {
	
	console.log('\n\n---------in tag proxy----------');
	
	var request_obj = request['query'];
	
	//console.log('request_obj: ' + request_obj);

	//grab the tag parameters from the query parameter list
	var tag_name = '';
	var tag_description = '';
	
	tag_name = request_obj['tag_name'];
	tag_description = request_obj['tag_description'];
	
	
	//console.log('tag_name: ' + tag_name + ' tag_descrition: ' + tag_description + ' tagged_items: ' + tagged_items);
	
	
	//reassemble the url and query string given the query parameters
	
	

	//forward the request to backend services
	//console.log('add tag ' + tag_name + ' to the data store');
	
	
	//console.log('connect tag ' + tag_name + ' to object(s): ' + tagged_items);
	
	//get response from backend services
	
	

	 //curl -X POST 'http://localhost:8080/tags/tag100?uid=5112&desc=A_new_tag
	var path = '/tags/' + tag_name + '?'+'uid=5112&desc=' + tag_description;
	
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
		  console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  //console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
				
		  });
		  res.on('end',function() {
			  
			  //console.log('on end response data...' + responseData + ' length: ' + responseData.length);
			  //response.send(responseData);

			  if(responseData == '' || responseData == ' ' || responseData == '\n') {
				  console.log('Response Data is empty');
				  
				  console.log('end tag proxy');
				  response.send('empty');
				  
			  } else {
				  console.log('Response Data is not empty...continue to parse JSON');
				  
				  var jsonObj = JSON.parse(responseData);
				  

				  console.log('end tag proxy');
				  response.send(jsonObj);
				  
				  
			  }
			  
			
		      
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
		  response.send("Error");
	 });
	
	
	//return "success" or "failure"

	 req.end();
	 
	
	 //response.send('success$');
});
*/

