
/*
<<<<<<< HEAD
function getJobInfo(username) {
	
	//console.log('getting job inforrrr for username...' + username);
	
	var jobsArr = [];
	
	var queryString = '';
	//var url = 'http://localhost:1337/jobsproxy/'+username;
	
	var url = 'http://' + SW.hostname + ':' + SW.port + '/jobsproxy/'+username;
	
	var children = [];
	
	//create the initial children
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		async: false,
		//dataType: JSON,
		data: queryString,
		success: function(data) {
			console.log('job widget successssw');
			
			for(var i=0;i<data.length;i++) {
				for (var key in data[i]) {
					console.log('key: ' + key + ' data: ' + data[i][key]);
					
				}
				children.push(data[i]);
				//console.log('pushing data-> ' + i);
			}
			
			
			
			
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	
	
	
=======
*/
// This entire file is just the definition of a single function.
// There is another function with the same name (getJobInfo) in the file jobtree.js.
// This function is called in the file userinfo.js, in the anonymous function at the top.

function getJobInfo(username, searchArg) 
{
  var jobsArr = [];
  var queryString = '';
  if(searchArg == undefined) searchArg = '';
  var url = 'http://localhost:1337/jobsproxy/'+username+'?search='+searchArg;
  var children = [];

  // Create the initial children.
  $.ajax({
    url: url,
    global: false,
    type: 'GET',
	async: false,
	//dataType: JSON,
	data: queryString,
	success: function(data) 
	{
      for(var i = 0; i < data.length; i++) {
        children.push(data[i]);
      }
    },
    error: function() { console.log('error in getting job info'); }
  });
	
  $("#jobss_tree").dynatree({
    autoFocus: false, 
	checkbox: true,
	children: children,
	fx: { height: "toggle", duration: 200 },
	selectMode: 3,
	onSelect: function(select, node) 
	{
      var selNodes = node.tree.getSelectedNodes();
      var selUuids = $.map(selNodes, function(node)
      {
        return node.data.uuid + "";
      });
      var selTypes = $.map(selNodes, function(node)
      {
        return node.data.type + "";
      });

      var selRootNodes = node.tree.getSelectedNodes(true);

      SW.tagged_items = selUuids.join(", ");
      SW.tagged_types = selTypes.join(", ");

	  $("#echoSelectionUuids3").text(selUuids.join(", "));
	  $("#echoSelectionTypes3").text(selTypes.join(", "));
      $('#resources_to_tag').empty();
      $('#resources_to_tag').append('<div>' + SW.tagged_items + '</div>');
      $('#resources_types_to_tag').empty();
      $('#resources_types_to_tag').append('<div>' + SW.tagged_types + '</div>');
	},
    onActivate: function(node) 
    {
	  console.log('you activated ' + node.data.title);
	  var info_obj = '';
		    		
	  if(node.data.type == 'job') {
	    console.log('this is a job');
		var url = 'http://localhost:1337/jobinfo/' + node.data.jobid;
		var info_space = '#job_info';
		$(info_space).empty();
		var queryString = '';
		$.ajax({
	      url: url,
		  global: false,
		  type: 'GET',
		  async: false,
		  data: queryString,
		  success: function(data) 
		  {
            info_obj = data;
            
			if(!jQuery.isEmptyObject(info_obj)) {
		      $(info_space).append('<div>jobid: ' + info_obj['jobs'][0]['jobid']+ '</div>');
		      $(info_space).append('<div>starttime: ' + info_obj['jobs'][0]['starttime']+ '</div>');
		      $(info_space).append('<div>endtime: ' + info_obj['jobs'][0]['endtime']+ '</div>');
		      $(info_space).append('<div>groupname: ' + info_obj['jobs'][0]['groupname']+ '</div>');
		      $(info_space).append('<div>hostname: ' + info_obj['jobs'][0]['hostname']+ '</div>');
		      $(info_space).append('<div>joberr: ' + info_obj['jobs'][0]['joberr']+ '</div>');
		      $(info_space).append('<div>jobname: ' + info_obj['jobs'][0]['jobname']+ '</div>');
		      $(info_space).append('<div>jobuuid: ' + info_obj['jobs'][0]['uuid']+ '</div>');
		      $(info_space).append('<div>processors: ' + info_obj['jobs'][0]['processors']+ '</div>');
		      $(info_space).append('<div>username: ' + info_obj['jobs'][0]['username']+ '</div>');
		      $(info_space).append('<div style="margin-bottom:10px">walltime: ' + info_obj['jobs'][0]['walltime']+ '</div>');
		    } 
			else {
		      $(user_info_space).append('<div>The user does not exist</div>');
		    }
		  },
		  error: function() {}
  		});
      } 
	  else {
        // This is an app.
        var url = 'http://localhost:1337/appinfo/'+node.data.appid+'?jobid='+node.data.jobid;
		var queryString = '';
		
		$.ajax({
          url: url,
          global: false,
          type: 'GET',
          async: false,
          data: queryString,
          success: function(data) 
          {
		    info_obj = data;
		    var info_space = '#app_info';
		    $(info_space).empty();
		    //$('#user_info_space').empty();
		    for(var key in info_obj['apps'][0]) {
              console.log('key: ' + key);
            }
		    if(!jQuery.isEmptyObject(info_obj)) {
		      $(info_space).append('<div>appid: ' + info_obj['apps'][0]['appid']+ '</div>');
		      $(info_space).append('<div>jobid: ' + info_obj['apps'][0]['jobid']+ '</div>');
		      $(info_space).append('<div>starttime: ' + info_obj['apps'][0]['starttime']+ '</div>');
		      $(info_space).append('<div>command: ' + info_obj['apps'][0]['command']+ '</div>');
		      $(info_space).append('<div>endtime: ' + info_obj['apps'][0]['endtime']+ '</div>');
		      $(info_space).append('<div>exitcode: ' + info_obj['apps'][0]['exitcode']+ '</div>');
		      $(info_space).append('<div>hostname: ' + info_obj['apps'][0]['hostname']+ '</div>');
		      $(info_space).append('<div>appuuid: ' + info_obj['apps'][0]['uuid']+ '</div>');
		      $(info_space).append('<div style="margin-bottom:10px">processors: ' + info_obj['apps'][0]['processors']+ '</div>');
		    } 
		    else {
		      $(user_info_space).append('<div>The user does not exist</div>');
		    }
		  },
		  error: function() 
		  {
		    console.log('error in getting user id');
		  }
		});
      } // End of else.
	}, // End of onActivate.
	onLazyRead: function(node)
	{
	  var jobid = node.data.jobid; 
	  node.appendAjax({
	    url:  'http://localhost:1337' + "/appsproxy?jobid="+jobid,
		// We don't want the next line in production code:
		debugLazyDelay: 50
      });
	},
    // The following options are only required if we have more than one tree on one page:
    //initId: "treeData",
	cookieId: "dynatree-Cb3",
	idPrefix: "dynatree-Cb3-"      
  });
}














