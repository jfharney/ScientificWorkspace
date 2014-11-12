$/*(document).ready( function () {
	$('#tagsTable').dataTable( {
		sAjaxSource: "http://localhost:8001/tags?uid=5112",
	    sAjaxDataProp: "tags", 
		"bJQueryUI": true,
		"bPaginate": true,
		"sScrollY": "300px",
		"bScrollCollapse": true,
		"bScrollAutoCss": false,
		aoColumns: [{ mData: "tagname" },
		            { mData: "tagdesc" },
		            { mData: "uid" },
		            { mData: "visibility" },
		            { mData: "wtime" }],
		sDom: 'C<"clear">lfrtip',
		//sDom: 'C<"clear">lfrtip',
		//"sDom": '<"H"fr>tC<"F"ip>',
		"oColVis": {
			"buttonText": "Show Cols",
			"bRestore": true,
			"sAlign": "left"
		},
		"fnDrawCallback": function (o) {
			/* Position the ColVis button as needed */
			/*var nColVis = $('div.ColVis', o.nTableWrapper)[0];
			nColVis.style.width = o.oScroll.iBarWidth+"px";
			nColVis.style.top = ($('div.dataTables_scroll', o.nTableWrapper).position().top)+"px";
			nColVis.style.height = ($('div.dataTables_scrollHead table', o.nTableWrapper).height())+"px";
		}
	} );
} );*/

(document).ready( function () {
	$('#tagsTable').dataTable( {
		sAjaxSource: "http://localhost:8001/tags?uid=5112",
	    sAjaxDataProp: "tags", 
		"bJQueryUI": true,
		"sScrollY": "250px", 
		aoColumns: [{ mData: "tagname" },
		            { mData: "tagdesc" },
		            { mData: "uid" },
		            { mData: "visibility" },
		            { mData: "wtime" }],
		sDom: 'C<"clear">lfrtip', 
		"oColVis": {
			"bRestore": false,
			"sAlign": "left"},
	} );
});