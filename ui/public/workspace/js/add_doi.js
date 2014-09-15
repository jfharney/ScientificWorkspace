var sample = false;

$(document).ready(function() {

  // This is the button in the left menu panel. 
  $('#add_doi_button').click(function() { 
    SW.doiFromTagsFlag = false;
    
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
    input += '<input type="hidden" name="personNames" value="'+names[i]+'" />';
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
    input += '<input type="hidden" name="groupNames" value="'+names[i]+'" />';
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
    input += '<input type="hidden" name="jobNames" value="'+names[i]+'" />';
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
    input += '<input type="hidden" name="appIds" value="'+ids[i]+'" />';
  }
  
  // App nids are aggregated into the general nids collection.
  for(var i = 0; i < nids.length; i++) {
    input += '<input type="hidden" name="nids" value="'+nids[i]+'" />';
  }
  
  return input;
}

function addFiles() {
  var input = '';
  var paths = [];
  var nids = [];
  if(SW.doiFromTagsFlag) {
    for(var key in SW.multi_tag_files) {
      paths.push(key);
      for(var i = 0; i < SW.multi_tag_files[key].length; i++) {
        nids.push(SW.multi_tag_files[key][i]);
      }
    }
  }
  else {
    var paths = SW.selected_file_paths;
    var nids = SW.selected_file_nids;
  }
  
  for(var i = 0; i < paths.length; i++) {
    input += '<input type="hidden" name="fileNames" value="'+paths[i]+'" />';
  }
  
  // File nids are aggregated into the general nids collection.
  for(var i = 0; i < nids.length; i++) {
    input += '<input type="hidden" name="nids" value="'+nids[i]+'" />';
  }
  
  return input;
}

function addCreator() {
	  
  var input = '';
	  
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

  return input;
}

function addTags() {
	
	var input = '';
	
	input += '<input type="hidden" name="tagNames" value="'+ SW.selected_tag_names +'" />';
	
	return input;
}
                            	  
                            	  
function createDOI() {

  var username = SW.current_user_uname;
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
