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