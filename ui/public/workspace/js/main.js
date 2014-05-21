

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
			//getCollaboratorInfo(user_data['uid']);
			
			
			//get the file info here
			//type '1' is the hard coded file hierarchy
			//other types will be added later
			var type = '1';
			//getFileInfo(user_data['uid'],type);
			
			
			//get the jobs info here
			getJobInfo(user_data['username']);
			
			
			
			
			console.log('<><><>END MAIN<><><>')
			
			
		},
		error: function() {
			console.log('error in getting user id');
			

			console.log('<><><>END MAIN<><><>')
			
		}
	});
	
	
	
	
	
	
	/*
	var user_info_obj = '';
	
	console.log('user: ' + user);
	
	
	
	//populate the user space
	var user_data = getUserInfo(user);
	
	console.log('user_data: ' + user_data);
	
	//get the groups/collaborators here
	//getCollaboratorInfo(user_info_obj['uid']);
	*/
	
	
	
	
	
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