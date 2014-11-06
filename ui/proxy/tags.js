console.log('Loading tags js');

var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var proxy = require('./proxyConfig.js');

var data = require('../data/firewall_sources.js');


var deletetagsHelper = function(request, response) {
	
	var args = url.parse(request.url, true).query;
	
  	if(proxy.tagDebug) {
  		for (var key in args) {
  			console.log('key: ' + key + ' value: ' + args[key]);
  		}
  	}
 	
	var tag_nid = args['tag_nid'];
	
	var options = {
			host: proxy.serviceHost,
			port: proxy.servicePort,
			path: "/sws/tag/" + tag_nid,   // uid=" + user_id; + '&name='+name+'&description='+description,
			method: 'DELETE'
	};
	
    var req = http.request(options, function(resp) {
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			
			if(proxy.tagDebug) {
				console.log('officially deleted tag');
			}

			response.send("deleting tag");
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
	
	
};

module.exports.deletetagsHelper = deletetagsHelper;


var deletetaglinksHelper = function(request, response) {
	
	var args = url.parse(request.url, true).query;
	
	if(proxy.tagDebug) {
  	
		for (var key in args) {
			console.log('key: ' + key + ' value: ' + args[key]);
		}
	}
	
	var tag_nid = args['tag_nid'];
	var resource_nid = args['resource_nid'];
	
	//curl -X DELETE http://techint-b117:8080/sws/tag/600284/link/88456 
	
	var options = {
			host: proxy.serviceHost,
			port: proxy.servicePort,
			path: "/sws/tag/" + tag_nid + '/link/' + resource_nid,   // uid=" + user_id; + '&name='+name+'&description='+description,
			method: 'DELETE'
	};
	
    var req = http.request(options, function(resp) {
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			
			if(proxy.tagDebug) {
				console.log('officially deleted tag link');
			}

			response.send("deleting tag link");
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
	
	
};

module.exports.deletetaglinksHelper = deletetaglinksHelper;


var taginfoHelper = function(request,response) {
	
	
	//console.log ('calling tags info...' + request.params.tag_name);
	var args = url.parse(request.url, true).query;
	
	var options = {
			host: 'localhost',
			port: 8080,
			path: "/tags/" + request.params.tag_name + "?uid=" + args['uid'],
			method: 'GET'
	};
	
	//console.log("Sending path " + options['path']);
	
	var req = http.request(options, function(resp) {
		//console.log('Got response status code ' + resp.statusCode);
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			var jsonObj = JSON.parse(responseData);
			response.send(jsonObj);
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();	
	
	
};

module.exports.taginfoHelper = taginfoHelper;


var tagsHelper = function(request,response) {
	
	var args = url.parse(request.url, true).query;
	// query above is an object containing all the 
	// arguments in the URL as key-value pairs.
	//console.log("In frontend.js (app.get '/tags'...), received: " + request.url);
	
	var arguments = '';
	
	for(i in args)
	  if(arguments == '')
		arguments = i + "=" + args[i];
	  else
		arguments += "&" + i + "=" + args[i];
	
	var options = {
			host: proxy.serviceHost,
			port: proxy.servicePort,
			path: "/sws/tags?uid=" + args['uid'],
			method: 'GET'
	};
	
	var req = http.request(options, function(resp) {
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			if(proxy.tagDebug) {
				console.log('tag responseData: \n' + responseData);
			}
			response.send(responseData);
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
	
};

module.exports.tagsHelper = tagsHelper;

var associationsproxyHelper = function(request,response) {

	var user_id = request.params.user_id;
	
	var args = url.parse(request.url, true).query;
	
	var tag_nid = args['tag_nid'];
	var resource_nid = args['resource_nid'];
	var type = args['type'];
	
	var options = {
			host: proxy.serviceHost,
			port: proxy.servicePort,
			//path: "/sws/tags?uid=" + args['uid'],
			path: '/sws/tag/' + tag_nid + '/link/' + resource_nid,
			method: 'POST'
	};
	
	if(proxy.tagDebug) {
		console.log('path -> ' + options['path']);	
	}
	
	var req = http.request(options, function(resp) {
		
		var responseData = '';
		resp.on('data', function(chunk) {
			responseData += chunk;
		});
		
		resp.on('end', function() {
			if(proxy.tagDebug) {
				console.log('associations proxy response data: ' + responseData);
			}

		    //var jsonObj = JSON.parse(responseData);
		    
			//response.send(jsonObj);
			response.send("response");
		});
		
		resp.on('error', function(e) {
			response.send('error: ' + e);
		});
	});
	
	req.end();
	
};

module.exports.associationsproxyHelper = associationsproxyHelper;


/* This is where a new tag is created. */
var tagsProxyHelper = function(request,response) {
	
	if(proxy.tagDebug) {
		//console.log('associations proxy response data: ' + responseData);
		console.log('\n\n---------in tag proxy----------');
		console.log('Adding tag');
	}
	
	var args = url.parse(request.url, true).query;
	if(proxy.tagDebug) {
	
		for(var key in args) {
			console.log('key: ' + key + ' value: ' + args[key]);
		}
	}
  	
	var user_id = request.params.user_id;
	var name = args['name'];
	var description = args['description'];
	description = description.split(' ').join('+');
	
	if(proxy.tagDebug) {
		
	  console.log('user_id: ' + user_id);
	  console.log('name: '+name);
	  console.log('description: '+description);
	}
	
	var options = {
		host: proxy.serviceHost,
		port: proxy.servicePort,
		path: "/sws/tag?uid=" + user_id + '&name='+name+'&desc='+description,
		method: 'POST'
	};
	  
	var req = http.request(options, function(resp) {
    
	if(proxy.tagDebug) {		
		console.log('Issuing host '+options.host);  
	    console.log('Issuing port '+options.port);
		console.log('Issuing path '+options.path);
	}	
	
    var responseData = '';
    resp.on('data', function(chunk) {
      responseData += chunk;
    });
		
    resp.on('end', function() {
    	if(proxy.tagDebug) {
    		
    		console.log('tag post responseData: ' + responseData);
    	}
    	var jsonObj = JSON.parse(responseData);
    	response.send(jsonObj);
    });
		
	resp.on('error', function(e) {
	  response.send('error: ' + e);
	});
  });
	
  req.end();
	
}

module.exports.tagsProxyHelper = tagsProxyHelper;


var tagLinksProxHelper = function(request, response) {

	var path = '/sws/nodes?tag-nid=' + request.params.tag_nid;

	if(proxy.tagDebug) {
		console.log('tag links path: ' + path);
	}
  
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
	    	if (proxy.tagDebug) {
	    		console.log('responseData\n' + responseData);
	    	}
	      
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
  
  if(proxy.tagDebug) {
	  console.log('\n*******\n\n\n\nouter path: '+options.path);
  }
  
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
        //console.log('tagNid is ' + tagNid);
        var options2 = {
          host: proxy.serviceHost,
          port: proxy.servicePort,
          path: '/sws/nodes?tag-nid='+tagNid,
          method: 'GET'
        };
        
        
        
        respObjArr.push(retObj);
      }
      
      response.send(respObjArr);
      
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


