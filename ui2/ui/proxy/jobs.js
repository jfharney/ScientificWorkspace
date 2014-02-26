console.log('Loading jobs js');

exports.doQueryJobs = function(responseData) {
	
	//console.log('responseData: \n' + responseData);
	
	console.log('---------------')
	var fileResponseJSONObj = JSON.parse(responseData);//JSON.parse(fileResponseJSONStr);////
	  
	var hasJobs = false;
	for(var key in fileResponseJSONObj) {
		//console.log('doqueryjobskey: ' + key + ' value: ' + fileResponseJSONObj[key] + ' LENGTH: ' + fileResponseJSONObj[key].length);
		if(fileResponseJSONObj[key].length > 0) {
			hasJobs = true;
		}
		var jobsObj = fileResponseJSONObj[key];
		for(var keykey in jobsObj) {
			var jobObj = jobsObj[keykey];
			//for(var keykeykey in jobObj) 
				//console.log('\t' + keykeykey + ' val: ' + jobObj[keykeykey]);
		}
	}
	

	console.log('---------------')
	
	var jobsArr = fileResponseJSONObj['jobs'];
	//console.log(jobsArr.length);
	var jsonStr = '[';
	for(var i=0;i<jobsArr.length;i++) {
		jsonStr += '{"title": "' + jobsArr[i]['jobname'] + ' (' + jobsArr[i]['jobid'] + ')' + '", "isFolder": true, "isLazy": true , "type" : "apps" }';
		if(i < jobsArr.length-1) {
			jsonStr += ',';
		}
	}
	jsonStr += ']';
	//fileResponseJSONStr = '[{"title": "aTitle", "isFolder": true, "isLazy": true , "type" : "apps" }]';
	fileResponseJSONStr = jsonStr;
	
	//console.log('fileResponse: ' + fileResponseJSONStr);
	
	return fileResponseJSONStr;
	
}
