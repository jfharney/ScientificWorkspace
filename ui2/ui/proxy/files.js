console.log('Loading files js');


var express = require('express');
var app = express();

var firewallMode = true;

var hbs = require('hbs');

var http = require('http');
var url = require('url');


app.use(express.static('public'));

var servicePort = 8080;





//function doQueryFiles(responseData,filePath) {
exports.doQueryFiles = function(responseData,filePath) {
	
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
		
	  //console.log(fileResponseJSONStr);
	  
	  var fileResponseJSONObj = JSON.parse(responseData);////JSON.parse(fileResponseJSONStr);//
	  
	  for(var key in fileResponseJSONObj) {
		  console.log('fjson key: ' + key);
	  }
	  
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





/*
var express = require('express');
var app = express();

var firewallMode = true;

var hbs = require('hbs');

var http = require('http');
var url = require('url');


app.use(express.static('public'));

var servicePort = 8080;


//sample- initial files data proxy service
app.get('/initfilesdata',function(request,response) {

	console.log('init files data');
	
	
	var respText =	'[ {"title": "Item 1"}, {"title": "Folder 2", "isFolder": true, "key": "folder2", "expand": true, "children": [				{"title": "Sub-item 2.1",		"children": [								{"title": "Sub-item 2.1.1",									"children": [												{"title": "Sub-item 2.1.1.1"},												{"title": "Sub-item 2.1.2.2"},												{"title": "Sub-item 2.1.1.3"},						{"title": "Sub-item 2.1.2.4"}											]},								{"title": "Sub-item 2.1.2"},								{"title": "Sub-item 2.1.3"},{"title": "Sub-item 2.1.4"}							]					},				{"title": "Sub-item 2.2"},				{"title": "Sub-item 2.3 (lazy)", "isLazy": true }			]		},		{"title": "Folder 3", "isFolder": true, "key": "folder3",			"children": [				{"title": "Sub-item 3.1",					"children": [								{"title": "Sub-item 3.1.1"},								{"title": "Sub-item 3.1.2"},								{"title": "Sub-item 3.1.3"},								{"title": "Sub-item 3.1.4"}							]					},{"title": "Sub-item 3.2"},{"title": "Sub-item 3.3"},				{"title": "Sub-item 3.4"}			]},		{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true, "key": "folder4"},{"title": "Item 5"}]';										
	respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
								
	response.send(respText);


});





//files proxy service
app.get('/filesproxy',function(request,response) {
	
	console.log ('calling files proxy...');
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	
	var path = '/files?';
	
	var filePath = '';
	
	for(var key in query) {
		//console.log('key: ' + key + ' value: ' + query[key]);
		if(key == 'path') {
			filePath = query[key];
		}
		path += key + '=' + query[key] + '&';
	}
	
	console.log('query: ' + path);
	
	//query the file service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';
	
	 var req = http.request(options, function(res) {
		  //console.log("Got response: " + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			  console.log('\n\n\n\nchunk: ' + chunk);
			  responseData += chunk;	
			  
			  
			  // you can use res.send instead of console.log to output via express
			  
		     
	    	  //construct the respText array
	    	  //var a = '{"title": "SubItem 1", "isLazy": true }';
	    	  
	    	  //jsonStr = '[{ "title" : "ChromaBuilds1",  "isLazy" : true ,  "isFolder" : true} , { "title" : "ChromaBuilds2",  "isLazy" : true ,  "isFolder" : true}]';

	    	
		  });
		  res.on('end',function() {
			  
			  console.log('ending filesproxy...');
			 
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end();
	 
	 
});



function doQueryFiles(responseData,filePath) {
	
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
		
	  //console.log(fileResponseJSONStr);
	  
	  var fileResponseJSONObj = JSON.parse(responseData);//JSON.parse(fileResponseJSONStr);
	  
	  for(var key in fileResponseJSONObj) {
		  //console.log('fjson key: ' + key);
	  }
	  
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




//files proxy service
app.get('/files',function(request,response) {
	
	
	console.log ('calling files...');
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	
	
	
	var path = '/files?';
	
	var filePath = '';
	
	for(var key in query) {
		//console.log('key: ' + key + ' value: ' + query[key]);
		if(key == 'path') {
			filePath = query[key];
		}
		path += key + '=' + query[key] + '&';
	}
	
	console.log('query: ' + path);
	
	//query the file service here
	var options = {
			host: 'localhost',
			port: servicePort,
			path: path,//'/files?path=widow1|proj|lgt006&uid=8038&gid=16854',
			//path: '/apps',
			method: 'GET'
		  };
	
	 var responseData = '';
	
	 if(firewallMode) {
		//use hard coded values
		 
		 console.log('in firewall mode');
		 
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
		 
		 
		 var jsonStr = doQueryFiles(responseData);
    	  
    	  
		 var respText = jsonStr; //'[ {"title": "SubItem 1", "isLazy": true }, 	{"title": "SubFolder 2", "isFolder": true, "isLazy": true } ]';
		 //response.send(respText);
		 response.send('returning message');
		 
		 
	 } 
	 //call the service for the data
	 else {
		 var req = http.request(options, function(res) {
			  //console.log("Got response: " + res.statusCode);
			  //console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.on('data', function (chunk) {
				  console.log('\n\n\n\nchunk: ' + chunk);
				  responseData += chunk;	
				  
				  
				  // you can use res.send instead of console.log to output via express
				  //var jsonObj = JSON.parse(responseData);
			      //response.send(jsonObj);
			     
		    	  //construct the respText array
		    	  //var a = '{"title": "SubItem 1", "isLazy": true }';
		    	  
		    	  //jsonStr = '[{ "title" : "ChromaBuilds1",  "isLazy" : true ,  "isFolder" : true} , { "title" : "ChromaBuilds2",  "isLazy" : true ,  "isFolder" : true}]';

		    	
			  });
			  res.on('end',function() {
				 

				  var jsonStr = doQueryFiles(responseData,filePath);
		    	  
				  console.log('ending...');
		    	  
				 var respText = jsonStr; //'[ {"title": "SubItem 1", "isLazy": true }, 	{"title": "SubFolder 2", "isFolder": true, "isLazy": true } ]';
		    	  response.send(respText);
				  
			  });
			  
	   	  
		 }).on('error', function(e) {
			 
			  console.log("Got error: " + e.message);
		 
		 });

		 req.end();
	 }
	 
	 
	
	

  
});

*/




