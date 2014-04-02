$(function(){
	
	
	//for creating the dropdown list
	appendUserList();
	
	
	//get user info first (synchronous call needed by everyone else)
	var docurl = document.URL;
	
	var user = getUserFromURL(docurl);
	
	var user_info_obj = '';
	
	//alert('user: ' + user);
	
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
			
			//alert('data: ' + data);
			
			user_info_obj = data;
			for(var key in data) {
				//alert('key: ' + key + " " + data[key]);
				console.log('user key: ' + key);
			}
			
			var user_info_space = '#user_info';
			
			$(user_info_space).empty();
			//$('#user_info_space').empty();
			
			if(!jQuery.isEmptyObject(user_info_obj)) {
				
				
				$(user_info_space).append('<div>username: ' + data['username']+ '</div>');
				$(user_info_space).append('<div>uid: <span id="user_info_id">' + data['uid']+ '</span></div>');
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
	//getFileInfo(user_info_obj['uid']);
	
	//get the jobs info here
	getJobInfo(user_info_obj['username']);
	
});




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
	
	//alert('uid: ' + uid);
	
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