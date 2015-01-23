from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

def useGetGroupZmq(request,group_id):
    
  print 'in use get groupZmq'
  
  
  print 'group_id? ' + group_id
  group_oid = getOidFromGroupId(group_id)

  print 'group_oid: ' + str(group_oid)
  
  
  #get users given a group
  import MsgSchema_pb2


  from Connection import cdsapi
  from Connection import printMessage
     
  api = cdsapi('tcp://techint-b117:5555')
  
  #print str(dir(MsgSchema_pb2))
  msg = MsgSchema_pb2.UserCmd_GetByGroup()
  
  print '\n\n\n\nstr(msg): ' + str(group_oid) + '\n\n\n\n'
  msg.header.token = 5
  msg.group_oid = group_oid
    
  #Send request (asynchronous, will fail if required fields are missing)
  api.send( msg )

  #Get a reply (wait up to 10 seconds)
  reply_type, reply = api.recv( 10000 )


  user_oids = []
  user_uids = []
  user_unames = []

  #See if we got a reply (return value > 0)
  if reply_type > 0:
    print 'there is a reply'
    classname = api.getMessageTypeName( reply_type )
    if classname == 'UserDataMsg':
        for user in reply.users:
            user_oids.append(user.oid)
            #print '  oid  : ', user.oid
            user_uids.append(user.uid)
            #print '  uid  : ', user.uid
            user_unames.append(user.uname)
            #print '  uname: ', user.uname
            #print '  name : ', user.name
            #print '  email: ', user.email, '\n'
            
  else:
    print 'there is no reply'
  
  
  
  
  counter = 0
  res = '['
  
  for i in range(0,(len(user_oids)-1)):
      counter = counter + 1
 
    
      tempres = '{' 
      tempres += '"title" : "' + str(user_unames[i]) + '", '
      tempres += '"isFolder" : ' + 'false, '
      tempres += '"type" : ' + '0, '
      tempres += '"isLazy" : ' + 'false, '
      tempres += '"tooltip" : ' + '"tooltip", '
      tempres += '"uid" : "' + str(user_uids[i]) + '", '
      tempres += '"nid" : "' + str(user_oids[i]) + '"'
      tempres += '}'
    
      if counter == len(user_oids)-1:
          res += tempres
      else:
          res += tempres + ' , '
  
  res += ']'  
  return res
  
  
  
  
  
  
  data = urllib2.urlopen("http://" + serviceHost + ":" + servicePort + "/sws/users?gid=" + group_id).read()


  

  
  groupMemberObjsArr = [];
  groupMemberObjsArr = json.loads(data);
  
  counter = 0
  res = '['
  
  for groupMemberObj in groupMemberObjsArr:
      
      counter = counter + 1
          
      obj = createDynatreeJSONUserObjStr(groupMemberObj)
      print 'obj: ' + str(obj)
      if counter == len(groupMemberObjsArr):
        res += obj
      else:
        res += obj + ' , '

  res += ']'
  
  return res  
    
    

def useGetGroupHttp(request,group_id):
    
  print 'in use get groupHttp'
  data = urllib2.urlopen("http://" + serviceHost + ":" + servicePort + "/sws/users?gid=" + group_id).read()


  
  groupMemberObjsArr = [];
  groupMemberObjsArr = json.loads(data);
  
  counter = 0
  res = '['
  
  for groupMemberObj in groupMemberObjsArr:
      
      counter = counter + 1
          
      obj = createDynatreeJSONUserObjStr(groupMemberObj)
      print 'obj: ' + str(obj)
      if counter == len(groupMemberObjsArr):
        res += obj
      else:
        res += obj + ' , '

  res += ']'
  
  return res
  
  
  

def createDynatreeJSONUserObjStr(groupMemberObj):
    
    child = {}
    child['title'] = groupMemberObj['uname']
    child['isFolder'] = 'false'
    child['type'] = '0'
    child['isLazy'] = 'false'
    child['tooltip'] = 'tooltip'
    child['uid'] = groupMemberObj['uid']
    child['nid'] = groupMemberObj['nid']
    
    res = '{' 
    res += '"title" : "' + str(groupMemberObj['uname']) + '", '
    res += '"isFolder" : ' + 'false, '
    res += '"type" : ' + '0, '
    res += '"isLazy" : ' + 'false, '
    res += '"tooltip" : ' + '"tooltip", '
    res += '"uid" : "' + str(groupMemberObj['uid']) + '", '
    res += '"nid" : "' + str(groupMemberObj['nid']) + '"'
    res += '}'
    
    return res



