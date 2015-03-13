from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2


from common import utils

import sys
sys.path.append(utils.path_append)

tcp_connection = utils.tcp_connection

from msgschema import MsgSchema_pb2, Connection


def workspace(request,user_id):

    from servicewrappers import services
    
    api = Connection.cdsapi(tcp_connection)
    uname = user_id
    header_token = 8888
    
    reply_type, reply = services.UserCmd_GetByUNAMEWrapper(api,uname,header_token)
    
    user = None
    
    if reply_type > 0:
        classname = api.getMessageTypeName( reply_type )
        
        if classname == 'UserDataMsg':
            print 'in user data msg'
            for user in reply.users:
                user = user
                print 'user: ' + str(user)
                '''
                user: oid: 2108992
                uid: 9328
                uname: "jamroz"
                name: "Benjamin Jamroz"
                email: "jamroz@ucar.edu"
                '''
    return user
    
    
    
    