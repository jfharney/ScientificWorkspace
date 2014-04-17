/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package gov.ornl.nccs.scientificworkspace;

import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;
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
    //@Context
    //private ServletContext context;

    /**
     * Creates a new instance of UserResource
     */
    public JobResource()
    {
        /*
        System.out.print("Making JobResource!");
        m_api = (TitanAPI)context.getAttribute("titan");
        if ( m_api == null )
        {
            System.out.println("Titan context object was missing or null.");
            m_api = TitanAPI.getInstance();
            context.setAttribute("titan",m_api);
        }*/
    }

    /**
     * Retrieves representation of an instance of gov.ornl.nccs.scientificworkspace.UserResource
     * @param a_jid - Job id
     * @param a_properties - Properties to retrieve
     * @return an instance of java.lang.String
     */
    @Path("job")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJob(
        @DefaultValue("-1") @QueryParam("jid") int a_jid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_jid >= 0 )
            m_api.getJobByJID( a_jid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("job/{nodeid}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJobByNID(
        @DefaultValue("-1") @PathParam("nodeid") int a_nodeid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_nodeid > -1 )
            m_api.getObjectByNID( a_nodeid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("jobs")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJobs(
        @DefaultValue("-1") @QueryParam("uid") int a_uid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid >= 0 )
            m_api.getJobs( a_uid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }

    //private static final IJobAPI m_job_api = TitanAPI.getInstance();
    //private static final IGeneralAPI m_gen_api = TitanAPI.getInstance();
    private final TitanAPI m_api = TitanAPI.getInstance();
}
