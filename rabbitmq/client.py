from tasks import add
result = add.delay(4,4)

#print 'dir: ' + str((result.result))
print result.get()

