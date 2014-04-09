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
public class FileResource
{
    @Context
    private UriInfo context;

    /**
     * Creates a new instance of UserResource
     */
    public FileResource()
    {
    }

    /**
     * Retrieves representation of an instance of gov.ornl.nccs.scientificworkspace.UserResource
     * @param a_path - File path (pipe separated)
     * @param a_gids - List of user's group IDs
     * @param a_depth - Depth to read
     * @param a_properties - Properties to retrieve
     * @return an instance of java.lang.String
     */
    @Path("files")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getFile(
        @QueryParam("path") String a_path,
        @QueryParam("gids") String a_gids,
        @DefaultValue("0") @QueryParam("depth") int a_depth,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        if ( a_path != null && a_gids != null )
            m_file_api.getFilesByPath( a_path, a_gids, a_depth, a_properties, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    private static final IGeneralAPI m_gen_api = TitanAPI.getInstance();
    private static final IFileAPI m_file_api = TitanAPI.getInstance();
}
