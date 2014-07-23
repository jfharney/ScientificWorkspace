$('#show_table_button').click(function() {
	
  $("#tagsTable").dataTable({
    sAjaxSource: 'http://localhost:1337/tagsTable/' + SW.current_user_number,
    sAjaxDataProp: "",
	bDestroy: true,
	aoColumns: [{ mData: "name" },
	            { mData: "desc" }],
	            //{ mData: "access"},
	           // { mData: "resources"}], 
    sPaginationType: "full_numbers", 
	//sDom: "C<'clear'>lfrtip", 
	oColVis: {
      sAlign: "left", 
      bRestore: true
	}
  });
});
