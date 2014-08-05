package gov.ornl.ccs;

import java.util.Iterator;
import java.util.Set;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.HashMap;
import java.lang.Thread;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import org.json.JSONStringer;

import com.thinkaurelius.titan.core.TitanFactory;
import com.thinkaurelius.titan.core.TitanGraph;
import com.thinkaurelius.titan.core.TitanIndexQuery.Result;
import com.thinkaurelius.titan.core.attribute.Cmp;
import com.thinkaurelius.titan.core.TitanKey;
import com.thinkaurelius.titan.core.Order;
import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.util.ElementHelper;
import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.blueprints.Edge;
import com.tinkerpop.pipes.PipeFunction;
import com.tinkerpop.gremlin.java.GremlinPipeline;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class TitanAdminAPI
{
    private static final String     INDEX_NAME = "search";
    private static TitanAdminAPI    m_instance = null;
    private static TitanAPI         m_titan_api = null;
    private TitanGraph              m_graph = null;
    private long                    m_dir_size = 0;
    private long                    m_scratch_count = 0;

    /**
     * Private constructor for TitanAdminAPI singleton instance. Use getInstance() to access/create TitanAdminAPI.
     */
    private TitanAdminAPI()
    {
        m_titan_api = TitanAPI.getInstance();
        m_graph     = m_titan_api.getGraph();
    }

    /**
     * @return TitanAdminAPI singleton instance.
     * Acquires instance pointer to TitanAdminAPI singleton.
     */
    public static TitanAdminAPI getInstance()
    {
        if ( m_instance == null )
            m_instance = new TitanAdminAPI();

        return m_instance;
    }

    public void shutdown()
    {
        m_graph = null;
    }

    public void initializeDb() throws Exception
    {
        if ( m_graph == null )
            throw new WebApplicationException( "Graph is unavailable.", Response.Status.SERVICE_UNAVAILABLE );

        m_graph.rollback();

        if ( m_graph.getTypes(TitanKey.class).iterator().hasNext() )
            throw new WebApplicationException( "Graph is already initialized.", Response.Status.CONFLICT );

        // Vertex stuff
        m_graph.makeKey(Schema.TYPE).dataType(Integer.class).indexed(INDEX_NAME,Vertex.class).make();
        m_graph.makeKey(Schema.CTIME).dataType(Long.class).indexed(INDEX_NAME,Vertex.class).make();
        m_graph.makeKey(Schema.MTIME).dataType(Long.class).indexed(INDEX_NAME,Vertex.class).make();
        m_graph.makeKey(Schema.START).dataType(Long.class).indexed(INDEX_NAME,Vertex.class).make();
        m_graph.makeKey(Schema.STOP).dataType(Long.class).indexed(INDEX_NAME,Vertex.class).make();
        m_graph.makeKey(Schema.NAME).dataType(String.class).indexed(INDEX_NAME,Vertex.class).make();
        m_graph.makeKey(Schema.DESC).dataType(String.class).indexed(INDEX_NAME,Vertex.class).make();
        m_graph.makeKey(Schema.UID).dataType(Integer.class).indexed(Vertex.class).make(); //unique().make();
        m_graph.makeKey(Schema.UNAME).dataType(String.class).indexed(Vertex.class).make(); //.unique().make();
        m_graph.makeKey(Schema.EMAIL).dataType(String.class).make();
        m_graph.makeKey(Schema.GID).dataType(Integer.class).indexed(Vertex.class).make(); //.unique().make();
        m_graph.makeKey(Schema.GNAME).dataType(String.class).indexed(Vertex.class).make(); //.unique().make();
        m_graph.makeKey(Schema.FPATH).dataType(String.class).indexed(Vertex.class).make();
        m_graph.makeKey(Schema.XUID).dataType(Integer.class).make();
        m_graph.makeKey(Schema.XGID).dataType(Integer.class).make();
        m_graph.makeKey(Schema.FMODE).dataType(Integer.class).make();
        m_graph.makeKey(Schema.FSIZE).dataType(Integer.class).make();
        m_graph.makeKey(Schema.JID).dataType(Integer.class).indexed(Vertex.class).make();
        m_graph.makeKey(Schema.HOST).dataType(String.class).make();
        m_graph.makeKey(Schema.WALL).dataType(Integer.class).make();
        m_graph.makeKey(Schema.ERR).dataType(Integer.class).make();
        m_graph.makeKey(Schema.NODES).dataType(Integer.class).make();
        m_graph.makeKey(Schema.AID).dataType(Integer.class).indexed(Vertex.class).make();
        m_graph.makeKey(Schema.CMD).dataType(String.class).make();
        m_graph.makeKey(Schema.ACCESS).dataType(Integer.class).make();

        // Edge Stuff
        m_graph.makeLabel(Schema.ASSET).oneToMany().make();
        m_graph.makeLabel(Schema.MEMBER).manyToMany().make();
        m_graph.makeLabel(Schema.COMP).oneToMany().make();
        m_graph.makeLabel(Schema.PROD).oneToMany().make();
        m_graph.makeLabel(Schema.META).manyToMany().make();
        m_graph.makeLabel(Schema.CTXT).manyToMany().make();
        m_graph.makeKey(Schema.STATUS).dataType(Integer.class).indexed(INDEX_NAME,Edge.class).make();

        // Create root node of file system
        ElementHelper.setProperties( m_graph.addVertex(null), Schema.TYPE, Schema.Type.DIR.toInt(),
            Schema.FPATH, "root",
            Schema.XUID, 0,
            Schema.XGID, 0,
            Schema.FMODE, 0777 );

        m_graph.commit();
    }

    private ArrayList<Vertex> loadUsersRemote()
    {
        ArrayList<Vertex> results = new ArrayList<>(4000);

        Iterator<Vertex> it = m_graph.query().has( Schema.TYPE, Cmp.EQUAL, Schema.Type.USER.toInt() ).vertices().iterator();
        while ( it.hasNext() )
            results.add( it.next() );

        return results;
    }

    public void loadUsers( String a_user_file, JSONStringer a_output  ) throws Exception
    {
        class UserInfo
        {
            public UserInfo()
            { nid = 0; }

            public long     nid;
            public int      uid;
            public String   uname;
            public String   name;
            public String   email;
        }

        BufferedReader reader = new BufferedReader( new FileReader( a_user_file ));
        String line;
        String[] strs;

        long new_count = 0;
        long del_count = 0;
        long upd_count = 0;
        long tot_count = 0;

        HashMap<Integer,UserInfo>   users = new HashMap<>();
        UserInfo uinfo;

        while (( line = reader.readLine()) != null )
        {
            // Ignore blank lines
            if ( line.length() == 0 || line.charAt( 0 ) == '#' )
                continue;

            // uid;username;firstname;middlename;lastname;email
            strs = line.split("\\s*;\\s*");
            if ( strs.length < 5 || strs.length > 6 )
            {
                reader.close();
                throw new Exception("Invalid user entry: " + line);
            }

            uinfo = new UserInfo();
            uinfo.uid = Integer.parseInt(strs[0]);
            uinfo.uname = strs[1];
            uinfo.name = strs[2] + " ";
            if ( !strs[3].equalsIgnoreCase( "null" ) && strs[3].length() > 0 )
                uinfo.name += strs[3].charAt( 0 ) + ". ";
            uinfo.name += strs[4];
            if ( strs.length > 5 )
                uinfo.email = strs[5];
            else
                uinfo.email = "";

            users.put( uinfo.uid, uinfo );
        }

        reader.close();

        // There might be user records in the db already, need to diff new users with existing
        ArrayList<Vertex> rem_users = loadUsersRemote();
        tot_count = rem_users.size();

        for ( Vertex v : rem_users )
        {
            uinfo = users.get( v.getProperty( Schema.UID ));
            if ( uinfo != null )
            {
                // Has user info changed?
                if ( uinfo.email.equals( v.getProperty( Schema.EMAIL )) &&
                        uinfo.name.equals( v.getProperty( Schema.NAME )) &&
                        uinfo.uname.equals( v.getProperty( Schema.UNAME )))
                {
                    uinfo.nid = -1; // No change, set NID to -1 to ignore
                }
                else
                {
                    uinfo.nid = (long)v.getId(); // Changed, set NID to vertex ID to update
                    //System.out.println("<" + uinfo.uname + ">?<" + v.getProperty( Schema.UNAME ) + ">" );
                    //System.out.println("<" + uinfo.name + ">?<" + v.getProperty( Schema.NAME ) + ">" );
                    //System.out.println("<" + uinfo.email + ">?<" + v.getProperty( Schema.EMAIL ) + ">" );
                }
            }
            else
            {
                // User has been deleted
                del_count++;

                // Must delete ALL user assets!!! (currently just tags, maybe virtual groups)
                Iterator<Edge> e = v.getEdges( Direction.OUT, Schema.ASSET ).iterator();

                while ( e.hasNext() )
                    e.next().getVertex( Direction.IN ).remove();

                // Delete user node
                m_graph.removeVertex( v );
            }
        }

        // Any remaining user records are either new (nid == 0) or updates (nide != 0)
        for ( UserInfo ui : users.values())
        {
            Vertex usr;
            if ( ui.nid == 0 )
            {
                new_count++;
                usr = m_graph.addVertex(null);
                //System.out.println("Adding user: " + ui.name );
            }
            else if ( ui.nid > 0 )
            {
                upd_count++;
                usr = m_graph.getVertex(ui.nid);
                //System.out.println("Updating user: " + ui.name );
            }
            else // Negative NID means ignore (i.e. unchanged)
                continue;

            ElementHelper.setProperties(usr, Schema.TYPE, Schema.Type.USER.toInt(), Schema.UNAME, ui.uname,
                    Schema.UID, ui.uid, Schema.NAME, ui.name, Schema.EMAIL, ui.email );
        }

        m_graph.commit();

        tot_count += new_count - del_count;

        a_output.object();
        a_output.key("users").object();
        a_output.key("total").value(tot_count);
        a_output.key("new").value(new_count);
        a_output.key("updated").value(upd_count);
        a_output.key("deleted").value(del_count);
        a_output.endObject();
        a_output.endObject();
    }

    private ArrayList<Vertex> loadGroupsRemote()
    {
        ArrayList<Vertex> results = new ArrayList<>(4000);

        Iterator<Vertex> it = m_graph.query().has( Schema.TYPE, Cmp.EQUAL, Schema.Type.GROUP.toInt() ).vertices().iterator();
        while ( it.hasNext() )
        {
            results.add( it.next() );
        }

        return results;
    }

    public void loadGroups( String a_groups_file, JSONStringer a_output  ) throws Exception
    {
        class GroupInfo
        {
            public GroupInfo()
            { nid = 0; update = true; mem_updated = false; }

            public long         nid;
            public int          gid;
            public String       gname;
            public boolean      update;
            public boolean      mem_updated;
            ArrayList<Integer>  uids = new ArrayList<>();
        }

        BufferedReader reader = new BufferedReader( new FileReader( a_groups_file ));
        String line;
        String[] strs;
        HashMap<Integer,GroupInfo> groups = new HashMap<>();
        int uid, gid;
        GroupInfo info;
        long tot_count = 0;
        long new_count = 0;
        long del_count = 0;
        long upd_count = 0;

        while (( line = reader.readLine()) != null )
        {
            // Ignore blank lines
            if ( line.length() == 0 || line.charAt( 0 ) == '#' )
                continue;

            strs = line.split("\\s*;\\s*");
            if ( strs.length != 5 )
            {
                reader.close();
                throw new RuntimeException("Invalid group entry: " + line );
            }

            uid  = Integer.parseInt(strs[1]);
            gid  = Integer.parseInt(strs[2]);

            info = groups.get( gid );
            if ( info != null )
            {
                info.uids.add( uid );
            }
            else
            {
                info = new GroupInfo();
                info.gid = gid;
                info.gname = strs[4];
                info.uids.add( uid );

                groups.put( gid, info );
            }
        }

        reader.close();

        tot_count = groups.size();

        // There might be user records in the db already, need to diff groups with existing records
        Iterator<Edge> e;
        Edge edge;
        Vertex member;
        ArrayList<Vertex> rem_groups = loadGroupsRemote();

        for ( Vertex v : rem_groups )
        {
            info = groups.get( v.getProperty( Schema.GID ));
            if ( info != null )
            {
                info.nid = (long)v.getId();
                if ( info.gname.equals( v.getProperty( Schema.GNAME) ))
                    info.update = false;

                // Check user membership
                e = v.getEdges( Direction.OUT, Schema.MEMBER ).iterator();
                while ( e.hasNext() )
                {
                    edge = e.next();
                    member = edge.getVertex( Direction.IN );

                    if ( member.getProperty( Schema.TYPE ) == Schema.Type.USER.toInt() )
                    {
                        Integer mem_uid = member.getProperty( Schema.UID );
                        if ( info.uids.contains( mem_uid ))
                            info.uids.remove( mem_uid );
                        else
                        {
                            m_graph.removeEdge( edge );
                            info.mem_updated = true;
                        }
                    }
                }

                // Any member uids left in info array are NEW and edges will be added
                if ( info.uids.size() > 0 )
                    info.mem_updated = true;

                if ( info.mem_updated )
                    upd_count++;
            }
            else
            {
                // Group has been deleted (incident edges are automatically removed)
                m_graph.removeVertex( v );
                del_count++;
            }
        }

        Vertex group;
        Iterator<Vertex> it;

        for ( GroupInfo ginfo : groups.values())
        {
            if ( ginfo.nid == 0 )
            {
                group = m_graph.addVertex(null);
                new_count++;
            }
            else
            {
                group = m_graph.getVertex(ginfo.nid);
            }

            if ( ginfo.update )
            {
                ElementHelper.setProperties(group, Schema.TYPE, Schema.Type.GROUP.toInt(), Schema.GNAME, ginfo.gname,
                        Schema.GID, ginfo.gid );
            }

            // These are new members to the group
            for ( Integer mem_uid : ginfo.uids )
            {
                it = m_graph.getVertices(Schema.UID,mem_uid).iterator();
                if ( it.hasNext())
                {
                    group.addEdge( Schema.MEMBER, it.next());
                }
            }
        }

        m_graph.commit();

        a_output.object();
        a_output.key("groups").object();
        a_output.key("total").value(tot_count);
        a_output.key("new").value(new_count);
        a_output.key("updated").value(upd_count);
        a_output.key("deleted").value(del_count);
        a_output.endObject();
        a_output.endObject();
    }

    private long getLatestJob()
    {
        Iterator<Vertex> it = m_graph.query().has(Schema.TYPE,Cmp.EQUAL,Schema.Type.JOB.toInt()).orderBy( Schema.START, Order.DESC ).limit( 1 ).vertices().iterator();
        if ( it.hasNext() )
        {
            Object val = it.next().getProperty( Schema.START );
            if ( val != null )
                return (long)val;
        }

        return 0;
    }

    public void loadJobs( String a_jobs_file, JSONStringer a_output ) throws Exception
    {
        // Get timestamp of latest job entry
        long latest = getLatestJob();

        class JobInfo
        {
            public JobInfo()
            {}

            public int      jid;
            public String   name;
            public String   uname;
            public String   gname;
            public int      err;
            public long     start;
            public long     stop;
            public int      wall;
            public String   host;
            public int      procs;
        }

        BufferedReader reader = new BufferedReader( new FileReader( a_jobs_file ));
        String line;
        String[] strs;
        long count = 0;
        JobInfo info;
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        date.setLenient( true );

        info = new JobInfo();
        Vertex job, usr, grp;
        Iterator<Vertex> it;

        while (( line = reader.readLine()) != null )
        {
            // Ignore blank lines
            if ( line.length() == 0 || line.charAt( 0 ) == '#' )
                continue;

            //hostname;uname;job_id;job_name;account;create_time;destroy_time;walltime;n;job_err
            strs = line.split("\\s*;\\s*");
            if ( strs.length != 10 )
            {
                reader.close();
                throw new Exception("Invalid job entry: " + line);
            }

            info.host = strs[0];
            info.uname = strs[1];
            info.jid = Integer.parseInt(strs[2]);
            info.name = strs[3];
            info.gname = strs[4].toLowerCase(); // Account = group? (seems to be upper case)
            info.start = date.parse(strs[5]).getTime()/1000;
            info.stop = date.parse(strs[6]).getTime()/1000;
            info.wall = Integer.parseInt(strs[7]);
            info.procs = Integer.parseInt(strs[8]);
            try
            {
                info.err = Integer.parseInt(strs[9]);
            }
            catch( NumberFormatException e )
            {
                info.err = -1;
            }

            if ( info.start > latest )
            {
                usr = grp = null;

                it = m_graph.getVertices(Schema.UNAME,info.uname).iterator();
                if ( it.hasNext() )
                    usr = it.next();

                it = m_graph.getVertices(Schema.GNAME,info.gname).iterator();
                if ( it.hasNext() )
                    grp = it.next();

                if ( usr == null )
                {
                    // User deleted? Skip this job (avoid orphan nodes)
                    continue;
                    //reader.close();
                    //throw new Exception("Invalid uname or gname in job entry: " + line );
                }

                job = m_graph.addVertex(null);

                ElementHelper.setProperties(job, Schema.TYPE, Schema.Type.JOB.toInt(),
                        Schema.JID, info.jid,
                        Schema.NAME, info.name,
                        Schema.HOST, info.host,
                        Schema.START, info.start,
                        Schema.STOP, info.stop,
                        Schema.WALL, info.wall,
                        Schema.NODES, info.procs,
                        Schema.ERR, info.err );

                usr.addEdge( Schema.PROD, job );
                // Group could have been deleted
                if ( grp != null )
                    job.addEdge( Schema.CTXT, grp );

                count++;
            }
        }

        m_graph.commit();

        reader.close();
        a_output.object();
        a_output.key("jobs").object();
        a_output.key("new").value(count);
        a_output.endObject();
        a_output.endObject();
    }

    private long getLatestApp()
    {
        Iterator<Vertex> it = m_graph.query().has(Schema.TYPE,Cmp.EQUAL,Schema.Type.APP.toInt()).orderBy( Schema.START, Order.DESC ).limit( 1 ).vertices().iterator();
        if ( it.hasNext() )
        {
            Object val = it.next().getProperty( Schema.START );
            if ( val != null )
                return (long)val;
        }

        return 0;
    }

    public void loadApps( String a_apps_file, JSONStringer a_output  ) throws Exception
    {
        // Get timestamp of latest job entry
        long latest = getLatestApp();

        class AppInfo
        {
            public AppInfo()
            {}

            public int      aid;
            public int      jid;
            public String   cmd;
            public int      err;
            public long     start;
            public long     stop;
            public String   host;
            public int      procs;
        }

        BufferedReader reader = new BufferedReader( new FileReader( a_apps_file ));
        String line;
        String[] strs;
        long count = 0;
        long unk_count = 0;
        AppInfo info;
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        date.setLenient( true );

        info = new AppInfo();
        Vertex job, app;
        Iterator<Vertex> it;

        while (( line = reader.readLine()) != null )
        {
            // Ignore blank lines
            if ( line.length() == 0 || line.charAt( 0 ) == '#' )
                continue;

            //hostname;apid;job_id;create_time;destroy_time;command;n;exit_info
            strs = line.split("\\s*;\\s*");
            if ( strs.length != 8 )
            {
                reader.close();
                throw new Exception("Invalid app entry: " + line);
            }

            info.host = strs[0];
            info.aid = Integer.parseInt(strs[1]);
            info.jid = Integer.parseInt(strs[2]);
            info.start = date.parse(strs[3]).getTime()/1000;
            info.stop = date.parse(strs[4]).getTime()/1000;
            info.cmd = strs[5];
            info.procs = Integer.parseInt(strs[6]);
            try
            {
                info.err = Integer.parseInt(strs[7]);
            }
            catch( NumberFormatException e )
            {
                info.err = -1;
            }

            if ( info.start > latest )
            {
                job = null;

                it = m_graph.getVertices(Schema.JID,info.jid).iterator();
                if ( it.hasNext() )
                    job = it.next();

                if ( job == null )
                {
                    unk_count++;
                    continue;
                }

                app = m_graph.addVertex(null);

                ElementHelper.setProperties(app, Schema.TYPE, Schema.Type.APP.toInt(),
                        Schema.AID, info.aid,
                        Schema.HOST, info.host,
                        Schema.START, info.start,
                        Schema.STOP, info.stop,
                        Schema.CMD, info.cmd,
                        Schema.NODES, info.procs,
                        Schema.ERR, info.err );

                job.addEdge( Schema.COMP, app );

                count++;
            }
        }

        reader.close();
        m_graph.commit();

        a_output.object();
        a_output.key("apps").object();
        a_output.key("new").value(count);
        a_output.key("unkown").value(unk_count);
        a_output.endObject();
        a_output.endObject();
    }

    class DirNode
    {
        public DirNode()
        {
            sibling = null;
            child = null;
            nid = 0;
        }

        public String   name;
        public DirNode  parent;
        public DirNode  sibling;
        public DirNode  child;
        public long     nid;
    }

    private DirNode getDirNode( String[] a_path, DirNode a_root, boolean a_is_file )
    {
        DirNode node = a_root;
        int end = a_path.length - (a_is_file?1:0);
        Vertex v;

        for ( int p = 2; p < end; p++ )
        {
            // Find next node in children
            if ( node.child != null )
            {
                node = node.child;

                while ( true )
                {
                    if ( node.name.equals( a_path[p] ))
                        break;

                    if ( node.sibling != null )
                        node = node.sibling;
                    else
                    {
                        node.sibling = new DirNode();
                        node.sibling.parent = node.parent;
                        node.sibling.name = a_path[p];
                        v = m_graph.addVertex( null );
                        node.sibling.nid = (long) v.getId();
                        m_graph.getVertex( node.parent.nid ).addEdge( Schema.COMP, v );

                        node = node.sibling;
                        m_dir_size++;
                        break;
                    }
                }
            }
            else
            {
                // Parent has no children, create first child node
                node.child = new DirNode();
                node.child.parent = node;
                node.child.name = a_path[p];
                v = m_graph.addVertex( null );
                node.child.nid = (long) v.getId();
                m_graph.getVertex( node.nid ).addEdge( Schema.COMP, v );

                node = node.child;
                m_dir_size++;
            }
        }

        return node;
    }


    public void loadFiles( String a_files, String a_path, JSONStringer a_output  ) throws Exception
    {
        m_dir_size = 0;
        m_scratch_count = 0;

        long startTime = System.nanoTime();
        long endTime;
        double duration;

        String line;
        String[] strs;
        String[] path;
        long count = 0;
        long line_count = 0;
        long file_count = 0;
        int c2, l2;

        boolean  is_file;
        int      uid;
        int      gid;
        int      mode;
        String   name;
        long     ctime;
        long     mtime;
        Vertex   file;
        int     ppos;
        DirNode node;
        DirNode root = new DirNode();

        Iterator<Vertex> it = m_graph.getVertices("fpath","root").iterator();
        if ( it.hasNext())
            root.nid = (long)it.next().getId();
        else
            throw new Exception("Root file system node does not exist");

        if ( a_path == null )
            a_path = "/ROOT";

        BufferedReader reader = new BufferedReader( new FileReader( a_files ), 5000000 );

        l2 = a_path.length();

        try
        {
            while (( line = reader.readLine()) != null )
            {
                if (( ++line_count % 500000 ) == 0 )
                {
                    System.out.print( "." );
                    if (( line_count % 20000000 ) == 0 )
                    {
                        System.out.println( "\nline: " + line_count + ", files:" + file_count + ", dirs: " + m_dir_size );
                    }
                }

                // Ignore blank lines
                if ( line.length() == 0 || line.charAt( 0 ) == '#' )
                    continue;

                // Check root-path
                if (( ppos = line.lastIndexOf( '|' ) + 1 ) > 0 )
                {
                    if (( line.length() - ppos ) >= l2 )
                    {
                        for ( c2 = 0; c2 < l2; ++ppos, ++c2 )
                        {
                            if ( line.charAt( ppos ) != a_path.charAt( c2 ))
                                break;
                        }
                        if ( c2 < l2 )
                            continue;
                    }
                    else
                        continue;
                }


                //atime,ctime,mtime,uid,gid,mode,x,x,T,path
                strs = line.split("\\s*\\|\\s*");
                if ( strs.length != 10 )
                {
                    System.out.println("Invalid file entry (len: "+strs.length+"): [" + line + "]");
                    continue;
                }

                path = strs[9].split("\\s*/\\s*");

                name = path[path.length-1];
                ctime = Long.parseLong(strs[1]);
                mtime = Long.parseLong(strs[2]);
                uid = Integer.parseInt(strs[3]);
                gid = Integer.parseInt(strs[4]);
                if ( strs[5].length() > 2 )
                    mode = Integer.parseInt( strs[5].substring( strs[5].length() - 3 ), 8 );
                else
                    mode = 0;
                if ( strs[8].length() > 0 )
                    is_file = true;
                else
                    is_file = false;

                node = getDirNode( path, root, is_file );
                if ( node == null ) // Null means path was to a "scratch" directory - ignore these
                    continue;

                if ( is_file )
                {
                    file = m_graph.addVertex(null);
                    m_graph.getVertex( node.nid ).addEdge( Schema.COMP, file );
                    file_count++;
                }
                else
                {
                    file = m_graph.getVertex( node.nid );
                }

                ElementHelper.setProperties(file, Schema.TYPE, is_file?Schema.Type.FILE.toInt():Schema.Type.DIR.toInt(),
                        Schema.NAME, name,
                        Schema.CTIME, ctime,
                        Schema.MTIME, mtime,
                        Schema.XUID, uid,
                        Schema.XGID, gid,
                        Schema.FMODE, mode );

                count++;

                if (( count % 20000 ) == 0 )
                {
                    System.out.print( "C" );
                    m_graph.commit();

                    reader.mark( 5000000 );

                    if (( count % 200000 ) == 0 )
                    {
                        endTime = System.nanoTime();
                        duration = (endTime - startTime)*1e-9;

                        System.out.println( "\nline: " + line_count + ", files/sec: " + 1000000/duration + ", files:" + file_count + ", dirs: " + m_dir_size );
                        startTime = endTime;
                    }
                }
            }

            reader.close();
        }
        finally
        {
            reader.close();
        }

        a_output.object();
        a_output.key("files").object();
        a_output.key("new").value(count);
        a_output.endObject();
        a_output.endObject();
    }

    public void crawlJobs( long a_start, JSONStringer a_output )
    {
    }

}
