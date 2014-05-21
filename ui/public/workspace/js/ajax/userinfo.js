

function getUserFromModel() {
	return user = $('#user_id_label').html();
}

//need a better way to extract the user (at least from the model)
function getUserFromURL(docurl) {
	
	
	//reverse
	var theChar = '';
	var revuser = '';
	var j = docurl.length-1;
	while(theChar != '/') {
		
		revuser += theChar;
		theChar = docurl[j];
		j--;
	}
	
	var user = '';
	for(var i=revuser.length-1;i>=0;i--) {
		
		user += revuser[i];
	}

	
	return user;
	
}




function postUserData(user_data,element) {
	var user_info_space = element;//'#user_info';
	
	$(user_info_space).empty();
	
	if(!jQuery.isEmptyObject(user_data)) {
		
		
		$(user_info_space).append('<div>username: ' + user_data['username']+ '</div>');
		$(user_info_space).append('<div>uid: <span id="user_info_id">' + user_data['uid']+ '</span></div>');
		$(user_info_space).append('<div>email: ' + user_data['email']+ '</div>');
		$(user_info_space).append('<div>firstname: ' + user_data['firstname']+ '</div>');
		$(user_info_space).append('<div>middlename: ' + user_data['middlename']+ '</div>');
		$(user_info_space).append('<div style="margin-bottom:10px">lastname: ' + user_data['lastname']+ '</div>');
		
		
	} else {
		
		$(user_info_space).append('<div>The user does not exist</div>');
		
	}
	
	
}





function getGroupInfo(uid) {
	
	//alert('uid: ' + uid);
	
	//groupinfo
	var url = 'http://localhost:1337/groupinfo/'+uid;
	var queryString = '';
	
	var groupsArr = '';
	
	//create the initial children
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		async: false,
		data: queryString,
		success: function(data) {
			console.log('success');
			groupsArr = data['groups'];
			
			
		},
		error: function() {
			console.log('error in getting group info');
		}
	});
	
	console.log('groups arr: ' + groupsArr);
	
	return groupsArr;
	
}




function getUserFromURL(docurl) {
	
	
	//reverse
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
	for(var i=revuser.length-1;i>=0;i--) {
		
		user += revuser[i];
	}

	console.log('user: ' + user);
	
	return user;
	
}

/*
function appendUserList() {
	
	
	var userlist = '';
	var url = 'http://localhost:1337/userlist';
	var queryString = '';
	$.ajax({
		url: url,
		global: false,
		type: 'GET',
		data: queryString,
		success: function(data) {
			//alert('success in getting userlist');
			
			//
			//console.log(data['users'].length);
			//for(var i=0;i<data['users'].length;i++) {
			//	var username = data['users'][i]['username'];
			//	if(username.length < 4 && username.charCodeAt(0) < 100) {
			//		console.log('username: ' + username + ' ' + username.charCodeAt(0));
			//		//$('ul.dropdown-menu').append('<li role="presentation"><a class="user_dropdown_list" role="menuitem" tabindex="-1" href="#" id="' + username + '">' + username + '</li>');
					
			//	}
				
			//}
			//
		},
		error: function() {
			alert('error');
		}
	});
	
}
*/


//gets all the information given a user

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
