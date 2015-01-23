function getCollaboratorInfo(userNumber, searchArg) {

  var groupsArr = [];
  if(searchArg == undefined) searchArg = '';
  
  var url = 'http://'+SW.hostname+':'+SW.port+'/constellation/groupinfo/'+userNumber+'?search='+searchArg;
  
  console.log('get collaborator url: ' + url);
  
  // Grab the group info for the user with uid (number).
  $.ajax({
	  
    url: url,
    type: 'GET',
    success: function(data) {
    	//console.log('data: ' + data);
    	var json_data = JSON.parse(data);
    	for(var key in json_data) {
    		//console.log('key: ' + key + ' data: ' + json_data[key]);
    	}
    	buildCollaboratorTree(json_data);
    },
    error: function() {
      console.log('error in getting group info');
    }
    
  });
}

function getGroupInfo(uid) {
	
	var url = 'http://' + SW.hostname + ':' + SW.port + '/groupinfo/'+uid;
	var queryString = '';
	
	console.log('get groupinfo url: ' + url);
	
	var groupsArr = [];
	
	// Create the initial children.
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		async: false,
		data: queryString,
		success: function(data) {
		  groupsArr = data['groups'];
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	return groupsArr;
}





// Populates the collaborator widget given the data returned (i.e. children)
function buildCollaboratorTree(children) {

  $("#collaborators_tree").dynatree({
    
	fx: { height: "toggle", duration: 200 },
	autoFocus: false, 
	children: children,
	checkbox: true,
	selectMode: 3,         // "1:single, 2:multi, 3:multi-hier"
	onSelect: function(select, node) {
		
	  var selNodes = node.tree.getSelectedNodes();
	  if(node.data.type == 0) {       // Users
          
        SW.selected_people_names = $.map(selNodes, function(node) {
          if(node.data.type == 0)
            return node.data.title;
        });
            
        SW.selected_people_nids = $.map(selNodes, function(node) {
          if(node.data.type == 0)
            return node.data.nid;
        });
	  }
	  else if(node.data.type == 1) {       // Groups
	    SW.selected_group_names = $.map(selNodes, function(node) {
	      if(node.data.type == 1)
	        return node.data.title;
	    });
	    
	    SW.selected_group_nids = $.map(selNodes, function(node) {
	      if(node.data.type == 1)
	        return node.data.nid;
	    });	
	  }
	},
	onActivate: function(node) {
      var user_info_obj = '';
    },
    onLazyRead: function(node) {
	  //console.log('collaborators lazy read --> title: ' + node.data.title + ' gid: ' + node.data.gid);
    	console.log('node append ajax url: ' + 'http://' + SW.hostname + ':' + SW.port + '/constellation/groups/' + node.data.gid);
      node.appendAjax({
		url: 'http://' + SW.hostname + ':' + SW.port + '/constellation/groups/' + node.data.gid,
		// We don't want the next line in production code:
		debugLazyDelay: 50
      });
    }
  });
}

