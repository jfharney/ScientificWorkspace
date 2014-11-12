$(function() {
	
  console.log('Ready event in main.js.');

  $("#myTree").fancytree({
    source: [
      {title: "Node 1", key: "1"},
      {title: "Folder 2", key: "2", folder: true, children: [
        {title: "Node 2.1", key: "3", myOwnAttr: "abc"},
        {title: "Node 2.2", key: "4"}
      ]}
    ],
	folder: true,
	selectMode: 1,
	activate: function(event, data) {
	  var node = data.node;
	  $.ui.fancytree.debug("activate: event=", event, ", data=", data);
	  if(!$.isEmptyObject(node.data)) {
	    alert("custom node data: " + JSON.stringify(node.data));
	  }
	},
	lazyLoad: null
  });

});