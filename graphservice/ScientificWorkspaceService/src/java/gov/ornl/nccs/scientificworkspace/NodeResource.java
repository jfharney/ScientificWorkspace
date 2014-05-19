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
public class NodeResource
{
    /**
     * Creates a new instance of UserResource
     */
    public NodeResource()
    {
    }

    @Path("node/{nodeid}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getNodeByNID(
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

    @Path("nodes")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getTaggedNodes(
        //@DefaultValue("-1") @QueryParam("uid") int a_uid,
        @DefaultValue("-1") @QueryParam("tag-nid") int a_tag_nid,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_tag_nid > -1 )
            m_api.getNodesByTagNID( a_tag_nid, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }

    private final TitanAPI m_api = TitanAPI.getInstance();
}
