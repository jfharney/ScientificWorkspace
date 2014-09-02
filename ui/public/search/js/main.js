

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
	
		SW.hostname + ':' + SW.port;
		alert("'http://localhost:8080/sws/search?uid=7827&query=v.name=OLCF+AND+v.type=8+AND+v.keywd:peru+AND+v.desc:new+AND+v.ctime:[0+TO+9999999999]'");
		
		
		var text = 'tag';
		
		text = $('#search_text').val();
		
		console.log('text: ' + text);
		
		if(text == '') {
			text = '*';
		}
		
		var url = 'http://' + SW.hostname + ':' + SW.port + '/search_results/' + SW.current_user_uname + '?text=' + text;
		
		alert('search button url: ' + url);
		/*
		//create the initial children
		$.ajax({
			url: url,
			global: false,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				console.log('success');

				var search_arr = new Array();
				// (0=user,1=group,2=job,3=app,4=file,5=dir,6=tag)
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
				
			},
			error: function() {
				console.log('error in getting group info');
			}
		});
		*/
	});
	
});



/*
//SW.type_str = ['user','group','job','app','file','dir','tag','doi'];
function getTypeBitMap(selected_types) {
	
	var bitmap = [0,0,0,0,0,0,0]
	
	for(var i=0;i<selected_types.length;i++) {
		var type = 
	}
	
	
}
*/


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
			
			/*
			for(var key in data[i]) {
				//console.log('key: ' + key + ' value: ' + data[i][key]);
			
				
			
			
			
				
				
				
				
			} 
			*/
		}
	}
	
	//$('#results').append('<div>hello</div>');
	
	
}