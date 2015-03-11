# Create your views here.


from django.http import HttpResponse
from django.template import RequestContext, loader
import json

from celery import Celery

from app1 import tasks

from common import utils
  
testFlag = False
import urllib2
import urllib
    
tcp_connection = utils.tcp_connection

celeryFlag = False
import time

import sys
sys.path.append(utils.path_append)


from msgschema import MsgSchema_pb2, Connection
 
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

#---------------Views-----------------

def login1(request):
    template = loader.get_template('constellationfe/login.html')
    context = RequestContext(request, {
    })    
    #return HttpResponse("Index\n")
    return HttpResponse(template.render(context))
   
def auth(request):
    
    print 'request: ' + str(request.body)
    
    username = ''
    password = ''
    csrftoken = ''
    
    for key in request.POST:
        print 'key: ' + key
        if key == 'username':
            username = request.POST[key]
        elif key == 'password':
            password = request.POST[key]
        elif key == 'csrftoken':
            csrftoken = request.POST[key]
        
    user = authenticate(username=username,password=password)
    if user is not None:
                
        #authenticate to django        
        print 'user n: ' + str(user.username) + ' ' + str(user.password)
    
        #login to the app and return the string "Authenticated"
        login(request,user)
        
        
        return HttpResponse('Authenticated')
    
    else:
        return HttpResponse("Not Authenticated")
            
        
    #json_data = json.loads(request.body)
    #username = json_data['username'] #should be a string
    #password = json_data['password'] #should be a list
    
    #print 'username: ' + username
    #print 'password: ' + password
    
    print 'in auth'
    
    return HttpResponse('returning auth') 

def index(request):

    
    #template = loader.get_template('constellationfe/index.html')
    template = loader.get_template('constellationfe/index1.html')
    context = RequestContext(request, {
      'loggedIn' : '',
    })    
    #return HttpResponse("Index\n")
    return HttpResponse(template.render(context))


#Mapped from url(r'^workspace/(?P<user_id>\w+)/$',views.workspace,name='workspace'),
#Example url 
def workspace(request,user_id):

    user_current = str(request.user)
    user_url = user_id
    
    print 'user_current: ' + user_current + ' user_id: ' + user_id
    if user_url == user_current:
        
        if not request.user.is_authenticated():
            print '\n\n\n\nNOT AUTHENTICATED\n\n\n'
            print 'dir...' + str(dir(request.user))
        else:
            print '\n\n\n\nAUTHENTICATED\n\n\n'
            print 'dir...' + str(request.user)
        
    else:
        print '\n\n\n\nREDIRECT TO LOGIN PAGE\n\n\n'
        template = loader.get_template('constellationfe/login.html')
        
        context = RequestContext(request, {
        })    
        #return HttpResponse("Index\n")
        
        return HttpResponseRedirect('constellationfe/login.html')
        
    template = loader.get_template('constellationfe/index.html')
    
    context = RequestContext(request, {
      'nid' : '39644',
      "email":"harneyjf@ornl.gov",
      'name' : 'John F. Harney',
      'uid' : '5112',
      'uname' : '8xo',
      "type":"0",
    })    
    
    if not testFlag:
    
      url = "http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/user?uname=" + user_id
      
      print 'workspace: url = ' + url
      
      data = urllib2.urlopen(url).read()

      data_json = json.loads(data)
      
      nid = data_json['nid']
      email = data_json['email']
      name = data_json['name']
      uid = data_json['uid']
      uname = data_json['uname']
      type = data_json['type']
      context = RequestContext(request, {
        "nid" : nid,
        "email": email,
        'name' : name,
        'uid' : uid,
        'uname' : uname,
        "type" : type,
      }) 
    
    return HttpResponse(template.render(context))

#Mapped from url(r'^doi/(?P<user_id>\w+)/$',views.doi,name='doi'),
#Example url
def doi(request,user_id):
    
    
    
    template = loader.get_template('constellationfe/doi.html')
    
    from dois import dois
    
    resp = dois.doi(request,user_id)
    
    
    context = RequestContext(request, resp) 
    
    return HttpResponse(template.render(context))


#####
#DOIs
#####

#---------------DOI information-----------------
#url(r'^doiPut/(?P<user_id>\w+)/$',views.doiPut,name='doiPut'),
def doiPut(request,user_id):
    
    from msgschema import MsgSchema_pb2, Connection

    from dois import dois
  
    res = dois.doPutDoiZmq(request,user_id)
    
    #send response to DOI page?
    return HttpResponse(res)


#url(r'^doiGet/(?P<user_id>\w+)/$',views.doiGet,name='doiGet'),
def doiGet(request,user_id):
    from msgschema import MsgSchema_pb2, Connection

    from dois import dois#getMetadataChildren, convertReplyToString, DOICmd_GetByUserWrapper
  
    res = dois.doGetDoiZmq(request,user_id)
    
    return HttpResponse(res)


def doi_linkedobjs(request,user_id):

    from dois import dois
    
    res = dois.doi_linkedobjs(request, user_id)
    
    return HttpResponse(res)




#url(r'^doi_meta/$',views.doi_meta,name='doi_meta'),
def doi_meta(request,user_id):
    
    from dois import dois #,services,transform
    
    
    res = dois.doi_meta(request,user_id)
    
    
    
    #print 'result: ' + str(res)
    return HttpResponse(res)





