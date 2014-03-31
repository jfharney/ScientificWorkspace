

  $(document).ready(function(){


          $('#create_tag').click(function() {

                  console.log('SW.tagged_items: ' + SW.tagged_items);

                  var host = 'localhost';
                  var port = '8001';

                  var uid = '5112';
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
                                  'tag_name' : tag_name,
                                  'tag_description' : tag_description
                  }

                  url = url + '?tag_name=' + tag_name + '&tag_description=' + tag_description;


                  $.ajax({
                      type: "POST",
                      url: url,
                      data: input_data,
                      success: function(data)
                      {
                              for(var key in data) {
                                      console.log('key: ' + key);
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

                                          /*
                                          url += '&length=' + length;
                                          url += '&tagged_item=' + tagged_item;
                                          url += '&tagged_type=' + tagged_type;




                                          //associations api
                                          $.ajax({
                                                type: "POST",
                                                url: url,
                                                data: input_data,
                                                success: function(associations_data) {
                                                        alert('associations response ... need to do something here' );
                                                },
                                                error: function(xhr, status, error) {
                                                        alert('error');
                                                    if(xhr.status==404)
                                                      { }
                                                  }
                                          });
*/

                                          }



                                  } else {

                                          tagged_item = tagged_items;
                                          tagged_type = tagged_types;

                                          alert('calling addAssociation for single item');

                                          addAssociation(url,input_data,length,tagged_item,tagged_type);
                                          /*
                                          url += '&length=' + length;
                                          url += '&tagged_item=' + tagged_item;
                                          url += '&tagged_type=' + tagged_type;



                                          alert('associations tagged_item: ' + tagged_item + ' tagged_type: ' + tagged_type);

                                          //associations api
                                          $.ajax({
                                                type: "POST",
                                                url: url,
                                                data: input_data,
                                                success: function(associations_data) {
                                                        alert('associations response: ' + associations_data);
                                                },
                                                error: function(xhr, status, error) {
                                                        alert('error');
                                                    if(xhr.status==404)
                                                      { }
                                                  }
                                          });
                                          */

                                  }

                          },
                          error: function(xhr, status, error) {
                            if(xhr.status==404)
                              { }
                          }
                        });

          });

          
          var num_tags_returned = 3;

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



  });

  
  function addAssociation(url,input_data,length,tagged_item,tagged_type) {



      url += '&length=' + length;
      url += '&tagged_item=' + tagged_item;
      url += '&tagged_type=' + tagged_type;



      alert('associations tagged_item: ' + tagged_item + ' tagged_type: ' + tagged_type);

      //associations api
      $.ajax({
            type: "POST",
            url: url,
            data: input_data,
            success: function(associations_data) {
                    alert('associations response: ' + associations_data);
            },
            error: function(xhr, status, error) {
                    alert('error');
                if(xhr.status==404)
                  { }
              }
      });



}





                            	  
                            	  
                            	  
                            	  
                            	  
                            	  
