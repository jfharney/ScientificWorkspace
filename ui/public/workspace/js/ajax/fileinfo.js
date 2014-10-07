function getFileInfo(uid) {

  var url = 'http://' + SW.hostname + ':' + SW.port + '/files/'+uid+ '?path=|';
  var children = [];

  //create the initial children
  $.ajax({
    url: url,
    global: false,
	type: 'GET',
	success: function(data) {
		
	  for(var i = 0; i < data.length; i++) {
		var child = {};
		child['title'] = data[i]['title'];
		child['isFolder'] = data[i]['isFolder'];
		child['isLazy'] = data[i]['isLazy'];
		child['path'] = data[i]['path'];
		child['nid'] = data[i]['nid'];
		    
		children.push(child);
	  }
		
	  buildFileTree(children);
    },
    error: function() {
      console.log('error in getting files info');
    }
  });
  
}

function buildFileTree(treeData) {
  
  $("#files_tree").dynatree({
    checkbox: true,
	selectMode: 2,			// "1:single, 2:multi, 3:multi-hier"
	children: treeData,
	onSelect: function(select, node) {
	  //console.log(node.tree.getSelectedNodes());
	  var selNodes = node.tree.getSelectedNodes();

      SW.selected_file_paths = $.map(selNodes, function(node) {
        var str = node.data.title;
        str = str.replace(/\|/g, '/');
        return str;
      });
      
      SW.selected_file_nids = $.map(selNodes, function(node) {
        return node.data.nid;
      });
    },
    onClick: function(node, event) {},
	onKeydown: function(node, event) {
	  if( event.which == 32 ) {
	    node.toggleSelect();
	    return false;
	  }
    },
	onLazyRead: function(node) {
			
      var url = 'http://' + SW.hostname + ':' + SW.port + '/files/'+SW.current_user_number;
      url = url + '?path=' + node.data.path;
		     
      node.appendAjax({
        url: url,
        // We don't want the next line in production code:
        debugLazyDelay: 50
      });
    },
	/* The following options are only required, if we have more than one tree on one page: */ 
    cookieId: "dynatree-Cb2",
    idPrefix: "dynatree-Cb2-"
	
  });
}


function getFileInfo2(uid) {

  //console.log('in getFileInfo2 for uid: ' + uid);
	
  var url = 'http://' + SW.hostname + ':' + SW.port + '/groupinfo/'+uid;
  var queryString = '';
  var groupsArr = '';
  var children = [];

	//create the initial children
	
	//----  This section needs to change with the new API ----//
	//First get the group info 
	//Second get the ...
	
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		//async: false,
		data: queryString,
		success: function(data) {
			//console.log('success');
			
			groupsArr = data['groups'];
			//console.log('groupsArr: ' + groupsArr);
			
			for(var i=0;i<groupsArr.length;i++) {
				var title = 'widow1|proj|' + groupsArr[i]['groupname'];
				var path = 'widow1|proj|' + groupsArr[i]['groupname'];
				var child = {title: title, isFolder: true, isLazy: true, path: path };
				children.push(child);
			}
			
			if(groupsArr.length == 0) {
				$("#files_tree").append('<div>This user does not belong to any groups');
			} else {
				buildFileTree();
			}
			
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	
}




function getFileInfo3(uid) {
	
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
		    	  
			    	 
		    	  
		    	  
		          node.appendAjax({
		          	  //url:  'http://localhost:1337' + "/files?path=" + node.data.path + '&uid=' + uid + '&gid=16854',//widow1|proj|lgt006&uid=8038&gid=16854",
			          url: 'http://' + SW.hostname + ':' + SW.port + "/files?path=" + node.data.path + '&uid=' + uid + '&gid=16854',//widow1|proj|lgt006&uid=8038&gid=16854",	
		        	  
		        	  // We don't want the next line in production code:
		          	  debugLazyDelay: 50
		          });
		    	  
		      }
		      
		    });
	}
	
	
	
		
}