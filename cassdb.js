var helenus = require('./node_modules/helenus');
var Err = require('./errors');

var pool = new helenus.ConnectionPool(
    {
        hosts       : ['dexter.ornl.gov:9160'],
        keyspace    : 'SciDataPtl',
        user        : 'nodeuser',
        password    : 'nodeuser',
        timeout     : 3000
    });

pool.on( 'error',
    function(err)
    {
        console.error( err.name, err.message );
    });

pool.connect( function( err, keyspace )
    {
        console.error( err, keyspace );
    });

var tableByType = { "file":"spiderfs","user":"users","group":"groups","job":"jobs","app":"apps","tag":"tags"};

/* Note about Error Handling: Most of the exported database API function below
are called with an expectation that exceptions can be thrown; however, since
delegate functions are used to receieve data asynchronously from CQL calls to
helenus, exceptions can not be thrown in those contexts. Within these
delegates, errors must be processed by using the "sendError" funciton of the
error module (Err object in the code below) which generates an appropriate
reply to the client based on the specified error code.

Unfortunately, helenus converts exceptions into plain strings that are passed
to these delegates which prevents any meaningful handling or translations of
the underlying cause of the error. So, all helenus exceptions are treated as
if the client specified invalid query parameters in terms of the server reply
code (i.e. 400). The exception text provided by helenus is also returned as a
payload in the server reply to the client.
*/

