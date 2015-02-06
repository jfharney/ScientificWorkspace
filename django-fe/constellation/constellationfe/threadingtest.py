import time
import sys, traceback    

import threading, random


from common import utils

def Splitter(words,index,randNum):
    mylist = words.split()
    newList = []
    while(mylist):
        newList.append(mylist.pop(
                                  random.randrange(0,len(mylist))))
    if index % 2 == 0:
        time.sleep(2)
    print (' '.join(newList) + ' index: ' + str(index)) # + ' ' + str(randNum))
    






import json
import urllib
import urllib2


def getUserURL(user_id,randNum,usersMap):
    print 'getUser input...header: ' + str(randNum) + ' user_id: ' + str(user_id) 
    
    
    url = 'http://localhost:8080/constellation/testWrapper/?randNum=' + str(randNum) + '&user_id=' + str(user_id)

    data = urllib2.urlopen(url).read()

'''
thread 1: 
    getUser(uname, token=1)
    getUser(uname, token=2)
thread 2:
    getUser(uname2, token=1000)
    getUser(umame2, token=1001)
    
'''
def getUser(user_id,randNum,usersMap):
    print 'getUser input...header: ' + str(randNum) + ' user_id: ' + str(user_id) 
    #user_oid = utils.getOidFromUserId(user_id)
    #user_oid = utils.getOidFromUserIdRandHeader(user_id,randNum)
    utils.getOidFromUserIdRandHeader(user_id,randNum,usersMap)
    #print 'getUser output...header: ' + str(randNum) + ' user_id: ' + str(user_id) +' user_oid: ' + str(user_oid)


def djangoTest():
    usernames = ['dmartin','fannie','csafta','w44','jshollen' \
                 #'csafta','w44','jshollen','milena', \
                 #'jiangzhu','bates','lixu011','hannay','mickelso','efischer', \
                 #'cfischer','bakercg','divanova','jiaxu','kruss','vivi7799' \
                 ]
    #usernames = ['dmartin','fannie']
    
    usernamesMap = {'dmartin' : 0, 'fannie' : 1, 'csafta' : 2, 'w44' : 3, 'jshollen' : 4} 
    useroidsMap = {'1328192' : 0, '716864' : 1,'1521984' : 2, '1770304' : 3, '1564992' : 4} 
    
    numOfThreads = len(usernames)
    threadList = []
    
    print ('STARTING...\n')
    for i in range(numOfThreads):
        import random
        randNum = random.randint(1, 99999999)
        user_id = usernames[i]
        #print 'in main...header: ' + str(randNum) + ' user_id: ' + user_id + '\n'
        print 'in main...header: ' + str(i*1000) + ' user_id: ' + user_id + '\n'
        #t = threading.Thread(target=Splitter, args=(sentence,i,randNum))
        #t = threading.Thread(target=getUser, args=(user_id,randNum,))
        
        t = threading.Thread(target=getUserURL, args=(user_id,i*1000,useroidsMap))
        
        import time
        #time.sleep(5)
        
        t.start()
        threadList.append(t)
    
    print ('\nThread Count: ' + str(threading.active_count()))
    print ('EXITING...\n')

def multithreadTest():
    usernames = ['dmartin','fannie','csafta','w44','jshollen' \
                 #'csafta','w44','jshollen','milena', \
                 #'jiangzhu','bates','lixu011','hannay','mickelso','efischer', \
                 #'cfischer','bakercg','divanova','jiaxu','kruss','vivi7799' \
                 ]
    #usernames = ['dmartin','fannie']
    
    usernamesMap = {'dmartin' : 0, 'fannie' : 1, 'csafta' : 2, 'w44' : 3, 'jshollen' : 4} 
    useroidsMap = {'1328192' : 0, '716864' : 1,'1521984' : 2, '1770304' : 3, '1564992' : 4} 
    
    numOfThreads = len(usernames)
    threadList = []
    
    print ('STARTING...\n')
    for i in range(numOfThreads):
        import random
        randNum = random.randint(1, 99999999)
        user_id = usernames[i]
        #print 'in main...header: ' + str(randNum) + ' user_id: ' + user_id + '\n'
        print 'in main...header: ' + str(i*1000) + ' user_id: ' + user_id + '\n'
        #t = threading.Thread(target=Splitter, args=(sentence,i,randNum))
        #t = threading.Thread(target=getUser, args=(user_id,randNum,))
        
        t = threading.Thread(target=getUser, args=(user_id,i*1000,useroidsMap))
        
        t.start()
        threadList.append(t)
    
    print ('\nThread Count: ' + str(threading.active_count()))
    print ('EXITING...\n')

if __name__ == "__main__":
    djangoTest()
    
    #multithreadTest()

    