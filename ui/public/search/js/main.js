

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
				
				/*
				var search_arr = new Array();
				// (0=user,1=group,2=job,3=app,4=file,5=dir,6=tag,7=doi)
				var usersChecked = $("#Users").is(':checked');
				if(usersChecked) {
					search_arr.push('1');
				} else {
					search_arr.push('0');
				}
				
				var groupsChecked = $("#Groups").is(':checked');
				if(usersChecked) {
					search_arr.push('1');
				} else {
					search_arr.push('0');
				}
				
				var jobsChecked = $("#Jobs").is(':checked');
				if(jobsChecked) {
					search_arr.push('1');
				} else {
					search_arr.push('0');
				}
				
				var appsChecked = $("#Apps").is(':checked');
				if(appsChecked) {
					search_arr.push('1');
				} else {
					search_arr.push('0');
				}
				
				var filesChecked = $("#Files").is(':checked');
				if(filesChecked) {
					search_arr.push('1');
				} else {
					search_arr.push('0');
				}

				var directoriesChecked = $("#Directories").is(':checked');
				if(directoriesChecked) {
					search_arr.push('1');
				} else {
					search_arr.push('0');
				}

				var tagsChecked = $("#Tags").is(':checked');
				if(tagsChecked) {
					search_arr.push('1');
				} else {
					search_arr.push('0');
				}
				
				
				
				processResults(data,search_arr);
				*/
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

			var $content = $('<div class="span9"></div>')
			var $type = $('<div class="row-fluid"><div class="span12">Type: ' + SW.type_str[type] + '</div></div>');
			$content.append($type);
			
			var $buttons = $('<div class="span3"></div>');
			$buttons.append($('<div>insert functionality here</div>'));
			
			
			/*
			
			var $subheader = $('<div class="span10" style="margin-left: 10px">');
			var $type = $('<div>Type: ' + SW.type_str[type] + '</div>');
			$subheader.append($type);
			
			$record.append($subheader);
			
			var $body = $('<div></div>');
			
			for(var key in result) {
				$key = $('<div>' + key + '</div>');
				$body.append($key);
			}
			
			$record.append($body);
			
			
			console.log($record.html());
			*/
			
			$record.append($content);
			$record.append($buttons);
			
			$('#results').append($record);
			
			var $separator = $('<hr>');	
			$('#results').append($separator);
		}
		
	}
	
	
}


/*
function processResults(data,search_arr) {
	
	// (0=user,1=group,2=job,3=app,4=file,5=dir,6=tag)
	
	console.log('search_arr: ' + search_arr);
	$('#results').empty();
	
	console.log('process results data length----> ' + data.length);
	
	for(var i=0;i<data.length;i++) {
		
		var type = data[i]['type'];
		
		if(search_arr[type] == 1) {
			
			var html = '<div class="row-fluid">';
			
			html += '<div class="span10" style="margin-left: 10px">';

			
			html += '<div>Type: ' + SW.typeMap[type];
			html += '</div>';

			var nid = data[i]['nid'];
			html += '<div>Node id: ' + nid;
			html += '</div>';
			
			
			
			for(var key in data[i]) {
				html += '<div>' + key + ': ' + data[i][key];
				html += '</div>';
			}
			
			html += '</div>';
			html += '</div>';
			
			html += '<hr>';

			$('#results').append(html);
			
			
		}
	}
	
	
}
*/
