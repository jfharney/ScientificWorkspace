# Create your views here.


from django.http import HttpResponse
from django.template import RequestContext, loader
import json

from app1 import tasks

testFlag = False
import urllib2
import urllib
    
serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

brokerHost = 'localhost'
brokerPort = '5555'

celeryFlag = False
import time
 

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
    
      url = "http://" + serviceHost + ":" + servicePort + "/sws/user?uname=" + user_id
      
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

    
    data = urllib2.urlopen("http://" + serviceHost + ":" + servicePort + "/sws/user?uname=" + user_id).read()

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



from celery import Celery




  
def groupinfo(request,user_id): 
    
  print 'search: ' + request.GET.get('search')

  from groups import useGetGroupInfoHttp
  
  respArr = useGetGroupInfoHttp(request,user_id)
  
  return HttpResponse(json.dumps(respArr))
  
  
  
def groups(request,group_id):
  
  from groups import useGetGroupHttp
    
  respArr = useGetGroupHttp(request,group_id)
  print 'respArr: ' + respArr
  return HttpResponse(respArr)
  return HttpResponse(json.dumps(respArr))
  

  
  
  
  
def jobsproxy(request,user_id):
    
    from jobs import useGetJobHttp
    
    res = {}
    if testFlag:
        res = useJobDefault(request,user_id)
    else:
        res = useGetJobHttp(request,user_id)
      
    return HttpResponse(json.dumps(res))

    
    
def appsproxy(request):
    
    job_id = request.GET.get('jid')
    
    from apps import useAppDefault, useGetAppHttp
    
    if testFlag:
    
      data_arr = useAppDefault(request,user_id)
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      return HttpResponse(data_string)
    
    else:
         
      respArr = useGetAppHttp(request,job_id)
      
      return HttpResponse(json.dumps(respArr))
    
  
  
def files(request,user_id): 
  
    

    from files import useGetFileHttp
    
    path = request.GET.get('path')
    
    print 'path: ' + path
    
    
    if testFlag:
    
      data_arr = useDefault(request,user_id)
      
 
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
    
      return HttpResponse(data_string)
    
    else:
      
      res = useGetFileHttp(request,user_id)
      
    
      return HttpResponse(res)

#####
#DOIs
#####

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

    

def associationproxy(request,user_id):
    
    print 'in associationsproxy'
    
    the_page = ''
    
    if request.method == 'POST':
        
        tag_nid = request.GET.get('tag_nid')
        resource_nid = request.GET.get('resource_nid')
        type = request.GET.get('type')
    
        #url = "http://" + serviceHost + ":" + servicePort + "/sws/tags?uid=" + str(uid)
        values = { }
        
        url = "http://" + serviceHost + ":" + servicePort + '/sws/tag/' + tag_nid + '/link/' + resource_nid #, + user_id + "&name=" + tag_name + "&description=" + tag_description
        
        print 'calling association url: ' + url
        
        data = urllib.urlencode(values)
        req = urllib2.Request(url,data)
        response = urllib2.urlopen(req)
        
        the_page = response.read()
        
        print 'the_page: ' + str(the_page)
    
       
    return HttpResponse(the_page)


def tagproxy(request,user_id):
    
    the_page = ''
    
    if request.method == 'POST':
        
        
        tag_name = request.GET.get('name')
        tag_description = request.GET.get('description')
        
        #url = "http://" + serviceHost + ":" + servicePort + "/sws/tags?uid=" + str(uid)
        values = { }
        
        url = "http://" + serviceHost + ":" + servicePort + "/sws/tag?uid=" + user_id + "&name=" + tag_name + "&description=" + tag_description
        
        data = urllib.urlencode(values)
        req = urllib2.Request(url,data)
        response = urllib2.urlopen(req)
        
        the_page = response.read()
        
        print 'the_page: ' + str(the_page)
        
    
    return HttpResponse(the_page)

def tags(request):
    
    print 'in tags'
    
    from tags import useGetTagHttp
    uid = request.GET.get('uid')
    print 'uid: ' + str(uid)
    #user_id = '8xo'
    
    data_arr = []
    
    data = {}
    
    if testFlag:
    
      data['nid'] = "14400136"
      data['access'] = "0"
      data['name'] = 'Tag8'
      data['type'] = '6'
      data['desc'] = ""
      data['owner'] = '9328'
      
      data_arr.append(data)
      
      data['nid'] = "14400120"
      data['access'] = "0"
      data['name'] = 'Tag3'
      data['type'] = '6'
      data['desc'] = ""
      data['owner'] = '9328'
      
      data_arr.append(data)
      
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
  
    else:  
        
      
      res = useGetTagHttp(request,uid)
      
      
      
      data_arr.append(data)
      data_string = json.dumps(res,sort_keys=False,indent=2)
    
      return HttpResponse(data_string)
      

def taglinks(request,tag_id):
    
    from tags import useGetTagLinkHttp
    
    data_arr = []
    
    data = {}
    
    if testFlag:
    
      data['job'] = "1723010"
      data['nid'] = "94264"
      data['nodes'] = '1'
      data['err'] = '0'
      data['host'] = "titan"
      data['stop'] = '1378031362'
      data['start'] = '1378030169'
      data['cmd'] = '/usr/bin/aprun -n 16 /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-intel/test_execs/baroC/baroC'
      data['type'] = '3'
      data["aid"] = '3499136'
      
      
      data_arr.append(data)
      
      data['user'] = "9328"
      data['nid'] = "88628"
      data['nodes'] = '1'
      data['err'] = '0'
      data['host'] = "titan"
      data['stop'] = '1378031362'
      data['start'] = '1378031337'
      data['name'] = 'swtc2-dg'
      data['type'] = '2'
      data['wall'] = '0'
      data["jid"] = '1723015'
      
      
      data_arr.append(data)
      
      
      data_string = json.dumps(data_arr,sort_keys=False,indent=2)
      
      return HttpResponse(data_string)
  
    else:
    
      res = useGetTagLinkHttp(request,tag_id)
      
      data_arr.append(data)
      data_string = json.dumps(res,sort_keys=False,indent=2)
    
      return HttpResponse(data_string)
      