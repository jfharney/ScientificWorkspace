var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var dois = require('./proxy/dois.js');
var url = require('url');
var proxy = require('./proxy/proxyConfig.js');

// Start Express
var express = require("express");
var app = express();

// Set the view directory to /views
console.log('__dirname: ' + __dirname);
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());

// Let's use the Jade templating language.
app.set("view engine", "jade");

var users = require('./proxy/users.js');
var groups = require('./proxy/groups.js');
var files = require('./proxy/files.js');
var jobs = require('./proxy/jobs.js');
var apps = require('./proxy/apps.js');
var dois = require('./proxy/dois.js');
var associations = require('./proxy/associations.js');
var associationsfeed = require('./proxy/associationsfeed.js');
var tags = require('./proxy/tags.js');


var data = require('./data/firewall_sources.js');
var sample_search_results = require('./data/sample_search_results.js');

if(proxy.firewallMode)
  console.log('firewall: ' + proxy.firewallMode);


/*************************************************************/
app.get('/configuration', function(request,response){
	
	
	var obj = {};
    obj['swhostname'] = proxy.proxyHost;
    obj['swport'] = proxy.proxyPort;
    obj['theme_prefix'] = 'http://' + proxy.proxyHost + ':' + proxy.proxyPort + '/common/';
    obj['feed_on'] = proxy.feed_on;
    obj['doiOfflineMode'] = proxy.doiOfflineMode;
    
    
    
    
    
    response.send(obj);
		     
	
});


/*************************************************************/

app.get('/search/:user_id', function(request,response) {
	console.log('\n\n---------in get search for ' + request.params.user_id + '----------');
	
	console.log('A GET for /searc/'+request.params.user_id+' has been issued.');
	
	console.log('\n\n')
	
	var model = {};		/* model is the JSON object we will pass to the page doi.jade. */
		
	if(request.query.query == undefined || request.query.query == null) {
		
		console.log('undefined')
		
	} else {
		console.log('defined - ' + request.query.query);
		model['query'] = request.query.query;
		  
	}
	console.log('\n\n')
	
	
	
	if(proxy.firewallMode) {
		  
		var userObj = data.userObj;
		response.render("search", userObj);
    
	} 
	else {
		
		
		var options = {
			    host: proxy.serviceHost,
			    port: proxy.servicePort,
			    path: "/sws/user?uname=" + request.params.user_id,
			    method: 'GET'
		};

		var req = http.request(options, function(resp) {
		    
			var responseData = '';
			resp.on('data', function(chunk) {
		      responseData += chunk;
			});
	
			resp.on('end', function() {
				if(proxy.tagDebug) {	
					console.log('users responseData: ' + responseData);
				}
				
				
				var userObj = JSON.parse(responseData);
				
				for (var key in userObj) {
					//console.log('key: ' + key + ' value: ' + userObj[key]);
					model[key] = userObj[key];
				}
				
				for(var key in model) {
					console.log('key: ' + key + ' value: ' + model[key]);
				}
				
				
				response.render("search", model);
				//response.render("search",model);
			});
	
			resp.on('error', function(e) {
		      response.send('error: ' + e);
		    });
	      
		});
	    	 
		req.end();
		
		
		
		// userHelper is defined in the file proxy/users.js.   
		//var res = users.userSearchHelper(request, response);  
		
	}  
	
	
});

app.post('/search/:user_id', function(request,response) {
	console.log('\n\n---------in post search for ' + request.params.user_id + '----------');
	
	console.log('A POST for /searc/'+request.params.user_id+' has been issued.');
	  
	  
	if(proxy.firewallMode) {
	  
		var userObj = data.userObj;
		response.render("search", userObj);
    
	} 
	else {
		// userHelper is defined in the file proxy/users.js.   
		var res = users.userSearchHelper(request, response);  
	
	}  
	
});

