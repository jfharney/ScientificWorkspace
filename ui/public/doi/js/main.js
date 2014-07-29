

$(function(){
	
	
	var host = 'http://localhost:1337/workspace/';
	
	
	//changing user option
	$('.user_dropdown_list').click(function(){
		//alert('user dropdown');
		var userName = $(this).html();
		location.href=host+userName;
		
	});
	
	
	$('#add_resource_button').click(function() {
		
		
		var html = '';
		
		html+='<div class="row-fluid">'
		
		html+='  <div class="span4">Resource</div>';
		
		html+='  <div class="span6">';
		html+='    <input id="text" name="resource_input" value="" />';
		html+='  </div>';
		
		
		html+='  <div class="span2">';
		html+='    <a class="metadata" href="#">metadata</a>';
		html+='  </div>';
		
		html+='</div>';
		
		//alert('html: ' + html);
		//$('#add_resouce_row').before('<div>hello</div>');
		$('#add_resouce_row').before(html);
		
	});
	
	$('#add_keyword_button').click(function() {
		
		
		var html = '';
		
		html+='<div class="row-fluid">'
		
		html+='  <div class="span4">Keyword</div>';
		
		html+='  <div class="span6">';
		html+='    <input id="text" name="resource_input" value="" />';
		html+='  </div>';
		
		/*
		html+='  <div class="span2">';
		html+='    <a class="metadata" href="#">metadata</a>';
		html+='  </div>';
		*/
		html+='</div>';
		
		//alert('html: ' + html);
		//$('#add_resouce_row').before('<div>hello</div>');
		$('#add_keyword_row').before(html);
		
	});

	$('#add_creator_button').click(function() {
	
	
		var html = '';

		html+='<div class="row-fluid">'
		
		html+='  <div class="span4">Co-creator</div>';
		
		html+='  <div class="span6">';
		html+='    <input id="text" name="co_creator_input" value="" />';
		html+='  </div>';
		
		/*
		html+='  <div class="span2">';
		html+='    <a class="metadata" href="#">metadata</a>';
		html+='  </div>';
		*/
		html+='</div>';
		
		html+='<div class="row-fluid">'
			
		html+='  <div class="span4">Co-creator email</div>';
		
		html+='  <div class="span6">';
		html+='    <input id="text" name="co_creator_email_input" value="" />';
		html+='  </div>';
		
		/*
		html+='  <div class="span2">';
		html+='    <a class="metadata" href="#">metadata</a>';
		html+='  </div>';
		*/
		html+='</div>';
		
		//alert('html: ' + html);
		//$('#add_resouce_row').before('<div>hello</div>');
		$('#add_creator_row').before(html);
	
	});

	
	$('#submit_doi_request').click(function() {
	
		
		
		
		
		alert('submitting doi request');
		
		
		
	});
	
	
	
	
	
	
});