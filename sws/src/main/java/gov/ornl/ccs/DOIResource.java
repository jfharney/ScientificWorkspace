/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package gov.ornl.ccs;

import java.util.Iterator;
import java.util.HashSet;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONStringer;

/**
 * REST Web Service
 *
 * @author d3s
 */
@Path("")
public class DOIResource
{
    /**
     * Creates a new instance of DOIResource
     */
    public DOIResource()
    {
    }


    @Path("doi/new")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String postDOI( String a_payload ) throws Exception
    {
        // JSON payload contains everything...
        JSONObject data = new JSONObject( a_payload );
/*
        String[] fields = JSONObject.getNames( data );

        System.out.println( "JSON fields: " );
        for ( String f : fields )
        {
            System.out.println( f );
        }
*/
        long user_nid = data.getLong("creator_nid");

        JSONArray array = data.getJSONArray("nids");

        // nids array may not contain unique values
        HashSet<Long>  nids = new HashSet<>();
        for ( int i = 0; i < array.length(); i++ )
            nids.add(array.getLong(i));

        String title = data.getString("title");
        String desc = data.getString("description");
        String keywd = data.getString("keywords");

        String payload = "<records><record>";
        payload += "<title>" + title + "</title>";
        payload += "<description>" + desc + "</description>";
        payload += "<creators>" + data.getString("creator_name") + "</creators>";
        payload += "<creators_email>" + data.getString("creator_email") + "</creators_email>";
        payload += "<files>" + data.getString("files") + "</files>";
        payload += "<resources>" + data.getString("resources") + "</resources>";
        payload += "<keywords>" + keywd + "</keywords>";
        payload += "<language>" + data.getString("language") + "</language>";
        payload += "<sponsor_org>" + data.getString("sponsor_org") + "</sponsor_org>";
        payload += "</record></records>";

        JSONStringer output = new JSONStringer();

        m_api.postDOI( user_nid, nids, title, desc, keywd, payload, output );

        return output.toString();
    }

    /**
     * @param a_uid
     * @param a_properties
     * @return JSON output payload
     */
    @Path("dois")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getDOIs(
        @DefaultValue("-1") @QueryParam(Schema.UID) int a_uid )
    {
        JSONStringer output = new JSONStringer();

        if ( a_uid >= 0 )
            m_api.getDOIsByUID( a_uid, output );
        else // ERROR
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        return output.toString();
    }


    private final TitanAPI m_api = TitanAPI.getInstance();
}
