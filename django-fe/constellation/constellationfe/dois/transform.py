import json

tcp_connection = 'tcp://techint-b117:5555'

from msgschema import MsgSchema_pb2, Connection

from common import utils

def trasnformMetadataToXML(metadata):
    
    print 'str: ' + str(metadata)
    content = metadata.POST
    
    description = None
    creators = None
    creators_email = None
    contact_email = None
    files = None
    resources = None
    keywords = None
    language = None
    sponsor_org = None
    
    for key in content:
        print 'key: ' + key
        if key == 'title':
            title = content[key] 
        elif key == 'description':
            description = content[key]
        elif key == 'creator_name':
            creator_name = content[key]
        elif key == 'language':
            language = content[key]
        elif key == 'contact_email':
            contact_email = content[key]
        elif key == 'keywords':
            keywords = content[key]
        elif key == 'sponsor_org':
            sponsor_org = content[key]
        elif key == 'creator_nid':
            creator_nid = content[key]
    
    
    
    if title == None:
        title = 'Sample'
    if description == None:
        description = 'This is a test'
    if creators == None:
        creators = 'DS'
    if creators_email == None:
        creators_email = 'stas@gmail.com'
    if contact_email == None:
        contact_email = 'stas@gmail.com'
    if files == None:
        files = '<files>/lustre/atlas2/stf008/world-shared/d3s/doi_input</files>'
    if resources == None:
        resources = ''
    if keywords == None:
        keywords = 'test'
    if language == None:
        language = 'English'
    if sponsor_org == None:
        sponsor_org = 'ORNL'
    
    m_doi_metadata = \
    '<records>' + \
    '<record>' + \
    '<title>' + title + '</title>' + \
    '<description>' + description + '</description>' + \
    '<creators>' + creators + '</creators>' + \
    '<creators_email>' + creators_email + '</creators_email>' + \
    '<contact_email>' + contact_email + '</contact_email>' + \
    '<files>' + files + '</files>' + \
    '<resources>' + resources + '</resources>' + \
    '<keywords>' + keywords + '</keywords>' + \
    '<language>' + language + '</language>' + \
    '<sponsor_org>' + sponsor_org + '</sponsor_org>' + \
    '</record>' + \
    '</records>'
    
    return m_doi_metadata


def convertReplyToString(reply,user_oid):
    
    res = '[' + '\n'

    counter = 0    
    for i in range(0,(len(reply.dois))):
        
        #print 'reply doi ' + str(i)
        #print str(reply.dois[i])
        
        
        tempres = '{' + '\n'
            #title: 'DOI_Two',    isFolder: true,    isLazy: false,    doiId: '10-86X-234151235532',    tooltip: 'This is DOI Two.',     children: [
        tempres += '"title" : ' + '"' + reply.dois[i].number  + '",' + '\n'# + '"DOITwo",' + '\n'
        tempres += '"isFolder" : ' + '"true",' + '\n'
        tempres += '"isLazy" : ' + '"true",' + '\n'
        tempres += '"doiId" : ' + '"' + reply.dois[i].number  + '",' + '\n' #10-86X-234151235532",' + '\n'
        tempres += '"tooltip" : ' + '"This is ' + reply.dois[i].number + '",' + '\n'
        
        
        tempres += '"children" : ' + '[' + '\n'
        
        #metadata
        
        metadata = reply.dois[i].metadata
        d = json.loads(metadata)
        metadata_properties = d[0]
        
        tempres += '{' + '\n'
        tempres +=   '"title" : "Metadata", ' + '\n'
        tempres +=   '"isFolder" : "true", ' + '\n'
        tempres +=   '"children" : [' + '\n'
        tempres += getMetadataChildren(metadata_properties)
        tempres +=   ']' + '\n'
        tempres += '} ,' + '\n'
        
        #linked objects
        tempres += '{' + '\n'
        tempres +=   '"title" : "Linked Objects", ' + '\n'
        tempres +=   '"isFolder" : "true", ' + '\n'
        tempres +=   '"children" : ' + '[' + '\n'
        linked_objs = reply.dois[i].linked_oid
        #d = json.loads()
        tempres += getLinkedChildren(linked_objs,user_oid)
        tempres +=   ']' + '\n'
        tempres += '}' + '\n'
        
        
        tempres += ']' + '\n'
        
        tempres += '}' + '\n'
        
        print '------'
        
        if i != len(reply.dois)-1:
            tempres += ','
            
        res += tempres
        
    res += ']' + '\n'
    #print 'result\n' + res
    
    return res

