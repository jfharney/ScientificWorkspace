$(function() {
	
	var hostname = SW.hostname;
	var port = SW.port;
	
	console.log('<><><>MAIN<><><>');
	
	//get user info first (synchronous call needed by everyone else)
	var user = getUserFromModel();
	
	//var url = 'http://localhost:1337/userinfo/'+user;
	var url = 'http://' + SW.hostname + ':' + SW.port + '/userinfo/' + user;
	
	var queryString = '';
	
	var data = '';
	
	//callback hell ... need to include the userinfo in the model to avoid this particular ajax call
	$.ajax({
		url: url,
		//global: false,
		// "Whether to trigger global Ajax event handlers for this request. The default 
		// is true. Set to false to prevent the global handlers like ajaxStart or ajaxStop 
		// from being triggered. This can be used to control various Ajax Events."
		type: 'GET',
		data: queryString,
		success: function(user_data) {
			
			var element = '#user_info';
			
			// Mark 5-22-14
			SW.current_user_id = user_data['uid'];
			console.log('SW.current_user_id is ' + SW.current_user_id);
			
			// postUserData is defined in userinfo.js. 
			postUserData(user_data, element);
			
			
			// Get the groups/collaborators here.
			//getCollaboratorInfo(user_data['uid']);
			
			
			//get the file info here
			//type '1' is the hard coded file hierarchy
			//other types will be added later
			var type = '1';
			getFileInfo(user_data['uid'],type);
			
			
			//get the jobs info here
			getJobInfo(user_data['username']);
			
			
			
			
			console.log('<><><>END MAIN<><><>')
			
			
		},
		error: function() {
			console.log('error in getting user id');
			

			console.log('<><><>END MAIN<><><>')
			
		}
	});
	
	
	  // Enables the list box in the top right to change the current user.
	  // (Not to be included in final version.)
	  var host = 'http://localhost:1337/workspace/';
	  $('.user_dropdown_list').click(function() {
		var userName = $(this).html();
		location.href=host+userName;
	  });
	
	
	
	
	  // Attach the following event to the search button click.
	  $("#jobSearchIcon").on("click", function() {
		$("#jobSearchFields").slideToggle();
	  });
	  
	  $("#jobsRefreshButton").on("click", function() {
		  
		  //at the risk of introducing a race condition, need to get the username via an ajax call here
		  //MUST FIX by passing the username as part of the model to the browser
		  
		  var url = 'http://localhost:1337/userinfo/'+user;
		  var queryString = '';
			
		  var data = '';
			
			//callback hell ... need to include the userinfo in the model to avoid this particular ajax call
			$.ajax({
				url: url,
				global: false,
				type: 'GET',
				data: queryString,
				success: function(user_data) {
					
					for(var key in user_data) {
						console.log('user key: ' + key);
					}
					
					getJobInfo(user_data['username'], $('#jobsSearchText').val());
					$("#jobss_tree").dynatree("getTree").reload();
					$("#jobSearchFields").slideToggle();
					
				},
				error: function() {
					
					console.log('error in getting user id');
					
					console.log('<><><>END MAIN<><><>')
					
				}
			});
		  
		  
		  
	  });
	  
	  // Clicking the Clear button should: 
	  // 1. Clear the text out of the search box.
	  // 2. Restore the jobs tree to its default state.
	  // 3. Hide the search box. 
	  $("#clearJobsSearchButton").on("click", function()
	  {
	    console.log("Clicking the clear button.");
		$("#jobsSearchText").val('');
		getJobInfo(user_info_obj['username'], $('#jobsSearchText').val());
		$("#jobss_tree").dynatree("getTree").reload();
		$("#jobSearchFields").slideToggle();
	  });
	
	
	
	
	  
	  //$('#myform').submit();
	
	
	
});
