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
public class UserResource
{
    /**
     * Creates a new instance of UserResource
     */
    public UserResource()
    {
    }

    /**
     * Retrieves representation of an instance of gov.ornl.nccs.scientificworkspace.UserResource
     * @param a_uid - User id
     * @param a_uname - Username
     * @param a_properties - Properties to retrieve
     * @return JSON output payload
     */
    @Path("user")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getUser(
        @DefaultValue("-1") @QueryParam(Schema.UID) int a_uid,
        @QueryParam(Schema.UNAME) String a_uname,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid >= 0 )
            m_api.getUserByUID( a_uid, a_properties, output );
        else if ( a_uname != null )
            m_api.getUserByUname( a_uname, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }


    /**
     * @param a_gid
     * @param a_properties
     * @return JSON output payload
     */
    @Path("users")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getUsers(
        @DefaultValue("-1") @QueryParam(Schema.GID) int a_gid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_gid >= 0 )
            m_api.getUsersByGID( a_gid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }

    /**
     * @param a_uname
     * @return Status of login
     */
    @Path("login")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String login(
        @QueryParam(Schema.UNAME) String a_uname )
    {
        return a_uname;
    }

    private final TitanAPI m_api = TitanAPI.getInstance();
}
