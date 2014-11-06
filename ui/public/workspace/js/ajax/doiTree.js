function getUserDoiData(userNum) {
  console.log('userNum is '+userNum);
  var children = [];
  
  if(SW.doiOfflineMode == true) { 
	  console.log();
    children.push({
      title: 'DOI_One',
      isFolder: true,
      isLazy: false,
      doiId: '10.5072/OLCF/1260530',
      tooltip: 'This is DOI One.', 
      children: [
        {
          title: 'Metadata', 
          isFolder: true, 
          children: [
            {
              title: '<span style="position:relative">DOI ID: <span style="position:absolute; left:100px;">10.5072/OLCF/1260530</span></span>', 
              isFolder: false 
            }, 
            {
              title: '<span style="position:relative">Language: <span style="position:absolute; left:100px;">English</span></span>', 
              isFolder: false 
            }, 
            {
              title: '<span style="position:relative">Sponsor Org: <span style="position:absolute; left:100px;">USDOE</span></span>', 
              isFolder: false 
            }, 
            {
              title: '<span style="position:relative">Keywords: <span style="position:absolute; left:100px;">Science, Computers</span></span>', 
              isFolder: false 
            }
          ]
        }, 
        {
          title: 'Linked Objects', 
          isFolder: true, 
          children: [
            {
              title: '<span style="position:relative">File: <span style="position:absolute; left:100px;">/stf007/world-shared/xnetMPI_cula_works_serial_not_ll.tar</span></span>', 
              isFolder: false
            },
            {
              title: '<span style="position:relative">Job: <span style="position:absolute; left:100px;">swtc1</span></span>', 
              isFolder: false
            },
            {
              title: '<span style="position:relative">Group: <span style="position:absolute; left:100px;">cli017</span></span>', 
              isFolder: false
            }
          ]
        }
      ]
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
	  		  //console.log('Here is data: '+data);
	  		if(data.length > 0) {
	  			buildDoiTree(data);
	  		} else {
	      	  $("#doi_tree").append('<div>This user has not created a DOI. </div>');
	        }
	  	  },
	  	  error: function() {
	  	    console.log('error in getting group info');
	  	  }	    
	  });
  }
}

function buildDoiTree(children) {
  $('#doi_tree').dynatree({
    fx: { height: "toggle", duration: 200 },
    autoFocus: false, 
    children: children,
    onSelect: function(select, node) {},
    onClick: function(node, event) {
      if(node.data.title == '<span style="color:blue;cursor:pointer">Download</span>'){
        console.log('Clicking DOI tree download node.');
        var win = window.open('https://doi1.ccs.ornl.gov/doi/download?doi='+node.data.doiName, '_blank');
        win.focus();
      }

      //console.log('node.data.doiName is '+node.data.doiName);
      //for(key in node.data) console.log(key+': '+node.data[key]);
    },
    onLazyRead: function(node) {
      if(node.data.title == 'Metadata') {
        var doiName = node.data.doiName;
        console.log('doiName is '+doiName);
        node.appendAjax({
          url: 'http://localhost:1337/doi_meta?doiName='+doiName
        });
      }
      else if(node.data.title == 'Linked Objects') {
        //node.appendAjax({
          //url: ''
        //});
      }
    }
  });
}
