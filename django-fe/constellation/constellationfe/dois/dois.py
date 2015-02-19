from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

from common import utils

import sys
sys.path.append('/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation/constellationfe')

tcp_connection = 'tcp://techint-b117:5555'

from msgschema import MsgSchema_pb2, Connection

import services
import transform

def doGetDoiZmq(request,user_id):
    
    print '-----use doiGet -----'
        
    api = Connection.cdsapi(tcp_connection)  
    user_oid = utils.getOidFromUserId(user_id)    
    header_token = 13366121
    include_meta = True
    include_links = True
     
    
    reply_type, reply = services.DOICmd_GetByUserWrapper(api,user_oid,header_token,include_meta,include_links)
    
    if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
          print 'doi get result classname: ' + str(classname)
          #print 'dirr... reply: ' + str((reply))
    
          #convert to string here
          res = transform.convertReplyToString(reply,user_oid)
    else:
          res = 'error'
    
    return res



def doPutDoiZmq(request,user_id):
    
    api = Connection.cdsapi('tcp://techint-b117:5555')   
    
    user_oid = utils.getOidFromUserId(user_id)
    
    print 'user_oid: ' + str(user_oid)
    
    
    #linked_oids = ["374898756"]
    linked_oids = ["580","1348","1860"]
    linked_oids = ["580","1348","2108992"] # last one is the user oid
    #create a doi data object
    
    
    header_token = 133121
    
    reply_type, reply = services.DOICmd_CreateWrapper(api,user_oid,linked_oids,header_token)
   
    
    if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
          print 'doi put resylt classname: ' + str(classname)
          #print 'header: \n' + str((reply.header))
          #print 'doi put reply: \n' + str((reply))
       
    
    
    
    print '\n\nend doiPut...\n\n'
    
    return "hello"



