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
public class JobResource
{
    /**
     * Creates a new instance of UserResource
     */
    public JobResource()
    {
    }

    /**
     * Retrieves representation of an instance of gov.ornl.nccs.scientificworkspace.UserResource
     * @param a_jid - Job id
     * @param a_properties - Properties to retrieve
     * @return JSON output payload
     */
    @Path("job")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJob(
        @DefaultValue("-1") @QueryParam(Schema.JID) int a_jid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_jid >= 0 )
            m_api.getJobByJID( a_jid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }


    /**
     * @param a_uid
     * @param a_properties
     * @return JSON output payload
     */
    @Path("jobs")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJobs(
        @DefaultValue("-1") @QueryParam(Schema.UID) int a_uid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid >= 0 )
            m_api.getJobs( a_uid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }

    private final TitanAPI m_api = TitanAPI.getInstance();
}
