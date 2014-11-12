

$(document).ready(function() 
{
	alert('--------in tagstable-------');
	
	var $table = $("#tagsTable").tablesorter({sortList: [[0,0],[1,0]]}),
		$tbody = $table.children("tbody");

	var user_label = $('#user_info_id').html();
	console.log(user_label.trim());
	
	var host = 'localhost';
	var port = '1337';
	var uid = user_label.trim();
	
	console.log('---------------> here...');
	
	var t_url_prefix = 'http://' + host + ':' + port + '/tags?'; //uid=' + uid;
	
	var a_url_prefix = 'http://' + host + ':' + port + '/associations?';
	
	$.ajax({
		type: "GET",
		url: t_url_prefix + 'uid=' + uid,
		success: function(data) {
           $.each(data, function(key, value)
           {
             $.each(value, function(index, arVal)
             {
	         	$.ajax({	
	         		type: "GET",
           					
	         		url: a_url_prefix + "edge=" + arVal['uuid'], 
           					
	         		success: function(assocData) {
						var taggedObjs = '';
						for(var i = 0; i < assocData['associations'].length; i++)
							taggedObjs += "<span class='objUuid'>" + assocData['associations'][i]['uuid'] + "</span><br />";
						var taggedObjTypes = '';
						for(var i = 0; i < assocData['associations'].length; i++)
							taggedObjTypes += assocData['associations'][i]['type'] + '<br />';
							$tbody.append( 	"<tr>" +
	                							"<td style='font-size: 12px;font-family: arial;text-align: left;border: 1px solid black;padding: 5px;'>" + arVal['tagname'] + "</td>" +
	                							"<td style='font-size: 12px;font-family: arial;text-align: left;border: 1px solid black;padding: 5px;'>" + arVal['tagdesc'] + "</td>" + 
	                							"<td style='color: blue; text-decoration:underline;font-size: 12px;font-family: arial;text-align: left;border: 1px solid black;padding: 5px;'>" + taggedObjs + "</td>" +
												"<td class='objType' style='font-size: 12px;font-family: arial;text-align: left;border: 1px solid black;padding: 5px;'>" + taggedObjTypes + "</td>" +
	                							"<td style='color: blue; text-decoration:underline;font-size: 12px;font-family: arial;text-align: left;border: 1px solid black;padding: 5px;'>" + arVal['wtime'] + "</td>" + 
	                						"</tr>");
					 }, 
					 error: function(xhr, status, error) { 
						 console.log('error status = ' + status); 
					 } 
           	  	 });

              });
            });
           

		},
		error: function(xhr, status, error) 
		       { console.log('error status = ' + status); }
    });
	
	/*
    $(document).on("click", ".objUuid", function(e) 
    {
	   	$.ajax({
	       	type: "GET", 
	       	url: "http://localhost:8001/jobs?uuid=" + this.innerHTML, 
	       	success: 	function(jobData) 
	       				{
	       					var jobDataFields = '';
	       					for(i in jobData)
	       					  for(j in jobData[i][0])
	       						  jobDataFields += j + ': ' + jobData[i][0][j] + '<br />';
	       					$('#displayPanel').html(jobDataFields);
	       				}, 
	       	error: function(xhr, status, error) { console.log('error status = ' + status); }
	    });
    });
		
	var resort = true,
	callback = function() { console.log('table updated'); }
	$table.trigger("update", [ resort, callback ]);
	*/
});