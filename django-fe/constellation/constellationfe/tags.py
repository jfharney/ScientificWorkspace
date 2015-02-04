from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib
import urllib2

from msgschema import MsgSchema_pb2, Connection

from common import utils

import sys
sys.path.append('/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation/constellationfe')




def useGetTagZmq(request,user_id):

    
    tag_oids = []
    tag_names = []
    tag_descriptions = []
    
    api = Connection.cdsapi('tcp://techint-b117:5555')   
    
    user_oid = utils.getOidFromUserId(user_id)
    
    if utils.tagFlag:
        print '-----in get useGetTagZmq-----'
        print 'user_oid: ' + str(user_oid)
       
    
    msg = MsgSchema_pb2.TagCmd_GetByUser()
    msg.header.token = 888
    msg.user_oid = user_oid
    
    if utils.tagFlag: 
        print 'tag msg.header.token input: ' + str(msg.header.token)
    
    api.send( msg )
    reply_type, reply = api.recv( 10000 )
    
    obj = []
    
    
    if reply_type > 0:
        classname = api.getMessageTypeName( reply_type )
        if utils.tagFlag:
            print 'classname: ' + classname
            print 'tag msg.header.token output: ' + str(reply.header)
        if classname == 'TagDataMsg':
            #print 'dir...(reply) ' + str(dir(reply))
            for tag in reply.tags:
                if utils.tagFlag:
                    print '\ttag oid: ' + str(tag.oid)
                    print '\t\ttag name: ' + str(tag.name)
                    print '\t\ttag description: ' + str(tag.desc)
                tag_oids.append(tag.oid)
                tag_names.append(tag.name)
                tag_descriptions.append(tag.desc)
                obj_entry = { 'name' : tag.name , 'nid' : tag.oid , 'desc' : tag.desc , 'access' : '0' , 'owner' : user_oid , 'type' : '6' }
                obj.append(obj_entry)
    
    if utils.tagFlag:
        print 'obj: ' + str(obj)
        print '\ttag_oids: ' + str(tag_oids)
        print '\ttag_names: ' + str(tag_names)
        print '\ttag_descriptions: ' + str(tag_descriptions)
    
    jsonObj = {}
    
    jsonObj['tag_oids'] = tag_oids
    jsonObj['tag_names'] = tag_names
    jsonObj['tag_descriptions'] = tag_descriptions
    
    
    
    if utils.tagFlag:
        print '-----end get useGetTagZmq-----'
        
    return obj



