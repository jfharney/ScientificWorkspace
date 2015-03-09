from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

from common import utils

import sys
sys.path.append(utils.path_append)


from msgschema import MsgSchema_pb2, Connection

from servicewrappers import services
import transform

tcp_connection = utils.tcp_connection

def doi(request,user_id):
    
    resp = ''
    print 'in dois.doi for user_id: ' + user_id

    user_oid = utils.getOidFromUserId(user_id)
    print 'user oid: ' + str(user_oid)
    
    #data = urllib2.urlopen("http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/user?uname=" + user_id).read()

    #data_json = json.loads(data)
      
      
    #print 'data_json: ' + str(data_json)
    
    api = Connection.cdsapi(str(tcp_connection))
    header_token = 222
    reply_type, reply = services.UserCmd_GetByUNAMEWrapper(api,user_id,header_token)
    
    user_oid = ''  
    uid = ''
    uname = ''
    name = ''
    email = ''
    
  
    if reply_type > 0:
        #print 'there is a reply'
    
        classname = api.getMessageTypeName( reply_type )
        
        #print 'message type: ', classname
        #if userFlag:
        #    printReplyErrorInfo(reply)
        
        if classname == 'UserDataMsg':
            #print '\nUser message\n'
            for user in reply.users:
                print 'user: ' + str(user)
                user_oid = user.oid
                uid = user.uid
                name = user.name
                email = user.email
                
        else:
            print 'No print code for this message type yet'
    else:
        print 'there is no reply for the user id'
    
    
    nid = user_oid
    type = 0
    uname = user_id
    
    
    
    creator_nid = nid
    
    resp = {}
    resp['uname'] = uname
    for key in request.POST:
        if key == 'fileNames':
            resp[key] = request.POST.getlist('fileNames')
        elif key == 'nids':
            resp[key] = request.POST.getlist('nids')
        elif key == 'appIds':
            resp[key] = request.POST.getlist('appIds')
        elif key == 'jobNames':
            resp[key] = request.POST.getlist('jobNames')
        elif key == 'groupNames':
            resp[key] = request.POST.getlist('groupNames')
        elif key == 'personNames':
            resp[key] = request.POST.getlist('personNames')
        else:
            resp[key] = request.POST[key]
        print 'key: ' + key + ' value: ' + request.POST[key]
        
        
    
    
    return resp
    

def doi_meta(request,user_id):
    
    res = ''
    
    #bind to the socket
    api = Connection.cdsapi(str(tcp_connection))
    
    doi_oid = request.GET.get('doi_oid')
    print 'doi_oid<><><><><>: ' + doi_oid
    
    user_oid = utils.getOidFromUserId(user_id)   
    header_token = int(utils.DOIS_DOICmd_GetByUser_TOKEN)
    #print 'header_token: ' + str(header_token)
    include_meta = True
    include_links = False
    
    reply_type, reply = services.DOICmd_GetWrapper(api,doi_oid,include_links,include_meta,header_token)
    
    
    
    if reply_type > 0:
        metadata = reply.dois[0].metadata
        #print '\n\nlen: ' + str(len(reply.dois)) + '\n\n\n'
        
        for i in range(0,(len(reply.dois))):
            #print 'doi_oid: ' + str(doi_oid) + ' ' + str(len(str(doi_oid))) + ' dois[i].oid: ' + str(reply.dois[i].oid) + ' ' + str(len(str(reply.dois[i].oid)))
            if str(reply.dois[i].oid) == str(doi_oid):
                #print 'here' 
                res = '['
                
                metadata = reply.dois[i].metadata
                d = json.loads(metadata)
                metadata_properties = d[0]
                tempres = ''
                tempres += getMetadataChildren(metadata_properties)
                res += tempres
                
                res += ']'  
                
                
            else:
                print 'the dois dont match'
                
        
        
    else:
        print 'no reply.dois'
    
    return res

