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
public class AppResource
{
    /**
     * Creates a new instance of UserResource
     */
    public AppResource()
    {
    }

    /**
     * @param a_aid - App ID of application to retrieve
     * @param a_properties - Properties to retrieve
     * @return JSON output payload
     * 
     * Retrieves an application record by App ID.
     */
    @Path("app")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getApp(
        @DefaultValue("-1") @QueryParam(Schema.AID) int a_aid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_aid >= 0 )
            m_api.getAppByAID( a_aid, a_properties, output );
        else
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }


    /**
     * @param a_jid - Job ID of applications to retrieve
     * @param a_properties - Properties to retrieve
     * @return JSON output payload
     * 
     * Retrieves an application record(s) by owning job ID.
     */
    @Path("apps")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getApps(
        @DefaultValue("-1") @QueryParam(Schema.JID) int a_jid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_jid >= 0 )
            m_api.getAppsByJID( a_jid, a_properties, output );
        else
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }

    private final TitanAPI m_api = TitanAPI.getInstance();
}
