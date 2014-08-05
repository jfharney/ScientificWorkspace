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
public class EventResource
{
    /**
     * Creates a new instance of EventResource
     */
    public EventResource()
    {
    }


    /**
     * Updates an existing event resource
     * @param a_nid - NID of tag
     * @param a_status - New status
     * @return JSON output payload
     */
    @Path("event")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public String putEvent(
        @DefaultValue("-1") @QueryParam(Schema.NID) long a_nid,
        @QueryParam(Schema.STATUS) int a_status )
    {
        JSONStringer output = new JSONStringer();

        if ( a_nid > -1 )
            m_api.putEvent( a_nid, a_status, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }


    /**
     * @param a_nodeid
     */
    @Path("event/{nodeid}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public void deleteEventByNID(
        @DefaultValue("-1") @PathParam("nodeid") long a_nodeid )
    {
        // TODO - Must ensure nodeid refers to an event vertex

        if ( a_nodeid > -1 )
            m_api.deleteObjectByNID( a_nodeid, Schema.Type.EVENT.toInt() );
        else
            throw new WebApplicationException( Response.Status.BAD_REQUEST );
    }

    /**
     * @param a_uid
     * @return JSON output payload
     */
    @Path("events")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getEvents(
        @DefaultValue("-1") @QueryParam(Schema.UID) int a_uid,
        @DefaultValue("-1") @QueryParam(Schema.STATUS) int a_status,
        @DefaultValue("-1") @QueryParam(Schema.CTIME) long a_ctime )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid > -1 )
            m_api.getEvents( a_uid, a_status, a_ctime, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }


    private final TitanAPI m_api = TitanAPI.getInstance();
}
