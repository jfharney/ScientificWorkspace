$(function(){
	
	
	//for creating the dropdown list
	appendUserList();
	
	
	//get user info first (synchronous call needed by everyone else)
	var docurl = document.URL;
	
	var user = getUserFromURL(docurl);
	
	var user_info_obj = '';
	
	var url = 'http://localhost:1337/userinfo/'+user;
	var queryString = '';
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		async: false,
		data: queryString,
		success: function(data) {
			
			console.log(data);
			
			console.log(jQuery.isEmptyObject(data));
			
			user_info_obj = data;
			for(var key in data) {
				console.log('user key: ' + key);
			}
			
			var user_info_space = '#user_info';
			
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
				
			}
			
			
			
			
			
			
		},
		error: function() {
			console.log('error in getting user id');
		}
	});
	
	
	
	//get the groups/collaborators here
	getCollaboratorInfo(user_info_obj['uid']);
	
	
	//get the file info here
	getFileInfo(user_info_obj['uid']);
	
	//get the jobs info here
	getJobInfo(user_info_obj['username']);
	
});


function getJobInfo(username) {
	
	
	console.log('getting job infor for username...' + username);
	
	var jobsArr = [];
	
	var queryString = '';
	var url = 'http://localhost:1337/jobsproxy/'+username;
	
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
			console.log('success');
//			groupsArr = data['groups'];
			//jobsArr = data['jobs'];
			
			for(var i=0;i<data.length;i++) {
				for (var key in data[i]) {
					//console.log('key: ' + key + ' data: ' + data[i][key]);
					
				}
				children.push(data[i]);
				console.log('pushing data-> ' + i);
			}
			
			
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	
	
	
	console.log('children: ' + children);
	
	
	
	$("#jobss_tree").dynatree({
		title: "Lazy loading sample",
	      fx: { height: "toggle", duration: 200 },
	      autoFocus: false, 
	      children: children,
	      onActivate: function(node) {
	        //$("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
	    	  
	      },

	      onActivate: function(node) {
		        //$("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
		    	  console.log('you activated ' + node.data.title);
		    	  for(var key in node.data) {
		    		  //console.log('key: ' + key);
		    	  }
		    	  var info_obj = '';
		    		
		    	  if(node.data.type == 'jobs') {
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
			    				
			    				if(!jQuery.isEmptyObject(info_obj)) {
		    						$(info_space).append('<div>jobid: ' + info_obj['jobs'][0]['jobid']+ '</div>');
		    						$(info_space).append('<div>starttime: ' + info_obj['jobs'][0]['starttime']+ '</div>');
		    						$(info_space).append('<div>endtime: ' + info_obj['jobs'][0]['endtime']+ '</div>');
		    						$(info_space).append('<div>groupname: ' + info_obj['jobs'][0]['groupname']+ '</div>');
		    						$(info_space).append('<div>hostname: ' + info_obj['jobs'][0]['hostname']+ '</div>');
		    						$(info_space).append('<div>joberr: ' + info_obj['jobs'][0]['joberr']+ '</div>');
		    						$(info_space).append('<div>jobname: ' + info_obj['jobs'][0]['jobname']+ '</div>');
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
	    						
	    					}
	    					
	    					
	    					
	    					
	    					
	    					
	    				},
	    				error: function() {
	    					console.log('error in getting user id');
	    				}
	    			});
		    		
		    	  */
		    	  
		      },
	      onLazyRead: function(node){

	    	  console.log('lazy reading jobs tree for ' + node.data.jobid);
	    	  
		      var jobid = node.data.jobid; 
	    	  
	    	  //var url = mvcURL + "/filesinfo?path=" + node.data.path + '&uid=8038&gid=16854';
	    	  
	    	  //getFileInfo(url);
	    	  
		      console.log('http://localhost:1337' + "/apps?jobid="+jobid);
		      
	    	  node.appendAjax({
		          
		        	url:  'http://localhost:1337' + "/apps?jobid="+jobid, //widow1|proj|lgt006&uid=8038&gid=16854",
		          
		          
		          	// We don't want the next line in production code:
		          	debugLazyDelay: 50
		        });
	    	  
	    	  
	      }
	      
	});
	
	
	
	
	
	
}


