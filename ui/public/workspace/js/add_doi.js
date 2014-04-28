

  $(document).ready(function(){

	  
	  $('#create_doi_button').click(function() {
		 
		  console.log('create doi');
		  

          var selected_file_items = new Array();
          var selected_file_types = new Array();
          var selected_file_keys = new Array();
          
          
		  if(SW.selected_file_items != '') {
			  selected_file_items = SW.selected_file_items.split(', ');
		  }

		  if(SW.selected_file_types != '') {
			  selected_file_types = SW.selected_file_types.split(', ');
		  }


		  if(SW.selected_file_keys != '') {
			  selected_file_keys = SW.selected_file_keys.split(', ');
		  }

		  var url = "http://" + "localhost" + ":" + "1337" + "/doi/jamroz?";
		  
		  
		  for(var i=0;i<selected_file_keys.length;i++) {
			  var arg = 'selected_file_key=' + selected_file_keys[i] + '&';
			  url = url + arg;
			  console.log('selected_file_key=' + selected_file_keys[i]);  
		  }
		  
		  console.log('url: ' + url);
		  //location.href = "http://" + "localhost" + ":" + "1337" + "/doi/jamroz";
		  
		  location.href = url;
	  });
	  
	  
/*
          $('#create_tag').click(function() {

                  console.log('SW.tagged_items: ' + SW.tagged_items);

                  
                  
                  var host = 'localhost';
                  var port = '1337';

              	  var user_label = $('#user_info_id').html();
              	  console.log(user_label.trim());
              	  
              	  var uid = user_label.trim();
                  //var uid = //'5112';
              	  
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
				
                  alert('url: ' + url);
                  
                  $.ajax({
                      type: "POST",
                      url: url,
                      data: input_data,
                      success: function(data)
                      {
                    	  alert('success ' + data);
                    	  for(var key in data) {
                    		  console.log('key: ' + key + ' value: ' + data[key]);
                    	  }
                    	  
                    	  
                    	  var tag_uuid = data['uuid'];
                          var tag_name = data['tagname'];


                          //alert('tagged_items: ' + tagged_items);
                          url = 'http://' + host + ':' + port + '/associationsproxy?';
                          url += 'tag_uuid=' + tag_uuid;


                          var length = tagged_items.length;

                          var tagged_item = '';
                          var tagged_type = '';
                          
                          
                          if(length < 1) {
                              alert('nothing to associate '  + data );



                          } else if(length > 1) {
	                          alert('calling addAssociation for multiple items');
	                          for(var j=0;j<tagged_items.length;j++) {
	
	
	                                  tagged_item = tagged_items[j];
	                                  tagged_type = tagged_types[j];
	
	                                  addAssociation(url,input_data,length,tagged_item,tagged_type);
                    	  
	                          }
	                          
	                          
                          } else {

                              tagged_item = tagged_items;
                              tagged_type = tagged_types;

                              alert('calling addAssociation for single item');

                              addAssociation(url,input_data,length,tagged_item,tagged_type);
                              

                          }
                    	  
                      },
                      error: function() {
                    	  alert('error');
                      }
                  });
                  
                  

          });
*/
	  
	  
	  
          
          


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

  
  function addAssociation(url,input_data,length,tagged_item,tagged_type) {


	  /*
      url += '&length=' + length;
      url += '&tagged_item=' + tagged_item;
      url += '&tagged_type=' + tagged_type;


      //alert('associations url: ' + url);
      

      //alert('associations tagged_item: ' + tagged_item + ' tagged_type: ' + tagged_type);
      
      
      
      //associations api
      $.ajax({
            type: "POST",
            url: url,
            data: input_data,
            success: function(associations_data) {
                    console.log('associations response: ' + associations_data);
                    if(associations_data == 'success') {
                    	alert('Tag successfully added to resources');
                    	
                    	//add the tag to the table
                    	
                    	
                    	
                    	
                    }
                    
                    
            },
            error: function(xhr, status, error) {
                    alert('error');
                if(xhr.status==404)
                  { }
              }
      });

		*/

}





                            	  
                            	  
                            	  
                            	  
                            	  
                            	  
