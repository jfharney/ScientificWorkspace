var treeData = [
		                {title: "item1 with key and tooltip", tooltip: "Look, a tool tip!", key: 'd36bbb6c-8e8e-11e3-9993-0024e83383c0' , resource_type: 'job'},
		                {title: "item2: selected on init", key : 'd36bcf12-8e8e-11e3-9993-0024e83383c0', resource_type: 'job' },
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
		                        {title: "Sub-item 4.1.2", key: "d82319d4-8e8e-11e3-9993-0024e83383c0", resource_type: 'app' }
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


var treeData1 = [
                {title: "widow1|proj|root", isFolder: true, isLazy: true, key: "id3", uuid: "uuidroot", type: "file"
                	
                	,
                  children: [
                    {
                    	title: "file" + Date.now(), key: "file" + Date.now(), uuid: "child1", type: "file"
                      
                    },
                    {
                    	title: "folder" + Date.now(), key: "folder" + Date.now(), isLazy: true, isFolder: true, uuid: "childfolder1", type: "file"
                    }
                    
                  ]
                  
                }
                
              ];