module.exports =
{
    //===== USERS API =========================================================

    userGet : function ( reply, a_username, query )
    {
        var columns = parseColumns( query );

        //console.log("IN User Get Quuery");
        pool.cql( "select " + columns + " from users where username = ?", [a_username], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var record = {};

                record["type"] = "user";
                results.forEach( function( row )
                {
                    row.forEach( function( name, value, ts, ttl )
                    {
                        if ( name === "uuid" )
                            record[name] = value.toString();
                        else
                            record[name] = value;
                    });
                });

                sendReply( reply, record );
            }
        });
    },

    userQuery : function ( reply, query )
    {
        //console.log("IN User Query");
        var where_clause = parseWhereClause( query );
        var columns = parseColumns( query );
        //console.log("QUERY..." + "select " + columns + " from users" + where_clause);
        pool.cql( "select " + columns + " from users" + where_clause, [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var users = [];

                results.forEach( function( row )
                {
                    var record = {};
                    record["type"] = "user";
                    row.forEach( function( name, value, ts, ttl )
                    {
                        if ( name === "uuid" )
                            record[name] = value.toString();
                        else
                            record[name] = value;
                    });

                    users.push( record );
                });

                sendReply( reply, { users: users } );
            }
        });
    },

    //===== GROUPS API ==========================================================

    groupQuery : function ( reply, query )
    {
        // Enforce required query parameter(s)
        if ( query.uid === undefined )
            throw Err.MISSING_REQUIRED_PARAM;

        var where_clause = parseWhereClause( query );
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from groups" + where_clause, [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var groups = [];

                results.forEach( function( row )
                {
                    var record = {};
                    record["type"] = "group";
                    row.forEach( function( name, value, ts, ttl )
                    {
                        if ( name === "uuid" )
                            record[name] = value.toString();
                        else
                            record[name] = value;
                    });

                    groups.push( record );
                });

                sendReply( reply, { groups: groups } );
            }
        });
    },

    groupGet : function ( reply, a_gid, query )
    {
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from groups where gid = " + a_gid + " allow filtering", [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var users = [];

                results.forEach( function( row )
                {
                    var record = {};
                    record["type"] = "group";
                    row.forEach( function( name, value, ts, ttl )
                    {
                        if ( name === "uuid" )
                            record[name] = value.toString();
                        else
                            record[name] = value;
                    });

                    users.push( record );
                });

                sendReply( reply, { users: users } );
            }
        });
    },

    //===== JOBS API ==========================================================

    jobGet : function ( reply, a_jobid, query )
    {
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from jobs where jobid = " + a_jobid, [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var jobs = [];

                results.forEach( function( row )
                {
                    var record = {};
                    record["type"] = "job";
                    row.forEach( function( name, value, ts, ttl )
                    {
                        if ( name === "uuid" )
                            record[name] = value.toString();
                        else
                            record[name] = value;
                    });

                    jobs.push( record );
                });

                sendReply( reply, { jobs: jobs } );
            }
        });
    },

    jobQuery : function ( reply, query )
    {
        var where_clause = parseWhereClause( query );
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from jobs" + where_clause, [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var jobs = [];

                results.forEach( function( row )
                {
                    var record = {};
                    record["type"] = "job";
                    row.forEach( function( name, value, ts, ttl )
                    {
                        if ( name === "uuid" )
                            record[name] = value.toString();
                        else
                            record[name] = value;
                    });

                    jobs.push( record );
                });

                sendReply( reply, { jobs: jobs } );
            }
        });
    },

    //===== APPS API ==========================================================

    appQuery : function ( reply, query )
    {
        // Enforce required query parameter(s)
        if ( query.jobid === undefined )
           throw Err.MISSING_REQUIRED_PARAM;

        var where_clause = parseWhereClause( query );
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from apps" + where_clause, [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var apps = [];

                results.forEach( function( row )
                {
                    var record = {};
                    record["type"] = "app";
                    row.forEach( function( name, value, ts, ttl )
                    {
                        if ( name === "uuid" )
                            record[name] = value.toString();
                        else
                            record[name] = value;
                    });

                    apps.push( record );
                });

                sendReply( reply, { apps: apps } );
            }
        });
    },

    appGet : function ( reply, a_appid, query )
    {
        // Enforce required query parameter(s)
        if ( query.jobid === undefined )
           throw Err.MISSING_REQUIRED_PARAM;

        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from apps where appid = " + a_appid + " and jobid = " + query.jobid + " allow filtering", [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var apps = [];

                results.forEach( function( row )
                {
                    var record = {};
                    record["type"] = "app";
                    row.forEach( function( name, value, ts, ttl )
                    {
                        if ( name === "uuid" )
                            record[name] = value.toString();
                        else
                            record[name] = value;
                    });

                    apps.push( record );
                });

                sendReply( reply, { apps: apps } );
            }
        });
    },

    //===== TAG API ===========================================================

    tagGet : function ( reply, a_tagname, query )
    {
        //console.log('in filesGet');
    	
        //for(var key in reply) {
    		//console.log('reply key: ' + key);
        //}
        //for (var key in query) {
    		//console.log('query key: ' + key);
        //}
    	
        // Enforce required query parameter(s)
        if ( query.uid === undefined )
           throw Err.MISSING_REQUIRED_PARAM;

        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from tags where tagname = '" + a_tagname + "' and uid = " + query.uid + " allow filtering", [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                if ( !results.length )
                    Err.sendError( reply, Err.INVALID_OBJECT );
                else
                {
                    var record = {};
                    record.type = "tag";
                    results.forEach( function( row )
                    {
                        row.forEach( function( name, value, ts, ttl )
                        {
                            if ( name === "uuid" )
                                record[name] = value.toString();
                            else
                                record[name] = value;
                        });
                    });
                    sendReply( reply, record );
                }
            }
        });
    },

    tagQuery : function ( reply, query )
    {
        // Enforce required query parameter(s)
        if ( query.uid === undefined )
           throw Err.MISSING_REQUIRED_PARAM;

        var where_clause = parseWhereClause( query );
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from tags" + where_clause, [], function( err, results )
        {
            //console.log('in cassandra callback');
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var tags = [];

                results.forEach( function( row )
                {
                    var record = {};
                    record.type = "tag";
                    row.forEach( function( name, value, ts, ttl )
                    {
                        if ( name === "uuid" )
                            record[name] = value.toString();
                        else
                            record[name] = value;
                    });

                    tags.push( record );
                });

                sendReply( reply, { tags: tags } );
            }
        });
    },

    // Creates a tag with specified name and properties (in query)
    // If tag is created, call responds with newly created tag info in payload
    tagPost : function ( reply, a_tagname, query )
    {
        // Enforce required query parameter(s)
        if ( query.uid === undefined )
           throw Err.MISSING_REQUIRED_PARAM;

        tagExistsByName( a_tagname, query.uid, function( tag_exists, a_tag_uuid )
        {
            if ( tag_exists )
                Err.sendError( reply, Err.CONFLICTING_REQUEST );
            else
            {
                var qry = "insert into tags (uuid,tagdesc,tagname,uid,visibility,wtime) values (now(),'"
                      + ((query.desc === undefined) ? "" : query.desc) + "','" + a_tagname + "'," + query.uid + ",'"
                      + ((query.visibility === undefined) ? "private" : query.visibility) + "',dateof(now()))";

                pool.cql( qry, [], function( err, results )
                {
                    if ( err )
                        Err.sendError( reply, err );
                    else
                    {
                        var subquery = {};
                        subquery.uid = query.uid;
                        module.exports.tagGet( reply, a_tagname, subquery );
                    }
                });
            }
        });
    },


    // Updates a tag with specified name and properties (in query)
    // If tag is updated, call responds with newly created tag info in payload
    tagPut : function ( reply, a_taguuid, query )
    {
        // Enforce required query parameter(s)
        if ( query.uid === undefined )
           throw Err.MISSING_REQUIRED_PARAM;

        objectExists( a_taguuid, "tag", function( tag_exists )
        {
            if ( !tag_exists )
                Err.sendError( reply, Err.INVALID_OBJECT );
            else
            {
                var qry = "update tags set tagdesc = '"  + ((query.desc === undefined) ? "" : query.desc) + "', visibility = '"
                      + ((query.visibility === undefined) ? "private" : query.visibility)
                      + "', wtime = dateof(now()) where uuid = " + a_taguuid;

                pool.cql( qry, [], function( err, results )
                {
                    if ( err )
                        Err.sendError( reply, err );
                    else
                    {
                        var subquery = {};
                        subquery.uid = query.uid;
                        subquery.uuid = a_taguuid;
                        module.exports.tagQuery( reply, subquery );
                    }
                });
            }
        });
    },

    // Deletes based on Tag UUID
    tagDelete : function ( reply, a_taguuid, query )
    {
        // Check if tag exists and get uuid if it does...
        objectExists( a_taguuid, "tag", function( obj_exists )
        {
            if ( obj_exists )
            {
                // Delete all associations referring to this tag
                deleteAssociations( a_taguuid, function( error )
                {
                    if ( error )
                        Err.sendError( reply, error );
                    else
                    {
                        // Now delete tag
                        pool.cql( "delete from tags where uuid = " + a_taguuid, [], function( err, results )
                        {
                            if ( err )
                                Err.sendError( reply, err );
                            else
                                sendReply( reply );
                        });
                    }
                });
            }
            else
                Err.sendError( reply, Err.INVALID_OBJECT );
        });
    },

    //===== ASSOCIATIONS API ==================================================

    /* Note on Associations and Tags: In this system, Tags are treated as the
    edges in a graph of object nodes. The association table uses the first column
    (edgeuuid) to identify the edge (tag) that associates ~one~ or more objects.
    If the system is eventually expanded to other types of edges, another table
    must be created to track per-edge type and data. Tag metadata is stored in the
    tags table.
    */
    associationsGet : function ( reply, query )
    {
        // API:
        // GET /host/associations?edge=(uuid)
        // GET /host/associations?node=(uuid)

        // Enforce required query parameter(s)
        if ( query.edge === undefined && ( query.node === undefined || query.type === undefined ))
           throw Err.MISSING_REQUIRED_PARAM;

        if ( query.edge )
        {
            objectExists( query.edge, "tag", function( tag_exists )
            {
                if ( tag_exists )
                {
                    // Return object/type associated with tag
                    pool.cql( "select nodeuuid, nodetype from associations where edgeuuid = " + query.edge + " allow filtering", [], function( err, results )
                    {
                        if ( err )
                            Err.sendError( reply, err );
                        else
                        {
                            var wrapper = {};

                            wrapper["uuid"] = query.edge;
                            wrapper["type"] = "tag";

                            var associations = [];

                            results.forEach( function( row )
                            {
                                var record = {};
                                row.forEach( function( name, value, ts, ttl )
                                {
                                    if ( name === "nodeuuid" )
                                        record["uuid"] = value.toString();
                                    else
                                        record["type"] = value;
                                });

                                associations.push( record );
                            });

                            wrapper["associations"] = associations;
                            sendReply( reply, wrapper );
                        }
                    });
                }
                else
                    Err.sendError( reply, Err.INVALID_OBJECT );
            });
        }
        else
        {
            objectExists( query.node, query.type, function( node_exists )
            {
                if ( node_exists )
                {
                    // Return TAGS associated with object/type
                    pool.cql( "select edgeuuid from associations where nodeuuid = " + query.node + " allow filtering", [], function( err, results )
                    {
                        if ( err )
                            Err.sendError( reply, err );
                        else
                        {
                            var wrapper = {};

                            wrapper["uuid"] = query.node;
                            wrapper["type"] = query.type;

                            var associations = [];

                            results.forEach( function( row )
                            {
                                var record = {};
                                row.forEach( function( name, value, ts, ttl )
                                {
                                    record["uuid"] = value.toString();
                                    record["type"] = "tag";
                                });

                                associations.push( record );
                            });

                            wrapper["associations"] = associations;
                            sendReply( reply, wrapper );
                        }
                    });
                }
                else
                    Err.sendError( reply, Err.INVALID_OBJECT );
            });
        };
    },

    // Create a new association between a node and an edge (tag)
    associationsPut : function ( reply, query )
    {
        // API:
        // PUT /host/associations?edge=(uuid)&node=(uuid)&type=x

        // Enforce required query parameter(s)
        if ( query.edge === undefined || query.node === undefined || query.type === undefined )
           throw Err.MISSING_REQUIRED_PARAM;

        objectExists( query.edge, "tag", function( tag_exists )
        {
            if ( tag_exists )
            {
                objectExists( query.node, query.type, function( obj_exists )
                {
                    if ( obj_exists )
                    {
                        createAssociation( query.edge, query.node, query.type, function( error )
                        {
                            if ( error )
                                Err.sendError( reply, error );
                            else
                                sendReply( reply, "" );
                        });
                    }
                    else
                        Err.sendError( reply, Err.INVALID_OBJECT );
                });
            }
            else
                Err.sendError( reply, Err.INVALID_OBJECT );
        });
    },

    associationsDelete : function ( reply, query )
    {
        // API:
        // DEL /host/associations?edge=(uuid)&node=(uuid)

        // Enforce required query parameter(s)
        if ( query.edge === undefined || query.node === undefined )
           throw Err.MISSING_REQUIRED_PARAM;

        associationExists( query.edge, query.node, function( exists )
        {
            if ( exists )
            {
                deleteAssociation( query.edge, query.node, function( error )
                {
                    if ( error )
                        Err.sendError( reply, error );
                    else
                        sendReply( reply );
                });
            }
            else
                Err.sendError( reply, Err.INVALID_OBJECT );
        });
    },

    //===== DIRECTORY and FILES API ===========================================

    filesGet : function ( reply, query )
    {
        // Enforce required query parameter(s)
        if ( query.path === undefined || ( query.gid === undefined && query.uid === undefined ))
            throw Err.MISSING_REQUIRED_PARAM;

        var max_depth = 1;
        if ( query.depth !== undefined )
            max_depth = query.depth;

        var hidefiles = false;
        if ( query.hidefiles === "true" || query.hidefiles === "1" )
            hidefiles = true;

        var tmp;
        var i;
        var gids = undefined;
        var uid = undefined;

        // Get UID for in-memory filtering of results
        // Must convert the string values to integer values for subsequent comparison to row values
        if ( query.uid !== undefined )
            uid = parseInt( query.uid );

        // Build GID array for in-memory filtering of results
        // Must convert the string values to integer values for subsequent comparison to row values
        if ( query.gid !== undefined )
        {
            gids = [];
            tmp = query.gid.split(',');
            for ( i = 0; i < tmp.length; ++i )
                gids.push( parseInt( tmp[i] ));
        }

        // Built extra fields to return from file system table
        var extras = [];
        if ( query.retrieve !== undefined )
        {
            tmp = query.retrieve.split(',');
            for ( i = 0; i < tmp.length; ++i )
                extras.push( tmp[i] );
        }

        // Find starting point using provided path
        pool.cql( "select * from spiderfs where namespace = '" + query.path + "'", [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                var data = [];
                var metadata = [];

                if ( results.length > 0 )
                    processFileRows( results, data, metadata, uid, gids, hidefiles, 0, extras );

                if ( data.length > 0 )
                    processNextDirectory( reply, query, data, metadata, uid, gids, hidefiles, max_depth, extras );
                else
                    sendReply( reply, {} );
            }
            //console.log('end cassandra callback');
        });
        

        //console.log('end filesGet');
    }
};


