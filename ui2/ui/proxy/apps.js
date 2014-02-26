console.log('Loading apps js');


var express = require('express');
var app = express();

var firewallMode = true;

var hbs = require('hbs');

var http = require('http');
var url = require('url');


app.use(express.static('public'));

var servicePort = 8080;


exports.doQueryApps = function (responseData) {
	
	console.log('in do query apps for: \n' + responseData);
	
	var fileResponseJSONObj = JSON.parse(responseData)
	
	var appsArr = fileResponseJSONObj['apps'];
	
	console.log(appsArr.length);
	var jsonStr = '[';
	for(var i=0;i<appsArr.length;i++) {
		jsonStr += '{"title": "' + appsArr[i]['appid'] + '", "isFolder": false, "type" : "apps" }';
		if(i < appsArr.length-1) {
			jsonStr += ',';
		}
	}
	jsonStr += ']';
	
	//console.log('apps jsonStr: \n' + jsonStr);
	
	fileResponseJSONStr = jsonStr;
	
	return fileResponseJSONStr;
}