def getMetadataChildren(metadata_properties):
    
    tempres = ''
    for property in metadata_properties:
            #print 'property: ' + property
            if property == 'fields':
                
                #print str(len(metadata_properties['fields']))
                counter = 0
                for field in metadata_properties['fields']:
                    #print '\tfield: ' + field
        
                    counter = counter+1
                    tempres +=   '{' + '\n'
                    span = '<span style="position:relative">Language: <span style="position:absolute; left:100px;">English</span></span>'
                    tempres +=       '"title" : "' + field + ' : ' + str(metadata_properties['fields'][field]) + '" , ' + '\n'
                    #tempres +=       '"title" : "span stuff here" , ' + '\n'
                    tempres +=       '"isFolder" : false'  + '\n'
                    tempres +=   '}'
                    if counter < len(metadata_properties['fields']):
                        tempres += ','
                    else:
                        tempres += '\n'
        
    
    return tempres



def getLinkedChildren(linked_objs,user_oid):
 
    tempres = ''
    
    api = Connection.cdsapi(tcp_connection)  
    
    msg = MsgSchema_pb2.Cmd_GetByOID()
    msg.header.token = 3333
    for linked_obj in linked_objs:
        #resource_oids[i] = int(resource_oids[i])
        #msg.object_oids[i] = resource_oids[i]
        #print 'appending ' + str(int(linked_obj))
        msg.oids.append(int(linked_obj))
      
    #submit to the 
    api.send( msg )
        
    reply_type, reply = api.recv( utils.messaging_timeout )
    
    numRecords = 0
    
    if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
          #print 'dget linked children classname: ' + str(classname)
          if classname == 'CompoundDataMsg':
             #print 'CompoundDataMsg'
             #print 'reply: ' + str(reply)   
             i = 0
             
             
             #users   
             for i in range(0,(len(reply.users))):
                 numRecords = numRecords + 1
                 tempres +=   '{' + '\n'
                 tempres +=     '"title" : "' + 'user: ' + str(reply.users[i].name) + '", ' + '\n'
                 tempres +=     '"isFolder" : false ' + '\n'
                 tempres += '}' + '\n'    
             
             #groups
             for i in range(0,(len(reply.groups))):
                 numRecords = numRecords + 1
                 tempres +=   '{' + '\n'
                 tempres +=     '"title" : "' + 'group: ' + str(reply.users[i].name) + '", ' + '\n'
                 tempres +=     '"isFolder" : false ' + '\n'
                 tempres += '}' + '\n'    
             
             #jobs
             for i in range(0,(len(reply.jobs))):
                 numRecords = numRecords + 1
                 tempres +=   '{' + '\n'
                 tempres +=     '"title" : "' + 'job: ' + str(reply.jobs[i].name) + '", ' + '\n'
                 tempres +=     '"isFolder" : false ' + '\n'
                 tempres += '}' + '\n'  
            
             #apps
             for i in range(0,(len(reply.apps))):
                 numRecords = numRecords + 1
                 tempres +=   '{' + '\n'
                 tempres +=     '"title" : "' + 'job: ' + str(reply.apps[i].name) + '", ' + '\n'
                 tempres +=     '"isFolder" : false ' + '\n'
                 tempres += '}' + '\n'  
            
             #files
             for i in range(0,(len(reply.files))):
                 numRecords = numRecords + 1
                 tempres +=   '{' + '\n'
                 tempres +=     '"title" : "' + 'file: ' + str(reply.files[i].name) + '", ' + '\n'
                 tempres +=     '"isFolder" : false ' + '\n'
                 tempres += '}' + '\n'
            
             #tags
             for i in range(0,(len(reply.tags))):
                 numRecords = numRecords + 1
                 tempres +=   '{' + '\n'
                 tempres +=     '"title" : "' + 'tag: ' + str(reply.tags[i].name) + '", ' + '\n'
                 tempres +=     '"isFolder" : false ' + '\n'
                 tempres += '}' + '\n'  
            
             #dois
             for i in range(0,(len(reply.dois))):
                 numRecords = numRecords + 1
                 tempres +=   '{' + '\n'
                 tempres +=     '"title" : "' + 'doi: ' + str(reply.dois[i].name) + '", ' + '\n'
                 tempres +=     '"isFolder" : false ' + '\n'
                 tempres += '}' + '\n'  
            
            
            
    #print 'numRecords: ' + str(numRecords)
    tempres = tempres.replace('}','},',(numRecords-1))
    #print '\n\ntempres:\n' + tempres + '\n\n'
    
    
    
    return tempres



        
        
        