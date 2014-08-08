var SW = SW || {};

//SW.tagged_items = '';
//SW.tagged_types = '';

/* These two boolean variables are meant to indicate whether a DOI is being selected via selection 
 * of resources directly in the Workspace area or by using a tag that has already been created.
 * Obviously, one variable would have sufficed, but by using two variables I hope to make the code
 * more clear. These variables are used in the function createDOI in the file workspace/js/add_doi.js. 
 */
SW.doiBySelection = false;
SW.doiByTag = false;

/* This flag is set to true if at least one file is included in the collection of resources for 
 * which the user intends to request a DOI. It is checked when the Create DOI Form button is 
 * clicked within the DOI modal. Note that both the "doiBySelection" and "doiByTag" processes 
 * use this flag.   
 */
SW.file_included_flag = false;

SW.selected_file_items = '';	// What is this? 
SW.selected_file_types = '';	// Either file (4) or directory (5). Why is this a string and not an array? 
SW.selected_file_keys = '';		// What is this? 
SW.selected_file_nids = [];
SW.selected_file_titles = [];	// title is the display value of the Dynatree node. 
SW.selected_file_flag = false;	

SW.selected_job_items = '';
SW.selected_job_types = '';
SW.selected_job_keys = '';
SW.selected_job_titles = [];
SW.selected_job_nids = [];

// These fields are new (created 8-07-14), they may not be populated correctly. 
SW.selected_app_items = '';
SW.selected_app_types = '';
SW.selected_app_keys = '';
SW.selected_app_titles = [];
SW.selected_app_nids = [];

SW.selected_group_titles = [];
SW.selected_user_titles = [];
SW.selected_group_nids = [];
SW.selected_user_nids = [];

SW.selected_collaborator_titles = [];

SW.selected_resource_items = '';
SW.selected_resource_types = '';
SW.selected_resource_keys = '';

SW.hostname = 'localhost';
SW.port = '1337';

/* These variables describe the current user. They are set in the ready event in main.js. */
SW.current_user_nid = '';
SW.current_user_name = '';
SW.current_user_number = '';
SW.current_user_uname = '';
SW.current_user_email = '';


SW.fileScratchPrefix = 'widow1|scratch';
SW.fileProjPrefix = 'widow1|proj';


SW.feedOn = false;


/* The following globals are used to represent the resources tagged by a given in focus tag in the tag cloud. 
 * They are used to populate the DOI modal when the Obtain DOI button is clicked.  
 */
SW.tagged_file_names = [];		// An array of the file (or directory) names linked to by a tag.
SW.tagged_file_types = [];		// An array of the corresponding types of each file or directory. 4 is file, 5 is directory.
SW.tagged_job_names = [];
SW.tagged_app_names = [];
SW.tagged_group_names = [];
SW.tagged_person_names = [];
SW.tagged_file_flag = false;	/* Indicates whether at least one file is part of a tag. */

SW.resetTaggedFields = function() {
  SW.tagged_file_names = [];
  SW.tagged_file_types = [];
  SW.tagged_job_names = [];
  SW.tagged_app_names = [];
  SW.tagged_group_names = [];
  SW.tagged_person_names = [];	
}