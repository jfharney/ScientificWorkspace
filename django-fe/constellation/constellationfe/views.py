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






#---------------Group information-----------------
  
def groupinfo(request,user_id): 
    
  print 'search: ' + request.GET.get('search')

  print '\n\nIn group info\n\n'
  from groups import useGetGroupInfoHttp, useGetGroupInfoZmq
  
  #respArr = useGetGroupInfoHttp(request,user_id)
  respArr = useGetGroupInfoZmq(request,user_id)
  
  return HttpResponse(json.dumps(respArr))
  
  
  
def groups(request,group_id):
  
  from groups import useGetGroupHttp, useGetGroupZmq
  
  

  print '\n\n\nutils.serviceHost: ' + utils.serviceHost+ '\n\n\n'
  #respArr = useGetGroupHttp(request,group_id)
  
  respArr = useGetGroupZmq(request,group_id)
  
  #print 'groups respArr: ' + respArr
  return HttpResponse(respArr)
  return HttpResponse(json.dumps(respArr))
  

  
  
#---------------Job information-----------------
  
  
def jobsproxy(request,user_id):
    
    from jobs import useGetJobHttp, useGetJobZmq
    
    res = {}
    if testFlag:
        res = useJobDefault(request,user_id)
    else:
        #res = useGetJobHttp(request,user_id)
        res = useGetJobZmq(request,user_id)
        
      
    return HttpResponse(res)
    return HttpResponse(json.dumps(res))

    
    
#---------------App information-----------------
    
def appsproxy(request):
    
    job_id = request.GET.get('jid')
    
    from apps import useAppDefault, useGetAppHttp, useGetAppZmq
    
    if testFlag:
    
      data_arr = useAppDefault(request,user_id)
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      return HttpResponse(data_string)
    
    else:
         
      #respArr = useGetAppHttp(request,job_id)
      res = useGetAppZmq(request,job_id)
      
      return HttpResponse(res)
  
    
#---------------File information-----------------

def filesOID(request,user_id): 


    import files
    
    header_token = 11112
    
    
    res = files.useGetFileZmqByOID(request,user_id)
    
    
    return HttpResponse(res)


  
#
def files(request,user_id): 
  
    

    from files import useGetFileHttp, useGetFileZmq
    
    path = request.GET.get('path')
    
    if utils.fileFlag:
        print 'path: ' + path
    
    
    if testFlag:
      data_arr = useDefault(request,user_id)
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      return HttpResponse(data_string)
    
    else:
      
      #res = useGetFileHttp(request,user_id)
      res = useGetFileZmq(request,user_id)
    
      return HttpResponse(res)

#####
#DOIs
#####

#---------------DOI information-----------------

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
      return HttpResponse("dois for " + user_id + "\n")


#---------------Tag information-----------------
'''
var association_url = 'http://' + SW.hostname + ':' + SW.port + '/constellation/associationproxy/' + SW.current_user_number + '/';
             association_url += '?tag_nid=' + tag_nid + '&resource_nid=' + SW.selected_group_nids[i] + '&type=' + 'group';
'''             
def associationproxy(request,user_id):
    
    if utils.tagFlag:
            print '-----in associationproxy (i.e. posting a new tag)-----'
    
    the_page = ''
    
    if request.method == 'POST':
        
        
        resource_oids = []
        
        tag_oid = request.GET.get('tag_nid')
        
        resource_oid = request.GET.get('resource_nid')
        
        print 'resource_oid: ' + resource_oid
        
        resource_oids.append(resource_oid)
        
        type = request.GET.get('type')


        from msgschema import MsgSchema_pb2, Connection

        
        api = Connection.cdsapi('tcp://techint-b117:5555')   
    
    
        msg = MsgSchema_pb2.TagCmd_Attach()
        msg.header.token = 111221
        msg.tag_oid = int(tag_oid)
        
        for i in range(0,len(resource_oids)):
            #resource_oids[i] = int(resource_oids[i])
            #msg.object_oids[i] = resource_oids[i]
            print 'appending ' + str(int(resource_oids[i]))
            msg.object_oids.append(int(resource_oids[i]))
            
        
        print 'msg.object_oids ' + str(msg.object_oids)    
        
        if utils.tagFlag:
            
            print 'Message input tag_oid: ' + str(tag_oid)
            print 'Message input resource_oid: ' + str(resource_oid)
            print 'Message input type: ' + type
            print 'Message input token: ' + str(msg.header.token)
            for resource_oid in resource_oids:
                print 'Message input resource_oid: ' + resource_oid
            
                
        import time
        time.sleep(10)
        api.send( msg )
        reply_type, reply = api.recv( 10000 )
    
        
        if reply_type > 0:
            #print 'there is a reply for file command list'
            classname = api.getMessageTypeName( reply_type )
            if utils.tagFlag:
                print '\tmessage type: ' + classname
                print '\tMessage output token: ' + str(reply.header)
          

    the_page = ''   
    
    if utils.tagFlag:
            print '-----end associationproxy (i.e. posting a new tag)-----'
            
    return HttpResponse(the_page)