def doi_linkedobjs(request,user_id):
    
    print 'in dois...doi_linkedobjs'
    
    #from dois import dois,services,transform
    
    #bind to the socket
    api = Connection.cdsapi(str(tcp_connection))
    
    doi_oid = request.GET.get('doi_oid')
    print 'doi_oid<><><><><>: ' + doi_oid
    
    user_oid = utils.getOidFromUserId(user_id)   
    header_token = int(utils.DOIS_DOICmd_GetByUser_TOKEN)
    #print 'header_token: ' + str(header_token)
    include_meta = False
    include_links = True
    
    
    reply_type, reply = services.DOICmd_GetWrapper(api,doi_oid,include_links,include_meta,header_token)
    
   
    
    if reply_type > 0:
        print '\n\nlen: ' + str(len(reply.dois)) + '\n\n\n'
        
        for i in range(0,(len(reply.dois))):
            res = '['
                
            linked_objs = reply.dois[i].linked_oid
            print 'linked_objs: ' + str(linked_objs)
            tempres = ''
            tempres += getLinkedChildren(linked_objs,user_oid)
            
            res += tempres
            res += ']'
       
        
    else:
        print 'no reply.dois'
    
    
    return res

def getMetadataChildren(metadata_properties):
    
    tempres = ''
    for property in metadata_properties:
            #print 'property: ' + property
            if property == 'fields':
                
                #print str(len(metadata_properties['fields']))
                counter = 0
                for field in metadata_properties['fields']:
                    #print '\tfield: ' + field
        
                    counter = counter+1
                    tempres +=   '{' + '\n'
                    span = '<span style="position:relative">Language: <span style="position:absolute; left:100px;">English</span></span>'
                    tempres +=       '"title" : "' + field + ' : ' + str(metadata_properties['fields'][field]) + '" , ' + '\n'
                    #tempres +=       '"title" : "span stuff here" , ' + '\n'
                    tempres +=       '"isFolder" : false'  + '\n'
                    tempres +=   '}'
                    if counter < len(metadata_properties['fields']):
                        tempres += ','
                    else:
                        tempres += '\n'
        
    
    return tempres



def getLinkedChildren(linked_objs,user_oid):
 
    oid_test = True
 
    tempres = ''
    
    print 'linked_objs: ' + str(linked_objs)
    
    if oid_test:
        api = Connection.cdsapi(tcp_connection)  
        
        msg = MsgSchema_pb2.Cmd_GetByOID()
        msg.header.token = 3333
        for linked_obj in linked_objs:
            #resource_oids[i] = int(resource_oids[i])
            #msg.object_oids[i] = resource_oids[i]
            #print 'appending ' + str(int(linked_obj))
            msg.oids.append(int(linked_obj))
          
        #submit to the 
        api.send( msg )
            
        reply_type, reply = api.recv( int(utils.messaging_timeout) )
        
        numRecords = 0
        
        if reply_type > 0:
              #print 'there is a reply for file command list'
              classname = api.getMessageTypeName( reply_type )
              #print 'dget linked children classname: ' + str(classname)
              if classname == 'CompoundDataMsg':
                 #print 'CompoundDataMsg'
                 #print 'reply: ' + str(reply)   
                 i = 0
                 
                 
                 #users   
                 for i in range(0,(len(reply.users))):
                     numRecords = numRecords + 1
                     tempres +=   '{' + '\n'
                     tempres +=     '"title" : "' + 'user: ' + str(reply.users[i].name) + '", ' + '\n'
                     tempres +=     '"isFolder" : false ' + '\n'
                     tempres += '}' + '\n'    
                 
                 #groups
                 for i in range(0,(len(reply.groups))):
                     numRecords = numRecords + 1
                     tempres +=   '{' + '\n'
                     tempres +=     '"title" : "' + 'group: ' + str(reply.groups[i].gname) + '", ' + '\n'
                     tempres +=     '"isFolder" : false ' + '\n'
                     tempres += '}' + '\n'    
                 
                 #jobs
                 for i in range(0,(len(reply.jobs))):
                     numRecords = numRecords + 1
                     tempres +=   '{' + '\n'
                     tempres +=     '"title" : "' + 'job: ' + str(reply.jobs[i].name) + '", ' + '\n'
                     tempres +=     '"isFolder" : false ' + '\n'
                     tempres += '}' + '\n'  
                
                 #apps
                 for i in range(0,(len(reply.apps))):
                     numRecords = numRecords + 1
                     tempres +=   '{' + '\n'
                     tempres +=     '"title" : "' + 'app: ' + str(reply.apps[i].aid) + '", ' + '\n'
                     tempres +=     '"isFolder" : false ' + '\n'
                     tempres += '}' + '\n'  
                
                 #files
                 for i in range(0,(len(reply.files))):
                     numRecords = numRecords + 1
                     tempres +=   '{' + '\n'
                     tempres +=     '"title" : "' + 'file: ' + str(reply.files[i].name) + '", ' + '\n'
                     tempres +=     '"isFolder" : false ' + '\n'
                     tempres += '}' + '\n'
                
                 #tags
                 for i in range(0,(len(reply.tags))):
                     numRecords = numRecords + 1
                     tempres +=   '{' + '\n'
                     tempres +=     '"title" : "' + 'tag: ' + str(reply.tags[i].name) + '", ' + '\n'
                     tempres +=     '"isFolder" : false ' + '\n'
                     tempres += '}' + '\n'  
                
                 #dois
                 for i in range(0,(len(reply.dois))):
                     numRecords = numRecords + 1
                     tempres +=   '{' + '\n'
                     tempres +=     '"title" : "' + 'doi: ' + str(reply.dois[i].name) + '", ' + '\n'
                     tempres +=     '"isFolder" : false ' + '\n'
                     tempres += '}' + '\n'  
                
    else:
       print 'in oid test'
       numRecords = len(linked_objs)
       for i in range(0,(len(linked_objs))):
           tempres +=   '{' + '\n'
           tempres +=     '"title" : "' + 'doi: ' + str(linked_objs[i]) + '", ' + '\n'
           tempres +=     '"isFolder" : false ' + '\n'
           tempres += '}' + '\n' 
            
    #print 'numRecords: ' + str(numRecords)
    tempres = tempres.replace('}','},',(numRecords-1))
    #print '\n\ntempres:\n' + tempres + '\n\n'
    
    
    return tempres





