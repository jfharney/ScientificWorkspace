var g_titles = ["Users","Groups","Jobs","Applications","Files","Directories","Tags","Events","DOI"];
var g_keys = ["name","gname","jid","aid","path","path","name","nid","name"];
var g_kay_map =
{
    //"name": "Name",
    "uid": "uid",
    "gid": "gid",
    "uname": "User ID",
    "gname": "Group ID",
    "jid": "Job ID",
    "aid": "App ID",
    //"path": "Path",
    "fmode": "Mode",
    "fsize": "Size",
    "owner": "Owner",
    "access": "Access",
    "xuid": "Owner",
    "xgid": "Group",
    "desc": "Description",
    "title": "Title",
    "email": "E-mail",
    "keywd": "Keywords",
    "start": "Start time",
    "stop": "Stop time",
    "ctime": "Create time",
    "mtime": "Modify time",
    "host": "Hostname",
    "cmd": "Command"
};


$(function(){

    console.log('<><><>SEARCH MAIN<><><>');

    /* We transfer the current user data values stored in the document object to the 
    * SW object, defined in core.js.                                                    */
    SW.current_user_nid = $('#curUserNid').html();
    SW.current_user_email = $('#curUserEmail').html();
    SW.current_user_name = $('#curUserName').html();
    SW.current_user_number = $('#curUserNumber').html();
    SW.current_user_uname = $('#curUserUname').html();

    $('button#basic_srch_btn').click(function() {
        var text = $('#search_text').val();

        if ( text != '' )
        {
            $('#results').empty();
            $('#results').append('<div>Waiting for results...</div>');
            $("#results_tree").dynatree("destroy");
            $("#results_tree").empty();

            var url = 'http://' + SW.hostname + ':' + SW.port + '/basic_search/' + SW.current_user_number + '?text=' + text;

            console.log('basic: ' + url);

            //create the initial children
            $.ajax({
                url: url,
                global: false,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    console.log('success');

                    $('#results').empty();
                    //$criteria = $('<div class="row-fluid" style="margin-bottom:20px;"><div class="span12">Insert Criteria here</div></div>');
                    //$('#results').append($criteria);

                    processResultsToTree(data);

                    //console.log('append DOI result here');
                    //append doi results here
                    //$('#results').append('<div>DOI result here</div>');

                    //var $separator = $('<hr>'); 
                    //$('#results').append($separator);
                },
                error: function() {
                    console.log('error in getting search results');
                }
            });
        }
    });

    $('button#adv_srch_btn').click(function() {
        var name = $('#search_name').val();
        var title = $('#search_title').val();
        var desc = $('#search_desc').val();
        var keywords = $('#search_keyw').val();
        var params = false;

        if ( name != '' || title != '' || desc != '' || keywords != '' )
        {
            var url = 'http://' + SW.hostname + ':' + SW.port + '/adv_search/' + SW.current_user_number + '?';

            if ( name != '' )
            {
                url = url + 'name=' + name;
                params = true;
            }

            if ( title != '' )
            {
                if ( params == true )
                    url = url + '&';

                url = url + 'title=' + title;
                params = true;
            }

            if ( desc != '' )
            {
                if ( params == true )
                    url = url + '&';

                url = url + 'desc=' + desc;
                params = true;
            }

            if ( keywords != '' )
            {
                if ( params == true )
                    url = url + '&';

                url = url + 'keywords=' + keywords;
                params = true;
            }

            var types = 0;

            if( $("#users").is(':checked') )
                types = types | 0x01;
            if( $("#groups").is(':checked') )
                types = types | 0x02;
            if( $("#jobs").is(':checked') )
                types = types | 0x04;
            if( $("#apps").is(':checked') )
                types = types | 0x08;
            if( $("#files").is(':checked') )
                types = types | 0x10;
            if( $("#dirs").is(':checked') )
                types = types | 0x20;
            if( $("#tags").is(':checked') )
                types = types | 0x40;
            if( $("#events").is(':checked') )
                types = types | 0x80;
            if( $("#dois").is(':checked') )
                types = types | 0x100;

            if ( types != 0 )
            {
                url = url + '&types=' + types;

                console.log('adv: ' + url);


                $('#results').empty();
                $('#results').append('<div>Waiting for results...</div>');
                $("#results_tree").dynatree("destroy");
                $("#results_tree").empty();

                //create the initial children
                $.ajax({
                    url: url,
                    global: false,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        console.log('success');
                        $('#results').empty();
                        //$criteria = $('<div class="row-fluid" style="margin-bottom:20px;"><div class="span12">Insert Criteria here</div></div>');
                        //$('#results').append($criteria);

                        processResultsToTree(data);

                        //console.log('append DOI result here');
                        //append doi results here
                        //$('#results').append('<div>DDDDOI result here</div>');

                        //var $separator = $('<hr>'); 
                        //$('#results').append($separator);
                    },
                    error: function() {
                        console.log('error in getting search results');
                    }
                });
            }
        }
    });
});


