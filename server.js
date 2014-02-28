
var Http = require('http');
var Url = require('url');
var Err = require('./errors');
var DB = require('./cassdb');


//=============================================================================
// USERS Service Functions

function handleUserRequest( method, path, query, payload, result )
{
    // API:
    // GET host/users - get all users with query params
    // GET host/users/username - get a user record

    if ( method === "GET" )
    {
        if ( path.length === 2 )
        {
            //console.log('result: ' + result + ' query: ' + query);
            DB.userQuery( result, query );
        }
        else if ( path.length === 3 )
        {
            //console.log('result: ' + result + ' path[2]: ' + path[2] + ' query: ' + query);
            DB.userGet( result, path[2], query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else
        throw Err.INVALID_METHOD;
}


//=============================================================================
// GROUPS Service Functions

function handleGroupRequest( method, path, query, payload, result )
{
    // API:
    // GET host/groups - get all groups for a given uid

    if ( method === "GET" )
    {
        if ( path.length === 2 )
        {
            DB.groupQuery( result, query );
        }
        else if ( path.length === 3 )
        {
            DB.groupGet( result, path[2], query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else
        throw Err.INVALID_METHOD;
}

//=============================================================================
// JOBS Service Functions

// Handle job service requests
function handleJobRequest( method, path, query, payload, reply )
{
    // API:
    // GET host/jobs - all josb with query params
    // GET host/jobs/jobid - job record

    if ( method === "GET" )
    {
        if ( path.length === 2 )
        {
            DB.jobQuery( reply, query );
        }
        else if ( path.length === 3 )
        {
            result = DB.jobGet( reply, path[2], query );
        }
        else throw Err.INVALID_REQUEST;
    }
    else throw Err.INVALID_METHOD;
}


//=============================================================================
// APPS Service Functions

// Handle apps service requests
function handleAppRequest( method, path, query, payload, reply )
{
    // API:
    // GET host/apps - list apps for jobid (in query params)
    // GET host/apps/appid - get app record

    if ( method === "GET" )
    {
        if ( path.length === 2 )
        {
            DB.appQuery( reply, query );
        }
        else if ( path.length === 3 )
        {
            DB.appGet( reply, path[2], query );
        }
        else throw Err.INVALID_REQUEST;
    }
    else throw Err.INVALID_METHOD;
}


//=============================================================================
// FILES (and directories) Service Functions

function handleFileRequest( method, path, query, payload, reply )
{
    // API:
    // GET host/files

    if ( method === "GET" )
    {
        //console.log('in server.js get for files');
        if ( path.length === 2 )
        {
            DB.filesGet( reply, query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else
        throw Err.INVALID_METHOD;
}


//=============================================================================
// ASSOCIATIONS Service Functions

function handleAssociationRequest( method, path, query, payload, reply )
{
    // API:
    // GET /host/associations?edge=(uuid)
    // GET /host/associations?node=(uuid)
    // PUT /host/associations?edge=(uuid)&node=(uuid)&type=x
    // DEL /host/associations?edge=(uuid)&node=(uuid)

    if ( method === "GET" )
    {
        if ( path.length === 2 )
        {
            DB.associationsGet( reply, query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else if ( method === "PUT" )
    {
        if ( path.length === 2 )
        {
            DB.associationsPut( reply, query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else if ( method === "DELETE" )
    {
        if ( path.length === 2 )
        {
            DB.associationsDelete( reply, query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else
        throw Err.INVALID_METHOD;
}

//=============================================================================
// TAGS Service Functions


/* The TAG API is to support the administration (CRUD) of tags. This API is NOT
used for tagging data entities - that service is provided on the respective
data entity APIs (for those that support tagging). Tags are generic and can be
applied to any data entity that accepts tags. When a tag is deleted, all
instances of that tag are removed from tagged entities.

Tags live in domains, but domains are accessed and maintined through the Domain
API. If a domain is deleted, all tags associated with that domain are also
deleted.
*/

function handleTagRequest( method, path, query, payload, reply )
{
    // API:
    // GET associations/uuid

    if ( method === "GET" )
    {
        if ( path.length === 2 )
        {
            DB.tagQuery( reply, query );
        }
        else if ( path.length === 3 )
        {
            DB.tagGet( reply, path[2], query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else if ( method === "POST" )
    {
        if ( path.length === 3 )
        {
            DB.tagPost( reply, path[2], query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else if ( method === "PUT" )
    {
        if ( path.length === 3 )
        {
            DB.tagPut( reply, path[2], query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else if ( method === "DELETE" )
    {
        if ( path.length === 3 )
        {
            DB.tagDelete( reply, path[2], query );
        }
        else
            throw Err.INVALID_REQUEST;
    }
    else
        throw Err.INVALID_METHOD;
}



//=============================================================================
//=============================================================================
// Serice Entry Point

// Dispatch request to handler based on verb and URL path
function dispatchRequest( method, path, query, payload, reply )
{
    if ( path[1] )
    {
        switch ( path[1] )
        {
        case "users":
            handleUserRequest( method, path, query, payload, reply );
            break;
        case "groups":
            handleGroupRequest( method, path, query, payload, reply );
            break;
        case "jobs":
            handleJobRequest( method, path, query, payload, reply );
            break;
        case "apps":
            handleAppRequest( method, path, query, payload, reply );
            break;
        case "files":
            handleFileRequest( method, path, query, payload, reply );
            break;
        case "tags":
            handleTagRequest( method, path, query, payload, reply );
            break;
        case "associations":
            handleAssociationRequest( method, path, query, payload, reply );
            break;
        default:
            throw Err.INVALID_REQUEST;
        }
    }
    else
    {
        if ( method === "GET" )
        {
            reply.writeHead(200);
            reply.write('{"resources":["users","groups","jobs","apps","files","tags","associations"]}');
            reply.end();
        }
        else throw Err.INVALID_METHOD;
    }
}


// Entry-point for service requests
var server = Http.createServer( function( request, reply )
{
    var url     = Url.parse( request.url, true );
    var query   = url.query;
    var path    = url.pathname.split("/");
    var payload;

    try
    {
        if ( request.method === 'POST' || request.method === 'PUT' )
        {
            var body = '';

            request.on('data', function (chunk)
            {
                body += chunk;
            });

            request.on('end', function ()
            {
                try
                {
                    var payload;

                    if ( body.length )
                        payload = JSON.parse( body );

                    dispatchRequest( request.method, path, query, payload, reply );
                }
                catch ( e )
                {
                    Err.sendError(reply,e);
                }
            });
        }
        else
        {
            dispatchRequest( request.method, path, query, payload, reply );
        }
    }
    catch ( e )
    {
        Err.sendError(reply,e);
    }
});

server.listen(8080);