def doGetDoiZmq(request,user_id):
    
    #print '-----use doiGet -----'
        
    api = Connection.cdsapi(tcp_connection)  
    user_oid = utils.getOidFromUserId(user_id)    
    header_token = int(utils.DOIS_DOICmd_GetByUser_TOKEN)
    include_meta = False
    include_links = False
     
    msg = MsgSchema_pb2.DOICmd_GetByUser()
    
    
    if include_links == False:
        header_token = 222
    else:
        header_token = 333
    
    
    msg.user_oid = user_oid
    msg.header.token = header_token
    msg.inc_meta = include_meta
    msg.inc_links = include_links 
     
    #print 'printoing msg: ' + str(msg)
        
    #submit to the 
    api.send( msg )
    
    #return api.recv( int(utils.messaging_timeout) )
    reply_type, reply = api.recv( int(utils.messaging_timeout) )
    
    #reply_type, reply = services.DOICmd_GetByUserWrapper(api,user_oid,include_meta,include_links,header_token)
    
    if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
          #print 'doi get result classname: ' + str(classname)
          #print 'dirr... reply: ' + str((reply))
    
          #convert to string here
          res = transform.convertReplyToString(reply,user_oid)
    else:
          res = 'error'
    
    return res



def doPutDoiZmq(request,user_id):
    
    api = Connection.cdsapi(tcp_connection)   
    user_oid = utils.getOidFromUserId(user_id)
    metadata = request
    
    
    #print 'user_oid: ' + str(user_oid)
    
    #print 'request.body: ' + str(metadata.body)
    #for key in content:
    #    print 'key:>>>>> ' + key + ' value>>>> ' + str(content[key])
    
    #get the linked_oids here
    
    content = metadata.POST
    
    linked_oids = []
    
                                             
    
    for nid in request.POST.getlist("nids[]"):
        linked_oids.append(str(nid))
    

    #array = simplejson.loads(request.POST['nids[]'])
    #print 'new_linked_oids: ' + str(linked_oids)
    
    
    
    header_token = int(utils.DOIS_DOICmd_Create_TOKEN)
    
    print 'dirrrr'
    print str(dir(services))
    reply_type, reply = services.DOICmd_CreateWrapper(api,user_oid,linked_oids,metadata,header_token)
   
    doi_number = ''
    
    if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
          #print 'doi put resylt classname: ' + str(classname)
          #print 'header: \n' + str((reply.header))
          #print 'doi put reply: \n' + str((reply))
          doi_number = reply.dois[0].number
     
    
    
    
    print '\n\nend doiPut...\n\n'
    
    return doi_number


def convertUtoStr():
    return ''