//comes directly from the doi service 
//
app.get("/search_results_doi_metadata/:user_id", function(request, response) {
	console.log('\n\n---------in search_results_doi for ' + request.params.user_id + '----------');
	
	for(var key in request_obj) {
		console.log('key: ' + key);
	}
	
	var path = '';
	
	var doi_host = "doi1.ccs.ornl.gov";
	var doi_port = '8080';
	  
	var doi_name = 'doi_title';
	
	path = '/doi/search?uid=' + request.params.user_id + '&';
	
  
	console.log('path--->' + 'http://' + doi_host + ':' + doi_port + path);
	  
	
	var respArr = [];
	
	var respObj = {};

	respObj['title'] = 'doi_title';
	respObj['description'] = 'doi_description';
	respObj['creators'] = 'doi_creators';
	respObj['creators_email'] = 'creators_email';
	respObj['files'] = 'doi_files';
	respObj['nids'] = 'doi_nids';
	respObj['resources'] = 'doi_resources';
	respObj['keywords'] = 'doi_keywords';
	respObj['language'] = 'doi_language';
	respObj['country'] = 'doi_country';
	respObj['sponsor_org'] = 'doi_sponsor_org';
	
	respArr.push(respObj);
	
	//response.send('returning doi results');
	response.send(respArr);
	
});


app.get("/basic_search/:user_id", function(request, response) {
    var request_obj = request['query'];

    //console.log('basic search');
    //for(var key in request_obj) {
    //    console.log('params: ' + key);
    //}

    var path = '/sws/search?uid=' + request.params.user_id + '&query=v.name:' + request_obj['text'];

    //query the userlist service here
    var options = {
        host: proxy.serviceHost,
        port: proxy.servicePort,
        path: path,
        method: 'GET'
    };

    var responseData = '';

    var req = http.request(options, function(res)
    {
        res.on('data', function (chunk)
        {
            responseData += chunk;
        });

        res.on('end',function()
        {
            //console.log('search results response data\n' + responseData);
            var jsonObj = JSON.parse(responseData);
            response.send(jsonObj);
        });

    }).on('error', function(e)
    {
        console.log("Got error: " + e.message);

    });

    req.end();
});


app.get("/adv_search/:user_id", function(request, response) {
    var request_obj = request['query'];

    //console.log('adv search');
    //for(var key in request_obj) {
    //    console.log('params: ' + key);
    //}

    var path = '/sws/search?uid=' + request.params.user_id + '&query=(';
    var term = false;

    if ( request_obj['name'] )
    {
        path = path + 'v.name:'+request_obj['name'];
        term = true;
    }

    if ( request_obj['title'] )
    {
        if ( term == true )
            path = path + '+OR+';

        path = path + 'v.title:'+request_obj['title'];
        term = true;
    }

    if ( request_obj['desc'] )
    {
        if ( term == true )
            path = path + '+OR+';

        path = path + 'v.desc:'+request_obj['desc'];
        term = true;
    }

    if ( request_obj['keywords'] )
    {
        if ( term == true )
            path = path + '+OR+';

        path = path + 'v.keywd:'+request_obj['keywords'];
        term = true;
    }

    path = path + ')';

    if ( request_obj['types'] )
    {
        var types = request_obj['types'];
        if ( types != 0x1FF )
        {
            //console.log('types: ' + types);
            var start = 0;
            var stop = 1;
            var inblock = false;
            var idx = 1;

            term = false;
            path = path + '+AND+(';

            for ( bit = 1; bit < 0x200; bit = bit << 1, idx++ )
            {
                //console.log('bit: ' + bit + ", idx: " + idx );
                //console.log('block: ' + inblock + ", mask: " + (types & bit) );

                if ( inblock == true )
                {
                    if (( types & bit ) == 0 )
                    {
                        stop = idx - 2;
                        inblock = false;
                        if ( term == true )
                            path = path + '+OR+';

                        path = path + 'v.type:['+start+'+TO+'+stop+']';
                        term = true;
                    }
                }
                else
                {
                    if (( types & bit ) == bit )
                    {
                        start = idx - 1;
                        inblock = true;
                    }
                }
            }

            if ( inblock == true )
            {
                stop = idx - 2;
                if ( term == true )
                    path = path + '+OR+';

                path = path + 'v.type:['+start+'+TO+'+stop+']';
            }

            path = path + ')';
        }
    }

    console.log('path (final): ' + path);

    //query the userlist service here
    var options = {
        host: proxy.serviceHost,
        port: proxy.servicePort,
        path: path,
        method: 'GET'
    };

    var responseData = '';

    var req = http.request(options, function(res)
    {
        res.on('data', function (chunk)
        {
            responseData += chunk;
        });

        res.on('end',function()
        {
            //console.log('search results response data\n' + responseData);
            var jsonObj = JSON.parse(responseData);
            response.send(jsonObj);
        });

    }).on('error', function(e)
    {
        console.log("Got error: " + e.message);

    });

    req.end();
});




