from msgschema import MsgSchema_pb2, Connection


def FileCmd_GetByPathWrapper(api,fsys_oid,path,user_oid,header_token):
    
    
    msg = MsgSchema_pb2.FileCmd_GetByPath()
    msg.header.token = header_token
    msg.fsys_oid = fsys_oid
    msg.path = path
    msg.user_oid = user_oid
    
    api.send( msg )
    
    return api.recv( 10000 )

def FileCmd_ListWrapper(api,user_oid,file_oid,header_token):
    
  print 'FileCmd_ListWrapper'
  msg = MsgSchema_pb2.FileCmd_List()
    
  msg.header.token = header_token
  msg.user_oid = user_oid
  msg.dir_oid = file_oid
    
  api.send( msg )
    
  return api.recv( 10000 )

