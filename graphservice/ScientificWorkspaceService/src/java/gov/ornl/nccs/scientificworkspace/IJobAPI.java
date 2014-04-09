package gov.ornl.nccs.scientificworkspace;

import org.json.JSONStringer;

public interface IJobAPI
{
	void getJobByJID( int a_jid, String a_properties, JSONStringer output );
	void getJobs( int a_uid, String a_properties, JSONStringer output );
}
