from msgschema import MsgSchema_pb2, Connection

import transform
    
def DOICmd_GetByUserWrapper(api,user_oid,include_meta,include_links,header_token):
    
    
    msg = MsgSchema_pb2.DOICmd_GetByUser()
    msg.user_oid = user_oid
    msg.header.token = header_token
    msg.inc_meta = include_meta
    msg.inc_links = include_links
    
        
    #submit to the 
    api.send( msg )
    
    return api.recv( utils.messaging_timeout )
    
    
def DOICmd_CreateWrapper(api,user_oid,linked_oids,metadata,header_token):
    
    doidatamsg = MsgSchema_pb2.DOIData()
    
    #linked_oids = ["374898756"]
    #linked_oids = ["580","1348","1860"]
    
    for i in range(0,len(linked_oids)):
            print 'appending ' + str(int(linked_oids[i]))
            doidatamsg.linked_oid.append(int(linked_oids[i]))
    
    print 'linkd_oids: ' + str(doidatamsg.linked_oid)
    
    
    
    
    #m_doi_metadata = transform.trasnformMetadataToXML()
    m_doi_metadata = transform.trasnformMetadataToXML(metadata)
    #m_doi_metadata = transform.trasnformMetadataToXML(title,description,creators,creators_email,contact_email,files,resources,keywords,language,sponsor_org)
    
    doidatamsg.metadata = m_doi_metadata
    
    
    msg = MsgSchema_pb2.DOICmd_Create()
    msg.user_oid = user_oid
    msg.header.token = header_token
    msg.doi_data.CopyFrom(doidatamsg)
      
    print '\n\nmsg\n' + str(msg)
    
    
    #submit to the 
    api.send( msg )
    
    return api.recv( utils.messaging_timeout )