#called upon the initial load of the page
def useGetGroupInfoZmq(request,user_id):

  print 'in use get group info Zmq'

  
  import MsgSchema_pb2

  print 'user_id? ' + user_id
  user_oid = getOidFromUserId(user_id)


  from Connection import cdsapi
  from Connection import printMessage
     
  api = cdsapi('tcp://techint-b117:5555')
  

  
  msg = MsgSchema_pb2.GroupCmd_GetByUser()
  msg.header.token = 5
  msg.user_oid = user_oid
    
  #Send request (asynchronous, will fail if required fields are missing)
  api.send( msg )

  #Get a reply (wait up to 10 seconds)
  reply_type, reply = api.recv( 10000 )


  group_oids = []
  group_gids = []
  group_gnames = []

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
            #print '  oid  : ', group.oid
            group_oids.append(group.oid)
            #print '  gid  : ', group.gid
            group_gids.append(group.gid)
            #print '  gname: ', group.gname
            group_gnames.append(group.gname)
            #print '  dir(group): ' + str(dir(group))
            #for key in dir(group):
            #    print 'key: ' + key
    elif classname == 'DOIDataMsg':
        for doi in reply.dois:
            print ' oid : ', doi.oid
    else:
        print 'No print code for this message type yet'


    
  else:
    print 'there is no reply'



  #this is the zmq way
  respArr = []
  
  for i in range(0,(len(group_oids)-1)):
      child = {};
      child['title'] = group_gnames[i]
      child['name'] = group_gnames[i]
      child['isFolder'] = 'true'
      child['type'] = '1'
      child['isLazy'] = 'true'
      child['tooltip'] = 'tooltip'
      child['gid'] = group_gids[i]
      child['nid'] = group_oids[i]
      respArr.append(child);
      
  return respArr


 
#called upon the initial load of the page
def useGetGroupInfoHttp(request,user_id):

  print 'in use get group info Http'

  
  import addressbook_pb2
  import MsgSchema_pb2

  from Connection import cdsapi
  from Connection import printMessage
     
  api = cdsapi('tcp://techint-b117:5555')
    
  msg = MsgSchema_pb2.UserCmd_GetByUNAME()
  msg.header.token = 1
  msg.uname = '8xo'    

  api.send( msg )
    
  reply_type, reply = api.recv( 10000 )
    
  user_oid = ''  
  
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
                user_oid = user.oid
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
  else:
      print 'there is no reply'


  print 'user oid is: ' + str(user_oid)


 

  
  msg = MsgSchema_pb2.GroupCmd_GetByUser()
  msg.header.token = 5
  print 'dirrrrrr: ' + str(dir(msg))
  msg.user_oid = user_oid
  
  
    
  #Send request (asynchronous, will fail if required fields are missing)
  api.send( msg )

  #Get a reply (wait up to 10 seconds)
  reply_type, reply = api.recv( 10000 )




  '''
  gname = group.gname
  gid = group.gid
  oid = group.oid
  '''
  group_oids = []
  group_gids = []
  group_gnames = []

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
            group_oids.append(group.oid)
            print '  gid  : ', group.gid
            group_gids.append(group.gid)
            print '  gname: ', group.gname
            group_gnames.append(group.gname)
            print '  dir(group): ' + str(dir(group))
            #for key in dir(group):
            #    print 'key: ' + key
    elif classname == 'DOIDataMsg':
        for doi in reply.dois:
            print ' oid : ', doi.oid
    else:
        print 'No print code for this message type yet'


    
  else:
    print 'there is no reply'



  #this is the zmq way
  respArr = []
  
  for i in range(0,(len(group_oids)-1)):
      child = {};
      child['title'] = group_gnames[i]
      child['name'] = group_gnames[i]
      child['isFolder'] = 'true'
      child['type'] = '1'
      child['isLazy'] = 'true'
      child['tooltip'] = 'tooltip'
      child['gid'] = group_gids[i]
      child['nid'] = group_oids[i]
      respArr.append(child);
      
  return respArr
  
  

  #this is the old way
  data = urllib2.urlopen("http://" + serviceHost + ":" + servicePort + "/sws/groups?uid=" + user_id).read()

  groupObjArr = json.loads(data)
  
  
  respArr = [];
  for groupObj in groupObjArr:
      #print str(groupObj)
      
      tooltip = 'Group ID: '+ str(groupObj['gid']) + '\nGroup Name: ' + str(groupObj['gname']);
      
      
      child = {};
      child['title'] = groupObj['gname'];
      child['name'] = groupObj['gname'];
      child['isFolder'] = 'true';
      child['type'] = '1';
      child['isLazy'] = 'true';
      child['tooltip'] = tooltip;
      child['gid'] = groupObj['gid'];
      child['nid'] = groupObj['nid'];
      respArr.append(child);
      
  return respArr


