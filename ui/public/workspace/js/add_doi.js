var sample = false;

$(document).ready(function() {

  // This is the button in the left menu panel. 
  $('#add_doi_button').on('click', function() {
    
    addTagLinksToGlobals();
    //$('#doiModalTagsField').html(''+SW.selected_tag_names);
    //$('#doiModal').modal();
    
    $('#doiModalTagsField').html(''+SW.selected_tag_names);
    //createDOI();
  });
    
  /* This is the button INSIDE the DOI modal, labeled Create DOI Form. */ 
  $('button#create_doi_button').click(function() {
    if($('#doiModalFilesField').html() == '')
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

  var paths = SW.selected_file_paths;
  var nids = SW.selected_file_nids;
  
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
  
  input+='<input type="hidden" name="creator_nid" value="'+ SW.current_user_nid +'" />';
  input+='<input type="hidden" name="creator_email" value="'+ SW.current_user_email +'" />';
  input+='<input type="hidden" name="creator_name" value="'+ SW.current_user_name +'" />';
  input+='<input type="hidden" name="creator_uid" value="'+ SW.current_user_number +'" />';
  input+='<input type="hidden" name="creator_uname" value="'+ SW.current_user_uname +'" />';
  input+='<input type="hidden" name="contact_email" value="'+ SW.current_user_email +'" />';

  return input;
}

function addTags() {
	
	var input = '';
	
	for(var i = 0; i < SW.selected_tag_names.length; i++)
	  input += '<input type="hidden" name="tagNames" value="'+ SW.selected_tag_names[i] +'" />';
	
	for(var i = 0; i < SW.selected_tag_nids.length; i++)
	  input += '<input type="hidden" name="nids" value="'+ SW.selected_tag_nids[i] +'" />';
	
	return input;
}

// This function loops through the selected tags in the Tags Workspace. For each link in each tag, 
// it adds that link's name and nid to the corresponding globals, but only if those names and nids
// are not already in the globals. In this manner, duplicate selections of objects are avoided. 
// This function also populates the fields of the DOI modal, which is an unfortunate necessity
// created by the Ajax call. 
function addTagLinksToGlobals() { 

  console.log('Inside addTagLinksToGlobals().');
  var tagLinks_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/tags/links/';
  var addFlag = true;

  if(SW.selected_tag_nids.length == 0) {
    $('#doiModalPeopleField').html(''+SW.selected_people_names);
    $('#doiModalGroupsField').html(''+SW.selected_group_names);
    $('#doiModalJobsField').html(''+SW.selected_job_names);
    $('#doiModalAppsField').html(''+SW.selected_app_ids);
    $('#doiModalFilesField').html(''+SW.selected_file_paths);
    $('#doiModalTagsField').html(''+SW.selected_tag_names);

    $('#doiModal').modal();
  }

  for(var i = 0; i < SW.selected_tag_nids.length; i++) {
    var tagNid = SW.selected_tag_nids[i];
    $.ajax({
      type: 'GET',
      url: tagLinks_url_prefix+tagNid,
      success: function(linksData) {
        var linksArr = JSON.parse(linksData);
        
        for(var key = 0; key < linksArr.length; key++) {
          var type = linksArr[key]['type'];
          var name = linksArr[key]['name'];
          var nid = linksArr[key]['nid'];

          if(type == 0) {            //  PERSON
            addFlag = true;
            for(var i = 0; i < SW.selected_people_nids.length; i++)
              if(SW.selected_people_nids[i] == nid) addFlag = false;
            if(addFlag) {
              SW.selected_people_names.push(linksArr[key]['name']);
              SW.selected_people_nids.push(nid);
            }
          }
          else if(type == 1) {       //  GROUP
            addFlag = true;
            for(var i = 0; i < SW.selected_group_nids.length; i++)
              if(SW.selected_group_nids[i] == nid) addFlag = false;
            if(addFlag) {
              SW.selected_group_names.push(linksArr[key]['gname']);
              SW.selected_group_nids.push(nid);
            }
          }
          else if(type == 2) {       //  JOB
            addFlag = true;
            for(var i = 0; i < SW.selected_job_nids.length; i++)
              if(SW.selected_job_nids[i] == nid) addFlag = false;
            if(addFlag) {
              SW.selected_job_names.push(linksArr[key]['name']);
              SW.selected_job_nids.push(nid);
            }
          }
          else if(type == 3) {       //  APP
            addFlag = true;
            for(var i = 0; i < SW.selected_app_nids.length; i++)
              if(SW.selected_app_nids[i] == nid) addFlag = false;
            if(addFlag) {
              SW.selected_app_ids.push(linksArr[key]['aid']);
              SW.selected_app_nids.push(nid);
            }
          }
          else if(type == 4) {       //  FILE
            addFlag = true;
            for(var i = 0; i < SW.selected_file_nids.length; i++)
              if(SW.selected_file_nids[i] == nid) addFlag = false;
            if(addFlag) {
              SW.selected_file_paths.push(linksArr[key]['path']);
              SW.selected_file_nids.push(nid);
            }
          }
        }   // End of for loop.
          $('#doiModalPeopleField').html(''+SW.selected_people_names);
  $('#doiModalGroupsField').html(''+SW.selected_group_names);
  $('#doiModalJobsField').html(''+SW.selected_job_names);
  $('#doiModalAppsField').html(''+SW.selected_app_ids);
  $('#doiModalFilesField').html(''+SW.selected_file_paths);
  $('#doiModalTagsField').html(''+SW.selected_tag_names);

  $('#doiModal').modal();
      },
      error: function(e) {console.log('Error in addTagLinksToGlobals(): '+e);}
    });
  }    // End of for loop.


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

  url = "http://" + SW.hostname + ":" + SW.port + "/constellation/doi/" + username;
	
  //alert('input: ' + input);
  console.log('url: ' + url);
  
  /* Send request. */
  /*
  jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
    .appendTo('body').submit().remove();
  */

}
