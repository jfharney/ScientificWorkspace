var gHttp = require('http');
var gUrl = require('url');

// Exception values
const INVALID_REQUEST = -1;
const INVALID_OBJECT  = -2;
const MISSING_REQUIRED_PARAM = -3;
const NOT_AUTHORIZED = -4;
const INVALID_METHOD = -5;
const CONFLICTING_REQUEST = -6;
const GENERAL_ERROR = -7;

module.exports =
{
    GENERAL_ERROR: GENERAL_ERROR,
    INVALID_REQUEST: INVALID_REQUEST,
    INVALID_OBJECT: INVALID_OBJECT,
    MISSING_REQUIRED_PARAM: MISSING_REQUIRED_PARAM,
    NOT_AUTHORIZED: NOT_AUTHORIZED,
    INVALID_METHOD: INVALID_METHOD,
    CONFLICTING_REQUEST: CONFLICTING_REQUEST,

    // Generate error and exception messages for a service request
    sendError: function ( reply, e )
    {
        switch ( e )
        {
        case NOT_AUTHORIZED:
            reply.writeHead(401);
            break;
        case INVALID_REQUEST:
            reply.writeHead(400);
            break;
        case INVALID_METHOD:
            reply.writeHead(405);
            break;
        case INVALID_OBJECT:
            reply.writeHead(404);
            break;
        case CONFLICTING_REQUEST:
            reply.writeHead(409);
            break;
        case MISSING_REQUIRED_PARAM:
            reply.writeHead(403);
            reply.write("<body></html>Missing one or more required query parameters</body></html>");
            break;
        default:
            // Most likely heleneus CQL call failed due to bad query parameters
            reply.writeHead(400);
            reply.write("<body></html>" + e.toString() + "</body></html>");
            break;
        }
        reply.write("\n");
        reply.end();

        console.log("sent error: " + e );
    }
}
