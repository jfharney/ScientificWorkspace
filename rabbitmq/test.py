import pika
import logging
logging.basicConfig()

connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))
channel = connection.channel()
channel.queue_declare(queue='hello')
for index in xrange(10):
    channel.basic_publish(exchange='', routing_key='hello', 
                          body='Hello World #%s!' % index)
    print('Total Messages Sent: ')#%s' % x)
connection.close()
	
