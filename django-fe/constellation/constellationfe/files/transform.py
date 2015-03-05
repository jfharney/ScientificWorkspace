def createDynatreeJSONObjStr(file,path):
    
    res = '{' 
      
    dynatreeJSONObj = {}
              
    if path == '|':
                  
        res += '"title" : ' + '"|' + file['name'] + '",'     
        if file['type'] == 5:
            res += '"isFolder" : ' + 'true,'
            res += '"isLazy" : ' + 'true,'
        else:
            res += '"isFolder" : ' + 'false,'
            res += '"isLazy" : ' + 'false",'
        
        res += '"path" : "|' + file['name'] + '",'
        res += '"nid" : "' + str(file['nid']) + '"'
        dynatreeJSONObj['path'] = '|' + file['name']
        dynatreeJSONObj['nid'] = file['nid']
              
    else:
                  
        dynatreeJSONObj['title'] = path + '|' + file['name']
        res += '"title" : ' + '"' + path + '|' + file['name'] + '",'     
        
        if file['type'] == 5:
            
            res += '"isFolder" : ' + 'true,'
            res += '"isLazy" : ' + 'true,'          
            dynatreeJSONObj['isFolder'] = 'true'
            dynatreeJSONObj['isLazy'] = 'true'
                         
        else: 
            res += '"isFolder" : ' + 'false,'
            res += '"isLazy" : ' + 'false,'
            dynatreeJSONObj['isFolder'] = 'false'
            dynatreeJSONObj['isLazy'] = 'false'
            
        res += '"path" : "' + path + '|' + file['name'] + '",'
        res += '"nid" : "' + str(file['nid']) + '"'    
        dynatreeJSONObj['path'] = path + '|' + file['name'];
        dynatreeJSONObj['nid'] = file['nid'];  
      
    
    res += '}'
    return res 