from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

from common import utils

import sys
sys.path.append(utils.path_append)


from msgschema import MsgSchema_pb2, Connection

import services
import transform

tcp_connection = utils.tcp_connection

def doGetDoiZmq(request,user_id):
    
    print '-----use doiGet -----'
        
    api = Connection.cdsapi(tcp_connection)  
    user_oid = utils.getOidFromUserId(user_id)    
    header_token = int(utils.DOIS_DOICmd_GetByUser_TOKEN)
    include_meta = False
    include_links = True
     
    msg = MsgSchema_pb2.DOICmd_GetByUser()
    
    
    if include_links == False:
        header_token = 222
    else:
        header_token = 333
    
    
    msg.user_oid = user_oid
    msg.header.token = header_token
    msg.inc_meta = include_meta
    msg.inc_links = include_links 
     
    print 'printoing msg: ' + str(msg)
        
    #submit to the 
    api.send( msg )
    
    #return api.recv( int(utils.messaging_timeout) )
    reply_type, reply = api.recv( int(utils.messaging_timeout) )
    
    #reply_type, reply = services.DOICmd_GetByUserWrapper(api,user_oid,include_meta,include_links,header_token)
    
    if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
          print 'doi get result classname: ' + str(classname)
          print 'dirr... reply: ' + str((reply))
    
          #convert to string here
          res = transform.convertReplyToString(reply,user_oid)
    else:
          res = 'error'
    
    return res



def doPutDoiZmq(request,user_id):
    
    api = Connection.cdsapi(tcp_connection)   
    
    user_oid = utils.getOidFromUserId(user_id)
    
    metadata = request
    
    print 'user_oid: ' + str(user_oid)
    
    #get the linked_oids here
    content = metadata.POST
    
    print 'request.body: ' + str(metadata.body)
    
    for key in content:
        print 'key:>>>>> ' + key + ' value>>>> ' + str(content[key])
        
    from django.utils import simplejson

    #array = simplejson.loads(request.POST['nids[]'])
    print 'array nids: ' + str(request.POST.getlist("nids[]"))
    
    for nid in request.POST.getlist("nids[]"):
        print 'nid: ' + str(nid)
    
    
    
    #get oids here
    #payload: {"title":"","description":"","creator_name":"Benjamin Jamroz","creator_email":"jamroz@ucar.edu","contact_email":"jamroz@ucar.edu","resources":"","keywords":"","language":"English","sponsor_org":"Oak Ridge National Laboratory","files":"[u'/stf006']","nids":["[u'324']"],"creator_nid":"35460"}
   
    #linked_oids = ["374898756"]
    linked_oids = ["580","1348","1860"]
    linked_oids = ["580","1348","2108992"] # last one is the user oid
    #create a doi data object
    
    
    header_token = int(utils.DOIS_DOICmd_Create_TOKEN)
    
    reply_type, reply = services.DOICmd_CreateWrapper(api,user_oid,linked_oids,metadata,header_token)
   
    doi_number = ''
    
    if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
          print 'doi put resylt classname: ' + str(classname)
          #print 'header: \n' + str((reply.header))
          print 'doi put reply: \n' + str((reply))
          doi_number = reply.dois[0].number
       
    
    
    
    print '\n\nend doiPut...\n\n'
    
    return doi_number



