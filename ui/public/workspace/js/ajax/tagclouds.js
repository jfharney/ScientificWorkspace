/* This function is called in main.js near the end of the ready event. 
 */

function renderTagCloud() {
	
  var uid = SW.current_user_number;
	  
  var tags_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/tags?';
  var tagLinks_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/tags/links/';
  
  // The out Ajax call gets the set of tags for the current user.
  $.ajax({
	type: "GET",
	url: tags_url_prefix + 'uid=' + uid,
	success: function(tagsData) {
      var tagsArr = [];
      tagsArr = JSON.parse(tagsData);
      
      // Then, for each tag returned, we get an array of that tag's links.
      $.each(tagsArr, function(index, element) {
        var tagNid = element['nid'];
      	var tagName = element['name'];
        var tagDesc = element['desc'];
        
        // The inner Ajax call gets the set of links for each tag retrieved. 
        $.ajax({
          type: "GET",
          url: tagLinks_url_prefix + tagNid,
          success: function(linksData) {
            var linksArr = [];
            linksArr = JSON.parse(linksData);
            var linkCount = linksArr.length;
            
            // Now populate the tag cloud in the lower left display panel.
            if(linkCount > 0) {		// We don't care about displaying tags with no links. The interface should prevent such tags from being created anyway.
      		  var fontSize = 8;
    		  var $tag = $('<a class="tagcloud" id="'+tagNid+'" style="font-size:'+
    				     (fontSize+linkCount)+'px;cursor:pointer" title="'+tagDesc+'">'+tagName+'</a><span> </span>')
                .on('click', function() {
                  // We add a representation of the tag selected to the tag workspace.
                  if($.inArray(tagNid, SW.tagNidsInWorkspace) == -1) {
                    $('ul#tagButtonList').append('<li id="tagWsLi_'+tagNid+'" style="margin:5px"><input id="tagWsCheck_'+tagNid+'" type="checkbox" onclick=setTaggedFields('+tagNid+'); style="margin-right:5px"><button id="tagWsButton_'+tagNid+'" class="btn btn-primary">'+tagName+'</button><img id="removeIcon_'+tagNid+'" class="icon-remove" title="Remove this tag from the Tag Workspace." /></li>');
                    displayAggregateTagWorkspaceButtons();
                    SW.tagNidsInWorkspace.push(tagNid);
                    $('#removeIcon_'+tagNid).on('click', function() {
                      $('li#tagWsLi_'+tagNid).remove();
                      SW.tagNidsInWorkspace.splice(SW.tagNidsInWorkspace.indexOf(tagNid), 1);
                      displayAggregateTagWorkspaceButtons();
                    });
                    // Now we define the behavior for the click event of each button added to the Tag Workspace.
                    $('button#tagWsButton_'+tagNid).on('click', function() {
                    	
                      $('#tagInfoPane').empty();
                      $('#tagInfoPane').append('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Tag Name: '+$(this).text()+"</div>");
                      $('#tagInfoPane').append('<div># Objects: '+linkCount+'</div>');
                      $('#tagInfoPane').append('<div>Description: '+tagDesc+'</div>');
                      $('#tagInfoPane').append('<ul id="tagContentsList">');
                      
    			      SW.resetTaggedFields();				// Reset the tagged fields. This is gonna have to be adjusted, since we are going to be creating a DOI from multiple tags.
    			      var linked_nids = new Array();
    			      
    			      // Now we iterate through the links. 
    			      for(var i = 0; i < linkCount; i++) {
    			    	var resName, resType;
    			    	var resNid = linksArr[i]['nid'];
    			    	linked_nids.push(resNid);
                        
    			    	if(linksArr[i]['type'] == 0) {				// the USER type
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
    	                  $('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
    	                  $('#tagResource_'+resNid).append($lessLink);
    	                  $('#tagResource_'+resNid).append($moreLink);
    				    }
    			    	
    			    	else if(linksArr[i]['type'] == 1) {			// the GROUP type
    					  resName = linksArr[i]['gname'];
    					  resType = 'group';
    					  SW.tagged_group_names.push(resName);
    		  			  $('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
    					}
    			    	
    			    	else if(linksArr[i]['type'] == 2) {			// the JOB type
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
      					  $('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
                          $('#tagResource_'+resNid).append($lessLink);
                          $('#tagResource_'+resNid).append($moreLink);
    			    	}
    			    	
    			    	else if(linksArr[i]['type'] == 3) {			// the APP type
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
    					  $('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
                          $('#tagResource_'+resNid).append($lessLink);
                          $('#tagResource_'+resNid).append($moreLink);
    			    	}
    			    	
    			    	else if(linksArr[i]['type'] == 4) {			// the FILE type
    			    	  resName = linksArr[i]['path'];
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
    				      $('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
                          $('#tagResource_'+resNid).append($lessLink);
                          $('#tagResource_'+resNid).append($moreLink);
    			    	}
    			    	else if(linksArr[i]['type'] == 5) {			// the DIRECTORY type
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
    					  $('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
    	                  $('#tagResource_'+resNid).append($lessLink);
    	                  $('#tagResource_'+resNid).append($moreLink);
    				    }
    			    	
    			    	else {
    			    	  resName = linksArr[i]['nid'];
    			    	  resType = 'other';
    			    	}
    			    	
    			      }		// End of for loop.
                    });
                  }
                });
    				     
    		  $('#tagCloud').append($tag);
    		}		// End of if(linkCount > 0) block.
          },
          error: function(e) {console.log('Error in tagsData call of renderTagCloud(): '+e);}
        });
      });
	},
	error: function(e) {console.log('Error in linksData call of renderTagCloud(): '+e);}
  });

}


/* Called on line 42 above. For the rather complicated scheme we are employing here, see the note
 * in core.js preceding the declaration of the variable SW.selected_tagged_objects. */
function setTaggedFields(tagNid) {
  if(document.getElementById('tagWsCheck_'+tagNid).checked) {
    console.log('Checkbox tagWsCheck_'+tagNid+' is checked.');
    $.ajax({
      type: "GET",
      url: 'http://' + SW.hostname + ':' + SW.port + '/tags/links/'+tagNid,
      success: function(linksData) {
        var linksArr = JSON.parse(linksData);
        for(var i = 0; i < linksArr.length; i++) {
          var type = linksArr[i]['type'];
          if(type == 0)
            console.log('User!');
          else if(type == 1)
            console.log('Group!');
          else if(type == 2)
            console.log('Job!');
          else if(type == 3)
            console.log('App!'); 
          else if(type == 4) {
            console.log('File!');
          }
          else if(type == 5)
            console.log('Directory!');
          else
            console.log('Tag?!');
        }
      },
      failure: function(e) {console.log('Error in setTaggedFields(): '+e);}
    });
  }
  else {
    console.log('Checkbox tagWsCheck_'+tagNid+' is unchecked.');
  }
}










/* In the Tag Workspace, there is a block of three buttons that can act upon one or more selected tags.
 * This function is meant to display that block if there is at least one button for a tag in the Tag
 * Workspace, and otherwise to hide that block. This function is called in: 
 * 		main.js			line 114
 * 		tagclouds.js	lines 43, 48
 */
function displayAggregateTagWorkspaceButtons() {
  if($('ul#tagButtonList li').length > 0)
	$('div#aggregateTagButtons').show();
  else
	$('div#aggregateTagButtons').hide();
}


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