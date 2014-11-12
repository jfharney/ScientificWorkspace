$(function() {
	
  console.log('Ready event in formtest.js.');

  
  $('#submit_form').click(function() {
	 
	  console.log('submitting form');
	  
	  
	  var url = "http://" + "localhost" + ":" + "8001" + "/form3/"; //+ username + "";
		

	  var input = '';
	  
	  var key = 'key';
	  
	  var alert = 'var k = 0;';
	  
	  var value = '<script>' + alert + '</script>';
	  
	  var host = '';
	  var port = '';
	  
	  input += '<input type="hidden" name="'+ key +'" value="'+ value +'" />';
	  
	  //alert('input: ' + input);
	  
	  //send request
	  jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
	    .appendTo('body').submit().remove();
	  
  });
  
});