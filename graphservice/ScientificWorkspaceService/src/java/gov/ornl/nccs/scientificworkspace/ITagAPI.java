package gov.ornl.nccs.scientificworkspace;

import org.json.JSONStringer;

public interface ITagAPI
{
	void getTagByName( String a_name, int a_uid, String a_properties, JSONStringer output );
	void getTagByUuid( String a_uuid, String a_properties, JSONStringer output );
	void getTags( int a_uid, String a_properties, JSONStringer output );
}
