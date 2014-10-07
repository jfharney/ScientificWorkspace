function getUserDoiData(userNum) {
  console.log('userNum is '+userNum);
  var children = [];
  
  if(SW.doiOfflineMode == true) { 
	  console.log();
    children.push({
      title: 'DOI_One',
      isFolder: true,
      isLazy: false,
      doiId: '10-86X-234151235531',
      tooltip: 'This is DOI One.', 
      children: [{title: 'Metadata', isFolder: true}, {title: 'Linked Objects', isFolder: true}]
    });
    children.push({    title: 'DOI_Two',    isFolder: true,    isLazy: false,    doiId: '10-86X-234151235532',    tooltip: 'This is DOI Two.',     children: [{title: 'Metadata', isFolder: true}, {title: 'Linked Objects', isFolder: true}]  });  
    children.push({    title: 'DOI_Three',    isFolder: true,    isLazy: false,    doiId: '10-86X-234151235533',    tooltip: 'This is DOI Three.',     children: [{title: 'Metadata', isFolder: true}, {title: 'Linked Objects', isFolder: true}]  });  
    children.push({    title: 'DOI_Four',    isFolder: true,    isLazy: false,    doiId: '10-86X-234151235534',    tooltip: 'This is DOI Four.',     children: [{title: 'Metadata', isFolder: true}, {title: 'Linked Objects', isFolder: true}]  });  
    children.push({    title: 'DOI_Five',    isFolder: true,    isLazy: false,    doiId: '10-86X-234151235535',    tooltip: 'This is DOI Five.',     children: [{title: 'Metadata', isFolder: true}, {title: 'Linked Objects', isFolder: true}]  });
    buildDoiTree(children);
  }
  else { 
	  	$.ajax({
	  	  url: 'http://'+SW.hostname+':'+SW.port+'/dois/'+userNum,
	  	  type: 'GET',
	  	  success: function(data) {
	  		console.log('Here is data: '+data);
	  	    buildDoiTree(data);
	  	  },
	  	  error: function() {
	  	    console.log('error in getting group info');
	  	  }	    
	  });
    
  }
  else {
	$.ajax({
	  url: 'http://'+SW.hostname+':'+SW.port+'/dois/'+userNum,
	  type: 'GET',
	  success: function(data) {
		console.log('Here is data: '+data);
	    buildDoiTree(data);
	  },
	  error: function() {
	    console.log('error in getting group info');
	  }	    
	}); 
  }
  
  
}

function buildDoiTree(children) {
  console.log('The length of children is '+children.length);
  console.log('Inside buildDoiTree, here is children: '+children);
  for(var i = 0; i < children.length; i++)
	  for(key in children[i])
		console.log(key + ': '+children[i][key]);
  $('#doi_tree').dynatree({
    fx: { height: "toggle", duration: 200 },
    autoFocus: false, 
    children: children,
    onSelect: function(select, node) {
      
    },
    onLazyRead: function(node) {
      if(node.data.title == 'Metadata') {
        node.appendAjax({
          var doiName = node.data.name;
          url: 'https://doi1.ccs.ornl.gov/doi/id/10.5072/OLCF/1260530/'
        });
        //node.appendAjax({
          //url: ''
        //});
      }
      else if(node.data.title == 'Linked Objects') {
        //node.appendAjax({
          //url: ''
        //});
      }
    }
  });
}
