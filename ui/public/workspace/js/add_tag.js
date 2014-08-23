$(document).ready(function() {
	
  /* Click event for the Create Tag button in the Add Tag modal. */
  $('#create_tag1').click(function() {

    /* For now, we are only checking to see whether the tag name is an empty string. */
    if($('input#tag_name').val() != '') {
	  createTag();
	  $('#tagModal').modal('hide');
      /* Cause current window to reload so tag cloud is refreshed. May wish to update cloud asynchronously later. */ 
	  //location.reload();
	  
      /* Reset fields for next tag creation. */
      $('#tag_name').val('');
      $('#tag_description').val('');
    }
    else
      alert('Tag name field is required!');
  });
});

function createTag() {
	
  var userNid = SW.current_user_nid;

  var userName = SW.current_user_uname;
  var userNumber = SW.current_user_number;
	  
  console.log('userName: ' + userName + ' userNumber: ' + userNumber + ' file node ids: ' + SW.selected_file_nids);
	  
  //var selected_file_titles = SW.selected_file_titles;
	  
  //var input = '';
  /* Put the user data in the hidden input fields. */
  //input += addUserData(user_data);
  //console.log('In add_tag.js, input is: '+input);
	
  // The global SW.selected_file_titles is set in the onSelect field of the Dynatree constructor 
  // in the function buildFileTree in the file ajax/fileinfo.js. It is a string which is a comma
  // separated list. 
  //console.log('SW.selected_file_titles: ' + SW.selected_file_titles);

  //quick tagging name convention
  var timeStamp = new Date().getTime();
	  
  var tagName = '';
  if($('input#tag_name').val() != null ||
     $('input#tag_name').val() != '' ||
	 $('input#tag_name').val() != undefined ||
	 $('input#tag_name').val() != ' ') {
    tagName = $('input#tag_name').val();
  } 
  else {
    tagName = 'tag' + timeStamp;
  }

  //replace with real description
  var tagDescription = 'tagdesc' + timeStamp;
  //var tagDescription = $('textarea#tag_description').val();
  //var url = 'http://' + SW.hostname + ':' + SW.port + '/tagproxy/'+usernumber;
  var url = 'http://' + SW.hostname + ':' + SW.port + '/tagproxy/'+userNumber + '?name=' + tagName + '&description=' + tagDescription;
  
  console.log('Issuing the URL: '+url);
	  
  //url = url + '?path=|';
  //var children = [];
  //alert('url: ' + url);
	  
  $.ajax({
    url: url,
    global: false,
    type: 'POST',
    success: function(data) {
				
      console.log('success in creating tag ');
				
      var tag_nid = data['nid'];
				  
      //associate tag to selected files
      associateFiles(tag_nid);
				 
      //associate tag to groups
      associateGroups(tag_nid);
				 
      //associate tag to selected jobs
      associateJobs(tag_nid);
				 
      //associate tag to selected users
      associateUsers(tag_nid);

      //associate tag to selected apps
      associateApps(tag_nid);
				
      //either reload the page or dynamically add tag
      //default is that the page will reload
      addTagToPage();
    },
    error: function(e) {
      alert('error in createTag() in add_tag.js: '+e);
    }
  });
}


function addTagToPage() {
	
	//location.href='http://' + SW.hostname + ':' + SW.port + '/workspace/' + SW.current_user_username;
	
}


function associateGroups(tag_nid) {
	
	if(SW.selected_group_nids != undefined) {
		 console.log('selected_group_nids: ' + SW.selected_group_nids + ' selected_group_nids.length ' + SW.selected_group_nids.length + ' [0]: ' + SW.selected_group_nids[0]);
		 
		 for(var i=0;i<SW.selected_group_nids.length;i++) {
			  
			 //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_group_nids[i]); //?name='+tagName+'&uid=5112');
			  
			 var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
			 association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_group_nids[i] + '&type=' + 'group';
			 	
			 
			 //alert('association_url: ' + association_url);
			 $.ajax({
				    url: association_url,
				    global: false,
					type: 'POST',
					success: function(data) {
						
						for(var key in data) {
							console.log('group key: ' + key + ' value: ' + data[key]);
						}
						
						console.log('assoc files success');
					},
					error: function() {
						console.log('assoc files error');
					}
			 });
			 
			  
		 }
	 }
	 

}


function associateUsers(tag_nid) {
	
	if(SW.selected_user_nids != undefined) {
		
		 for(var i=0;i<SW.selected_user_nids.length;i++) {
			  
			  //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_user_nids[i]); //?name='+tagName+'&uid=5112');
			  
			  var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
			  association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_user_nids[i] + '&type=' + 'user';
				 
			  //alert('association_url: ' + association_url);
			  $.ajax({
				    url: association_url,
				    global: false,
					type: 'POST',
					success: function(data) {

						for(var key in data) {
							console.log('user key: ' + key + ' value: ' + data[key]);
						}
						
						console.log('assoc users success');
					},
					error: function() {
						console.log('assoc users error');
					}
			 });
		 
		 }
	 }
	 
}


function associateFiles(tag_nid) {
	
  if(SW.selected_file_nids != undefined) {
    console.log('selected_file_nids: ' + SW.selected_file_nids + ' selected_file_nids.length ' + SW.selected_file_nids.length + ' [0]: ' + SW.selected_file_nids[0]);
    for(var i = 0; i < SW.selected_file_nids.length; i++) {
			  
			 //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_file_nids[i]); //?name='+tagName+'&uid=5112');
			  
			 var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
			 association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_file_nids[i] + '&type=' + 'file';
				 
			 
			 $.ajax({
				    url: association_url,
				    global: false,
					type: 'POST',
					success: function(data) {

						for(var key in data) {
							console.log('file key: ' + key + ' value: ' + data[key]);
						}
						
						console.log('assoc files success');
					},
					error: function() {
						console.log('assoc files error');
					}
			 });
			 
		 }
	 }
	
}


function associateJobs(tag_nid) {
	
  if(SW.selected_job_nids != undefined) {
    for(var i = 0; i < SW.selected_job_nids.length; i++) {
      var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
      association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_job_nids[i] + '&type=' + 'job';
      
      $.ajax({
        url: association_url,
        global: false,
        type: 'POST',
        success: function(data) {
          for(var key in data) {
            console.log('job key: ' + key + ' value: ' + data[key]);
          }
          console.log('assoc jobs success');
        },
        error: function() {
          console.log('assoc jobs error');
        }
      });
    }
  }
}


function associateApps(tag_nid) {

  if(SW.selected_app_nids != undefined) {
    for(var i = 0; i < SW.selected_app_nids.length; i++) {
      //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_app_nids[i]); //?name='+tagName+'&uid=5112');
      //console.log('nids ' + i + ' ' + SW.selected_app_nids[i]);
      var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
      association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_app_nids[i] + '&type=' + 'app';

      $.ajax({
        url: association_url,
        global: false,
        type: 'POST',
        success: function(data) {
          console.log('assoc apps success');
        },
        error: function() {
          console.log('assoc apps error');
        }
      });
    }
  } 
}

