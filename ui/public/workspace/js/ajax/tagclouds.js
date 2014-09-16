/* This function is called in main.js near the end of the ready event. 
 */

function renderTagCloud() {

  var uid = SW.current_user_number;
  var tags_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/tags?';
  var tagLinks_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/tags/links/';
  
  // The outer Ajax call gets the set of tags for the current user.
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
            
            // If the tag has at least one link, we add it to the tag cloud in the lower left panel. We don't care about displaying tags with no links. The interface should prevent such tags from being created anyway. 
            if(linkCount > 0) {
              var fontSize = 8;
              var $tag = $('<a class="tagcloud" id="'+tagNid+'" style="font-size:'+(fontSize+linkCount)+'px;cursor:pointer" title="'+tagDesc+'">'+tagName+'</a><span> </span>')
                .on('click', function() {
                  $('.tagInfoPane').empty();

                  $info_pane = $('<div class="span8" id="info_pane"></div>');

                  $tag_name = $('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Tag Name: '+$(this).text()+'</div>');
                  $tag_description = $('<div>Description: '+tagDesc+'</div>');
                  $tag_link_count = $('<div>Linked Objects: '+linkCount+'</div>');

                  // Function makeTagContentList defined below in line 239. 
                  var $tags_contents_list = makeTagContentList(element, linksData);
                
                  $info_pane.append($tag_name);
                  $info_pane.append($tag_description);
                  $info_pane.append($tag_link_count);
                    
                  $info_pane.append($tag_contents_list);

                  $('.tagInfoPane').append($info_pane);

                  //button part     Commented out on 9-16-14.
                  /*$button_pane = $('<div class="span4 buttons" id="button_pane"></div>');

                  // RIGHT HAND OBTAIN DOI BUTTON (for a single tag)
                  $obtain_doi_button = $('<p><button id="obtainDoiFromSingleTagButton" class="btn btn-default btn-sm">Obtain DOI</button></p>')
                    // On Click event for the Obtain DOI from a single tag button that appears in the righthand side 
                    // of the Tags Workspace panel. Note that this button bypasses the DOI modal and goes straight to
                    // the DOI page. 
                    .click(function() {
                      if(SW.single_tag_files.length == 0) 
                        alert('Tag must contain at least one file for a DOI request to be made.');
                      else {
                        var input = '';
                        
                        var url = "http://" + SW.hostname + ":" + SW.port + "/doi/" + SW.current_user_uname;
                        
                        input+='<input type="hidden" name="creator_nid" value="'+ SW.current_user_nid +'" />';
                        input+='<input type="hidden" name="creator_email" value="'+ SW.current_user_email +'" />';
                        input+='<input type="hidden" name="creator_name" value="'+ SW.current_user_name +'" />';
                        input+='<input type="hidden" name="creator_number" value="'+ SW.current_user_number +'" />';
                        input+='<input type="hidden" name="creator_uname" value="'+ SW.current_user_uname +'" />';
  
                        for(var i = 0; i < SW.single_tag_people.length; i++)
                          input += '<input type="hidden" name="personNames" value="'+SW.single_tag_people[i]+'" />';
                        
                        for(var i = 0; i < SW.single_tag_groups.length; i++)
                          input += '<input type="hidden" name="groupNames" value="'+SW.single_tag_groups[i]+'" />';
                        
                        for(var i = 0; i < SW.single_tag_jobs.length; i++)
                          input += '<input type="hidden" name="jobNames" value="'+SW.single_tag_jobs[i]+'" />';
                        
                        for(var i = 0; i < SW.single_tag_apps.length; i++)
                          input += '<input type="hidden" name="appIds" value="'+SW.single_tag_apps[i]+'" />';
                        
                        for(var i = 0; i < SW.single_tag_files.length; i++)
                          input += '<input type="hidden" name="fileNames" value="'+SW.single_tag_files[i]+'" />';
                        
                        for(var i = 0; i < SW.single_tag_nids.length; i++)
                          input += '<input type="hidden" name="nids" value="'+SW.single_tag_nids[i]+'" />';
                        
                        // Send request.
                        jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
                          .appendTo('body').submit().remove();
                      }
                    });
                $delete_tag_button = $('<p><button class="btn btn-default btn-sm">Delete Tag</button></p>')
                  .click(function(){
                    console.log('deleting tag');
                    //deleteTag(tag_nid,linked_nids,uid);
                  });
                $update_tag_button = $('<p><button class="btn btn-default btn-sm">Update Tag</button></p>')
                  .click(function() {
                    console.log('updating tag');
                  });
                
                $button_pane.append($obtain_doi_button);
                $button_pane.append($delete_tag_button);
                $button_pane.append($update_tag_button);
                
                $('.tagInfoPane').append($button_pane);*/
                
                var linked_nids = new Array();
        
                // We add a representation of the tag selected to the tag workspace.
                // Check to see if the tag is already in the Tags Workspace when clicked. If it is, don't re-add it. 
                if($.inArray(tagNid, SW.tagNidsInWorkspace) == -1) {
                  SW.tagNidsInWorkspace.push(tagNid);
                  $tag_li = $('<li id="tagWsLi_' + tagNid + '" style="margin:5px"></li>');
                    
                  // TAGS WORKSPACE BUTTON CHECKBOX
                  $tag_checkbox = $('<input id="tagWsCheck_'+tagNid+'" class="tagCheckbox" type="checkbox" style="margin-right:5px">')
                    .change(function() {
		              // Empty the global tag nid array.
                      SW.selected_tag_nids = [];
		              //SW.resetMultiTagFields();
		              trackSelectedTagLinks(tagNid);
                		
                      $.each($('.tagCheckbox'), function() {
                        if($(this).is(':checked')) {
                          // Add the tag nid to global list.
                          var nid = this.id.substring((this.id.search('_')+1));
                          SW.selected_tag_names.push(tagName);
                          SW.selected_tag_nids.push(tagNid);
                        } 
                      });
                    });

                  // TAGS WORKSPACE BUTTON
                  $tag_button = $('<button id="tagWsButton_'+tagNid+'" class="btn btn-primary">'+tagName+'</button>')
                    .click(function() {
                      // tag information pane
                      $('.tagInfoPane').empty();
                    
                      $tag_name = $('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Tag Name: '+$(this).text()+'</div>');
                      $tag_description = $('<div>Description: '+tagDesc+'</div>');
                      $tag_link_count = $('<div>Linked Objects: '+linkCount+'</div>');
                    	
                      $('.tagInfoPane').append($tag_name);
                      $('.tagInfoPane').append($tag_description);
                      $('.tagInfoPane').append($tag_link_count);

                      var $tags_contents_list = makeTagContentList(element, linksData);

                      $('.tagInfoPane').append($tag_contents_list);
                    });
                    
                    
                  // TAGS WORKSPACE BUTTON X ICON 
                    $tag_button_remove_icon = $('<img id="removeIcon_'+tagNid+'" class="icon-remove" title="Remove this tag from the Tags Workspace." />')
                      .click(function() {
                        $('li#tagWsLi_'+tagNid).remove();
                        
                        //var buttonCount = $('li[id^="tagWsLi_"]').length;
                        //if(buttonCount == 0)
                        $('.tagInfoPane').empty();
                    	
                        // We reset both the array of selected tag nids and the array of the tag nids in the Tags Workspace. 
                        SW.selected_tag_nids = [];
                        SW.tagNidsInWorkspace = [];
                        $.each($('.tagCheckbox'),function() {
                          var tagNid = this.id.substring((this.id.search('_')+1));
                          SW.tagNidsInWorkspace.push(tagNid);
                          if($(this).is(':checked'))
                            SW.selected_tag_nids.push(tagNid);
                        });

                        displayAggregateTagWorkspaceButtons();
                      });
                    
                    $tag_li.append($tag_checkbox);
                    $tag_li.append($tag_button);
                    $tag_li.append($tag_button_remove_icon);
                    
                    $('ul#tagButtonList').append($tag_li);
                    
                    displayAggregateTagWorkspaceButtons(); 
                  } //end if tag is not in the workspace already 
                	
              }); //on click function
    		  
    		  $('#tagCloud').append($tag);
    		}		// end of if(linkCount > 0) block.
          },
          error: function(e) {console.log('Error in tagsData call of renderTagCloud(): '+e);}
        });
      });
	},
	error: function(e) {console.log('Error in linksData call of renderTagCloud(): '+e);}
  });       // end of outer Ajax call
}       // end of renderTagCloud()