/* 	DO NOT DELETE!
	This is the original working version of the function which loads the jobs tree into
	the jobs widget. The modified version above is an attempt to parameterize (?) the function,
	such that it loads only a subset of the data based on a search term. But still loads the
	full tree during the ready event. Maybe it would be better to have one function for the 
	ready event and another for the search event...
function getJobInfo(username) 
{
  var jobsArr = [];
  var queryString = '';
  var url = 'http://localhost:1337/jobsproxy/'+username;
  var children = [];
>>>>>>> devel-practice-mark
	
  //create the initial children
  $.ajax({
    url: url,
    global: false,
    type: 'GET',
	async: false,
	//dataType: JSON,
	data: queryString,
	success: function(data) 
	{
      console.log('job widget successssw');
      for(var i=0; i<data.length; i++) {
        for(var key in data[i]) {
          console.log('key: ' + key + ' data: ' + data[i][key]);
        }
        children.push(data[i]);
      }
    },
    error: function() 
    {
      console.log('error in getting job info');
    }
  });       
	
  $("#jobss_tree").dynatree({
    title: "Lazy loading sample",
    fx: { height: "toggle", duration: 200 },
    autoFocus: false, 
    children: children,
	checkbox: true,
	selectMode: 3,
	onSelect: function(select, node) 
	{
	  var selNodes = node.tree.getSelectedNodes();
      var selUuids = $.map(selNodes, function(node)
      {
	    //return "[" + node.data.uuid + "]: '" + node.data.title + "'";
	    return node.data.uuid + "";
	  });
	  var selTypes = $.map(selNodes, function(node)
      {
        //return "[" + node.data.uuid + "]: '" + node.data.title + "'";
	    return node.data.type + "";
	  });
	          
<<<<<<< HEAD
=======
	  //$("#echoSelection2").text(selKeys.join(", "));
	  //alert('selUuids: ' + selUuids.join(", "));
	  //alert('selTypes: ' + selTypes.join(", "));
>>>>>>> devel-practice-mark
	          
	  var selRootNodes = node.tree.getSelectedNodes(true);

	  SW.tagged_items = selUuids.join(", ");
	  SW.tagged_types = selTypes.join(", ");

	  //$("#echoSelectionRootKeys3").text(selRootKeys.join(", "));

	  $("#echoSelectionUuids3").text(selUuids.join(", "));
	  $("#echoSelectionTypes3").text(selTypes.join(", "));
	  //alert('selNodes: ' + selNodes);
	          
<<<<<<< HEAD
	          //alert(selRootNodes.join(", "));

              console.log('SW.tagged_items: ' + SW.tagged_items);
              $('#resources_to_tag').empty();
              $('#resources_to_tag').append('<div>' + SW.tagged_items + '</div>')
              $('#resources_types_to_tag').empty();
              $('#resources_types_to_tag').append('<div>' + SW.tagged_types + '</div>')
	      },

	      onActivate: function(node) {
		        //$("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
		    	  console.log('you activated ' + node.data.title);
		    	  for(var key in node.data) {
		    		  //console.log('key: ' + key);
		    	  }
		    	  var info_obj = '';
		    		
		    	  if(node.data.type == 'job') {
		    		  console.log('this is a job');
		    		  
		    		  var url = 'http://localhost:1337/jobinfo/'+node.data.jobid;
		    		  
		    		  var info_space = '#job_info';
		    		  $(info_space).empty();
	  					
		    		  //var url = 'http://localhost:1337/appinfo/'+node.data.appid+'?jobid='+node.data.jobid;
		    		  var queryString = '';
		    		  
		    		  $.ajax({
			    			url: url,
			    			global: false,
			    			type: 'GET',
			    			async: false,
			    			data: queryString,
			    			success: function(data) {
			    				
			    				
			    				info_obj = data;
			    				
			    				
			    				for(var key in info_obj['jobs'][0]) {
			    					//console.log('key: ' + key + ' ' + info_obj['jobs'][0][key]);
			    				}
			    				
			    				if(!jQuery.isEmptyObject(info_obj)) {
		    						$(info_space).append('<div>jobid: ' + info_obj['jobs'][0]['jobid']+ '</div>');
		    						$(info_space).append('<div>starttime: ' + info_obj['jobs'][0]['starttime']+ '</div>');
		    						$(info_space).append('<div>endtime: ' + info_obj['jobs'][0]['endtime']+ '</div>');
		    						$(info_space).append('<div>groupname: ' + info_obj['jobs'][0]['groupname']+ '</div>');
		    						$(info_space).append('<div>hostname: ' + info_obj['jobs'][0]['hostname']+ '</div>');
		    						$(info_space).append('<div>joberr: ' + info_obj['jobs'][0]['joberr']+ '</div>');
		    						$(info_space).append('<div>jobname: ' + info_obj['jobs'][0]['jobname']+ '</div>');
		    						$(info_space).append('<div>jobuuid: ' + info_obj['jobs'][0]['uuid']+ '</div>');
		    						$(info_space).append('<div>processors: ' + info_obj['jobs'][0]['processors']+ '</div>');
		    						$(info_space).append('<div>username: ' + info_obj['jobs'][0]['username']+ '</div>');
		    						$(info_space).append('<div style="margin-bottom:10px">walltime: ' + info_obj['jobs'][0]['walltime']+ '</div>');
		    						
		    						
		    						
		    					} else {
		    						
		    						$(user_info_space).append('<div>The user does not exist</div>');
		    						
		    					}
		    					
			    				
		    					
			    			},
			    			error: function() {
			    				
			    			}
  					});
		    		  
		    		  
		    		  
		    	  } else {
		    		  console.log('this is an app');
		    		  

		    		  var url = 'http://localhost:1337/appinfo/'+node.data.appid+'?jobid='+node.data.jobid;
		    		  var queryString = '';
		    		  
		    		  $.ajax({
			    			url: url,
			    			global: false,
			    			type: 'GET',
			    			async: false,
			    			data: queryString,
			    			success: function(data) {
			    				console.log('success: ' + data);
		    					
		    					console.log(jQuery.isEmptyObject(data));
		    					
		    					info_obj = data;
		    					
		    					var info_space = '#app_info';
		    					
		    					$(info_space).empty();
		    					//$('#user_info_space').empty();
		    					
		    					for(var key in info_obj['apps'][0]) {
		    						console.log('key: ' + key);
		    					}
		    					
		    					if(!jQuery.isEmptyObject(info_obj)) {

		    						$(info_space).append('<div>appid: ' + info_obj['apps'][0]['appid']+ '</div>');
		    						$(info_space).append('<div>jobid: ' + info_obj['apps'][0]['jobid']+ '</div>');
		    						$(info_space).append('<div>starttime: ' + info_obj['apps'][0]['starttime']+ '</div>');
		    						$(info_space).append('<div>command: ' + info_obj['apps'][0]['command']+ '</div>');
		    						$(info_space).append('<div>endtime: ' + info_obj['apps'][0]['endtime']+ '</div>');
		    						$(info_space).append('<div>exitcode: ' + info_obj['apps'][0]['exitcode']+ '</div>');
		    						$(info_space).append('<div>hostname: ' + info_obj['apps'][0]['hostname']+ '</div>');
		    						$(info_space).append('<div>appuuid: ' + info_obj['apps'][0]['uuid']+ '</div>');
		    						$(info_space).append('<div style="margin-bottom:10px">processors: ' + info_obj['apps'][0]['processors']+ '</div>');
		    						
		    						
		    						
		    					} else {
		    						
		    						$(user_info_space).append('<div>The user does not exist</div>');
		    						
		    					}
		    					
		    					
		    				},
		    				error: function() {
		    					console.log('error in getting user id');
		    				}
		    			});
			    		
		    		  
		    	  }
		    	  
		    	  
		      },
	      onLazyRead: function(node){

	    	  console.log('lazy reading jobs tree for ' + node.data.jobid);
	    	  
		      var jobid = node.data.jobid; 
	    	  
	    	  //var url = mvcURL + "/filesinfo?path=" + node.data.path + '&uid=8038&gid=16854';
	    	  
	    	  //getFileInfo(url);
	    	  
		      console.log('http://localhost:1337' + "/appsproxy?jobid="+jobid);
		      
	    	  node.appendAjax({
		          
		        	url:  'http://localhost:1337' + "/appsproxy?jobid="+jobid, //widow1|proj|lgt006&uid=8038&gid=16854",
		          
		          
		          	// We don't want the next line in production code:
		          	debugLazyDelay: 50
		        });
	    	  
	    	  
	      },

	      // The following options are only required, if we have more than one tree on one page:
//	                initId: "treeData",
	      cookieId: "dynatree-Cb3",
	      idPrefix: "dynatree-Cb3-"
	      
	});
	
	
	
	
	
	
}





















/*
var url = 'http://localhost:1337/userinfo/'+node.data.username;
var queryString = '';

$.ajax({
		url: url,
		global: false,
		type: 'GET',
		async: false,
		data: queryString,
		success: function(data) {
			console.log('success: ' + data);
			
			console.log(jQuery.isEmptyObject(data));
			
			user_info_obj = data;
			
			var user_info_space = '#collaborator_info';
			
			$(user_info_space).empty();
			//$('#user_info_space').empty();
			
			if(!jQuery.isEmptyObject(user_info_obj)) {
				
				
				$(user_info_space).append('<div>username: ' + data['username']+ '</div>');
				$(user_info_space).append('<div>uid: ' + data['uid']+ '</div>');
				$(user_info_space).append('<div>email: ' + data['email']+ '</div>');
				$(user_info_space).append('<div>firstname: ' + data['firstname']+ '</div>');
				$(user_info_space).append('<div>middlename: ' + data['middlename']+ '</div>');
				$(user_info_space).append('<div style="margin-bottom:10px">lastname: ' + data['lastname']+ '</div>');
				
				
			} else {
				
				$(user_info_space).append('<div>The user does not exist</div>');
				
=======
	  //alert(selRootNodes.join(", "));

      //alert('SW.tagged_items: ' + SW.tagged_items);
      $('#resources_to_tag').empty();
      $('#resources_to_tag').append('<div>' + SW.tagged_items + '</div>');
      $('#resources_types_to_tag').empty();
      $('#resources_types_to_tag').append('<div>' + SW.tagged_types + '</div>');
	},
    onActivate: function(node) 
    {
      //$("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
	  console.log('you activated ' + node.data.title);
	  for(var key in node.data) {
		//console.log('key: ' + key);
	  }
	  var info_obj = '';
		    		
	  if(node.data.type == 'job') {
	    console.log('this is a job');
		var url = 'http://localhost:1337/jobinfo/'+node.data.jobid;
		var info_space = '#job_info';
		$(info_space).empty();
	  	//var url = 'http://localhost:1337/appinfo/'+node.data.appid+'?jobid='+node.data.jobid;
		var queryString = '';
		$.ajax({
	      url: url,
		  global: false,
		  type: 'GET',
		  async: false,
		  data: queryString,
		  success: function(data) 
		  {
            info_obj = data;
			//console.log('info_obj: ' + info_obj);
			for(var key in info_obj['jobs'][0]) {
			  //console.log('key: ' + key + ' ' + info_obj['jobs'][0][key]);
>>>>>>> devel-practice-mark
			}
			if(!jQuery.isEmptyObject(info_obj)) {
		      $(info_space).append('<div>jobid: ' + info_obj['jobs'][0]['jobid']+ '</div>');
		      $(info_space).append('<div>starttime: ' + info_obj['jobs'][0]['starttime']+ '</div>');
		      $(info_space).append('<div>endtime: ' + info_obj['jobs'][0]['endtime']+ '</div>');
		      $(info_space).append('<div>groupname: ' + info_obj['jobs'][0]['groupname']+ '</div>');
		      $(info_space).append('<div>hostname: ' + info_obj['jobs'][0]['hostname']+ '</div>');
		      $(info_space).append('<div>joberr: ' + info_obj['jobs'][0]['joberr']+ '</div>');
		      $(info_space).append('<div>jobname: ' + info_obj['jobs'][0]['jobname']+ '</div>');
		      $(info_space).append('<div>jobuuid: ' + info_obj['jobs'][0]['uuid']+ '</div>');
		      $(info_space).append('<div>processors: ' + info_obj['jobs'][0]['processors']+ '</div>');
		      $(info_space).append('<div>username: ' + info_obj['jobs'][0]['username']+ '</div>');
		      $(info_space).append('<div style="margin-bottom:10px">walltime: ' + info_obj['jobs'][0]['walltime']+ '</div>');
		    } 
			else {
		      $(user_info_space).append('<div>The user does not exist</div>');
		    }
		  },
		  error: function() {}
  		});
      } 
	  else {
        console.log('this is an app');
        var url = 'http://localhost:1337/appinfo/'+node.data.appid+'?jobid='+node.data.jobid;
		var queryString = '';
		
		$.ajax({
          url: url,
          global: false,
          type: 'GET',
          async: false,
          data: queryString,
          success: function(data) 
          {
            //console.log('success: ' + data);
		    //console.log(jQuery.isEmptyObject(data));
		    info_obj = data;
		    var info_space = '#app_info';
		    $(info_space).empty();
		    //$('#user_info_space').empty();
		    for(var key in info_obj['apps'][0]) {
              console.log('key: ' + key);
            }
		    if(!jQuery.isEmptyObject(info_obj)) {
		      $(info_space).append('<div>appid: ' + info_obj['apps'][0]['appid']+ '</div>');
		      $(info_space).append('<div>jobid: ' + info_obj['apps'][0]['jobid']+ '</div>');
		      $(info_space).append('<div>starttime: ' + info_obj['apps'][0]['starttime']+ '</div>');
		      $(info_space).append('<div>command: ' + info_obj['apps'][0]['command']+ '</div>');
		      $(info_space).append('<div>endtime: ' + info_obj['apps'][0]['endtime']+ '</div>');
		      $(info_space).append('<div>exitcode: ' + info_obj['apps'][0]['exitcode']+ '</div>');
		      $(info_space).append('<div>hostname: ' + info_obj['apps'][0]['hostname']+ '</div>');
		      $(info_space).append('<div>appuuid: ' + info_obj['apps'][0]['uuid']+ '</div>');
		      $(info_space).append('<div style="margin-bottom:10px">processors: ' + info_obj['apps'][0]['processors']+ '</div>');
		    } 
		    else {
		      $(user_info_space).append('<div>The user does not exist</div>');
		    }
		  },
		  error: function() 
		  {
		    console.log('error in getting user id');
		  }
		});
      } // End of else.
	}, // End of onActivate.
	onLazyRead: function(node)
	{
      console.log('lazy reading jobs tree for ' + node.data.jobid);
	  var jobid = node.data.jobid; 
	  //var url = mvcURL + "/filesinfo?path=" + node.data.path + '&uid=8038&gid=16854';
	  //getFileInfo(url);
	  console.log('http://localhost:1337' + "/appsproxy?jobid="+jobid);
	  node.appendAjax({
	    url:  'http://localhost:1337' + "/appsproxy?jobid="+jobid,
		// We don't want the next line in production code:
		debugLazyDelay: 50
      });
	},
    // The following options are only required if we have more than one tree on one page:
    //initId: "treeData",
	cookieId: "dynatree-Cb3",
	idPrefix: "dynatree-Cb3-"      
  });
}*/
