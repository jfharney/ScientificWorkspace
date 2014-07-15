function createTag() {
	
	var user = SW.current_user_uuid;
	  
	  //user = '5112';

	  var username = SW.current_user_username;
	  var usernumber = SW.current_user_number;
	  
	  console.log('username: ' + username + ' usernumber: ' + usernumber + ' file node ids: ' + SW.selected_file_nids);
	  
	  var selected_file_titles = SW.selected_file_titles;
	  
	  var input = '';
	  //put the user data in the hidden input fields
	  //input += addUserData(user_data);
	
	  //alert('SW.selected_file_titles: ' + SW.selected_file_titles);
	  
	  var timeStamp = new Date().getTime();
	  
	  var tagName = 'tag' + timeStamp;
	  
	  console.log('url for creating a tag -> ' + 'http://160.91.210.19:8080/sws/tag?name='+tagName+'&uid=5112');
	  

	  var tagDescription = 'tagdesc' + timeStamp;
	  
	  //var url = 'http://' + SW.hostname + ':' + SW.port + '/tagproxy/'+usernumber;
	  var url = 'http://' + SW.hostname + ':' + SW.port + '/tagproxy/'+usernumber + '?name=' + tagName + '&description=' + tagDescription;
	  
	  //url = url + '?path=|';
	  //var children = [];
	  //alert('url: ' + url);
	  
	  $.ajax({
		    url: url,
		    global: false,
			type: 'POST',
			success: function(data) {
				
				console.log('success in creating tag ');
				
				 var tag_nid = data['nid'];
				  
				 //associate tag to selected files
				 if(SW.selected_file_nids != undefined) {
					 console.log('selected_file_nids: ' + SW.selected_file_nids + ' selected_file_nids.length ' + SW.selected_file_nids.length + ' [0]: ' + SW.selected_file_nids[0]);
					 
					 for(var i=0;i<SW.selected_file_nids.length;i++) {
						  
						 //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_file_nids[i]); //?name='+tagName+'&uid=5112');
						  
						 var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + usernumber;
						 association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_file_nids[i] + '&type=' + 'file';
							 
						 
						 $.ajax({
							    url: association_url,
							    global: false,
								type: 'POST',
								success: function(data) {

									for(var key in data) {
										console.log('file key: ' + key + ' value: ' + data[key]);
									}
									
									console.log('assoc files success');
								},
								error: function() {
									console.log('assoc files error');
								}
						 });
						 
					 }
				 }
				 
				//associate tag to groups
				 if(SW.selected_group_nids != undefined) {
					 console.log('selected_group_nids: ' + SW.selected_group_nids + ' selected_group_nids.length ' + SW.selected_group_nids.length + ' [0]: ' + SW.selected_group_nids[0]);
					 
					 for(var i=0;i<SW.selected_group_nids.length;i++) {
						  
						 //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_group_nids[i]); //?name='+tagName+'&uid=5112');
						  
						 var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + usernumber;
						 association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_group_nids[i] + '&type=' + 'group';
						 	
						 
						 //alert('association_url: ' + association_url);
						 $.ajax({
							    url: association_url,
							    global: false,
								type: 'POST',
								success: function(data) {
									
									for(var key in data) {
										console.log('group key: ' + key + ' value: ' + data[key]);
									}
									
									console.log('assoc files success');
								},
								error: function() {
									console.log('assoc files error');
								}
						 });
						 
						  
					 }
				 }
				 

				 //associate tag to selected jobs
				 if(SW.selected_job_nids != undefined) {
						
					 for(var i=0;i<SW.selected_job_nids.length;i++) {
						  
						  //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_job_nids[i]); //?name='+tagName+'&uid=5112');
						  
						  var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + usernumber;
						  association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_job_nids[i] + '&type=' + 'job';
							 
						  //alert('association_url: ' + association_url);
						  $.ajax({
							    url: association_url,
							    global: false,
								type: 'POST',
								success: function(data) {

									for(var key in data) {
										console.log('job key: ' + key + ' value: ' + data[key]);
									}
									
									
									console.log('assoc jobs success');
								},
								error: function() {
									console.log('assoc jobs error');
								}
						 });
					 
					 }
				 }
				 

				 //associate tag to selected users
				 if(SW.selected_user_nids != undefined) {
						
					 for(var i=0;i<SW.selected_user_nids.length;i++) {
						  
						  //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_user_nids[i]); //?name='+tagName+'&uid=5112');
						  
						  var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + usernumber;
						  association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_user_nids[i] + '&type=' + 'user';
							 
						  //alert('association_url: ' + association_url);
						  $.ajax({
							    url: association_url,
							    global: false,
								type: 'POST',
								success: function(data) {

									for(var key in data) {
										console.log('user key: ' + key + ' value: ' + data[key]);
									}
									
									console.log('assoc users success');
								},
								error: function() {
									console.log('assoc users error');
								}
						 });
					 
					 }
				 }
				 

				 //associate tag to selected apps
				 if(SW.selected_app_nids != undefined) {
						
					 for(var i=0;i<SW.selected_app_nids.length;i++) {
						  
						  console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_app_nids[i]); //?name='+tagName+'&uid=5112');
						  
						  console.log('nids ' + i + ' ' + SW.selected_app_nids[i]);
						 
						  var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + usernumber;
						  association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_app_nids[i] + '&type=' + 'app';
							 
						  //alert('association_url: ' + association_url);
						  $.ajax({
							    url: association_url,
							    global: false,
								type: 'POST',
								success: function(data) {
									console.log('assoc apps success');
								},
								error: function() {
									console.log('assoc apps error');
								}
						 });
					 
					 }
				 }
				 
				
				
				
				
			},
			error: function() {
				
				alert('error');
				
			}
	  });
			
	  
	 
	  
	//curl -X POST 'http://160.91.210.19:8080/sws/tag?name=tag11&uid=5112'
	  
	  //POST [base URI]/tag/{tag_nid}/link/{obj_nid}
	  //curl -X POST http://techint-b117:8080/sws/tag/600012/link/88388
	  
	  
	  /*
	  input += addCreator();
	  
	  //put the selected file keys in the hidden input fields
	  input += addResources(SW.selected_file_titles);
		
	  //put the selected apps/jobs in the hidden input fields
	  input += addJobs(SW.selected_job_titles);
		
	  //put the selected apps/jobs in the hidden input fields
	  input += addGroups(SW.selected_group_titles);
		
	  //put the selected apps/jobs in the hidden input fields
	  input += addUsers(SW.selected_user_titles);
		
	
		
	  //put the selected collaborators in the hidden input fields (may be deprecated)
		  
	  url = "http://" + "localhost" + ":" + "1337" + "/doispace/" + username + "";
		
	  console.log('input: ' + input + ' url: ' + url);
	  */
	  
	  
	  //send request
	  //jQuery('<form action="'+ url +'" method="post">'+input+'</form>')
      // .appendTo('body').submit().remove();
	
		
		
	
}

