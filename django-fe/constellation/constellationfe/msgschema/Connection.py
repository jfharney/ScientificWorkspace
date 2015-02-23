import google.protobuf.reflection
import MsgSchema_pb2
import zmq
import struct

# This is a PROTOTYPE Python class for sending and receiving messages to/from the
# Constellation Data Service (CDS). It works, but has almost no error checking. If
# a ZeroMQ error occurs at certain points, this code may get 'out of synch' with
# the CDS (i.e. message parts may be misaligned)

# Below the class definition is example code that sends user and group get messages
# and prints the replies.

# If this class is used to pipe multiple concurrent requests to the CDS, the 'token'
# field in the message header should be used to reassociate replies with the
# originating send. Simply keeping a global token value that is incremented for each
# send will work, plus using a dictionary to associate each token with a request
# entity (perhaps a callback function)

class cdsapi:
    # Initialize CDS API instance
    def __init__(self, a_address ):
        print 'initializing cdsapi'
        print 'a_address: ' + a_address + ' len: ' + str(len(a_address))
        # Must build a message type (integer) to descriptor table for
        # automatic message creation/parsing on receive

        # Message descriptors are stored by name - must convert to an array in definition order
        msgs_by_start = {}
        for name, desc in MsgSchema_pb2.DESCRIPTOR.message_types_by_name.items():
            msgs_by_start[desc._serialized_start] = desc

        # build descriptors by type look-up
        self._msg_desc_by_type = []
        for i,desc in sorted(msgs_by_start.items()):
            self._msg_desc_by_type.append(desc);

        # build types by descriptor look-up
        self._msg_type_by_desc = {}
        i = 0
        for desc in self._msg_desc_by_type:
            self._msg_type_by_desc[desc] = i;
            i += 1

        # init zeromq
        self._context = zmq.Context()
        self._socket = self._context.socket( zmq.DEALER )
        self._socket.setsockopt(zmq.LINGER, 100)
        self._socket.connect( a_address )
        
        

    # Delete/cleanup a CDS API instance
    def __del__(self):
        self._context.destroy()

    # Receive a protobuf message with timeout (may throw zeromq/protobuf exceptions)
    def recv( self, a_timeout ):
        # Wait for data to arrive
        ready = self._socket.poll( a_timeout )
        if ready > 0:
            # receive zermq frame header and unpack
            frame_data = self._socket.recv( zmq.NOBLOCK )
            frame_values = struct.unpack( '<LL', frame_data )

            # receive message paylod into buffer
            data = self._socket.recv( zmq.NOBLOCK )

            # find message descriptor based on type (descriptor index)
            desc = self._msg_desc_by_type[frame_values[0]]

            # make new instance of message subclass and parse from buffer
            return frame_values[0], google.protobuf.reflection.ParseMessage( desc, data )
        else:
            return 0, None

    # Sends a protobuf message (may throw zeromq/protobuf exceptions)
    def send( self, a_message ):
        # Find msg type by descriptor look-up
        print 'a_message.DESCRIPTOR: ' + str(a_message.DESCRIPTOR)
        msg_type = self._msg_type_by_desc[a_message.DESCRIPTOR]
        # Serialize
        data = a_message.SerializeToString()
        # Build the message frame, to match C-struct MessageFrame
        frame = struct.pack( '<LL', msg_type, len( data ))
        # Send frame, then body
        self._socket.send( frame, zmq.NOBLOCK | zmq.SNDMORE )
        self._socket.send( data, zmq.NOBLOCK )

    # Gets the short name of a message class based on message type
    def getMessageTypeName( self, a_msg_type ):
        if a_msg_type > 0 and a_msg_type < self._msg_desc_by_type:
            return self._msg_desc_by_type[a_msg_type].name
        raise IndexError()


# Utiliy functions (for example only, uses global 'api' variable defined below)
def printMessage( a_msg_type, a_msg ):
    classname = api.getMessageTypeName( a_msg_type )
    print 'message type: ', classname
    if not a_msg.HasField('header'):
        print 'Not a valid message instance'
        return

    if a_msg.header.HasField('token'):
        print 'header.token: ', a_msg.header.token
    if a_msg.header.HasField('error_code'):
        print 'header.error_code: ', a_msg.header.error_code
    if a_msg.header.HasField('error_msg'):
        print 'header.error_msg: ', a_msg.header.error_code

    if classname == 'UserDataMsg':
        for user in a_msg.users:
            print '  oid  : ', user.oid
            print '  uid  : ', user.uid
            print '  uname: ', user.uname
            print '  name : ', user.name
            print '  email: ', user.email, '\n'
    elif classname == 'GroupDataMsg':
        for group in a_msg.groups:
            print '  oid  : ', group.oid
            print '  gid  : ', group.gid
            print '  gname: ', group.gname
    else:
        print 'No print code for this message type yet'



# Usage Notes:
'''
# Create a CDSAPI instance with server address
api = cdsapi('tcp://localhost:5555')
print 'called api'
# ------- EXAMPLE - get a user by uname ---------------------

# Build request message
msg = MsgSchema_pb2.UserCmd_GetByUNAME()
msg.header.token = 1
msg.uname = 'd3s'

# Send request (asynchronous, will fail if required fields are missing)
api.send( msg )

#Get a reply (wait up to 10 seconds)
reply_type, reply = api.recv( 10000 )

#See if we got a reply (return value > 0)
if reply_type > 0:
    printMessage( reply_type, reply )
else:
    print 'timeout'

# ------- EXAMPLE - get a group --------------------------------

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
    printMessage( reply_type, reply )
else:
    print 'timeout'
'''
