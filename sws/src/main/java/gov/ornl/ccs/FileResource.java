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
public class FileResource
{
    /**
     * Creates a new instance of UserResource
     */
    public FileResource()
    {
    }

    /**
     * Retrieves representation of an instance of gov.ornl.nccs.scientificworkspace.UserResource
     * @param a_path - File path (pipe separated)
     * @param a_nid - Node ID for direct access
     * @param a_uid - User ID
     * @param a_list - Show list of contents (if path is to a directory)
     * @param a_off - Page offset
     * @param a_len - Page length
     * @param a_properties - Properties to retrieve
     * @return JSON output payload
     *
     * Retrieves a file or directory list by path.
     */
    @Path("files")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getFiles(
        @QueryParam("path") String a_path,
        @DefaultValue("-1") @QueryParam(Schema.NID) long a_nid,
        @DefaultValue("-1") @QueryParam(Schema.UID) int a_uid,
        @QueryParam("list") String a_list,
        @DefaultValue("-1") @QueryParam("off") int a_off,
        @DefaultValue("-1") @QueryParam("len") int a_len,
        @QueryParam("retrieve") String a_properties )
    {
        JSONStringer output = new JSONStringer();

        // Check required parameter
        if ( a_uid < 0 )
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        if ( a_path != null  )
            m_api.getFilesByPath( a_path, a_uid, a_list != null, a_properties, a_off, a_len, output );
        else if ( a_nid > -1 )
            m_api.getFilesByPath( a_nid, a_uid, a_list != null, a_properties, a_off, a_len, output );
        else
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    @Path("admin/files")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String adminGetFiles(
        @DefaultValue("-1") @QueryParam("nid") long a_nid,
        @QueryParam("root") String a_root )
    {
        // Check required parameter
        if ( a_nid < 0 && a_root == null )
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        if ( a_root != null )
            return m_api.adminGetRootFiles();
        else
            return m_api.adminGetFiles( a_nid );
    }

    @Path("admin/filetest")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String adminFileTest()
    {
        return m_api.adminFileTest();
    }

    private final TitanAPI m_api = TitanAPI.getInstance();
}
