
function getFileInfo(uid,type) {
	if(type == '1') {
		getFileInfo1(uid,'1');
	} else if(type == '2') {
		getFileInfo2(uid,'2');
	} else {
		getFileInfo3(uid);
	}
}




function getFileInfo1(uid,type) {

	console.log('in getFileInfo1 for uid: ' + uid);
	
	
	
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
			console.log('groupsArr: ' + groupsArr);
			
			type = '2';
			
			
			for(var i=0;i<groupsArr.length;i++) {
				var title = 'widow1|proj|' + groupsArr[i]['groupname'];
				var path = 'widow1|proj|' + groupsArr[i]['groupname'];
				var child = {title: title, isFolder: true, isLazy: true, path: path };
				children.push(child);
			}
			
			if(groupsArr.length == 0) {
				$("#files_tree").append('<div>This user does not belong to any groups');
			} else {
				buildFileTree(type);
			}
			
			
			
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	
}


function getFileInfo2(uid) {

	console.log('in getFileInfo2 for uid: ' + uid);
	
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
			console.log('groupsArr: ' + groupsArr);
			
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








function buildFileTree(type) {

	var treeData = treeData1;
	if(type == 1) {
		treeData = treeData1
	} else if(type == 2) {
		treeData = treeData2;
	} else {
		treeData = treeData3; 
	}
	
	//for (var key in treeData[0]['children'][0]) {
	//	console.log('key: ' + key + ' value: ' + treeData[0]['children'][0][key]);
	//}
	
	treeData[0]['title'] = treeData[0]['title'] + '|8xo';
	
	
	$("#files_tree").dynatree({
		
		
		checkbox: true,
	      selectMode: 2,
	      children: treeData,
	      
	      onSelect: function(select, node) {
	    	  console.log('selected...');
	        // Display list of selected nodes
	        var selNodes = node.tree.getSelectedNodes();
	        // convert to title/key array
	        var selKeys = $.map(selNodes, function(node){
	        	
	        	
	        	  console.log('keys---> node.data: ' + node.data);
	        	  for(var key in node.data) {
	        		//  console.log('key : ' + key + ' node.data: ' + node.data[key]);
	        	  }
	             //return "[" + node.data.key + "]: '" + node.data.title + "'";

	        	  return node.data.key;
	        });
	        
	        var selUuids = $.map(selNodes, function(node){
	        	
	        	  return node.data.uuid + "";
	        });
	        var selTypes = $.map(selNodes, function(node){
	               //return "[" + node.data.uuid + "]: '" + node.data.title + "'";
	        	  return node.data.type + "";
	        });
	          
	        
	        SW.selected_file_items = selUuids.join(", ");
	        SW.selected_file_types = selTypes.join(", ");
	        SW.selected_file_keys = selKeys.join(", ");

	        console.log('selected_file_items: ' + SW.selected_file_items);
	        console.log('selected_file_types: ' + SW.selected_file_types);
	        console.log('selected_file_keys: ' + SW.selected_file_keys);

            $('#files_to_tag').empty();
            $('#files_to_tag').append('<div>' + SW.selected_file_items + '</div>');
            
	        $('#resources_to_doi').empty();
	        $('#resources_to_doi').append('<div>' + SW.selected_file_items + '</div>');
	        $('#resources_types_to_doi').empty();
	        $('#resources_types_to_doi').append('<div>' + SW.selected_file_types + '</div>');
	      },
	      onClick: function(node, event) {
	        // We should not toggle, if target was "checkbox", because this
	        // would result in double-toggle (i.e. no toggle)
	    	 // console.log('clicked...');
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

	    	  
	    	  //must change - start with the prefix
	    	  if(node.data.path == undefined) {
	    		  node.data.path = SW.fileScratchPrefix;
	    		  
	    		  
	    		  node.data.title = '|' + '8xo';//current user
	    	  }

	    	  console.log('node.data.title--->' + node.data.title);
	    	  console.log('node.data.path--->' + node.data.path);
	    	  
	    	  var url = 'http://' + SW.hostname + ':' + SW.port + '/files1?path=' + (node.data.path + node.data.title);
		    	 
	    	  //alert(url);
	    	  console.log('url->'+url);
	          node.appendAjax({
	        	  url: url,
	        	  // We don't want the next line in production code:
	          	  debugLazyDelay: 50
	          });
	          
	    	  
	      },
	      // The following options are only required, if we have more than one tree on one page:
	      cookieId: "dynatree-Cb2",
	      idPrefix: "dynatree-Cb2-"
		
		
	    });
	
	
}


