from __future__ import absolute_import

from celery import shared_task

import time

@shared_task
def add(x, y):
    
    print 'starting task'
    time.sleep(4)
    print 'ending task'
    return x + y


@shared_task
def mul(x, y):
    print 'starting task'
    time.sleep(4)
    print 'ending task'
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)