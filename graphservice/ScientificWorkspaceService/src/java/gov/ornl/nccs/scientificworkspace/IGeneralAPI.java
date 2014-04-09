package gov.ornl.nccs.scientificworkspace;

import org.json.JSONStringer;

public interface IGeneralAPI
{
    void getObjectByNID( int a_nid, String a_properties, JSONStringer output );
}