// On Click event for the Obtain DOI from multiple tags button that appears in the bottom left 
// of the Tags Workspace panel. We are able to register this event outside of renderTagCloud
// because the element is part of the initial document object loading. 
/*$('#tagcloudObtainDoiButton').on('click', function() {
  SW.doiFromTagsFlag = true;
  
  var peopleArr = [];
  for(var key in SW.multi_tag_people)
    peopleArr.push(key);
  $('td#doiModalPeopleField').text(peopleArr);
  
  var filesArr = [];
  for(var key in SW.multi_tag_files)
    filesArr.push(key);
  $('td#doiModalFilesField').text(filesArr);
});*/

// This code was outside renderTagCloud. Should we move some things into blocks like this one?
// Yes, but it doesn't work when the element is added to the page by a user action.
// Like the code below, for instance. Doesn't work because the element does not exist when the
// code is run. 
//$('.tagCheckbox').on('change', function() {
  //console.log(this.id +' has been checked!');
//});


function makeTagContentList(element, linksData) {
	
  $tag_contents_list = $('<ul id="tagContentsList"></ul>');
	
  var tagNid = element['nid'];
  var tagName = element['name'];
  var tagDesc = element['desc'];
  
  var linksArr = [];
  linksArr = JSON.parse(linksData);
  var linkCount = linksArr.length;
  
  // Now we iterate through the links. 
  for(var i = 0; i < linkCount; i++) {
  
  	var resNid = linksArr[i]['nid'];
  	
   	//small bug in group info being returned - want the name "name" not "gname"
  	//small bug in app info being returned - want the name "name" not "nid"
  	if(linksArr[i]['type'] == 1) {
  		linksArr[i]['name'] = linksArr[i]['gname'];
  	} else if(linksArr[i]['type'] == 3) {		
  		linksArr[i]['name'] = linksArr[i]['nid'];
  	} else if(linksArr[i]['type'] == 6) {
  		linksArr[i]['name'] = linksArr[i]['nid'];
  	}
  	
    /* Commented out 9-06-14.
  	// Add the names to the globals for a single tag.
  	if(linksArr[i]['type'] == 0) {
  	  SW.single_tag_people.push(linksArr[i]['name']);
  	  SW.single_tag_nids.push(linksArr[i]['nid']);
  	  //console.log('SW.single_tag_people is now '+SW.single_tag_people);
  	  //console.log('SW.single_tag_nids is now '+SW.single_tag_nids);
  	}
  	else if(linksArr[i]['type'] == 1) {
      SW.single_tag_groups.push(linksArr[i]['name']);
      SW.single_tag_nids.push(linksArr[i]['nid']);
      //console.log('SW.single_tag_groups is now '+SW.single_tag_groups);
      //console.log('SW.single_tag_nids is now '+SW.single_tag_nids);
    }
    else if(linksArr[i]['type'] == 2) {
      SW.single_tag_jobs.push(linksArr[i]['name']);
      SW.single_tag_nids.push(linksArr[i]['nid']);
      //console.log('SW.single_tag_jobs is now '+SW.single_tag_jobs);
      //console.log('SW.single_tag_nids is now '+SW.single_tag_nids);      
    }
    else if(linksArr[i]['type'] == 3) {
      SW.single_tag_apps.push(linksArr[i]['aid']);
      SW.single_tag_nids.push(linksArr[i]['nid']);
      //console.log('SW.single_tag_apps is now '+SW.single_tag_apps);
      //console.log('SW.single_tag_nids is now '+SW.single_tag_nids);      
    }
    else if(linksArr[i]['type'] == 4) {
      SW.single_tag_files.push(linksArr[i]['path']);
      SW.single_tag_nids.push(linksArr[i]['nid']);
      //console.log('SW.single_tag_files is now '+SW.single_tag_files);
      //console.log('SW.single_tag_nids is now '+SW.single_tag_nids);
    }
    else {'Error: unhandled type'}*/
  	
  	var type_int = linksArr[i]['type'];
  	
  	var resType = SW.typeMap[type_int];
	var resName = linksArr[i]['name'];
	var resNid = linksArr[i]['nid'];
	
	//individual list item for each of the resource to which the tag refers
	$tag_resource_item_li = $('<li id="tagResource_'+resNid+'"></li>');
	$tag_resource_name = $('<span style="font-weight:bold">'+resName+' ('+resType+')&nbsp;</span> ');
	$tag_resource_morelink = $('<a id="' + resNid + '" style="cursor:pointer">more</a>').click(function() {
		
    if(this.innerHTML == 'more') {
      this.innerHTML = 'less';
      $('#tagResourceInfo_'+this.id).show('slow');
    } 
    else {
      this.innerHTML = 'more';
      $('#tagResourceInfo_'+this.id).hide('slow');
    }
		
	});
	$tag_resource_info = $('<div id="tagResourceInfo_'+resNid+'" style="display:none">' + '</div>');

	for(var key in linksArr[i]) {
		$key = $('<div style="margin-left:5px">' + key + ' : ' + linksArr[i][key] + '</div>')
		$tag_resource_info.append($key);
	}
	
	
	$tag_resource_item_li.append($tag_resource_name);
	$tag_resource_item_li.append($tag_resource_morelink);
	$tag_resource_item_li.append($tag_resource_info);
	$tag_contents_list.append($tag_resource_item_li);
	
  }
  
  return $tag_contents_list;
  		
	    	
  
  
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




/* Called on line 42 above. For the rather complicated scheme we are employing here, see the note
 * in core.js preceding the declaration of the variable SW.selected_tagged_objects. */
function setTaggedFields(tagNid) {
  
  if(document.getElementById('tagWsCheck_'+tagNid).checked) {
    $.ajax({
      type: "GET",
      url: 'http://' + SW.hostname + ':' + SW.port + '/tags/links/'+tagNid,
      success: function(linksData) {
        var linksArr = JSON.parse(linksData);
        for(var i = 0; i < linksArr.length; i++) {
          var type = linksArr[i]['type'];
          if(type == 0)             // user
            ;//console.log('User!');
          else if(type == 1)        // group
            ;//console.log('Group!');
          else if(type == 2)        // job
            ;//console.log('Job!');
          else if(type == 3)        // app
            ;//console.log('App!'); 
          else if(type == 4) {      // file
            //console.log('File!');
            addFileNameToTaggedFiles(linksArr[i]['path'], tagNid);
          }
          else if(type == 5)        // directory
            ;//console.log('Directory!');
          else
            console.log('Tag?!');
        }
      },
      failure: function(e) {console.log('Error in setTaggedFields(): '+e);}
    });
  }
  else {
    //console.log('Checkbox tagWsCheck_'+tagNid+' is unchecked.');
    removeFileNameFromTaggedFiles(tagNid);
  }
}

// This function works on the same set of globals that setTaggedFields does.  
function setSelectedFields(resName, resNid, resType) {
  // When I select a file, I want to add it to the object SW.selected_tagged_objects.files. 
  // I use the same scheme as when I select a tag in the Tags Workspace. However, instead of
  // giving it a tag nid in the array, I add a 0. This approach will work because we can 
  // assume that resources will appear only once outside the Tags Workspace.
  
  // Need to replace the pipes with forward slashes. | -> /
  resName = resName.split('|').join('/');
  console.log('The '+resType+' '+resName+' with nid '+resNid+' has been selected.');
  if(resType == 'file')
    addFileNameToTaggedFiles(resName, 0);
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

function trackSelectedTagLinks(tagNid) {
  SW.doiFromTagsFlag = true;
  var tagLinks_url_prefix = 'http://' + SW.hostname + ':' + SW.port + '/tags/links/';
  
  $.ajax({
    type: 'GET',
    url: tagLinks_url_prefix+tagNid,
    success: function(linksData) {
      var linksArr = JSON.parse(linksData);
      for(var key = 0; key < linksArr.length; key++) {
        var type = linksArr[key]['type'];
        var name = linksArr[key]['name'];
        var appId = linksArr[key]['aid'];     // remember apps don't have names.
        var nid = linksArr[key]['nid'];
        if(type == 0) {     // PEOPLE
          if(name in SW.multi_tag_people)
            SW.multi_tag_people[name].push(tagNid);
          else {
            SW.multi_tag_people[name] = [];
            SW.multi_tag_people[name].push(tagNid);
          }      
        }
        if(type == 4) {     // FILES
          var filePath = linksArr[key]['path'];     // Path field is defined only for files.
          //console.log('filePath is '+filePath);
          if(filePath in SW.multi_tag_files) {
            //console.log('This path already exists!');
            SW.multi_tag_files[filePath].push(tagNid);
            //console.log('Adding tagNid '+tagNid+' to SW.multi_tag_files['+filePath+']');
          }
          else {
            SW.multi_tag_files[filePath] = [];
            SW.multi_tag_files[filePath].push(tagNid);
            //console.log('Adding field '+filePath+' to object SW.multi_tag_files, and adding tagNid '+tagNid+' to its array.');
          }
          for(var key in SW.multi_tag_files)
            for(var j in SW.multi_tag_files[key])
              console.log('SW.multi_tag_files['+key+']: '+SW.multi_tag_files[key][j]);
        }
      }
    },
    error: function(e) {console.log('Error in trackSelectedTagLinks(tagNid): '+e);}
  });
}
