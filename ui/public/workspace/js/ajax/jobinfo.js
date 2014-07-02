function getJobInfo(userNum, searchArg) {
	
  var jobsArr = [];
  if(searchArg == undefined) searchArg = '';
  
  var url = 'http://' + SW.hostname + ':' + SW.port + '/jobsproxy/'+userNum+'?search='+searchArg;
  
  console.log('jobinfo.js: Making a call to ' + url);
  
  var children = [];

  /* Create the initial children. */
  $.ajax({
    url: url,
    global: false,
    type: 'GET',
	async: false,
	success: function(data) 
	{
	  console.log('Here is the data object/array:');
      for(var i = 0; i < data.length; i++) {
    	console.log(data[i]);
        children.push(data[i]);
      }
	  buildJobsTree(children);			/* This function is defined below. */ 
    },
    error: function() { console.log('error in getting job info'); }
  });
}

function getAppInfo(url) {

  var queryString = '';
  
  console.log('In jobinfo.js, getAppInfo() has been passed the url ' + url);
  
  $.ajax({
    url: url,
    type: 'GET',
    data: queryString,
    success: function(data) {
      console.log(jQuery.isEmptyObject(data));
      console.log('Here is info_obj:');
      info_obj = data;
      for(var i in info_obj)
    	console.log(i + ': ' + info_obj[i]);
      var info_space = '#app_info';
      $(info_space).empty();
      if(!jQuery.isEmptyObject(info_obj)) {
        $(info_space).append('<div>App ID: ' + info_obj['aid']+ '</div>');
        $(info_space).append('<div>Job ID: ' + info_obj['job']+ '</div>');
        $(info_space).append('<div>Start: ' + info_obj['start']+ '</div>');
        $(info_space).append('<div>Command: ' + info_obj['cmd']+ '</div>');
        $(info_space).append('<div>End: ' + info_obj['stop']+ '</div>');
        $(info_space).append('<div>exitcode: ' + info_obj['err']+ '</div>');
        $(info_space).append('<div>Host: ' + info_obj['host']+ '</div>');
        $(info_space).append('<div>NID: ' + info_obj['nid']+ '</div>');
      } 
      else {
        $(user_info_space).append('<div>The user does not exist</div>');
      }
    },
    error: function() {
      console.log('error in getting user id');
    }
  });
}

function buildJobsTree(children) {
  $("#jobs_tree").dynatree({
	title: "Lazy loading sample",
	fx: { height: "toggle", duration: 200 },
	autoFocus: false, 
	children: children,
	checkbox: true,
	selectMode: 3,
	onSelect: function(select, node) {
		
		/* 7-1
      var selNodes = node.tree.getSelectedNodes();

	  var selUuids = $.map(selNodes, function(node) {
        return node.data.uuid + "";
	  });
	  var selTypes = $.map(selNodes, function(node) {
	    return node.data.type + "";
	  });
	          
	  var selRootNodes = node.tree.getSelectedNodes(true);

	  SW.tagged_items = selUuids.join(", ");
	  SW.tagged_types = selTypes.join(", ");
      SW.selected_resource_items = selUuids.join(", ");
      SW.selected_resource_types = selTypes.join(", ");
      SW.selected_resource_keys = selUuids.join(", ");

      //console.log('selected_resource_items: ' + SW.selected_resource_items);
      //console.log('selected_resource_types: ' + SW.selected_resource_types);
      //console.log('selected_resource_keys: ' + SW.selected_resource_keys);
		        
	  $("#echoSelectionUuids3").text(selUuids.join(", "));
	  $("#echoSelectionTypes3").text(selTypes.join(", "));
	          
      $('#resources_to_tag').empty();
      $('#resources_to_tag').append('<div>' + SW.selected_resource_items + '</div>')
      $('#resources_types_to_tag').empty();
      $('#resources_types_to_tag').append('<div>' + SW.selected_resource_types + '</div>')
      */
	},
	onActivate: function(node) {
	  var info_obj = '';
	  console.log('node type: ' + node.data.type);    		
	  if(node.data.type == 2) {
		console.log('this is a job');
		/*
		for(var i in node.data)
		  console.log(i + ': ' + node.data[i]);
		    		  
		var url = 'http://' + SW.hostname + ':' + SW.port + '/jobinfo/' + node.data.jobid;
		console.log('url is ' + url);
		var info_space = '#job_info';
		$(info_space).empty();
		
		var queryString = '';
		 */
		
		$.ajax({
		  url: url,
          type: 'GET',
          data: queryString,
          success: function(data) {
        	  
        	  /* 7-1
            info_obj = data;
              if(!jQuery.isEmptyObject(info_obj)) {
		    	$(info_space).append('<div>nid: ' + info_obj['nid'] + '</div>');
		    	$(info_space).append('<div>nodes: ' + info_obj['nodes'] + '</div>');
		    	$(info_space).append('<div>jid: ' + info_obj['jid'] + '</div>');
		    	$(info_space).append('<div>err: ' + info_obj['err'] + '</div>');
		    	$(info_space).append('<div>stop: ' + info_obj['stop'] + '</div>');
		    	$(info_space).append('<div>host: ' + info_obj['host'] + '</div>');
		    	$(info_space).append('<div>start: ' + info_obj['start'] + '</div>');
                $(info_space).append('<div>name: ' + info_obj['name'] + '</div>');
                $(info_space).append('<div>type: ' + info_obj['type'] + '</div>');
                $(info_space).append('<div>wall: ' + info_obj['wall'] + '</div>');
                $(info_space).append('<div style="margin-bottom:10px">user: ' + info_obj['user'] + '</div>');
              } 
              else {
		    	$(user_info_space).append('<div>The job does not exist</div>');
              }
              */
          },
          error: function(e) {
        	console.log('jobinfo.js: Got error: ' + e);
          }
        });
      } 
	  else {
        console.log('This is an app.');
        
        for(var i in node.data)
          console.log(i + ': ' + node.data[i]);
        var url = 'http://' + SW.hostname + ':' + SW.port + '/appinfo/'+node.data.appid; //+'?jobid='+node.data.jobid;
        console.log('Passing url '+url+' to getAppInfo.');
        // getAppInfo is defined just above this function in the same file. 
        getAppInfo(url);
        
      }
    },
    onLazyRead: function(node) {
      console.log('lazy reading jobs tree for ' + node.data.jobid);
      
      
      var jid = node.data.jobid; 
      var url = 'http://' + SW.hostname + ':' + SW.port + '/appsproxy?jid='+jid;
      console.log(url);
      node.appendAjax({
        url:  url,
	    // We don't want the next line in production code:
        debugLazyDelay: 50
      });
      
    },
    // The following options are only required if we have more than one tree on one page:
    // initId: "treeData",
    cookieId: "dynatree-Cb3",
    idPrefix: "dynatree-Cb3-"
  });
}
