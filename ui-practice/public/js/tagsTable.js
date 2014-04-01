$(document).ready(function() 
{
	var $table = $("#tagsTable").tablesorter({sortList: [[0,0],[1,0]]}),
		$tbody = $table.children("tbody");

	$.ajax({
		type: "GET",
		url: "http://localhost:8001/tags?uid=5112",
		success: function(data)
		         {
		           $.each(data, function(key, value)
		           {
		             $.each(value, function(index, arVal)
		             {
			         	$.ajax({	type: "GET",
	               					url: "http://localhost:8001/associations?edge=" + arVal['uuid'], 
	               					success: function(assocData) 
	               							 {
												var taggedObjs = '';
           										for(var i = 0; i < assocData['associations'].length; i++)
           											taggedObjs += "<span class='objUuid' id='" + i + "'>" + assocData['associations'][i]['uuid'] + "</span><br />";
           										var taggedObjTypes = '';
           										for(var i = 0; i < assocData['associations'].length; i++)
           											taggedObjTypes += "<span class='objType' id='" + i + "'>" + assocData['associations'][i]['type'] + '</span><br />';
	               									$tbody.append( 	"<tr>" +
							                							"<td>" + arVal['tagname'] + "</td>" +
							                							"<td>" + arVal['tagdesc'] + "</td>" + 
							                							"<td style='color: blue; text-decoration:underline'>" + taggedObjs + "</td>" +
	               														"<td class='objTypeCell'>" + taggedObjTypes + "</td>" +
							                							"<td>" + arVal['wtime'] + "</td>" + 
							                						"</tr>");
	               							 }, 
	               					error: function(xhr, status, error) { console.log('error status = ' + status); } 
	               	  	 });

		              });
		            });
		           

		          },
		error: function(xhr, status, error) 
		       { console.log('error status = ' + status); }
    });
	
    $(document).on("click", ".objUuid", function(e) 
    {
    	var typeField = $(this).parent().next("td").html();//.children("#" + this.id).html();
    	alert(typeField);
    	if(typeField == 'job') {
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
    	}
    	else if(typeField == 'app') {
		   	$.ajax({
		       	type: "GET", 
		       	url: "http://localhost:8001/apps?uuid=" + this.innerHTML, 
		       	success: 	function(appData) 
		       				{
		       					var appDataFields = '';
		       					for(i in appData)
		       					  for(j in appData[i][0])
		       						  appDataFields += j + ': ' + appData[i][0][j] + '<br />';
		       					$('#displayPanel').html(appDataFields);
		       				}, 
		       	error: function(xhr, status, error) { console.log('error status = ' + status); }
		    });    		
    	}
    	else {}
    });
		
	var resort = true,
	callback = function() { console.log('table updated'); };
	$table.trigger("update", [ resort, callback ]);
});