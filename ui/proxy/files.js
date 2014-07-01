console.log('Loading files js');

var express = require('express');
var app = express();

var firewallMode = true;

var http = require('http');
var url = require('url');

app.use(express.static('public'));

var servicePort = 8080;


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




