package gov.ornl.nccs.scientificworkspace;

import org.json.JSONStringer;

public interface IApplicationAPI
{
	void getAppByUuid( String a_uuid, String a_properties, JSONStringer output );
	void getAppById( int a_jid, int a_aid, String a_properties, JSONStringer output );
	void getAppsByJob( int a_jid, String a_properties, JSONStringer output );
}
