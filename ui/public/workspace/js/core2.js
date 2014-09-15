var SW = SW || {};

SW.feedOn = false;
SW.hostname = 'localhost';
SW.port = '1337';

/* These variables describe the current user. They are set in the ready event in main.js. */
SW.current_user_nid = '';
SW.current_user_name = '';
SW.current_user_number = '';
SW.current_user_uname = '';
SW.current_user_email = '';

// The following globals track selected items, including the Tags Workspace. They are ordered by type number.

SW.selected_nids = [];              // Object nids are not tracked individually. All nids go here.

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

// These globals are set by the single in focus tag in the Tags Workspace. They are used when the Obtain DOI button on the right is used.
SW.single_tag_people = [];
SW.single_tag_groups = [];
SW.single_tag_jobs = [];
SW.single_tag_apps = [];
SW.single_tag_files = [];
SW.single_tag_nids = [];

/********************/

// These globals are set by the tag checkboxes in the Tags Workspace. They are used when the Obtain DOI button on the bottom is used.
SW.multi_tag_people = {};
SW.multi_tag_groups = {};
SW.multi_tag_jobs = {};
SW.multi_tag_apps = {};
SW.multi_tag_files = {};
SW.multi_tag_nids = {};

SW.doiFromTagsFlag = false;

SW.resetMultiTagFields = function() {
  SW.multi_tag_people = {};
  SW.multi_tag_groups = {};
  SW.multi_tag_jobs = {};
  SW.multi_tag_apps = {};
  SW.multi_tag_files = {};
  SW.multi_tag_nids = {};
}

// These globals track the tags in the Tags Workspace whose checkboxes are currently checked.
SW.selected_tag_names = [];
SW.selected_tag_nids = [];

/********************/

SW.typeMap = ['user','group','job','app','file','directory','other'];