function getFileInfo(uid) {
	
	//groupinfo
	
	var groupsArr = getGroupInfo(uid);
	
	var children = [];
	
	console.log('in grouspArr: ' + groupsArr);
	
	for(var i=0;i<groupsArr.length;i++) {
		var title = 'widow1|proj|' + groupsArr[i]['groupname'];
		var path = 'widow1|proj|' + groupsArr[i]['groupname'];
		var child = {title: title, isFolder: true, isLazy: true, path: path };
		children.push(child);
	}
	
	
	if(groupsArr.length == 0) {
		$("#files_tree").append('<div>This user does not belong to any groups');
	} else {
		//var respText = '[{"title": "widow1|proj|lgt006", "isFolder": true, "isLazy": true	, "path" : "widow1|proj|lgt006" } ]';
		$("#files_tree").dynatree({
			title: "Lazy loading sample",
		      fx: { height: "toggle", duration: 200 },
		      autoFocus: false, 
		      children: children,
		      onActivate: function(node) {
		        $("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
		      },

		      onLazyRead: function(node){

		    	  console.log('lazy reading files tree for ' + node.data.path);
		    	  
			    	 
		    	  //var url = mvcURL + "/filesinfo?path=" + node.data.path + '&uid=8038&gid=16854';
		    	  
		    	  //getFileInfo(url);
		    	  
		    	  
		          node.appendAjax({
		          	//url:  'http://localhost:1337' + "/files?path=" + node.data.path + '&uid=8038&gid=16854',//widow1|proj|lgt006&uid=8038&gid=16854",
		        	  url:  'http://localhost:1337' + "/files?path=" + node.data.path + '&uid=' + uid + '&gid=16854',//widow1|proj|lgt006&uid=8038&gid=16854",
			          	
		        	  
		        	  // We don't want the next line in production code:
		          	debugLazyDelay: 50
		          });
		    	  
		      }
		      
		    });
	}
	
	
	
		
}


function getGroupInfo(uid) {
	
	//groupinfo
	var url = 'http://localhost:1337/groupinfo/'+uid;
	var queryString = '';
	
	var groupsArr = '';
	
	//create the initial children
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		async: false,
		data: queryString,
		success: function(data) {
			console.log('success');
			groupsArr = data['groups'];
			
			
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	console.log('groups arr: ' + groupsArr);
	
	return groupsArr;
	
}




//collaborators window
function getCollaboratorInfo(uid) {
	
	
	//groupinfo
	var url = 'http://localhost:1337/groupinfo/'+uid;
	var queryString = '';
	
	var groupsArr = '';
	
	//grab the groupinfo for the user with uid
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		async: false,
		data: queryString,
		success: function(data) {
			console.log('success');
			groupsArr = data['groups'];
			
			
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	console.log('groups arr: ' + groupsArr);
	
	
	//create the initial children for the tree
	var children = [];
	
	for(var i=0;i<groupsArr.length;i++) {
		var child = {title : groupsArr[i]['groupname'], isFolder: true, isLazy: true, id: groupsArr[i]['gid']};

		children.push(child);
	}
	
	
	if(children.length == 0) {
		console.log('no groups');
		$("#collaborators_tree").append('<div>This user does not currently belong to a group</div>');
	} else {
	
		//create the tree with the following lazy implementation:
		//- 
		//- 
		$("#collaborators_tree").dynatree({
		      title: "Lazy loading sample",
		      fx: { height: "toggle", duration: 200 },
		      autoFocus: false, 
		      children: children,
		      onActivate: function(node) {
		        //$("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
		    	  console.log('you activated ' + node.data.username);
		    	  
		    	  var user_info_obj = '';
		    		
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
	    						
	    					}
	    					
	    					
	    					
	    					
	    					
	    					
	    				},
	    				error: function() {
	    					console.log('error in getting user id');
	    				}
	    			});
		    		
		    	  
		      },

		      onLazyRead: function(node){
		    	 console.log('collaborators lazy read --> title: ' + node.data.title + ' id: ' + node.data.id);
		    	 
		    	 node.appendAjax({
			          	  url: 'http://localhost:1337/groups/' + node.data.id,	
			        	  
			        	  // We don't want the next line in production code:
			          	debugLazyDelay: 50
			          });
			    	 
		      }
		    });
	}
	
	
	
	
}

function getUserFromURL(docurl) {
	
	
	//reverse
	var theChar = '';
	var revuser = '';
	var j = docurl.length-1;
	while(theChar != '/') {
		
		revuser += theChar;
		theChar = docurl[j];
		j--;
	}
	console.log('user: ' + revuser);
	
	var user = '';
	for(var i=revuser.length-1;i>=0;i--) {
		
		user += revuser[i];
	}

	console.log('user: ' + user);
	
	return user;
	
}

function appendUserList() {
	
	/*
	var userlist = '';
	var url = 'http://localhost:1337/userlist';
	var queryString = '';
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		data: queryString,
		success: function(data) {
			//alert('success in getting userlist');
			
			//
			//console.log(data['users'].length);
			//for(var i=0;i<data['users'].length;i++) {
			//	var username = data['users'][i]['username'];
			//	if(username.length < 4 && username.charCodeAt(0) < 100) {
			//		console.log('username: ' + username + ' ' + username.charCodeAt(0));
			//		//$('ul.dropdown-menu').append('<li role="presentation"><a class="user_dropdown_list" role="menuitem" tabindex="-1" href="#" id="' + username + '">' + username + '</li>');
					
			//	}
				
			//}
			//
		},
		error: function() {
			alert('error');
		}
	});
	*/
	
	
}