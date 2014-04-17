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
public class GroupResource
{
    //@Context
    //private ServletContext context;

    /**
     * Creates a new instance of UserResource
     */
    public GroupResource()
    {
        /*
        System.out.print("Making GroupResource!");
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
     * @param a_gid - Group id
     * @param a_gname - Group name
     * @param a_properties - Properties to retrieve
     * @return an instance of java.lang.String
     */
    @Path("group")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getGroup(
        @DefaultValue("-1") @QueryParam("gid") int a_gid,
        @QueryParam("gname") String a_gname,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_gid >= 0 )
            m_api.getGroupByGID( a_gid, a_properties, output );
        else if ( a_gname != null )
            m_api.getGroupByGname( a_gname, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("group/{nodeid}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getGroupByNID(
        @DefaultValue("-1") @PathParam("nid") int a_nid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_nid > -1 )
            m_api.getObjectByNID( a_nid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("groups")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getGroups(
        @DefaultValue("-1") @QueryParam("uid") int a_uid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid >= 0 )
            m_api.getGroupsByUID( a_uid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }

    //private static final IGeneralAPI m_gen_api = TitanAPI.getInstance();
    //private static final IGroupAPI m_group_api = TitanAPI.getInstance();
    private final TitanAPI m_api = TitanAPI.getInstance();
}