function processResultsToTree(data)
{
    if ( data.length ==  0 )
    {
        $('#results').append('<div>No results found</div>');
    }
    else
    {
        var treedata = [];
        var top_folders = [null,null,null,null,null,null,null,null,null];
        var result;
        var type;
        var child;

        for(var i=0;i<data.length;i++)
        {
            result = data[i];
            type = result['type'];

            if ( top_folders[type] == null )
            {
                top_folders[type] = {};
                top_folders[type].title = g_titles[type];
                top_folders[type].isFolder = true;
                top_folders[type].children = [];
            }

            child = {}
            child.title = result[g_keys[type]];
            child.isFolder = true;
            child.children = [];

            var label;
            for( var key in result )
            {
                label = g_kay_map[key];
                if ( label != null )
                {
                    child.children.push( "<span style='position:relative'>" + label + ":<span style='position:absolute; left:100px;'>" + translateValue( key, result[key] ) + "</span></span>" );
                    console.log('Here...');
                    for (var key in child.children)
                        console.log(key+': '+child.children[key]);
                }
            }


            if ( type == 8 )
            {
                var command = {}
                command.title = '<span style="color:blue;cursor:pointer">Download</span>';
                command.command = 1;
                child.children.push( command );
            }

            top_folders[type].children.push(child);
        }

        for(var i=0;i<9;i++)
        {
            if ( top_folders[i] != null )
            {
                top_folders[i].title = g_titles[i] + " (" + top_folders[i].children.length + ")";
                treedata.push( top_folders[i] );
            }
        }

        $("#results_tree").dynatree({
            checkbox: false,
            selectMode: 1,          // "1:single, 2:multi, 3:multi-hier"
            children: treedata,
            onActivate: function(node) {
                if( node.data.command == 1 ) // Download a DOI node
                {
                    console.log("Download DOI " + node.parent.data.title + " for email " + SW.current_user_email );
                    console.log("https://" + SW.doihostname + ":" + SW.doiport + "/doi/download?doi=" + node.parent.data.title + "&email=" + SW.current_user_email);
                    //window.open("https://doi1.ccs.ornl.gov:443/doi/download?doi=" + node.parent.data.title + "&email=" + SW.current_user_email );
                }
            },
            onClick: function(node) {
              if(node.data.title == '<span style="color:blue;cursor:pointer">Download</span>') {
                var win = window.open('https://doi1.ccs.ornl.gov/doi/download?doi='+node.parent.data.title, '_blank');
                win.focus();
              }
            }
        });
    }
}


function processResults(data)
{
    if ( data.length ==  0 )
    {
        $('#results').append('<div>No results found</div>');
    }
    else
    {
        $('#results').append('<div><b>' + data.length +'</b> result(s) found:</div><hr>');

        for(var i=0;i<data.length;i++)
        {
            var result = data[i];

            var $record = $('<div class="row-fluid"></div>');

            //record content
            //var $content = recordContent(result);

            //record functionality
            //var $buttons = recordFunctionality(result);

            //append to the record
            $record.append( recordContent( i+1, result )); //$content);
            //$record.append( recordFunctionality( result )); //$buttons);

            $('#results').append($record);

            //separator for each record
            //var $separator = $('<hr>');	
            //$('#results').append($('<hr>')); //$separator);
        }
    }
}


function processStandardProperty (key, result) {
    var $property = $('<div class="row-fluid"></div>');

    var $space = $('<div class="span1"></div>');
    var $key = $('<div class="span3">' + key + '</div>');
    var $result = $('<div class="span8">' + result[key] + '</div>');
    $property.append($space);
    $property.append($key);
    $property.append($result);

    return $property;
}


