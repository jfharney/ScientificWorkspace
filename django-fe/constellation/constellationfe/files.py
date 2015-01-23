from django.http import HttpResponse
from django.template import RequestContext, loader
import json
import urllib2

serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

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
 
def useGetFileHttp(request,user_id):
      path = request.GET.get('path')
    #print "http://" + serviceHost + ":" + servicePort + "/sws/files?uid=" + user_id + '&path=' + path + '&list=retrieve'
      data = urllib2.urlopen("http://" + serviceHost + ":" + servicePort + "/sws/files?uid=" + user_id + '&path=' + path + '&list=retrieve').read()
      
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
