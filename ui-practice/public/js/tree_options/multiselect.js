var treeData = [
		                {title: "item1 with key and tooltip", tooltip: "Look, a tool tip!", key: 'id1' },
		                {title: "item2: selected on init", key : 'id2' },
		                {title: "Folder", isFolder: true, key: "id3",
		                  children: [
		                    {title: "Sub-item 3.1", key: 'id3.1',
		                      children: [
		                        {title: "Sub-item 3.1.1", key: "id3.1.1" },
		                        {title: "Sub-item 3.1.2", key: "id3.1.2" }
		                      ]
		                    },
		                    {title: "Sub-item 3.2", key: 'id3.2',
		                      children: [
		                        {title: "Sub-item 3.2.1", key: "id3.2.1" },
		                        {title: "Sub-item 3.2.2", key: "id3.2.2" }
		                      ]
		                    }
		                  ]
		                },
		                {title: "Document with some children (expanded on init)", key: "id4", expand: true,
		                  children: [
		                    {title: "Sub-item 4.1 (active on init)", activate: true, key: 'id4.1',
		                      children: [
		                        {title: "Sub-item 4.1.1", key: "id4.1.1" },
		                        {title: "Sub-item 4.1.2", key: "id4.1.2" }
		                      ]
		                    },
		                    {title: "Sub-item 4.2 (selected on init)", select: true, key: 'id4.2',
		                      children: [
		                        {title: "Sub-item 4.2.1", key: "id4.2.1" },
		                        {title: "Sub-item 4.2.2", key: "id4.2.2" }
		                      ]
		                    },
		                    {title: "Sub-item 4.3 (hideCheckbox)", hideCheckbox: true, key: 'id4.3', },
		                    {title: "Sub-item 4.4 (unselectable)", unselectable: true, key: 'id4.4', }
		                  ]
		                }
		              ];
$(document).ready(function(){
	
	
                
                
  $("#tree2").dynatree({
      checkbox: true,
      selectMode: 2,
      children: treeData,
      onSelect: function(select, node) {
        // Display list of selected nodes
        var selNodes = node.tree.getSelectedNodes();
        // convert to title/key array
        var selKeys = $.map(selNodes, function(node){
             return "[" + node.data.key + "]: '" + node.data.title + "'";
        });
        $("#echoSelection2").text(selKeys.join(", "));
      },
      onClick: function(node, event) {
        // We should not toggle, if target was "checkbox", because this
        // would result in double-toggle (i.e. no toggle)
        if( node.getEventTargetType(event) == "title" )
          node.toggleSelect();
      },
      onKeydown: function(node, event) {
        if( event.which == 32 ) {
          node.toggleSelect();
          return false;
        }
      },
      // The following options are only required, if we have more than one tree on one page:
      cookieId: "dynatree-Cb2",
      idPrefix: "dynatree-Cb2-"
    });

  
  $("#tree3").dynatree({
      checkbox: true,
      selectMode: 3,
      children: treeData,
      onSelect: function(select, node) {
        // Get a list of all selected nodes, and convert to a key array:
        var selKeys = $.map(node.tree.getSelectedNodes(), function(node){
          return node.data.key;
        });
        SW.tagged_items = selKeys.join(", ");
        //alert('SW.tagged_items: ' + SW.tagged_items);
        $("#echoSelection3").text(selKeys.join(", "));

        // Get a list of all selected TOP nodes
        var selRootNodes = node.tree.getSelectedNodes(true);
        // ... and convert to a key array:
        var selRootKeys = $.map(selRootNodes, function(node){
          return node.data.key;
        });
        $("#echoSelectionRootKeys3").text(selRootKeys.join(", "));
        $("#echoSelectionRoots3").text(selRootNodes.join(", "));
      },
      onDblClick: function(node, event) {
        node.toggleSelect();
      },
      onKeydown: function(node, event) {
        if( event.which == 32 ) {
          node.toggleSelect();
          return false;
        }
      },
      // The following options are only required, if we have more than one tree on one page:
//                initId: "treeData",
      cookieId: "dynatree-Cb3",
      idPrefix: "dynatree-Cb3-"
    });

  
  
    $("#btnToggleSelect").click(function(){
      $("#tree2").dynatree("getRoot").visit(function(node){
        node.toggleSelect();
      });
      return false;
    });
    $("#btnDeselectAll").click(function(){
      $("#tree2").dynatree("getRoot").visit(function(node){
        node.select(false);
      });
      return false;
    });
    $("#btnSelectAll").click(function(){
      $("#tree2").dynatree("getRoot").visit(function(node){
        node.select(true);
      });
      return false;
    });

  
  
});


              
                
/*

$(document).ready(function(){
	
	
	
	alert('loading page index.html');
	
	var url = 'http://localhost:8001/jobs';
	$.ajax({
		  type: "GET",
		  url: url,
		  success: function(data)
		  { 
			  console.log('success ' + data);
		  },
		  error: function(xhr, status, error) {
			  console.log('error'); 
			  
			  if(xhr.status==404)
			  { 
			    	
			  }
			  
		  }
		});
	
	
	
});
*/