$(document).ready(function() {
	
  $('#create_tag').click(function() {

	  
	  
	  createTag();
	  
	  /*
	  console.log('In create tag');
	  console.log('selected file nids: ' + SW.selected_file_nids);
	  console.log('selected file titles: ' + SW.selected_file_titles);  
	  
	  var host = 'localhost';
	  var port = '1337';

    //var user_label = $('#user_info_id').html();
    //console.log(user_label.trim());

	  var uid = SW.current_user_username;
    
	  console.log('uid: ' + uid);
    
	  var url = 'http://' + host + ':' + port + '/tagproxy';

	 
	  var tagname = $('#tag_name').val();
	  var tagdescription = $('#tag_description').val();
	  
	  if(tagname == '' || tagname == undefined) {
		  alert('please enter a tag name');
	  } else {
		var input_data = {

			  'uid' : uid,
			  'tag_name' : tag_name,
			  'tag_description' : tag_description
		}
		
		url = url + '?uid=' + uid + '&tag_name=' + tag_name + '&tag_description=' + tag_description;
		
		console.log('url: ' + url);

	  }
	  
	  */
	  
	  
	  
	  
	  
    /*
    var tagged_files = new Array();
    var tagged_files_keys = new Array();

    if(SW.selected_file_items != '') {
    	tagged_files = SW.selected_file_items;
    }

    if(SW.selected_file_keys != '') {
    	tagged_files_keys = SW.selected_file_keys;
    }
    
    var tagged_resources = new Array();
    var tagged_resources_types = new Array();
    var tagged_resources_keys = new Array();
    
    
    
    
    
    //var uid = user_label.trim();
    var uid = SW.current_user_username
    var tagname = $('#tag_name').val();
    var tagdescription = $('#tag_description').val();
    var tagged_items = new Array();
    var tagged_types = new Array();

    if(SW.tagged_items != '') {
      tagged_items = SW.tagged_items.split(', ');
    }

    if(SW.tagged_types != '') {
      tagged_types = SW.tagged_types.split(', ');
    }

    var tag_name = tagname;
    var tag_description = tagdescription;

    if(tag_name == '') {
      tag_name = 'tagname1';
    }
    if(tag_description == '') {
      tag_description = 'tagdescription1';
    }

    var url = 'http://' + host + ':' + port + '/tagproxy';

    var input_data = {
      'uid' : uid,
      'tag_name' : tag_name,
      'tag_description' : tag_description
    }

    url = url + '?uid=' + uid + '&tag_name=' + tag_name + '&tag_description=' + tag_description;
		
			
    
    var collisionFlag = false;
    
    //var $tagCloud = $('#tagClouds a');
    //var $tagList = $tagCloud.children(); 
    
    //console.log("Here are the children:");
    //for(i in $tagCloud)
      //console.log(i + ": " + $tagCloud[i].html());
    
    var allAnchorElements = $("a");
    //$("#tagClouds").find(allAnchorElements).html(tag_name);
    $("#tagClouds").find(allAnchorElements).each(function(){
    	if($(this).text() == tag_name)
    		collisionFlag = true;
    })
    	
    
    $('#myModal').dialog('close');
    
    console.log('tag url: ' + url);
    
    
                  
    $.ajax({
      type: "POST",
      url: url,
      data: input_data,
      success: function(data)
      {
        console.log('successful tag creations ' + data);
        
        ///*
        for(var key in data) {
          //console.log('key: ' + key + ' value: ' + data[key]);
        }
                    	               	  
        var tag_uuid = data['uuid'];
        var tag_name = data['tagname'];
        
        url = 'http://' + host + ':' + port + '/associationsproxy?';
        url += 'tag_uuid=' + tag_uuid;

        var length = tagged_items.length;

        var tagged_item = '';
        var tagged_type = '';
                                            
        var base_url = url;
        if(length < 1) {
          alert('nothing to associate '  + data );
        } 
        else if(length > 1) {
	      console.log('calling addAssociation for multiple items');
	      for(var j = 0; j < tagged_items.length; j++) {
	    	url = base_url;
	        tagged_item = tagged_items[j];
	        tagged_type = tagged_types[j];
	        //addAssociation(url, input_data, length, tagged_item, tagged_type);
	        
	        
	        
	        url += '&length=' + length;
	        url += '&tagged_item=' + tagged_item;
	        url += '&tagged_type=' + tagged_type;
	        
	        console.log('associations url: ' + url);
	        
	        $.ajax({
	          type: "POST",
	          url: url,
	          data: input_data,
	          success: function(associations_data) 
	          {
	            //console.log('associations response: ' + associations_data);
	            if(associations_data == 'success') {
	              console.log('Tag successfully added to resources');
	            } else {
	              console.log('Tag not successfully added to resources');
	            }
	          },
	          error: function(xhr, status, error) {
	            alert('error');
	            if(xhr.status == 404) { }
	          }
	        });
	        
          }
	    } 
        else {
          tagged_item = tagged_items;
          tagged_type = tagged_types;


          //addAssociation(url, input_data, length, tagged_item, tagged_type);
          
          url += '&length=' + length;
          url += '&tagged_item=' + tagged_item;
          url += '&tagged_type=' + tagged_type;
          

          console.log('associations url: ' + url);
          
          $.ajax({
            type: "POST",
            url: url,
            data: input_data,
            success: function(associations_data) 
            {
              //console.log('associations response: ' + associations_data);
              if(associations_data == 'success') {
                console.log('Tag successfully added to resources');
              }
            },
            error: function(xhr, status, error) {
              alert('error');
              if(xhr.status == 404) { }
            }
          });
          
          
        }
        alert('closing mymodal: ');
        //
        
        
      },
      error: function() 
      {
        console.log('error in associations');
      }
    });		// End of ajax call. 
    */
    
    
  });		// End of $('#create_tag').click(function()
	
  //var num_tags_returned = 3;

  

          
  

});











