def printReply(reply,type):
    for type in reply[type]:
        for key in dir(type):
            print 'key: ' + key
    

#called when a group is selected
def getOidFromGroupId(group_id):
    group_oid = ''

    import MsgSchema_pb2
  
    from Connection import cdsapi
    from Connection import printMessage
     
    api = cdsapi('tcp://techint-b117:5555')
    
    print 'group id before sebnding ' + group_id
    
    msg = MsgSchema_pb2.GroupCmd_GetByGNAME()
    msg.header.token = 1
    msg.gname = group_id
    
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
                user_oid = user.oid
                print '  oid  : ', user.oid
                print '  uid  : ', user.uid
                print '  uname: ', user.uname
                print '  name : ', user.name
                print '  email: ', user.email, '\n'
        elif classname == 'GroupDataMsg':
            for group in reply.groups:
                group_oid = group.oid
                print '  oid  : ', group.oid
                print '  gid  : ', group.gid
                print '  gname: ', group.gname
        else:
            print 'No print code for this message type yet'
    else:
      print 'there is no reply'

    
    
    
    

    return group_oid

def getOidFromUserId(user_id):
    
    import MsgSchema_pb2
  
    from Connection import cdsapi
    from Connection import printMessage
     
    api = cdsapi('tcp://techint-b117:5555')
    
    msg = MsgSchema_pb2.UserCmd_GetByUNAME()
    msg.header.token = 1
    msg.uname = user_id    
    
    api.send( msg )
    
    reply_type, reply = api.recv( 10000 )
    
    user_oid = ''  
  
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
                user_oid = user.oid
        else:
            print 'No print code for this message type yet'
    else:
        print 'there is no reply'
    
    
    
    return user_oid
  

'''
  data = urllib2.urlopen("http://" + serviceHost + ":" + servicePort + "/sws/groups?uid=" + user_id).read()

  groupObjArr = json.loads(data)
  
  
  respArr = [];
  for groupObj in groupObjArr:
      #print str(groupObj)
      
      tooltip = 'Group ID: '+ str(groupObj['gid']) + '\nGroup Name: ' + str(groupObj['gname']);
      
      
      child = {};
      child['title'] = groupObj['gname'];
      child['name'] = groupObj['gname'];
      child['isFolder'] = 'true';
      child['type'] = '1';
      child['isLazy'] = 'true';
      child['tooltip'] = tooltip;
      child['gid'] = groupObj['gid'];
      child['nid'] = groupObj['nid'];
                 
      respArr.append(child);
      
      
  #print 'respArr: ' + str(respArr)               
'''    

'''
res = '['
res += '{' 
res += '"uid" : 8010,'
res += '"title" : "w44",'
res += '"isFolder" : false,'
res += '"tooltip" : "tooltip",'
res += '"nid" : 28264,'
res += '"isLazy" : false,"
res += '"type" : 0'
res += '}'
res += ']'
''' 

'''
  print 'user_oid?' + str(user_oid)

  from Connection import cdsapi
  from Connection import printMessage
     
  api = cdsapi('tcp://techint-b117:5555')
    
  msg = MsgSchema_pb2.UserCmd_GetByUNAME()
  msg.header.token = 1
  msg.uname = '8xo'    

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
                user_oid = user.oid
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
  else:
      print 'there is no reply'


  print 'user oid is: ' + str(user_oid)

'''
 