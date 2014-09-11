

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
				
				
				processResults(data);
				
				console.log('append DOI result here');
				//append doi results here
				$('#results').append('<div>DDDDOI result here</div>');

				var $separator = $('<hr>');	
				$('#results').append($separator);
				
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
		
		//var type = result['type'];
		
		console.log('type: ' + result['type'] + ' bitmap: ' + bitmap[result['type']]);
		if(bitmap[result['type']]==1) {
			
			var $record = $('<div class="row-fluid"></div>');

			//record content
			var $content = recordContent(result);
			
			//record functionality
			var $buttons = recordFunctionality(result);
			
			//append to the record
			$record.append($content);
			$record.append($buttons);
			
			$('#results').append($record);
			
			//separator for each record
			var $separator = $('<hr>');	
			$('#results').append($separator);
			
		}
		
	}
	
	
}


function processStandardProperty (key, result) {
	
	var $property = $('<div class="row-fluid"></div>');
	
	var $space = $('<div class="span1"></div>');
	var $key = $('<div class="span3">' + key + '</div>');
	var $result = $('<div class="span8">' + result[key] + '</div>');
	$property.append($space);
	$property.append($key);
	$property.append($result);
	
	
	
	return $property;
}




//This needs to be implemented in the tags workspace as well...
function makeTagsContentListItem(nid,result) {
	
	return function () {

		console.log('nid: ' +  nid + ' resource nid: ' + result['nid']);
			
		
		//small bug in group info being returned - want the name "name" not "gname"
	  	//small bug in app info being returned - want the name "name" not "nid"
	  	if(result['type'] == 1) {
	  		result['name'] = result['gname'];
	  	} else if(result['type'] == 3) {		
	  		result['name'] = result['nid'];
	  	} else if(result['type'] == 6) {
	  		result['name'] = result['nid'];
	  	}
	  	
	  	var type_int = result['type'];
		var resType = SW.typeMap[type_int];
		var resName = result['name'];
		var resNid = result['nid'];

		
		$tag_resource_item_li = $('<li id="tagResource_'+resNid+'"></li>');
		
		$tag_resource_name = $('<span style="font-weight:bold">'+resName+' ('+resType+')&nbsp;</span> ');
		
		$tag_resource_morelink = $('<a id="' + resNid + '_' + nid + '" style="cursor:pointer">more</a>').click(function() {
			
			if(this.innerHTML == 'more') {
				this.innerHTML = 'less';
				$('#tagResourceInfo_'+this.id).show('slow');
			} else {
				this.innerHTML = 'more';
				$('#tagResourceInfo_'+this.id).hide('slow');
			}
			
		});
		
		$tag_resource_info = $('<div id="tagResourceInfo_'+resNid+'_' + nid + '" style="display:none">' + '</div>');

		for(var key in result) {
			$key = $('<div style="margin-left:5px">' + key + ' : ' + result[key] + '</div>')
			$tag_resource_info.append($key);
		}
		

		$tag_resource_item_li.append($tag_resource_name);
		$tag_resource_item_li.append($tag_resource_morelink);
		$tag_resource_item_li.append($tag_resource_info);
		
		return $tag_resource_item_li;
		
	}
}



function processTaggedResources (result) {
	var $property = $('<div class="row-fluid"></div>');
	
	
	var $space = $('<div class="span1"></div>');
	
	//Tagged resources
	var $key = $('<div class="span3" id="' + result['nid'] + '" style="cursor:pointer">' + 'Tagged Resources' + '</div>');
	
	
	
	//Result is a listing of resources that are tagged
	var $result = $('<div class="span8"></div>');
	
	var $tag_contents_list = $('<ul id="ul_' + result['nid'] + '"></ul>');
	
	
	var uid = SW.current_user_number;
	var url = 'http://' + SW.hostname + ':' + SW.port + '/tags/links/' + result['nid'];
	
	var funcs = [];
	
	$.ajax({
	 	type: "GET",
	  	url: url,
	  	//async: false,
	  	success: function(linksData) {
	  		
	  		
	  		var linksArr = [];
            linksArr = JSON.parse(linksData);
            var linkCount = linksArr.length;
            
            console.log('resultnid: ' + result['nid']);
            
            $tag_contents_list = $('<ul id="tagContentsList"></ul>');
            
            for(var i=0;i<linkCount;i++) {
            	
            	funcs[i] = makeTagsContentListItem(result['nid'],linksArr[i]);
            	
            } 
            console.log('calling functions here');
            
            for(var j=0;j<linkCount;j++) {
            	var $tag_resource_item_li = funcs[j]();
            	
            	$tag_contents_list.append($tag_resource_item_li);
            	
            }

        	$result.append($tag_contents_list);
        	
        	
        	
        	$property.append($space);
        	$property.append($key);
        	$property.append($result);
        	
	  	},
	  	error: function() {
	  		
	  	}
	});
	
	return $property;
}

function recordContent(result) {
	
	
	var $content = $('<div class="span9" id="' + result['nid'] + '"></div>')
	
	var $type = $('<div class="row-fluid"><div class="span12">Type: ' + SW.type_str[result['type']] + ' ' + result['nid'] + '</div></div>');
	$content.append($type);
	
	
	//all others handled the same
	if(result['type'] != 6 && result['type'] != 7) {

		console.log('processing others');
		
		for(var key in result) {
			var $property = processStandardProperty(key, result);
			$content.append($property);
		}		
		
		
	} else if (result['type'] == 6) {
		
		console.log('processing tag');
		
		//standard properties
		for(var key in result) {
			var $property = processStandardProperty(key, result);
			$content.append($property);
		}		
		
		//associations
		var $property = processTaggedResources(result);
		$content.append($property);
	} else if (result['type'] == 7) {
		
		console.log('processing doi');
		
	}
	
	return $content;
	
}

function recordFunctionality() {
	
	//functionality/buttons
	var $buttons = $('<div class="span3"></div>');
	$buttons.append($('<div>insert any functionality here</div>'));
	
	return $buttons;
	
	
}


function tagsContentListForSearch() {
	
	$tag_contents_list = $('<ul id="tagContentsList"></ul>');
	
	$tag_contents_list.append('<li>item</li>');
	
	console.log('Contents List: ' + $tag_contents_list.html());
	
	return $tag_contents_list;
	
}




