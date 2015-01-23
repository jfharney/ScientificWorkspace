from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

def useGetGroupHttp(request,group_id):
    
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
def useGetGroupInfoHttp(request,user_id):

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


#called when a group is selected

  

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