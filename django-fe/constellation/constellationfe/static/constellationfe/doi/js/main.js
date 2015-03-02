$(function() {
		
  var host = 'http://' + SW.hostname + ':' + SW.port + '/doi/';
	
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
		
		//$('#add_resouce_row').before('<div>hello</div>');
		$('#add_creator_row').before(html);
	
	});

	
    $('#submit_doi_request').click(function() {

    	//alert('submitting...');
        var data = {}

        // Scrape data from UI, place in object
        //data.uid = $('[name="input_uid"]').val();
        data.title = $('[name="input_title"]').val();
        data.description = $('[name="input_description"]').val();
        data.creator_name = $('[name="input_creator_name"]').val();
        data.creator_email = $('[name="input_creator_email"]').val();
        data.contact_email = data.creator_email;
        var contact_email = data.contact_email;
        data.resources = $('[name="input_resources"]').val();
        data.keywords = $('[name="input_keywords"]').val();
        data.language = $('[name="input_language"]').val();
        data.sponsor_org = $('[name="input_sponsor_org"]').val();
        data.files = $('[name="input_files"]').val();
        
        data.nids = $('[name="input_nids"]').val();
        data.nids = []
        $('li.nid').each(function( index ) {
        	console.log( 'index: ' + index + ' ' + $(this).html());
        	data.nids.push($(this).html());
        });
        
        //data.nids = data.nids.split(',');
        data.creator_nid = $('[name="creator_nid"]').val();

        data.personName = $('[name="personName"]').val();
        data.groupName = $('[name="groupName"]').val();
        // Submit to internal DOI submit service (proxy)
        // If OK, go somewhere (workspace?)
        // If NOT Ok, pop-up error dialog and stay here

        var payload = JSON.stringify( data );
        //payload = data;
        console.log('payload: ' + payload + '\n\n');
        //SW.current_user_name
        username = $('#creator_uname').html();
        var url = "http://" + SW.hostname + ":" + SW.port + "/constellation/doiPut/" + username + '/';

        //alert('data_nids: ' + data.nids);
        
        if (data.title == '' || data.title == undefined) {
          alert('Please enter a title for your DOI');
        } else {
        	jQuery.ajax({
                //url: 'http://' + SW.hostname + ':' + SW.port + '/doi_submit',
                url: url,
            	type: 'POST',
                data: data,
                //contentType: 'application/json; charset=utf-8',
                //dataType: "json",
                success: function(data) {
                    console.log('data returned (should be the DOI number): ' + data);
                    alert("DOI submission number " + data + " has succeeded.  An email has been sent to "+contact_email+" concerning this DOI.");
                    //alert('data: ' + data);
                    //take back to the workspace page
                    location.href = "http://" + SW.hostname + ":" + SW.port + "/constellation/workspace/" + username + '/';
                },
                error: function(request, status, error) {
                    alert("DOI submission failed.");
                    alert('request.responseText: ' + request.responseText);
                    console.log('DOI submission failed');
                    console.log('request.responseText: ' + request.responseText);
                    
                }
            });
            
        }
        
    });
	
	
	$('button#return').click(function() {
	  location.href = 'http://' + SW.hostname + ':' + SW.port + '/workspace/'+$('span#user_id_label').html();
    });
	
	
	
});