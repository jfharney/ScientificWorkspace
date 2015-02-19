def convertJobMsgToJSONString(app_names,app_oids,job_id):
    
    counter = 0
    res = '['
    
    for i in range(0,(len(app_oids)-1)):
      counter = counter + 1
 
      tempres = '{' 
      tempres += '"title" : "' + str(app_names[i]) + '", '
      tempres += '"type" : ' + '2, '
      tempres += '"appid" : "' + str(app_names[i]) + '", '
      tempres += '"job_id" : "' + job_id + '", '
      tempres += '"nid" : "' + str(app_oids[i]) + '"'
      tempres += '}'
    
    
      if counter == len(app_oids)-1:
          res += tempres
      else:
          res += tempres + ' , '
  
    res += ']'  
    
    return res
