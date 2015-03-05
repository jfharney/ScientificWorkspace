"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase


class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)
        



#---------------Test Wrapper-----------------

def testWrapper(request):
    
    print 'in test wrapper'
    usernames = ['dmartin','fannie','csafta','w44','jshollen' \
                 #'csafta','w44','jshollen','milena', \
                 #'jiangzhu','bates','lixu011','hannay','mickelso','efischer', \
                 #'cfischer','bakercg','divanova','jiaxu','kruss','vivi7799' \
                 ]
    #usernames = ['dmartin','fannie']
    
    usernamesMap = {'dmartin' : 0, 'fannie' : 1, 'csafta' : 2, 'w44' : 3, 'jshollen' : 4} 
    useroidsMap = {'1328192' : 0, '716864' : 1,'1521984' : 2, '1770304' : 3, '1564992' : 4} 
    
    usersMap = useroidsMap
    
    randNum = request.GET.get('randNum')
    randNum = int(randNum)
    user_id = request.GET.get('user_id')
    #user_id = int(user_id)
    
    if user_id is None:
        return HttpResponse('user_id problem')
    if randNum is None:
        return HttpResponse('randNum problem')
    
    print 'getUser input...header: ' + str(randNum) + ' user_id: ' + str(user_id) 
    #user_oid = utils.getOidFromUserId(user_id)
    #user_oid = utils.getOidFromUserIdRandHeader(user_id,randNum)
    utils.getOidFromUserIdRandHeader(user_id,randNum,usersMap)
    
    return HttpResponse('hello')

