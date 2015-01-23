from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

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