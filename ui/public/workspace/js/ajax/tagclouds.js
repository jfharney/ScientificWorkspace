$(document).ready(function() {
  console.log('Inside the ready event in tagclouds.js.');

  var uid = SW.current_user_number;
  
  var tags_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/tags?';
  var tagLinks_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/tags/links/';
	
  // First we get an array of all the tags owned by the current user. 
  $.ajax({
    type: "GET",
	url: tags_url_prefix + 'uid=' + uid,
	success: function(data) {
      var tagsArr = [];
      tagsArr = JSON.parse(data);
      
      $.each(tagsArr, function(index, element) {
    	var tagName = element['name']
    	var tagNid = element['nid'];
    	
  	    // Then, for each tag nid in the given array, we query its links. To start with, we need only a count of the links.
    	$.ajax({
    	  type: "GET",
    	  url: tagLinks_url_prefix + tagNid,
    	  success: function(data) {
    		var linksArr = [];
    		linksArr = JSON.parse(data);
    		var linkCount = linksArr.length;
    		//console.log(index + ': ' + tagName + '('+tagNid+') has length ' + linkCount);
    		
    		if(linkCount > 0) {
    		  var fontSize = 8;
    		  var $tagcloud = $('<a class="tagcloud" id="'+tagNid+'" style="font-size:'+(fontSize+linkCount)+'px;cursor:pointer">'+tagName+'</a><span> </span>')
    		  /* Up to this point, we're good... */
    		  
    		    .on('click', function() {
                  $('div#tagCloudInfo').empty();
  			      $('div#tagCloudInfo').append('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Tag Name: '+$(this).text()+"</div>");
			      $('#cloud_info').append('<div># Objects: '+linkCount+'</div>');
			      $('#cloud_info').append('<ul id="tagContentsList">');
			      for(var i = 0; i < linkCount; i++) {
			    	var resName;
			    	var resNid = linksArr[i]['nid'];;
			    	var resType; 
			    	if(linksArr[i]['type'] == 2) {
			    	  resName = linksArr[i]['name'];
			    	  resType = 'job';
                      $lessLink = $('<span id="lessTagInfoSpan_'+resNid+'" style="display:none"><a style="cursor:pointer">less</a><br />&nbsp;&nbsp;&nbsp;Job ID: '+linksArr[i]['jid']+'<br />&nbsp;&nbsp;&nbsp;Started: '+formatTimestamp(linksArr[i]['start'])+'<br />&nbsp;&nbsp;&nbsp;Ended: '+formatTimestamp(linksArr[i]['stop'])+'</span>')
          			  .on("click", function() {
              			var pos = $(this).attr('id').indexOf('_');			// This line and the following aren't pretty, but are needed to get the correct resNid value.
              			resNid = $(this).attr('id').substring(pos+1);		// All they do is pull the nid value off the end of the element id. 
                        $('#moreTagInfoLink_'+resNid).css('display', 'inline'); 
                        $(this).hide();
                      });
                      $moreLink = $('<a id="moreTagInfoLink_'+resNid+'" style="cursor:pointer">more</a>')
          			  .on("click", function() {
            			var pos = $(this).attr('id').indexOf('_');
              			resNid = $(this).attr('id').substring(pos+1);
                        $('#lessTagInfoSpan_'+resNid).css('display', 'inline'); 
                        $(this).hide();
			    	  });
  					  $('#cloud_info').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
                      $('#tagResource_'+resNid).append($lessLink);
                      $('#tagResource_'+resNid).append($moreLink);
			    	}
			    	else if(linksArr[i]['type'] == 3) {
			    	  resName = linksArr[i]['nid'];		// Apps don't actually have names. 
			    	  resType = 'app';
                      $lessLink = $('<span id="lessTagInfoSpan_'+resNid+'" style="display:none"><a style="cursor:pointer">less</a><br />&nbsp;&nbsp;&nbsp;App ID: '+linksArr[i]['aid']+'<br />&nbsp;&nbsp;&nbsp;Started: '+formatTimestamp(linksArr[i]['start'])+'<br />&nbsp;&nbsp;&nbsp;Ended: '+formatTimestamp(linksArr[i]['stop'])+'</span>')
          			  .on("click", function() {
              			var pos = $(this).attr('id').indexOf('_');
              			resNid = $(this).attr('id').substring(pos+1); 
                        $('#moreTagInfoLink_'+resNid).css('display', 'inline'); 
                        $(this).hide();
                      });
                      $moreLink = $('<a id="moreTagInfoLink_'+resNid+'" style="cursor:pointer">more</a>')
          			  .on("click", function() {
            			var pos = $(this).attr('id').indexOf('_');
              			resNid = $(this).attr('id').substring(pos+1);
                        $('#lessTagInfoSpan_'+resNid).css('display', 'inline');
                        $(this).hide();
          			  });
					  $('#cloud_info').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
                      $('#tagResource_'+resNid).append($lessLink);
                      $('#tagResource_'+resNid).append($moreLink);
			    	}
			    	else if(linksArr[i]['type'] == 4) {
			    	  resName = linksArr[i]['name'];
				      resType = 'file';
			    	}
			    	else {
			    	  resName = linksArr[i]['nid'];
			    	  resType = 'other';
			    	}
					//console.log('resName: ' + resName + ', resType: ' + resType + ', resNid: ' + resNid);
			      }
    		    });
    		  
    		    
    		  
    		  
    		  
    		  
    		  $('#tagClouds').append($tagcloud);
    		}
    	  },
    	  error: function() {}
    	});
      });
	},		// End of success.
	error: function() {}
  });
            

});
      /*$.each(data, function(key, value) {
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
					  		'</a> <span> </span>').on( "click", function() {  
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
                        url: 'http://' + SW.hostname + ':' + SW.port + "/jobUuid/" + associations_data['associations'][i]['uuid'],
                        async: false,
                        success: function(resourceData) {
                          var jobName = resourceData['jobs'][0]['jobname'];
                          var jobId = resourceData['jobs'][0]['jobid'];
                          var jobGroupName =  resourceData['jobs'][0]['groupname'];
                          var jobUuid = resourceData['jobs'][0]['uuid'];
                          var jobStartDate = resourceData['jobs'][0]['starttime'];
                          var fJobStartDate = formatDate(jobStartDate);		// formatDate is defined below in this file.
                          $lessLink = $('<span id="lessTagInfoSpan_'+jobUuid+'" style="display:none"><a style="cursor:pointer">less</a><br />&nbsp;&nbsp;&nbsp;Job ID: '+jobId+'<br />&nbsp;&nbsp;&nbsp;Group: '+jobGroupName+'<br />&nbsp;&nbsp;&nbsp;Started: '+fJobStartDate+'</span>')
                          			  .on("click", function() {
                                        $('#moreTagInfoLink_'+jobUuid).css('display', 'inline'); 
                                        $(this).hide();
                                      });
                          $moreLink = $('<a id="moreTagInfoLink_'+jobUuid+'" style="cursor:pointer">more</a>')
                          			  .on("click", function() {
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
	  
	 
	  
	  
	  }); //end $.each(data, function(key, value)*/ 

  
  //$("#moreTagInfoLink").on("click", function() {alert("more was clicked!");});	Doesn't work.
//});


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
/*function formatDate(jobStartDate)
{
	var n = jobStartDate.indexOf('T');
	if(n != -1)
	  jobStartDate = jobStartDate.substring(0, n);
	return jobStartDate;
}*/

/* Taken from http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript */
function formatTimestamp(UNIX_timestamp) {
   var a = new Date(UNIX_timestamp * 1000);
   var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
   var year = a.getFullYear();
   var month = months[a.getMonth()];
   var date = a.getDate();
   var hour = a.getHours();
   var min = a.getMinutes();
   if(min.toString().length == 1)
	 min = '0'+min;
   var sec = a.getSeconds();
   if(sec.toString().length == 1)
     sec = '0'+sec;
   var time = month + ' ' + date + ', ' + year + '&nbsp;&nbsp;' + hour + ':' + min + ':' + sec ;
   
   return time;
}