'''
var url = 'http://' + SW.hostname + ':' + SW.port + '/constellation/tagproxy/'+userNumber + '/?name=' + tagName + '&description=' + $('#tag_description').val();
''' 
def tagproxy(request,user_id):
    
    res = {}
    
    if request.method == 'POST':
        
        if utils.tagFlag:
            print '-----in tagproxy (i.e. posting a new tag)-----'
        
        print 'creating a new tag here...'
        
        tag_name = request.GET.get('name')
        tag_description = request.GET.get('description')
        user_oid = utils.getOidFromUserId(user_id)
        
        
        
        from msgschema import MsgSchema_pb2, Connection

        
        api = Connection.cdsapi('tcp://techint-b117:5555')   
    
    
        tag_data = MsgSchema_pb2.TagData()
        tag_data.name = tag_name
        tag_data.desc = tag_description
    
        msg = MsgSchema_pb2.TagCmd_Create()
        msg.header.token = 111221
        msg.user_oid = user_oid
        msg.tag_data.CopyFrom(tag_data)
        
        if utils.tagFlag:
            print 'tag_name: ' + tag_name
            print 'tag_description: ' + tag_description
            print 'user_oid: ' + str(user_oid)
        
        api.send( msg )
        reply_type, reply = api.recv( 10000 )
    
        
        if reply_type > 0:
            #print 'there is a reply for file command list'
            classname = api.getMessageTypeName( reply_type )
        
            print '\t\tmmmmmessage type: ' + classname + '\n\n'
            #print 'header: ' + str(reply.header)
            for tag in reply.tags:
                print 'tag name: ' + tag.name
                print 'tag oid: ' + str(tag.oid)
                res['nid'] = tag.oid
            
        else:
            print 'there was an error in creating the tag'
        
        
        if utils.tagFlag:
            print '-----end tagproxy (i.e. posting a new tag)-----'
            
    data_string = json.dumps(res,sort_keys=False,indent=2)
      
    return HttpResponse(data_string)



