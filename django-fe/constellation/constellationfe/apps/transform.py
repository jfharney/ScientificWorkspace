def convertJobMsgToJSONString(app_names,app_oids,job_id):
    
    counter = 0
    res = '['
    
    print 'len app_oids: ' + str(len(app_oids))
    for i in range(0,(len(app_oids))):
      counter = counter + 1
 
      tempres = '{' 
      tempres += '"title" : "' + 'appid: ' + str(app_names[i]) + '", '
      tempres += '"name" : "' + 'appid ' + str(app_names[i]) + '", '
      tempres += '"type" : ' + '2, '
      tempres += '"appid" : "' + str(app_names[i]) + '", '
      tempres += '"job_id" : "' + job_id + '", '
      tempres += '"nid" : "' + str(app_oids[i]) + '"'
      tempres += '}'
    
      print 'tempres: ' + tempres
    
      if counter == len(app_oids):
          res += tempres
      else:
          res += tempres + ' , '
  
    res += ']'  
    
    return res
