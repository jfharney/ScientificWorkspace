import json

tcp_connection = 'tcp://techint-b117:5555'

from msgschema import MsgSchema_pb2, Connection

def trasnformMetadataToXML():
    m_doi_metadata = \
    '<records>' + \
    '<record>' + \
    '<title>Sample</title>' + \
    '<description>This is a test</description>' + \
    '<creators>DS</creators>' + \
    '<creators_email>stas@gmail.com</creators_email>' + \
    '<contact_email>stas@gmail.com</contact_email>' + \
    '<files>/lustre/atlas2/stf008/world-shared/d3s/doi_input</files>' + \
    '<resources></resources>' + \
    '<keywords>test</keywords>' + \
    '<language>English</language>' + \
    '<sponsor_org>ORNL</sponsor_org>' + \
    '</record>' + \
    '</records>'
    
    return m_doi_metadata


def convertReplyToString(reply,user_oid):
    
    res = '[' + '\n'

    counter = 0    
    for i in range(0,(len(reply.dois))):
        
        print 'reply doi ' + str(i)
        print str(reply.dois[i])
        
        
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

    #print '\n\n\n\n\nlinked: ' + str(linked_objs)
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
        
    reply_type, reply = api.recv( 10000 )
    
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
            
            
            
            
             '''
             repeated UserData   users  = 2;
             repeated GroupData  groups = 3;
             repeated JobData    jobs   = 4;
             repeated AppData    apps   = 5;
             repeated FileData   files  = 6;
             repeated TagData    tags   = 7;
             repeated DOIData    dois   = 8;    
             '''
                     
             
    
    #print 'tempres: ' + tempres + '\n'
    
    
    #I have to take tempres and insert commas
    
    #print 'numRecords: ' + str(numRecords)
    tempres = tempres.replace('}','},',(numRecords-1))
    #print '\n\ntempres:\n' + tempres + '\n\n'
    
    
    
    return tempres



        
        
        
    #for property in linked_properties:
    #    print str(property)
    '''
    tempres +=   '{' + '\n'
    tempres +=     '"title" : "span stuff here", ' + '\n'
    tempres +=     '"isFolder" : "false" ' + '\n'
    tempres +=   '}' + '\n'
    '''

    '''
    message CompoundDataMsg
{
    required Header     header = 1;
    repeated UserData   users  = 2;
    repeated GroupData  groups = 3;
    repeated JobData    jobs   = 4;
    repeated AppData    apps   = 5;
    repeated FileData   files  = 6;
    repeated TagData    tags   = 7;
    repeated DOIData    dois   = 8;
}
    for linked_obj in linked_objs:
        
        msg = MsgSchema_pb2.Cmd_GetByOID()
        msg.header.token = 3333
        #msg.oids.CopyFrom(linked_objs)
        msg.oids = linked_objs
        
        #submit to the 
        api.send( msg )
        
        reply_type, reply = api.recv( 10000 )
        
        if reply_type > 0:
          #print 'there is a reply for file command list'
          classname = api.getMessageTypeName( reply_type )
          print 'dget linked children classname: ' + str(classname)
     
          print '\n\n\n\n\nend linked: '
    '''
    '''
        message Cmd_GetByOID
{
    required Header     header      = 1;
    repeated uint64     oids        = 2;
}
    '''
        
    '''
        #issue a message for users
        
        
        #issue a message for groups
        
        #issue a message for apps
        
        #issue a message for jobs
        
        #issue a message for files
        
        
        api = Connection.cdsapi(tcp_connection)
        
        file_oid = int(linked_obj)
    
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
            
            print 'message type: ' + classname
            print 'returned header token: ' + str(reply.header)
            
            if classname == 'FileDataMsg':
                for file in reply.files:
                    print '\tfile oid: ' + str(file.oid)
                    print '\t\tfile name: ' + str(file.name)
                    file_names.append(file.name)
                    file_oids.append(file.oid)
            
        else:
            print 'there is no reply for file command list'
        
        
        #res = getFileListStrFromOID(header_token,file_oid,user_oid,path)
    '''
        