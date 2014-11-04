/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package gov.ornl.ccs;

import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import org.json.JSONStringer;

/**
 * REST Web Service
 *
 * @author d3s
 */
@Path("")
public class AssocResource
{
    /**
     * Creates a new instance of UserResource
     */
    public AssocResource()
    {
    }

    /**
     * Creates a new tag resource
     * @param a_uid - UID of tag owner
     * @param a_status - Status of edges to return (omit for all)
     * @param a_nid - Optional NID of of endpoint to query
     * @return JSON output payload
     *
     * Get a list of edges with vertex endpoints based on specified UID and edge
     * status. Typically status would be "review" for edges requiring review.
     */
    @Path("assoc")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getAssoc(
        @DefaultValue("-1") @QueryParam(Schema.UID) int a_uid,
        @DefaultValue("-1") @QueryParam(Schema.STATUS) int a_status,
        @DefaultValue("-1") @QueryParam(Schema.NID) long a_nid )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid > -1 && a_nid == -1 )
            m_api.getAssoc( a_uid, a_status, output );
        else if ( a_uid > -1 && a_nid > -1 )
            m_api.getAssocFromNode( a_uid, a_nid, a_status, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("assoc")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public String putAssoc(
        @DefaultValue("-1") @QueryParam(Schema.UID) int a_uid,
        @DefaultValue("-1") @QueryParam(Schema.STATUS) int a_status,
        @DefaultValue("-1") @QueryParam("out") long a_out_nid,
        @DefaultValue("-1") @QueryParam("in") long a_in_nid )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid > -1 && a_status > -1 && a_in_nid > -1 && a_out_nid > -1 )
            m_api.putAssoc( a_uid, a_status, a_out_nid, a_in_nid, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("assoc")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteAssoc(
        @DefaultValue("-1") @QueryParam(Schema.UID) int a_uid,
        @DefaultValue("-1") @QueryParam("out") long a_out_nid,
        @DefaultValue("-1") @QueryParam("in") long a_in_nid )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid > -1 && a_in_nid > -1 && a_out_nid > -1 )
            m_api.deleteAssoc( a_uid, a_out_nid, a_in_nid, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    private final TitanAPI m_api = TitanAPI.getInstance();
}
