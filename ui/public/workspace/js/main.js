

$(function(){
	
	var hostname = SW.hostname;
	
	var port = SW.port;
	
	
	console.log('<><><>MAIN<><><>');
	
	
	//get user info first (synchronous call needed by everyone else)
	var user = getUserFromModel();
	
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
			
			var element = '#user_info';

			
			
			postUserData(user_data,element);
			
			

			//get the groups/collaborators here
			getCollaboratorInfo(user_data['uid']);
			
			
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
	
	
	
	
	
	
	
	
	// I don't really know where the best place to do this is.
	  // Attach the following event to the search button click.
	  $("#jobSearchIcon").on("click", function()
	  {
		$("#jobSearchFields").slideToggle();
	  });
	  
	  $("#jobsRefreshButton").on("click", function()
	  {
		  
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
	  $("#clearJobsSearchButton").on("click", function()
	  {
	    console.log("Clicking the clear button.");
		$("#jobsSearchText").val('');
		getJobInfo(user_info_obj['username'], $('#jobsSearchText').val());
		$("#jobss_tree").dynatree("getTree").reload();
		$("#jobSearchFields").slideToggle();
	  });
	
	
	
	
	
	
	
});













/*
=======
// The only thing going on here is the ability to change the current user
// of the application.
$(function()
{
  var host = 'http://localhost:1337/workspace/';
  $('.user_dropdown_list').click(function()
  {
	var userName = $(this).html();
	location.href=host+userName;
  });
});
>>>>>>> devel-practice-mark
*/