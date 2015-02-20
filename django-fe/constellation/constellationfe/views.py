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
    
serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

tcp_connection = 'tcp://techint-b117:5555'

celeryFlag = False
import time

import sys
sys.path.append('/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation/constellationfe')


from msgschema import MsgSchema_pb2, Connection
 
 


#---------------Views-----------------

def index(request):

    
    #template = loader.get_template('constellationfe/index.html')
    template = loader.get_template('constellationfe/workspace.jade')
    context = RequestContext(request, {
      'loggedIn' : '',
    })    
    #return HttpResponse("Index\n")
    return HttpResponse(template.render(context))


def workspace(request,user_id):

    
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
      
      print 'url: ' + url
      
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

def doi(request,user_id):
    
    print 'in doi for user_id: ' + user_id
    template = loader.get_template('constellationfe/doi.html')

    
    data = urllib2.urlopen("http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/user?uname=" + user_id).read()

    data_json = json.loads(data)
      
    nid = data_json['nid']
    email = data_json['email']
    name = data_json['name']
    uid = data_json['uid']
    uname = data_json['uname']
    type = data_json['type']
    
    creator_nid = ''
    
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
        
        
    
    context = RequestContext(request, resp) 
    
    return HttpResponse(template.render(context))


#####
#DOIs
#####

#---------------DOI information-----------------

def doiPut(request,user_id):
    
    print '\n\ndoiPut...\n\n'
    
    from msgschema import MsgSchema_pb2, Connection



    from dois import dois
  
    
    res = dois.doPutDoiZmq(request,user_id)
    
    
    
    #send response to DOI page?
    return HttpResponse(res)


def doiGet(request,user_id):
    from msgschema import MsgSchema_pb2, Connection

    from dois import dois#getMetadataChildren, convertReplyToString, DOICmd_GetByUserWrapper
  
    res = dois.doGetDoiZmq(request,user_id)
    
    return HttpResponse(res)



#---------------User information-----------------



#---------------Group information-----------------
  
def groupinfo(request,user_id): 
    
  from groups import groups
  
  respArr = groups.useGetGroupInfoZmq(request,user_id)
  
  return HttpResponse(json.dumps(respArr))
  
  
  
def groups(request,group_id):
  
  from groups import groups#useGetGroupHttp, useGetGroupZmq
  
  respArr = groups.useGetGroupZmq(request,group_id)
  
  #print 'groups respArr: ' + respArr
  return HttpResponse(respArr)
  return HttpResponse(json.dumps(respArr))
  

  
  
#---------------Job information-----------------
  
  
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

def filesOID(request,user_id): 

    from files import files
    
    res = files.useGetFileZmqByOID(request,user_id)
    
    return HttpResponse(res)


#
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



#---------------Tag information-----------------
'''
var association_url = 'http://' + SW.hostname + ':' + SW.port + '/constellation/associationproxy/' + SW.current_user_number + '/';
             association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_group_nids[i] + '&type=' + 'group';
'''             
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
      
      
      

def taglinks(request,tag_id):
    
    from tags import tags#useGetTagHttp, useGetTagZmq, useGetTagDefault, useGetTagLinkZmq
    
    if testFlag:
    
      data_arr = tags.useGetTagLinkDefault(request,tag_id)
      
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
  
    else:
      
      res = tags.useGetTagLinkZmq(request,tag_id)
    
      
      data_string = json.dumps(res,sort_keys=False,indent=2)
    
      return HttpResponse(data_string)
  



