

	var mvcURL = 'http://localhost:3000';
	
	var SciWorkspace = SciWorkspace || {};
	
	
	SciWorkspace.namespace = function (ns_string) {
	    var parts = ns_string.split("."),
	        parent = SciWorkspace,
	        i;
	    // strip redundant leading global
	    if (parts[0] === "SciWorkspace") {
	        parts = parts.slice(1);
	    }

	    for (i=0; i < parts.length; i+=1) {
	        // create a property if it doesn't exist
	        if (typeof parent[parts[i] === "undefined"]) {
	            parent[parts[i]] = {};
	        }
	        parent = parent[parts[i]];
	    }
	    return parent;
	};
	
	var sciworkspace_users = SciWorkspace.namespace("SciWorkspace.users");
	
	
	//var SciWorkspace.users = SciWorkspace.users || {};
	
	var highlightedFile = null;
	var highlightedJob = null;
	
	$(function(){
	

// --- Initialize sample trees
	    $("#jobss_tree").dynatree({
	      title: "Lazy loading sample",
	      fx: { height: "toggle", duration: 200 },
	      autoFocus: false, // Set focus to first child, when expanding or lazy-loading.
//	          initAjax: {
//	              url: "/getTopLevelNodesAsJson",
//	              data: { mode: "funnyMode" }
//	              },
	      initAjax: {
	        url: mvcURL + "/initjobsdata"
	        },

	      onActivate: function(node) {
	        $("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
	      },

	      onLazyRead: function(node){
	    	 console.log('jobs lazy read --> ' + node.data.title + ' ' + node.data.type);
	    	 var job_id = 'Boltzmann2D3D (1723340)';
	       
	    	 
	    	var url = mvcURL + "/jobsinfo?path=" + node.data.path + '&uid=8038&gid=16854&job_id='+job_id+'&type='+node.data.type;
	    	  
	    	console.log('In onlazy read for jobs');
	    	getJobInfo(url); 
	    	 
	        node.appendAjax({
	          
	        	url:  mvcURL + "/jobs?username=eendeve&type="+node.data.type+"&job_id="+job_id, //widow1|proj|lgt006&uid=8038&gid=16854",
	          
	          
	          	// We don't want the next line in production code:
	          	debugLazyDelay: 50
	        });
	      }
	    });
	    
	});
	

	function getJobInfo(url) {
		
		var infoDIV = '#job_info';
		  
		console.log('calling: ' + url);
		  
		  //ajax call for file info
		  jQuery.ajax({
			  url: url,
			  type: 'GET',
			  success: function(data) {

		    	$(infoDIV).empty();
		    	
		    	data = JSON.parse(data);
		    	
				for(var key in data) {
					//console.log('key: ' + key + ' data: ' + data[key]);
					
					
					/*
					if(key == 'files') {
						var filesStr = '<div><span style="font-weight:bold;">' + key + '</span> - ';
						var fileObjs = data[key];
						for(var i=0;i<fileObjs.length;i++) {
							var name = fileObjs[i]['name'];
							if(i < fileObjs.length-1) {
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
					*/
					
					$(infoDIV).append('<div><span style="font-weight:bold;">' + key + '</span> - ' + data[key] + '</div>');
				}

		    	  
			},
			error: function() {
				console.log('error in getting file information');
			}
		  });
		  
		
		
	}


		