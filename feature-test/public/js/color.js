$(document).ready(function()
{			
  /*var obj = {	'a' : 'astring',
				'b' : 'bstring',
				'c' : 'cstring',
				'd' : 'dstring',
				'f' : {'e' : 'estring'}
			};*/
			
  /*for(var i in obj)
  if(typeof i == 'string')
    console.log(i + ": " + obj[i]);
  else
	console.log(i + ": " + obj[obj[i]]);*/
	
  /*if($('#hiddenField').val() != 'undefined')	
    alert($('#hiddenField').val());*/
	
  alert($('#header').attr('style'));

  $('#button1').click(function() 
  {
	var color = $('#text1').val();
	var url = 'http://localhost:8001/groups?color=' + color;
	$.ajax({  type: "GET",
			  url: url,
			  success: function(data)
			  {
			    console.log('success ' + data);
				$('#main').append(data);
				$('#header').css('color', color);
			  },
			  error: function(xhr, status, error) 
			  		 {
					   console.log('error'); 
					   if(xhr.status==404)
					   { 
					    	
					   }  
			  		 }
			});
		  });
});