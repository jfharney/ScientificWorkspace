
var SW = SW || {};

SW.tagged_items = '';
SW.tagged_types = '';

SW.selected_file_items = '';
SW.selected_file_types = '';
SW.selected_file_keys = '';
SW.selected_file_nids = [];
SW.selected_file_titles = [];

SW.selected_job_items = '';
SW.selected_job_types = '';
SW.selected_job_keys = '';
SW.selected_job_titles = [];
SW.selected_job_nids = [];

SW.selected_group_titles = [];
SW.selected_user_titles = [];
SW.selected_group_nids = [];
SW.selected_user_nids = [];

SW.selected_collaborator_titles = [];

SW.selected_resource_items = '';
SW.selected_resource_types = '';
SW.selected_resource_keys = '';

SW.current_user = '';
SW.current_user_email = '';

SW.hostname = 'localhost';
SW.port = '1337';

/* These variables describe the current user. They are set in the ready event in main.js. */
SW.current_user_uuid = '';
SW.current_user_email = '';
SW.current_user_name = '';
SW.current_user_number = '';
SW.current_user_username = '';


SW.fileScratchPrefix = 'widow1|scratch';
SW.fileProjPrefix = 'widow1|proj';


SW.feedOn = false;

