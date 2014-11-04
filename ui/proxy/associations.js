console.log('Loading associations js');

var express = require('express');
var app = express();
var http = require('http');

var associationsproxyHelper = function(request, response) {
	
  var request_obj = request['query'];
  var obj_uuid = request_obj['tagged_item'];
  var obj_type = request_obj['tagged_type'];
	var tag_uuid = request_obj['tag_uuid'];
	
	var associations_api_responseData = '';
	
	//console.log('tagged_item: ' + obj_uuid);
	//console.log('tagged_type: ' + obj_type)
	
	var associations_api_path = '/associations?' + 'edge=' + tag_uuid + '&node=' + obj_uuid + '&type=' + obj_type;
	//console.log('issuing query to -> ' + associations_api_path);
		
	var associations_api_options = {
		host: 'localhost',
		port: servicePort,
		path: associations_api_path,
		method: 'PUT'
	};
	
	
	var associations_api_req = http.request(associations_api_options, function(associations_api_res) {
		  associations_api_res.on('data', function (chunk) {
			  //console.log('\n\nchunk: ' + chunk);
			  associations_api_responseData += chunk;	
		  });
		  
		  associations_api_res.on('end',function() {
			  
			  console.log('end associations');
			  response.send('success');
		  });
		  
		  
	}).on('error', function(e) {
			 
		  console.log("Got error: " + e.message);
		  response.send("Error");
		  //return "Error";
	});

	  
	associations_api_req.end();
	
	
}

module.exports.associationsproxyHelper = associationsproxyHelper;




