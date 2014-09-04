

$(function(){

	  console.log('<><><>SEARCH MAIN<><><>');
	  
	/* We transfer the current user data values stored in the document object to the 
	* SW object, defined in core.js.                                                    */
	SW.current_user_nid = $('#curUserNid').html();
	SW.current_user_email = $('#curUserEmail').html();
	SW.current_user_name = $('#curUserName').html();
	SW.current_user_number = $('#curUserNumber').html();
	SW.current_user_uname = $('#curUserUname').html();
	
	  //console.log('SW.current_user_nid: ' + SW.current_user_nid);
	  //console.log('SW.current_user_email: ' + SW.current_user_email);
	  //console.log('SW.current_user_name: ' + SW.current_user_name);
	  //console.log('SW.current_user_number: ' + SW.current_user_number);
	  //console.log('SW.current_user_uname: ' + SW.current_user_uname);
	  
	$('.type_checkbox').on('change', function() {
		  
		  if($(this).is(':checked')) {
				
			  console.log(this.id +' has been checked!');
				

          	//empty the selected types array
          	SW.type_bitmap = [0,0,0,0,0,0,0,0];
	          
          	$.each($('.type_checkbox'),function() {
          		//empty global list here
          		
          		if($(this).is(':checked')) {
          			
              		//console.log('add id: ' + this.id + ' to the global list');
              		//SW.selected_types.push(this.id);
              		var index = SW.getTypeIndex(this.id);
              		SW.type_bitmap[index] = 1;
  	              
          		} 
          		
          	});
			
			  console.log('bitmap: ' + SW.type_bitmap);
          	console.log('selected_types: ' + SW.selected_types);
			  
				
		  } else {

			//empty the selected types array
	          //SW.selected_types = [];
	          SW.type_bitmap = [0,0,0,0,0,0,0,0];
	          
			  console.log(this.id +' has been unchecked!');
			  $.each($('.type_checkbox'),function() {
	          		//empty global list here
	          		
				if($(this).is(':checked')) {
	          			
	          	  //console.log('add id: ' + this.id + ' to the global list');
	              //SW.selected_types.push(this.id);
	              var index = SW.getTypeIndex(this.id);
	              SW.type_bitmap[index] = 1;
	          	} 
	          		
			  });
			
			  console.log('bitmap: ' + SW.type_bitmap);

			  
		  } 
	
	});  
	
	
	$('button#search_button').click(function() {
		

		/*
		console.log('text: ' + text);
		
		if(text == '') {
			text = '*';
		}
		
		var url = 'http://localhost:1337/' + 'search_results/' + '5112?text=' + text;
		*/
		
	
		
		
		var text = 'tag';
		
		text = $('#search_text').val();
		
		var keyword = $('#keyword_text').val();
		
		console.log('text: ' + text);
		
		if(text == '') {
			text = '*';
		}
		
		var url = '';
		
		if(keyword != undefined) {
			url = 'http://' + SW.hostname + ':' + SW.port + '/search_results/' + SW.current_user_number + '?text=' + text + '&keyword=' + keyword;
		} else {
			url = 'http://' + SW.hostname + ':' + SW.port + '/search_results/' + SW.current_user_number + '?text=' + text;
		}
		
		
		
		//create the initial children
		$.ajax({
			url: url,
			global: false,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				console.log('success');

				$('#results').empty();
				$criteria = $('<div class="row-fluid" style="margin-bottom:20px;"><div class="span12">Insert Criteria here</div></div>');
				$('#results').append($criteria);
				
				for(var i=0;i<data.length;i++) {
					  var result = data[i];
					  //console.log('result: ' + i);
					  for(var key in result) {
						  //console.log('\tkey: ' + key + ' result: ' + result[key]);
					  }
				}
				
				processResults(data);
				
				
			},
			error: function() {
				console.log('error in getting search results');
			}
		});
		
		
		
	});
	
});