/*************************************************************/

app.get('/doi/:user_id', function(request, response) {
  /* doiUserHelper is defined in the file proxy/users.js. */   
  var res = users.doiUserHelper(request, response); 
});

app.post('/doi/:user_id', function(request, response) {
	
  var model = {};		/* model is the JSON object we will pass to the page doi.jade. */
  model['uname'] = request.params.user_id;
  
  for(var key in request['body']) {
    console.log('Rendering doi.jade, key is '+key);
    if(isArray(request['body'][key])) {
      model[key] = request['body'][key];
    } 
    else {
      var arr = new Array();
      arr.push(request['body'][key]);
      model[key] = arr;
    }	
    console.log(key + ': ' + model[key]);
  }  // end of for loop through request['body']
  response.render("doi", model);
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

app.post('/doi_submit',function(request,response) {
    console.log('\n\n>>>> in doi_submit proxy post');

    var data = request['body'];

    var payload_str = JSON.stringify(data);
    console.log('payload_str: '+payload_str);
    
    var options = {
      host: proxy.serviceHost,
      port: proxy.servicePort,
      path: "/sws/doi/new/",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload_str.length
      }
    };

    var responseData = '';

    var req = http.request(options, function(res) {
        res.on('data', function (chunk) {
            responseData += chunk;    
        });

        res.on('end', function() {
            // Return DOI number on success.
            response.writeHead(res.statusCode);
            response.write(responseData);
            console.log('The new DOI number is '+responseData);
            response.end();
        });

        res.on('error', function(e) {
            console.log( "DOI submit FAIL: " + e.code + ", " + e.message );

            response.writeHead( e.code );
            response.write( e.message );
            response.end();
        });
    });

    req.write( payload_str );
    
    req.on('error', function(e) {
      console.log('DOI request failed: '+e.code+", "+e.message);
      response.writeHead( e.code );
      response.write( e.message );
      response.end();
    });
    
    req.end();

});


/*************************************************************/

app.get("/settings/:user_id", function(request, response) {
	  console.log('\n\n---------in settings proxy for ' + request.params.user_id + '----------');
	  response.render("settings", { uid : request.params.user_id });
});

/*************************************************************/

app.get("/", function(request, response) {
  response.redirect('/workspace/users/j1s');
});


app.get("/workspace/:user_id", function(request, response) {

  if(proxy.firewallMode) {
	  
	  var userObj = data.userObj;
    response.render("workspace", userObj);
    
  } 
  else {

	  // userHelper is defined in the file proxy/users.js.   
	  var res = users.userHelper(request, response);  
	
  }  
});


/*************************************************************/

app.get("/userinfo/:user_id", function(request, response) {
	
	console.log('calling user info...' + request.params.user_id);

	var path = '/sws/users/' + request.params.user_id;
	
	//query the userlist service here
	var options = {
			host: proxy.serviceHost,
			port: proxy.servicePort,
			path: path,
			method: 'GET'
		  };
	
	 var responseData = '';

	 console.log ('calling user info...' + request.params.user_id + ' path: ' + path);
	 
	 var req = http.request(options, function(res) {
		  console.log("Got response: " + res.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.on('data', function (chunk) {
			responseData += chunk;		
		  });
		  res.on('end',function() {
			  
			  console.log('ending user info...');
			  
			  console.log('response data\n' + responseData);
			  
			  var jsonObj = JSON.parse(responseData);
		      response.send(jsonObj);
			 
			  
		  });
		  
	  
	 }).on('error', function(e) {
		 
		  console.log("Got error: " + e.message);
	 
	 });
	 
	 req.end();
	
});


/*************************************************************/


//information feeds
app.get('/server1', function(request, response) {
	
	
	if(proxy.firewallMode) {
		var res = associationsfeed.feed1(request, response);
	} else {
		var res = associationsfeed.feed1(request, response);
	}
	
	
});


app.get('/server2', function(request, response) {
	
	if(proxy.firewallMode) {
		var res = associationsfeed.feed2(request, response);
	} else {
		var res = associationsfeed.feed2(request, response);
	}
	
	
});
app.get('/server3', function(request, response) {
	
	if(proxy.firewallMode) {
		var res = associationsfeed.feed3(request, response);
	} else {
		var res = associationsfeed.feed3(request, response);
	}
	
	
});


/*************************************************************/

//--------Groups API----------//

app.get("/groupinfo/:uid", function(request, response) {
  if(proxy.firewallMode) {
	  
	var res = groups.groupinfoHelperFirewall(request, response);  
	
  }	
  else {
	  
    var res = groups.groupinfoHelper(request, response);  
    
  }
  
});

//groups on lazy read off of the tree
app.get('/groups/:gid',function(request, response) {

  if(proxy.firewallMode) {
	  
	  var res = groups.groupsHelperFirewall(request, response);

  } else {
	  
	  var res = groups.groupsHelper(request, response);
	  
  }
  
});



/*************************************************************/

//--------Jobs API----------//

app.get('/jobsproxy/:userNum', function(request, response) {

  if(proxy.firewallMode) {
	
	  jobs.jobsproxyHelperFirewall(request, response);
	
  } else {
	  
	  jobs.jobsproxyHelper(request, response);
	
  }

});

app.get("/jobinfo/:job_id", function(request, response) {
  
  var res = jobs.jobsinfoHelper(request, response);

});

// This method has been added to solve the problem of finding a job name
// given its UUID (from the associations table). 
app.get("/jobUuid/:job_uuid", function(request, response) {		

  var res = jobs.jobsUuidHelper(request, response);

});

/*************************************************************/

//--------Apps API----------//

// Where/when is this URL issued? In file jobinfo.js, in the onLazyRead field of the Dynatree constructor (in buildJobsTree).
app.get('/appsproxy', function(request, response) {

	if(proxy.firewallMode) {
		
	  var res = apps.appsproxyHelperFirewall(request,response);
	  
	} else {

	  var res = apps.appsproxyHelper(request,response);
	}
	
});

app.get('/appinfo/:appnum', function(request, response) {
  if(proxy.firewallMode) {
	  
	var res = apps.appsinfoHelperFirewall(request,response);
	  
  }
  else {
    
	  var res = apps.appsinfoHelper(request,response);
    
  }
});

/*************************************************************/

//-----------Tags-----------//

app.del('/deletetagproxy/:user_id', function(request, response) {
	if(proxy.tagDebug) {
		console.log('\n\n---------in /deletetagproxy/:user_id----------');
	}
	var res = tags.deletetagsHelper(request, response);
	
});

app.del('/deletetaglinkproxy/:user_id', function(request, response) {
	if(proxy.tagDebug) {
		console.log('\n\n---------in /deletetaglinkproxy/user_id----------');
	}
	var res = tags.deletetaglinksHelper(request, response);
	
});

/* Creates a new tag. user_id is the user number, or uid. */
app.post('/tagproxy/:user_id', function(request, response) {

	if(proxy.tagDebug) {
		console.log('\n\n---------in /tagproxy/:user_id----------');
	}
	var res = tags.tagsProxyHelper(request, response);
	
});

//gets all the tags given a user
app.get('/tags', function(request, response) 
{	
	if(proxy.tagDebug) {
		console.log('\n----in /tags ----\n');
	}
	var res = tags.tagsHelper(request,response);
	
});

//gets info for one tag
app.get('/tags/:tag_name', function(request, response) {
	if(proxy.tagDebug) {
		console.log('\n----in tags/tag_name ----\n');
	}
	var res = tags.taginfoHelper(request, response);		// tag. needed? 
	
});

app.post('/associationproxy/:user_id', function(request, response) {
	if(proxy.tagDebug) {
		console.log('\n----in associationproxy/:user_id ----\n');
	}
	var res = tags.associationsproxyHelper(request, response);
	
});

app.get('/tags/links/:tag_nid', function(request, response) {
	if(proxy.tagDebug) {
		console.log('\n----in tags/links/tag_nid ----\n');
	}
	var res = tags.tagLinksProxHelper(request, response);
	
		
});

app.get('/tagsTable/:uid', function(request, response) {
	if(proxy.tagDebug) {
		console.log('\n----in tagsTable/uid ----\n');
	}
	/* tagsTableProxy is defined in the file proxy/tags.js. */
	var res = tags.tagsTableProxy(request, response);
});


//-----------End Tags-----------//

/*************************************************************/

//--------Files API---------//

app.get('/files/:userNum', function(request, response) {
	
  if(proxy.firewallMode) {
	  
	  var res = files.filesproxyHelperFirewall(request, response);
	  
  } 
  else {

	  var res = files.filesproxyHelper(request, response);
	  
  }
  
});

//--------DOIs API---------//

app.get('/dois/:userNum', function(request, response) {
	
  if(proxy.firewallMode) {
		  
    var res = dois.doisProxyHelperFirewall(request, response);
  } 
  else {
 
    var res = dois.doisProxyHelper(request, response);
		  
  }	
	
});

// Given a single DOI name (10...), this call returns the metadata for that DOI from Doug's service.
app.get('/doi_meta', function(request, response) {
  console.log('A /doi_meta request has been received.');

  var path = '/doi/json?doi='+request.query['doiName'];

  console.log('path is '+path);

  var options = {
    host: 'doi1.ccs.ornl.gov',
	  port: 443,					// This is an https URL, so I am using port 443. 
	  path: path,
    rejectUnauthorized: false,
	  method: 'GET'
  };

  var req = https.request(options, function(resp) {
  	var responseData = '';
    resp.on('data', function(chunk) {
      responseData += chunk;  
    });
		
    resp.on('end', function() {
    	console.log(responseData);
      var jsonObj = JSON.parse(responseData);
      
      var respObj = [
        {    
          title: '<span style="position:relative">DOI ID: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['doi']+'</span></span>', 
          isFolder: false
        },
        {    
          title: '<span style="position:relative">Language: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['language']+'</span></span>', 
          isFolder: false
        },
        {    
          title: '<span style="position:relative">Sponsor Org: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['sponsor_org']+'</span></span>', 
          isFolder: false
        },
        {    
          title: '<span style="position:relative">Keywords: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['keywords']+'</span></span>', 
          isFolder: false
        },
        {    
          title: '<span style="position:relative">Description: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['description']+'</span></span>', 
          isFolder: false
        }
      ];

      response.send(respObj);
    });

    resp.on('error', function(e) {
      response.send('error: ' + e);
    });
  });

  req.end();

});

/*************************************************************/

function isArray(what) 
{
    return Object.prototype.toString.call(what) === '[object Array]';
}






http.createServer(app).listen(proxy.proxyPort);
