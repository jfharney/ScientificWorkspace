var SW = SW || {};

//get the configuration parameters
$.ajax({
  url: '/configuration',
  global: false,
  async: false,
  type: 'GET',
  success: function(data) {
		
		SW.hostname = data['swhostname'];
		SW.port = data['swport'];
		SW.theme_prefix = data['theme_prefix'];
		
		SW.feedOn = data['feed_on'];
		if(SW.feedOn == 'false') {
			SW.feedOn = false;
		} else {
			SW.feedOn = true;
		}

		SW.doiOfflineMode = data['doiOfflineMode'];   // Used for the DOI Tree in the User DOIs panel.
		if(SW.doiOfflineMode == 'false') {
			SW.doiOfflineMode = false;
		} else {
			SW.doiOfflineMode = true;
		}
		
  },
  error: function() {
		alert('error in getting configuration parameters');
  }

});




/* These variables describe the current user. They are set in the ready event in main.js. */
SW.current_user_nid = '';
SW.current_user_name = '';
SW.current_user_number = '';
SW.current_user_uname = '';
SW.current_user_email = '';

// The following globals track selected items, including the Tags Workspace. They are ordered by type number.

//SW.selected_nids = [];              // Object nids are not tracked individually. All nids go here.

SW.selected_people_names = [];
SW.selected_people_nids = [];

SW.selected_group_names = [];
SW.selected_group_nids = [];

SW.selected_job_names = [];
SW.selected_job_nids = [];

SW.selected_app_ids = [];           // apps don't have names.
SW.selected_app_nids = [];

SW.selected_file_paths = [];
SW.selected_file_nids = [];

SW.selected_directory_paths = [];
SW.selected_directory_nids = [];

// This global tracks whether at least one file has been included in the bundle of resources being collected for a DOI request. Still needed? 
SW.file_included_flag = false;

SW.tagNidsInWorkspace = [];     // Tracks which tags are currently in Tags Workspace. If a tag is already there, it cannot be re-added.

// These globals track the tags in the Tags Workspace whose checkboxes are currently checked.
SW.selected_tag_names = [];
SW.selected_tag_nids = [];




/*****Search page params? - not sure if these are needed anymore *****/

SW.typeMap = ['user','group','job','app','file','directory','other'];

//(0=user,1=group,2=job,3=app,4=file,5=dir,6=tag)
SW.selected_types = [];
SW.type_str = ['user','group','job','app','file','dir','tag','doi'];
SW.type_bitmap = [1,1,1,1,1,1,1,1];

SW.getTypeIndex = function(type) {
	var index = -1;
	
	for(var i=0;i<SW.type_str.length;i++) {
		if(type == SW.type_str[i]) {
			index = i;
			console.log('found index: ' + index + ' ' + SW.type_str[i] + ' for type: ' + type);
		}
	}
	return index;
	
}
