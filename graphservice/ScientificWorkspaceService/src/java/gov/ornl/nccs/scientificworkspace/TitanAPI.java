package gov.ornl.nccs.scientificworkspace;

import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.Arrays;
import java.util.HashSet;
//import org.json.JSONException;
import org.json.JSONStringer;

import com.thinkaurelius.titan.core.TitanFactory;
import com.thinkaurelius.titan.core.TitanGraph;
//import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Vertex;
//import com.tinkerpop.pipes.util.Pipeline;
import com.tinkerpop.gremlin.java.GremlinPipeline;

//import com.tinkerpop.blueprints.Compare;


public class TitanAPI implements IGeneralAPI, IUserAPI, IJobAPI, IFileAPI
{
    private static TitanAPI m_instance = null;
    private TitanGraph m_graph = null;

    private TitanAPI()
    {
        m_graph = TitanFactory.open("/home/d3s/titan-all-0.4.2/conf/titan-local.properties");
    }

    public static TitanAPI getInstance()
    {
        if ( m_instance == null )
            m_instance = new TitanAPI();

        return m_instance;
    }

    //=========== GENERAL API ==========================================================================================
    
    @Override
    public void getObjectByNID( int a_nid, String a_properties, JSONStringer a_output )
    {
        try
        {
            if ( m_graph == null )
                throw new IllegalStateException("Grpah not initialized");

            Vertex vertex = m_graph.getVertex(a_nid);
            Set<String> props = parseRetrieveProperties( a_properties );
            convertVertexProperties( vertex, props, a_output );
        }
        catch ( Exception e )
        {
            // No such object?
            a_output.object()
            .key("exception").value( e.toString() )
            .endObject();
        }
    }

    //=========== USER API =============================================================================================
    
    @Override
    public void getUserByUID( int a_uid, String a_properties, JSONStringer a_output )
    {
        try
        {
            if ( m_graph == null )
                throw new IllegalStateException("Grpah not initialized");

            Set<String> props = parseRetrieveProperties( a_properties );
            Iterator<Vertex> it = m_graph.getVertices( "uid", a_uid ).iterator();

            if ( it.hasNext() )
            {
                Vertex vertex = it.next();
                convertVertexProperties( vertex, props, a_output );
            }
        }
        catch ( Exception e )
        {
            a_output.object()
            .key("exception").value( e.toString() )
            .endObject();
        }
    }

    @Override
    public void getUserByUname( String a_uname, String a_properties, JSONStringer a_output )
    {
        try
        {
            if ( m_graph == null )
                throw new IllegalStateException("Grpah not initialized");

            Set<String> props = parseRetrieveProperties( a_properties );
            Iterator<Vertex> it = m_graph.getVertices("uname", a_uname).iterator();

            if ( it.hasNext() )
            {
                Vertex vertex = it.next();
                convertVertexProperties( vertex, props, a_output );
               
            }
        }
        catch ( Exception e )
        {
            a_output.object()
            .key("exception").value( e.toString() )
            .endObject();
        }
    }

    @Override
    public void getUsersByGID( int a_gid, String a_properties, JSONStringer a_output )
    {
        try
        {
            if ( m_graph == null )
                throw new IllegalStateException("Grpah not initialized");

            Set<String> props = parseRetrieveProperties( a_properties );
            GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "gid", a_gid )).out("member").has("type", "user");
            a_output.array();
            
            while ( grem.hasNext() )
            {
                Vertex vertex = grem.next();
                convertVertexProperties( vertex, props, a_output );
            }

            a_output.endArray();
        }
        catch ( Exception e)
        {
            // Missing something
            a_output.object()
            .key("exception").value( e.toString() )
            .endObject();
        }
    }

    //=========== JOBS API =============================================================================================

    @Override
    public void getJobByJID( int a_jid, String a_properties, JSONStringer a_output )
    {
        try
        {
            if ( m_graph == null )
                throw new IllegalStateException("Grpah not initialized");

            Set<String> props = parseRetrieveProperties( a_properties );
            Iterator<Vertex> it = m_graph.getVertices( "jid", a_jid ).iterator();

            if ( it.hasNext() )
            {
                Vertex vertex = it.next();
                convertVertexProperties( vertex, props, a_output );
            }
        }
        catch ( Exception e )
        {
            a_output.object()
            .key("exception").value( e.toString() )
            .endObject();
        }
    }

    @Override
    public void getJobs( int a_uid, String a_properties, JSONStringer a_output )
    {
        try
        {
            if ( m_graph == null )
                throw new IllegalStateException("Grpah not initialized");

            Set<String> props = parseRetrieveProperties( a_properties );
            GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "uid", a_uid )).out("product").has("type","job");

            a_output.array();

            while ( grem.hasNext() )
            {
                Vertex vertex = grem.next();
                convertVertexProperties( vertex, props, a_output );
            }

            a_output.endArray();
        }
        catch ( Exception e)
        {
            // Missing something
            a_output.object()
            .key("exception").value( e.toString() )
            .endObject();
        }
    }

    //=========== FILES API ============================================================================================

    @Override
    public void getFilesByPath( String a_path, String a_gids, int a_depth, String a_properties, JSONStringer a_output )
    {
        if ( m_graph == null )
            throw new IllegalStateException("Grpah not initialized");

        String[] path = a_properties.split("\\s*|\\s*");
        if ( path.length > 0 )
        {
            Set<String> props = parseRetrieveProperties( a_properties );
            GremlinPipeline<Vertex,Vertex> grem = new GremlinPipeline( m_graph.getVertices( "path", path[0] ));
            for ( int p = 1; p < path.length; p++ )
                grem.out("component").has("name",path[p]);

            while ( grem.hasNext() )
            {
                Vertex vertex = grem.next();
                convertVertexProperties( vertex, props, a_output );
            }
        }
    }
    
    //=========== UTILITY METHODS ==============================================

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
}
