//var helenus = require('../node_modules/helenus');
var Err = require('./errors');

module.exports =
{
    getTagUUID : getTagUUID,
    createTag : createTag,
    updateTag : updateTag,
    deleteTag : deleteTag,
    tagRowToObject : tagRowToObject
};


function getTagUUID( a_tagname, a_uid, callback )
{
    console.log("getTagUUID: " + a_tagname );
    global.pool.cql( "select uuid from tags where tagname = '" + a_tagname + "' and uid = " + a_uid + " allow filtering", [], function( err, results )
    {
        console.log("replying from getTagUUID: " + a_tagname );

        if ( !err && results.length )
            callback( 1, results[0][0].value );
        else
            callback( 0, null );
    });
};


function createTag( reply, query, callback )
{
    console.log("createTag: " + query.tagname );

    var qry = "insert into tags (uuid,tagdesc,tagname,uid,visibility,wtime) values (now(),'"
      + ((query.desc === undefined) ? "" : query.desc) + "','" + query.tagname + "'," + query.uid + ",'"
      + ((query.visibility === undefined) ? "private" : query.visibility) + "',dateof(now()))";

    global.pool.cql( qry, [], function( error, results )
    {
        if ( error )
            Err.sendError( reply, error );
        else
        {
            getTagUUID( query.tagname, query.uid, function( tag_exists, taguuid )
            {
                if ( tag_exists )
                    createTagACL( reply, query, taguuid, callback );
                else
                    Err.sendError( reply, Err.GENERAL_ERROR );
            });
        }
    });
};


function updateTag( reply, query, a_taguuid, callback )
{
    console.log("updateTag: " + a_taguuid );

    deleteTagACL( reply, a_taguuid, function()
    {
        console.log("back from deleteTagACL" );

        var qry = "update tags set tagdesc = '"  + ((query.desc === undefined) ? "" : query.desc) + "', visibility = '"
          + ((query.visibility === undefined) ? "private" : query.visibility)
          + "', wtime = dateof(now()) where uuid = " + a_taguuid;

        global.pool.cql( qry, [], function( error, results )
        {
            if ( error )
                Err.sendError( reply, error );
            else
                createTagACL( reply, query, a_taguuid, callback );
        });
    });
};


function deleteTag( reply, a_taguuid, callback )
{
    // Delete tagaccess rows referring to this tag
    deleteTagACL( reply, a_taguuid, function()
    {
        global.pool.cql( "delete from tags where uuid = " + a_taguuid, [], function( error, results )
        {
            if ( error )
                Err.sendError( reply, error );
            else if ( callback )
                callback();
        });
    });
};


function insertGroupACLEntry( reply, a_taguuid, a_gids, callback )
{
    global.pool.cql( "insert into tagaccess (uuid,gid,uid) values (" + a_taguuid + "," + a_gids.shift() + ",0)", [], function( error, results )
    {
        if ( error )
            Err.sendError( reply, error );
        else if ( a_gids.length > 0 )
            insertGroupACLEntry( reply, a_taguuid, a_gids, callback );
        else
            callback();
    });
}


function createTagGroupACL( reply, query, a_taguuid, callback )
{
    console.log("createTagGroupACL: " + a_taguuid );

    if ( query.group_acl !== undefined )
    {
        var gids = [];
        var tmp = query.group_acl.split(',');

        for ( var i = 0; i < tmp.length; ++i )
            gids.push( parseInt( tmp[i] ));

        insertGroupACLEntry( reply, a_taguuid, gids, function( error, results )
        {
            callback();
        });
    }
    else
        callback();
};


function insertUserACLEntry( reply, a_taguuid, a_uids, callback )
{
    global.pool.cql( "insert into tagaccess (uuid,gid,uid) values (" + a_taguuid + ",0," + a_uids.shift() + ")", [], function( error, results )
    {
        if ( error )
            Err.sendError( reply, error );
        else if ( a_uids.length > 0 )
            insertUserACLEntry( reply, a_taguuid, a_uids, callback );
        else
            callback();
    });
}


function createTagUserACL( reply, query, a_taguuid, callback )
{
    console.log("createTagUserACL: " + a_taguuid );

    if ( query.user_acl !== undefined )
    {
        var uids = [];
        var tmp = query.user_acl.split(',');

        for ( var i = 0; i < tmp.length; ++i )
            uids.push( parseInt( tmp[i] ));

        insertUserACLEntry( reply, a_taguuid, uids, function( error, results )
        {
            callback();
        });
    }
    else
        callback();
};


function createTagACL( reply, query, a_taguuid, callback )
{
    console.log("createTagACL: " + a_taguuid );

    if ( query.visibility === "shared" )
    {
        createTagGroupACL( reply, query, a_taguuid, function()
        {
            createTagUserACL( reply, query, a_taguuid, callback );
        });
    }
    else
        callback();
};


function deleteTagACL( reply, a_taguuid, callback )
{
    console.log("deleteTagACL: " + a_taguuid );

    global.pool.cql( "delete from tagaccess where uuid = " + a_taguuid, [], function( error, results )
    {
        console.log("err: " + error );
        if ( error )
            Err.sendError( reply, error );
        else if ( callback )
            callback();
    });
};


function tagRowToObject( reply, row )
{
    var record = { type: "tag" };

    row.forEach( function( name, value, ts, ttl )
    {
        if ( name === "uuid" )
            record[name] = value.toString();
        else
            record[name] = value;
    });
/*
    if ( record.visibility === "shared" )
    {
        if ( record.user_acl )
        {

        }

        if ( record.group_acl )
        {

        }
    }
*/
    return record;
}
