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
var associations = require('./proxy/associations.js');
var associationsfeed = require('./proxy/associationsfeed.js');
var tags = require('./proxy/tags.js');


var data = require('./data/firewall_sources.js');
var sample_search_results = require('./data/sample_search_results.js');

if(proxy.firewallMode)
  console.log('firewall: ' + proxy.firewallMode);


/*************************************************************/

app.get('/search/:user_id', function(request,response) {
	console.log('\n\n---------in get search for ' + request.params.user_id + '----------');
	
	console.log('A GET for /searc/'+request.params.user_id+' has been issued.');
	
	if(proxy.firewallMode) {
		  
		var userObj = data.userObj;
		response.render("search", userObj);
    
	} 
	else {
		// userHelper is defined in the file proxy/users.js.   
		var res = users.userSearchHelper(request, response);  
	
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

app.get("/search_results/:user_id", function(request, response) {
	  console.log('\n\n---------in search_results for ' + request.params.user_id + '----------');
	  //curl -X GET 'http://techint-b117:8080/sws/search?uid=5112&query=v.name:tag*'
	  var request_obj = request['query'];
	  
	  //alert("'http://localhost:8080/sws/search?uid=7827&query=v.name=OLCF+AND+v.type=8+AND+v.keywd:peru+AND+v.desc:new+AND+v.ctime:[0+TO+9999999999]'");
		
	  
	  for(var key in request_obj) {
		  console.log('key: ' + key);
	  }
	  var text = request_obj['text'];
	  
	  var path = '';
	  
	  if(text == '*') {
		  path = '/sws/search?uid=' + request.params.user_id + '&query=v.name:tag*';
			
	  } else {
		  path = '/sws/search?uid=' + request.params.user_id + '&query=v.name:' + text;// + '*';
	  }
	  
	  console.log('path--->' + 'http://' + proxy.serviceHost + ':' + proxy.servicePort + path);
	  
	  
	  console.log('sample search results array');
	  //sample ... return one of each type
	  var sample_search_results_obj_arr = sample_search_results.search_results_obj_arr;
	  

	  response.send(sample_search_results_obj_arr);
	  /*
	  for(var i=0;i<sample_search_results_obj_arr.length;i++) {
		  var result = sample_search_results_obj_arr[i];
		  console.log('result: ' + i);
		  for(var key in result) {
			  console.log('\tkey: ' + key + ' result: ' + result[key]);
		  }
	  }
	  */
	  
	  
	  /*
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
	  */
	  
	  
});


function filterResultsByType(response_arr, type) {
	
}

function filterResultsByBitmap(response_arr, bitmap) {
	
	
	/*
	for(var i=0;i<response_arr.length;i++) {
		var result = response_arr[i];
		
		var type = result['type'];
		
		console.log('type: ' + type + ' bitmap: ' + bitmap[type]);
		if(bitmap[type]==1) {
			var $record = $('<div class="row-fluid"></div>');
			
			var $subheader = $('<div class="span10" style="margin-left: 10px">');
			var $type = $('<div>Type: ' + SW.type_str[type] + '</div>');
			$subheader.append($type);
			
			$record.append($subheader);
			
			var $separator = $('<hr>');
			
			console.log($record.html());
			
			$('#results').append($record);
			$('#results').append($separator);
		}
		
	}
	*/
	
}



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

    for(var key in data) {
    	console.log('key: ' + key + ', value: ' + data[key]);
    }
    console.log('\n');
    
    // Translate from internal JSON format to external DOI-Service submission XML schema
    //var payload = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><records><record>";

    /*
    var file_nids = data.file_nids;
    var group_nids = data.group_nids;
    var user_nids = data.user_nids;
    var job_nids = data.job_nids;
    var app_nids = data.app_nids;
    var tag_nids = data.tag_nids;
    
    //gather all the nids in one string/input value
    var nids = '';
    nids += file_nids; 
    nids += ',' + group_nids;
    nids += ',' + tag_nids;
    
    //unify with tag nids
    */
    
    /*var nids = data.nids;
    console.log('nids: ' + nids);
    
    
    var files = data.files;
    
    
    //call the GET tag service that grabs the listing of files
    

    //unify the files with the tagged files here
    
    
    // For now, just hard-code the mapping from internal to external representation
    // Eventually a mapping table should be used
    payload += "<title>" + data.title + "</title>";
    payload += "<description>" + data.description + "</description>";
    payload += "<creators>" + data.creator_name + "</creators>";
    payload += "<creators_email>" + data.creator_email + "</creators_email>";
    payload += "<files>" + files + "</files>";
    payload += "<nids>"+nids+"</nids>";
    payload += "<resources>" + data.resources + "</resources>";
    payload += "<keywords>" + data.keywords + "</keywords>";
    payload += "<language>" + data.language + "</language>";
    payload += "<country>" + data.country + "</country>";
    payload += "<sponsor_org>" + data.sponsor_org + "</sponsor_org>";
    payload += "</record></records>";

    console.log( payload );*/
    
    // The following line is wrong, but we are keeping it now to prevent the POST of the form. 
    nids += ','+SW.selected_people_nids+SW.selected_group_nids;
    
    var options = {
      host: proxy.serviceHost,
      port: proxy.servicePort,
      path: "/sws/doi/new/",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    var responseData = '';

    var req = https.request(options, function(res) {
        res.on('data', function (chunk) {
            responseData += chunk;    
        });

        res.on('end', function() {
            console.log( "DOI submit OK" );

            // Return DOI number
            response.writeHead( 200 );
            response.write( responseData );
            response.end();
        });

        res.on('error', function(e) {
            console.log( "DOI submit FAIL: " + e.code + ", " + e.message );

            response.writeHead( e.code );
            response.write( e.message );
            response.end();
        });
    });

    req.write( data );      // Changed from "payload". -Mark, 9-02
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
	
  console.log('A GET for /workspace/'+request.params.user_id+' has been issued.');
  
  
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

	console.log('in jobsproxy');
  if(proxy.firewallMode) {
	
	jobs.jobsproxyHelperFirewall(request, response);
	
  } else {
	  
	jobs.jobsproxyHelper(request, response);
	
  }
});

app.get("/jobinfo/:job_id", function(request, response) {
  console.log('calling jobs info with job_id ' + request.params.job_id);
  
  var res = jobs.jobsinfoHelper(request, response);

});

// This method has been added to solve the problem of finding a job name
// given its UUID (from the associations table). 
app.get("/jobUuid/:job_uuid", function(request, response) {	
  //console.log ('Calling jobUuid on ' + request.params.job_uuid);	

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

	console.log('\n\n\n----Tags ----\n\n');
	var res = tags.tagsHelper(request,response);
	
});

//gets info for one tag
app.get('/tags/:tag_name', function(request, response) 
{
	
	var res = tags.taginfoHelper(request, response);		// tag. needed? 
	
});

/*app.post('/associationproxy/:user_id', function(request, response)        // Commented out by Mark on 9-02-14. 
{
	
	var res = tags.associationsproxyHelper(request, response);
	
});*/

app.get('/tags/links/:tag_nid', function(request, response) {
  
	console.log('\n\n\n----Tags links----\n\n');
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

function isArray(what) 
{
    return Object.prototype.toString.call(what) === '[object Array]';
}






http.createServer(app).listen(1337);
