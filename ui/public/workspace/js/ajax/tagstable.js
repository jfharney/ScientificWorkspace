$('#show_table_button').click(function() {
	
  $("#tagsTable").dataTable({
    sAjaxSource: 'http://localhost:1337/tagsTable/' + SW.current_user_number,
    sAjaxDataProp: "",
	bDestroy: true,
	aoColumns: [{ mData: "name" },
	            { mData: "desc" },
	            //{ mData: "linkCount" },
	            { mData: "access" }], 
    sPaginationType: "full_numbers", 
	//sDom: "C<'clear'>lfrtip", 
	oColVis: {
      sAlign: "left", 
      bRestore: true
	}
  });
});



/*$('#show_table_button').click(function() {
  var user_label = $('#user_info_id').html();
  var uid = user_label.trim();
	
  $("#tagsTable").dataTable({
    sAjaxSource: "http://localhost:1337/tags?uid=" + uid,
    sAjaxDataProp: "tags",
	bDestroy: true,
	aoColumns: [{ mData: "type" },
	            { mData: "uuid" },
	            { mData: "tagdesc" },
	            { mData: "tagname" },
	            { mData: "uid" },
	            { mData: "visibility" },
	            { mData: "wtime" }], 
    sPaginationType: "full_numbers", 
	//sDom: "C<'clear'>lfrtip", 
	oColVis: {
      sAlign: "left", 
      bRestore: true
	}
  });
});*/
