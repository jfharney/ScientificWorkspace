$('#show_table_button').click(function() {
	
  var table = $("#tagsTable").DataTable({
    sAjaxSource: 'http://localhost:1337/tagsTable/' + SW.current_user_number,
    sAjaxDataProp: "",
	bDestroy: true,
	aoColumns: [{ mData: "name" },
	            { mData: "desc" }],
    sPaginationType: "full_numbers",
	oColVis: {
      sAlign: "left", 
      bRestore: true
	}
  });
  
  $('#tagsTable tbody').on('click', 'tr', function () {
	console.log('Clicking the tags table.');
    $(this).toggleClass('selected');
  });
  
  $('button#createDoiFromTagsButton').click(function() {
    console.log(table.rows('.selected').data());
  });
});


