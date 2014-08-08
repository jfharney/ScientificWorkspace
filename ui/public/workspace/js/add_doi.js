var sample = false;

$(document).ready(function() {

  // This is the button in the left menu panel. 
  $('#add_doi_button').click(function() { 
	SW.doiBySelection = true;
	SW.doiByTag = false;
    
    $('#doiModalFilesField').html(''+SW.selected_file_titles);
    $('#doiModalGroupsField').html(''+SW.selected_group_titles);
    $('#doiModalPeopleField').html(''+SW.selected_user_titles);
    $('#doiModalJobsField').html(''+SW.selected_job_titles);
    $('#doiModalAppsField').html(''+SW.selected_app_titles);		// Is SW.selected_app_titles being populated correctly? 
  });
	  
  /* This is the button INSIDE the DOI modal. */ 
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

/* This function takes an array as its sole argument. It returns a string, which is a set of input tags.
 */
function addGroups(selected_group_items) {
  var input = '';
	  
  if(!sample) {
	var groupKey = 'group';
	for(var i = 0; i < selected_group_items.length; i++) {
	  input += '<input type="hidden" name="'+ groupKey +'" value="'+ selected_group_items[i] +'" />';
    }
  } 
  else {
    var groupKey = 'group';

    //padded the array with one value - this a hack to avoid single element arrays that blow up the backend
	var groupValue1 = 'group1';
	input += '<input type="hidden" name="'+ groupKey +'" value="'+ groupValue1 +'" />';
    for(var i = 0; i < selected_group_items.length; i++) {
      input+='<input type="hidden" name="'+ groupKey +'" value="'+ selected_group_items[i] +'" />';
    }	  
  }
  return input;
}
  
function addUsers(selected_user_items) {
  
  var input = '';
  if(typeof selected_user_items != "undefined" && selected_user_items != null && selected_user_items.length > 0) {
    if(!sample) {
      var userKey = 'user';
	  for(var i = 0; i < selected_user_items.length; i++) {
		input += '<input type="hidden" name="'+ userKey +'" value="'+ selected_user_items[i] +'" />';
      }
	} 
    else {
      var userKey = 'user';
      // Array with one dummy value, a hack to avoid single element arrays that blow up the backend.
	  var userValue1 = 'user1';
	  input += '<input type="hidden" name="'+ userKey +'" value="'+ userValue1 +'" />';
	  for(var i = 0; i < selected_user_items.length; i++) {
        input+='<input type="hidden" name="'+ userKey +'" value="'+ selected_user_items[i] +'" />';
      }
    }
  } 
  else {}

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

function addJobs(selected_job_items) {
  var input = '';
	  
  if(!sample) {
    var jobKey = 'job';
	for(var i = 0; i < selected_job_items.length; i++) {
      input += '<input type="hidden" name="'+ jobKey +'" value="'+ selected_job_items[i] +'" />';
    }
  } 
  else {
    var jobKey = 'job';
    // Array with one dummy value, a hack to avoid single element arrays that blow up the backend.
    var jobValue1 = 'job1';
    input += '<input type="hidden" name="'+ jobKey +'" value="'+ jobValue1 +'" />';
    for(var i = 0; i < selected_job_items.length; i++) {
      input += '<input type="hidden" name="'+ jobKey +'" value="'+ selected_job_items[i] +'" />';
    }
  }
	  
  return input;
}

function addApps(selected_app_items) {
  var input = '';
		  
  if(!sample) {
	for(var i = 0; i < selected_app_items.length; i++) {
      input += '<input type="hidden" name="app" value="'+ selected_app_items[i] +'" />';
    }
  } 
  else {
    // Array with one dummy value, a hack to avoid single element arrays that blow up the backend.
    var appValue1 = 'app1';
    input += '<input type="hidden" name="app" value="'+ appValue1 +'" />';
    for(var i = 0; i < selected_app_items.length; i++) {
      input += '<input type="hidden" name="app" value="'+ selected_app_items[i] +'" />';
    }
  }
		  
  return input;
}
  
function addResources(selected_file_items) {
  var input = '';
	
  input += '<input type="hidden" name="'+ 'resource' +'" value="'+ selected_file_items +'" />';
	
  return input;
}
                            	  
                            	  
function createDOI() {

  var username = SW.current_user_uname;
  var selected_file_titles = SW.selected_file_titles;  
  var input = '';
  
  /* Put the user data in the hidden input fields. */  
  input += addCreator();
	  
  /* Put the indicated file names in the hidden input fields. */
  if(SW.doiBySelection)
    input += addResources(SW.selected_file_titles);
  if(SW.doiByTag)
    input += addResources(SW.tagged_file_names);
	
  /* Put the indicated jobs in the hidden input fields. */
  if(SW.doiBySelection)
    input += addJobs(SW.selected_job_titles);
  if(SW.doiByTag)
    input += addJobs(SW.tagged_job_names);
  
  /* Put the indicated apps in the hidden input fields. */
  if(SW.doiBySelection)
    input += addApps(SW.selected_app_titles);
  if(SW.doiByTag)
    input += addApps(SW.tagged_app_names);
	
  /* Put the indicated groups in the hidden input fields. */
  if(SW.doiBySelection)
    input += addGroups(SW.selected_group_titles);
  if(SW.doiByTag)
    input += addGroups(SW.tagged_group_names);
	
  /* Put the indicated persons in the hidden input fields. */
  if(SW.doiBySelection)
    input += addUsers(SW.selected_user_titles);
  if(SW.doiByTag)
	input += addUsers(SW.tagged_person_names);
	  
  url = "http://" + SW.hostname + ":" + SW.port + "/doi/" + username;
	
  /* Send request. */
  jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
    .appendTo('body').submit().remove();
  	
}                   	  