function FileMetadata( id, pid, depth )
{
    this.id         = id;
    this.pid        = pid;
    this.depth      = depth;
    this.processed  = 0;
}


function processFileRows( a_results, a_data, a_metadata, a_uid, a_gids, a_hidefiles, a_depth, a_extras )
{
    var ns;
    var p = 0;
    var name = "";
    var gid = 0;
    var uid = 0;
    var isfile = false;
    var access = false;

    a_results.forEach( function( row )
    {
        uid = row.get('uid').value;
        gid = row.get('gid').value;
        isfile = row.get('ntype').value;

        if ( a_uid === 0 || a_gids === 0 ) // Root access
            access = true;
        else if ( a_uid === uid )
            access = true;
        else if ( a_gids !== undefined && a_gids.indexOf( gid ) > -1 )
            access = true;
        else
            access = false;

        // For now, filter gid on server side (cassandra doesn't allow OR in where clause)
        if ( access && ( a_hidefiles === false || isfile === false ))
        {
            ns = row.get('namespace').value;

            // Only need to do this once b/c base path is same for all rows
            if ( p === 0 )
                p = ns.lastIndexOf("|");

            if ( p < 0 )
                name = ns;
            else
                name = ns.substr( p + 1 );

            var data_rec = {};
            data_rec.type       = "file";
            data_rec.uuid       = row.get('uuid').value;
            if ( data_rec.uuid !== null )
                data_rec.uuid  = data_rec.uuid .toString();
            data_rec.name       = name;
            data_rec.uid        = uid;
            data_rec.gid        = gid;
            data_rec.filecount  = row.get('filecount').value;
            data_rec.isfile     = isfile;

            a_extras.forEach( function( field )
            {
                data_rec[field] = row.get(field).value;
            });

            a_data.push( data_rec );
            a_metadata.push( new FileMetadata( row.get('id').value, row.get('pid').value, a_depth ));
        }
    });
}


