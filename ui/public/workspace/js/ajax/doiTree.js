function getUserDoiData(userNum) {
  var children = [];
  
  if(SW.doiOfflineMode == true) { 
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
  }
  else {
    console.log('DOI Web service data is not yet available.'); 
  }
  
  buildDoiTree(children);
}

function buildDoiTree(children) {
  $('#doi_tree').dynatree({
    fx: { height: "toggle", duration: 200 },
    autoFocus: false, 
    children: children,
    onSelect: function(select, node) {},
    onLazyRead: function(node) {
      if(node.data.title == 'Metadata') {
        node.appendAjax({
          url: ''
        });
      }
      else if(node.data.title == 'Linked Objects') {
        node.appendAjax({
          url: ''
        });
      }
    }
  });
}