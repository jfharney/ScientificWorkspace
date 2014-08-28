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

SW.selected_people_nids = [];
SW.selected_people_names = []; 

SW.selected_group_nids = [];
SW.selected_group_names = []; 


SW.file_included_flag = false;

//global file resources

SW.selected_file_nids = [];
SW.selected_file_paths = [];

//global group resources
SW.selected_group_nids = [];
SW.selected_group_titles = [];

//global tag resources
SW.selected_tag_names = [];
SW.selected_tag_nids = [];

SW.tagNidsInWorkspace = [];     // Tracks which tags are currently in Tags Workspace. If a tag is already there, it cannot be re-added.

SW.typeMap = ['user','group','job','app','file','directory','other'];



