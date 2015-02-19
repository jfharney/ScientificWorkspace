def createDynatreeJSONUserObjStr(groupMemberObj):
    
    child = {}
    child['title'] = groupMemberObj['uname']
    child['isFolder'] = 'false'
    child['type'] = '0'
    child['isLazy'] = 'false'
    child['tooltip'] = 'tooltip'
    child['uid'] = groupMemberObj['uid']
    child['nid'] = groupMemberObj['nid']
    
    res = '{' 
    res += '"title" : "' + str(groupMemberObj['uname']) + '", '
    res += '"isFolder" : ' + 'false, '
    res += '"type" : ' + '0, '
    res += '"isLazy" : ' + 'false, '
    res += '"tooltip" : ' + '"tooltip", '
    res += '"uid" : "' + str(groupMemberObj['uid']) + '", '
    res += '"nid" : "' + str(groupMemberObj['nid']) + '"'
    res += '}'
    
    return res


