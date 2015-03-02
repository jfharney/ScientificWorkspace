from msgschema import MsgSchema_pb2, Connection
from common import utils

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
