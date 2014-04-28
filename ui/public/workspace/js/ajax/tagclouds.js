$(document).ready(function() 
{
  var host = 'localhost';
  var port = '1337';

  var user_label = $('#user_info_id').html();
  var uid = user_label.trim();
	
  var t_url_prefix = 'http://' + host + ':' + port + '/tags?';
  var a_url_prefix = 'http://' + host + ':' + port + '/associations?';
	
  $.ajax({
    type: "GET",
	url: t_url_prefix + 'uid=' + uid,
	success: function(data) 
	{
	  $.each(data, function(key, value) 
	  {
	    $.each(value, function(index, arVal) 
	    {
		  var tag_uuid = arVal['uuid'];
		  var tag_name = arVal['tagname'];
					
		  $.ajax({
		    type: "GET",
			url: a_url_prefix + 'edge=' + tag_uuid,
			success: function(associations_data) 
			{
			  var associations_length = associations_data['associations'].length;
			  var fontsize = 8;
			  $tagcloud = $('<a class="tagcloud" id="' + tag_uuid + '" style="font-size:' + (fontsize + associations_length ) + 'px">' + tag_name + '</a> <span> </span>').on( "click", function() 
			  {  
			    $('#tagCloudInfo').empty();
				$('#tagCloudInfo').append('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Objects tagged by: ' + $( this ).text() + "</div>");
								
				// Get the various resources here.
				for(var i = 0; i < associations_length; i++) {
				  $('#cloud_info').append('<div style="margin-top:5px;color: black">Resource: ' + associations_data['associations'][i]['uuid'] + ' (' + associations_data['associations'][i]['type'] + ')</div>');
				  $('#cloud_info').append('<hr>');
				}
			  });
			  $('#tagClouds').append($tagcloud);
			},
			error: function() {}
		  });
		});
	  });
	},
	error: function() {}
  });
	
  $( "#tagClouds a" ).on( "click", function() 
  {		  
    console.log( $( this ).text() );		  
  });
	
});


function getReducedArr(tag_name_arr) 
{
	console.log('in get reduced arr');
	
	var tag_names = new Array();
	var tag_counts = new Array();
	
	var tag_name = tag_name_arr[0];
	var tag_count = 0;
	for(var i=0; i < tag_name_arr.length; i++) {
		//console.log('tagname->' + tag_name);
		tag_count = tag_count+1;
		if(tag_name_arr[i] != tag_name) {
			tag_names.push(tag_name);
			tag_counts.push(tag_count);
			tag_name = tag_name_arr[i];
			tag_count = 0;
		}
	}

	tag_names.push(tag_name);
	tag_counts.push(tag_count);
	console.log('tag_names: ' + tag_names);
	return tag_names;
	
	//console.log('tag_counts: ' + tag_counts);
}

function getCountsArr(tag_name_arr) 
{
	console.log('in get counts');
	
	var tag_names = new Array();
	var tag_counts = new Array();
	
	var tag_name = tag_name_arr[0];
	var tag_count = 0;
	for(var i=0; i < tag_name_arr.length; i++) {
		//console.log('tagname->' + tag_name);
		tag_count = tag_count + 1;
		if(tag_name_arr[i] != tag_name) {
			tag_names.push(tag_name);
			tag_counts.push(tag_count);
			tag_name = tag_name_arr[i];
			tag_count = 0;
		}
	}

	tag_names.push(tag_name);
	tag_counts.push(tag_count);
	
	return tag_counts;
	//console.log('tag_names: ' + tag_names);
	//console.log('tag_counts: ' + tag_counts);
}
