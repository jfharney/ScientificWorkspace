/* The code in this file is concerned with populating the tag cloud. For better or worse, it has 
 * remained in its own ready event. 
 */

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
        var tagDesc = element['desc'];
    	
  	    // Then, for each tag nid in the given array, we query its links. To start with, we need only a count of the links.
        $.ajax({
    	  type: "GET",
    	  url: tagLinks_url_prefix + tagNid,
    	  success: function(data) {
    		var linksArr = [];
    		linksArr = JSON.parse(data);
    		var linkCount = linksArr.length;
    		
    		if(linkCount > 0) {
    		  var fontSize = 8;
    		  var $tagcloud = $('<a class="tagcloud" id="'+tagNid+'" style="font-size:'+
    				           (fontSize+linkCount)+'px;cursor:pointer" title="'+tagDesc+'">'+tagName+'</a><span> </span>')
    		    .on('click', function() {
                  $('div#tagCloudInfo').empty();
  			      $('div#tagCloudInfo').append('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Tag Name: '+
  			    		                       $(this).text()+"</div>");
			      $('#cloud_info').append('<div># Objects: '+linkCount+'</div>');
			      $('#cloud_info').append('<div>Description: '+tagDesc+'</div>');
			      $('#cloud_info').append('<ul id="tagContentsList">');
			      
			      SW.resetTaggedFields();				/* Reset the tagged fields. */
			      var linked_nids = new Array();
			      
			      // Now we iterate through the links. 
			      for(var i = 0; i < linkCount; i++) {
			    	var resName, resType;
			    	var resNid = linksArr[i]['nid'];
			    	linked_nids.push(resNid);
                    
			    	if(linksArr[i]['type'] == 0) {				/* the USER type */
				      resName = linksArr[i]['name'];
				      resType = 'user';
				      SW.tagged_person_names.push(resName);
	                  $lessLink = $('<span id="lessTagInfoSpan_'+resNid+
	                		        '" style="display:none"><a style="cursor:pointer">less</a><br />&nbsp;&nbsp;&nbsp;Email: '+
	                		        linksArr[i]['email']+'<br />&nbsp;&nbsp;&nbsp;Uid: '+linksArr[i]['uid']+'</span>')
	          			.on("click", function() {
	          			  resNid = getNidValue($(this).attr('id'));
	                      $('#moreTagInfoLink_'+resNid).css('display', 'inline'); 
	                      $(this).hide();
	                    });
	                  $moreLink = $('<a id="moreTagInfoLink_'+resNid+'" style="cursor:pointer">more</a>')
	          			.on("click", function() {
                          resNid = getNidValue($(this).attr('id'));
	                      $('#lessTagInfoSpan_'+resNid).css('display', 'inline'); 
	                      $(this).hide();
				    	});
	                  $('#cloud_info').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
	                  $('#tagResource_'+resNid).append($lessLink);
	                  $('#tagResource_'+resNid).append($moreLink);
				    }
			    	
			    	else if(linksArr[i]['type'] == 1) {			/* the GROUP type */
					  resName = linksArr[i]['gname'];
					  resType = 'group';
					  SW.tagged_group_names.push(resName);
		  			  $('#cloud_info').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
					}
			    	
			    	else if(linksArr[i]['type'] == 2) {			/* the JOB type */
			    	  resName = linksArr[i]['name'];
			    	  resType = 'job';
			    	  SW.tagged_job_names.push(resName);
                      $lessLink = $('<span id="lessTagInfoSpan_'+resNid+'" style="display:none"><a style="cursor:pointer">less</a><br />&nbsp;&nbsp;&nbsp;Job ID: '+linksArr[i]['jid']+'<br />&nbsp;&nbsp;&nbsp;Started: '+formatTimestamp(linksArr[i]['start'])+'<br />&nbsp;&nbsp;&nbsp;Ended: '+formatTimestamp(linksArr[i]['stop'])+'</span>')
          			  .on("click", function() {
          				resNid = getNidValue($(this).attr('id'));
                        $('#moreTagInfoLink_'+resNid).css('display', 'inline'); 
                        $(this).hide();
                      });
                      $moreLink = $('<a id="moreTagInfoLink_'+resNid+'" style="cursor:pointer">more</a>')
          			  .on("click", function() {
          				resNid = getNidValue($(this).attr('id'));
                        $('#lessTagInfoSpan_'+resNid).css('display', 'inline'); 
                        $(this).hide();
			    	  });
  					  $('#cloud_info').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
                      $('#tagResource_'+resNid).append($lessLink);
                      $('#tagResource_'+resNid).append($moreLink);
			    	}
			    	
			    	else if(linksArr[i]['type'] == 3) {			/* the APP type */
			    	  resName = linksArr[i]['nid'];		// Apps don't actually have names. 
			    	  resType = 'app';
			    	  SW.tagged_app_names.push(resName);
                      $lessLink = $('<span id="lessTagInfoSpan_'+resNid+'" style="display:none"><a style="cursor:pointer">less</a><br />&nbsp;&nbsp;&nbsp;App ID: '+linksArr[i]['aid']+'<br />&nbsp;&nbsp;&nbsp;Started: '+formatTimestamp(linksArr[i]['start'])+'<br />&nbsp;&nbsp;&nbsp;Ended: '+formatTimestamp(linksArr[i]['stop'])+'</span>')
          			  .on("click", function() {
          				resNid = getNidValue($(this).attr('id')); 
                        $('#moreTagInfoLink_'+resNid).css('display', 'inline'); 
                        $(this).hide();
                      });
                      $moreLink = $('<a id="moreTagInfoLink_'+resNid+'" style="cursor:pointer">more</a>')
          			  .on("click", function() {
          				resNid = getNidValue($(this).attr('id'));
                        $('#lessTagInfoSpan_'+resNid).css('display', 'inline');
                        $(this).hide();
          			  });
					  $('#cloud_info').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
                      $('#tagResource_'+resNid).append($lessLink);
                      $('#tagResource_'+resNid).append($moreLink);
			    	}
			    	
			    	else if(linksArr[i]['type'] == 4) {			/* the FILE type */
			    	  resName = linksArr[i]['name'];
				      resType = 'file';
				      SW.tagged_file_names.push(resName);
                      $lessLink = $('<span id="lessTagInfoSpan_'+resNid+'" style="display:none"><a style="cursor:pointer">less</a><br />&nbsp;&nbsp;&nbsp;Name: '+linksArr[i]['name']+'<br />&nbsp;&nbsp;&nbsp;Created: '+formatTimestamp(linksArr[i]['ctime'])+'<br />&nbsp;&nbsp;&nbsp;Modified: '+formatTimestamp(linksArr[i]['mtime'])+'</span>')
          			  .on("click", function() {
          				resNid = getNidValue($(this).attr('id'));
                        $('#moreTagInfoLink_'+resNid).css('display', 'inline'); 
                        $(this).hide();
                      });
                      $moreLink = $('<a id="moreTagInfoLink_'+resNid+'" style="cursor:pointer">more</a>')
          			  .on("click", function() {
          				resNid = getNidValue($(this).attr('id'));
                        $('#lessTagInfoSpan_'+resNid).css('display', 'inline');
                        $(this).hide();
          			  });
				      $('#cloud_info').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
                      $('#tagResource_'+resNid).append($lessLink);
                      $('#tagResource_'+resNid).append($moreLink);
			    	}
			    	
			    	else if(linksArr[i]['type'] == 5) {			/* the DIRECTORY type */
				      resName = linksArr[i]['name'];
					  resType = 'directory';
	                  $lessLink = $('<span id="lessTagInfoSpan_'+resNid+'" style="display:none"><a style="cursor:pointer">less</a><br />&nbsp;&nbsp;&nbsp;Name: '+linksArr[i]['name']+'<br />&nbsp;&nbsp;&nbsp;Created: '+formatTimestamp(linksArr[i]['ctime'])+'<br />&nbsp;&nbsp;&nbsp;Modified: '+formatTimestamp(linksArr[i]['mtime'])+'</span>')
	          			.on("click", function() {
	          			  resNid = getNidValue($(this).attr('id'));
	                      $('#moreTagInfoLink_'+resNid).css('display', 'inline'); 
	                      $(this).hide();
	                    });
	                  $moreLink = $('<a id="moreTagInfoLink_'+resNid+'" style="cursor:pointer">more</a>')
	          			.on("click", function() {
	          			  resNid = getNidValue($(this).attr('id'));
	                      $('#lessTagInfoSpan_'+resNid).css('display', 'inline');
	                      $(this).hide();
	          		  });
					  $('#cloud_info').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
	                  $('#tagResource_'+resNid).append($lessLink);
	                  $('#tagResource_'+resNid).append($moreLink);
				    }
			    	
			    	else {
			    	  resName = linksArr[i]['nid'];
			    	  resType = 'other';
			    	}
			    	
			      }		// End of for loop.
			      $('#tagCloudButtons').empty();
			      
			      // OBTAIN DOI Button
			      $obtain_doi_button = $('<button data-toggle="modal" data-target="#doiModal">Obtain DOI</button>')
			        .on('click', function() {
			        	
			          SW.doiBySelection = false;
			          SW.doiByTag = true;
			    	  
			    	  /* Reset the modal fields. */
                      $('#doiModalFilesField').html('');
			    	  $('#doiModalGroupsField').html('');
			    	  $('#doiModalPeopleField').html('');
			    	  $('#doiModalJobsField').html('');
			    	  $('#doiModalAppsField').html('');			// Does SW.selected_app_titles exist?
			    	  
			    	  /* Reset the flag which checks whether a file is included. */
			    	  SW.file_included_flag = false;
			    	  
			    	  $('#doiModalFilesField').html(SW.tagged_file_names.join(', '));
			    	  $('#doiModalGroupsField').html(SW.tagged_group_names.toString());
			    	  $('#doiModalPeopleField').html(SW.tagged_person_names.toString());
			    	  $('#doiModalJobsField').html(SW.tagged_job_names.toString());
			    	  $('#doiModalAppsField').html(SW.tagged_app_names.toString());
                    });
			      
			      $delete_tag_button = $('<button>Remove Tag</button>').on('click', function() {
			    	 
                    deleteTag(tagNid,linked_nids,uid);
			    	  
			      });
			      
			      $('#tagCloudButtons').append($obtain_doi_button);
			      $('#tagCloudButtons').append($delete_tag_button);
    		    });
    		  
    		  $('#tagClouds').append($tagcloud);

            }		// End of if(linkCount > 0) block.
    	  },
    	  error: function() {}
    	});
      });
	},		// End of success.
	error: function() {}
  });
            

});



