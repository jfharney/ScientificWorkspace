// Note that the following is an alternative syntax for the document ready event. 
// That is, for $(document).ready(function(){...})
$(function()
{
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
    success: function(data) 
    {
      console.log(data);
      console.log(jQuery.isEmptyObject(data));
			
      user_info_obj = data;
      for(var key in data) {
        console.log('user key: ' + key);
      }
			
      var user_info_space = '#user_info';
      $(user_info_space).empty();
			
      if(!jQuery.isEmptyObject(user_info_obj)) {
		$(user_info_space).append('<div>username: ' + data['username']+ '</div>');
		$(user_info_space).append('<div>uid: <span id="user_info_id">' + data['uid']+ '</span></div>');
		$(user_info_space).append('<div>email: ' + data['email']+ '</div>');
		$(user_info_space).append('<div>firstname: ' + data['firstname']+ '</div>');
		$(user_info_space).append('<div>middlename: ' + data['middlename']+ '</div>');
		$(user_info_space).append('<div style="margin-bottom:10px">lastname: ' + data['lastname']+ '</div>');
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
	
  // Get the groups/collaborators here.
  //getCollaboratorInfo(user_info_obj['uid']);
	
  // Get the file info here.
  //getFileInfo(user_info_obj['uid']);
  getFileInfo1(user_info_obj['uid']);
	
  // Get the jobs info here.
  // This function is defined in jobs_widget.js. 
  getJobInfo(user_info_obj['username']);
  
  // I don't really know where the best place to do this is.
  // Attach the following event to the search button click.
  $("#jobSearchIcon").on("click", function()
  {
	$("#jobSearchFields").slideToggle();
  });
  
  $("#jobsRefreshButton").on("click", function()
  {
	getJobInfo(user_info_obj['username'], $('#jobsSearchText').val());
	$("#jobss_tree").dynatree("getTree").reload();
	$("#jobSearchFields").slideToggle();
  });
  
  // Clicking the Clear button should: 
  // 1. Clear the text out of the search box.
  // 2. Restore the jobs tree to its default state.
  $("#clearJobsSearchButton").on("click", function()
  {
    console.log("Clicking the clear button.");
	$("#jobsSearchText").val('');
	getJobInfo(user_info_obj['username'], $('#jobsSearchText').val());
	$("#jobss_tree").dynatree("getTree").reload();
	$("#jobSearchFields").slideToggle();
  });
});

function getFileInfo1(uid) {

	var groupsArr = getGroupInfo(uid);
	
	var children = [];
	
	console.log('in grouspArr1: ' + groupsArr);
	
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
			
			
			checkbox: true,
		      selectMode: 2,
		      children: treeData1,
		      
		      onSelect: function(select, node) {
		    	  console.log('selected...');
		        // Display list of selected nodes
		        var selNodes = node.tree.getSelectedNodes();
		        // convert to title/key array
		        var selKeys = $.map(selNodes, function(node){
		        	  console.log('keys---> node.data: ' + node.data);
		        	  for(var key in node.data) {
		        		  console.log('key : ' + key + ' node.data: ' + node.data[key]);
		        	  }
		             //return "[" + node.data.key + "]: '" + node.data.title + "'";
		        	  return node.data.key;
		        });
		        
		        var selUuids = $.map(selNodes, function(node){
		        	
		        	console.log('uuids---> node.data: ' + node.data);
		        	  for(var key in node.data) {
		        		  console.log('key : ' + key + ' node.data: ' + node.data[key]);
		        	  }
		        	  
		        	  console.log('node.data: ' + node.data);
		               //return "[" + node.data.uuid + "]: '" + node.data.title + "'";
		        	  return node.data.uuid + "";
		        });
		        var selTypes = $.map(selNodes, function(node){
		               //return "[" + node.data.uuid + "]: '" + node.data.title + "'";
		        	  return node.data.type + "";
		        });
		          
		        
		        SW.selected_file_items = selUuids.join(", ");
		        SW.selected_file_types = selTypes.join(", ");
		        SW.selected_file_keys = selKeys.join(", ");

		        for (var key in selNodes[0]) {
		        	//console.log('key: ' + key + ' value: ' + selNodes[0][key]);
		        }
		        console.log('node: ' + selNodes[0]['node']);
		        
		        console.log('SW.file items: ' + SW.selected_file_items);
		        console.log('SW.file types: ' + SW.selected_file_types);
		        console.log('SW.file keys: ' + SW.selected_file_keys);
		          
		        //$("#echoSelection2").text(selKeys.join(", "));
		        
		      //alert('SW.tagged_items: ' + SW.tagged_items);
		        $('#resources_to_doi').empty();
		        $('#resources_to_doi').append('<div>' + SW.selected_file_items + '</div>')
		        $('#resources_types_to_doi').empty();
		        $('#resources_types_to_doi').append('<div>' + SW.selected_file_types + '</div>')
		      },
		      onClick: function(node, event) {
		        // We should not toggle, if target was "checkbox", because this
		        // would result in double-toggle (i.e. no toggle)
		    	  console.log('clicked...');
		        if( node.getEventTargetType(event) == "title" )
		          node.toggleSelect();
		      },
		      
		      onKeydown: function(node, event) {
		        if( event.which == 32 ) {
		          node.toggleSelect();
		          return false;
		        }
		      },
		      onLazyRead: function(node){

		    	  console.log('lazy reading files tree for ' + node.data.path);
		    	  
			    	 
		    	  //var url = mvcURL + "/filesinfo?path=" + node.data.path + '&uid=8038&gid=16854';
		    	  
		    	  //getFileInfo(url);
		    	  
		    	  
		          node.appendAjax({
		          	//url:  'http://localhost:1337' + "/files?path=" + node.data.path + '&uid=8038&gid=16854',//widow1|proj|lgt006&uid=8038&gid=16854",
		        	  //url:  'http://localhost:1337' + "/files?path=" + node.data.path + '&uid=' + uid + '&gid=16854',//widow1|proj|lgt006&uid=8038&gid=16854",
			          url: 'http://localhost:1337' + '/files1',
		        	  
		        	  // We don't want the next line in production code:
		          	  debugLazyDelay: 50
		          });
		    	  
		      },
		      // The following options are only required, if we have more than one tree on one page:
		      cookieId: "dynatree-Cb2",
		      idPrefix: "dynatree-Cb2-"
			
			
			
			
			
			
			/*
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
		  */    
		    });
	}
	
	
	
	
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