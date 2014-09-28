$(function() {
		
  var host = 'http://localhost:1337/doi/';
	
  /* Change user option (admin only) */
  $('.user_dropdown_list').click(function() {
    var userName = $(this).html();
    location.href = host + userName;
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
		
	$('#add_resouce_row').before(html);
		
  });
	
  $('#add_keyword_button').click(function() {
		
    var html = '';
		
	html+='<div class="row-fluid">'
	html+='  <div class="span4">Keyword</div>';
	html+='  <div class="span6">';
	html+='    <input id="text" name="resource_input" value="" />';
	html+='  </div>';
    html+='</div>';
    
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
        //console.log( "submit DOI!" );

        var data = {}

        // Scrape data from UI, place in object
        //data.uid = $('[name="input_uid"]').val();
        data.title = $('[name="input_title"]').val();
        data.description = $('[name="input_description"]').val();
        data.creator_name = $('[name="input_creator_name"]').val();
        data.creator_email = $('[name="input_creator_email"]').val();
        data.contact_email = data.creator_email;
        data.resources = $('[name="input_resources"]').val();
        data.keywords = $('[name="input_keywords"]').val();
        data.language = $('[name="input_language"]').val();
        data.sponsor_org = $('[name="input_sponsor_org"]').val();
        data.files = $('[name="input_files"]').val();
        
        data.nids = $('[name="input_nids"]').val();
        data.nids = data.nids.split(',');
        data.creator_nid = $('[name="creator_nid"]').val();
        /*
        data.file_nids = $('[name="file_nids"]').val();
        data.group_nids = $('[name="group_nids"]').val();

        data.tag_nids = $('[name="tag_nids"]').val();
        */
        
        //console.log( "scraped" );
        //console.log( data );
        data.personName = $('[name="personName"]').val();
        data.groupName = $('[name="groupName"]').val();
        // Submit to internal DOI submit service (proxy)
        // If OK, go somewhere (workspace?)
        // If NOT Ok, pop-up error dialog and stay here

        var payload = JSON.stringify( data );
        //console.log( "payload: " + payload + "\n");

        jQuery.ajax({
            url: "http://localhost:1337/doi_submit",
            type: 'POST',
            data: data,
            dataType: "json",
            success: function(data) {
                alert("DOI submission succeeded.");
            },
            error: function() {
                alert("DOI submission failed.");
            }
        });
    });
	
	
	$('button#return').click(function() {
	  location.href = 'http://localhost:1337/workspace/'+$('span#user_id_label').html();
    });
	
	
	
});