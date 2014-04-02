console.log('Loading associations js');

var express = require('express');
var app = express();

var firewallMode = false;


var http = require('http');



var servicePort = 8080;


//app.post('/associationsproxy',function(request,response) {
var associationsproxyHelper = function(request, response) {
	

	var request_obj = request['query'];
	
	var obj_uuid = request_obj['tagged_item'];
	var obj_type = request_obj['tagged_type'];
	var tag_uuid = request_obj['tag_uuid'];
	
	var associations_api_responseData = '';
	
	//console.log('tagged_item: ' + obj_uuid);
	//console.log('tagged_type: ' + obj_type)
	
	var associations_api_path = '/associations?' + 'edge=' + tag_uuid + '&node=' + obj_uuid + '&type=' + obj_type;
	console.log('issuing query to -> ' + associations_api_path);
		
	var associations_api_options = {
		host: 'localhost',
		port: servicePort,
		path: associations_api_path,
		method: 'PUT'
	};
	
	
	
	
	var associations_api_req = http.request(associations_api_options, function(associations_api_res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  associations_api_res.on('data', function (chunk) {
			  //console.log('\n\nchunk: ' + chunk);
			  associations_api_responseData += chunk;	
		  });
		  
		  associations_api_res.on('end',function() {
			  //console.log('on end...response data\n' + associations_api_responseData);
			  
			  console.log('end associations');
			  response.send('success');
			  //return "success";
		  });
		  
		  
	}).on('error', function(e) {
			 
		  console.log("Got error: " + e.message);
		  response.send("Error");
		  //return "Error";
	});

	//console.log('End associations call');
	  
	associations_api_req.end();
	
	
}

module.exports.associationsproxyHelper = associationsproxyHelper;





/* Global space associations proxy
app.post('/associationsproxy',function(request,response) {
	console.log('In associationsproxy');
	
	var request_obj = request['query'];
	
	var obj_uuid = request_obj['tagged_item'];
	var obj_type = request_obj['tagged_type'];
	var tag_uuid = request_obj['tag_uuid'];
	
	var associations_api_responseData = '';
	
	//console.log('tagged_item: ' + obj_uuid);
	//console.log('tagged_type: ' + obj_type)
	
	var associations_api_path = '/associations?' + 'edge=' + tag_uuid + '&node=' + obj_uuid + '&type=' + obj_type;
	console.log('issuing query to -> ' + associations_api_path);
		
	var associations_api_options = {
		host: 'localhost',
		port: servicePort,
		path: associations_api_path,
		method: 'PUT'
	};
	
	
	var associations_api_req = http.request(associations_api_options, function(associations_api_res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  associations_api_res.on('data', function (chunk) {
			  //console.log('\n\nchunk: ' + chunk);
			  associations_api_responseData += chunk;	
		  });
		  
		  associations_api_res.on('end',function() {
			  //console.log('on end...response data\n' + associations_api_responseData);
			  
			  console.log('end associations');
			  response.send('success');
		  });
		  
		  
	}).on('error', function(e) {
			 
		  console.log("Got error: " + e.message);
		  response.send("Error");
	});

	//console.log('End associations call');
	  
	associations_api_req.end();
	
	
});

*/



