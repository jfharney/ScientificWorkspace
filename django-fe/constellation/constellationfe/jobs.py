from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

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
 
def useGetJobHttp(request,user_id):
    
    data = urllib2.urlopen("http://" + serviceHost + ":" + servicePort + "/sws/jobs?uid=" + user_id).read()

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