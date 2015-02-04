from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2


from common import utils

import sys
sys.path.append('/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation/constellationfe')

from msgschema import MsgSchema_pb2, Connection


def useDefault(request,user_id):
    
    data_arr = []
    data = {}
      
    data['title'] = "|stf007"
    data['isFolder'] = 'true'
    data['isLazy'] = 'true'
    data['path'] = "|stf007"
    data['nid'] = '5955656'
      
    data_arr.append(data)
  
    data['title'] = "|stf006"
    data['isFolder'] = 'true'
    data['isLazy'] = 'true'
    data['path'] = "|stf006"
    data['nid'] = '99296'
    
    data_arr.append(data)
    
    return data_arr 



def useGetFileZmqByOID(request,user_id):
    
    
    from msgschema import MsgSchema_pb2, Connection

    if utils.fileFlag:
        print '-----in use get FileZMQ by OID-----'
        print 'in filesOID'
    
    user_oid = utils.getOidFromUserId(user_id)
    file_oid = int(request.GET.get('file_oid'))
    path = request.GET.get('path')
    
    #file_oid = 69
    if utils.fileFlag:
        print 'file_oid: ' + str(file_oid)
        print 'path: ' + str(path)
    
    api = Connection.cdsapi('tcp://techint-b117:5555')
    
    
    header_token = 11112
    res = getFileListStrFromOID(header_token,file_oid,user_oid,path)
    
    
    if utils.fileFlag:
        print '-----end use get FileZMQ by OID-----'
    
    return res    
    

def useGetFileZmq(request,user_id):
    
    path = request.GET.get('path')
    
    if utils.fileFlag:
        print '-----in use get FileZMQ by Path-----'
        print 'user_id: ' + user_id + ' path: ' + path
    
    #bind to the socket
    api = Connection.cdsapi('tcp://techint-b117:5555')
  
  
    #get the filesys list
    filesys_oids = utils.getFileSysList()
    
    if utils.fileFlag:
        print 'fsys_oid: ' + str(filesys_oids[0])
    
    #get the user oid
    user_oid = utils.getOidFromUserId(user_id)
    
    
    #replace the '|' in the path with '/'
    import re
    dic = { '|' : '/'}
    path = utils.replace_all(path, dic)
    
    
    header_token = 111
    fsys_oid = filesys_oids[0]
    
    #get the file_oids for the root
    file_oids = getFileOidsPath(header_token,fsys_oid,path,user_oid)
    
    
    
    header_token = 1111
    file_oid = file_oids[0]
    
    if utils.fileFlag:
        print 'header_token for getFileListStrFromOID: ' + str(header_token)
        print 'file_oid for getFileListStrFromOID: ' + str(file_oid)
    res = getFileListStrFromOID(header_token,file_oid,user_oid,path)
    
    
    if utils.fileFlag:
        print '-----end use get FileZMQ-----'
    
    return res
    
    
    
    
 
 
#Helper function to get the file list from an OID   
def getFileListStrFromOID(header_token,file_oid,user_oid,path):
       
       
    api = Connection.cdsapi('tcp://techint-b117:5555')   
    
    msg = MsgSchema_pb2.FileCmd_List()
    msg.header.token = 1111
    msg.user_oid = user_oid
    msg.dir_oid = file_oid
    
    api.send( msg )
    
    reply_type, reply = api.recv( 10000 )
    
    
    file_names = []
    file_oids = []
    
    
    if reply_type > 0:

        classname = api.getMessageTypeName( reply_type )
        
        if utils.fileFlag:
            print 'message type: ' + classname
            print 'returned header token: ' + str(reply.header)
        
        if classname == 'FileDataMsg':
            for file in reply.files:
                if utils.fileFlag:
                    print '\tfile oid: ' + str(file.oid)
                    print '\t\tfile name: ' + str(file.name)
                file_names.append(file.name)
                file_oids.append(file.oid)
        
    else:
        print 'there is no reply for file command list'
    
    
    
    dic = { '/' : '|'}
    
    path = utils.replace_all(path, dic)
    
    counter = 0
    res = '['
  
    for i in range(0,(len(file_oids))):
        
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
        
        
          if counter == len(file_oids):
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
        
        
          if counter == len(file_oids):
              res += tempres
          else:
              res += tempres + ' , '
            
    res += ']'  
    
    if utils.fileFlag:
        print 'file res: \n' + res 
    
    
    
    return res    
    
    
