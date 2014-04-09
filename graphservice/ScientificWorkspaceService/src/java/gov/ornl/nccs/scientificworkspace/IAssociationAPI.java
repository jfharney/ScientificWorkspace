package gov.ornl.nccs.scientificworkspace;

import org.json.JSONStringer;

public interface IAssociationAPI
{
	void getAssociationByUuid( String a_uuid, String a_properties, JSONStringer output );
	void getAsspciationsByNode( String a_uuid, String a_properties, JSONStringer output );
}
