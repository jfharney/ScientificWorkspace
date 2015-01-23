function getJobInfo(userNum, searchArg) {
	
  var jobsArr = [];
  if(searchArg == undefined) searchArg = '';
  
  var url = 'http://' + SW.hostname + ':' + SW.port + '/constellation/jobsproxy/'+userNum+'?search='+searchArg;
  
  var children = [];

  
  console.log('job info url: ' + url);
  /* Create the initial children. */
  $.ajax({
    url: url,
    global: false,
    type: 'GET',
	success: function(data) 
	{
		console.log('job info url response: ');
		data = JSON.parse(data);
		for(var i=0;i<data.length;i++) {
			var d = data[i];
			//console.log('I: ' + i);
			for(var key in d) {
				//console.log('  key: ' + key + ' value: ' + d[key]);
			}
		}
      for(var i = 0; i < data.length; i++) {
        children.push(data[i]);
      } 
      console.log('children length: ' + children.length);
      if(children.length > 0) {
    	  buildJobsTree(children);			/* This function is defined below. */
      } else {
    	  $("#jobs_tree").append('<div>This user has not run any jobs. </div>');
      }
    },
    error: function() { console.log('error in getting job info'); }
  });
}



function getAppInfo(url) {

  var queryString = '';
  
  $.ajax({
    url: url,
    type: 'GET',
    data: queryString,
    success: function(data) {
      info_obj = data;
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
	fx: { height: "toggle", duration: 200 },
	autoFocus: false, 
	children: children,
	checkbox: true,
	selectMode: 3,         // "1:single, 2:multi, 3:multi-hier"
	onSelect: function(select, node) {
	  console.log('node.data.type is '+node.data.type);
      var selNodes = node.tree.getSelectedNodes();
      if(node.data.type == 2) {       // Jobs
        
        SW.selected_job_names = $.map(selNodes, function(node) {
          if(node.data.type == 2)
            return node.data.title;
        });
            
        SW.selected_job_nids = $.map(selNodes, function(node) {
          if(node.data.type == 2)
            return node.data.nid;
        });

        //console.log('SW.selected_job_names: '+SW.selected_job_names);
        //console.log('SW.selected_job_nids: '+SW.selected_job_nids);	 
      } 
      else if(node.data.type == 3) {       // Apps 
	        
	    SW.selected_app_ids = $.map(selNodes, function(node) {
	      if(node.data.type == 3)
	        return node.data.title;
	      });
	            
	    SW.selected_app_nids = $.map(selNodes, function(node) {
	      if(node.data.type == 3)
	        return node.data.nid;
	    });

	    //console.log('SW.selected_app_ids: '+SW.selected_app_ids);
	    //console.log('SW.selected_app_nids: '+SW.selected_app_nids);			
	  }
	},
	onActivate: function(node) {},
  onLazyRead: function(node) {
    var jid = node.data.jobid; 
    var url = 'http://' + SW.hostname + ':' + SW.port + '/constellation/appsproxy?jid='+jid;
    console.log('onlazyread apps for jid: ' + jid + ' url: ' + url);
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
