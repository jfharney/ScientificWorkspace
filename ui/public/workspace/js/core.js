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


/* The following globals are used to represent the resources linked to by a given in focus tag in the tag cloud. 
 * They are used to populate the DOI modal when the Obtain DOI button is clicked.  
 */
SW.tagged_file_names = [];		// An array of the file (or directory) names linked to by a tag.
SW.tagged_file_types = [];		// An array of the corresponding types of each file or directory. 4 is file, 5 is directory.
SW.tagged_job_names = [];
SW.tagged_app_names = [];
SW.tagged_group_names = [];
SW.tagged_person_names = [];
SW.tagged_file_flag = false;	/* Indicates whether at least one file is part of a tag collection. */

/* The purpose of the following object variable is to record the components of a tag that is:
 * 		1. Currently in the tag workspace.
 * 		2. Currently selected by means of the checkbox next to its button. 
 * The object contains a field for each resource type: files, groups, persons, jobs, apps, and directories.
 * Each of these fields in turn is itself an object. Let us refer to these fields as resource fields. 
 * The components of the resource fields are array variables, in which the name of the array is the resource 
 * name, and the array is the set of all tag nids which: 
 * 		1. Include that resource.
 * 		2. Have been checked within the tag workspace. 
 * An example is called for. tag1 and tag2 are added to the Tag Workspace. Their nids, respectively, 
 * are 123 and 456. tag1 includes fileA and fileB, while tag2 includes fileB and fileC. When I check 
 * tag1, SW.selected_tagged_objects is updated to look like this: 
 * 
 *   {
 *		SW.selected_tagged_objects.files: { fileA: [123],
 *											fileB: [123] }
 *	 }
 *
 * When I check tag2, SW.selected_tagged_objects is updated to look like this:
 *  {
 *		SW.selected_tagged_objects.files: { fileA: [123],
 *											fileB: [123, 456],
 *											fileC: [456] }
 *	}
 *
 * If I clicked Obtain DOI at this point, fileA, fileB and fileC would be displayed in the DOI window, 
 * and then submitted to the DOI page. 
 * 
 * However, let's return to before the Obtain DOI was hypothetically clicked. If I unchecked tag1, 
 * SW.selected_tagged_objects would be updated to look like this:
 * 
 *  {
 *		SW.selected_tagged_objects.files: { fileB: [456],
 *											fileC: [456] }
 *	}
 *
 * Crucially, the array field fileA has been deleted from SW.selected_tagged_objects.files, but the
 * array field fileB has not. When fileA became an empty array, it was removed from the object.
 * In this manner, we can track the set of tagged resources in the Tag Workspace in a manner that 
 * accounts for the possible overlap of tag constituents. 
 * 
 * In addition to the uncheck event, we must also account for the clicking of the black X on the 
 * right of the button which removes the tag from the Tag Workspace.
 */
SW.selected_tagged_objects = {};
SW.selected_tagged_objects.files = {};

SW.resetTaggedFields = function() {
  SW.tagged_file_names = [];
  SW.tagged_file_types = [];
  SW.tagged_job_names = [];
  SW.tagged_app_names = [];
  SW.tagged_group_names = [];
  SW.tagged_person_names = [];	
}

/* The purpose of this array variable is to track the nids of the tags that have already been 
 * added to the tag workspace. If a tag is already there, it is not added again. Hence, a nid 
 * value is added to this array when a new tag is selected from the tag cloud, and is removed 
 * from this array when a tag is removed from the tag workspace. */
SW.tagNidsInWorkspace = [];