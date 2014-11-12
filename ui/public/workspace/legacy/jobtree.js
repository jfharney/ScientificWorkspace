var mvcURL = 'http://localhost:1337';
var SciWorkspace = SciWorkspace || {};
	
SciWorkspace.namespace = function(ns_string) 
{
  var parts = ns_string.split("."),
	  parent = SciWorkspace,
	  i;
  
  // strip redundant leading global
  if(parts[0] === "SciWorkspace") {
    parts = parts.slice(1);
  }

  for(i=0; i < parts.length; i+=1) {
    // create a property if it doesn't exist
	if(typeof parent[parts[i] === "undefined"]) {
	  parent[parts[i]] = {};
	}
	parent = parent[parts[i]];
  }
	    
  return parent;
};
	
var sciworkspace_users = SciWorkspace.namespace("SciWorkspace.users");
	
var highlightedFile = null;
var highlightedJob = null;

/*function getJobInfo(url) 
{
  var infoDIV = '#job_info';
  console.log('calling: ' + url);
		  
  //ajax call for file info
  jQuery.ajax({
    url: url,
	type: 'GET',
	success: function(data) 
	{
      $(infoDIV).empty();
	  data = JSON.parse(data);
	  for(var key in data) {
		//console.log('key: ' + key + ' data: ' + data[key]);
		$(infoDIV).append('<div><span style="font-weight:bold;">' + key + '</span> - ' + data[key] + '</div>');
	  }
    },
	error: function() 
	{
	  console.log('error in getting file information');
	}
  });
}*/