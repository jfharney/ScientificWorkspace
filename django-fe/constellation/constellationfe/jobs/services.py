from msgschema import MsgSchema_pb2, Connection


def JobCmd_GetByUserWrapper(api,user_oid,header_token):
    #obtain message object and bind the group oid and header token
    msg = MsgSchema_pb2.JobCmd_GetByUser()
    msg.header.token = header_token
    msg.user_oid = user_oid
    
    
    #submit to the 
    api.send( msg )
    
    #reply_type, reply = api.recv( 10000 )
    return api.recv( 10000 )