
$(function() {
	var mvcURL = 'http://localhost:1337/tags';
	var user_id = '';
	initiateTagsTree(mvcURL, user_id);
});


function initiateTagsTree(mvcURL, user_id) {
	
	console.log('initiateTagsTree');
	
	// --- Initialize sample trees
    $("#tags_tree").dynatree({
      title: "Lazy loading sample",
      fx: { height: "toggle", duration: 200 },
      autoFocus: false, // Set focus to first child, when expanding or lazy-loading.
      initAjax: {url: mvcURL + "?uid=5112"},

      onActivate: function(node) {
        $("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
      },

      onLazyRead: function(node){

	    	 
    	  //var url = mvcURL + "/filesinfo?path=" + node.data.path + '&uid=8038&gid=16854';
    	  
    	  //getFileInfo(url);
    	  
    	  
          node.appendAjax({
          	url:  mvcURL + "/files?path=" + node.data.path + '&uid=8038&gid=16854',//widow1|proj|lgt006&uid=8038&gid=16854",
          	// We don't want the next line in production code:
          	debugLazyDelay: 50
          });
    	  
      }
      
      
    });
	
}


function getTagInfo(url) {
	
	var infoDIV = '#tag_info';
	  
	console.log('calling url: ' + url);
	
	  //ajax call for file info
	  jQuery.ajax({
		  url: url,
		  type: 'GET',
		  success: function(data) {

			  console.log('success in getting data');
			  
	    	$(infoDIV).empty();
	    	
	    	data = JSON.parse(data);
	    	
			for(var key in data) {
				console.log('key: ' + key + ' data: ' + data[key]);
				if(key == 'files') {
					var tagStr = '<div><span style="font-weight:bold;">' + key + '</span> - ';
					var tagObjs = data[key];
					for(var i=0; i < Objs.length; i++) {
						var name = tagObjs[i]['name'];
						if(i < tagObjs.length-1) {
							filesStr += name + ', ';
						} else {
							filesStr += name + '';
						}
					}
					//alert('appending fileStr: ' + filesStr);
					$(infoDIV).append(filesStr);
					
				} else {
					$(infoDIV).append('<div><span style="font-weight:bold;">' + key + '</span> - ' + data[key] + '</div>'); 
				}
				
				
			}

	    	  
		},
		error: function() {
			alert('error in getting tags information');
		}
	  });	
}
