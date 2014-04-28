$(document).ready(function() 
{ 
  $("#tagsTable").dataTable().fnDestroy();
  $("#tagsTable").dataTable({
    sAjaxSource: "http://localhost:1337/tags?uid=5112",
	sAjaxDataProp: "tags",
	aoColumns: [{ mData: "tagname" },
	            { mData: "tagdesc" }]
  });
});
/*console.log("Executing tagstable.js...");
var $table = $("#tagsTable"), 
    $tbody = $table.children("tbody");
  $.ajax({
	type: "GET",
	url: "http://localhost:1337/tags?uid=5112", 
	//url: t_url_prefix + 'uid=' + uid,
	success: function(data) {
	  console.log(data);
      $.each(data, function(key, value)
      {
        $.each(value, function(index, arVal)
        {
        	$tbody.append("<tr>" +
     				        "<td class='tagName'>" + arVal['tagname'] + "</td>" +
          		            "<td>" + arVal['tagdesc'] + "</td>" +  
          		          "</tr>");
	      /*$.ajax({	
	        type: "GET",
	        url: a_url_prefix + "edge=" + arVal['uuid'], 
	        success: function(assocData) 
	        {
			  var taggedObjs = '';
			  for(var i = 0; i < assocData['associations'].length; i++)
			    taggedObjs += "<span class='objUuid'>" + assocData['associations'][i]['uuid'] + "</span><br />";
			  var taggedObjTypes = '';
			  for(var i = 0; i < assocData['associations'].length; i++)
			    taggedObjTypes += assocData['associations'][i]['type'] + '<br />';
			  $tbody.append("<tr>" +
	           				  "<td class='tagName'>" + arVal['tagname'] + "</td>" +
	                		  "<td>" + arVal['tagdesc'] + "</td>" + 
	                		  "<td>" + taggedObjs + "</td>" +
							  "<td class='objType'>" + taggedObjTypes + "</td>" +
	                		  "<td>" + arVal['wtime'] + "</td>" + 
	                		"</tr>"); 
			  }, 
			  error: function(xhr, status, error) { console.log('error status = ' + status); } 
          });*/
  /*      });
      });
    },
	error: function(xhr, status, error) 
		   { console.log('error status = ' + status); }
});
	
/*$(document).on("click", ".tagName", function(e) 
{
  $('#tagInfo').html($(this).html());
  $.ajax({
    type: "GET", 
    url: "http://localhost:1337/tags/" + $(this).html() + "?uid=" + uid, 
  	success: function(tagData) 
  	  {
  	    for(i in tagData)
  	      console.log(i + ": " + tagData[i]);
	    for(i in tagData['tags'][0]) {
		  $('#tagInfo').append(i + ": " + tagData['tags'][0][i] + "<br />");
  	    /*for(i in tagData['tags'][0]) {
  	        $('#tagInfo').append(i + ": " + tagData['tags'][0][i] + "<br />");
  	    	console.log(i + ": " + tagData['tags'][0][i]);
  	      }*/
  	  /*}, 
  	  error: function(xhr, status, error) { console.log('error status = ' + status); }
  });
    	
    	/* Version 1, which uses API_11. 
    	$('#tagInfo').html($(this).html());
    	$.ajax({
	      type: "GET", 
	      url: "http://localhost:1337/tags?tagname=" + $(this).html() + "&uid=" + uid, 
	      success: 	function(tagData) 
	       			{
	    	  		  for(i in tagData['tags'][0]) {
	    	  			$('#tagInfo').append(i + ": " + tagData['tags'][0][i] + "<br />");
	    	  		    console.log(i + ": " + tagData['tags'][0][i]);
	    	  		  }
	       			}, 
	       	error: function(xhr, status, error) { console.log('error status = ' + status); }
	    });*/
    //});
		
	//var resort = true,
	//callback = function() { console.log('table updated'); }
	//$table.trigger("update", [ resort, callback ]);
});