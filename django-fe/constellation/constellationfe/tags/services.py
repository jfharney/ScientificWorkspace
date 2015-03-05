from msgschema import MsgSchema_pb2, Connection
from common import utils
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