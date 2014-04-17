package gov.ornl.nccs.scientificworkspace;

import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashSet;
import org.json.JSONObject;
import org.json.JSONStringer;

import com.thinkaurelius.titan.core.TitanFactory;
import com.thinkaurelius.titan.core.TitanGraph;
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
    private String m_graph_cfg = "/home/d3s/titan-all-0.4.2/conf/titan-local.properties";

    private TitanAPI()
    {
        System.out.println( String.format( "TitanAPI created on thread %d", Thread.currentThread().getId()));
        System.out.print("Loading graph from: " + m_graph_cfg );
        m_graph = TitanFactory.open( m_graph_cfg );
    }

    public static TitanAPI getInstance()
    {
        if ( m_instance == null )
            m_instance = new TitanAPI();

        return m_instance;
    }

    //=========== GENERAL API ==========================================================================================
    
    public void getObjectByNID( int a_nid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Vertex vertex = m_graph.getVertex(a_nid);
        Set<String> props = parseRetrieveProperties( a_properties );
        convertVertexProperties( vertex, props, a_output );
    }

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

    //=========== USER API =============================================================================================
    
    public void getUserByUID( int a_uid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices( "uid", a_uid ).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output );
    }

    public void getUserByUname( String a_uname, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices("uname", a_uname).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output );
    }

    public void getUsersByGID( int a_gid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "gid", a_gid )).out("member").has("type", "user");

        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output );

        a_output.endArray();
    }

    //=========== GROUP API ============================================================================================
    
	public void getGroupByGID( int a_gid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices( "gid", a_gid ).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output );
    }

	public void getGroupByGname( String a_gname, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices("gname", a_gname).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output );
    }

	public void getGroupsByUID( int a_uid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "uid", a_uid )).in("member").has("type", "group");
        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output );

        a_output.endArray();
    }
    
    //=========== JOBS API =============================================================================================

    public void getJobByJID( int a_jid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices( "jid", a_jid ).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output );
    }

    public void getJobs( int a_uid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "uid", a_uid )).out("product").has("type","job");

        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output );

        a_output.endArray();
    }

    //=========== APP API ==============================================================================================

	public void getAppByAID( int a_aid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Iterator<Vertex> it = m_graph.getVertices( "aid", a_aid ).iterator();

        if ( it.hasNext() )
            convertVertexProperties( it.next(), props, a_output );
    }

	public void getAppsByJID( int a_jid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "jid", a_jid )).out("component").has("type","app");

        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output );

        a_output.endArray();
    }
    
    //=========== FILES API ============================================================================================

    public void getFilesByPath( String a_path, int a_uid, String a_gids, Boolean a_list, String a_properties, int a_off, int a_len, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        String[] path = a_path.split("\\s*\\|\\s*");

        if ( path.length > 0 )
        {
            Set<String> props = parseRetrieveProperties( a_properties );
            GremlinPipeline grem = new GremlinPipeline( m_graph.getVertices( "fpath", path[0] ));

            Integer[] gids = parseIntegerCSV( a_gids );
            if ( a_gids.length() == 0 )
                throw new IllegalStateException("Invalid GIDS paramter");

            DirectoryAccessFilter access = new DirectoryAccessFilter( a_uid, gids );

            for ( int p = 1; p < path.length; p++ )
                grem = grem.out("component").has("fname",path[p]).filter( access );

            processFileQuery( grem, a_list, props, a_off, a_len, a_output );
        }
    }
    
    public void getFilesByPath( int a_nid, int a_uid, String a_gids, Boolean a_list, String a_properties, int a_off, int a_len, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        Integer[] gids = parseIntegerCSV( a_gids );

        DirectoryAccessFilter access = new DirectoryAccessFilter( a_uid, gids );
        GremlinPipeline grem = new GremlinPipeline( m_graph.getVertex( a_nid )).filter( access );

        processFileQuery( grem, a_list, props, a_off, a_len, a_output );
    }

    private void processFileQuery( GremlinPipeline a_grem, Boolean a_list, Set<String> a_props, int a_off, int a_len, JSONStringer a_output )
    {
        if ( a_list )
        {
            // Return file/directory and listing of contents (if any)

            Vertex[] vertices = {null};
            a_grem = a_grem.sideEffect( new VertexGrabber( vertices ));

            // Get children of this vertex
            a_grem = a_grem.out("component");
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
                a_output.key("nid").value( vertices[0].getId() );

                Set<String> keys = vertices[0].getPropertyKeys();
                if ( a_props != null )
                    keys.retainAll( a_props );

                for ( String k : keys )
                    a_output.key(k).value( vertices[0].getProperty(k) );

                if ( a_grem.hasNext() )
                {
                    a_output.key("files");
                    a_output.array();

                    while ( a_grem.hasNext() )
                        convertVertexProperties( (Vertex)a_grem.next(), a_props, a_output );

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
                convertVertexProperties( (Vertex)a_grem.next(), a_props, a_output );
            }
        }
    }

    //=========== TAG API ==============================================================================================

	public void getTagByName( String a_name, int a_uid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "uid", a_uid )).out("asset").has("type","tag").has("tag",a_name);

        Vertex tag;

        while ( grem.hasNext() )
        {
            tag = grem.next();

            Set<String> keys = tag.getPropertyKeys();
            if ( props != null )
                keys.retainAll(props);

            a_output.object();
            a_output.key("nid").value( tag.getId() );

            for ( String k : keys )
                a_output.key(k).value( tag.getProperty(k) );

            addTagACLs( tag, props, a_output );

            a_output.endObject();
        }
    }

	public void getTagsByUID( int a_uid, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "uid", a_uid )).out("asset").has("type","tag");

        Vertex tag;

        a_output.array();

        while ( grem.hasNext() )
        {
            tag = grem.next();

            Set<String> keys = tag.getPropertyKeys();
            if ( props != null )
                keys.retainAll(props);

            a_output.object();
            a_output.key("nid").value( tag.getId() );

            for ( String k : keys )
                a_output.key(k).value( tag.getProperty(k) );

            addTagACLs( tag, props, a_output );

            a_output.endObject();
        }

        a_output.endArray();
    }
    

    /* Test Only
	public ArrayList<JSONObject> getTagsByUID( int a_uid, String a_properties )
    {
        ArrayList<JSONObject> result = new ArrayList<>();

        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "uid", a_uid )).out("asset").has("type","tag");

        while ( grem.hasNext() )
            result.add( convertVertexProperties( grem.next(), props ));

        return result;
    }*/
    
    
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
        Iterator<Vertex> it = m_graph.getVertices( "uid", a_uid ).iterator();

        if ( it.hasNext() )
        {
            // Make sure tag does not already exist
            Vertex user = it.next();
            GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( user ).out("asset").has("type","tag").has("tag",a_tag);

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
                ElementHelper.setProperties( tag, "type", "tag", "tag", a_tag, "tag_desc", a_desc!=null?a_desc:"", "tag_access", a_access );

                user.addEdge("asset", tag );

                // Add edges to ACL entities
                if ( a_access == 1 )
                {
                    for ( int uid : uids )
                    {
                        it = m_graph.getVertices("uid",uid).iterator();
                        if ( !it.hasNext() )
                            throw new IllegalStateException("Invalid uid in ACL");
                        tag.addEdge( "member", it.next() );
                    }
                    for ( int gid : gids )
                    {
                        it = m_graph.getVertices("gid",gid).iterator();
                        if ( !it.hasNext() )
                            throw new IllegalStateException("Invalid gid in ACL");
                        tag.addEdge( "member", it.next() );
                    }
                }

                a_output.object();
                a_output.key("nid").value( tag.getId() );

                for ( String k : tag.getPropertyKeys() )
                    a_output.key(k).value( tag.getProperty(k) );

                if ( a_acl_uids != null )
                    a_output.key("acl_uids").value( a_acl_uids );

                if ( a_acl_gids != null )
                    a_output.key("acl_gids").value( a_acl_gids );
                
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


    /* Test Only
	public JSONObject postTag( int a_uid, String a_tag, String a_desc )
    {
        Iterator<Vertex> it = m_graph.getVertices( "uid", a_uid ).iterator();

        if ( !it.hasNext() )
            throw new WebApplicationException( Response.Status.NOT_FOUND );
        
        Vertex user = it.next();
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( user ).out("asset").has("type","tag").has("tag",a_tag);

        if ( grem.hasNext() )
            throw new WebApplicationException( Response.Status.CONFLICT );

        m_graph.rollback();

        Vertex tag = m_graph.addVertex(null);
        ElementHelper.setProperties( tag, "type", "tag", "tag", a_tag, "tag_desc", a_desc!=null?a_desc:"" );

        user.addEdge("asset", tag );

        m_graph.commit();
        return convertVertexProperties( tag, null );
    }*/


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
            if ( tag.getProperty("type").equals("tag"))
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
                    GremlinPipeline<Vertex,Edge> grem = new GremlinPipeline( tag ).outE("member");

                    while ( grem.hasNext() )
                        grem.next().remove();
                    
                    // Update tag vertex with new properties
                    ElementHelper.setProperties( tag, "type", "tag", "tag", a_tag, "tag_desc", a_desc!=null?a_desc:"", "tag_access", a_access );

                    // Add edges to ACL entities
                    if ( a_access == 1 )
                    {
                        Iterator<Vertex> it;

                        for ( int uid : uids )
                        {
                            it = m_graph.getVertices("uid",uid).iterator();
                            if ( !it.hasNext() )
                                throw new IllegalStateException("Invalid uid in ACL");
                            tag.addEdge( "member", it.next() );
                        }
                        for ( int gid : gids )
                        {
                            it = m_graph.getVertices("gid",gid).iterator();
                            if ( !it.hasNext() )
                                throw new IllegalStateException("Invalid gid in ACL");
                            tag.addEdge( "member", it.next() );
                        }
                    }

                    a_output.object();
                    a_output.key("nid").value( tag.getId() );

                    for ( String k : tag.getPropertyKeys() )
                        a_output.key(k).value( tag.getProperty(k) );

                    if ( a_acl_uids != null )
                        a_output.key("acl_uids").value( a_acl_uids );

                    if ( a_acl_gids != null )
                        a_output.key("acl_gids").value( a_acl_gids );

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

    public void getTaggedNodes( int a_uid, String a_tag, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Graph not initialized");

        m_graph.rollback();

        Set<String> props = parseRetrieveProperties( a_properties );
        
        // Make sure UID is valid
        Iterator<Vertex> it = m_graph.getVertices( "uid", a_uid ).iterator();
        if ( !it.hasNext() )
            throw new WebApplicationException( Response.Status.NOT_FOUND );

        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( it.next() ).out("asset").has("type","tag").has("tag",a_tag);

        if ( !grem.hasNext() )
            throw new WebApplicationException( Response.Status.NOT_FOUND );

        grem = new GremlinPipeline( grem.next() ).in("descriptor");
        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output );

        a_output.endArray();
    }

    public void getTagsOnNID( int a_nid, int a_uid, String a_properties, JSONStringer a_output )
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
        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( vertex ).out("descriptor").as("x").copySplit(
            new GremlinPipeline().has("tag_access",2), // Public
            new GremlinPipeline().in("asset").has("uid",a_uid).back("x"), // Owned by uid
            new GremlinPipeline().out("member").has("uid",a_uid).back("x"), // User ACL
            new GremlinPipeline().out("member").out("member").has("uid",a_uid).back("x") // Group ACL
            ).fairMerge().dedup();

        a_output.array();

        while ( grem.hasNext() )
            convertVertexProperties( grem.next(), props, a_output );

        a_output.endArray();
    }

    private void addTagACLs( Vertex a_tag, Set<String> a_props, JSONStringer a_output )
    {
        // Only shared tags hav ACLs
        if ( !a_tag.getProperty("tag_access").equals("1"))
            return;

        // Handle retrieval properties
        Boolean add_uids = true;
        Boolean add_gids = true;

        if ( a_props != null )
        {
            if ( !a_props.contains("acl_uids"))
                add_uids = false;
            if ( !a_props.contains("acl_gids"))
                add_gids = false;
        }
        
        if ( !add_uids && !add_gids )
            return;

        String acl_uids = "";
        String acl_gids = "";

        GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( a_tag ).out("member");
        Vertex member;
        while ( grem.hasNext() )
        {
            member = grem.next();
            System.out.println("Found ACL member: " + member.getProperty("type"));
            if ( member.getProperty("type").equals("user") && add_uids )
            {
                if ( acl_uids.length() > 0 )
                    acl_uids += ",";
                acl_uids += member.getProperty("uid");
            }
            else if ( add_gids )
            {
                if ( acl_gids.length() > 0 )
                    acl_gids += ",";
                acl_gids += member.getProperty("gid");
            }
        }

        if ( acl_uids.length() > 0 && add_uids )
            a_output.key("acl_uids").value(acl_uids);

        if ( acl_gids.length() > 0 && add_gids )
            a_output.key("acl_gids").value(acl_gids);
    }
    
    //=========== LINKING METHODS ======================================================================================

    public void linkTagToNID( int a_tag_id, int a_nid )
    {
        Vertex tag = m_graph.getVertex(a_tag_id);
        Vertex node = m_graph.getVertex(a_nid);

        if ( tag == null || node == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND ); 

        // Make sure there isn't a descriptor edge already
        Iterator<Edge> it = node.getEdges(Direction.OUT, "descriptor").iterator();
        while ( it.hasNext() )
            if ( it.next().getVertex(Direction.OUT) == tag )
                throw new WebApplicationException( Response.Status.CONFLICT ); 

        node.addEdge("descriptor", tag);
        m_graph.commit();
    }

    public void unlinkTagFromNID( int a_tag_id, int a_nid )
    {
        Vertex tag = m_graph.getVertex(a_tag_id);
        Vertex node = m_graph.getVertex(a_nid);

        if ( tag == null || node == null )
            throw new WebApplicationException( Response.Status.NOT_FOUND ); 

        Iterator<Edge> it = node.getEdges(Direction.OUT, "descriptor").iterator();
        while ( it.hasNext() )
        {
            Edge e = it.next();
            if ( e.getVertex(Direction.OUT) == tag )
            {
                e.remove();
                m_graph.commit();
                return;
            }
        }

        throw new WebApplicationException( Response.Status.NOT_FOUND ); 
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

    private void convertVertexProperties( Vertex a_vertex, Set<String> a_props, JSONStringer a_output )
    {
        Set<String> keys = a_vertex.getPropertyKeys();
        if ( a_props != null )
            keys.retainAll(a_props);

        a_output.object();
        a_output.key("nid").value( a_vertex.getId() );

        for ( String k : keys )
            a_output.key(k).value( a_vertex.getProperty(k) );

        a_output.endObject();
    }

    /* Test Only
    private JSONObject convertVertexProperties( Vertex a_vertex, Set<String> a_props )
    {
        JSONObject object = new JSONObject();

        Set<String> keys = a_vertex.getPropertyKeys();
        if ( a_props != null )
            keys.retainAll(a_props);

        object.put("nid", a_vertex.getId() );

        for ( String k : keys )
            object.put(k, a_vertex.getProperty(k) );

        return object;
    }*/

    //=========== PIPE FUNCTIONS ==============================================

    public class VertexGrabber implements PipeFunction<Vertex, Vertex>
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

    public class DirectoryAccessFilter implements PipeFunction<Vertex, Boolean>
    {
        private final Integer       m_uid;
        private final List<Integer> m_gids;

        public DirectoryAccessFilter( Integer a_uid, Integer[] a_gids )
        {
            m_uid = a_uid;
            m_gids = Arrays.asList( a_gids );
        }

        public Boolean compute( Vertex a_vertex )
        {
            Boolean result = true;

            String type = a_vertex.getProperty("type");
            if ( type != null )
            {
                if ( type.equals( "directory" ))
                {
                    result = false;

                    // Determin role: user, group, or other
                    Integer uid = a_vertex.getProperty("file_uid");
                    Integer gid = a_vertex.getProperty("file_gid");
                    Integer mode = a_vertex.getProperty("file_mode");

                    if ( uid != null && gid != null )
                    {
                        if ( uid.equals( m_uid ))
                            result = (mode & 5 ) == 5;
                        else if ( m_gids.contains(gid) )
                            result = (mode & 050 ) == 050;
                        else
                            result = (mode & 0500 ) == 0500;
                    }
                }
            }

            return result;
        }
    }    
}


