from msgschema import MsgSchema_pb2, Connection
from common import utils

def JobCmd_GetByUserWrapper(api,user_oid,header_token):
    #obtain message object and bind the group oid and header token
    msg = MsgSchema_pb2.JobCmd_GetByUser()
    msg.header.token = header_token
    msg.user_oid = user_oid
    
    
    #submit to the 
    api.send( msg )
    
    return api.recv( int(utils.messaging_timeout) )




def AppCmd_GetByJobWrapper(api,job_id,header_token):
    
    print 'in AppCmd_GetByJobWrapper'
    
    #obtain message object and bind the group oid and header token
    msg = MsgSchema_pb2.AppCmd_GetByJob()
    msg.header.token = header_token
    msg.job_oid = int(job_id)
    
    #submit to the 
    api.send( msg )
    
    return api.recv( int(utils.messaging_timeout) )






def GroupCmd_GetByUserWrapper(api,user_oid,header_token):
    
  #print 'GroupCmd_GetByUserWrapper'
  msg = MsgSchema_pb2.GroupCmd_GetByUser()
  msg.header.token = header_token
  msg.user_oid = user_oid
    
  #Send request (asynchronous, will fail if required fields are missing)
  api.send( msg )
  
  return api.recv( int(utils.messaging_timeout) )

def UserCmd_GetByGroupWrapper(api,group_oid,header_token):
  #print 'UserCmd_GetByGroupWrapper'
    
  #obtain message object and bind the group oid and header token
  msg = MsgSchema_pb2.UserCmd_GetByGroup()
  msg.header.token = header_token
  msg.group_oid = group_oid
    
  #Send request (asynchronous, will fail if required fields are missing)
  api.send( msg )

  #Get a reply (wait up to 10 seconds)
    
  return api.recv( int(utils.messaging_timeout) )
  
  
  
  
  
  
def FileCmd_GetByPathWrapper(api,fsys_oid,path,user_oid,header_token):
    
    
    msg = MsgSchema_pb2.FileCmd_GetByPath()
    msg.header.token = header_token
    msg.fsys_oid = fsys_oid
    msg.path = path
    msg.user_oid = user_oid
    
    api.send( msg )
    
    return api.recv( int(utils.messaging_timeout) )

def FileCmd_ListWrapper(api,user_oid,file_oid,header_token):
    
  #print 'FileCmd_ListWrapper'
  msg = MsgSchema_pb2.FileCmd_List()
    
  msg.header.token = header_token
  msg.user_oid = user_oid
  msg.dir_oid = file_oid
    
  api.send( msg )
    
  return api.recv( int(utils.messaging_timeout) )


  
  
  
  
def TagCmd_GetByUserWrapper(api,user_oid,header_token):
    msg = MsgSchema_pb2.TagCmd_GetByUser()
    msg.header.token = header_token
    msg.user_oid = user_oid
    
    api.send( msg )
    
    return api.recv( int(utils.messaging_timeout) )

def TagCmd_AttachWrapper(api,tag_oid,resource_oids,header_token):
    
    msg = MsgSchema_pb2.TagCmd_Attach()
    msg.header.token = header_token
    msg.tag_oid = int(tag_oid)
    
    for i in range(0,len(resource_oids)):
        #resource_oids[i] = int(resource_oids[i])
        #msg.object_oids[i] = resource_oids[i]
        #print 'appending ' + str(int(resource_oids[i]))
        msg.object_oids.append(int(resource_oids[i]))
                
    
    import time
    time.sleep(10)
        
    #submit to the 
    api.send( msg )
    
    return api.recv( int(utils.messaging_timeout) )

def TagCmd_GetAttachedObjectWrapper(api,tag_oid,header_token):
    
    #print 'in attached obj wrapper for ' + str(tag_oid) + '...'
    msg = MsgSchema_pb2.TagCmd_GetAttachedObject()
    msg.tag_oid = tag_oid
    msg.header.token = header_token
      
    api.send( msg )
    
    return api.recv( int(utils.messaging_timeout) )


def TagCmd_CreateWrapper(api,tag_name,tag_description,user_oid,header_token):
    tag_data = MsgSchema_pb2.TagData()
    tag_data.name = tag_name
    tag_data.desc = tag_description

    msg = MsgSchema_pb2.TagCmd_Create()
    msg.header.token = header_token
    msg.user_oid = user_oid
    msg.tag_data.CopyFrom(tag_data)
    
    
    api.send( msg )
    return api.recv( int(utils.messaging_timeout) )  
  
  
def DOICmd_GetWrapper(api,doi_oid,include_links,include_meta,header_token):
    msg = MsgSchema_pb2.DOICmd_Get()
    
    msg.doi_oid = int(doi_oid)
    msg.inc_links = include_links
    msg.inc_meta = include_meta
    msg.header.token = header_token
    
    api.send(msg)
    
    return api.recv( int(utils.messaging_timeout) )  




def DOICmd_CreateWrapper(api,user_oid,linked_oids,metadata,header_token):
    
    doidatamsg = MsgSchema_pb2.DOIData()
    
    #linked_oids = ["374898756"]
    #linked_oids = ["580","1348","1860"]
    
    for i in range(0,len(linked_oids)):
            #print 'appending ' + str(int(linked_oids[i]))
            doidatamsg.linked_oid.append(int(linked_oids[i]))
    
    #print 'linkd_oids: ' + str(doidatamsg.linked_oid)
    
    
    
    
    #m_doi_metadata = transform.trasnformMetadataToXML()
    m_doi_metadata = transform.trasnformMetadataToXML(metadata)
    #m_doi_metadata = transform.trasnformMetadataToXML(title,description,creators,creators_email,contact_email,files,resources,keywords,language,sponsor_org)
    
    doidatamsg.metadata = m_doi_metadata
    
    
    msg = MsgSchema_pb2.DOICmd_Create()
    msg.user_oid = user_oid
    msg.header.token = header_token
    msg.doi_data.CopyFrom(doidatamsg)
      
    print '\n\nmsg\n' + str(msg) + '\n\n'
    
    
    #submit to the 
    api.send( msg )
    
    return api.recv( int(utils.messaging_timeout) )






def UserCmd_GetByUNAMEWrapper(api,uname,header_token):
    
    msg = MsgSchema_pb2.UserCmd_GetByUNAME()
    msg.header.token = header_token
    msg.uname = uname   
    
    api.send( msg )
    
    return api.recv( int(utils.messaging_timeout) )
    
    
    
    
  
