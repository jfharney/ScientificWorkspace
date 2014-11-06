$(function() {
  console.log('<><><>MAIN<><><>');
  
  /* We transfer the current user data values stored in the document object to the 
   * SW object, defined in core.js.                                                    */
  SW.current_user_nid = $('#curUserNid').html();
  SW.current_user_email = $('#curUserEmail').html();
  SW.current_user_name = $('#curUserName').html();
  SW.current_user_number = $('#curUserNumber').html();
  SW.current_user_uname = $('#curUserUname').html();
  
  /* This function, defined in jobinfo.js, indirectly initializes the jobs tree. */
  getJobInfo(SW.current_user_number);
  
  /* This function is defined in ajax/groupinfo.js. */
  getCollaboratorInfo(SW.current_user_number);
  
  /* This function is defined in public/workspace/js/ajax/userinfo.js. */
  postUserData('#user_info');
  
  /* This function is defined in ajax/fileinfo.js. */
  getFileInfo(SW.current_user_number);
  
  /* This function is defined in ajax/doiTree.js. */
  getUserDoiData(SW.current_user_number);
	
  /* Enables the list box in the top right to change the current user. */
  /* (This feature will be admin-only in final version.) */
  var host = 'http://localhost:1337/workspace/';
  $('.user_dropdown_list').click(function() {
    var userName = $(this).html();
    location.href = host + userName;
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
    getCollaboratorInfo(SW.current_user_number, $('#collabSearchText').val());
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
  
  /* Jobs Panel *******************/
	  
  // Display the Jobs search panel when the jobs header or magnifying glass is clicked.
  $("#jobSearchIcon").on("click", function() {
    $("#jobsSearchPanel").slideToggle();
  });
	  
  // Take a provided search term and update the Jobs tree accordingly. 
  $("#jobsSearchButton").on("click", function() {
    getJobInfo(SW.current_user_number, $('#jobsSearchText').val());
    $("#jobs_tree").dynatree("getTree").reload();
    $("#jobsSearchPanel").slideToggle();
  });
	  
  /* Clicking the Clear button will: 
     1. Clear the text out of the search box.
     2. Restore the jobs tree to its default state.
     3. Hide the search box. */ 
  $("#clearJobsSearchTextButton").on("click", function() {
    $("#jobsSearchText").val('');
    getJobInfo(SW.current_user_number, '');					/* See ajax/jobinfo.js for this function. */
    $("#jobs_tree").dynatree("getTree").reload();
    $("#jobsSearchPanel").slideToggle();
  });
  
  

  //put the selected collaborators in the hidden input fields (may be deprecated)
  $('#search_view').click(function() {
	  
	  var url = "http://" + "localhost" + ":" + "1337" + "/search/" + SW.current_user_uname + "";
		
	  var input = '';
	  
	  //send request
	  jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
	     .appendTo('body').submit().remove();
  }) ;
  
  
  renderTagCloud();		// defined in tagclouds.js
  displayAggregateTagWorkspaceButtons(); // to initially hide the tag workspace buttons
  

});		// End of Ready event.

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

