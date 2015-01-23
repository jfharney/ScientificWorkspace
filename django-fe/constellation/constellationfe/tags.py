from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

def useGetTagHttp(request,uid):
    
    path = request.GET.get('path')
    
    url = "http://" + serviceHost + ":" + servicePort + "/sws/tags?uid=" + str(uid)
    
    #print 'url: ' + url
    
    data = urllib2.urlopen(url).read()
      
    #print 'data from url call: ' + data
    
    jsonObj = json.loads(data)
    
    return jsonObj


def useGetTagLinkHttp(request,tag_id):
    
    #print 'tag_id: ' + tag_id
    
    url = "http://" + serviceHost + ":" + servicePort + "/sws/nodes?tag-nid=" + str(tag_id)
    
    #print 'url: ' + url
    
    data = urllib2.urlopen(url).read()
    
    #print '\n\ntag associatsions data: \n\t' + data
    
    jsonObj = json.loads(data)
    
    return jsonObj
    



