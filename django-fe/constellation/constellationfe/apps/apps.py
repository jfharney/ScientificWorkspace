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
    api = Connection.cdsapi(tcp_connection)
  
    #print 'dir...' + str(dir(MsgSchema_pb2))
    
    
    header_token = int(utils.APPS_AppCmd_GetByJob_TOKEN) #91
    reply_type, reply = services.AppCmd_GetByJobWrapper(api,job_id,header_token)

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
    
    print 'app_oids: ' + str(app_oids) + ' appnames: ' + str(app_names)
    res = transform.convertJobMsgToJSONString(app_names,app_oids,job_id)
    
    if utils.appFlag:
        print 'app result: ' + res
    
    
    if utils.appFlag:
        print '-----end use get AppZMQ-----'
    
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