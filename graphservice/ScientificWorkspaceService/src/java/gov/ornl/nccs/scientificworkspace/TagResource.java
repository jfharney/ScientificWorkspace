/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package gov.ornl.nccs.scientificworkspace;

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
public class TagResource
{
    /**
     * Creates a new instance of UserResource
     */
    public TagResource()
    {
    }

    /**
     * Retrieves representation of an instance of gov.ornl.nccs.scientificworkspace.UserResource
     * @param a_name - Tag name
     * @param a_uid - Owning user id
     * @param a_properties - Properties to retrieve
     * @return an instance of java.lang.String
     */
    /*
    @Path("tag")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getTag(
        @QueryParam("name") String a_name,
        @DefaultValue("-1") @QueryParam("uid") int a_uid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_name != null && a_uid > -1 )
            m_api.getTagByName( a_name, a_uid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }
    */

    /**
     * Creates a new tag resource
     * @param a_uid - UID of tag owner
     * @param a_name - Tag name
     * @param a_desc - Tag description
     * @param a_access - Access mode (0=private,1=shared,2=public)
     * @param a_acl_uids - ACL list of uids
     * @param a_acl_gids - ACL list of gids
     * @return an instance of java.lang.String
     */
    @Path("tag")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public String postTag(
        @DefaultValue("-1") @QueryParam("uid") int a_uid,
        @QueryParam("name") String a_name,
        @QueryParam("desc") String a_desc,
        @DefaultValue("0") @QueryParam("access") int a_access,
        @QueryParam("acl_uids") String a_acl_uids,
        @QueryParam("acl_gids") String a_acl_gids )
    {
        JSONStringer output = new JSONStringer();

        if ( a_name != null && a_uid > -1 )
            m_api.postTag( a_uid, a_name, a_desc, a_access, a_acl_uids, a_acl_gids, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    /**
     * Updates an existing tag resource
     * @param a_nid - NID of tag
     * @param a_name - New Tag name
     * @param a_desc - New Tag description
     * @param a_access - New access mode (0=private,1=shared,2=public)
     * @param a_acl_uids - New ACL list of uids
     * @param a_acl_gids - New ACL list of gids
     * @return an instance of java.lang.String
     */
    @Path("tag")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public String putTag(
        @DefaultValue("-1") @QueryParam("nid") int a_nid,
        @QueryParam("name") String a_name,
        @QueryParam("desc") String a_desc,
        @DefaultValue("0") @QueryParam("access") int a_access,
        @QueryParam("acl_uids") String a_acl_uids,
        @QueryParam("acl_gids") String a_acl_gids )
    {
        JSONStringer output = new JSONStringer();

        if ( a_name != null && a_nid > -1 )
            m_api.putTag( a_nid, a_name, a_desc, a_access, a_acl_uids, a_acl_gids, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("tag/{nodeid}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getTagByNID(
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

    @Path("tag/{nodeid}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteTagByNID(
        @DefaultValue("-1") @PathParam("nodeid") int a_nodeid )
    {
        JSONStringer output = new JSONStringer();

        if ( a_nodeid > -1 )
            m_api.deleteObjectByNID( a_nodeid );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("tag/{tag_nid}/link/{obj_nid}")
    @POST
    public void linkTagToNID(
        @PathParam("tag_nid") int a_tag_nid,
        @PathParam("obj_nid") int a_obj_nid )
    {
        m_api.linkTagToNID( a_tag_nid, a_obj_nid );
    }
    
    @Path("tag/{tag_nid}/link/{obj_nid}")
    @DELETE
    public void unlinkTagFromNID(
        @PathParam("tag_nid") int a_tag_nid,
        @PathParam("obj_nid") int a_obj_nid )
    {
        m_api.unlinkTagFromNID( a_tag_nid, a_obj_nid );
    }

    @Path("tags")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getTags(
        @DefaultValue("-1") @QueryParam("uid") int a_uid,
        @QueryParam("tag") String a_tag_name,
        @QueryParam("owned") String a_owned,
        @QueryParam("shared") String a_shared,
        @QueryParam("shared_uids") String a_shared_uids,
        @QueryParam("public") String a_public,
        @QueryParam("public_uids") String a_public_uids,
        @DefaultValue("-1") @QueryParam("nid") int a_nid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid > -1 && a_nid == -1 )
        {
            boolean owned = a_owned != null;
            boolean shared = a_shared != null;
            boolean pub = a_public != null;

            if ( !( owned || shared || pub ))
                owned = shared = pub = true;

            m_api.getTags( a_uid, owned, shared, a_shared_uids, pub, a_public_uids, a_properties, output );
        }
        else if ( a_uid > -1 && a_nid > -1 )
            m_api.getTagsFromNode( a_nid, a_uid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }

    /*
    @Path("tags/by-node")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getTagsByNode(
        @DefaultValue("-1") @QueryParam("uid") int a_uid,
        @DefaultValue("-1") @QueryParam("nid") int a_nid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid > -1 && a_nid > -1 )
            m_api.getTagsOnNID( a_nid, a_uid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }
    */


    private final TitanAPI m_api = TitanAPI.getInstance();
}