#---------------User information-----------------

#---------------Group information-----------------
#url(r'^groupinfo/(?P<user_id>\w+)/$',views.groupinfo,name='groupinfo'),
def groupinfo(request,user_id): 
    
  from groups import groups
  
  respArr = groups.useGetGroupInfoZmq(request,user_id)
  
  return HttpResponse(json.dumps(respArr))
  
  
#url(r'^groups/(?P<group_id>\w+)/$',views.groups,name='groups'),  
def groups(request,group_id):
  
  from groups import groups#useGetGroupHttp, useGetGroupZmq
  
  respArr = groups.useGetGroupZmq(request,group_id)
  
  return HttpResponse(respArr)
  

  
  
#---------------Job information-----------------
#url(r'^jobsproxy/(?P<user_id>\w+)/$',views.jobsproxy,name='jobsproxy'),  
def jobsproxy(request,user_id):
    
    from jobs import jobs#useGetJobHttp, useGetJobZmq
    
    res = {}
    if testFlag:
        res = jobs.useJobDefault(request,user_id)
    else:
        #res = useGetJobHttp(request,user_id)
        res = jobs.useGetJobZmq(request,user_id)
        
      
    return HttpResponse(res)
    return HttpResponse(json.dumps(res))

    
    
#---------------App information-----------------
#url(r'^appsproxy/$',views.appsproxy,name='appsproxy'),
def appsproxy(request):
    
    job_id = request.GET.get(utils.JOB_ID)
    
    from apps import apps#useAppDefault, useGetAppHttp, useGetAppZmq
    
    if testFlag:
    
      data_arr = apps.useAppDefault(request,user_id)
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      return HttpResponse(data_string)
    
    else:
         
      #respArr = useGetAppHttp(request,job_id)
      res = apps.useGetAppZmq(request,job_id)
      
      return HttpResponse(res)
  
    
#---------------File information-----------------

#url(r'^files/(?P<user_id>\w+)/$',views.files,name='files'),
def files(request,user_id): 
  
    from files import files #useGetFileHttp, useGetFileZmq
    
    path = request.GET.get(utils.FILE_PATH)
    
    
    if testFlag:
      data_arr = useDefault(request,user_id)
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      return HttpResponse(data_string)
    
    else:
      
      res = files.useGetFileZmq(request,user_id)
      return HttpResponse(res)


#url(r'^filesOID/(?P<user_id>\w+)/$',views.filesOID,name='filesOID'),
def filesOID(request,user_id): 

    from files import files
    
    res = files.useGetFileZmqByOID(request,user_id)
    
    return HttpResponse(res)





#---------------Tag information-----------------

def associationallproxy(request,user_id):
    
    from tags import tags
    
    print 'in associationallproxy'
    
    res = tags.associationallproxy(request,user_id)
    
    
    return HttpResponse('hello')


'''
var association_url = 'http://' + SW.hostname + ':' + SW.port + '/constellation/associationproxy/' + SW.current_user_number + '/';
             association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_group_nids[i] + '&type=' + 'group';
'''  
#creates assocations with a new tag
#url(r'^associationproxy/(?P<user_id>\w+)/$',views.associationproxy,name='associationproxy'),
def associationproxy(request,user_id):
    
    if utils.tagFlag:
            print '-----in associationproxy (i.e. posting a new tag)-----'
    
    the_page = ''
    
    from tags import tags
    
    if request.method == 'POST':
        
        tags.associate(request,user_id)
        
        
    the_page = ''   
    
    if utils.tagFlag:
            print '-----end associationproxy (i.e. posting a new tag)-----'
            
    return HttpResponse(the_page)


#url(r'^tagproxy/(?P<user_id>\w+)/$',views.tagproxy,name='tagproxy'),
def tagproxy(request,user_id):
    
    from tags import tags
    
    res = {}
    
    if request.method == 'POST':
        
        res = tags.createTag(request,user_id)
        
    data_string = json.dumps(res,sort_keys=False,indent=2)
      
    return HttpResponse(data_string)


#url(r'^tags/$',views.tags,name='tags'),   
def tags(request):
    
    from tags import tags#useGetTagHttp, useGetTagZmq
    
    user_id = request.GET.get(utils.TAG_USERID)
    data_arr = []
    
    data = {}
    
    if testFlag:
    
      data_arr = tags.useGetTagDefault(request,user_id)
      
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
  
    else:  
        
      res = tags.useGetTagZmq(request,user_id)
      
      data_string = json.dumps(res,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
      
      
      # for http request  
      uid = '5112'
      res = tags.useGetTagHttp(request,uid)
      
      data_arr.append(data)
      data_string = json.dumps(res,sort_keys=False,indent=2)
    
      return HttpResponse(data_string)
      
      
#url(r'^tags/links/(?P<tag_id>\w+)/$',views.taglinks,name='taglinks'),      
def taglinks(request,tag_id):
    
    from tags import tags
    
    if testFlag:
    
      data_arr = tags.useGetTagLinkDefault(request,tag_id)
      
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
  
    else:
      
      res = tags.useGetTagLinkZmq(request,tag_id)
    
      
      data_string = json.dumps(res,sort_keys=False,indent=2)
    
      return HttpResponse(data_string)