function processNextDirectory( reply, query, data, metadata, uid, gids, hidefiles, max_depth, extras )
{
    var index = -1;

    // Find next entry that needs to be followed
    for ( var i = 0; i < metadata.length; ++i )
    {
        if ( metadata[i].processed === 0 )
        {
            if ( metadata[i].depth < max_depth && data[i].isfile === false )
            {
                index = i;
                break;
            }
            else
                metadata[i].processed = 1;
        }
    }

    if ( index < 0 )
    {
        // All rows have been processed, send results
        buildFileObject( data[0], 0, data, metadata );
        sendReply( reply, data[0] );
    }
    else
    {
        var cur_row = metadata[index];
        cur_row.processed = 1;

        // Query db for next directory
        pool.cql( "select * from spiderfs where pid = " + cur_row.id, [], function( err, results )
        {
            if ( err )
                Err.sendError( reply, err );
            else
            {
                processFileRows( results, data, metadata, uid, gids, hidefiles, cur_row.depth + 1, extras );

                // Find next row to process
                processNextDirectory( reply, query, data, metadata, uid, gids, hidefiles, max_depth, extras );
            }
        });
    }

    //console.log('\t\tend process file rows')
}


function buildFileObject( object, obj_idx, data, metadata )
{
    var md = metadata[obj_idx];

    for ( var i = 0; i < metadata.length; ++i )
    {
        if ( metadata[i].pid === md.id )
        {
            if ( object.files === undefined )
                object.files = [];

            buildFileObject( data[i], i, data, metadata );
            object.files.push( data[i] );
        }
    }
}


