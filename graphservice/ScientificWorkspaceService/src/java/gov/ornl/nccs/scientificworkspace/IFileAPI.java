package gov.ornl.nccs.scientificworkspace;

import org.json.JSONStringer;

public interface IFileAPI
{
    void getFilesByPath( String a_path, String a_gids, int a_depth, String a_properties, JSONStringer output );
}
