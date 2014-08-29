package gov.ornl.ccs;

import java.util.Iterator;
import java.util.Set;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashSet;
import java.net.URL;
import java.net.URLEncoder;
import javax.net.ssl.HttpsURLConnection;
import java.lang.Thread;
import java.io.DataOutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONObject;
import org.json.JSONStringer;

import com.thinkaurelius.titan.core.TitanFactory;
import com.thinkaurelius.titan.core.TitanGraph;
import com.thinkaurelius.titan.core.TitanIndexQuery.Result;
import com.thinkaurelius.titan.core.attribute.Cmp;
import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.util.ElementHelper;
import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.blueprints.Edge;
import com.tinkerpop.pipes.PipeFunction;
import com.tinkerpop.gremlin.java.GremlinPipeline;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class TitanAPI
{
    private static TitanAPI m_instance = null;
    private TitanGraph m_graph = null;
    // TODO This needs to be loaded from somewhere...
    private final String m_graph_cfg = "/etc/titan/titan.properties";

    private class UserInfo
    {
        public int                  m_uid = 0;
        public ArrayList<Integer>   m_gids = new ArrayList();
    }

    /**
     * Private constructor for TitanAPI singleton instance. Use getInstance() to access/create TitanAPI.
     */
    private TitanAPI()
    {
        System.out.println( String.format( "TitanAPI created on thread %d", Thread.currentThread().getId()));
        System.out.print("Loading graph from: " + m_graph_cfg );
        m_graph = TitanFactory.open( m_graph_cfg );
    }

    public static Boolean instantiated()
    {
        return m_instance != null;
    }

    /**
     * @return TitanAPI singleton instance.
     * Acquires instance pointer to TitanAPI singleton.
     */
    public static TitanAPI getInstance()
    {
        if ( m_instance == null )
            m_instance = new TitanAPI();

        return m_instance;
    }

    public TitanGraph getGraph()
    {
        return m_graph;
    }

    public void shutdown()
    {
        try
        {
            System.out.print("shutting down...");
            m_graph.shutdown();
            m_graph = null;
            System.gc();
            Thread.sleep( 5000 );
            System.out.println(" done.");
        }
        catch ( Exception e )
        {}
    }

    //=========== Node API ==========================================================================================

    /**
     * @param a_nid - Node ID of object to retrieve
     * @param a_properties - Coma-separated list of properties to retrieve
     * @param a_output - JSON serialization object to receive output
     * Retrieves a graph object (vertex) by Node ID.
     */
    public void getObjectByNID( long a_nid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Vertex vertex = m_graph.getVertex(a_nid);
        Set<String> props = parseRetrieveProperties( a_properties );
        convertVertexProperties( vertex, props, a_output, true );
    }


    /**
     * @param a_nid - Node ID of object to delete
     * Deletes a graph object (vertex) by Node ID.
     */
    public void deleteObjectByNID( long a_nid, int a_type )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Vertex vertex = m_graph.getVertex(a_nid);
        if ( vertex == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND );

        if ( vertex.getProperty(Schema.TYPE) != a_type )
            throw new WebApplicationException( Response.Status.CONFLICT );

        vertex.remove();
        m_graph.commit();

    }


    /**
     * @param a_tag_nid - Tag NID to query for associated nodes
     * @param a_properties - Node properties to retrieve
     * @param a_output - JSON output object
     * 
     * This method returns any nodes that are linked to the specified tag.
     */
    public void getNodesByTagNID( long a_tag_nid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertex( a_tag_nid )).in(Schema.META);

        a_output.array();

        while ( grem.hasNext() )
            processVertexResult( grem.next(), null, a_output );
            //convertVertexProperties( grem.next(), props, a_output, true );

        a_output.endArray();
    }

    //=========== USER API =============================================================================================

    /**
     * @param a_uid - User ID to query
     * @param a_properties - Node properties to retrieve
     * @param a_output - JSON output object
     * 
     * This method returns a user record given a user ID.
     */
    public void getUserByUID( int a_uid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices( Schema.UID, a_uid ).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output, true );
    }

    /**
     * @param a_uname - User name to query
     * @param a_properties - Node properties to retrieve
     * @param a_output - JSON output object
     * 
     * This method returns a user record given a user name (uname not full name).
     */
    public void getUserByUname( String a_uname, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices(Schema.UNAME, a_uname).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output, true );
    }

    public void getUsersByGID( int a_gid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( Schema.GID, a_gid )).out(Schema.MEMBER).has(Schema.TYPE, Schema.Type.USER.toInt());

        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output, true );

        a_output.endArray();
    }

    //=========== GROUP API ============================================================================================

    /**
     * @param a_gid
     * @param a_properties
     * @param a_output 
     */
    public void getGroupByGID( int a_gid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices( Schema.GID, a_gid ).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output, true );
    }

    /**
     * @param a_gname
     * @param a_properties
     * @param a_output 
     */
    public void getGroupByGname( String a_gname, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices( Schema.GNAME, a_gname).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output, true );
    }

    /**
     * @param a_uid
     * @param a_properties
     * @param a_output 
     */
    public void getGroupsByUID( int a_uid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( Schema.UID, a_uid )).in(Schema.MEMBER).has(Schema.TYPE, Schema.Type.GROUP.toInt());
        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output, true );

        a_output.endArray();
    }

    //=========== JOBS API =============================================================================================

    /**
     * @param a_jid
     * @param a_properties
     * @param a_output 
     */
    public void getJobByJID( int a_jid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices( Schema.JID, a_jid ).iterator();

        if ( it.hasNext() )
        {
            Vertex job = it.next();

            a_output.object();
            convertVertexProperties( job, props, a_output, false );

            // Inject owner property
            Iterator<Edge> e = job.getEdges(Direction.IN, Schema.PROD).iterator();
            if ( e.hasNext() )
            {
                int uid = e.next().getVertex(Direction.OUT).getProperty(Schema.UID);
                a_output.key("user").value( uid );
            }

            a_output.endObject();
        }
    }

    /**
     * @param a_uid
     * @param a_properties
     * @param a_output 
     */
    public void getJobs( int a_uid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices(Schema.UID, a_uid)).out(Schema.PROD).has(Schema.TYPE,Schema.Type.JOB.toInt());

        Vertex job;
        Iterator<Edge> e;
        int uid;

        a_output.array();

        while ( grem.hasNext() )
        {
            job = grem.next();

            a_output.object();

            convertVertexProperties( job, props, a_output, false );

            // Inject owner property
            e = job.getEdges(Direction.IN, Schema.PROD).iterator();
            if ( e.hasNext() )
            {
                uid = e.next().getVertex(Direction.OUT).getProperty(Schema.UID);
                a_output.key("user").value( uid );
            }

            a_output.endObject();
        }
        a_output.endArray();
    }

    //=========== APP API ==============================================================================================

    /**
     * @param a_aid
     * @param a_properties
     * @param a_output 
     */
	public void getAppByAID( int a_aid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices(Schema.AID, a_aid).iterator();

        Vertex app;

        if ( it.hasNext() )
        {
            app = it.next();
            a_output.object();

            convertVertexProperties( app, props, a_output, false );

            Iterator<Edge> e = app.getEdges(Direction.IN, Schema.COMP).iterator();
            if ( e.hasNext() )
            {
                int jid = e.next().getVertex(Direction.OUT).getProperty(Schema.JID);
                a_output.key("job").value( jid );
            }

            a_output.endObject();
        }
    }

    /**
     * @param a_jid
     * @param a_properties
     * @param a_output 
     */
    public void getAppsByJID( int a_jid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices(Schema.JID, a_jid )).out(Schema.COMP).has(Schema.TYPE,Schema.Type.APP.toInt());

        Vertex app;
        a_output.array();

        while ( grem.hasNext() )
        {
            app = grem.next();
            a_output.object();

            convertVertexProperties( app, props, a_output, false );
            a_output.key("job").value( a_jid );

            a_output.endObject();
        }

        a_output.endArray();
    }

    //=========== ASSOCIATION API =====================================================================================

    /**
     * @param a_uid
     * @param a_status
     * @param a_output 
     */
    public void getAssoc( int a_uid, int a_status, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        UserInfo user = getUserInfo( a_uid );
        Iterator<Edge> e;

        if ( a_status > -1 )
            e = m_graph.query().has(Schema.STATUS,Cmp.EQUAL,a_status).has(Schema.XUID,a_uid).edges().iterator();
        else
            e = m_graph.query().has(Schema.STATUS).has(Schema.XUID,a_uid).edges().iterator();

        Edge edge;

        a_output.array();

        while( e.hasNext())
        {
            edge = e.next();
            a_output.object();
            a_output.key("type").value(edge.getLabel());
            a_output.key("status").value(a_status);
            a_output.key("out");
            processVertexResult( edge.getVertex(Direction.OUT), user, a_output );
            a_output.key("in");
            processVertexResult( edge.getVertex(Direction.IN), user, a_output );
            a_output.endObject();
        }

        a_output.endArray();
    }

    /**
     * @param a_uid
     * @param a_nid
     * @param a_status
     * @param a_output 
     */
    public void getAssocFromNode( int a_uid, long a_nid, int a_status, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        UserInfo user = getUserInfo( a_uid );
        GremlinPipeline grem = new GremlinPipeline( m_graph.getVertex(a_nid)).bothE(Schema.CTXT);

        if ( a_status > -1 )
            grem = grem.has(Schema.STATUS,Cmp.EQUAL,a_status).has(Schema.XUID,a_uid);
        else
            grem = grem.has(Schema.STATUS).has(Schema.XUID,a_uid);

        Iterator<Edge> e = grem.iterator();
        Edge edge;

        a_output.array();

        while( e.hasNext())
        {
            edge = e.next();
            a_output.object();
            a_output.key("type").value(edge.getLabel());
            a_output.key("status").value(a_status);
            a_output.key("out");
            processVertexResult( edge.getVertex(Direction.OUT), user, a_output );
            a_output.key("in");
            processVertexResult( edge.getVertex(Direction.IN), user, a_output );
            a_output.endObject();
        }

        a_output.endArray();
    }

    /**
     * @param a_uid
     * @param a_status
     * @param a_out_nid
     * @param a_in_nid
     * @param a_output 
     */
    public void putAssoc( int a_uid, int a_status, long a_out_nid, long a_in_nid, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        UserInfo user = getUserInfo( a_uid );
        GremlinPipeline grem = new GremlinPipeline(m_graph.getVertex(a_out_nid)).outE(Schema.CTXT).has(Schema.STATUS).has(Schema.XUID,a_uid);
        Edge e;

        while ( grem.hasNext() )
        {
            e = (Edge)grem.next();
            if ( a_in_nid == (long)e.getVertex(Direction.IN).getId() )
            {
                ElementHelper.setProperties( e, Schema.STATUS, a_status, Schema.UID, a_uid );
                m_graph.commit();

                a_output.object();
                a_output.key("type").value(e.getLabel());
                a_output.key("status").value(a_status);
                a_output.key("out");
                processVertexResult( e.getVertex(Direction.OUT), user, a_output );
                a_output.key("in");
                processVertexResult( e.getVertex(Direction.IN), user, a_output );
                a_output.endObject();
                return;
            }
        }
        throw new WebApplicationException( Response.Status.NOT_FOUND ); 
    }

    /**
     * @param a_uid
     * @param a_out_nid
     * @param a_in_nid
     * @param a_output 
     */
    public void deleteAssoc( int a_uid, long a_out_nid, long a_in_nid, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        GremlinPipeline grem = new GremlinPipeline(m_graph.getVertex(a_out_nid)).outE(Schema.CTXT).has(Schema.XUID,a_uid);
        Edge e;

        while ( grem.hasNext() )
        {
            e = (Edge)grem.next();
            if ( a_in_nid == (long)e.getVertex(Direction.IN).getId() )
            {
                e.remove();
                m_graph.commit();
                return;
            }
        }

        throw new WebApplicationException( Response.Status.NOT_FOUND ); 

    }

    //=========== FILES API ===========================================================================================

    /**
     * @param a_path - Absolute path (pipe-separated) to the file/directory to retrieve
     * @param a_uid - User ID of accessing user
     * @param a_list - Flag to request directory listing (if path is to a directory)
     * @param a_properties - Node properties to retrieve
     * @param a_off - Offset into result set (for paging)
     * @param a_len - Length of result set (for paging)
     * @param a_output - JSON output object
     * 
     * This method retrieves the file or directory located at the specified path. If the path
     * points to a directory and the 'list' flag is present, the contents of the directory will
     * also be returned. Only files/directories that the accessing user has permission to view
     * will be returned (by posix uid, gid). If the path traverses directories that the accessing
     * user does not have permissions to, then nothing will be returned. For large directory
     * listings, the "off" and "len" parameters may be used to page results as needed.
     */
    public void getFilesByPath( String a_path, int a_uid, Boolean a_list, String a_properties, int a_off, int a_len, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        if ( a_path.length() == 0 || a_path.charAt(0) != '|' )
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        m_graph.rollback();

        UserInfo user = getUserInfo( a_uid );

        String[] path = a_path.split("\\s*\\|\\s*");

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline grem = new GremlinPipeline( m_graph.getVertices( "fpath", "root" ));

        DirectoryAccessFilter access = new DirectoryAccessFilter( user );

        for ( int p = 1; p < path.length - 1; p++ )
            grem = grem.out(Schema.COMP).has(Schema.NAME,path[p]).filter( access );

        if ( path.length > 0 )
            grem = grem.out(Schema.COMP).has(Schema.NAME,path[path.length - 1]);

        processFileQuery( grem, a_list, props, access, a_off, a_len, a_output );
    }

    /**
     * @param a_nid - Node ID of file or directory to retrieve
     * @param a_uid - User ID of access user
     * @param a_list - Flag to request directory listing (if path is to a directory)
     * @param a_properties - Node properties to retrieve
     * @param a_off - Offset into result set (for paging)
     * @param a_len - Length of result set (for paging)
     * @param a_output - JSON output object
     * 
     * This method retrieves the file or directory identified by the specified node id. If the path
     * points to a directory and the 'list' flag is present, the contents of the directory will
     * also be returned. Only files/directories that the accessing user has permission to view
     * will be returned (by posix uid, gid). (No access checking is performed for the node specified -
     * only for files in the directory when a listing is performed.) For large directory listings,
     * the "off" and "len" parameters may be used to page results as needed.
     */
    public void getFilesByPath( long a_nid, int a_uid, Boolean a_list, String a_properties, int a_off, int a_len, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        UserInfo user = getUserInfo( a_uid );

        DirectoryAccessFilter access = new DirectoryAccessFilter( user );
        GremlinPipeline grem = new GremlinPipeline( m_graph.getVertex( a_nid ));

        processFileQuery( grem, a_list, props, access, a_off, a_len, a_output );
    }

    /**
     * @param a_grem - Gremlin pipe pointing to initial file or directory
     * @param a_list - Flag to request directory listing (if path is to a directory)
     * @param a_props - Set of node properties to retrieve (or null)
     * @param a_off - Offset into result set (for paging)
     * @param a_len - Length of result set (for paging)
     * @param a_output - JSON output object
     * 
     * This private method implements the processing of a file or directory node for
     * file retrieval.
     */
    private void processFileQuery( GremlinPipeline a_grem, Boolean a_list, Set<String> a_props, DirectoryAccessFilter a_access, int a_off, int a_len, JSONStringer a_output )
    {
        if ( a_list )
        {
            // Return file/directory and listing of contents (if any)

            Vertex[] vertices = {null};
            a_grem = a_grem.sideEffect( new VertexGrabber( vertices ));

            // Get children of this vertex
            a_grem = a_grem.out(Schema.COMP).filter( a_access );
            if ( a_off > -1 && a_len > 0 )
            {
                a_grem = a_grem.range( a_off, a_off + a_len - 1 );
            }

            // Execute query
            a_grem.hasNext();

            // Was the parent (path) found?
            if ( vertices[0] != null )
            {
                a_output.object();

                convertVertexProperties( vertices[0], a_props, a_output, false );

                if ( a_grem.hasNext() )
                {
                    a_output.key("files");
                    a_output.array();

                    while ( a_grem.hasNext() )
                        convertVertexProperties( (Vertex)a_grem.next(), a_props, a_output, true );

                    a_output.endArray();
                }
                a_output.endObject();
            }
        }
        else
        {
            // Return file/directory only
            if ( a_grem.hasNext())
            {
                convertVertexProperties( (Vertex)a_grem.next(), a_props, a_output, true );
            }
        }
    }

    //=========== TAG API ==============================================================================================

    /**
     * @param a_uid
     * @param a_owned
     * @param a_shared
     * @param a_shared_uids
     * @param a_public
     * @param a_public_uids
     * @param a_properties
     * @param a_output 
     */
    public void getTags( int a_uid, boolean a_owned, boolean a_shared, String a_shared_uids, boolean a_public, String a_public_uids, String a_name, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<Vertex> results = new HashSet();
        Set<String> props = parseRetrieveProperties( a_properties );

        if ( a_owned )
        {
            GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices(Schema.UID, a_uid )).out(Schema.ASSET).has(Schema.TYPE,Schema.Type.TAG.toInt());

            if ( a_name != null )
                grem.has(Schema.NAME, Cmp.EQUAL, a_name);

            // Store results
            grem.fill(results);
        }

        if ( a_shared )
        {
            // Collect ~other~ user's tags that are shared with calling user

            if ( a_shared_uids != null )
            {
                GremlinPipeline<Vertex,Vertex> grem;
                ArrayList<Integer> uids = parseIntegerCSV( a_shared_uids );
                for ( int uid : uids )
                {
                    // Skip owner if it's in the list (can't share a tag with self)
                    if ( uid == a_uid )
                        continue;

                    // Start from specified users and navigate to shared tags that calling user has access to
                    // No need to check tag access since "member" edges are only present when shared
                    // Also no need to check type==user for end-points since uid is only present on user nodes
                    grem = new GremlinPipeline( m_graph.getVertices(Schema.UID, uid )).out(Schema.ASSET).has(Schema.TYPE,Schema.Type.TAG.toInt());

                    if ( a_name != null )
                        grem.has(Schema.NAME, a_name);

                    grem.as("x").copySplit(
                        new GremlinPipeline().out(Schema.MEMBER).has(Schema.UID,a_uid).back("x"),
                        new GremlinPipeline().out(Schema.MEMBER).out(Schema.MEMBER).has(Schema.UID,a_uid).back("x")
                        ).fairMerge().dedup();

                    Set tmp_results = new HashSet();
                    results.addAll( grem.fill( tmp_results ));
                }
            }
            else
            {
                // Start from user, look for user and group membership to shared tags
                GremlinPipeline<Vertex,Vertex> grem;
                if ( a_name != null )
                {
                    grem = new GremlinPipeline(m_graph.getVertices(Schema.UID, a_uid)).copySplit(
                        new GremlinPipeline().in(Schema.MEMBER).in(Schema.MEMBER).as("x").has(Schema.TYPE,Schema.Type.TAG.toInt()).has(Schema.NAME, a_name).in(Schema.ASSET).hasNot(Schema.UID,a_uid).back("x"),
                        new GremlinPipeline().in(Schema.MEMBER).has(Schema.TYPE,Schema.Type.TAG.toInt()).has(Schema.NAME, a_name)
                        ).fairMerge().dedup();
                }
                else
                {
                    grem = new GremlinPipeline(m_graph.getVertices(Schema.UID, a_uid)).copySplit(
                        new GremlinPipeline().in(Schema.MEMBER).in(Schema.MEMBER).as("x").has(Schema.TYPE,Schema.Type.TAG.toInt()).in(Schema.ASSET).hasNot(Schema.UID,a_uid).back("x"),
                        new GremlinPipeline().in(Schema.MEMBER).has(Schema.TYPE,Schema.Type.TAG.toInt())
                        ).fairMerge().dedup();
                }

                // Add results (will induce duplicates)
                Set tmp_results = new HashSet();
                results.addAll( grem.fill( tmp_results ));
            }
        }

        if ( a_public )
        {
            // Collect ~other~ user's tags that are public

            if ( a_public_uids != null )
            {
                GremlinPipeline<Vertex,Vertex> grem;
                ArrayList<Integer> uids = parseIntegerCSV( a_public_uids );
                for ( int uid : uids )
                {
                    // Skip owner if it's in the list
                    if ( uid == a_uid )
                        continue;

                    // Start from specified users and navigate to public tags
                    grem = new GremlinPipeline( m_graph.getVertices(Schema.UID, uid)).out(Schema.ASSET).has(Schema.TYPE,Schema.Type.TAG.toInt()).has(Schema.ACCESS,Schema.Access.PUBLIC.toInt());

                    if ( a_name != null )
                        grem.has(Schema.NAME, a_name);

                    Set tmp_results = new HashSet();
                    results.addAll( grem.fill( tmp_results ));
                }
            }
            else
            {
                // Use index to find all public tags...
                Iterator<Vertex> it = m_graph.query().has(Schema.TYPE,Schema.Type.TAG.toInt()).has(Schema.ACCESS, Schema.Access.PUBLIC.toInt()).vertices().iterator();
                while ( it.hasNext())
                    results.add( it.next() );
            }
        }

        a_output.array();
        Iterator<Edge> e;
        int uid;
        boolean acl_uids = true;
        boolean acl_gids = true;

        // Handle ACL retrieval properties
        if ( a_properties != null )
        {
            if ( !a_properties.contains(Schema.ACLUIDS))
                acl_uids = false;
            if ( !a_properties.contains(Schema.ACLGIDS))
                acl_gids = false;
        }

        for ( Vertex v : results )
        {
            a_output.object();

            convertVertexProperties( v, props, a_output, false );

            e = v.getEdges(Direction.IN,Schema.ASSET).iterator();
            if ( e.hasNext() )
            {
                uid = e.next().getVertex(Direction.OUT).getProperty(Schema.UID);
                a_output.key("owner").value( uid );

                // Only add ACLs for owned tags
                if ( uid == a_uid )
                    addTagACLs( v, acl_uids, acl_gids, a_output );
            }

            a_output.endObject();
        }

        a_output.endArray();
    }

    /**
     * @param a_nid
     * @param a_uid
     * @param a_properties
     * @param a_output 
     */
    public void getTagsFromNode( long a_nid, int a_uid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Vertex vertex = m_graph.getVertex(a_nid);
        if ( vertex == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND ); 

        Set<String> props = parseRetrieveProperties( a_properties );

        // Return all tags that are:
        //  public
        //  owned by uid
        //  shared and uid is in user or group ACL
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( vertex ).out(Schema.META).as("x").copySplit(
            new GremlinPipeline().has(Schema.ACCESS,2), // Public
            new GremlinPipeline().in(Schema.ASSET).has(Schema.UID,a_uid).back("x"), // Owned by uid
            new GremlinPipeline().out(Schema.MEMBER).has(Schema.UID,a_uid).back("x"), // User ACL
            new GremlinPipeline().out(Schema.MEMBER).out(Schema.MEMBER).has(Schema.UID,a_uid).back("x") // Group ACL
            ).fairMerge().dedup();

        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output, true );

        a_output.endArray();
    }

    /**
     * @param a_uid
     * @param a_tag
     * @param a_desc
     * @param a_access
     * @param a_acl_uids
     * @param a_acl_gids
     * @param a_output 
     */
    public void postTag( int a_uid, String a_tag, String a_desc, int a_access, String a_acl_uids, String a_acl_gids, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        // Validate / prepare inputs
        a_tag = a_tag.trim();
        if ( a_desc != null )
            a_desc = a_desc.trim();

        if ( invalidAccess( a_access ) || a_tag.length() == 0 )
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        // Make sure UID is valid
        Iterator<Vertex> it = m_graph.getVertices(Schema.UID, a_uid).iterator();

        if ( it.hasNext() )
        {
            // Make sure tag does not already exist
            Vertex user = it.next();
            GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline(user).out(Schema.ASSET).has(Schema.TYPE,Schema.Type.TAG.toInt()).has(Schema.NAME,a_tag);

            if ( grem.hasNext() )
                throw new WebApplicationException( Response.Status.CONFLICT );

            // For shared tags, parse ACLs
            // Do this before creating vertex to catch any errors
            ArrayList<Integer> uids = null;
            ArrayList<Integer> gids = null;
            if ( a_access == 1 )
            {
                uids = parseIntegerCSV( a_acl_uids );
                gids = parseIntegerCSV( a_acl_gids );
            }

            try
            {
                Vertex tag = m_graph.addVertex(null);
                ElementHelper.setProperties( tag, Schema.TYPE, Schema.Type.TAG.toInt(), Schema.NAME, a_tag,
                        Schema.DESC, a_desc!=null?a_desc:"", Schema.ACCESS, a_access );

                user.addEdge(Schema.ASSET, tag );

                // Add edges to ACL entities
                if ( a_access == 1 )
                {
                    Vertex member;
                    for ( int uid : uids )
                    {
                        it = m_graph.getVertices(Schema.UID,uid).iterator();
                        if ( !it.hasNext() )
                            throw new IllegalStateException("Invalid uid in ACL");
                        member = it.next();
                        tag.addEdge(Schema.MEMBER, member );
                        ArrayList<Vertex> tags = new ArrayList<>();
                        tags.add(tag);
                        newUserEvent( member, tags, Schema.Event.OTHER_SHARED_TAG );
                    }
                    for ( int gid : gids )
                    {
                        it = m_graph.getVertices(Schema.GID,gid).iterator();
                        if ( !it.hasNext() )
                            throw new IllegalStateException("Invalid gid in ACL");
                        member = it.next();
                        tag.addEdge(Schema.MEMBER, member );
                        ArrayList<Vertex> tags = new ArrayList<>();
                        tags.add(tag);
                        newGroupEvent( member, tags, Schema.Event.OTHER_SHARED_GROUP_TAG );
                    }
                }

                a_output.object();

                convertVertexProperties( tag, null, a_output, false );

                if ( a_acl_uids != null )
                    a_output.key(Schema.ACLUIDS).value( a_acl_uids );

                if ( a_acl_gids != null )
                    a_output.key(Schema.ACLGIDS).value( a_acl_gids );

                a_output.endObject();

                m_graph.commit();
            }
            catch( Exception e )
            {
                m_graph.rollback();
                throw e;
            }
        }
        else
            throw new WebApplicationException( Response.Status.NOT_FOUND ); 
    }


    // TODO - Need to prevent a tag name from being redefined as an already existing tag

    /**
     * @param a_nid
     * @param a_tag
     * @param a_desc
     * @param a_access
     * @param a_acl_uids
     * @param a_acl_gids
     * @param a_output 
     */
    public void putTag( long a_nid, String a_tag, String a_desc, int a_access, String a_acl_uids, String a_acl_gids, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        // Validate / prepare inputs
        a_tag = a_tag.trim();
        if ( a_desc != null )
            a_desc = a_desc.trim();

        if ( invalidAccess( a_access ) || a_tag.length() == 0 )
            throw new WebApplicationException( Response.Status.BAD_REQUEST );

        Vertex tag = m_graph.getVertex( a_nid );

        if ( tag != null )
        {
            if ( tag.getProperty(Schema.TYPE) == Schema.Type.TAG.toInt())
            {
                // For shared tags, parse ACLs
                // Do this before changing vertex to catch any errors
                ArrayList<Integer> uids = null;
                ArrayList<Integer> gids = null;
                if ( a_access == 1 )
                {
                    uids = parseIntegerCSV( a_acl_uids );
                    gids = parseIntegerCSV( a_acl_gids );
                }

                try
                {
                    Edge e;
                    Vertex member;
                    Iterator<Vertex> it;
                    ArrayList<Integer>  old_uids = new ArrayList<>();
                    ArrayList<Integer>  old_gids = new ArrayList<>();

                    // Remove all ACLs (outgoing member edges)
                    GremlinPipeline<Vertex,Edge> grem = new GremlinPipeline( tag ).outE(Schema.MEMBER);

                    while ( grem.hasNext() )
                    {
                        e = grem.next();

                        // Remember who was already shared in order to send appropriate shared/revoked events later
                        member = e.getVertex(Direction.IN);
                        if ( member.getProperty(Schema.TYPE) == Schema.Type.USER.toInt() )
                            old_uids.add( (Integer)member.getProperty( Schema.UID ));
                        else
                            old_gids.add( (Integer)member.getProperty( Schema.GID ));

                        e.remove();
                    }

                    // Update tag vertex with new properties
                    ElementHelper.setProperties( tag, Schema.TYPE, Schema.Type.TAG.toInt(), Schema.NAME, a_tag,
                            Schema.DESC, a_desc!=null?a_desc:"", Schema.ACCESS, a_access );

                    ArrayList<Vertex> ev_links = new ArrayList<>();
                    ev_links.add( tag );

                    // Add edges to ACL entities
                    if ( a_access == 1 )
                    {
                        // Update ACL edges
                        // Calc diff between old and new ACLs and send appropriate events
                        for ( int uid : uids )
                        {
                            it = m_graph.getVertices(Schema.UID,uid).iterator();
                            if ( !it.hasNext() )
                                throw new IllegalStateException("Invalid uid in ACL");
                            member = it.next();
                            tag.addEdge(Schema.MEMBER, member );

                            if ( !old_uids.contains( uid ))
                            {
                                newUserEvent( member, ev_links, Schema.Event.OTHER_SHARED_TAG );
                            }
                        }
                        for ( int gid : gids )
                        {
                            it = m_graph.getVertices(Schema.GID,gid).iterator();
                            if ( !it.hasNext() )
                                throw new IllegalStateException("Invalid gid in ACL");

                            member = it.next();
                            tag.addEdge(Schema.MEMBER, member );

                            if ( !old_gids.contains( gid ))
                            {
                                newGroupEvent( member, ev_links, Schema.Event.OTHER_SHARED_GROUP_TAG );
                            }
                        }
                    }

                    // Send shared tag revoked events, if needed
                    for ( int uid : old_uids )
                    {
                        if ( uids == null || !uids.contains( uid ))
                        {
                            newUserEvent( m_graph.getVertices(Schema.UID, uid).iterator().next(), ev_links, Schema.Event.OTHER_REVOKED_TAG );
                        }
                    }

                    for ( int gid : old_gids )
                    {
                        if ( gids == null || !gids.contains( gid ))
                        {
                            newGroupEvent( m_graph.getVertices(Schema.GID, gid).iterator().next(), ev_links, Schema.Event.OTHER_REVOKED_GROUP_TAG );
                        }
                    }

                    a_output.object();

                    convertVertexProperties( tag, null, a_output, false );

                    if ( a_acl_uids != null )
                        a_output.key(Schema.ACLUIDS).value( a_acl_uids );

                    if ( a_acl_gids != null )
                        a_output.key(Schema.ACLGIDS).value( a_acl_gids );

                    a_output.endObject();
                    m_graph.commit();
                }
                catch ( Exception e )
                {
                    m_graph.rollback();
                    throw e;
                }
            }
            else
                throw new WebApplicationException( Response.Status.BAD_REQUEST ); 
        }
        else
            throw new WebApplicationException( Response.Status.NOT_FOUND ); 
    }

    /**
     * @param a_tag
     * @param a_add_uids
     * @param a_add_gids
     * @param a_output
     */
    private void addTagACLs( Vertex a_tag, boolean a_add_uids, boolean a_add_gids, JSONStringer a_output )
    {
        // Only shared tags hav ACLs
        if ( !a_tag.getProperty(Schema.ACCESS).equals( 1 ))
            return;

        if ( !a_add_uids && !a_add_gids )
            return;

        String acl_uids = "";
        String acl_gids = "";

        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( a_tag ).out(Schema.MEMBER);
        Vertex member;
        while ( grem.hasNext() )
        {
            member = grem.next();
            if ( member.getProperty(Schema.TYPE) == Schema.Type.USER.toInt() && a_add_uids )
            {
                if ( acl_uids.length() > 0 )
                    acl_uids += ",";
                acl_uids += member.getProperty(Schema.UID);
            }
            else if ( a_add_gids )
            {
                if ( acl_gids.length() > 0 )
                    acl_gids += ",";
                acl_gids += member.getProperty(Schema.GID);
            }
        }

        if ( acl_uids.length() > 0 && a_add_uids )
            a_output.key(Schema.ACLUIDS).value(acl_uids);

        if ( acl_gids.length() > 0 && a_add_gids )
            a_output.key(Schema.ACLGIDS).value(acl_gids);
    }

    //=========== EVENT API ============================================================================================

    /**
     * @param a_uid
     * @param a_output
     */
    public void getEvents( int a_uid, int a_status, long a_ctime, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        // Create pipe to ALL users events
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( Schema.UID, a_uid )).out(Schema.META).has(Schema.TYPE, Schema.Type.EVENT.toInt());

        // Apply status filter, if set
        if ( a_status > -1 )
            grem.has(Schema.STATUS,a_status);

        // Apply time filter, if set
        if ( a_ctime > -1 )
            grem.has(Schema.CTIME, Cmp.GREATER_THAN_EQUAL, a_ctime);

        Vertex event;
        Iterator<Edge> e;

        a_output.array();

        while ( grem.hasNext() )
        {
            event = grem.next();
            //convertVertexProperties( grem.next(), null, a_output, true );
            a_output.object();

            a_output.key(Schema.NID).value( event.getId() );

            for ( String k : event.getPropertyKeys() )
                a_output.key(k).value( event.getProperty(k) );

            a_output.key("context").array();

            e = event.getEdges( Direction.OUT, Schema.CTXT ).iterator();
            while ( e.hasNext() )
                processVertexResult( e.next().getVertex(Direction.IN), null, a_output );

            a_output.endArray();
            a_output.endObject();
        }

        a_output.endArray();
    }

    /**
     * @param a_nid
     * @param a_status
     * @param a_output
     */
    public void putEvent( long a_nid, int a_status, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Vertex vertex = m_graph.getVertex( a_nid );
        if ( vertex == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND );

        if ( vertex.getProperty(Schema.TYPE) != Schema.Type.EVENT.toInt() )
            throw new WebApplicationException( Response.Status.CONFLICT );

        vertex.setProperty( Schema.STATUS, a_status );
        m_graph.commit();
    }


    private void newUserEvent( Vertex a_user, ArrayList<Vertex> a_vertices, Schema.Event a_event )
    {
        // Create new event vertex
        Vertex event = m_graph.addVertex(null);
        ElementHelper.setProperties( event, Schema.TYPE, Schema.Type.EVENT.toInt(), Schema.SUBTYPE, a_event.toInt(),
                Schema.DESC, a_event.describe(), Schema.STATUS, Schema.Status.REVIEW.toInt(),
                Schema.CTIME, System.currentTimeMillis()/1000 );

        // Create edges between event and user
        a_user.addEdge( Schema.META, event );

        // Create edges between event and associated vertices
        for ( Vertex vert : a_vertices )
            event.addEdge( Schema.CTXT, vert );
    }

    private void newGroupEvent( Vertex a_group, ArrayList<Vertex> a_vertices, Schema.Event a_event )
    {
        // Get members of group
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( a_group ).out(Schema.MEMBER).has(Schema.TYPE, Schema.Type.USER.toInt());

        while ( grem.hasNext() )
        {
            // Get all members of group
            newUserEvent( grem.next(), a_vertices, a_event );
        }
    }

    //=========== LINKING METHODS ======================================================================================

    /**
     * @param a_src_nid
     * @param a_dest_nid
     * @param a_label
     */
    public void linkNodes( long a_src_nid, long a_dest_nid, String a_label )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Vertex src = m_graph.getVertex(a_src_nid);
        Vertex dest = m_graph.getVertex(a_dest_nid);

        if ( src == null || dest == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND ); 

        // Make sure there isn't a descriptor edge already
        Iterator<Edge> it = src.getEdges( Direction.OUT, a_label ).iterator();
        while ( it.hasNext() )
            if ( it.next().getVertex(Direction.IN) == dest )
                throw new WebApplicationException( Response.Status.CONFLICT ); 

        src.addEdge( a_label, dest );
        m_graph.commit();
    }

    /**
     * @param a_src_nid
     * @param a_dest_nid
     * @param a_label 
     */
    public void unlinkNodes( long a_src_nid, long a_dest_nid, String a_label )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Vertex src = m_graph.getVertex(a_src_nid);
        Vertex dest = m_graph.getVertex(a_dest_nid);

        if ( src == null || dest == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND );

        Iterator<Edge> it = src.getEdges(Direction.OUT, a_label ).iterator();
        while ( it.hasNext() )
        {
            Edge e = it.next();
            if ( e.getVertex(Direction.IN) == dest )
            {
                e.remove();
                m_graph.commit();
                return;
            }
        }

        throw new WebApplicationException( Response.Status.NOT_FOUND ); 
    }

    //=========== SEARCH METHODS =======================================================================================

    /**
     * @param a_uid - User ID of accessing user
     * @param a_query - Lucene query string
     * @param a_output - JSON output object
     * 
     * This method executes a generic lucene query and post-processed the results to enforce
     * use-access rules for tags and files. Other object types are unrestricted. For tags,
     * ACL lists are injected if calling user is owner. For files, path is calculated and
     * injected.
     */
    public void searchIndex( int a_uid, String a_query, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        UserInfo user = getUserInfo( a_uid );

        System.out.println( "Search: " + a_query );

        Iterable<Result<Vertex> > results = m_graph.indexQuery("search", a_query).vertices();

        a_output.array();

        long startTime = System.nanoTime();
        Integer len = 0;

        for ( Result<Vertex> res : results )
        {
            ++len;
            //System.out.println( "id: " + res.getElement().getId());
            processVertexResult( res.getElement(), user, a_output );
        }

        a_output.endArray();

        long endTime = System.nanoTime();
        double duration = (endTime - startTime)*1e-9;

        System.out.println( String.format( "%d results processed in %g sec, or %g res/sec", len, duration, len/duration ));
    }

    //=========== DOI METHODS ==========================================================================================

    public void postDOI( long a_user_nid, HashSet<Long> a_dep_nids, String a_title, String a_desc, String a_keywords, String a_payload, JSONStringer a_output ) throws Exception
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        // Get user from creator_nid
        Vertex user = m_graph.getVertex( a_user_nid );
        if ( user == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND );

        HashSet<Vertex> deps = new HashSet<>();
        for ( Long nid : a_dep_nids )
        {
            Vertex dep = m_graph.getVertex( nid.longValue() );
            if ( dep == null )
                throw new WebApplicationException( Response.Status.NOT_FOUND );
            deps.add( dep );
        }

        // Ask DOI service to create new DOI, if this succeeds, update graph
        // If it fails, an exception will be thrown
        String doi = submitDOI( a_payload );

        // Create DOI vertex
        Vertex doi_vertex = m_graph.addVertex(null);

        ElementHelper.setProperties( doi_vertex, Schema.TYPE, Schema.Type.DOI.toInt(), Schema.NAME, doi,
            Schema.TITLE, a_title, Schema.DESC, a_desc, Schema.KEYWORDS, a_keywords,
            Schema.CTIME, System.currentTimeMillis()/1000 );

        user.addEdge(Schema.ASSET, doi_vertex );
        for ( Vertex dep : deps )
            doi_vertex.addEdge( Schema.CTXT, dep );

        m_graph.commit();

        a_output.object();
        a_output.key("doi").value(doi);
        a_output.endObject();
    }

    private String submitDOI( String a_payload ) throws Exception
    {
        // TODO Don't hard-code URL to doi service
        URL url = new URL("https://doi1.ccs.ornl.gov/doi/new/");
        HttpsURLConnection con = (HttpsURLConnection)url.openConnection();

        con.setRequestMethod( "POST" );
        con.setRequestProperty( "Content-Type", "text/xml" );
        con.setRequestProperty( "Content-Length", String.valueOf(a_payload.length()) );
        con.setDoInput(true);
        con.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes( a_payload );
        wr.flush();
        wr.close();

        int responseCode = con.getResponseCode();

        if ( responseCode != 200 )
            throw new WebApplicationException( responseCode );

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String doi = in.readLine();
        if ( doi == null )
            throw new WebApplicationException( Response.Status.INTERNAL_SERVER_ERROR );

        in.close();

        return doi;
    }

    public void getDOIsByUID( int a_uid, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices(Schema.UID, a_uid)).out(Schema.ASSET).has(Schema.TYPE,Schema.Type.DOI.toInt());

        Vertex doi;
        Iterator<Edge> e;

        a_output.array();

        while ( grem.hasNext() )
        {
            doi = grem.next();

            a_output.object();

            convertVertexProperties( doi, null, a_output, false );
            a_output.key("context").array();

            // Add linked context objects
            e = doi.getEdges(Direction.OUT, Schema.CTXT).iterator();
            if ( e.hasNext() )
                processVertexResult( e.next().getVertex(Direction.IN), null, a_output );

            a_output.endArray();
            a_output.endObject();
        }
        a_output.endArray();
    }


    //=========== UTILITY METHODS ======================================================================================

    /**
     * @param a_access
     * @return 
     */
    private Boolean invalidAccess( int a_access )
    {
        return a_access < 0 || a_access > 2;
    }

    /**
     * @param a_properties
     * @return 
     */
    private Set<String> parseRetrieveProperties( String a_properties )
    {
        if ( a_properties == null )
            return null;

        String temp = a_properties.trim();
        if ( temp.length() > 0 && !temp.equalsIgnoreCase("all") )
        {
            return new HashSet(Arrays.asList(a_properties.split("\\s*,\\s*")));
        }
        else
            return null;
    }

    /**
     * @param a_list
     * @return 
     */
    //private Integer[] parseIntegerCSV( String a_list )
    private ArrayList<Integer> parseIntegerCSV( String a_list )
    {
        try
        {
            if ( a_list != null )
            {
                String[] str_vals = a_list.split("\\s*,\\s*");

                //Integer[] results = new Integer[str_vals.length];
                ArrayList<Integer> results = new ArrayList<>(str_vals.length);

                for ( int i = 0; i < str_vals.length; i++ )
                    results.add( Integer.parseInt(str_vals[i]));
//                    results[i] = Integer.parseInt(str_vals[i]);

                return results;
            }
        }
        catch ( NumberFormatException e )
        {
            throw new IllegalStateException("Invalid numeric list paramter");
        }

        //return new Integer[0];
        return new ArrayList<Integer>();
    }

    /**
     * @param a_vertex
     * @param a_props
     * @param a_output
     * @param a_def_object 
     */
    private void convertVertexProperties( Vertex a_vertex, Set<String> a_props, JSONStringer a_output, boolean a_def_object )
    {
        Set<String> keys = a_vertex.getPropertyKeys();
        if ( a_props != null )
            keys.retainAll(a_props);

        if ( a_def_object )
            a_output.object();

        a_output.key(Schema.NID).value( a_vertex.getId() );

        for ( String k : keys )
            a_output.key(k).value( a_vertex.getProperty(k) );

        if ( a_def_object )
            a_output.endObject();
    }

    /**
     * @param a_uid
     * @return 
     */
    private UserInfo getUserInfo( int a_uid )
    {
        UserInfo ui = new UserInfo();
        ui.m_uid = a_uid;

        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices(Schema.UID, a_uid )).in(Schema.MEMBER)
                .has(Schema.TYPE, Schema.Type.GROUP.toInt());

        while ( grem.hasNext() )
            ui.m_gids.add( (Integer)grem.next().getProperty(Schema.GID));

        return ui;
    }

    /**
     * @param a_tag - Tag vertex object to check
     * @param a_uid - User requesting access to tag
     * @return true is user has access to tag; false otherwise
     * 
     * This method checks if the specified user has access to the provided tag vertex. Access
     * is granted if tag is owned by user, if tag has public access, if tag is shared with
     * user, or if tag is shared with a group that user is a member of.
     */
    private boolean hasTagAccess( Vertex a_tag, int a_uid )
    {
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( a_tag ).as("x").copySplit(
            new GremlinPipeline().has(Schema.ACCESS,Schema.Access.PUBLIC), // Public
            new GremlinPipeline().in(Schema.ASSET).has(Schema.UID, a_uid).back("x"), // Owned by uid
            new GremlinPipeline().out(Schema.MEMBER).has(Schema.UID, a_uid).back("x"), // User ACL
            new GremlinPipeline().out(Schema.MEMBER).out(Schema.MEMBER).has(Schema.UID,a_uid).back("x") // Group ACL
            ).fairMerge().dedup();

        if ( grem.hasNext() )
            return true;
        else
            return false;
    }

    /**
     * @param a_file
     * @param a_user
     * @return 
     */
    private String hasFileAccess( Vertex a_file, UserInfo a_user ) // int a_uid, List<Integer> a_gids )
    {
        Iterator<Edge> e = a_file.getEdges(Direction.IN, Schema.COMP).iterator();
        if ( e.hasNext() )
        {
            Vertex parent = e.next().getVertex(Direction.OUT);
            boolean result = false;

            if ( a_user == null || a_user.m_uid == 0 )
                result = true;
            else
            {
                // Determine role: user, group, or other
                Integer uid = parent.getProperty(Schema.XUID);
                Integer gid = parent.getProperty(Schema.XGID);
                Integer mode = parent.getProperty(Schema.FMODE);

                if ( uid != null && gid != null )
                {
                    if ( uid.equals( a_user.m_uid ))
                        result = (mode & 0500 ) == 0500;
                    else if ( a_user.m_gids.contains( gid ))
                        result = (mode & 050 ) == 050;
                    else
                        result = (mode & 05 ) == 05;
                }
            }

            if ( result )
            {
                String path = hasFileAccess( parent, a_user );
                if ( path != null )
                    path += "/" + a_file.getProperty(Schema.NAME);
                return path;
            }
            else
                return null;
        }
        else return ""; // Reached root - return true always
    }
