/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package gov.ornl.nccs.scientificworkspace;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
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
public class UserResource
{
    @Context
    private UriInfo context;

    /**
     * Creates a new instance of UserResource
     */
    public UserResource() {
    }

    /**
     * Retrieves representation of an instance of gov.ornl.nccs.scientificworkspace.UserResource
     * @param a_uid - User id
     * @param a_uname - Username
     * @param a_properties - Properties to retrieve
     * @return an instance of java.lang.String
     */
    @Path("user")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getUser(
        @DefaultValue("-1") @QueryParam("uid") int a_uid,
        @QueryParam("uname") String a_uname,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid >= 0 )
            m_user_api.getUserByUID( a_uid, a_properties, output );
        else if ( a_uname != null )
            m_user_api.getUserByUname( a_uname, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("user/{nodeid}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getUserByNID(
        @DefaultValue("-1") @PathParam("nid") int a_nid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_nid > -1 )
            m_gen_api.getObjectByNID( a_nid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("users")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getUsers(
        @DefaultValue("-1") @QueryParam("gid") int a_gid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_gid >= 0 )
            m_user_api.getUsersByGID( a_gid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }

    private static final IGeneralAPI m_gen_api = TitanAPI.getInstance();
    private static final IUserAPI m_user_api = TitanAPI.getInstance();
}
