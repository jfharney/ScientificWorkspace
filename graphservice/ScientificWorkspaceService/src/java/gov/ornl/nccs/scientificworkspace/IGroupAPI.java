package gov.ornl.nccs.scientificworkspace;

import org.json.JSONStringer;

public interface IGroupAPI
{
	void getGroupsByUid( int a_uid, String a_properties, JSONStringer output );
	void getGroupByGid( int a_gid, String a_properties, JSONStringer output );
	void getGroupByUuid( String a_uuid, String a_properties, JSONStringer output );
}
