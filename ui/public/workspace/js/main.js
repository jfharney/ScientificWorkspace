$(function() {
	
  var hostname = SW.hostname;
  var port = SW.port;
  var userNumber;
	
  console.log('<><><>MAIN<><><>');
	
  // Get user info first (synchronous call needed by everyone else).
  var userName = getUserFromModel();
	
  var url = 'http://' + SW.hostname + ':' + SW.port + '/userinfo/' + userName;
  console.log("The value of user is " + user);
  var queryString = '';
  var data = '';
	
  // This function, defined in jobinfo.js, indirectly initializes the jobs tree. 
  getJobInfo(userName);
	
  //callback hell ... need to include the userinfo in the model to avoid this particular ajax call
  $.ajax({
    url: url,
    //global: false,
	type: 'GET',
	data: queryString,
	success: function(user_data) {
      var element = '#user_info';
			
	  // postUserData is defined in userinfo.js. 
	  postUserData(user_data, element);
			
	  // Get the groups/collaborators here. Note we are passing the user number.
	  // getCollaboratorInfo is defined in groupinfo.js. 
	  getCollaboratorInfo(user_data['uid']);
	  userNumber = user_data['uid']; // Value of userNumber is set here because user_data will go out of scope. 
				
	  // Get the file info here.
	  // Type '1' is the hard coded file hierarchy.
	  // Other types will be added later.
	  var type = '1';
	  getFileInfo(user_data['uid'],type);

	  console.log('<><><>END MAIN<><><>')
    },
	error: function() {
	  console.log('error in getting user id');
	  console.log('<><><>END MAIN<><><>')
	}
  });
	
	
  /* Enables the list box in the top right to change the current user. */
  /* (This feature will be admin-only in final version.) */
  var host = 'http://localhost:1337/workspace/';
  $('.user_dropdown_list').click(function() {
    var userName = $(this).html();
    location.href = host+userName;
  });
  
  /* Check cookies to see if each panel should be displayed (per user preference). */
  var visibilityObj = {};
  getVisibilityCookies(visibilityObj);
	  
  /* Collaborators Panel **********/
  
  if(visibilityObj['collabVis'] == 'false')
	$('#collabBox').hide();
	  
  /* Display the Collaborators search panel when the header or magnifying glass is clicked. */
  $("#collabSearchIcon").on("click", function() {
    $("#collabSearchPanel").slideToggle();
  });

  /* Take a provided search term and update the Collaborators tree accordingly. */ 
  $("#collabSearchButton").on("click", function() {
    $("#collaborators_tree").dynatree("destroy");
    getCollaboratorInfo(userNumber, $('#collabSearchText').val());
    $("#collabSearchPanel").slideToggle();
  });
	  
  /* Clicking the Clear button will: 
	 1. Clear the text out of the search box.
	 2. Restore the jobs tree to its default state.
	 3. Hide the search box. */ 
  $("#clearCollabSearchTextButton").on("click", function() {
    $("#collabSearchText").val('');
    $("#collaborators_tree").dynatree("destroy");
    getCollaboratorInfo(userNumber, '');				/* See ajax/groupinfo.js for this function. */
    $("#collabSearchPanel").slideToggle();
  });

  /* Project Space Panel **********/
  
  /* Check the cookie to see if the panel should be visible. */
  if(visibilityObj['projectsVis'] == 'false')
	$('#projectsBox').hide();
  
  /* Jobs Panel **********/
	  
  // Display the Jobs search panel when the jobs header or magnifying glass is clicked.
  $("#jobSearchIcon").on("click", function() {
    $("#jobsSearchPanel").slideToggle();
  });
	  
  // Take a provided search term and update the Jobs tree accordingly. 
  $("#jobsSearchButton").on("click", function() {
    getJobInfo(userName, $('#jobsSearchText').val());
    $("#jobs_tree").dynatree("getTree").reload();
    $("#jobsSearchPanel").slideToggle();
  });
	  
  /* Clicking the Clear button will: 
     1. Clear the text out of the search box.
     2. Restore the jobs tree to its default state.
     3. Hide the search box. */ 
  $("#clearJobsSearchTextButton").on("click", function() {
    $("#jobsSearchText").val('');
    getJobInfo(userName);								/* See ajax/jobinfo.js for this function. */
    $("#jobs_tree").dynatree("getTree").reload();
    $("#jobsSearchPanel").slideToggle();
  });
	  
  
  /* Register a hover card for each Job tree node. */
  /*$('a.dynatree-title').on('hover', function() {
	  alert(this.title);
  });*/
  
  var hoverHTMLDemoCallback = '<p style="z-index: 1000">Here is the paragraph tag.</p>'; 
  $('.dynatree-title').hovercard({
    detailsHTML: hoverHTMLDemoCallback,
    width: 300,
    onHoverIn: function() {
      console.log('hoverin over job element.');
    }
  });
});

/* This function sets the object visibilityObj to represent the values of the document cookie. 
 * This exact same function appears in both public/js/settings/js/main.js and 
 * public/workspace/js/main.js. This arrangement is undesirable, but necessary at this time. */
function getVisibilityCookies(visibilityObj) {
  cookieArr = document.cookie.split(';');
  for(var i = 0; i < cookieArr.length; i++) {
	/* We split each cookie into a 2-element array. */
	var cookie = cookieArr[i].split('=');
	if(cookie[0].trim() == 'collabVis') {
	  visibilityObj.collabVis = cookie[1];
	}
	if(cookie[0].trim() == 'projectsVis') {
	  visibilityObj.projectsVis = cookie[1];
	}
	else {}
  }
}