/*
  function addAssociation(url, input_data, length, tagged_item, tagged_type) 
  {
	 // alert('am i here?');
    url += '&length=' + length;
    url += '&tagged_item=' + tagged_item;
    url += '&tagged_type=' + tagged_type;
    alert("About to make AJAX call to " + url);
    

    console.log('associations url: ' + url);
    
    $.ajax({
      type: "POST",
      url: url,
      data: input_data,
      success: function(associations_data) 
      {
        //console.log('associations response: ' + associations_data);
        if(associations_data == 'success') {
          console.log('Tag successfully added to resources');
        }
      },
      error: function(xhr, status, error) {
        alert('error');
        if(xhr.status == 404) { }
      }
    });
  }
*/
  
  
  
  
  /*
	$('#search_tags').click(function() {

  	  
  	  
  	  
            $('#tag_results').empty();


            url = url + '?tag_name=' + tag_name + '&tag_description=' + tag_description;

            $.ajax({
                    type: "GET",
                    url: url,
                    data: data,
                    success: function(data)
                    {

                            if(data == 'success') {
                                    console.log('Tag successfully created');
                            } else {
                                    console.log('Tag not successfully created.  Please try again');
                            }
                    },
                    error: function(xhr, status, error) {
                      if(xhr.status==404)
                        { }
                    }
                  });

            for(var i=0;i<num_tags_returned;i++) {
                    $('#tag_results').append('<div>tag ' + i + '</div>');
            }
            

    });
*/

  
  
  /*
  $('#add_tag_button').click(function(){
	  
	  
          var tagged_items = new Array();
          tagged_items = SW.tagged_items.split(', ');
          var tagged_types = new Array();
          tagged_types = SW.tagged_types.split(', ');

          $('#resources_to_tag').empty();
          $('#resources_to_tag').append('<span>' + tagged_items + '</span>');
          $('#resources_to_tag').append('<div><span>' + tagged_types + '</span></div>');
          console.log('resources to tag: ' + $('#resources_to_tag').html());
     
  });
 */
  
