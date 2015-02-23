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

tcp_connection = utils.tcp_connection

celeryFlag = False
import time

import sys
sys.path.append(utils.path_append)


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


#Mapped from url(r'^workspace/(?P<user_id>\w+)/$',views.workspace,name='workspace'),
#Example url 
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

#Mapped from url(r'^doi/(?P<user_id>\w+)/$',views.doi,name='doi'),
#Example url
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


#url(r'^doi_meta/$',views.doi_meta,name='doi_meta'),
def doi_meta(request,user_id):
    
    from dois import dois,services,transform
    
    print 'tcp_connection: ' + tcp_connection
    #bind to the socket
    api = Connection.cdsapi(str(tcp_connection))
    
    
    doi_oid = request.GET.get('doi_oid')
    print 'doi_oid<><><><><>: ' + doi_oid
    
    user_oid = utils.getOidFromUserId(user_id)   
    header_token = int(utils.DOIS_DOICmd_GetByUser_TOKEN)
    print 'header_token: ' + str(header_token)
    include_meta = True
    include_links = True
     
    msg = MsgSchema_pb2.DOICmd_GetByUser()
    
    
    if include_links == False:
        header_token = 222
    else:
        header_token = 333
    
    
    msg.user_oid = user_oid
    msg.header.token = header_token
    msg.inc_meta = include_meta
    msg.inc_links = include_links
    
    print 'printoing msg: ' + str(msg)
        
    #submit to the 
    api.send( msg )
    
    reply_type, reply = api.recv( int(utils.messaging_timeout) )
    
    
    print 'reply header: ' + str(reply.header)
    
    
    #reply_type, reply = services.DOICmd_GetByUserWrapper(api,user_oid,include_meta,include_links,header_token)
    for i in range(0,(len(reply.dois))):
        print 'doi_oid: ' + str(doi_oid) + ' ' + str(reply.dois[i].oid)
        if str(reply.dois[i].number) == str(doi_oid):
            print 'here' 
        else:
            print 'not here'
            
    
    '''
    metadata = reply.dois[i].metadata
            print 'metadata: ' + str(metadata)
            d = json.loads(metadata)
            metadata_properties = d[0]
            tempres +=   '"children" : [' + '\n'
            tempres += getMetadataChildren(metadata_properties)
            tempres +=   ']' + '\n'
    '''
    
    res = '['
    
 
    res += '{' 
    res += '"title" : "' + 'title' + '", '
    res += '"type" : ' + '2, '
    res += '"appid" : "' + 'appid' + '", '
    res += '"job_id" : "' + 'job_id' + '", '
    res += '"nid" : "' + 'nid' + '"'
    res += '}'

    
  
    res += ']'  
    
    print 'result: ' + str(res)
    return HttpResponse(res)

'''
app.get('/doi_meta', function(request, response) {
  console.log('A /doi_meta request has been received.');

  var path = '/doi/json?doi='+request.query['doiName'];

  console.log('path is '+path);

  var options = {
    host: 'doi1.ccs.ornl.gov',
      port: 443,                    // This is an https URL, so I am using port 443. 
      path: path,
    rejectUnauthorized: false,
      method: 'GET'
  };

  var req = https.request(options, function(resp) {
      var responseData = '';
    resp.on('data', function(chunk) {
      responseData += chunk;  
    });
        
    resp.on('end', function() {
        console.log(responseData);
      var jsonObj = JSON.parse(responseData);
      
      var respObj = [
        {    
          title: '<span style="position:relative">DOI ID: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['doi']+'</span></span>', 
          isFolder: false
        },
        {    
          title: '<span style="position:relative">Language: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['language']+'</span></span>', 
          isFolder: false
        },
        {    
          title: '<span style="position:relative">Sponsor Org: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['sponsor_org']+'</span></span>', 
          isFolder: false
        },
        {    
          title: '<span style="position:relative">Keywords: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['keywords']+'</span></span>', 
          isFolder: false
        },
        {    
          title: '<span style="position:relative">Description: <span style="position:absolute; left:100px;">'+jsonObj[0]['fields']['description']+'</span></span>', 
          isFolder: false
        }
      ];

      response.send(respObj);
    });

    resp.on('error', function(e) {
      response.send('error: ' + e);
    });
  });

  req.end();

});
'''





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
      reply_type, reply = api.recv( int(utils.messaging_timeout) )
    
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




 
 
 
 