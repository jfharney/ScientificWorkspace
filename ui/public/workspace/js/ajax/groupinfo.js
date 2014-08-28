function getCollaboratorInfo(userNumber, searchArg) {
  var groupsArr = [];
  if(searchArg == undefined) searchArg = '';
  
  var url = 'http://'+SW.hostname+':'+SW.port+'/groupinfo/'+userNumber+'?search='+searchArg;
  
  console.log('get Collaborator Info: ' + url);
  
  // Grab the group info for the user with uid (number).
  $.ajax({
	  
    url: url,
    type: 'GET',
    success: function(data) {
      groupsArr = data;
      console.log('Here is groupsArr:');

      var children = data;
      buildCollaboratorTree(children);
    },
    error: function() {
      console.log('error in getting group info');
    }
    
  });
}

function getGroupInfo(uid) {
	
	alert('in get group info for uid: ' + uid);
	
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

  $("#collaborators_tree").dynatree({
    
	fx: { height: "toggle", duration: 200 },
	autoFocus: false, 
	children: children,
	checkbox: true,
	selectMode: 3,
	onSelect: function(select, node) {
		
		if(node.data.type == 0) {
          //console.log(node.tree.getSelectedNodes());
          var selNodes = node.tree.getSelectedNodes();
            
          SW.selected_people_nids = $.map(selNodes, function(node) {
            return node.data.nid;
          });  
            
          SW.selected_people_names = $.map(selNodes, function(node) {
            if(node.data.type == 0)
              return node.data.title;
          });       

          //console.log('SW.selected_people_nids: '+SW.selected_people_nids);
          //console.log('SW.selected_people_names: '+SW.selected_people_names);
		}
		else {
	      //console.log(node.tree.getSelectedNodes());
	      var selNodes = node.tree.getSelectedNodes();
	        
	      SW.selected_group_nids = $.map(selNodes, function(node) {
	        return node.data.nid;
	      });  
	        
	      SW.selected_group_names = $.map(selNodes, function(node) {
	        console.log('node.data.type is '+node.data.type);
	        if(node.data.type == 1)
	          return node.data.title;
	      });       

	      console.log('SW.selected_group_nids: '+SW.selected_group_nids);
	      console.log('SW.selected_group_names: '+SW.selected_group_names);
		}
	},
	onActivate: function(node) {
      var user_info_obj = '';
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

