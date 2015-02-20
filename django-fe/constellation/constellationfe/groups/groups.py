from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

from common import utils

import sys
sys.path.append('/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation/constellationfe')

from msgschema import MsgSchema_pb2, Connection

import services
import transform

tcp_connection = utils.tcp_connection

def useGetGroupZmq(request,group_id):
    
  print 'in use get groupZmq'
  
  #get the group oid from the group_id
  group_oid = utils.getOidFromGroupId(group_id)
     
  #bind to the socket
  api = Connection.cdsapi(utils.tcp_connection)
  
  
  header_token = int(utils.GROUPS_UserCmd_GetByGroup_TOKEN)
  reply_type, reply = services.UserCmd_GetByGroupWrapper(api,group_oid,header_token)


  #Grab the user oids, uids, and unames from the message
  user_oids = []
  user_uids = []
  user_unames = []

  if reply_type > 0:
    print 'there is a reply'
    classname = api.getMessageTypeName( reply_type )
    if classname == 'UserDataMsg':
        for user in reply.users:
            user_oids.append(user.oid)
            user_uids.append(user.uid)
            user_unames.append(user.uname)
            
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


def useGetGroupHttp(request,group_id):
    
  print 'in use get groupHttp'
  data = urllib2.urlopen("http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/users?gid=" + group_id).read()

  groupMemberObjsArr = [];
  groupMemberObjsArr = json.loads(data);
  
  counter = 0
  res = '['
  
  for groupMemberObj in groupMemberObjsArr:
      
      counter = counter + 1
          
      obj = transform.createDynatreeJSONUserObjStr(groupMemberObj)
      print 'obj: ' + str(obj)
      if counter == len(groupMemberObjsArr):
        res += obj
      else:
        res += obj + ' , '

  res += ']'
  
  return res
  
  
  


#called upon the initial load of the page
def useGetGroupInfoZmq(request,user_id):

  print 'in use get group info Zmq'
  
  user_oid = utils.getOidFromUserId(user_id)
     
  api = Connection.cdsapi(tcp_connection)
  
  header_token = int(utils.GROUPS_GroupCmd_GetByUser_TOKEN)
  
  reply_type, reply = services.GroupCmd_GetByUserWrapper(api,user_oid,header_token)
  
 

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

  #this is the old way
  data = urllib2.urlopen("http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/groups?uid=" + user_id).read()

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


