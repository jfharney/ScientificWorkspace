var sample = false;

$(document).ready(function() {

  // This is the button in the left menu panel. 
  $('#add_doi_button').click(function() { 
    console.log('add doi');
    
    $('#doiModalFilesField').html(''+SW.selected_file_titles);
    $('#doiModalGroupsField').html(''+SW.selected_group_titles);
    $('#doiModalPeopleField').html(''+SW.selected_user_titles);
    $('#doiModalJobsField').html(''+SW.selected_job_titles);
    $('#doiModalAppsField').html();									// Does SW.selected_app_titles exist? 
  });
	  
  // This is the button INSIDE the DOI modal. 
  $('button#create_doi_button').click(function() {
    /* The boolean SW.selected_file_flag indicates whether at least one file is selected. */
    if(SW.selected_file_flag ==  '')
      alert('At least one file must be selected to request a DOI.');
    else
      createDOI();
  });
	  
});

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
      var groupKey = 'user';
	  for(var i = 0; i < selected_user_items.length; i++) {
		input += '<input type="hidden" name="'+ userKey +'" value="'+ selected_user_items[i] +'" />';
      }
	} 
    else {
      var userKey = 'user';
      //padded the array with one value - this a hack to avoid single element arrays that blow up the backend
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
	for(var i=0;i<selected_job_items.length;i++) {
      input += '<input type="hidden" name="'+ jobKey +'" value="'+ selected_job_items[i] +'" />';
    }
  } 
  else {
    var jobKey = 'job';

    //padded the array with one value - this a hack to avaoid single element arrays that blow up the backend
    var jobValue1 = 'job1';
    input+='<input type="hidden" name="'+ jobKey +'" value="'+ jobValue1 +'" />';
    for(var i=0;i<selected_job_items.length;i++) {
      input += '<input type="hidden" name="'+ jobKey +'" value="'+ selected_job_items[i] +'" />';
    }
  }
	  
  return input;
}
  
function addResources(selected_file_items) {
  var input = '';
	
  input += '<input type="hidden" name="'+ 'resource' +'" value="'+ selected_file_items +'" />';
  
  /*if(!sample) {
    for(var i = 0; i < selected_file_items.length; i++) {
      input += '<input type="hidden" name="'+ 'resource' +'" value="'+ selected_file_items[i] +'" />';
    }
  } 
  else {
    var fileKey = 'file';
    // Padded the array with one value - this a hack to avoid single element arrays that blow up the backend.
    var fileValue1 = 'file1';
    input += '<input type="hidden" name="'+ fileKey +'" value="'+ fileValue1 +'" />';
		
    for(var i = 0; i < selected_file_items.length; i++) {
      input+='<input type="hidden" name="'+ fileKey +'" value="'+ selected_file_items[i] +'" />';
    }
  }*/
	
  return input;
}
                            	  
                            	  
function createDOI() {

  var username = SW.current_user_uname;
  console.log("In createDOI(), username is " + username);
  var usernumber = SW.current_user_number;
	  
  var selected_file_titles = SW.selected_file_titles;
	  
  var input = '';
  //put the user data in the hidden input fields
	  
  input += addCreator();
	  
  //put the selected file keys in the hidden input fields
  input += addResources(SW.selected_file_titles);
	
  //put the selected apps/jobs in the hidden input fields
  input += addJobs(SW.selected_job_titles);
	
  //put the selected apps/jobs in the hidden input fields
  input += addGroups(SW.selected_group_titles);
	
  //put the selected apps/jobs in the hidden input fields
  input += addUsers(SW.selected_user_titles);

		
  //put the selected collaborators in the hidden input fields (may be deprecated)
	  
  url = "http://" + "localhost" + ":" + "1337" + "/doi/" + username + "";
	
  console.log('input: ' + input + ' url: ' + url);
	
  //send request
  jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
    .appendTo('body').submit().remove();
  	
}                   	  