/*
    private void processVertexResult( Vertex a_vertex, JSONStringer a_output )
    {
        int type = a_vertex.getProperty( Schema.TYPE );

        if ( type == Schema.Type.FILE.toInt() || type == Schema.Type.DIR.toInt() )
        {
            // Validate user has access to this file (by path)
            String path = hasFileAccess( a_vertex, null );
            if ( path == null )
            {
                return;
            }

            a_output.object();
            a_output.key("path").value( path );
        }
        else if ( type == Schema.Type.JOB.toInt() )
        {
            Iterator<Edge> e = a_vertex.getEdges(Direction.IN, Schema.PROD).iterator();
            if ( !e.hasNext() )
                return;

            int uid = e.next().getVertex(Direction.OUT).getProperty(Schema.UID);

            a_output.object();
            a_output.key("user").value( uid );
        }
        else if ( type == Schema.Type.APP.toInt() )
        {
            Iterator<Edge> e = a_vertex.getEdges(Direction.IN, Schema.COMP).iterator();
            if ( !e.hasNext() )
                return;

            Vertex job = e.next().getVertex(Direction.OUT);

            e = job.getEdges(Direction.IN, Schema.PROD).iterator();
            if ( !e.hasNext() )
                return;

            a_output.object();
            a_output.key("job").value( job.getProperty( Schema.JID ));
        }
        else if ( type == Schema.Type.TAG.toInt() )
        {
            // Add owner and ACL info for tags
            Iterator<Edge> e = a_vertex.getEdges(Direction.IN, Schema.ASSET).iterator();
            if ( !e.hasNext() )
            {
                return;
            }

            a_output.object();

            int uid = e.next().getVertex(Direction.OUT).getProperty(Schema.UID);
            a_output.key("owner").value( uid );
        }
        else
            a_output.object();

        convertVertexProperties( a_vertex, null, a_output, false );
        a_output.endObject();
    }
*/
    /**
     * @param a_user - User receiving this result
     * @param a_vertex
     * @param a_output 
     */
    private void processVertexResult( Vertex a_vertex, UserInfo a_user, JSONStringer a_output )
    {
        // TODO To be correct, the user should be specified everytime this method is
        // called; however, it is only provided for search results. This could lead to
        // elevated access for some cases. Will revisit when refactoring for version 2

        int type = a_vertex.getProperty( Schema.TYPE );

        if ( type == Schema.Type.FILE.toInt() || type == Schema.Type.DIR.toInt() )
        {
            // Validate user has access to this file (by path)
            String path = hasFileAccess( a_vertex, a_user );
            if ( path == null )
            {
                return;
            }

            a_output.object();
            a_output.key("path").value( path );
        }
        else if ( type == Schema.Type.JOB.toInt() )
        {
            Iterator<Edge> e = a_vertex.getEdges(Direction.IN, Schema.PROD).iterator();
            if ( !e.hasNext() )
            {
                return;
            }

            int uid = e.next().getVertex(Direction.OUT).getProperty(Schema.UID);
            if ( a_user != null && uid != a_user.m_uid )
                return;

            a_output.object();
            a_output.key("user").value( uid );
        }
        else if ( type == Schema.Type.APP.toInt() )
        {
            Iterator<Edge> e = a_vertex.getEdges(Direction.IN, Schema.COMP).iterator();
            if ( !e.hasNext() )
                return;

            Vertex job = e.next().getVertex(Direction.OUT);

            e = job.getEdges(Direction.IN, Schema.PROD).iterator();
            if ( !e.hasNext() )
                return;

            Vertex usr = e.next().getVertex(Direction.OUT);

            if ( a_user != null && (int)usr.getProperty(Schema.UID) != a_user.m_uid )
                return;

            a_output.object();
            a_output.key("job").value( job.getProperty( Schema.JID ));
        }
        else if ( type == Schema.Type.TAG.toInt() )
        {
            // Validate user has access to this tag
            if ( a_user != null && !hasTagAccess( a_vertex, a_user.m_uid ))
                return;

            // Add owner and ACL info for tags
            Iterator<Edge> e = a_vertex.getEdges(Direction.IN, Schema.ASSET).iterator();
            if ( !e.hasNext() )
                return;

            a_output.object();

            int uid = e.next().getVertex(Direction.OUT).getProperty(Schema.UID);
            a_output.key("owner").value( uid );

            // Only add ACLs for owned tags
            if ( a_user == null || uid == a_user.m_uid )
                addTagACLs( a_vertex, true, true, a_output );
        }
        else if ( type == Schema.Type.DOI.toInt() )
        {
            a_output.object();

            // Add context objects
            a_output.key("context").array();

            Iterator<Edge> e = a_vertex.getEdges(Direction.OUT, Schema.CTXT).iterator();
            if ( e.hasNext() )
                processVertexResult( e.next().getVertex(Direction.IN), null, a_output );

            a_output.endArray();
        }
        else
            a_output.object();

        convertVertexProperties( a_vertex, null, a_output, false );
        a_output.endObject();
    }


    //=========== PIPE FUNCTIONS ==============================================

    /**
     * 
     */
    private class VertexGrabber implements PipeFunction<Vertex, Vertex>
    {
        private final Vertex[] m_vertex;

        public VertexGrabber(Vertex[] a_vertex) {
            this.m_vertex = a_vertex;
        }

        public Vertex compute(Vertex a_vertex)
        {
            this.m_vertex[0] = a_vertex;
            return null;
        }
    }

    /**
     * 
     */
    private class DirectoryAccessFilter implements PipeFunction<Vertex, Boolean>
    {
        private final UserInfo m_user;

        public DirectoryAccessFilter( UserInfo a_user )
        {
            m_user = a_user;
        }

        public Boolean compute( Vertex a_vertex )
        {
            Boolean result = true;

            int type = a_vertex.getProperty(Schema.TYPE);
            if ( type == Schema.Type.DIR.toInt())
            {
                if ( m_user.m_uid == 0 )
                    result = true;
                else
                {
                    result = false;

                    // Determine role: owner, group, or other
                    Integer uid = a_vertex.getProperty(Schema.XUID);
                    Integer gid = a_vertex.getProperty(Schema.XGID);
                    Integer mode = a_vertex.getProperty(Schema.FMODE);

                    if ( uid != null && gid != null )
                    {
                        if ( uid.equals( m_user.m_uid ))
                            result = (mode & 0500 ) == 0500;
                        else if ( m_user.m_gids.contains(gid) )
                            result = (mode & 050 ) == 050;
                        else
                            result = (mode & 05 ) == 05;
                    }
                }
            }

            return result;
        }
    }
}


