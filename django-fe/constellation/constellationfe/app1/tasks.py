from __future__ import absolute_import

from celery import shared_task

import time

@shared_task
def add(x, y, str):
    
    print str + 'starting task'
    time.sleep(4)
    print str + 'ending task'
    
    import zmq
    
    context = zmq.Context()

    print("Connecting to hello world server")
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://localhost:5555")

    for request in range(3):
        print(str + " Sending request %s ..." % request)
        
        socket.send(b"Hello333")
        message = socket.recv()
        print(str + " Received reply %s [ %s ]" % (request, message))
    
    
    return x + y

@shared_task
def sendMessage(str):
    
    
    return str
    

@shared_task
def mul(x, y):
    print 'starting task'
    time.sleep(4)
    print 'ending task'
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)