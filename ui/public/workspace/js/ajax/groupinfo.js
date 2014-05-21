
//collaborators info
function getCollaboratorInfo(uid) {
	
	var queryString = '';
	
	var groupsArr = '';
	
	var url = 'http://' + SW.hostname + ':' + SW.port + '/groupinfo/'+uid;
	
	//console.log('collaborators info url : ' + url);
	//grab the groupinfo for the user with uid
	$.ajax({
		url: url,
		type: 'GET',
		//async: false,
		data: queryString,
		success: function(data) {
			//console.log('success');
			
			console.log('collaborators info: ' + data);
			groupsArr = data['groups'];
			

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
			
				buildCollaboratorTree(children);
				
				
			}
			
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	
	
	
	
}



function getGroupInfo(uid) {
	
	alert('in get group info for uid: ' + uid);
	
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
			//console.log('success');
			//alert('data: ' + data);
			//for(var key in data) {
			//	alert('key: ' + key + ' value: ' + data[key]);
			//}
			
			groupsArr = data['groups'];
			
			
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	//console.log('in getgroupinfo for groups arr: ' + groupsArr);
	
	return groupsArr;
	
}





//Populates the collaborator widget given the data returned (i.e. children)
function buildCollaboratorTree(children) {

	$("#collaborators_tree").dynatree({
	      title: "Lazy loading sample",
	      fx: { height: "toggle", duration: 200 },
	      autoFocus: false, 
	      children: children,
	      onActivate: function(node) {
	    	  //$("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
	    	  //console.log('you activated ' + node.data.username);
	    	  
	    	  var user_info_obj = '';
	    		
	    	  var url = 'http://localhost:1337/userinfo/'+node.data.username;
	    	  var queryString = '';
	    	  
	    	  $.ajax({
	    			url: url,
	    			type: 'GET',
	    			data: queryString,
	    			success: function(data) {
    					
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

