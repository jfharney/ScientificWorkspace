

$(function(){
	
	
	var host = 'http://localhost:1337/workspace/';
	
	
	//changing user option
	$('.user_dropdown_list').click(function(){
		//alert('user dropdown');
		var userName = $(this).html();
		location.href=host+userName;
		
	});
	
	
});