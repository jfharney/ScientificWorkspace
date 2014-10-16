var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
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

if(proxy.firewallMode)
  console.log('firewall: ' + proxy.firewallMode);


/*************************************************************/

app.post('/search/:user_id', function(request,response) {
	console.log('\n\n---------in doi_send proxy post for ' + request.params.user_id + '----------');
	
	var model = {};
	model['uid'] = request.params.user_id;
	
	for(var key in model) {
		console.log('key: ' + key + ' model: ' + model[key]);
	}
	
	response.render("search", model);
});


/*************************************************************/

app.get("/search_results/:user_id", function(request, response) {
	  console.log('\n\n---------in search_results for ' + request.params.user_id + '----------');
	  //curl -X GET 'http://techint-b117:8080/sws/search?uid=5112&query=v.name:tag*'
	  var request_obj = request['query'];
	  
	  
	  for(var key in request_obj) {
		  console.log('key: ' + key);
	  }
	  var text = request_obj['text'];
	  
	  var path = '';
	  
	  if(text == '*') {
		  path = '/sws/search?uid=' + request.params.user_id + '&query=v.name:tag*';
			
	  } else {
		  path = '/sws/search?uid=' + request.params.user_id + '&query=v.name:' + text + '*';
	  }
	  
		//query the userlist service here
		var options = {
				host: proxy.serviceHost,
				port: proxy.servicePort,
				path: path,
				method: 'GET'
			  };
		
		 var responseData = '';

		 
		 var req = http.request(options, function(res) {
			  res.on('data', function (chunk) {
				responseData += chunk;		
			  });
			  res.on('end',function() {
				  
				  
				  console.log('search results response data\n' + responseData);
				  
				  var jsonObj = JSON.parse(responseData);
			      response.send(jsonObj);
				 
				  
			  });
			  
		  
		 }).on('error', function(e) {
			 
			  console.log("Got error: " + e.message);
		 
		 });
		 
		 req.end();
	  
	  
	  
	  //response.render("settings", { uid : request.params.user_id });
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
    console.log(payload_str);
    
    // The following line is wrong, but we are keeping it now to prevent the POST of the form. 
    //nids += ','+SW.selected_people_nids+SW.selected_group_nids;
    
    var options = {
      host: proxy.serviceHost,
      port: proxy.servicePort,
      path: "/sws/doi/new/",
      method: 'POST',
      //rejectUnauthorized: false, 
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
	
	console.log('\n\n---------in deletetagproxy----------');
	var res = tags.deletetagsHelper(request, response);
	
});

app.del('/deletetaglinkproxy/:user_id', function(request, response) {
	
	console.log('\n\n---------in deletetaglinkproxy----------');
	var res = tags.deletetaglinksHelper(request, response);
	
});

/* Creates a new tag. user_id is the user number, or uid. */
app.post('/tagproxy/:user_id', function(request, response) {
	
  var res = tags.tagsProxyHelper(request, response);
	
});

//gets all the tags given a user
app.get('/tags', function(request, response) 
{	
	var res = tags.tagsHelper(request,response);
	
});

//gets info for one tag
app.get('/tags/:tag_name', function(request, response) 
{
	
	var res = tags.taginfoHelper(request, response);		// tag. needed? 
	
});

app.post('/associationproxy/:user_id', function(request, response)        // Commented out by Mark on 9-02-14. 
{
	
	var res = tags.associationsproxyHelper(request, response);
	
});

app.get('/tags/links/:tag_nid', function(request, response) {
  
	var res = tags.tagLinksProxHelper(request, response);
	
		
});

app.get('/tagsTable/:uid', function(request, response) {
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


/*************************************************************/

//--------DOIs API---------//    // New! Added 9-27-2014 by Mark.

app.get('/dois/:userNum', function(request, response) {
	
  if(proxy.firewallMode) {
		  
    var res = dois.doisProxyHelperFirewall(request, response);
		  
  } 
  else {
 
    var res = dois.doisProxyHelper(request, response);
		  
  }	
	
});

// Given a single DOI name (10...), this call returns the metadata for that DOI from Doug's service.
app.get('/doi/meta/:doiName1/:doiName2', function(request, response) {
	console.log('DOI meta request has been received.');

  //var path = 'doi/id/10.5072%2FOLCF%2F1260530%2F'
  var path = '/doi/id?doi=10.5072/OLCF/1260530'

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

      for(var key in jsonObj[0]['fields'])
      	console.log(key+': '+jsonObj[0]['fields'][key]);
      
      var respObj = [
        {    
          title: 'DOI ID', 
          isFolder: true,
          isLazy: false,
          children: { title: jsonObj[0]['fields']['doi'], isFolder: false }
        },
        {    
          title: 'Language', 
          isFolder: true,
          isLazy: false,
          children: { title: jsonObj[0]['fields']['language'], isFolder: false }
        },
        {    
          title: 'Sponsor Org', 
          isFolder: true,
          isLazy: false,
          children: { title: jsonObj[0]['fields']['sponsor_org'], isFolder: false }
        },
        {    
          title: 'Keywords', 
          isFolder: true,
          isLazy: false,
          children: { title: jsonObj[0]['fields']['keywords'], isFolder: false }
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






http.createServer(app).listen(1337);
