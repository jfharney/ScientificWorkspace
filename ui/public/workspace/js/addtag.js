$(document).ready(function()
{
  $('#create_tag').click(function() 
  {
    console.log('SW.tagged_items: ' + SW.tagged_items);
    var host = 'localhost';
    var port = '1337';

    var user_label = $('#user_info_id').html();
    console.log(user_label.trim());
              	  
    var uid = user_label.trim();
              	  
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
				
    /*********************************/
    
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
    	
    
    /*var $result = $('#tagClouds').find(allAnchorElements);
    for(i in $result) {
    	if($result[i].html() == tag_name)
    		collisionFlag = true;
    	console.log("$result[i].html() : " + $result[i].html());
    }*/
    
    alert("Value of collisionFlag is " + collisionFlag);
    
    /*********************************/
                  
    $.ajax({
      type: "POST",
      url: url,
      data: input_data,
      success: function(data)
      {
        //alert('success ' + data);
        for(var key in data) {
          console.log('key: ' + key + ' value: ' + data[key]);
        }
                    	               	  
        var tag_uuid = data['uuid'];
        var tag_name = data['tagname'];
        
        url = 'http://' + host + ':' + port + '/associationsproxy?';
        url += 'tag_uuid=' + tag_uuid;

        var length = tagged_items.length;

        var tagged_item = '';
        var tagged_type = '';
                                            
        if(length < 1) {
          alert('nothing to associate '  + data );
        } 
        else if(length > 1) {
	      alert('calling addAssociation for multiple items');
	      for(var j = 0; j < tagged_items.length; j++) {
	        tagged_item = tagged_items[j];
	        tagged_type = tagged_types[j];
	        addAssociation(url, input_data, length, tagged_item, tagged_type);
          }
	    } 
        else {
          tagged_item = tagged_items;
          tagged_type = tagged_types;

          alert('calling addAssociation for single item');
alert('sending url: ' + url);
          addAssociation(url, input_data, length, tagged_item, tagged_type);
        }
      },
      error: function() 
      {
        alert('error');
      }
    });		// End of ajax call. 
  });		// End of $('#create_tag').click(function()

  var num_tags_returned = 3;

  $('#search_tags').click(function() {

        	  
        	  
        	  /*
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
                  */

          });



          $('#add_tag_button').click(function(){
        	  
        	  /*
                  var tagged_items = new Array();
                  tagged_items = SW.tagged_items.split(', ');
                  var tagged_types = new Array();
                  tagged_types = SW.tagged_types.split(', ');

                  $('#resources_to_tag').empty();
                  $('#resources_to_tag').append('<span>' + tagged_items + '</span>');
                  $('#resources_to_tag').append('<div><span>' + tagged_types + '</span></div>');
                  console.log('resources to tag: ' + $('#resources_to_tag').html());
              */
          });



  });

  
  function addAssociation(url, input_data, length, tagged_item, tagged_type) 
  {
    url += '&length=' + length;
    url += '&tagged_item=' + tagged_item;
    url += '&tagged_type=' + tagged_type;
    alert("About to make AJAX call to " + url);
    
    $.ajax({
      type: "POST",
      url: url,
      data: input_data,
      success: function(associations_data) 
      {
        console.log('associations response: ' + associations_data);
        if(associations_data == 'success') {
          alert('Tag successfully added to resources');
        }
      },
      error: function(xhr, status, error) {
        alert('error');
        if(xhr.status == 404) { }
      }
    });
  }
