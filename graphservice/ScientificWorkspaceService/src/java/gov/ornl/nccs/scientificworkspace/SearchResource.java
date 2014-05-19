package gov.ornl.nccs.scientificworkspace;

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
public class SearchResource
{
    /**
     * Creates a new instance of UserResource
     */
    public SearchResource()
    {
    }

    /**
     * Retrieves representation of an instance of gov.ornl.nccs.scientificworkspace.UserResource
     * @param a_uid - User id
     * @param a_query - Lucene query string
     * @return an instance of java.lang.String
     */
    @Path("search")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String search(
        @DefaultValue("-1") @QueryParam("uid") int a_uid,
        @QueryParam("query") String a_query )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid >= 0 && a_query != null )
            m_api.searchIndex( a_uid, a_query, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST ); 

        return output.toString();
    }

    private final TitanAPI m_api = TitanAPI.getInstance();
}
