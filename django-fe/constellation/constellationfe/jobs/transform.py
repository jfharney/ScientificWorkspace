def convertJobMsgToJSONString(job_names,job_jids,job_oids):
    counter = 0
    res = '['
  
    for i in range(0,(len(job_oids)-1)):
      counter = counter + 1
 
    
      tempres = '{' 
      tempres += '"title" : "' + str(job_names[i]) + '", '
      tempres += '"isFolder" : ' + 'true, '
      tempres += '"isLazy" : ' + 'true, '
      tempres += '"type" : ' + '2, '
      tempres += '"jobid" : "' + str(job_jids[i]) + '", '
      tempres += '"tooltip" : ' + '"tooltip", '
      tempres += '"nid" : "' + str(job_oids[i]) + '"'
      tempres += '}'
    
    
      if counter == len(job_oids)-1:
          res += tempres
      else:
          res += tempres + ' , '
  
    res += ']'  
    
    return res 