var helenus = require('./node_modules/helenus');

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

module.exports =
{
    //===== USERS API =========================================================

    userGet : function ( reply, a_username, query )
    {
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from users where username = ?", [a_username], function( err, results )
        {
            if ( err )
            {
                sendError( reply, err );
            }
            else
            {
                var user = {};

                results.forEach( function( row )
                {
                    row.forEach( function( name, value, ts, ttl )
                    {
                        user[name] = value;
                    });
                });

                sendReply( reply, user );
            }
        });
    },

    userQuery : function ( reply, query )
    {
        var where_clause = parseWhereClause( query );
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from users" + where_clause, [], function( err, results )
        {
            if ( err )
            {
                sendError( reply, err );
            }
            else
            {
                var users = [];

                results.forEach( function( row )
                {
                    var record = {};
                    row.forEach( function( name, value, ts, ttl )
                    {
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
            throw ERR_MISSING_REQUIRE_PARAM;

        var where_clause = parseWhereClause( query );
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from groups" + where_clause, [], function( err, results )
        {
            if ( err )
            {
                sendError( reply, err );
            }
            else
            {
                var groups = [];

                results.forEach( function( row )
                {
                    var record = {};
                    row.forEach( function( name, value, ts, ttl )
                    {
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
            {
                sendError( reply, err );
            }
            else
            {
                var users = [];

                results.forEach( function( row )
                {
                    var record = {};
                    row.forEach( function( name, value, ts, ttl )
                    {
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
            {
                sendError( reply, err );
            }
            else
            {
                var jobs = [];

                results.forEach( function( row )
                {
                    var record = {};
                    row.forEach( function( name, value, ts, ttl )
                    {
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
            {
                sendError( reply, err );
            }
            else
            {
                var jobs = [];

                results.forEach( function( row )
                {
                    var record = {};
                    row.forEach( function( name, value, ts, ttl )
                    {
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
           throw ERR_MISSING_REQUIRE_PARAM;

        var where_clause = parseWhereClause( query );
        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from apps" + where_clause, [], function( err, results )
        {
            if ( err )
            {
                sendError( reply, err );
            }
            else
            {
                var apps = [];

                results.forEach( function( row )
                {
                    var record = {};
                    row.forEach( function( name, value, ts, ttl )
                    {
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
           throw ERR_MISSING_REQUIRE_PARAM;

        var columns = parseColumns( query );

        pool.cql( "select " + columns + " from apps where appid = " + a_appid + " and jobid = " + query.jobid + " allow filtering", [], function( err, results )
        {
            if ( err )
            {
                sendError( reply, err );
            }
            else
            {
                var apps = [];

                results.forEach( function( row )
                {
                    var record = {};
                    row.forEach( function( name, value, ts, ttl )
                    {
                        record[name] = value;
                    });

                    apps.push( record );
                });

                sendReply( reply, { apps: apps } );
            }
        });
    },

    //===== DIRECTORY and FILES API ===========================================

    filesGet : function ( reply, query )
    {
        // Enforce required query parameter(s)
        if ( query.path === undefined || query.gid === undefined )
            throw ERR_MISSING_REQUIRE_PARAM;

        var max_depth = 1;
        if ( query.depth !== undefined )
            max_depth = query.depth;

        var hidefiles = false;
        if ( query.hidefiles === "true" || query.hidefiles === "1" )
            hidefiles = true;

        // Build GIF object for in-memory filtering of results
        // Must convert the string values to integer values for subsequent comparison to row values
        var tmp = query.gid.split(',');
        var gids = [];
        for ( var i = 0; i < tmp.length; ++i )
            gids.push( parseInt( tmp[i] ));

        // Built extra fields to return from file system table
        var extras = [];
        if ( query.retrieve !== undefined )
        {
            tmp = query.retrieve.split(',');
            for ( var i = 0; i < tmp.length; ++i )
                extras.push( tmp[i] );
        }

        // Find starting point using provided path
        pool.cql( "select * from spiderfs where namespace = '" + query.path + "'", [], function( err, results )
        {
            if ( err )
            {
                sendError( reply, err );
            }
            else
            {
                var data = [];
                var metadata = [];

                if ( results.length > 0 )
                    processFileRows( results, data, metadata, gids, hidefiles, 0, extras );

                if ( data.length > 0 )
                    processNextDirectory( reply, query, data, metadata, gids, hidefiles, max_depth, extras );
                else
                    sendReply( reply, {} );
            }
        });
    }
};


function FileMetadata( id, pid, depth )
{
    this.id         = id;
    this.pid        = pid;
    this.depth      = depth;
    this.processed  = 0;
}


function processFileRows( results, data, metadata, gids, hidefiles, depth, extras )
{
    var ns;
    var p;
    var name = "";
    var gid = 0;
    var isfile = false;

    results.forEach( function( row )
    {
        gid = row.get('gid').value;
        isfile = row.get('ntype').value;

        // For now, filter gid on server side (cassandra doesn't allow OR in where clause)
        if ( gids.indexOf( gid ) > -1 && ( hidefiles === false || isfile === false ))
        {
            ns = row.get('namespace').value;
            p = ns.lastIndexOf("|");
            if ( p < 0 )
                name = ns;
            else
                name = ns.substr( p + 1 );

            var data_rec = {};
            data_rec.name       = name;
            data_rec.uid        = row.get('uid').value;
            data_rec.gid        = gid;
            data_rec.filecount  = row.get('filecount').value;
            data_rec.isfile     = isfile;

            extras.forEach( function( field )
            {
                data_rec[field] = row.get(field).value;
            });

            data.push( data_rec );
            metadata.push( new FileMetadata( row.get('id').value, row.get('pid').value, depth ));
        }
    });
}


function processNextDirectory( reply, query, data, metadata, gids, hidefiles, max_depth, extras )
{
    var index = -1;

    // Find next entry that needs to be followed
    for ( var i = 0; i < metadata.length; ++i )
    {
        if ( metadata[i].processed === 0 )
        {
            if ( metadata[i].depth < max_depth ) // AND it's a directory (can't tell yet)
            {
                index = i;
                break;
            }
            else
            {
                metadata[i].processed = 1;
            }
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
            {
                sendError( reply, err );
            }
            else
            {
                processFileRows( results, data, metadata, gids, hidefiles, cur_row.depth + 1, extras );

                // Find next row to process
                processNextDirectory( reply, query, data, metadata, gids, hidefiles, max_depth, extras );
            }
        });
    }
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


function sendReply( reply, wrapper )
{
    reply.writeHead(200);
    reply.write( JSON.stringify( wrapper, null, 2 ));
    reply.end();
}


function sendError( reply, error )
{
    reply.writeHead(400);
    reply.write( "<html><body>Error: " + error + "</body></html>" );
    reply.end();
}

// Exception values
var ERR_INVALID_REQUEST = -1;
var ERR_INVALID_OBJECT  = -2;
var ERR_INVALID_PROPERTY = -3;
var ERR_MISSING_REQUIRE_PARAM = -4;
