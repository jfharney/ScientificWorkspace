package gov.ornl.nccs.scientificworkspace;

import org.json.JSONStringer;

public interface IUserAPI
{
	void getUserByUID( int a_uid, String a_properties, JSONStringer output );
	void getUserByUname( String a_uname, String a_properties, JSONStringer output );
	void getUsersByGID( int a_gid, String a_properties, JSONStringer output );
}
