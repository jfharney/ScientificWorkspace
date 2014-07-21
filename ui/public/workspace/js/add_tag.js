$(document).ready(function() {
	
  $('#create_tag1').click(function() {

    createTag();
	$('#myModal').modal('hide');
	
	/* Cause current window to reload so tag cloud is refreshed. May wish to update cloud asynchronously later. */ 
	location.reload();
	
	/* Reset fields for next tag creation. */
	$('#tag_name').val('');
	$('#tag_description').val('');
	  
  });

});

function createTag() {
	
  var user = SW.current_user_uuid;

  var username = SW.current_user_username;
  var usernumber = SW.current_user_number;
	  
  console.log('username: ' + username + ' usernumber: ' + usernumber + ' file node ids: ' + SW.selected_file_nids);
	  
  //var selected_file_titles = SW.selected_file_titles;
	  
  var input = '';
  //put the user data in the hidden input fields
  //input += addUserData(user_data);
  //console.log('In add_tag.js, input is: '+input);
	
  // The global SW.selected_file_titles is set in the onSelect field of the dynatree constructor 
  // in the function buildFileTree in the file ajax/fileinfo.js. It is a string which is a comma
  // separated list. 
  console.log('SW.selected_file_titles: ' + SW.selected_file_titles);
	  
  //alert('input#tag_name: ' + $('input#tag_name').val() + ' textarea#tag_description: ' + $('textarea#tag_description').val());
	  

  //quick tagging name convention
  var timeStamp = new Date().getTime();
	  
  var tagName = '';
  if($('input#tag_name').val() != null ||
     $('input#tag_name').val() != '' ||
	 $('input#tag_name').val() != undefined ||
	 $('input#tag_name').val() != ' ') {
    tagName = $('input#tag_name').val();
  } 
  else {
    tagName = 'tag' + timeStamp;
  }

		  
	  
	  //replace with real description
	  var tagDescription = 'tagdesc' + timeStamp;
	  //var tagDescription = $('textarea#tag_description').val();
	  
	  
	  console.log('url for creating a tag -> ' + 'http://160.91.210.19:8080/sws/tag?name='+tagName+'&uid=5112');
	  

	  
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
				 associateFiles(tag_nid);
				 
				 //associate tag to groups
				 associateGroups(tag_nid);
				 
				 //associate tag to selected jobs
				 associateJobs(tag_nid);
				 
				 //associate tag to selected users
				 associateUsers(tag_nid);

				 //associate tag to selected apps
				 associateApps(tag_nid);
				
				
				 
				 //either reload the page or dynamically add tag
				 //default is that the page will reload
				 addTagToPage();
				 
				
			},
			error: function() {
				
				alert('error');
				
			}
	  });
			
	  
	
		
		
	
}


function addTagToPage() {
	
	//location.href='http://' + SW.hostname + ':' + SW.port + '/workspace/' + SW.current_user_username;
	
}


function associateGroups(tag_nid) {
	
	if(SW.selected_group_nids != undefined) {
		 console.log('selected_group_nids: ' + SW.selected_group_nids + ' selected_group_nids.length ' + SW.selected_group_nids.length + ' [0]: ' + SW.selected_group_nids[0]);
		 
		 for(var i=0;i<SW.selected_group_nids.length;i++) {
			  
			 //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_group_nids[i]); //?name='+tagName+'&uid=5112');
			  
			 var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
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
	 

}


function associateUsers(tag_nid) {
	
	if(SW.selected_user_nids != undefined) {
		
		 for(var i=0;i<SW.selected_user_nids.length;i++) {
			  
			  //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_user_nids[i]); //?name='+tagName+'&uid=5112');
			  
			  var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
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
	 
}


function associateFiles(tag_nid) {
	
  if(SW.selected_file_nids != undefined) {
    console.log('selected_file_nids: ' + SW.selected_file_nids + ' selected_file_nids.length ' + SW.selected_file_nids.length + ' [0]: ' + SW.selected_file_nids[0]);
    for(var i = 0; i < SW.selected_file_nids.length; i++) {
			  
			 //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_file_nids[i]); //?name='+tagName+'&uid=5112');
			  
			 var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
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
	
}


function associateJobs(tag_nid) {
	
	if(SW.selected_job_nids != undefined) {
		
		 for(var i=0;i<SW.selected_job_nids.length;i++) {
			  
			  //console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_job_nids[i]); //?name='+tagName+'&uid=5112');
			  
			  var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
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
	
}


function associateApps(tag_nid) {
	if(SW.selected_app_nids != undefined) {
		
		 for(var i=0;i<SW.selected_app_nids.length;i++) {
			  
			  console.log('curl url -> ' + 'http://160.91.210.19:8080/sws/tag/' + tag_nid + '/link/' + SW.selected_app_nids[i]); //?name='+tagName+'&uid=5112');
			  
			  console.log('nids ' + i + ' ' + SW.selected_app_nids[i]);
			 
			  var association_url = 'http://' + SW.hostname + ':' + SW.port + '/associationproxy/' + SW.current_user_number;
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
	 
}








































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
 * Removed 7-15 ... keeping because the collision detection is included 
 
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
