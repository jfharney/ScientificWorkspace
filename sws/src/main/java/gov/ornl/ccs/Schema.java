package gov.ornl.ccs;

public class Schema
{
    public enum Type
    {
        USER(0),
        GROUP(1),
        JOB(2),
        APP(3),
        FILE(4),
        DIR(5),
        TAG(6),
        EVENT(7),
        DOI(8);

        public static Type fromInt( int val ) throws Exception
        {
            switch ( val )
            {
            case 0: return USER;
            case 1: return GROUP;
            case 2: return JOB;
            case 3: return APP;
            case 4: return FILE;
            case 5: return DIR;
            case 6: return TAG;
            case 7: return EVENT;
            case 8: return DOI;
            }

            throw new Exception("Invalid Type conversion: " + val );
        }

        public Integer toInt()
        {
            return m_value;
        }

        private Integer m_value;

        private Type( int val )
        {
           m_value = val;
        }
    }

    public enum Status
    {
        IGNORE(0),
        REVIEW(1),
        REJECT(2),
        ACCEPT(3),
        REPORT(4);

        public static Status fromInt( int val ) throws Exception
        {
            switch ( val )
            {
            case 0: return IGNORE;
            case 1: return REVIEW;
            case 2: return REJECT;
            case 3: return ACCEPT;
            case 4: return REPORT;
            }

            throw new Exception("Invalid Status conversion: " + val );
        }

        public Integer toInt()
        {
            return m_value;
        }

        private Integer m_value;

        private Status( int val )
        {
           m_value = val;
        }
    }

    public enum Access
    {
        PRIVATE(0),
        SHARED(1),
        PUBLIC(2);

        public static Access fromInt( int val ) throws Exception
        {
            switch ( val )
            {
            case 0: return PRIVATE;
            case 1: return SHARED;
            case 2: return PUBLIC;
            }

            throw new Exception("Invalid Acecss conversion: " + val );
        }

        public Integer toInt()
        {
            return m_value;
        }

        private Integer m_value;

        private Access( int val )
        {
           m_value = val;
        }
    }

    public enum Event
    {
        OTHER_SHARED_TAG(1),
        OTHER_REVOKED_TAG(2),
        OTHER_SHARED_GROUP_TAG(3),
        OTHER_REVOKED_GROUP_TAG(4),
        OTHER_TAGGED_ASSET(5);
        //OTHER_ADDED_TO_GROUP(103),
        //OTHER_REMOVED_FROM_GROUP(104);

        public static Event fromInt( int val ) throws Exception
        {
            switch ( val )
            {
            case 1: return OTHER_SHARED_TAG;
            case 2: return OTHER_REVOKED_TAG;
            case 3: return OTHER_SHARED_GROUP_TAG;
            case 4: return OTHER_REVOKED_GROUP_TAG;
            case 5: return OTHER_TAGGED_ASSET;
            }

            throw new Exception("Invalid Status conversion: " + val );
        }

        public String describe()
        {
            switch ( m_value )
            {
            case 1: return "A user has shared a tag with you.";
            case 2: return "A user has revoked your access to a tag.";
            case 3: return "A user has shared a tag with a group that you belong to.";
            case 4: return "A user has revoked group access to a tag.";
            case 5: return "A user has tagged one of your assets.";
            }

            return "";
        }

        public Integer toInt()
        {
            return m_value;
        }

        private Integer m_value;

        private Event( int val )
        {
           m_value = val;
        }
    }

    // Vertex Properties
    public static final String TYPE     = "type";   // Node/vertex type
    public static final String SUBTYPE  = "subtype";// Arbitrary sub-type number
    public static final String UID      = "uid";    // POSIX User ID (users only)
    public static final String UNAME    = "uname";  // POSIX User name (users only)
    public static final String GID      = "gid";    // POSIX Group ID (groups only)
    public static final String GNAME    = "gname";  // POSIX Group Name (groups only)
    public static final String NAME     = "name";   // Name (generic)
    public static final String DESC     = "desc";   // Description (generic)
    public static final String TITLE    = "title";  // Title (generic)
    public static final String KEYWORDS = "keywd";  // Keywords (generic)
    public static final String EMAIL    = "email";  // Email (users only)
    public static final String START    = "start";  // Start time (jobs/apps)
    public static final String STOP     = "stop";   // Stop time (jobs/apps)
    public static final String CTIME    = "ctime";  // Change time (generic)
    public static final String MTIME    = "mtime";  // Modify time (generic)
    public static final String JID      = "jid";    // Job ID (jobs only)
    public static final String AID      = "aid";    // Application ID (apps only)
    public static final String HOST     = "host";   // Host name (jobs/apps)
    public static final String WALL     = "wall";   // Wall time (? job/app)
    public static final String ERR      = "err";    // Error code (job/app)
    public static final String NODES    = "nodes";  // Number of nodes (jobs/apps)
    public static final String CMD      = "cmd";    // Application command line (apps only)
    public static final String ACCESS   = "access"; // Access mode (tags only)
    public static final String FPATH    = "fpath";  // File path (file system root directories)
    public static final String XUID     = "xuid";   // Associated uid
    public static final String XGID     = "xgid";   // Associated gid
    public static final String FMODE    = "fmode";  // File mode
    public static final String FSIZE    = "fsize";  // File size
    public static final String STATUS   = "status"; // Indicates node requires user review
    public static final String DOI      = "doi"; // Indicates node requires user review


    // Injected "properties" (not stored in graph)
    public static final String NID      = "nid";        // Node ID (same as Vertex ID)
    public static final String ACLUIDS  = "acl-uids";    // User access control list (shared tags only)
    public static final String ACLGIDS  = "acl-gids";    // Group access control list (shared tags only)

    // Edge Labels
    public static final String ASSET    = "asst";   // Target is owned by source
    public static final String MEMBER   = "memb";   // Target is a member of source
    public static final String COMP     = "comp";   // Target is a component of source
    public static final String PROD     = "prod";   // Target is a product of source
    public static final String META     = "meta";   // Target is metadata (tag) of source
    public static final String CTXT     = "ctxt";   // Target is/defines context of source
}
