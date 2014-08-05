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
@Path("admin")
public class AdminResource
{
    /**
     * Creates a new instance of UserResource
     */
    public AdminResource()
    {
    }

    private void checkCredentials( String a_password )
    {
        if ( a_password == null )
            throw new WebApplicationException( Response.Status.FORBIDDEN );

        if ( !a_password.equals( "think1st" ))
            throw new WebApplicationException( Response.Status.UNAUTHORIZED );
    }

    @Path("init")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public void initializeDb(
        @QueryParam("pass") String a_password ) throws Exception
    {
        checkCredentials(a_password);

        m_api.initializeDb();
    }

    @Path("load")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public String load(
        @QueryParam("pass") String a_password,
        @QueryParam("users") String a_users,
        @QueryParam("groups") String a_groups,
        @QueryParam("jobs") String a_jobs,
        @QueryParam("apps") String a_apps,
        @QueryParam("files") String a_files,
        @QueryParam("path") String a_path ) throws Exception
    {
        checkCredentials(a_password);

        JSONStringer output = new JSONStringer();
        output.array();

        if ( a_users != null )
            m_api.loadUsers( a_users, output );

        if ( a_groups != null )
            m_api.loadGroups( a_groups, output );

        if ( a_jobs != null )
            m_api.loadJobs( a_jobs, output );

        if ( a_apps != null )
            m_api.loadApps( a_apps, output );

        if ( a_files != null )
            m_api.loadFiles( a_files, a_path, output );

        output.endArray();
        return output.toString();
    }

    @Path("crawl/jobs")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public String crawlJobs(
        @QueryParam("pass") String a_password,
        @DefaultValue("-1") @QueryParam("start") long a_start )  throws Exception
    {
        checkCredentials(a_password);

        JSONStringer output = new JSONStringer();

        m_api.crawlJobs( a_start, output );

        return output.toString();
    }

    private final TitanAdminAPI m_api = TitanAdminAPI.getInstance();
}