//This needs to be implemented in the tags workspace as well...
function makeTagsContentListItem(nid,result) {
	
	return function () {

		console.log('nid: ' +  nid + ' resource nid: ' + result['nid']);
			
		
		//small bug in group info being returned - want the name "name" not "gname"
	  	//small bug in app info being returned - want the name "name" not "nid"
	  	if(result['type'] == 1) {
	  		result['name'] = result['gname'];
	  	} else if(result['type'] == 3) {		
	  		result['name'] = result['nid'];
	  	} else if(result['type'] == 6) {
	  		result['name'] = result['nid'];
	  	}
	  	
	  	var type_int = result['type'];
		var resType = SW.typeMap[type_int];
		var resName = result['name'];
		var resNid = result['nid'];

		
		$tag_resource_item_li = $('<li id="tagResource_'+resNid+'"></li>');
		
		$tag_resource_name = $('<span style="font-weight:bold">'+resName+' ('+resType+')&nbsp;</span> ');
		
		$tag_resource_morelink = $('<a id="' + resNid + '_' + nid + '" style="cursor:pointer">more</a>').click(function() {
			
			if(this.innerHTML == 'more') {
				this.innerHTML = 'less';
				$('#tagResourceInfo_'+this.id).show('slow');
			} else {
				this.innerHTML = 'more';
				$('#tagResourceInfo_'+this.id).hide('slow');
			}
			
		});
		
		$tag_resource_info = $('<div id="tagResourceInfo_'+resNid+'_' + nid + '" style="display:none">' + '</div>');

		for(var key in result) {
			$key = $('<div style="margin-left:5px">' + key + ' : ' + result[key] + '</div>')
			$tag_resource_info.append($key);
		}
		

		$tag_resource_item_li.append($tag_resource_name);
		$tag_resource_item_li.append($tag_resource_morelink);
		$tag_resource_item_li.append($tag_resource_info);
		
		return $tag_resource_item_li;
		
	}
}


function processTaggedResources (result) {
    var $property = $('<div class="row-fluid"></div>');
    var $space = $('<div class="span1"></div>');
    //Tagged resources
    var $key = $('<div class="span3" id="' + result['nid'] + '" style="cursor:pointer">' + 'Tagged Resources' + '</div>');
    //Result is a listing of resources that are tagged
    var $result = $('<div class="span8"></div>');
    var $tag_contents_list = $('<ul id="ul_' + result['nid'] + '"></ul>');
    var uid = SW.current_user_number;
    var url = 'http://' + SW.hostname + ':' + SW.port + '/tags/links/' + result['nid'];
    var funcs = [];

    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        success: function(linksData) {
            var linksArr = [];
            linksArr = JSON.parse(linksData);
            var linkCount = linksArr.length;

            console.log('resultnid: ' + result['nid']);

            $tag_contents_list = $('<ul id="tagContentsList"></ul>');

            for(var i=0;i<linkCount;i++) {
                funcs[i] = makeTagsContentListItem(result['nid'],linksArr[i]);
            }

            console.log('calling functions here');

            for(var j=0;j<linkCount;j++) {
                var $tag_resource_item_li = funcs[j]();
                $tag_contents_list.append($tag_resource_item_li);
            }

            $result.append($tag_contents_list);

            $property.append($space);
            $property.append($key);
            $property.append($result);
        },
        error: function() {
        }
    });

    return $property;
}


function recordContent(idx, result)
{
    var content = $('<div class="span12" id="' + result['nid'] + '"></div>')

    var type = result['type'];

    //console.log('type: ' + result['type']);

    content.append( '<div class="row-fluid"><div class="span12"><b>' + idx +'.</b> ' + g_titles[type] + ': ' + result[g_keys[type]] + '</div></div>');

    var label;
    for( var key in result )
    {
        label = g_kay_map[key];
        //if ( key != "nid" && key != "type" )
        if ( label != null )
        {
            content.append('<div class="row-fluid"><div class="span1"></div><div class="span2">' + label + '</div><div class="span9">' + translateValue( key, result[key] ) + '</div></div>');
        }
    }

    return content;
}


function translateValue( key, value )
{
    if ( key == "access" )
    {
        if ( value == 0 )
            return "Private";
        else if ( value == 1 )
            return "Shared";
        else
            return "Public";
    }
    else if ( key == "ctime" || key == "mtime" || key == "start" || key == "stop" )
    {
        var date = new Date(value * 1000);
        return date.toISOString();
    }
    else if ( key == "fmode" )
    {
        var out = "";
        if ( value & 0400 ) out = out + "r"; else out = out + "-";
        if ( value & 0200 ) out = out + "w"; else out = out + "-";
        if ( value & 0100 ) out = out + "x"; else out = out + "-";
        if ( value & 040) out = out + "r"; else out = out + "-";
        if ( value & 020 ) out = out + "w"; else out = out + "-";
        if ( value & 010 ) out = out + "x"; else out = out + "-";
        if ( value & 04 ) out = out + "r"; else out = out + "-";
        if ( value & 02 ) out = out + "w"; else out = out + "-";
        if ( value & 01 ) out = out + "x"; else out = out + "-";
        return out;
    }
    else
        return value;
}

function recordFunctionality() {
	//functionality/buttons
	var $buttons = $('<div class="span3"></div>');
	$buttons.append($('<div>insert any functionality here</div>'));
	
	return $buttons;
	
	
}


function tagsContentListForSearch() {
	
	$tag_contents_list = $('<ul id="tagContentsList"></ul>');
	
	$tag_contents_list.append('<li>item</li>');
	
	console.log('Contents List: ' + $tag_contents_list.html());
	
	return $tag_contents_list;
	
}




