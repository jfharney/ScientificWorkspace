function getCollaboratorInfo(userNumber, searchArg) {
  var groupsArr = [];
  if(searchArg == undefined) searchArg = '';
  
  var url = 'http://'+SW.hostname+':'+SW.port+'/groupinfo/'+userNumber+'?search='+searchArg;
  //console.log('We are inside getCollaboratorInfo().');
  
  console.log('get Collaborator Info: ' + url);
  
  // Grab the group info for the user with uid (number).
  $.ajax({
	  
    url: url,
    type: 'GET',
    success: function(data) {
      groupsArr = data;
//<<<<<<< HEAD
      console.log('Here is groupsArr:');

      var children = data;
      buildCollaboratorTree(children);
      
      /*
      nid: 54608 
      gid: 2184 
      gname: cli017
      type: 1 
=======
      //console.log('Here is groupsArr:');
>>>>>>> cc6f0385beb04a5b5456d114d3704358bc577a73
      for(var i = 0; i < groupsArr.length; i++)
    	for(var j in groupsArr[i])
      //	  console.log(j + ': ' + groupsArr[i][j]);
			
	  */
      
      
      // Create the initial children for the tree.
      /*
      var children = [];
      for(var i = 0; i < groupsArr.length; i++) {
        var child = {	
        				title : groupsArr[i]['gname'], 
                     	isFolder : true, 
                     	isLazy : true, 
                     	id : groupsArr[i]['gid']
        			};
        children.push(child);
      }
      */
    },
    error: function() {
      console.log('error in getting group info');
    }
    
  });
}

function getGroupInfo(uid) {
	
	alert('in get group info for uid: ' + uid);
	
	//groupinfo
	var url = 'http://' + SW.hostname + ':' + SW.port + '/groupinfo/'+uid;
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





// Populates the collaborator widget given the data returned (i.e. children)
function buildCollaboratorTree(children) {
	
  /*console.log('Inside buildCollaboratorTree, here is the children array:');
  for(var i = 0; i < children.length; i++)
	for(var j in children[i])
	  console.log(j + ': ' + children[i][j]);*/

  $("#collaborators_tree").dynatree({
    //title: "Lazy loading sample",
    
	fx: { height: "toggle", duration: 200 },
	autoFocus: false, 
	children: children,
	checkbox: true,
	selectMode: 3,
	onSelect: function(select, node) {
		console.log('selection made for ' + node.data.title);
		
		if(node.data.type == 0) {
			console.log('This is a user');
			
			SW.selected_user_titles = [];
			SW.selected_user_nids = [];
			
			var selNodes = node.tree.getSelectedNodes();
			  
			var selTitles = $.map(selNodes, function(node) {
				  return node.data.title;
			});

			var selNids = $.map(selNodes, function(node) {
				return node.data.nid;
			});
			  
			
			console.log('<><><>><>In groupinfo.js user select nids<><><><><>');
			var nid_arr = new Array();
			for(var i=0;i<selNids.length;i++) {
			  console.log('i: ' + i + ' ' + selNids[i] + ' ');
			  nid_arr.push(selNids[i]);
			}
			//console.log('---------->lengtj: ' + selNids.length);
		  
			//SW.selected_file_nids = selNids.join(", ");
			SW.selected_user_nids = selNids;
			
			SW.selected_user_titles.push(selTitles.join(", "));
			console.log('selected_job_titles: ' + SW.selected_user_titles);
			
			
		} else {
			console.log('This is a group');
		

			SW.selected_group_titles = [];
			SW.selected_group_nids = [];
			var selNodes = node.tree.getSelectedNodes();
			  
			var selTitles = $.map(selNodes, function(node) {
				  return node.data.title;
			});
			
			var selNids = $.map(selNodes, function(node) {
				return node.data.nid;
			});
			  
			
			console.log('<><><>><>In groupinfo.js select nids<><><><><>');
			var nid_arr = new Array();
			for(var i=0;i<selNids.length;i++) {
			  console.log('i: ' + i + ' ' + selNids[i] + ' ');
			  nid_arr.push(selNids[i]);
			}
			//console.log('---------->lengtj: ' + selNids.length);
		  
			//SW.selected_file_nids = selNids.join(", ");
			SW.selected_group_nids = selNids;
			
			
			
			SW.selected_group_titles.push(selTitles.join(", "));
			console.log('selected_job_titles: ' + SW.selected_group_titles);
			
			
			
			
			
		}
		/*
		SW.selected_job_titles = [];
		// Display list of selected nodes
		var selNodes = node.tree.getSelectedNodes();
		  
		var selTitles = $.map(selNodes, function(node) {
			  return node.data.title;
		});
		SW.selected_job_titles.push(selTitles.join(", "));
		console.log('selected_job_titles: ' + SW.selected_job_titles);
		*/
	},
	onActivate: function(node) {
    	  console.log("Here is the node.data object: ");
    	    for(var j in node)
    	      console.log(j + ': ' + node.data[j]);
      var user_info_obj = '';
      
      
	  var url = 'http://' + SW.hostname + ':' + SW.port + '/userinfo/'+node.data.username;
	  var queryString = '';
	  console.log('onActivate is called.');
	    	  
	  $.ajax({
	    url: url,
	    type: 'GET',
	    data: queryString,
        success: function(data) {
    	  user_info_obj = data;
    	  var user_info_space = '#collaborator_info';
    	  $(user_info_space).empty();
    					
          if(!jQuery.isEmptyObject(user_info_obj)) {
  		    $(user_info_space).append('<div>username: ' + data['username']+ '</div>');
            $(user_info_space).append('<div>uid: ' + data['uid']+ '</div>');
            $(user_info_space).append('<div>email: ' + data['email']+ '</div>');
            $(user_info_space).append('<div>firstname: ' + data['firstname']+ '</div>');
            $(user_info_space).append('<div>middlename: ' + data['middlename']+ '</div>');
            $(user_info_space).append('<div style="margin-bottom:10px">lastname: ' + data['lastname']+ '</div>');
          } 
          else {
    	    $(user_info_space).append('<div>The user does not exist</div>');
          }
        },
        error: function() {
    	  console.log('error in getting user id');
        }
      });
    },
    onLazyRead: function(node) {
	  console.log('collaborators lazy read --> title: ' + node.data.title + ' id: ' + node.data.id);
      node.appendAjax({
		url: 'http://' + SW.hostname + ':' + SW.port + '/groups/' + node.data.id,
		// We don't want the next line in production code:
		debugLazyDelay: 50
      });
    }
  });
}

