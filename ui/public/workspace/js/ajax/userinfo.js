// postUserData is called in main.js, where element is the string '#user_info'.
// This function populates the User Info section of the Info pane at bottom of main page.
function postUserData(element) {
	var user_info_space = element;
	
	$(user_info_space).empty();
	
	if(SW != undefined) {
		$(user_info_space).append('<div>username: ' + SW.current_user_username + '</div>');
		$(user_info_space).append('<div>uid: <span id="user_info_id">' + SW.current_user_number + '</span></div>');
		$(user_info_space).append('<div>email: ' + SW.current_user_email + '</div>');
		$(user_info_space).append('<div>firstname: ' + SW.current_user_firstname + '</div>');
		$(user_info_space).append('<div>middlename: ' + SW.current_user_middlename + '</div>');
		$(user_info_space).append('<div style="margin-bottom:10px">lastname: ' + SW.current_user_lastname + '</div>');
	} 
	else {
		$(user_info_space).append('<div>The user does not exist</div>');
	}
}



function getUserFromURL(docurl) {

	var theChar = '';
	var revuser = '';
	var j = docurl.length-1;
	while(theChar != '/') {		
		revuser += theChar;
		theChar = docurl[j];
		j--;
	}
	console.log('user: ' + revuser);
	
	var user = '';
	for(var i = revuser.length-1; i >=0 ;i--) {
		user += revuser[i];
	}
	
	return user;
}


/* Gets all the information given a user. */
function getUserInfo(user) {
	var url = 'http://localhost:1337/userinfo/'+user;
	var queryString = '';
	
	var data = '';
	
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		async: false,
		data: queryString,
		success: function(data) {
			
			//console.log(data);
			
			//console.log(jQuery.isEmptyObject(data));
			
			alert('data: ' + data);
			
			
			user_info_obj = data;
			for(var key in data) {
				console.log('user key: ' + key);
			}
			
			var user_info_space = '#user_info';
			
			$(user_info_space).empty();
			
			if(!jQuery.isEmptyObject(user_info_obj)) {
				
				
				$(user_info_space).append('<div>username: ' + data['username']+ '</div>');
				$(user_info_space).append('<div>uid: <span id="user_info_id">' + data['uid']+ '</span></div>');
				$(user_info_space).append('<div>email: ' + data['email']+ '</div>');
				$(user_info_space).append('<div>firstname: ' + data['firstname']+ '</div>');
				$(user_info_space).append('<div>middlename: ' + data['middlename']+ '</div>');
				$(user_info_space).append('<div style="margin-bottom:10px">lastname: ' + data['lastname']+ '</div>');
				
				
			} else {
				
				$(user_info_space).append('<div>The user does not exist</div>');
				
			}
			
			return data;
			
			
		},
		error: function() {
			console.log('error in getting user id');
			data = null;
		}
	});
	
	
	
}
