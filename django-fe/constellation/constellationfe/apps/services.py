
from msgschema import MsgSchema_pb2, Connection

from common import utils

def AppCmd_GetByJobWrapper(api,job_id,header_token):
    
    #obtain message object and bind the group oid and header token
    msg = MsgSchema_pb2.AppCmd_GetByJob()
    msg.header.token = header_token
    msg.job_oid = int(job_id)
    
    #submit to the 
    api.send( msg )
    
    return api.recv( utils.messaging_timeout )