function deleteTag(tag_nid,linked_nids,uid) {
	
	 
	if(linked_nids != undefined) {
	
		for(var i=0;i<linked_nids.length;i++) {
			  console.log('curl -X DELETE http://techint-b117:8080/sws/tag/' + tag_nid + '/link/' + linked_nids[i]);
			  
			  var url = 'http://' + SW.hostname + ':' + SW.port + '/deletetag/'+uid;
				
			  var delete_link_url = 'http://' + SW.hostname + ':' + SW.port + '/deletetaglinkproxy/' + SW.current_user_number;
			  delete_link_url += '?tag_nid=' + tag_nid + '&resource_nid=' + linked_nids[i];
				 
			  
			  $.ajax({
				    url: delete_link_url,
				    async: false,
				    global: false,
					type: 'DELETE',
					success: function(data) {
						console.log('tag link successfully deleted');
						
						
						
					},
					error: function() {
						console.log('error');
					}
			  
			  
			  });
			  
			  
			  
		}
		  
		
	} 
	
	
	console.log('curl -X DELETE http://techint-b117:8080/sws/tag/' + tag_nid);
	
	var delete_tag_url = 'http://' + SW.hostname + ':' + SW.port + '/deletetagproxy/' + SW.current_user_number;
	delete_tag_url += '?tag_nid=' + tag_nid;
	
	$.ajax({
	    url: delete_tag_url,
	    async: false,
	    global: false,
		type: 'DELETE',
		success: function(data) {
			console.log('tag successfully deleted');
			
			location.href=window.location;
			
		},
		error: function() {
			console.log('error');
		}
  
  
    });
	
	

	
	
	
}


function getReducedArr(tag_name_arr) 
{
	console.log('in get reduced arr');
	
	var tag_names = new Array();
	var tag_counts = new Array();
	
	var tag_name = tag_name_arr[0];
	var tag_count = 0;
	for(var i=0; i < tag_name_arr.length; i++) {
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
}

function getCountsArr(tag_name_arr) 
{
	console.log('in get counts');
	
	var tag_names = new Array();
	var tag_counts = new Array();
	
	var tag_name = tag_name_arr[0];
	var tag_count = 0;
	for(var i=0; i < tag_name_arr.length; i++) {
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
}

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

/* Given an id attribute value of the format tagResource_12345, this function returns the 12345 part, 
 * which corresponds to an object Nid. It takes a string as its only argument.                                                                    
 */
function getNidValue(id) {
  var pos = id.indexOf('_');
  var nid = id.substring(pos+1);
  return nid
}