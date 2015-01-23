import pika
import logging
logging.basicConfig()

import sys


connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))
channel = connection.channel()
channel.queue_declare(queue='task_queue',durable=True)
'''
for index in xrange(10):
    channel.basic_publish(exchange='', routing_key='hello', 
                          body='Hello World #%s!' % index)
    print('Total Messages Sent: ')#%s' % x)
'''

message = ' '.join(sys.argv[1:]) or 'Hello World!'

channel.basic_publish(exchange='',
                      routing_key='task_queue',
                      body=message,
                      properties=pika.BasicProperties(
                         delivery_mode = 2,
                      ))

print " [x] Sent %r" % (message,)


connection.close()
	



