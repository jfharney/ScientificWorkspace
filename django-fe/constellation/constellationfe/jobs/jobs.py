from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2


from common import utils

import sys
sys.path.append('/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation/constellationfe')

tcp_connection = utils.tcp_connection

from msgschema import MsgSchema_pb2, Connection

import services
import transform

def useGetJobZmq(request,user_id):
    
    if utils.jobFlag:
        print '-----in use get JobZMQ-----'
    
    #bind to the socket
    api = Connection.cdsapi(tcp_connection)
    
    #get the user_oid
    user_oid = utils.getOidFromUserId(user_id)
    header_token = int(utils.JOBS_JobCmd_GetByUser_TOKEN)
    
    reply_type, reply = services.JobCmd_GetByUserWrapper(api,user_oid,header_token)
    
    
    job_oids = []
    job_jids = []
    job_names = []
    
    if reply_type > 0:
        classname = api.getMessageTypeName( reply_type )
        
        if utils.jobFlag:
            print 'type: ' + classname
        
        if classname == 'JobDataMsg':
            for job in reply.jobs:
                
                job_oids.append(job.oid)
                
                if utils.jobFlag:
                    print '\tjob oid: ' + str(job.oid)
                    print '\t\tjob id: ' + str(job.jid)
                    print '\t\tjob name: ' + str(job.name)
                    
                job_jids.append(job.jid)
                job_names.append(job.name)
            
    else:
        print 'there is no reply'
          
    #convert the properties of message to the string sent back to the    
    res = transform.convertJobMsgToJSONString(job_names,job_jids,job_oids)
    
    
    if utils.jobFlag:
        print '\njobs result\n: ' + res
        print '-----end use get JobZMQ-----'
    
    
    return res
    
    
    
    
    
    
    



    

def useGetJobHttp(request,user_id):
    
    data = urllib2.urlopen("http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/jobs?uid=" + user_id).read()

    #print 'jobsproxy data: ' + str(data)

    
    jobJidArr = []
    jobJidArr = json.loads(data)
    
    respArr = []
    for job in jobJidArr:
        #print 'job: ' + str(job)
        tooltip = 'tooltip for job'
        
        respObj = {
          "title" : job['name'],
          "isFolder" : 'true',
          "isLazy" : 'true',
          "type" : '2',
          "jobid" : job['jid'],
          "tooltip" : tooltip,
          "nid" : job['nid']
        }
        respArr.append(respObj)
    
    return respArr

def useJobDefault(request,user_id):
    
    data_arr = []
    data = {}
      
    data['title'] = "|stf007"
    data['isFolder'] = 'true'
    data['isLazy'] = 'true'
    data['path'] = "|stf007"
    data['nid'] = '5955656'
      
    data_arr.append(data)
  
    data['title'] = "|stf006"
    data['isFolder'] = 'true'
    data['isLazy'] = 'true'
    data['path'] = "|stf006"
    data['nid'] = '99296'
    
    data_arr.append(data)
    
    return data_arr 