'''
def dois(request,user_id):
    
    data_arr = []
    
    data = {}
    
    if testFlag:
    
      data['title'] = ""
      data['name'] = "09.8887/9322505"
      data['isFolder'] = 'true'
      data['children'] = []
      
      data['path'] = "|stf007"
      data['nid'] = '5955656'
      
      #metadata children
      children = {}
      children['title'] = "Metadata"
      children['doiName'] = "09.8887/9322505"
      children['isFolder'] = 'true'
      children['isLazy'] = 'true'
      
      data['children'].append(children)
      
      #linked objects children
      children = {}
      children['title'] = "Linked Objects"
      children['doiName'] = "09.8887/9322505"
      children['isFolder'] = 'true'
      children['children'] = []
      
      linked_objects_children = {}
      linked_objects_children['title'] = "<span style=\"position:relative\">File: <span style=\"position:absolute; left:100px;\">maier_3d_soup_6lvls_16cmgap.tar</span></span>"
      linked_objects_children['isFolder'] = 'false'
      children['children'].append(linked_objects_children)
      
      linked_objects_children = {}
      linked_objects_children['title'] = "<span style=\"position:relative\">File: <span style=\"position:absolute; left:100px;\">maier_3d_soup_6lvls_16cmgap.tar</span></span>"
      linked_objects_children['isFolder'] = 'false'
      children['children'].append(linked_objects_children)
      
      
      data['children'].append(children)
      
      
      data_arr.append(data)
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
    
      return HttpResponse(data_string)
    
    else:
        
      print 'in dois...'  
      
      
        
      from msgschema import MsgSchema_pb2, Connection

        
      api = Connection.cdsapi(tcp_connection)   
    
      user_oid = utils.getOidFromUserId(user_id)
      
      print 'user_oid: ' + str(user_oid)
    
      msg = MsgSchema_pb2.DOICmd_GetByUser()
      msg.header.token = 1121
      msg.user_oid = user_oid  
        
      api.send( msg )
      reply_type, reply = api.recv( utils.messaging_timeout )
    
      res = []
      
      if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
          print 'classname: ' + str(classname)
          
          if classname == 'DOIDataMsg':
              print 'dirrr: ' + str(dir(reply.dois))
              for doi in reply.dois:
                  print 'doi: ' + doi 
       
     
       
      resObj =  \
        { 'title': 'DOI_One', \
          'isFolder': 'true', \
          'isLazy': 'false', \
          'doiId': '10.5072/OLCF/1260530', \
          'tooltip': 'This is DOI One.', \
          'children': [ \
            { \
             'title': 'Metadata', \
             'isFolder': 'true', \
             'children': [ \
                { \
                    'title': '<span style="position:relative">DOI ID: <span style="position:absolute; left:100px;">10.5072/OLCF/1260530</span></span>', \
                    'isFolder': 'false' \
                 }, \
                { \
                    'title': '<span style="position:relative">Language: <span style="position:absolute; left:100px;">English</span></span>', \
                    'isFolder': 'false' \
                }, \
                { \
                    'title': '<span style="position:relative">Sponsor Org: <span style="position:absolute; left:100px;">USDOE</span></span>', \
                    'isFolder': 'false' \
                }, \
                { \
                    'title': '<span style="position:relative">Keywords: <span style="position:absolute; left:100px;">Science, Computers</span></span>', \
                    'isFolder': 'false' \
                } \
             ] \
            
            }, \
            { \
             'title': 'Linked Objects', \
             'isFolder': 'true', \
             'children': [ \
                { \
                  'title' : '<span style="position:relative">Job: <span style="position:absolute; left:100px;">swtc2</span></span>', \
                  #'title' : '<span style="position:relative">File: <span style="position:absolute; left:100px;">/stf007/world-shared/xnetMPI_cula_works_serial_not_ll.tar</span></span>', \ 
                  'isFolder': 'false' \
                } \
              ] \
            } \
                       
          ] \
        } \
      
      

      res.append(resObj)

      

      data_string = json.dumps(res,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
  
      return HttpResponse("dois for " + user_id + "\n")
'''






















      
'''
      
// Loop through the response array and map the data to the required Dynatree fields. 
      for(var i = 0; i < jsonObjArr.length; i++) {
        var respObj = {
          'title' : jsonObjArr[i]['title'],        // Just a coincidence that these two fields have the same name.
          'name': jsonObjArr[i]['name'],
          'isFolder': true,
          'children': [
                        {
                          title: 'Metadata', 
                          doiName: jsonObjArr[i]['name'],
                          isFolder: true,
                          isLazy: true
                        }, 
                        {
                          title: 'Linked Objects',
                          doiName: jsonObjArr[i]['name'], 
                          isFolder: true,
                          children: null
                        },
                        {
                          title: '<span style="color:blue;cursor:pointer">Download</span>',
                          isFolder: false,
                          doiName: jsonObjArr[i]['name']
                        }
                      ]
        };
        var linkedObjectsArr = [];
        var contextArr = jsonObjArr[i]['context'];
        for(var j = 0; j < contextArr.length; j++) {
          var objType = '';
          if(contextArr[j]['type'] == 0) {
              objType = 'User';
              objValue = contextArr[j]['name'];
          }
          else if(contextArr[j]['type'] == 1) {
              objType = 'Group';
              objValue = contextArr[j]['gname'];
          }
          else if(contextArr[j]['type'] == 2) {
              objType = 'Job';
              objValue = contextArr[j]['name'];
          }
          else if(contextArr[j]['type'] == 3) {
              objType = 'App';
              objValue = contextArr[j]['aid'];
          }
          else if(contextArr[j]['type'] == 4) {
              objType = 'File';
              objValue = contextArr[j]['name'];
          }
          else if(contextArr[j]['type'] == 6) {
              objType = 'Tag';
              objValue = contextArr[j]['name'];
          }
          else {
              objType = 'Other';
              objValue = contextArr[j]['type'];     // Putting in type for development purposes. 
          }
          var childObj = {
            title: '<span style="position:relative">'+objType+': <span style="position:absolute; left:100px;">'+objValue+'</span></span>',
            isFolder: false
          };
          linkedObjectsArr.push(childObj);
          respObj['children'][1].children = linkedObjectsArr;
        }
          
        dynatreeJsonArr.push(respObj);
      }
      
      response.send(dynatreeJsonArr);
    });

'''




 
 
 
 