def getFileOidsPath(header_token,fsys_oid,path,user_oid):
    
    file_oids = []
    
    api = Connection.cdsapi('tcp://techint-b117:5555')
    
    msg = MsgSchema_pb2.FileCmd_GetByPath()
    msg.header.token = header_token
    msg.fsys_oid = fsys_oid
    msg.path = path
    msg.user_oid = user_oid
    api.send( msg )
    
    reply_type, reply = api.recv( 10000 )
    
    if reply_type > 0:
        
        classname = api.getMessageTypeName( reply_type )

        if utils.fileFlag:
            print 'message type: ' + classname
            print 'returned header token: ' + str(reply.header)
    
        if classname == 'FileDataMsg':
            for file in reply.files:
                if utils.fileFlag:
                    print '\tfile oid: ' + str(file.oid)
                    print '\t\tfile name: ' + str(file.name)
                file_oids.append(file.oid)
        
    else:
        print 'there is no reply for file system cmd get by path'
        
        
    return file_oids
         
    
def useGetFileHttp(request,user_id):
      path = request.GET.get('path')
      
      print 'URL: ' + "http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/files?uid=" + user_id + '&path=' + path + '&list=retrieve'
      
      
    #print "http://" + serviceHost + ":" + servicePort + "/sws/files?uid=" + user_id + '&path=' + path + '&list=retrieve'
      data = urllib2.urlopen("http://" + utils.serviceHost + ":" + utils.servicePort + "/sws/files?uid=" + user_id + '&path=' + path + '&list=retrieve').read()
      #print 'data from url call: ' + data
      jsonObj = json.loads(data)
      respArr = []
      
      t = 'files' in jsonObj
      
      res = ''
      
      files = {}
      if t:
          files = jsonObj['files']
          
          res += '['
      
          if files:
              counter = 0
              for file in files:
                  counter = counter + 1
                  #print 'sending path: ' + path
                  obj = createDynatreeJSONObjStr(file,path)
                  
                  res += obj
                  if counter < len(files):
                      res += ' , '
                  
              res += ']'
              
      else:
          res += '[{'
          
          res += '"title" : ' + '"' + path + '|' + jsonObj['name'] + '",'     
        
          if jsonObj['type'] == 5:
            
            res += '"isFolder" : ' + 'true,'
            res += '"isLazy" : ' + 'true,'       
                         
          else: 
            res += '"isFolder" : ' + 'false,'
            res += '"isLazy" : ' + 'false,'
            
          res += '"path" : "' + path + '|' + jsonObj['name'] + '",'
          res += '"nid" : "' + str(jsonObj['nid']) + '"'    
          res += '}]'
      
      
      return res
      
 
def createDynatreeJSONObjStr(file,path):
    
    res = '{' 
      
    dynatreeJSONObj = {}
              
    if path == '|':
                  
        res += '"title" : ' + '"|' + file['name'] + '",'     
        if file['type'] == 5:
            res += '"isFolder" : ' + 'true,'
            res += '"isLazy" : ' + 'true,'
        else:
            res += '"isFolder" : ' + 'false,'
            res += '"isLazy" : ' + 'false",'
        
        res += '"path" : "|' + file['name'] + '",'
        res += '"nid" : "' + str(file['nid']) + '"'
        dynatreeJSONObj['path'] = '|' + file['name']
        dynatreeJSONObj['nid'] = file['nid']
              
    else:
                  
        dynatreeJSONObj['title'] = path + '|' + file['name']
        res += '"title" : ' + '"' + path + '|' + file['name'] + '",'     
        
        if file['type'] == 5:
            
            res += '"isFolder" : ' + 'true,'
            res += '"isLazy" : ' + 'true,'          
            dynatreeJSONObj['isFolder'] = 'true'
            dynatreeJSONObj['isLazy'] = 'true'
                         
        else: 
            res += '"isFolder" : ' + 'false,'
            res += '"isLazy" : ' + 'false,'
            dynatreeJSONObj['isFolder'] = 'false'
            dynatreeJSONObj['isLazy'] = 'false'
            
        res += '"path" : "' + path + '|' + file['name'] + '",'
        res += '"nid" : "' + str(file['nid']) + '"'    
        dynatreeJSONObj['path'] = path + '|' + file['name'];
        dynatreeJSONObj['nid'] = file['nid'];  
      
    
    res += '}'
    return res 
