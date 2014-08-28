var sample = false;

$(document).ready(function() {

  // This is the button in the left menu panel. 
  $('#add_doi_button').click(function() { 
    
    $('#doiModalFilesField').html(''+SW.selected_file_paths);
/*<<<<<<< HEAD
    $('#doiModalGroupsField').html(''+SW.selected_group_names);
    $('#doiModalPeopleField').html(''+SW.selected_people_names);
=======
    $('#doiModalGroupsField').html(''+SW.selected_group_titles);
    $('#doiModalPeopleField').html();
>>>>>>> 9febb2118b104a07976fe9bc0ff15dfd6357b3d9*/
    $('#doiModalJobsField').html();
    $('#doiModalAppsField').html(); 
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

/*function addGroups(selected_group_items) {      Commented out 8-27-14
=======
function addGroups() {
>>>>>>> 9febb2118b104a07976fe9bc0ff15dfd6357b3d9
  var input = '';

  if(!sample) {
	var groupKey = 'group_nids';
	for(var i = 0; i < SW.selected_group_nids.length; i++) {
	  input += '<input type="hidden" name="'+ groupKey +'" value="'+ SW.selected_group_nids[i] +'" />';
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
}*/

function addGroups() {
  var input = '';
  var nids = SW.selected_group_nids;        // an array
  var names = SW.selected_group_names;      // an array
  
  // We add a dummy value as the first hidden input, a hack to avoid single element arrays that blow up the back end. Still needed? 
  input += '<input type="hidden" name="groupNid" value="dummyGroupNid" />';
  for(var i = 0; i < nids.length; i++) {
    input += '<input type="hidden" name="groupNid" value="'+nids[i]+'" />';
  }
  
  // We add a dummy value as the first hidden input, a hack to avoid single element arrays that blow up the back end. Still needed? 
  input += '<input type="hidden" name="groupName" value="dummyGroupName" />';
  for(var i = 0; i < names.length; i++) {
    input += '<input type="hidden" name="groupName" value="'+names[i]+'" />';
  }
  
  return input;
}
  
/*function addUsers(selected_user_items) {  Commented out 8-27-14
  
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
}*/

function addPeople() {
  var input = '';
  var nids = SW.selected_people_nids;        // an array
  var names = SW.selected_people_names;      // an array
  
  // We add a dummy value as the first hidden input, a hack to avoid single element arrays that blow up the back end. Still needed? 
  input += '<input type="hidden" name="personNid" value="dummyPersonNid" />';
  for(var i = 0; i < nids.length; i++) {
    input += '<input type="hidden" name="personNid" value="'+nids[i]+'" />';
  }
  
  // We add a dummy value as the first hidden input, a hack to avoid single element arrays that blow up the back end. Still needed? 
  input += '<input type="hidden" name="personName" value="dummyPersonName" />';
  for(var i = 0; i < names.length; i++) {
    input += '<input type="hidden" name="personName" value="'+names[i]+'" />';
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
  
function addResources() {
  var input = '';
	
  input += '<input type="hidden" name="'+ 'resource' +'" value="'+ SW.selected_file_paths +'" />';

  //input += '<input type="hidden" name="'+ 'fileNids' +'" value="'+ SW.selected_file_nids +'" />';

  input += '<input type="hidden" name="'+ 'file_nids' +'" value="'+ SW.selected_file_nids +'" />';
  

	
  return input;
}

function addTags() {
	
	var input = '';
	
	input += '<input type="hidden" name="'+ 'tag_nids' +'" value="'+ SW.selected_tag_nids +'" />';
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
  input += addResources();
	  
  input += addTags();

  url = "http://" + SW.hostname + ":" + SW.port + "/doi/" + username;
	
  //alert('input: ' + input);
  
  /* Send request. */
  jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
    .appendTo('body').submit().remove();
  	
}                   	  