def useGetTagLinkZmq(request,tag_id):
    from msgschema import MsgSchema_pb2, Connection

    api = Connection.cdsapi('tcp://techint-b117:5555')   
      
    #this conversion is because the "tag_oid" is really the int of the tag id sent through the service
    tag_oid = tag_id
    tag_oid = int(tag_oid)
      
    
    if utils.tagFlag:
        print '-----in useGetTagLinkZmq-----'
        print 'tag_oid: ' + str(tag_oid)
      
    #send a message with tag_oid that will get all the attached objects
      
      
    msg = MsgSchema_pb2.TagCmd_GetAttachedObject()
    msg.tag_oid = tag_oid
    msg.header.token = 8884
    
    if utils.tagFlag:
        print 'taglinks msg.header.token input: ' + str(msg.header.token)  
        
    api.send( msg )
    reply_type, reply = api.recv( 10000 )
      
    #print '\n\nDir Reply_type: ' + str(dir(reply_type)) + '\n'
    #print '\nDir Reply: ' + str(dir(reply)) + '\n'
    #reply = getTagLinks(tag_oid)
      
    group_oids = []
    group_gids = []
    group_gnames = []
    
    file_oids = []
    file_names = []
    file_gids = []
    file_modes = []
    file_ctimes = []
    file_mtimes = []
    
    user_oids = []
    user_uids = []
    user_unames = []
    user_names = []
    user_emails = []
    
    res = []
    
    
    if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
    
          if utils.tagFlag:
              print 'message type: ' + classname + ' tag_oid: ' + str(tag_oid) + '\n'
              print 'taglinks msg.header.token output: ' + str(reply.header)  
          
          #print 'dirr.....' + str(dir(reply))
          if classname == 'CompoundDataMsg':
              
              if utils.tagFlag:
                  print '\tIn compound data msg'
                  print '\tmsg.header.token: ' + str(reply.header)
                  #print '\tstr: \n' + str(reply) + '\n'
              
              #print 'strrr: ' + strrr
              for group in reply.groups:
                  #print 'dir groups... ' + str(group) + '\n'
                  group_oids.append(group.oid)
                  group_gids.append(group.gid)
                  group_gnames.append(group.gname)
                  
                  resObj = {'nid' : group.oid, 'name' : group.gname, 'type' : '1' , 'group_oid' : group.oid, 'group_gid' : group.gid, 'group_name' : group.gname }
                  res.append(resObj)
                  
              for app in reply.apps:
                  print 'add app here'
                  print 'dir apps... \n' + str(app) + '\n'
                  resObj = {'nid' : app.oid, 'name' : app.aid, 'type' : '3' , 'app_oid' : app.oid, 'app_id' : app.aid, 'app_start_time' : app.start_time, 'app_stop_time' : app.stop_time, 'app_exit_code' : 0}
                  res.append(resObj)
                  
              for doi in reply.dois:
                  print 'add doi here'
                  
                  
              for file in reply.files:
                  file_oids.append(file.oid)
                  file_names.append(file.name)
                  file_gids.append(file.gid)
                  file_modes.append(file.mode)
                  file_ctimes.append(file.ctime)
                  file_mtimes.append(file.mtime)
                  
                  resObj = {'nid' : file.oid, 'name' : file.name, 'type' : '4' , 'file_oid' : file.oid, 'file_name' : file.name, 'file_gid' : file.gid, 'file_mode' : file.mode, 'file_ctime' : file.ctime, 'file_mtime' : file.mtime }
                  res.append(resObj)
              
              for job in reply.jobs:
                  #print 'add job here'
                  #print 'dir jobs... \n' + str(job) + '\n'
                  resObj = {'nid' : job.oid, 'name' : job.name, 'type' : '2' ,  'job_oid' : job.oid , 'job_jid' : job.jid, 'job_name' : job.name, 'job_host' : job.host, 'job_start_time' : job.start_time, 'job_stop_time' : job.stop_time }
                  res.append(resObj)
                  
              for tag in reply.tags:
                  print 'add tag here'
                  
                  
                  
              for user in reply.users:
                  #print 'dir users... \n' + str(user) + '\n'
                  
                  resObj = {'nid' : user.oid, 'name' : user.name, 'type' : '0' , 'user_oid' : user.oid, 'user_uid' : user.uid, 'user_uname' : user.uname, 'user_name' : user.name, 'user_email' : user.email }
                  res.append(resObj)
              
    else:
          
          print 'message failed'
    '''
    print 'group_oids: ' + str(group_oids)
    print 'group_gids: ' + str(group_gids)
    print 'group_oids: ' + str(group_gnames)
    
    print 'file_oids: ' + str(file_oids)
    print 'file_names: ' + str(file_names)
    print 'file_gids: ' + str(file_gids)
    print 'file_modes: ' + str(file_modes)
    print 'file_ctimes: ' + str(file_ctimes)
    print 'file_mtimes: ' + str(file_mtimes)
    '''
        
    print 'str resObjs: \n' + str(res)
    
    
    if utils.tagFlag:
        print '-----end use useGetTagLinkZmq-----'
    
    
    return res



#Helper function that queries the broker for tag links given the tag_oid
#Returns only the reply
def getTagLinks(tag_oid): 
    
    
  msg = MsgSchema_pb2.TagCmd_GetAttachedObject()
  msg.tag_oid = tag_oid
  msg.header.token = 8884
      
  api.send( msg )
  reply_type, reply = api.recv( 10000 )
  
  return reply
  

  
def useGetTagDefault(request,uid):

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
      
    return data_arr

def useGetTagHttp(request,uid):
    
    path = request.GET.get('path')
    
    url = "http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/tags?uid=" + str(uid)
    
    #print 'url: ' + url
    
    data = urllib2.urlopen(url).read()
      
    #print 'data from url call: ' + data
    
    jsonObj = json.loads(data)
    
    return jsonObj






def useGetTagLinkDefault(request,tag_id):
    
    data_arr = []
    
    data = {}
    
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
      
    return data_arr


def useGetTagLinkHttp(request,tag_id):
    
    #print 'tag_id: ' + tag_id
    
    url = "http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/nodes?tag-nid=" + str(tag_id)
    
    #print 'url: ' + url
    
    data = urllib2.urlopen(url).read()
    
    #print '\n\ntag associatsions data: \n\t' + data
    
    jsonObj = json.loads(data)
    
    return jsonObj
 
#def createTagHttp(request,user_id)

def getTagTest():
    'getting tag...'
    url = 'http://localhost:8080/constellation/tags?user_id=jamroz'
    data = urllib2.urlopen(url).read()
    
def getTagLinksTest():
    'getting links...'
    url = 'http://localhost:8080/constellation/tags/links/3142'
    data = urllib2.urlopen(url).read()
    
def postTagTest(randNum):
    print 'posting tag...'
    
    url = 'http://localhost:8080/constellation/tagproxy/jamroz/?name=Tag' + str(randNum) + '&description=Tag' + str(randNum) + 'description'

    values = { }

    data = urllib.urlencode(values)
    req = urllib2.Request(url, data)
    response = urllib2.urlopen(req)
    
    
if __name__ == "__main__":
    
    #lists all the tags
    getTagTest()
    
    #getTagLinksTest()
    
    
    import random
    randNum = random.randint(1, 99999999)
    print 'randNum: ' + str(randNum)
    
    
    #postTagTest(randNum)
    
