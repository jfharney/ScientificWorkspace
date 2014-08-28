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

/* This flag is set to true if at least one file is included in the collection of resources for 
 * which the user intends to request a DOI. It is checked when the Create DOI Form button is 
 * clicked within the DOI modal. Note that both the "doiBySelection" and "doiByTag" processes 
 * use this flag.   
 */

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

SW.tagNidsInWorkspace = [];     // tracks which tags are currently in Tags Workspace

SW.typeMap = ['user','group','job','app','file','directory','other'];



