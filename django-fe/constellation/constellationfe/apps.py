from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

from common import utils

import sys
sys.path.append('/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation/constellationfe')

from msgschema import MsgSchema_pb2, Connection

def useAppDefault(request,user_id):
    data_arr = []
    data = {}
    data["title"] = '001'
    data["type"] = '3'
    data["appid"] = '001'
    data["jobid"] = 'jid1'
    data["nid"] = '0011'

    data_arr.append(data)
    
    return data_arr

def useGetAppZmq(request,job_id):
    
    if utils.appFlag:
        print '-----in use get AppZMQ-----'
        print 'job_id: ' + job_id
    
    #get the user_oid
    #user_oid = utils.getOidFromUserId(user_id)
    #print 'user_oid: ' + str(user_oid)
    
    #bind to the socket
    api = Connection.cdsapi('tcp://techint-b117:5555')
  
    #print 'dir...' + str(dir(MsgSchema_pb2))
    
    #obtain message object and bind the group oid and header token
    msg = MsgSchema_pb2.AppCmd_GetByJob()
    msg.header.token = 91
    msg.job_oid = int(job_id)
    
    #Send request (asynchronous, will fail if required fields are missing)
    api.send( msg )

    #Get a reply (wait up to 10 seconds)
    reply_type, reply = api.recv( 10000 )


    app_oids = []
    app_names = []
    
    if reply_type > 0:
        
        classname = api.getMessageTypeName( reply_type )
        
        if utils.appFlag:
            print 'type: ' + classname
        
        if classname == 'AppDataMsg':
            for app in reply.apps:
                
                app_oids.append(app.oid)
                app_names.append(app.aid)
                
                if utils.appFlag:
                    print '\tapp oid: ' + str(app.oid)
                #print 'job oid: ' + str(job.oid)
                #job_oids.append(job.oid)
                if utils.appFlag:
                    print '\t\tapp id: ' + str(app.aid)
            
    else:
        print 'there is no reply'
    
    
    res = convertJobMsgToJSONString(app_names,app_oids,job_id)
    
    if utils.appFlag:
        print 'app result: ' + res
    
    
    if utils.appFlag:
        print '-----end use get AppZMQ-----'
    
    return res

    


def convertJobMsgToJSONString(app_names,app_oids,job_id):
    
    counter = 0
    res = '['
    
    for i in range(0,(len(app_oids)-1)):
      counter = counter + 1
 
      tempres = '{' 
      tempres += '"title" : "' + str(app_names[i]) + '", '
      tempres += '"type" : ' + '2, '
      tempres += '"appid" : "' + str(app_names[i]) + '", '
      tempres += '"job_id" : "' + job_id + '", '
      tempres += '"nid" : "' + str(app_oids[i]) + '"'
      tempres += '}'
    
    
      if counter == len(app_oids)-1:
          res += tempres
      else:
          res += tempres + ' , '
  
    res += ']'  
    
    return res

    
def useGetAppHttp(request,job_id):
    
    data = urllib2.urlopen("http://" + serviceHost + ":" + servicePort + "/sws/apps?jid=" + job_id).read()
    jsonObjArr = json.loads(data)
      
    respArr = []
      
    for app in jsonObjArr:
        #print 'app: ' + str(app)
        respObj = {

            'title' : app['aid'],
            'type' : '3',
            'appid' : app['aid'],
            'jobid' : job_id,
            'nid' : app['nid']

        }

        respArr.append(respObj)
    
    return respArr