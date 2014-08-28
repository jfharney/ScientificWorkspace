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
            
            // Now populate the tag cloud in the lower left display panel.
            if(linkCount > 0) {		// We don't care about displaying tags with no links. The interface should prevent such tags from being created anyway.
      		  var fontSize = 8;
    		  var $tag = $('<a class="tagcloud" id="'+tagNid+'" style="font-size:'+

    				     (fontSize+linkCount)+'px;cursor:pointer" title="'+tagDesc+'">'+tagName+'</a><span> </span>').on('click', function() {
                  
    				    	 
    			
    				    	 
    			//tag information pane
    			$('#tagInfoPane').empty();
                
                
                
                
                
                //info part
                $info_pane = $('<div class="span8" id="info_pane"></div>');

                
                $tag_name = $('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Tag Name: '+$(this).text()+'</div>');
                $tag_description = $('<div>Description: '+tagDesc+'</div>');
                $tag_link_count = $('<div>Linked Objects: '+linkCount+'</div>');

                var $tags_contents_list = tagsContentList(element,linksData);
                
                $info_pane.append($tag_name);
                $info_pane.append($tag_description);
                $info_pane.append($tag_link_count);
                    
                $info_pane.append($tag_contents_list);

                $('#tagInfoPane').append($info_pane);

                

    			//button part

                $button_pane = $('<div class="span4 buttons" id="button_pane"></div>');

                $obtain_doi_button = $('<p><button class="btn btn-default btn-sm">Obtain DOI</button></p>').click(function(){
                	console.log('obtaining doi');
                });
                $delete_tag_button = $('<p><button class="btn btn-default btn-sm">Delete Tag</button></p>').click(function(){
                	console.log('deleting tag');

                	
                	//deleteTag(tag_nid,linked_nids,uid);
                });
                $update_tag_button = $('<p><button class="btn btn-default btn-sm">Update Tag</button></p>').click(function(){
                	console.log('updating tag');
                	
                });
                
                $button_pane.append($obtain_doi_button);
                $button_pane.append($delete_tag_button);
                $button_pane.append($update_tag_button);
                

                $('#tagInfoPane').append($button_pane);
                
                
                
             	var linked_nids = new Array();
  			      
             	
             	
                
            	// We add a representation of the tag selected to the tag workspace.
                // Check to see if the tag is already in the Tags Workspace when clicked. If it is, don't re-add it. 
                if($.inArray(tagNid, SW.tagNidsInWorkspace) == -1) {
                	
                	console.log('pushing tag nid ' + tagNid);
                	  
                    SW.tagNidsInWorkspace.push(tagNid);
                    
                    $tag_li = $('<li id="tagWsLi_' + tagNid + '" style="margin:5px"></li>');
                    
                    $tag_checkbox = $('<input id="tagWsCheck_'+tagNid+'" class="tagCheckbox" type="checkbox" style="margin-right:5px">').change(function(){
                    	console.log('checkbox changed');
                		
                    	//empty the global tag nid array
                    	SW.selected_tag_nids = [];
                		
                    	$.each($('.tagCheckbox'),function() {
                    		//empty global list here
                    		
                    		if($(this).is(':checked')) {
                    			
                        		//add the tag nid to global list
                        		var nid = this.id.substring((this.id.search('_')+1));
                        		SW.selected_tag_nids.push(nid);
                        		
                    		} 
                    		
                    	});
                    	console.log('current global tag nids: ' + SW.selected_tag_nids);
                    });
                    
                    $tag_button = $('<button id="tagWsButton_'+tagNid+'" class="btn btn-primary">'+tagName+'</button>').click(function() {
                    	
                    	//tag information pane
                    	$('#tagInfoPane').empty();
                    	
                    	$tag_name = $('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Tag Name: '+$(this).text()+'</div>');
                    	$tag_description = $('<div>Description: '+tagDesc+'</div>');
                    	$tag_link_count = $('<div>Linked Objects: '+linkCount+'</div>');
                    	
                    	
                        $('#tagInfoPane').append($tag_name);
                        $('#tagInfoPane').append($tag_description);
                        $('#tagInfoPane').append($tag_link_count);
                        
                        //SW.resetTaggedFields();				// Reset the tagged fields. This is gonna have to be adjusted, since we are going to be creating a DOI from multiple tags.
                        var linked_nids = new Array();
      			      
                        //needs:
                        //linkCount
                        //linksArr
                        var $tags_contents_list = tagsContentList(element,linksData);

                        //alert('tags contents: ' + $tags_contents_list.html());
                        $('#tagInfoPane').append($tag_contents_list);
                    	
                    });
                    
                    
                    
                    $tag_remove_icon = $('<img id="removeIcon_'+tagNid+'" class="icon-remove" title="Remove this tag from the Tag Workspace." />').click(function(){
                    	console.log('removing ' + tagNid);
                    	$('li#tagWsLi_'+tagNid).remove();
                    	
                    	//remove tag from workspace and update the global tag nids
                    	SW.selected_tag_nids = [];
                    	$.each($('.tagCheckbox'),function() {
                    		//empty global list here
                    		
                    		if($(this).is(':checked')) {
                        		console.log('checked ' + this.id);
                        		//add the tag nid to global list
                        		var nid = this.id.substring((this.id.search('_')+1));
                        		
                        		SW.selected_tag_nids.push(nid);
                    		} else {
                    			console.log('unchecked ' + this.id);
                    			
                    		}
                    		
                    	});
                    	console.log('nids: ' + SW.selected_tag_nids);
                    });
                    
                    
                    $tag_li.append($tag_checkbox);
                    $tag_li.append($tag_button);
                    $tag_li.append($tag_remove_icon);
                    
                    
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
  
  // When the DOI modal is shown, we need it to show the selected items in the appropriate fields. 
  $('#tagcloudObtainDoiButton').on('click', function() {
    
  });
}       // end of renderTagCloud()

$('.tagCheckbox').on('change', function() {
  console.log(this.id +' has been checked!');
});

//returns a jquery element of the listing of all resource object links given the 
//input:
//element -> tag title, description, nid
//linksData -> tag links information
//output:
//$tags_content_list - an unordered list of the objects to which the tag refers
function tagsContentList(element,linksData) {
	
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
		} else {
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
    //console.log('Checkbox tagWsCheck_'+tagNid+' is checked.');
    $.ajax({
      type: "GET",
      url: 'http://' + SW.hostname + ':' + SW.port + '/tags/links/'+tagNid,
      success: function(linksData) {
        var linksArr = JSON.parse(linksData);
        for(var i = 0; i < linksArr.length; i++) {
          var type = linksArr[i]['type'];
          if(type == 0)
            ;//console.log('User!');
          else if(type == 1)
            ;//console.log('Group!');
          else if(type == 2)
            ;//console.log('Job!');
          else if(type == 3)
            ;//console.log('App!'); 
          else if(type == 4) {
            //console.log('File!');
            addFileNameToTaggedFiles(linksArr[i]['path'], tagNid);
          }
          else if(type == 5)
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

/* This function handles adding the file names (with their paths) to the global object which is
 * used to populate the DOI modal. */
function addFileNameToTaggedFiles(fileName, tagNid) {
  /*console.log('Inside addFileNameToTaggedFiles, adding fileName '+fileName);
  // We have the global object SW.selected_tagged_objects.files. 
  // We first want to check if fileName is a field in this object.
  var obj = SW.selected_tagged_objects;
  // Replace the pipes with forward slashes.
  fileName = fileName.replace(/|/, '/');
  
  if(fileName in obj.files) {
    // If the fileName is in the object, add the tag nid to the corresponding array.
    obj.files[fileName].push(tagNid);
  }
  else {
    // If the fileName is not in the object, add that object as an array and push the tag nid thereonto.
    obj.files[fileName] = [];
    obj.files[fileName].push(tagNid);
  }
  for(var key in obj.files)
    SW.selected_file_paths.push(key);
  console.log(SW.selected_file_paths.toString());*/
}

// SW.selected_tagged_objects is an object whose fields are objects.
// SW.selected_tagged_objects.files is an object whose fields are arrays.
// Each field in SW.selected_tagged_objects.files has a file path for its name and an array of ints for its value. 

/* This function removes file paths from the global SW.selected_tagged_objects.files. It is 
 * called from either of two events: 
 *      1. The X to the right of a tag button in the Tags Workspace is clicked. 
 *      2. The checkbox to the left of a tag button in the Tags Workspace is unchecked.
 */
function removeFileNameFromTaggedFiles(tagNid) {
  // Iterate through every field in SW.selected_tagged_objects.files. If tagNid appears in its 
  // array of ints, remove it from the array. If the array becomes an empty array by this action,
  // remove the field from the object.
  /*var obj = SW.selected_tagged_objects;
  for(var key in obj.files) {
    var index = obj.files[key].indexOf(tagNid);
    if(index != -1) {
      obj.files[key].splice(index, 1);
      if(obj.files[key].length == 0)
        delete obj.files[key];
    }
  }*/
  //for(var key in obj.files)
    //console.log(key+': '+obj.files[key]);
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










//Everything below -> Removed 8-27

//SW.resetTaggedFields();				// Reset the tagged fields. This is gonna have to be adjusted, since we are going to be creating a DOI from multiple tags.


/*
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
*/

// Now we define the behavior for the click event of each button added to the Tag Workspace.
//$('button#tagWsButton_'+tagNid).on('click', function() {

	
/*                   	
  $('#tagInfoPane').empty();
  $('#tagInfoPane').append('<div id="cloud_info" style="max-height:225px;width:auto;overflow:auto">Tag Name: '+$(this).text()+"</div>");
  $('#tagInfoPane').append('<div># Objects: '+linkCount+'</div>');
  $('#tagInfoPane').append('<div>Description: '+tagDesc+'</div>');
  
  $tag_contents_list = $('<ul id="tagContentsList"></ul>');
  $('#tagInfoPane').append($tag_contents_list);
  
  //$('#tagInfoPane').append('<ul id="tagContentsList">');
  
  //SW.resetTaggedFields();				// Reset the tagged fields. This is gonna have to be adjusted, since we are going to be creating a DOI from multiple tags.
  var linked_nids = new Array();
  
  // Now we iterate through the links. 
  for(var i = 0; i < linkCount; i++) {
	var resName, resType;
	var resNid = linksArr[i]['nid'];
	linked_nids.push(resNid);
    
	
	if(linksArr[i]['type'] == 0) {				// the USER type
      resName = linksArr[i]['name'];
      resType = 'user';
      //SW.tagged_person_names.push(resName);
      
      
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
		alert('adding file info');
	  resName = linksArr[i]['path'];
      resType = 'file';
      
      $less_link = $('<span id="lessTagInfoSpan_'+resNid+'" style=""></span>');
      $less_a = $('<a style="cursor:pointer">less</a>');
      $less_content = $('<span><br />&nbsp;&nbsp;&nbsp;Name: '+linksArr[i]["name"]+'<br />&nbsp;&nbsp;&nbsp;Created: '+formatTimestamp(linksArr[i]['ctime'])+'</span>');
      
      $less_link.append($less_a);
      $less_link.append($less_content);
      
      $more_link = $('<a id="moreTagInfoLink_'+resNid+'" style="cursor:pointer">more</a>').on('click', function() {
    	  resNid = getNidValue($(this).attr('id'));
          $('#lessTagInfoSpan_'+resNid).css('display', 'inline');
          $(this).hide();
      });
      
      $('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
      
      $('#tagResource_'+resNid).append($more_link);
      
      //$('#tagResource_'+resNid).append($less_span);
      
      //SW.tagged_file_names.push(resName);
      
      $lessLink = $('<span id="lessTagInfoSpan_'+resNid+'" style="display:none"><a style="cursor:pointer">less</a>
      <br />&nbsp;&nbsp;&nbsp;Name: '+linksArr[i]['name']+'<br />&nbsp;&nbsp;&nbsp;Created: '+
      formatTimestamp(linksArr[i]['ctime'])+'<br />&nbsp;&nbsp;&nbsp;Modified: '+formatTimestamp(linksArr[i]['mtime'])+'</span>')
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
	
  }		// end of for loop.
*/
//});     // end of 



/*
var resNid = linksArr[i]['nid'];

var resName, resType;

linked_nids.push(resNid);

if(linksArr[i]['type'] == 4) {			// the FILE type
alert('adding file info');
resName = linksArr[i]['path'];
resType = 'file';

$('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');


$less_link = $('<span id="lessTagInfoSpan_'+resNid+'" style=""></span>');
$less_a = $('<a style="cursor:pointer">less</a>');
$less_content = $('<span><br />&nbsp;&nbsp;&nbsp;Name: '+linksArr[i]["name"]+'<br />&nbsp;&nbsp;&nbsp;Created: '+formatTimestamp(linksArr[i]['ctime'])+'</span>');

$less_link.append($less_a);
$less_link.append($less_content);

$more_link = $('<a id="moreTagInfoLink_'+resNid+'" style="cursor:pointer">more</a>').on('click', function() {
  resNid = getNidValue($(this).attr('id'));
  $('#lessTagInfoSpan_'+resNid).css('display', 'inline');
  $(this).hide();
});

$('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');

$('#tagResource_'+resNid).append($more_link);

}
*/




/*
//linked_nids.push(resNid);
	if(linksArr[i]['type'] == 0) {				// the USER type
		
		var resType = 'user';
		var resName = linksArr[i]['name'];
	    
		$tag_contents_item = $('<li id="tagResource_'+resNid+'"><span style="font-weight:bold">'+resName+'</span> ('+resType+')&nbsp;</li><br />');
		$tag_contents_list.append($tag_contents_item);
		
		
	    
	} 
	*/
	/*
	else if(linksArr[i]['type'] == 1) {			// the GROUP type

		var resType = 'group';
		var resName = linksArr[i]['name'];
		
		//SW.tagged_group_names.push(resName);
		//$('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
		$tag_contents_item = $('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
		$tag_contents_list.append($tag_contents_item);
	    
} else if(linksArr[i]['type'] == 2) {			// the JOB type

		var resType = 'job';
		var resName = linksArr[i]['name'];
		
		//SW.tagged_group_names.push(resName);
		//$('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
		$tag_contents_item = $('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
		$tag_contents_list.append($tag_contents_item);
	    
} else if(linksArr[i]['type'] == 3) {			// the APP type

		var resType = 'app';
		var resName = linksArr[i]['name'];
		
		//SW.tagged_group_names.push(resName);
		//$('#tagContentsList').append('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
		$tag_contents_item = $('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
		$tag_contents_list.append($tag_contents_item);
	    
} else if(linksArr[i]['type'] == 4) {			// the FILE type
		
		var resType = 'file';
		var resName = linksArr[i]['name'];
    	
		$tag_contents_item = $('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
		$tag_contents_list.append($tag_contents_item);
    	
} else if(linksArr[i]['type'] == 5) {			// the DIRECTORY type
		
		var resType = 'directory';
		var resName = linksArr[i]['name'];
    	
		$tag_contents_item = $('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
		$tag_contents_list.append($tag_contents_item);
    	
} else {
	var resType = 'other';
	var resName = linksArr[i]['nid'];
    	
	$tag_contents_item = $('<li id="tagResource_'+resNid+'"><b>'+resName+'</b> ('+resType+')&nbsp;</li><br />');
	$tag_contents_list.append($tag_contents_item);
}
	*/
