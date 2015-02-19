
#---------------Miscellaneous information-----------------  
  

def groupEx(request):
    
    import MsgSchema_pb2
    
    from Connection import cdsapi
    from Connection import printMessage
    
    api = cdsapi('tcp://techint-b117:5555')
    
    print '\n'
    print dir(MsgSchema_pb2)
    print '\n'
    
    #Build a request message (get user by uname)
    msg = MsgSchema_pb2.GroupCmd_GetByGNAME()
    msg.header.token = 2
    msg.gname = 'd3s'

    #Send request (asynchronous, will fail if required fields are missing)
    api.send( msg )

    #Get a reply (wait up to 10 seconds)
    reply_type, reply = api.recv( 10000 )

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
                print '  gid  : ', group.gid
                print '  gname: ', group.gname
        elif classname == 'DOIDataMsg':
            for doi in reply.dois:
                print ' oid : ', doi.oid
        else:
            print 'No print code for this message type yet'


    else:
        print 'timeout'
        
    return HttpResponse('groupEx\n')
 
      
  
  
def jobEx(request):

    msg = MsgSchema_pb2.JobCmd_GetByUser()
    msg.header.token = 3
    msg.uname = '8xo'
    

    api.send( msg )
    
    
    reply_type, reply = api.recv( 10000 )
    
    
    if reply_type > 0:
        print 'there is a reply'
        
        
        
        classname = api.getMessageTypeName( reply_type )
        
        print 'message type: ', classname
        '''
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
                print '  gid  : ', group.gid
                print '  gname: ', group.gname
        else:
            print 'No print code for this message type yet'
        '''
        
    else:
        print 'timeout'
    
    
    return HttpResponse('jobEx\n')

    


def celeryEx(request):
    
    import addressbook_pb2
    import MsgSchema_pb2
    
    print 'initial test'
    
    from Connection import cdsapi
    from Connection import printMessage
    
    api = cdsapi('tcp://techint-b117:5555')
    
    msg = MsgSchema_pb2.UserCmd_GetByUNAME()
    msg.header.token = 1
    msg.uname = 'd3s'

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

        #printMessage( reply_type, reply )
    else:
        print 'timeout'
    
    print 'end initial test'
    
    
    user = MsgSchema_pb2.UserData()
    user.oid = 1
    user.uid = 5112
    user.uname = '8xo'
    user.name = "John F Harney"
    user.email = 'harneyjf@ornl.gov'

    
    address_book = addressbook_pb2.AddressBook()
    
    person = addressbook_pb2.Person()
    person.id = 1234
    person.name = "John Doe"
    person.email = "jdoe@example.com"
    phone = person.phone.add()
    phone.number = "555-4321"
    phone.type = addressbook_pb2.Person.HOME
    
    #address_book.person.add()
    
    #address_book.person.id = 1
    #address_book.person.name = "John Doe"
    #address_book.phone.number = "555-4321"
    
    '''
    name = request.GET.get('name')
    
    if name == None:
        name = 'me'
    
    if celeryFlag:
      tasks.add(1,2,name)
    else:
        print name + ' starting task'
        #time.sleep(4)
    
        import zmq
        
        context = zmq.Context()
    
        socket = context.socket(zmq.REQ)
        socket.connect("tcp://" + brokerHost + ':' + brokerPort)
    
        request = 1
        #for request in range(3):
        
        print(name + " Sending request %s ..." % request)
            
            
            #socket.send(b"Hello3")
        #socket.send(person.SerializeToString())
        socket.send(user.SerializeToString())
            #print dir(socket)
    
        message = socket.recv()
        
        
        print(name + " Received reply:\n %s [ %s ]" % (request, message))
    
        print '\n\n\n\nmessage: ' + str(message)
    
        print name + 'ending task'
    
    '''
    
    return HttpResponse("Hello\n")


 
 
 
 
 
