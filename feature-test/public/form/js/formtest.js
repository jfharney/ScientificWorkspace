$(function() {
	
  console.log('Ready event in formtest.js.');

  
  $('#submit_form').click(function() {
	 
	  console.log('submitting form');
	  
	  
	  var url = "http://" + "localhost" + ":" + "8001" + "/form/"; //+ username + "";
		

	  var input = '';
	  
	  //send request
	  jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
	    .appendTo('body').submit().remove();
	  
  });
  
});