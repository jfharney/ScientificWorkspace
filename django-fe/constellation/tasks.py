from celery import Celery

app = Celery('tasks', backend='amqp', broker='amqp://guest@localhost//')

@app.task
def add(x,y):
    print 'adding ' + x + ' and ' + y
    return x+y