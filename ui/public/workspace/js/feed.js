
console.log('in feed.js');


if(SW.feedOn) {
	setInterval(function(){
	    $.ajax({ 
	        type: "GET",  
	    	url: "http://localhost:1337/server2",  
	    	success: function(data){
	    		//Update your dashboard gauge
	    		//salesGauge.setValue(data.value);
	    		console.log('adding data to the feed 2');
	    		$('#feed2').prepend('<div>' + data[data.length-1]['name'] + '</div>')
	    	}, 
	    	error: function(XMLHttpRequest, textStatus, errorThrown){  
	            console.log('error '+ textStatus + " (" + errorThrown + ")");  
	        	//console.log('timeout');
	            //getMSG();  
	        }  
	    });
	}, 5000);

}



var getMSG = function()  
{     
    $.ajax({  
        type: "GET",  
        url: "http://localhost:1337/server1",  
        //data: {'chatID' : chatID},  
        //dataType: "json",  
        async: true,  
        cache: false,  
        timeout:3000,  
          
        success: function(data){  
            if(data != null && data.msg != '')  
            {  
                //do something here  
            	console.log('data: ' + data);
            	
            	//get the previous associations list
            	
            	//get the new associations list
            	
            	//take the difference in the lists
            	
            	//prepend the different associations to the top of the feed
            	
            	$('#feed1').prepend('<div>' + data[data.length-1]['name'] + '</div>')
            }  
            console.log('success');
            getMSG();  
        },  
        error: function(XMLHttpRequest, textStatus, errorThrown){  
            //alert('error '+ textStatus + " (" + errorThrown + ")");  
        	console.log('timeout');
            getMSG();  
        }  
    });  
};


//getMSG();  

/*
(function poll(){
	
    $.ajax({ 
    	
    	url: "server1", 
    	success: function(data){
    		//Update your dashboard gauge
    		//salesGauge.setValue(data.value);

    		console.log('data returned');
    		
    		alert('data returned');
    		
    	}, 
    	error: function(xhr, status, error) {
    		  //var err = eval("(" + xhr.responseText + ")");
    		//console.log('resp: ' + xhr.respsoneText);  
    		console.log('Error Message: '+status);
    		console.log('HTTP Error: '+error);
    	},
    	//dataType: "json", 
    	complete: poll, 
    	timeout: 60000
    	
    });
    
})();
*/