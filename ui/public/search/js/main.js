

$(function(){
	
	
	$('button#search_button').click(function() {
	
		
		var text = 'tag';
		
		text = $('#search_text').val();
		
		console.log('text: ' + text);
		
		if(text == '') {
			text = '*';
		}
		
		var url = 'http://localhost:1337/' + 'search_results/' + '5112?text=' + text;
		
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
				if(groupsChecked) {
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
		
	});
	
});


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

			
			html += '<div>Type: ' + SW.type_str[type];
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