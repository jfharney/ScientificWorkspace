serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

brokerHost = 'localhost'
brokerPort = '5555'

jobFlag = False
appFlag = False
userFlag = True
groupFlag = True
tagFlag = True
fileFlag = False

userFlag = False


import sys
sys.path.append('/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation/constellationfe')

from msgschema import MsgSchema_pb2, Connection
    

def printReplyErrorInfo(reply):  
    
        
    if not reply.HasField('header'):
        print 'Not a valid message instance'
        return

    if reply.header.HasField('token'):
        print 'header.token: ', reply.header.token
    if reply.header.HasField('error_code'):
        print 'header.error_code: ', reply.header.error_code
    if reply.header.HasField('error_msg'):
        print 'header.error_msg: ', reply.header.error_code
      
      
#'8xo' -> number
def getOidFromUserId(user_id):
    
    #print 'in getOidFromUserId'
    
    api = Connection.cdsapi('tcp://techint-b117:5555')
    
    msg = MsgSchema_pb2.UserCmd_GetByUNAME()
    msg.header.token = 1
    msg.uname = user_id    
    
    api.send( msg )
    
    reply_type, reply = api.recv( 10000 )
    
    user_oid = ''  
  
    if reply_type > 0:
        #print 'there is a reply'
    
        classname = api.getMessageTypeName( reply_type )
        
        #print 'message type: ', classname
        if userFlag:
            printReplyErrorInfo(reply)
        
        if classname == 'UserDataMsg':
            #print '\n\n\nUser message\n\n\n'
            for user in reply.users:
                user_oid = user.oid
                #print 'user_oid: ' + str(user_oid)
        else:
            print 'No print code for this message type yet'
    else:
        print 'there is no reply for the user id'
    
    
    #print 'end in getOidFromUserId'
    
    return user_oid



#'techint' -> number
#called when a group is selected
def getOidFromGroupId(group_id):
    group_oid = ''

    
    from msgschema import MsgSchema_pb2
  
    #from Connection import cdsapi
    #from Connection import printMessage
     
    api = Connection.cdsapi('tcp://techint-b117:5555')
    
    #print 'group id before sebnding ' + group_id
    
    msg = MsgSchema_pb2.GroupCmd_GetByGNAME()
    msg.header.token = 1
    msg.gname = group_id
    
    api.send( msg )
    
    reply_type, reply = api.recv( 10000 )
    
    if reply_type > 0:
        classname = api.getMessageTypeName( reply_type )
        
        print 'message type: ', classname
        
        printReplyErrorInfo(reply)
        
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

#'8xo' -> number
def getOidFromJobId(job_id):
    
     
    api = Connection.cdsapi('tcp://techint-b117:5555')
    
    msg = MsgSchema_pb2.UserCmd_GetByUNAME()
    msg.header.token = 1
    msg.uname = user_id    
    
    api.send( msg )
    
    reply_type, reply = api.recv( 10000 )
    
    user_oid = ''  
  
    if reply_type > 0:
        #print 'there is a reply'
    
        classname = api.getMessageTypeName( reply_type )
        
        print 'message type: ', classname
    
        printReplyErrorInfo(reply)
        
        print 'am i here?'
        if classname == 'UserDataMsg':
            for user in reply.users:
                user_oid = user.oid
        else:
            print 'No print code for this message type yet'
    else:
        print 'there is no reply'
    
    
    
    return user_oid

#'8xo' -> number
def getFileSysList():
    
    api = Connection.cdsapi('tcp://techint-b117:5555')
    
    msg = MsgSchema_pb2.FileSystemCmd_List()
    msg.header.token = 222
    
    api.send( msg )
    
    reply_type, reply = api.recv( 10000 )
    
    filesys_oids = []
    filesys_names = []
    
    if reply_type > 0:
        
        classname = api.getMessageTypeName( reply_type )
        
        if fileFlag:
            print 'message type: ' + classname + '\n\n'
    
        if classname == 'FileSystemDataMsg':
            
            for key in reply.filesys:
                filesys_oids.append(key.oid)
                filesys_oids.append(key.name)
                if fileFlag:
                    print 'oid: \n' + str(key.oid) 
                    print 'name: \n' + str(key.name) 
        
    else:    
        print '\nthere is no reply for file system list\n'
        
    
    return filesys_oids


def replace_all(text, dic):
    for i, j in dic.iteritems():
        text = text.replace(i, j)
    return text