/// Checks if an object exists in database by uuid and type
function objectExists( a_uuid, a_type, callback )
{
    pool.cql( "select uuid from " + tableByType[a_type] + " where uuid = " + a_uuid, [], function( err, results )
    {
        if ( err || !results.length )
            callback( 0 );
        else
            callback( 1 );
    });
}


function tagExistsByName( a_tagname, a_uid, callback )
{
    pool.cql( "select uuid from tags where tagname = '" + a_tagname + "' and uid = " + a_uid + " allow filtering", [], function( err, results )
    {
        if ( !err && results.length )
            callback( 1, results[0][0].value );
        else
            callback( 0, null );
    });
}


function associationExists( a_edgeuuid, a_nodeuuid, callback )
{
    pool.cql( "select edgeuuid from associations where edgeuuid = " + a_edgeuuid + " and nodeuuid = " + a_nodeuuid + " allow filtering", [], function( err, results )
    {
        callback( !err && results.length );
    });
}


// This is a temporary function that will be replaced when arbitrary objects can be associated
function deleteAssociations( a_edgeuuid, callback )
{
    pool.cql( "delete from associations where edgeuuid = " + a_edgeuuid, [], function( err, results )
    {
        callback( err );
    });
}

function deleteAssociation( a_edgeuuid, a_nodeuuid, callback )
{
    pool.cql( "delete from associations where edgeuuid = " + a_edgeuuid + " and nodeuuid = " + a_nodeuuid, [], function( err, results )
    {
        callback( err );
    });
}


