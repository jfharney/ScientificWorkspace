function getJobInfo(username, searchArg) {
	
  var jobsArr = [];
  var queryString = '';
  if(searchArg == undefined) searchArg = '';
  var url = 'http://localhost:8001/jobsproxy/'+username;
  
  var children = [];

  /* Create the initial children. */
  $.ajax({
    url: url,
    global: false,
    type: 'GET',
	async: false,
	data: queryString,
	success: function(data) 
	{
      for(var i = 0; i < data.length; i++) {
        children.push(data[i]);
      }

	  buildJobsTree(children);	/* This function is defined below. */ 
    },
    error: function() { console.log('error in getting job info'); }
  });
}


function buildJobsTree(children) {
  $("#myJobsTree").dynatree({
    title: "Lazy loading sample",
    fx: { height: "toggle", duration: 200 },
    autoFocus: false, 
    children: children,
    checkbox: true,
    selectMode: 3,
    onSelect: function(select, node) {
      var selNodes = node.tree.getSelectedNodes();
	  var selUuids = $.map(selNodes, function(node){
        return node.data.uuid + "";
      });
      var selTypes = $.map(selNodes, function(node){
        return node.data.type + "";
      });
	          
      var selRootNodes = node.tree.getSelectedNodes(true);
	    	  
      SW.tagged_items = selUuids.join(", ");
      SW.tagged_types = selTypes.join(", ");
      SW.selected_resource_items = selUuids.join(", ");
      SW.selected_resource_types = selTypes.join(", ");
      SW.selected_resource_keys = selUuids.join(", ");
	        
      $("#echoSelectionUuids3").text(selUuids.join(", "));
      $("#echoSelectionTypes3").text(selTypes.join(", "));
          
      $('#resources_to_tag').empty();
      $('#resources_to_tag').append('<div>' + SW.selected_resource_items + '</div>')
      $('#resources_types_to_tag').empty();
      $('#resources_types_to_tag').append('<div>' + SW.selected_resource_types + '</div>')
    },
    onActivate: function(node) {
      var info_obj = '';
      if(node.data.type == 'job') {
        var url = 'http://' + SW.hostname + ':' + SW.port + '/jobinfo/'+node.data.jobid;
        var info_space = '#job_info';
        $(info_space).empty();
        var queryString = '';
        $.ajax({
          url: url,
          type: 'GET',
          data: queryString,
          success: function(data) {
            info_obj = data;
            if(!jQuery.isEmptyObject(info_obj)) {
              $(info_space).append('<div>jobid: ' + info_obj['jobs'][0]['jobid']+ '</div>');
              $(info_space).append('<div>starttime: ' + info_obj['jobs'][0]['starttime']+ '</div>');
              $(info_space).append('<div>endtime: ' + info_obj['jobs'][0]['endtime']+ '</div>');
              $(info_space).append('<div>groupname: ' + info_obj['jobs'][0]['groupname']+ '</div>');
              $(info_space).append('<div>hostname: ' + info_obj['jobs'][0]['hostname']+ '</div>');
              $(info_space).append('<div>joberr: ' + info_obj['jobs'][0]['joberr']+ '</div>');
              $(info_space).append('<div>jobname: ' + info_obj['jobs'][0]['jobname']+ '</div>');
              $(info_space).append('<div>jobuuid: ' + info_obj['jobs'][0]['uuid']+ '</div>');
              $(info_space).append('<div>processors: ' + info_obj['jobs'][0]['processors']+ '</div>');
              $(info_space).append('<div>username: ' + info_obj['jobs'][0]['username']+ '</div>');
              $(info_space).append('<div style="margin-bottom:10px">walltime: ' + info_obj['jobs'][0]['walltime']+ '</div>');
            } 
            else {
              $(user_info_space).append('<div>The user does not exist</div>');
            }
          },
          error: function() {}
        });
      } 
      else {
        console.log('this is an app');
        var url = 'http://' + SW.hostname + ':' + SW.port + '/appinfo/'+node.data.appid+'?jobid='+node.data.jobid;
        getAppInfo(url);
      }
    },
    onLazyRead: function(node) {
      var jobid = node.data.jobid;
      var url = 'http://' + SW.hostname + ':' + SW.port + '/appsproxy?jobid='+jobid;

      node.appendAjax({
        url:  url,
        /* We don't want the next line in production code: */
        debugLazyDelay: 50
      });
    },

    /* The following options are only required if we have more than one tree on one page: */
    // initId: "treeData",
    cookieId: "dynatree-Cb3",
    idPrefix: "dynatree-Cb3-"
	      
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
        $(info_space).append('<div>appid: ' + info_obj['apps'][0]['appid']+ '</div>');
        $(info_space).append('<div>jobid: ' + info_obj['apps'][0]['jobid']+ '</div>');
        $(info_space).append('<div>starttime: ' + info_obj['apps'][0]['starttime']+ '</div>');
        $(info_space).append('<div>command: ' + info_obj['apps'][0]['command']+ '</div>');
        $(info_space).append('<div>endtime: ' + info_obj['apps'][0]['endtime']+ '</div>');
        $(info_space).append('<div>exitcode: ' + info_obj['apps'][0]['exitcode']+ '</div>');
        $(info_space).append('<div>hostname: ' + info_obj['apps'][0]['hostname']+ '</div>');
        $(info_space).append('<div>appuuid: ' + info_obj['apps'][0]['uuid']+ '</div>');
        $(info_space).append('<div style="margin-bottom:10px">processors: ' + info_obj['apps'][0]['processors']+ '</div>');
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