def tags(request):
    
    from tags import useGetTagHttp, useGetTagZmq
    
    user_id = request.GET.get('user_id')
    data_arr = []
    
    data = {}
    
    if testFlag:
    
      data_arr = useGetTagDefault(request,user_id)
      
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
  
    else:  
        
      
      
      
      res = useGetTagZmq(request,user_id)
      
      data_string = json.dumps(res,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
      
        
      uid = '5112'
      res = useGetTagHttp(request,uid)
      
      data_arr.append(data)
      data_string = json.dumps(res,sort_keys=False,indent=2)
    
      return HttpResponse(data_string)
      
      
      

def taglinks(request,tag_id):
    
    from tags import useGetTagHttp, useGetTagZmq, useGetTagDefault, useGetTagLinkZmq
    
    if testFlag:
    
      data_arr = useGetTagLinkDefault(request,tag_id)
      
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
  
    else:
      
      res = useGetTagLinkZmq(request,tag_id)
    
      
      data_string = json.dumps(res,sort_keys=False,indent=2)
    
      return HttpResponse(data_string)
  













#---------------Miscellaneous information-----------------  
  

def groupEx(request):
    
    import MsgSchema_pb2
    
    from Connection import cdsapi
    from Connection import printMessage
    
    api = cdsapi('tcp://techint-b117:5555')
    
    print '\n'
    print dir(MsgSchema_pb2)
    print '\n'
    
    #Build a request message (get user by uname)
    msg = MsgSchema_pb2.GroupCmd_GetByGNAME()
    msg.header.token = 2
    msg.gname = 'd3s'

    #Send request (asynchronous, will fail if required fields are missing)
    api.send( msg )

    #Get a reply (wait up to 10 seconds)
    reply_type, reply = api.recv( 10000 )

    #See if we got a reply (return value > 0)
    if reply_type > 0:
        print 'there is a reply'
        
        classname = api.getMessageTypeName( reply_type )
        
        print 'message type: ', classname
        
        if not reply.HasField('header'):
            print 'Not a valid message instance'
            return
    
        if reply.header.HasField('token'):
            print 'header.token: ', reply.header.token
        if reply.header.HasField('error_code'):
            print 'header.error_code: ', reply.header.error_code
        if reply.header.HasField('error_msg'):
            print 'header.error_msg: ', reply.header.error_code

        if classname == 'UserDataMsg':
            for user in reply.users:
                print '  oid  : ', user.oid
                print '  uid  : ', user.uid
                print '  uname: ', user.uname
                print '  name : ', user.name
                print '  email: ', user.email, '\n'
        elif classname == 'GroupDataMsg':
            for group in reply.groups:
                print '  oid  : ', group.oid
                print '  gid  : ', group.gid
                print '  gname: ', group.gname
        elif classname == 'DOIDataMsg':
            for doi in reply.dois:
                print ' oid : ', doi.oid
        else:
            print 'No print code for this message type yet'


    else:
        print 'timeout'
        
    return HttpResponse('groupEx\n')
 
      
  
  
def jobEx(request):

    msg = MsgSchema_pb2.JobCmd_GetByUser()
    msg.header.token = 3
    msg.uname = '8xo'
    

    api.send( msg )
    
    
    reply_type, reply = api.recv( 10000 )
    
    
    if reply_type > 0:
        print 'there is a reply'
        
        
        
        classname = api.getMessageTypeName( reply_type )
        
        print 'message type: ', classname
        '''
        if not reply.HasField('header'):
            print 'Not a valid message instance'
            return
    
        if reply.header.HasField('token'):
            print 'header.token: ', reply.header.token
        if reply.header.HasField('error_code'):
            print 'header.error_code: ', reply.header.error_code
        if reply.header.HasField('error_msg'):
            print 'header.error_msg: ', reply.header.error_code

        if classname == 'UserDataMsg':
            for user in reply.users:
                print '  oid  : ', user.oid
                print '  uid  : ', user.uid
                print '  uname: ', user.uname
                print '  name : ', user.name
                print '  email: ', user.email, '\n'
        elif classname == 'GroupDataMsg':
            for group in reply.groups:
                print '  oid  : ', group.oid
                print '  gid  : ', group.gid
                print '  gname: ', group.gname
        else:
            print 'No print code for this message type yet'
        '''
        
    else:
        print 'timeout'
    
    
    return HttpResponse('jobEx\n')

    


def celeryEx(request):
    
    import addressbook_pb2
    import MsgSchema_pb2
    
    print 'initial test'
    
    from Connection import cdsapi
    from Connection import printMessage
    
    api = cdsapi('tcp://techint-b117:5555')
    
    msg = MsgSchema_pb2.UserCmd_GetByUNAME()
    msg.header.token = 1
    msg.uname = 'd3s'

    api.send( msg )
    
    reply_type, reply = api.recv( 10000 )
    
    if reply_type > 0:
        print 'there is a reply'
        
        classname = api.getMessageTypeName( reply_type )
        
        print 'message type: ', classname
        
        if not reply.HasField('header'):
            print 'Not a valid message instance'
            return
    
        if reply.header.HasField('token'):
            print 'header.token: ', reply.header.token
        if reply.header.HasField('error_code'):
            print 'header.error_code: ', reply.header.error_code
        if reply.header.HasField('error_msg'):
            print 'header.error_msg: ', reply.header.error_code

        if classname == 'UserDataMsg':
            for user in reply.users:
                print '  oid  : ', user.oid
                print '  uid  : ', user.uid
                print '  uname: ', user.uname
                print '  name : ', user.name
                print '  email: ', user.email, '\n'
        elif classname == 'GroupDataMsg':
            for group in reply.groups:
                print '  oid  : ', group.oid
                print '  gid  : ', group.gid
                print '  gname: ', group.gname
        else:
            print 'No print code for this message type yet'

        #printMessage( reply_type, reply )
    else:
        print 'timeout'
    
    print 'end initial test'
    
    
    user = MsgSchema_pb2.UserData()
    user.oid = 1
    user.uid = 5112
    user.uname = '8xo'
    user.name = "John F Harney"
    user.email = 'harneyjf@ornl.gov'

    
    address_book = addressbook_pb2.AddressBook()
    
    person = addressbook_pb2.Person()
    person.id = 1234
    person.name = "John Doe"
    person.email = "jdoe@example.com"
    phone = person.phone.add()
    phone.number = "555-4321"
    phone.type = addressbook_pb2.Person.HOME
    
    #address_book.person.add()
    
    #address_book.person.id = 1
    #address_book.person.name = "John Doe"
    #address_book.phone.number = "555-4321"
    
    '''
    name = request.GET.get('name')
    
    if name == None:
        name = 'me'
    
    if celeryFlag:
      tasks.add(1,2,name)
    else:
        print name + ' starting task'
        #time.sleep(4)
    
        import zmq
        
        context = zmq.Context()
    
        socket = context.socket(zmq.REQ)
        socket.connect("tcp://" + brokerHost + ':' + brokerPort)
    
        request = 1
        #for request in range(3):
        
        print(name + " Sending request %s ..." % request)
            
            
            #socket.send(b"Hello3")
        #socket.send(person.SerializeToString())
        socket.send(user.SerializeToString())
            #print dir(socket)
    
        message = socket.recv()
        
        
        print(name + " Received reply:\n %s [ %s ]" % (request, message))
    
        print '\n\n\n\nmessage: ' + str(message)
    
        print name + 'ending task'
    
    '''
    
    return HttpResponse("Hello\n")


  
  
    '''
    msg = MsgSchema_pb2.FileCmd_List()
    msg.header.token = 11112
    msg.user_oid = user_oid
    msg.dir_oid = file_oid
    
    api.send( msg )
    
    reply_type, reply = api.recv( 10000 )
    
    file_names = []
    file_oids = []
    
    if reply_type > 0:
        print 'there is a reply for file command list'
        
        classname = api.getMessageTypeName( reply_type )
        
        print 'message type: ' + classname + '\n\n'
        
        
        if classname == 'FileDataMsg':
            print 'strdir\n\n' + str(dir(reply.files))
            for file in reply.files:
                print 'str file: ' + str(file)
                print 'file name: ' + str(file.name)
                print 'file oid: ' + str(file.oid)
                file_names.append(file.name)
                file_oids.append(file.oid)
        
    
    print 'file_oids: ' + str(file_oids)
    print 'file_names: ' + str(file_names)
    
    
    
    
    counter = 0
    res = '['
  
    print 'len: ' + str(len(file_oids))
    for i in range(0,(len(file_oids)-1)):
        
        if path == '|':
            
          counter = counter + 1
 
    
          tempres = '{' 
          tempres += '"title" : "' + '|' + str(file_names[i]) + '",'   
          tempres += '"isFolder" : ' + 'true, '
          tempres += '"isLazy" : ' + 'true, '
          #tempres += '"type" : ' + '2, '
          tempres += '"path" : "' + '|' + str(file_names[i]) + '",'   
          tempres += '"nid" : "' + str(file_oids[i]) + '"'
          tempres += '}'
        
        
          if counter == len(file_oids)-1:
              res += tempres
          else:
              res += tempres + ' , '
  
        else:
          counter = counter + 1
 
    
          tempres = '{' 
          tempres += '"title" : "' + '' + path + '|' + str(file_names[i]) + '",'   
          tempres += '"isFolder" : ' + 'true, '
          tempres += '"isLazy" : ' + 'true, '
          #tempres += '"type" : ' + '2, '
          tempres += '"path" : "' + '' + path + '|' + str(file_names[i]) + '",'   
          tempres += '"nid" : "' + str(file_oids[i]) + '"'
          tempres += '}'
        
        
          if counter == len(file_oids)-1:
              res += tempres
          else:
              res += tempres + ' , '
            
    res += ']'  
    
    print 'res: ' + res
    '''



    '''
message TagCmd_Attach
{
    required Header     header      = 1;
    required uint64     tag_oid     = 2;
    repeated uint64     object_oids = 3;
}
    '''


    '''
        
    
        #url = "http://" + serviceHost + ":" + servicePort + "/sws/tags?uid=" + str(uid)
        values = { }
        
        url = "http://" + utils.serviceHost + ":" + utils.servicePort + '/sws/tag/' + tag_nid + '/link/' + resource_nid #, + user_id + "&name=" + tag_name + "&description=" + tag_description
        
        print 'calling association url: ' + url
        
        data = urllib.urlencode(values)
        req = urllib2.Request(url,data)
        response = urllib2.urlopen(req)
        
        the_page = response.read()
        
        print 'the_page: ' + str(the_page)
    '''
       
      