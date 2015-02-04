from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2


from common import utils

import sys
sys.path.append('/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation/constellationfe')

from msgschema import MsgSchema_pb2, Connection



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



def useGetJobZmq(request,user_id):
    
    if utils.jobFlag:
        print '-----in use get JobZMQ-----'
    
    #get the user_oid
    user_oid = utils.getOidFromUserId(user_id)
    
    if utils.jobFlag:
        print 'user_oid: ' + str(user_oid)
    
    #bind to the socket
    api = Connection.cdsapi('tcp://techint-b117:5555')
  
    
    #obtain message object and bind the group oid and header token
    msg = MsgSchema_pb2.JobCmd_GetByUser()
    msg.header.token = 9
    msg.user_oid = user_oid
    
    
    #Send request (asynchronous, will fail if required fields are missing)
    api.send( msg )
    
    #Get a reply (wait up to 10 seconds)
    reply_type, reply = api.recv( 10000 )

    
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
    res = convertJobMsgToJSONString(job_names,job_jids,job_oids)
    
    
    if utils.jobFlag:
        print '\njobs result\n: ' + res
        print '-----end use get JobZMQ-----'
    
    
    return res
    
    
    
    
    
    
    
def convertJobMsgToJSONString(job_names,job_jids,job_oids):
    counter = 0
    res = '['
  
    for i in range(0,(len(job_oids)-1)):
      counter = counter + 1
 
    
      tempres = '{' 
      tempres += '"title" : "' + str(job_names[i]) + '", '
      tempres += '"isFolder" : ' + 'true, '
      tempres += '"isLazy" : ' + 'true, '
      tempres += '"type" : ' + '2, '
      tempres += '"jobid" : "' + str(job_jids[i]) + '", '
      tempres += '"tooltip" : ' + '"tooltip", '
      tempres += '"nid" : "' + str(job_oids[i]) + '"'
      tempres += '}'
    
    
      if counter == len(job_oids)-1:
          res += tempres
      else:
          res += tempres + ' , '
  
    res += ']'  
    
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