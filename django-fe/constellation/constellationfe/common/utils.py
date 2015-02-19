serviceHost = 'techint-b117.ornl.gov';
servicePort = '8080';

brokerHost = 'localhost'
brokerPort = '5555'

jobFlag = False
appFlag = False
userFlag = True
groupFlag = True
tagFlag = False
fileFlag = True

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


def getOidFromUserIdRandHeader(user_id,randNum,usersMap):
    
    import time
    if randNum % 3 == 0:
        time.sleep(3)
    
    #print 'in getOidFromUserId'
    
    api = Connection.cdsapi('tcp://techint-b117:5555')
    
   
    
    numLoops = 998
    for i in range(numLoops):
        msg = MsgSchema_pb2.UserCmd_GetByUNAME()
        msg.header.token = randNum + i
        msg.uname = user_id    
        #print 'before message sent...' + 'header: ' + str(msg.header.token) + ' user_id: ' + user_id + '\n'
    
        api.send( msg )
        
        reply_type, reply = api.recv( 10000 )
        
        user_oid = ''  
      
        if reply_type > 0:
            #print 'there is a reply'
        
            classname = api.getMessageTypeName( reply_type )
            
            #print 'message type: ', classname
            if userFlag:
                printReplyErrorInfo(reply)
            
            #if randNum % 2 == 0:
            #    time.sleep(2)
    
            
            if classname == 'UserDataMsg':
                #print '\n\n\nUser message\n\n\n'
                for user in reply.users:
                    user_oid = user.oid
                    #print 'user_oid: ' + str(user_oid)
            else:
                print 'No print code for this message type yet'
        else:
            print 'there is no reply for the user id'
    
        test = (usersMap[str(int(user_oid))] == int(reply.header.token)/1000)
        
        if not test:
            print 'after message sent...' + 'header: ' + str(reply.header.token) + ' user_id: ' + user_id + ' user_oid: ' + str(user_oid) + ' usersMap: ' + str(usersMap[str(int(user_oid))]) + ' isvalid: ' +  str(test) + '\n'
    
        
    
    #return user_oid

      
      
#'8xo' -> number
def getOidFromUserId(user_id):
    
    #print 'in getOidFromUserId getting user_id: ' + user_id
    
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
            #print '\nUser message\n'
            for user in reply.users:
                user_oid = user.oid
                
        else:
            print 'No print code for this message type yet'
    else:
        print 'there is no reply for the user id'
    
    
    #print 'end in getOidFromUserId'
    print '\n\n\n\n\n\nuser_oid: ' + str(user_oid) + '\n\n\n\n\n'
    
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




    
    
    
    
    '''
    #define a function for the thread
    def print_time( threadName, delay):
        count = 0
        while count < 5:
            time.sleep(delay)
            count += 1
            print '%s: %s' % ( threadName, time.ctime(time.time() ))
        
    
    
    
    try:
        thread.start_new_thread(print_time, ('Thread-1', 2, ))
        thread.start_new_thread(print_time, ('Thread-2', 4, ))
    except Exception, err:
        print 'print_exc():'
        traceback.print_exc(file=sys.stdout)
        print
        print 'print_exc(1):'
        traceback.print_exc(limit=1, file=sys.stdout)
        print 'Error: unable to start thread'
        
    
    while 1:
        pass
    
    '''
    
    
    
    
    
    
    
    
    
    
    