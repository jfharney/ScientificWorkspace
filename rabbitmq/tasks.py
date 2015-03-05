from celery import Celery

app = Celery('tasks',backend='amqp',broker='amqp://guest@localhost//')

import time

@app.task
def add(x, y):

  print 'starting task\n'

  time.sleep(4)

  print 'finished with task\n'  
  return x+y
