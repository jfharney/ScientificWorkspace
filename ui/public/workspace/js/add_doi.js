

  $(document).ready(function(){

	  
	  $('#create_doi_button').click(function() {

		  console.log('create doi');

		  
          var selected_file_items = new Array();
          var selected_file_types = new Array();
          var selected_file_keys = new Array();
          
          var selected_job_items = new Array();
          var selected_job_types = new Array();
          
		  if(SW.selected_file_items != '') {
			  selected_file_items = SW.selected_file_items.split(', ');
		  }
		  if(SW.selected_file_types != '') {
			  selected_file_types = SW.selected_file_types.split(', ');
		  }
		  if(SW.selected_file_keys != '') {
			  selected_file_keys = SW.selected_file_keys.split(', ');
		  }


		  if(SW.selected_job_items != '') {
			  selected_job_items = SW.selected_job_items.split(', ');
		  }

		  if(SW.selected_job_types != '') {
			  selected_job_types = SW.selected_job_types.split(', ');
		  }


		  //alert('selected_file_items: ' + selected_file_items);
		  //alert('selected_file_types: ' + selected_file_types);
		  //alert('selected_file_keys: ' + selected_file_keys);
		  
		  
			var docurl = document.URL;
			
			var user = getUserFromModel();//getUserFromURL(docurl);
			
			
			
			//get user info first (synchronous call needed by everyone else)

			var url = 'http://' + SW.hostname + ':' + SW.port + '/userinfo/' + user;
			
			var queryString = '';
			
			var data = '';
			
			//callback hell ... need to include the userinfo in the model to avoid this particular ajax call
			$.ajax({
				url: url,
				//global: false,
				type: 'GET',
				data: queryString,
				success: function(user_data) {
					

					
					var input = '';
					//put the user data in the hidden input fields
					input += addUserData(user_data);
					
					//put the selected file keys in the hidden input fields
					input += addResources(selected_file_items);
					
					//put the selected apps/jobs in the hidden input fields
					input += addJobs(selected_job_items);
					
					
					
					//put the selected collaborators in the hidden input fields (may be deprecated)
					  
					
					//alert('input: ' + input);
					
					url = "http://" + "localhost" + ":" + "1337" + "/doi/" + user + "";
					
					//send request
			        jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
			        .appendTo('body').submit().remove();
			    	
					
					
					
				},
				error: function() {
					
				}
			});
			
		  
	  });
	  
  
	  
          


  });

  
  function addUserData(user_data) {
	  var input = '';
	  
	  if(user_data['firstname'] == null || user_data['firstname'] == 'NULL') {
		  user_data['firstname'] = '';
	  }
	  if(user_data['middlename'] == null || user_data['middlename'] == 'NULL') {
		  user_data['middlename'] = '';
	  }
	  if(user_data['lastname'] == null || user_data['lastname'] == 'NULL') {
		  user_data['lastname'] = '';
	  }
	  
	  //default is the current username
	  //get username and email of current user here
	  var creator_name = user_data['firstname'] + ' ' + user_data['middlename'] + ' ' + user_data['lastname'];
	  var creator_email = user_data['email'];
	
	  //add creators and creator emails to the url
	  //so far, we are assuming that the current user is the only "creator"
	  var creators = [];
	  creators.push(creator_name);
	  
	  var creators_email = [];
	  creators_email.push(creator_email);
	  
	  for(var i=0;i<creators.length;i++) {
		  input+='<input type="hidden" name="'+ 'creator' +'" value="'+ creators[i] +'" />';
		  input+='<input type="hidden" name="'+ 'creator_email' +'" value="'+ creators_email[i] +'" />';
	  }
	  
	  
	  return input;
  }

  function addJobs(selected_job_items) {
	  var input = '';
	  for(var i=0;i<selected_job_items.length;i++) {
		input+='<input type="hidden" name="'+ 'job' +'" value="'+ selected_job_items[i] +'" />';
	  }
      return input;
  }
  
  function addResources(selected_file_items) {
	var input = '';
	for(var i=0;i<selected_file_items.length;i++) {
		  //console.log('selected_file_key=' + selected_file_keys[i]);  
		//input+='<input type="hidden" name="'+ key +'" value="'+ user_data[key] +'" />';
		input+='<input type="hidden" name="'+ 'resource' +'" value="'+ selected_file_items[i] +'" />';
	}
	return input;
  }
                            	  
                            	  
                            	  
                            	  
                            	  
                            	  