function processResults(data) {
	var bitmap = SW.type_bitmap;
	
	for(var i=0;i<data.length;i++) {
		var result = data[i];
		
		var type = result['type'];
		
		console.log('type: ' + type + ' bitmap: ' + bitmap[type]);
		if(bitmap[type]==1) {
			
			
			var $record = $('<div class="row-fluid"></div>');

			
			//content
			var $content = $('<div class="span9" id="' + result['nid'] + '"></div>')
			var $type = $('<div class="row-fluid"><div class="span12">Type: ' + SW.type_str[type] + ' ' + result['nid'] + '</div></div>');
			$content.append($type);
			
			//tags have to be handled a little differently
			
			/*
			if(type == 6) {
				for(var key in result) {
					
					var $property = $('<div class="row-fluid">' +  
							  '<div class="span1"></div>' +
							  '<div class="span3">' + key + '</div>' +
							  '<div class="span8">' + result[key] + '</div>' +
							  '</div>');
					$content.append($property);
					
				}		
				var $links = $('<a id="' + result['nid'] + '">' + 'Tagged resources</a>').click(function(){
					alert('this.id: ' + this.id);
				});
				var $property = $('<div class="row-fluid">' +  
						  '<div class="span1"></div>' +
						  '<div class="span3">' + Tagged Resources + '</div>' +
						  '<div class="span8">' + result[key] + '</div>' +
						  '</div>');
			}
			*/
			//all others handled the same
			if(type == 6) {
				for(var key in result) {

					var $property = $('<div class="row-fluid"></div>');
					
					
					var $space = $('<div class="span1"></div>');
					var $key = $('<div class="span3">' + key + '</div>');
					var $result = $('<div class="span8">' + result[key] + '</div>');
					$property.append($space);
					$property.append($key);
					$property.append($result);
					
					
					$content.append($property);
					
				}			
				
				var $property = $('<div class="row-fluid" id="property_' + result['nid'] + '"></div>');
				
				var $links = $('<a id="' + result['nid'] + '" style="cursor:pointer">' + 'Tagged resources</a>').click(function(){
					alert('this.id: ' + this.id);
					
					
					
					var uid = SW.current_user_number;
					  
					var url = 'http://' + SW.hostname + ':' + SW.port + '/tags/links/' + this.id;
					  
					var id = this.id;
					console.log('url--->' + url);
					$.ajax({
					 	type: "GET",
					  	url: url,
					  	success: function(linksData) {

					  		console.log('success');
					  		
					  		var linksArr = [];
				            linksArr = JSON.parse(linksData);
				            var linkCount = linksArr.length;
				            
				            console.log('linkCount: ' + linkCount);
				            
				            // Now populate the tag cloud in the lower left display panel.
				            if(linkCount > 0) {		// We don't care about displaying tags with no links. The interface should prevent such tags from being created anyway.
				            
				            	
				            	//var $tags_contents_list = tagsContentListForSearch();
				            	//var $tags_contents_list = tagsContentListForSearch(element,linksData);
				            	
				            	var $tag_contents_list = $('<ul id="tagContentsList"></ul>');
				            	
				            	for(var i = 0; i < linkCount; i++) {
				            		
				            		var resName = linksArr[i]['name'];
				            		var resNid = linksArr[i]['nid'];
				            		var resType = linksArr[i]['type'];
				            		
					            	$tag_resource_item_li = $('<li id="tagResource_'+resNid+'"></li>');
					        		$tag_resource_name = $('<span style="font-weight:bold">'+resName+' ('+resType+')&nbsp;</span> ');

					        		$tag_resource_item_li.append($tag_resource_name);
					        		//$tag_resource_item_li.append($tag_resource_morelink);
					        		//$tag_resource_item_li.append($tag_resource_info);
					        		$tag_contents_list.append($tag_resource_item_li);
				            	}
				            	
				            	console.log('Contents List: ' + $tag_contents_list.html());
				            	
				            	$('#property_' + id).append($tag_contents_list);
				            	
				            	alert('#property_' + id);
				            	
				            }
					  		
				            
					  		
					  		
					  	},
					  	error: function() {
					  		
					  		console.log('error');
					  		
					  	}
					  	
					});
						
					  
					
					
					
					
					
				});
				
				var $space = $('<div class="span1"></div>');
				
				var $key = $('<div class="span3"></div>');
				$key.append($links);
				
				var $result = $('<div class="span8">' + '</div>');
				
				$property.append($space);
				$property.append($key);
				$property.append($result);
				
				
				$content.append($property);
					
				
			}
			
			//all others handled the same
			if(type != 6 && type != 7) {
				for(var key in result) {

					var $property = $('<div class="row-fluid"></div>');
					
					
					var $space = $('<div class="span1"></div>');
					var $key = $('<div class="span3">' + key + '</div>');
					var $result = $('<div class="span8">' + result[key] + '</div>');
					$property.append($space);
					$property.append($key);
					$property.append($result);
					
					
					$content.append($property);
					
				}			
				
			}
			
			//functionality/buttons
			var $buttons = $('<div class="span3"></div>');
			$buttons.append($('<div>insert any functionality here</div>'));
			
			
			//append to the record
			$record.append($content);
			$record.append($buttons);
			
			$('#results').append($record);
			
			var $separator = $('<hr>');	
			$('#results').append($separator);
		}
		
	}
	
	
}


function tagsContentListForSearch() {
	
	$tag_contents_list = $('<ul id="tagContentsList"></ul>');
	
	$tag_contents_list.append('<li>item</li>');
	
	console.log('Contents List: ' + $tag_contents_list.html());
	
	return $tag_contents_list;
	
}

function tagsContentListForSearch(element,linksData) {
	$tag_contents_list = $('<ul id="tagContentsList"></ul>');
	
	
	
	  /*
	  
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
	  */
	  return $tag_contents_list;
	  		
		    	
	  
	  
	}






/*
var hasLinks = false;
for(var key in result) {
	if(key != 'links') {
		var $property = $('<div class="row-fluid">' +  
				  '<div class="span1"></div>' +
				  '<div class="span3">' + key + '</div>' +
				  '<div class="span8">' + result[key] + '</div>' +
				  '</div>');
		$content.append($property);
	} else {
		hasLinks = true;
	}
	
}
if(hasLinks) {
	var $property = $('<div class="row-fluid">' +  
			  '<div class="span1"></div>' +
			  '<div class="span3">' + 'links' + '</div>' +
			  '<div class="span8">' + 'links stuff' + '</div>' +
			  '</div>');
	$content.append($property);
}
*/