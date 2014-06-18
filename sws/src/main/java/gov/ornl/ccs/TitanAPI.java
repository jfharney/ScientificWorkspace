package gov.ornl.ccs;

import java.util.Iterator;
import java.util.Set;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashSet;
import org.json.JSONStringer;

import com.thinkaurelius.titan.core.TitanFactory;
import com.thinkaurelius.titan.core.TitanGraph;
import com.thinkaurelius.titan.core.TitanIndexQuery.Result;
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

    //=========== Node API ==========================================================================================

    /**
     * @param a_nid - Node ID of object to retrieve
     * @param a_properties - Coma-separated list of properties to retrieve
     * @param a_output - JSON serialization object to receive output
     * Retrieves a graph object (vertex) by Node ID.
     */
    public void getObjectByNID( int a_nid, String a_properties, JSONStringer a_output )
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
    public void deleteObjectByNID( int a_nid )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Vertex vertex = m_graph.getVertex(a_nid);
        if ( vertex == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND );

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
    public void getNodesByTagNID( int a_tag_nid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );

        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertex( a_tag_nid )).in(Schema.META);

        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output, true );

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

            convertVertexProperties( app, props, a_output, true );

            Iterator<Edge> e = app.getEdges(Direction.IN, Schema.COMP).iterator();
            if ( e.hasNext() )
            {
                int jid = e.next().getVertex(Direction.OUT).getProperty(Schema.JID);
                a_output.key("job").value( jid );
            }

            a_output.endObject();
        }
    }

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

    //=========== FILES API ============================================================================================

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
    public void getFilesByPath( int a_nid, int a_uid, Boolean a_list, String a_properties, int a_off, int a_len, JSONStringer a_output )
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

    public String adminGetRootFiles()
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Vertex[] vertices = {null};
        GremlinPipeline grem = new GremlinPipeline( m_graph.getVertices( "fpath", "root" )).sideEffect( new VertexGrabber( vertices )).out(Schema.COMP);
        grem.hasNext();

        return processFileQuery( grem, vertices[0] );
    }

    public String adminGetFiles( int a_nid )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        GremlinPipeline grem = new GremlinPipeline( m_graph.getVertex( a_nid )).out(Schema.COMP);
        grem.hasNext();

        return processFileQuery( grem, null );
    }

    private String processFileQuery( GremlinPipeline a_grem, Vertex a_parent )
    {
        StringBuilder builder = new StringBuilder(4000);

        if ( a_parent != null )
        {
            builder.append( a_parent.getId() );
            builder.append( "," );
            builder.append( a_parent.getProperty(Schema.NAME) );
            builder.append( "," );

            if ( a_parent.getProperty(Schema.TYPE) == Schema.Type.FILE.toInt())
            {
                builder.append( Schema.Type.FILE.toInt() );
                //builder.append( "," );
                //builder.append( a_parent.getProperty(Schema.FSIZE) );
            }
            else
            {
                builder.append( Schema.Type.DIR.toInt() );
            }

            builder.append( "," );
            builder.append( a_parent.getProperty(Schema.XUID) );
            builder.append( "," );
            builder.append( a_parent.getProperty(Schema.XGID) );
            builder.append( "," );
            builder.append( a_parent.getProperty(Schema.FMODE) );
            builder.append( "\n" );
        }

        Vertex v;
        while ( a_grem.hasNext() )
        {
            v = (Vertex)a_grem.next();
            builder.append( v.getId() );
            builder.append( "," );
            builder.append( v.getProperty(Schema.NAME) );
            builder.append( "," );
            if ( v.getProperty(Schema.TYPE) == Schema.Type.FILE.toInt())
            {
                builder.append( Schema.Type.FILE.toInt() );
                //builder.append( "," );
                //builder.append( v.getProperty("fsize") );
            }
            else
            {
                builder.append( Schema.Type.DIR.toInt() );
            }
            builder.append( "," );
            builder.append( v.getProperty(Schema.XUID) );
            builder.append( "," );
            builder.append( v.getProperty(Schema.XGID) );
            builder.append( "," );
            builder.append( v.getProperty(Schema.FMODE) );
            builder.append( "\n" );
        }

        return builder.toString();
    }

    public String adminFileTest()
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        long startTime = System.nanoTime();
        Integer count = 0;

        m_graph.rollback();

        Iterator<Vertex> iv = m_graph.getVertices( Schema.FPATH, "root" ).iterator();
        if ( iv.hasNext() )
        {
            count++;
            count += loadFileSystem( iv.next() );
        }

        long endTime = System.nanoTime();
        double duration = (endTime - startTime)*1e-9;

        return String.format( "Loaded %d vertices in %g sec, or %g vert/sec", count, duration, count/duration );
    }

    private int loadFileSystem( Vertex a_parent )
    {
        //System.out.print(a_parent.getId());
        int count = 1;

        Iterator<Edge> ie = a_parent.getEdges(Direction.OUT, Schema.COMP).iterator();
        while ( ie.hasNext() )
        {
            count += loadFileSystem( ie.next().getVertex(Direction.IN) );
        }
        return count;
    }

    //=========== TAG API ==============================================================================================

    public void getTags( int a_uid, boolean a_owned, boolean a_shared, String a_shared_uids, boolean a_public, String a_public_uids, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<Vertex> results = new HashSet();
        Set<String> props = parseRetrieveProperties( a_properties );

        if ( a_owned )
        {
            GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices(Schema.UID, a_uid )).out(Schema.ASSET).has(Schema.TYPE,Schema.Type.TAG.toInt());

            // Store results
            grem.fill(results);
        }

        if ( a_shared )
        {
            if ( a_shared_uids != null )
            {
                GremlinPipeline<Vertex,Vertex> grem;
                Integer[] uids = parseIntegerCSV( a_shared_uids );
                for ( int uid : uids )
                {
                    // Skip owner if it's in the list (can't share a tag with self)
                    if ( uid == a_uid )
                        continue;

                    // Start from specified users and navigate to shared tags that calling user has access to
                    // No need to check tag access since "member" edges are only present when shared
                    // Also no need to check type==user for end-points since uid is only present on user nodes
                    grem = new GremlinPipeline( m_graph.getVertices(Schema.UID, uid )).out(Schema.ASSET).has(Schema.TYPE,Schema.Type.TAG.toInt()).as("x").copySplit(
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
                GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline(m_graph.getVertices(Schema.UID, a_uid)).copySplit(
                    new GremlinPipeline().in(Schema.MEMBER).in(Schema.MEMBER).as("x").has(Schema.TYPE,Schema.Type.TAG.toInt()).in(Schema.ASSET).hasNot(Schema.UID,a_uid).back("x"),
                    new GremlinPipeline().in(Schema.MEMBER).has(Schema.TYPE,Schema.Type.TAG.toInt())
                    ).fairMerge().dedup();

                // Add results (will induce duplicates)
                Set tmp_results = new HashSet();
                results.addAll( grem.fill( tmp_results ));
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

    public void getTagsFromNode( int a_nid, int a_uid, String a_properties, JSONStringer a_output )
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
            Integer[] uids = null;
            Integer[] gids = null;
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
                    for ( int uid : uids )
                    {
                        it = m_graph.getVertices(Schema.UID,uid).iterator();
                        if ( !it.hasNext() )
                            throw new IllegalStateException("Invalid uid in ACL");
                        tag.addEdge(Schema.MEMBER, it.next() );
                    }
                    for ( int gid : gids )
                    {
                        it = m_graph.getVertices(Schema.GID,gid).iterator();
                        if ( !it.hasNext() )
                            throw new IllegalStateException("Invalid gid in ACL");
                        tag.addEdge(Schema.MEMBER, it.next() );
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

    public void putTag( int a_nid, String a_tag, String a_desc, int a_access, String a_acl_uids, String a_acl_gids, JSONStringer a_output )
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
                Integer[] uids = null;
                Integer[] gids = null;
                if ( a_access == 1 )
                {
                    uids = parseIntegerCSV( a_acl_uids );
                    gids = parseIntegerCSV( a_acl_gids );
                }

                try
                {
                    // Remove all ACLs (outgoing member edges)
                    GremlinPipeline<Vertex,Edge> grem = new GremlinPipeline( tag ).outE(Schema.MEMBER);

                    while ( grem.hasNext() )
                        grem.next().remove();

                    // Update tag vertex with new properties
                    ElementHelper.setProperties( tag, Schema.TYPE, Schema.Type.TAG.toInt(), Schema.NAME, a_tag,
                            Schema.DESC, a_desc!=null?a_desc:"", Schema.ACCESS, a_access );

                    // Add edges to ACL entities
                    if ( a_access == 1 )
                    {
                        Iterator<Vertex> it;

                        for ( int uid : uids )
                        {
                            it = m_graph.getVertices(Schema.UID,uid).iterator();
                            if ( !it.hasNext() )
                                throw new IllegalStateException("Invalid uid in ACL");
                            tag.addEdge(Schema.MEMBER, it.next() );
                        }
                        for ( int gid : gids )
                        {
                            it = m_graph.getVertices(Schema.GID,gid).iterator();
                            if ( !it.hasNext() )
                                throw new IllegalStateException("Invalid gid in ACL");
                            tag.addEdge(Schema.MEMBER, it.next() );
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
            //System.out.println("Found ACL member: " + member.getProperty("type"));
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

    //=========== LINKING METHODS ======================================================================================

    public void linkTagToNID( int a_tag_id, int a_nid )
    {
        Vertex tag = m_graph.getVertex(a_tag_id);
        Vertex node = m_graph.getVertex(a_nid);

        if ( tag == null || node == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND ); 

        // Make sure there isn't a descriptor edge already
        Iterator<Edge> it = node.getEdges(Direction.OUT, Schema.META).iterator();
        while ( it.hasNext() )
            if ( it.next().getVertex(Direction.IN) == tag )
                throw new WebApplicationException( Response.Status.CONFLICT ); 

        node.addEdge(Schema.META, tag);
        m_graph.commit();
    }

    public void unlinkTagFromNID( int a_tag_id, int a_nid )
    {
        Vertex tag = m_graph.getVertex(a_tag_id);
        Vertex node = m_graph.getVertex(a_nid);

        if ( tag == null || node == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND ); 

        Iterator<Edge> it = node.getEdges(Direction.OUT, Schema.META).iterator();
        while ( it.hasNext() )
        {
            Edge e = it.next();
            if ( e.getVertex(Direction.IN) == tag )
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

        Iterable<Result<Vertex> > results = m_graph.indexQuery("search", a_query).vertices();

        a_output.array();

        long startTime = System.nanoTime();
        Integer len = 0;

        int type;
        String path;
        Iterator<Edge> e;
        int uid;
        Vertex node;

        for ( Result<Vertex> res : results )
        {
            ++len;
            node = res.getElement();
            type = node.getProperty(Schema.TYPE);

            if ( type == Schema.Type.FILE.toInt() || type == Schema.Type.DIR.toInt() )
            {
                // Validate user has access to this file (by path)
                path = hasFileAccess( node, user );
                if ( path == null )
                    continue;

                a_output.object();
                a_output.key("path").value( path );
            }
            else if (  type == Schema.Type.TAG.toInt() )
            {
                // Validate user has access to this file (by path)
                if ( !hasTagAccess( node, a_uid ))
                    continue;

                a_output.object();

                // Add ACL for owned tags
                e = node.getEdges(Direction.IN, Schema.ASSET).iterator();
                if ( e.hasNext() )
                {
                    uid = e.next().getVertex(Direction.OUT).getProperty(Schema.UID);
                    a_output.key("owner").value( uid );

                    // Only add ACLs for owned tags
                    if ( uid == a_uid )
                        addTagACLs( node, true, true, a_output );
                }
            }
            else
                a_output.object();

            convertVertexProperties( node, null, a_output, false );
            a_output.endObject();
        }

        a_output.endArray();

        //long endTime = System.nanoTime();
        //double duration = (endTime - startTime)*1e-9;		

        //System.out.print( String.format( "%d results in %g sec, or %g inserts/sec", len, duration, len/duration ));
    }

    //=========== UTILITY METHODS ======================================================================================

    private Boolean invalidAccess( int a_access )
    {
        return a_access < 0 || a_access > 2;
    }

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

    private Integer[] parseIntegerCSV( String a_list )
    {
        try
        {
            if ( a_list != null )
            {
                String[] str_vals = a_list.split("\\s*,\\s*");

                Integer[] results = new Integer[str_vals.length];

                for ( int i = 0; i < str_vals.length; i++ )
                    results[i] = Integer.parseInt(str_vals[i]);

                return results;
            }
        }
        catch ( NumberFormatException e )
        {
            throw new IllegalStateException("Invalid numeric list paramter");
        }

        return new Integer[0];
    }

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
            new GremlinPipeline().has(Schema.ACCESS,2), // Public
            new GremlinPipeline().in(Schema.ASSET).has(Schema.UID, a_uid).back("x"), // Owned by uid
            new GremlinPipeline().out(Schema.MEMBER).has(Schema.UID, a_uid).back("x"), // User ACL
            new GremlinPipeline().out(Schema.MEMBER).out(Schema.MEMBER).has(Schema.UID,a_uid).back("x") // Group ACL
            ).fairMerge().dedup();

        if ( grem.hasNext() )
            return true;
        else
            return false;
    }

    private String hasFileAccess( Vertex a_file, UserInfo a_user ) // int a_uid, List<Integer> a_gids )
    {
        Iterator<Edge> e = a_file.getEdges(Direction.IN, Schema.COMP).iterator();
        if ( e.hasNext() )
        {
            Vertex parent = e.next().getVertex(Direction.OUT);
            boolean result = false;

            if ( a_user.m_uid == 0 )
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


    //=========== PIPE FUNCTIONS ==============================================

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


