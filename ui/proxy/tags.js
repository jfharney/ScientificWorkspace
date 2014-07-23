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

  var path = '/sws/nodes?tag-nid=' + request.params.tag_nid;

  var options = {
	host: proxy.serviceHost,
	port: proxy.servicePort,
	path: path,
	method: 'GET'
  };
	
  var responseData = '';

  var req = http.request(options, function(res) {
		 
    res.on('data', function(chunk) {
	  responseData += chunk;
    });
				
    res.on('end', function() {
	  response.send(responseData);
    });

    res.on('error', function(e) {
	  response.send('error: ' + e);
	});
	  
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
	 
  req.end();

};


module.exports.tagLinksProxHelper = tagLinksProxHelper;


var tagsTableProxy = function(request, response) {

  var path = '/sws/tags?uid=' + request.params.uid;

  var options = {
	host: proxy.serviceHost,
	port: proxy.servicePort,
	//async: false,
	path: path,
	method: 'GET'
  };
  console.log('\n*******\n\n\n\nouter path: '+options.path);
  var responseData = '';

  var req = http.request(options, function(res) {		 
    res.on('data', function(chunk) {
      responseData += chunk;
    });
					
    res.on('end', function() {
      // Now that we have the response data, we want to create a new response object 
      // that will contain additional data. 
      var tagCounter = 0;
      
      var jsonObjArr = JSON.parse(responseData);
      var respObjArr = [];
      
      for(var i = 0; i < jsonObjArr.length; i++) {
        var retObj = {};
        
        retObj.name = jsonObjArr[i]['name'];
        retObj.desc = jsonObjArr[i]['desc'];
        retObj.access = jsonObjArr[i]['access'];
        //retObj.resources = '';
        
        /******************************************/
        
        /* Now, for each tag, we want to get a count of the number of links. */
        
        var tagNid = jsonObjArr[i]['nid'];
        console.log('tagNid is ' + tagNid);
        var options2 = {
          host: proxy.serviceHost,
          port: proxy.servicePort,
          path: '/sws/nodes?tag-nid='+tagNid,
          method: 'GET'
        };
        //console.log('inner path: '+options2.path);
        
        /*
        var req2 = http.request(options2, function(res2) {
            var linkData = '';
            res2.on('data', function(chunk) {
            	console.log('chunking');
          	  linkData += chunk;
            });
            res2.on('end', function() {
            	
          	tagCounter += 1;
          	var jsonObjArr2 = [];
          	jsonObjArr2 = JSON.parse(linkData);
          	retObj.linkCount = jsonObjArr2.length;
          	retObj.resources = '';
          	if(retObj.linkCount)
          	  retObj.resources = '';
          	for(var i = 0; i < retObj.linkCount; i++) {
          	  retObj.resources += jsonObjArr2[i]['name'] + ', ';
          	}

              respObjArr.push(retObj);
          	
          	if(tagCounter == jsonObjArr.length) {
          	  //console.log('respObjArr: '+respObjArr);
          	  response.send(respObjArr);
              }
              
            	console.log('done');
            	res2.send("Response");
            });
            res2.on('error', function(e) {
          	console.log('error message: ' + e);
            });

          });
        
        req.end();
        */
        
        
        
        /*
        var tagNid = jsonObjArr[i]['nid'];
        console.log('tagNid is ' + tagNid);
        var options2 = {
          host: proxy.serviceHost,
          port: proxy.servicePort,
          path: '/sws/nodes?tag-nid='+tagNid,
          method: 'GET'
        };
        console.log('inner path: '+options2.path);
        var req2 = http.request(options2, function(res2) {
          var linkData = '';
          res2.on('data', function(chunk) {
        	linkData += chunk;
          });
          res2.on('end', function() {
        	tagCounter += 1;
        	var jsonObjArr2 = [];
        	jsonObjArr2 = JSON.parse(linkData);
        	retObj.linkCount = jsonObjArr2.length;
        	retObj.resources = '';
        	if(retObj.linkCount)
        	  retObj.resources = '';
        	for(var i = 0; i < retObj.linkCount; i++) {
        	  retObj.resources += jsonObjArr2[i]['name'] + ', ';
        	}

            respObjArr.push(retObj);
        	
        	if(tagCounter == jsonObjArr.length) {
        	  //console.log('respObjArr: '+respObjArr);
        	  response.send(respObjArr);
            }
          });
          res2.on('error', function(e) {
        	console.log('error message: ' + e);
          });

        });
        
        req2.end();
        */
        /******************************************/
         
        //var ex = i + ', swtf-008, baro-1b, 6798687';
        
        //retObj.resources = ex;
        respObjArr.push(retObj);
      }
      
      response.send(respObjArr);
      
      //response.send(respObjArr);
    });

    res.on('error', function(e) {
      response.send('error: ' + e);
    });
		  
  })
  .on('error', function(e) {
    console.log("Got error: " + e.message);
  });
		 
  req.end();

};

module.exports.tagsTableProxy = tagsTableProxy;