function createAssociation( a_edgeuuid, a_nodeuuid, a_nodetype, callback )
{
    pool.cql( "insert into associations (edgeuuid,nodeuuid,nodetype) values (" + a_edgeuuid + "," + a_nodeuuid + ",'" + a_nodetype + "')", [], function( err, results )
    {
        callback( err );
    });
}


function parseColumns( query )
{
    if ( query.retrieve !== undefined )
        return query.retrieve;
    else
        return "*";
}


function isStartRange( prop )
{
    switch ( prop )
    {
    case "starttime":
    case "start_job":
    case "from_create":
    case "from_update":
        return 1;
    default:
        return 0;
    }
}

function isEndRange( prop )
{
    switch ( prop )
    {
    case "endtime":
    case "end_job":
    case "to_create":
    case "to_update":
        return 1;
    default:
        return 0;
    }
}


function shouldIgnore( prop )
{
    switch ( prop )
    {
    case "retrieve":
    case "path":
    case "offset":
    case "count":
        return 1;
    default:
        return 0;
    }
}


function shouldQuote( prop )
{
    switch ( prop )
    {
    case "uuid":
    case "uid":
    case "gid":
    case "jobid":
    case "joberr":
    case "processors":
    case "walltime":
        return 0;
    default:
        return 1;
    }
}

function parseWhereClause( query )
{
    var clause = "";
    var tmp = "";

    for ( var prop in query )
    {
        if ( query.hasOwnProperty( prop ))
        {
            if ( shouldIgnore( prop ))
                continue;

            if ( clause.length )
                clause += " and ";

            if ( shouldQuote( prop ))
                tmp = "'" + query[prop] + "'";
            else
                tmp = query[prop];

            if ( isStartRange( prop ))
                clause += prop + " >= " + tmp;
            else if ( isEndRange( prop ))
                clause += prop + " <= " + tmp;
            else
                clause += prop + " = " + tmp;
        }
    }

    if ( clause.length )
        return " where " + clause + " allow filtering";
    else
        return "";
}


function sendReply( reply, payload )
{
    //console.log('in send reply...');
    //console.log(JSON.stringify( wrapper, null, 2 ));

    reply.writeHead(200);
    if ( payload )
    {
        reply.write( JSON.stringify( payload, null, 2 ));
        reply.write( "\n" );
    }
    reply.end();
}

