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

    @Path("status")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getStatus()
    {
        JSONStringer output = new JSONStringer();

        output.object();
        output.key("status").value("ok");
        output.endObject();

        return output.toString();
    }

    @Path("stop")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public String postStop()
    {
        JSONStringer output = new JSONStringer();

        output.object();
        output.key("status").value("stopped");
        output.endObject();

        return output.toString();
    }

    //private final TitanAPI m_api = TitanAPI.getInstance();
}
