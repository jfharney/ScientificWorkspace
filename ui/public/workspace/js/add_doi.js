

  $(document).ready(function(){

	  
	  $('#create_doi_button').click(function() {
		 
		  //console.log('create doi');
		  

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

		  
		  
		  
		//get user info first (synchronous call needed by everyone else)
			var docurl = document.URL;
			
			var user = getUserFromURL(docurl);
			
			var user_info_obj = '';
			
			
			
			
			var url = 'http://localhost:1337/userinfo/'+user;
			var queryString = '';
			$.ajax({
				url: url,
				global: false,
				type: 'GET',
				async: false,
				data: queryString,
				success: function(data) {
					
					  //console.log(data);
					
					  url = "http://" + "localhost" + ":" + "1337" + "/doi/" + user + "?";
					  
					  //alert('Name: ' + data['firstname'] + ' ' + data['middlename'] + ' ' + data['lastname'] + ' ' +
						//  'Email: ' + data['email']);
					
					  if(data['firstname'] == null || data['firstname'] == 'NULL') {
						  data['firstname'] = '';
					  }
					  if(data['middlename'] == null || data['middlename'] == 'NULL') {
						  data['middlename'] = '';
					  }
					  if(data['lastname'] == null || data['lastname'] == 'NULL') {
						  data['lastname'] = '';
					  }
					  
					  //default is the current username
					  //get username and email of current user here
					  var creator_name = data['firstname'] + ' ' + data['middlename'] + ' ' + data['lastname'];
					  var creator_email = data['email'];
					
					  //add creators and creator emails to the url
					  var creators = [];
					  creators.push(creator_name);
					  
					  var creators_email = [];
					  creators_email.push(creator_email);
					  
					  
					  for(var i=0;i<creators.length;i++) {
						  var arg = 'creator=' + creators[i] + '&';
						  arg = arg + 'creator_email= ' + creators_email[i] + '&';
						  url = url + arg;
					  }
					  
					  
					  
					  //add resources to the url
					  //no default
					  for(var i=0;i<selected_file_keys.length;i++) {
						  var arg = 'selected_file_key=' + selected_file_keys[i] + '&';
						  arg = 'resource=' + selected_file_keys[i] + '&';
						  url = url + arg;
						  console.log('selected_file_key=' + selected_file_keys[i]);  
					  }
					  
					  
					  
					  //url = 'http://localhost:1337/doi/jamroz?resource=aa&resource=b&creator=1&creator=33';
					  
					  
					  //alert('sending url: ' + url);
					  location.href = url;
					
					
					
				},
				error: function() {
					console.log('error in getting user id');
				}
			});
			
		  
		  //location.href = "http://" + "localhost" + ":" + "1337" + "/doi/jamroz";
		  
		  
		  
		  
		  
		  
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





                            	  
                            	  
                            	  
                            	  
                            	  
                            	  
