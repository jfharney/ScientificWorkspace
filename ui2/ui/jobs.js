//jobs proxy service
var jobs_proxy_service = app.get('/jobs',function(request,response) {
  var options = {
	host: 'localhost',
	port: servicePort,
	path: '/jobs',
	method: 'GET'
  };
	  
  console.log('in service side /jobs');
  
  var responseData = '';
	  
  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
	  responseData += chunk;	
    });
	     
    res.on("end", function () {
    	
    	var data = { 'jobs' : [  
  	                         	{ 'job_id' : '1' , 'user_id' : 'j1s'},
  	                         	{ 'job_id' : '2' , 'user_id' : 'j1s'},
    	                      ]
    	};
    	
    	console.log('jobs: ' + data['jobs'][0]['user_id']);
    	
    	//console.log('responseData:\n ' + responseData);
    	
    // you can use res.send instead of console.log to output via express
    	var jsonObj = JSON.parse(responseData);
        //response.send(jsonObj);
    	response.send(data);
    }); 
	     
	      
  });
	  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
   
  // write data to request body
  req.write('data\n');
  req.write('data\n');
  req.end();
});


module.exports = jobs_proxy_service;