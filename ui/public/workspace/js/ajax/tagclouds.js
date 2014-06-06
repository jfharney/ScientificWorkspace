$(document).ready(function() 
{
  var host = 'localhost';
  var port = '1337';

  /*
  var user_label = $('#user_info_id').html();
  var uid = user_label.trim();
  */
  //need to get the uid here
  //var uid = getUserFromModel();
  //MUST FIX!!!!
  
  
  
  var uid = '9328';
  
  var t_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/tags?';
  var a_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/associations?';
	
  $.ajax({
    type: "GET",
	url: t_url_prefix + 'uid=' + uid,
	success: function(data) 
	{
		
	  $.each(data, function(key, value) {
		  
		  
		  
		  
	    $.each(value, function(index, arVal) {
	    	
		  var tag_uuid = arVal['uuid'];
		  var tag_name = arVal['tagname'];
		  		
		  $.ajax({
		    type: "GET",
			url: a_url_prefix + 'edge=' + tag_uuid,
			success: function(associations_data) {
				
			
			  var associations_length = associations_data['associations'].length;
			  if(associations_length > 0) { 
			    var fontsize = 8;
			    $tagcloud = $('<a class="tagcloud" id="' + 
					  		tag_uuid + 
					  		'" style="font-size:' + 
					  		(fontsize + associations_length) + 
					  		'px; cursor:pointer">' + 
					  		tag_name + 
					  		'</a> <span> </span>').on( "click", function()   
			    {  
			      $('div#tagCloudInfo').empty();
			      $('div#tagCloudInfo').append('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Tag Name: ' + $( this ).text() + "</div>");
			      $('#cloud_info').append('<div># Objects: ' + associations_length + '</div>');
			      $('#cloud_info').append('<ul id="tagContentsList">');

				  // Get the various resources here.
				  for(var i = 0; i < associations_length; i++) {
					// Get the name of the resource, according to its type.
					var resType = associations_data['associations'][i]['type'];
					var resUuid = associations_data['associations'][i]['uuid'];
					if(resType == 'job') {
						$.ajax({
							type: "GET", 
							//url: "http://localhost:1337/jobUuid/" + associations_data['associations'][i]['uuid'],
							url: 'http://' + SW.hostname + ':' + SW.port + "/jobUuid/" + associations_data['associations'][i]['uuid'],
							async: false,
							success: function(resourceData) 
							{
								var jobName = resourceData['jobs'][0]['jobname'];
								var jobId = resourceData['jobs'][0]['jobid'];
								var jobGroupName =  resourceData['jobs'][0]['groupname'];
								var jobUuid = resourceData['jobs'][0]['uuid'];
								var jobStartDate = resourceData['jobs'][0]['starttime'];
								var fJobStartDate = formatDate(jobStartDate);		// formatDate is defined below in this file.
								$lessLink = $('<span id="lessTagInfoSpan_'+jobUuid+'" style="display:none"><a style="cursor:pointer">less</a><br />&nbsp;&nbsp;&nbsp;Job ID: '+jobId+'<br />&nbsp;&nbsp;&nbsp;Group: '+jobGroupName+'<br />&nbsp;&nbsp;&nbsp;Started: '+fJobStartDate+'</span>').on("click", function() {
									$('#moreTagInfoLink_'+jobUuid).css('display', 'inline'); 
									$(this).hide();
								});
								$moreLink = $('<a id="moreTagInfoLink_'+jobUuid+'" style="cursor:pointer">more</a>').on("click", function() {
									$('#lessTagInfoSpan_'+jobUuid).css('display', 'inline'); 
									$(this).hide();
								});
								$('#cloud_info').append('<li id="tagResource_'+jobUuid+'"><b>' + jobName + '</b> (job)&nbsp;</li><hr>');
								$('#tagResource_'+jobUuid).append($lessLink);
								$('#tagResource_'+jobUuid).append($moreLink);
							}, 
							error: function(e) {console.log('jobUuidHelper query failed.');}
						});
				  	}
					else if(resType == 'app') {
						$('#cloud_info').append('<li>' + associations_data['associations'][i]['uuid'] + ' (' + associations_data['associations'][i]['type'] + ')</li><hr>');
				  	}
				  }
				  $('#cloud_info').append('</ul>');
				  console.log($(this).text());
			    }); // End of the onClick for tag cloud elements.
			    $('#tagClouds').append($tagcloud);
			    
			  }
			  
			  
			  
			},
			error: function() {}
			
		  }); //end ajax
		 
		  
	    
	    }); //$.each(value, function(index, arVal) 
	  
	 
	  
	  
	  }); //end $.each(data, function(key, value) 
	  
	  
	},
	error: function() {}
  });
  
  //$("#moreTagInfoLink").on("click", function() {alert("more was clicked!");});	Doesn't work.
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

// Takes a string like 2014-02-05T17:56:23.000Z and returns 2014-02-05.  
function formatDate(jobStartDate)
{
	var n = jobStartDate.indexOf('T');
	if(n != -1)
	  jobStartDate = jobStartDate.substring(0, n);
	return jobStartDate;
}