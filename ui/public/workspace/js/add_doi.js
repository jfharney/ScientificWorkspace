var sample = false;

$(document).ready(function() {

  // This is the button in the left menu panel. 
  $('#add_doi_button').click(function() { 
    $('#doiModalPeopleField').html(''+SW.selected_people_names);
    $('#doiModalGroupsField').html(''+SW.selected_group_names);
    $('#doiModalFilesField').html(''+SW.selected_file_paths);
    $('#doiModalJobsField').html(''+SW.selected_job_names);
    $('#doiModalAppsField').html(''+SW.selected_app_ids); 
  });
    
  /* This is the button INSIDE the DOI modal, labeled Create DOI Form. */ 
  $('button#create_doi_button').click(function() {
    if($('#doiModalFilesField').html() != '')
      SW.file_included_flag = true;
    /* The boolean SW.file_included_flag indicates whether at least one file is selected. */
    if(SW.file_included_flag == false)
      alert('At least one file must be selected to request a DOI.');
    else
      createDOI();
  });
	  
});

function addPeople() {
  var input = '';
  var names = SW.selected_people_names;          // an array
  var nids = SW.selected_people_nids;            // an array
  
  for(var i = 0; i < names.length; i++) {
    input += '<input type="hidden" name="personName" value="'+names[i]+'" />';
  }
  
  // People nids are aggregated into the general nids collection.
  for(var i = 0; i < nids.length; i++) {
    input += '<input type="hidden" name="nids" value="'+nids[i]+'" />';
  }
  
  return input;
}

function addGroups() {
  var input = '';
  var names = SW.selected_group_names;          // an array
  var nids = SW.selected_group_nids;            // an array
  
  for(var i = 0; i < names.length; i++) {
    input += '<input type="hidden" name="groupName" value="'+names[i]+'" />';
  }
  
  // Group nids are aggregated into the general nids collection.
  for(var i = 0; i < nids.length; i++) {
    input += '<input type="hidden" name="nids" value="'+nids[i]+'" />';
  }
  
  return input;
}

function addJobs() {
  var input = '';
  var names = SW.selected_job_names;          // an array
  var nids = SW.selected_job_nids;            // an array
  
  for(var i = 0; i < names.length; i++) {
    input += '<input type="hidden" name="jobName" value="'+names[i]+'" />';
  }
  
  // Job nids are aggregated into the general nids collection.
  for(var i = 0; i < nids.length; i++) {
    input += '<input type="hidden" name="nids" value="'+nids[i]+'" />';
  }
  
  return input;
}

function addApps() {
  var input = '';
  var ids = SW.selected_app_ids;              // an array
  var nids = SW.selected_app_nids;            // an array
  
  for(var i = 0; i < ids.length; i++) {
    input += '<input type="hidden" name="appId" value="'+ids[i]+'" />';
  }
  
  // App nids are aggregated into the general nids collection.
  for(var i = 0; i < nids.length; i++) {
    input += '<input type="hidden" name="nids" value="'+nids[i]+'" />';
  }
  
  return input;
}

function addFiles() {
  var input = '';
  var paths = SW.selected_file_paths;          // an array
  var nids = SW.selected_file_nids;            // an array
  
  for(var i = 0; i < paths.length; i++) {
    input += '<input type="hidden" name="fileName" value="'+paths[i]+'" />';
  }
  
  // Group nids are aggregated into the general nids collection.
  for(var i = 0; i < nids.length; i++) {
    input += '<input type="hidden" name="nids" value="'+nids[i]+'" />';
  }
  
  return input;
}

function addCreator() {
	  
  var input = '';
	  
  if(!sample) {
    var creator_nid_Key = 'creator_nid';
	var creator_email_Key = 'creator_email';
	var creator_name_Key = 'creator_name';
	var creator_number_Key = 'creator_number';
	var creator_uname_Key = 'creator_uname';

	input+='<input type="hidden" name="'+ creator_nid_Key +'" value="'+ SW.current_user_nid +'" />';
	input+='<input type="hidden" name="'+ creator_email_Key +'" value="'+ SW.current_user_email +'" />';
	input+='<input type="hidden" name="'+ creator_name_Key +'" value="'+ SW.current_user_name +'" />';
	input+='<input type="hidden" name="'+ creator_number_Key +'" value="'+ SW.current_user_number +'" />';
	input+='<input type="hidden" name="'+ creator_uname_Key +'" value="'+ SW.current_user_uname +'" />';
  } 
  else {
    var creator_nid_Key = 'creator_nid';
    var creator_email_Key = 'creator_email';
	var creator_name_Key = 'creator_name';
	var creator_number_Key = 'creator_number';
	var creator_uname_Key = 'creator_uname';

	input+='<input type="hidden" name="'+ creator_nid_Key +'" value="'+ SW.current_user_nid +'" />';
	input+='<input type="hidden" name="'+ creator_email_Key +'" value="'+ SW.current_user_email +'" />';
	input+='<input type="hidden" name="'+ creator_name_Key +'" value="'+ SW.current_user_name +'" />';
	input+='<input type="hidden" name="'+ creator_number_Key +'" value="'+ SW.current_user_number +'" />';
	input+='<input type="hidden" name="'+ creator_uname_Key +'" value="'+ SW.current_user_uname +'" />';
  }
  
  return input;
}

function addTags() {
	
	var input = '';
	
	input += '<input type="hidden" name="'+ 'nids' +'" value="'+ SW.selected_tag_nids +'" />';
	console.log('adding tag nids: ' + SW.selected_tag_nids);
	
	return input;
}
                            	  
                            	  
function createDOI() {

  var username = SW.current_user_uname;
  var selected_file_titles = SW.selected_file_titles;  
  var input = '';
  
  /* Put the user data in the hidden input fields. */  
  input += addCreator();
	  
  /* Put the indicated file names in the hidden input fields. */
  input += addPeople();
  input += addGroups();
  input += addJobs();
  input += addApps();
  input += addFiles();
	  
  input += addTags();

  url = "http://" + SW.hostname + ":" + SW.port + "/doi/" + username;
	
  alert('input: ' + input);
  
  /* Send request. */
  jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
    .appendTo('body').submit().remove();
  	
}
