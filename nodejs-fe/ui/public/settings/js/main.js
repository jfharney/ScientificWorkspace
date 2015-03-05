// ScientificWorkspace/ui/public/settings/js/main.js

$(function() {

  var host = 'http://localhost:1337/workspace/';

  /* Changing user option. */
  $('.user_dropdown_list').click(function() {
    var userName = $(this).html();
    location.href=host+userName;
		
  });
  
  /* When the page loads, it needs to read a set of cookies to determine
   * how to set its various fields.
   *  
   * 1. If the cookie is not defined, there should be a default value specified
   *    for the setting of the field. 
   * 2. If the cookie is defined, the field should be set according to the cookie.
   * 
   * Another important property of these cookies is that they must be visible not
   * only to the current page (settings.jade) but to the page index1.jade. 
   */
   
  var visibilityObj = {};
  getVisibilityCookies(visibilityObj);
  console.log('Cookie collabVis is set to ' + visibilityObj['collabVis']);
  console.log('Cookie projectsVis is set to ' + visibilityObj['projectsVis']);
  
  if(visibilityObj['collabVis'] == undefined || visibilityObj['collabVis'] == 'true' || visibilityObj['collabVis'] == '')
	$('#collabVisibilityCheckbox').prop('checked', true);
  else
	$('#collabVisibilityCheckbox').prop('checked', false);
  
  if(visibilityObj['projectsVis'] == undefined || visibilityObj['projectsVis'] == 'true' || visibilityObj['projectsVis'] == '')
	$('#projectSpaceVisibilityCheckbox').prop('checked', true);
  else
	$('#projectSpaceVisibilityCheckbox').prop('checked', false);
}); /* End of the document ready event. */

$('#saveViewingOptionsButton').on('click', function() {
  if($('#collabVisibilityCheckbox').attr('checked'))
	document.cookie = 'collabVis=true; path=/';
  else
	document.cookie = 'collabVis=false; path=/';
  if($('#projectSpaceVisibilityCheckbox').attr('checked'))
	document.cookie = 'projectsVis=true; path=/';
  else
	document.cookie = 'projectsVis=false; path=/';
});

/* This function sets the object visibilityObj to represent the values of the document cookie. */
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

/* This function is associated with the Clear Settings button and is not intended 
 * for the final version of the application. */
function clearVisCookies() {
  document.cookie = "collabVis=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; 
}