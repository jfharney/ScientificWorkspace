
//jobs object
var jobsObjArr = [];
		  
var jobsObj1 = {};
jobsObj1['nid'] = 88388;
jobsObj1['nodes'] = 1;
jobsObj1['jid'] = 1722972;
jobsObj1['err'] = 0;
jobsObj1['stop'] = 1378024278;
jobsObj1['host'] = 'titan';
jobsObj1['start'] = 1378024199;
jobsObj1['name'] = 'swtc1';
jobsObj1['type'] = 2;
jobsObj1['wall'] = 0;
jobsObj1['user'] = 9238;
jobsObjArr.push(jobsObj1);

var jobsObj2 = {};
jobsObj2['nid'] = 88516;
jobsObj2['nodes'] = 1;
jobsObj2['jid'] = 1722981;
jobsObj2['err'] = 0;
jobsObj2['stop'] = 1378027579;
jobsObj2['host'] = 'titan';
jobsObj2['start'] = 1378027539;
jobsObj2['name'] = 'swtc1-dg';
jobsObj2['type'] = 2;
jobsObj2['wall'] = 0;
jobsObj2['user'] = 9238;
jobsObjArr.push(jobsObj2);

exports.jobsObjArr = jobsObjArr;


//apps object
var appsObjArr = [];

var appObj1 = {};
appObj1['nid'] = 93636;
appObj1['nodes'] = 1;
appObj1['err'] = 0;
appObj1['stop'] = 1378024273;
appObj1['host'] = 'titan';
appObj1['start'] = 1378024204;
appObj1['cmd'] = '/usr/bin/aprun -n 16 /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/test_execs/swtcA/swtcA';
appObj1['type'] = 3;
appObj1['aid'] = 3498899;
appObj1['job'] = 1722972;
appsObjArr.push(appObj1);

var appObj2 = {};
appObj2['nid'] = 93656;
appObj2['nodes'] = 1;
appObj2['err'] = 0;
appObj2['stop'] = 1378024274;
appObj2['host'] = 'titan';
appObj2['start'] = 1378024274;
appObj2['cmd'] = '/usr/bin/aprun -n 1 /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/utils/cprnc/bin/cprnc /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/tests/swtc1/movies/swtc11.nc /lustre/widow/scratch/jamroz/h';
appObj2['type'] = 3;
appObj2['aid'] = 3498904;
appObj2['job'] = 1722972;
appsObjArr.push(appObj2);

exports.appsObjArr = appsObjArr;

//files object
var jsonFileResponse = {};

jsonFileResponse['nid'] = 200004;
jsonFileResponse['xuid'] = 0;
jsonFileResponse['xgid'] = 2329;
jsonFileResponse['name'] = 'stf008';
jsonFileResponse['ctime'] = 1380646733;
jsonFileResponse['type'] = 5;
jsonFileResponse['mtime'] = 1380646733;
jsonFileResponse['files'] = [];

var file1 = {};
file1['nid'] = 200008;
file1['xuid'] = 0;
file1['xgid'] = 2329;
file1['name'] = 'proj-shared1';
file1['fmode'] = 504;
file1['ctime'] = 1386265998;
file1['mtime'] = 1386265998;

var file2 = {};
file2['nid'] = 200008;
file2['xuid'] = 0;
file2['xgid'] = 2329;
file2['name'] = 'proj-shared2';
file2['fmode'] = 504;
file2['ctime'] = 1386265998;
file2['mtime'] = 1386265998;

jsonFileResponse['files'].push(file1);
jsonFileResponse['files'].push(file2);

exports.jsonFileResponse = jsonFileResponse;



//groupinfo object

var groupinfoObjsArr = [];

var groupinfoObj1 = {};
groupinfoObj1['nid'] = 54608;
groupinfoObj1['gid'] = 2184;
groupinfoObj1['gname'] = 'cli017dev';
groupinfoObj1['type'] = 1;
groupinfoObjsArr.push(groupinfoObj1);

var groupinfoObj2 = {};
groupinfoObj2['nid'] = 53928;
groupinfoObj2['gid'] = 2058;
groupinfoObj2['gname'] = 'cli017';
groupinfoObj2['type'] = 1;
groupinfoObjsArr.push(groupinfoObj2);

var groupinfoObj3 = {};
groupinfoObj3['nid'] = 54896;
groupinfoObj3['gid'] = 18626;
groupinfoObj3['gname'] = 'jamroz';
groupinfoObj3['type'] = 1;
groupinfoObjsArr.push(groupinfoObj3);


exports.groupinfoObjsArr = groupinfoObjsArr;



//group object - NEEDS A BETTER NAME!!!!!!
var groupObjsArr = [];

var groupObj1 = {};
groupObj1['nid'] = 3472;
groupObj1['uid'] = 1913;
groupObj1['uname'] = 'efischer';
groupObj1['name'] = 'Erich Fischer';
groupObj1['type'] = 0;
groupObj1['email'] = "erich.fischer@env.ethz.ch";
groupObjsArr.push(groupObj1);

var groupObj2 = {};
groupObj2['nid'] = 20172;
groupObj2['uid'] = 6023;
groupObj2['uname'] = 'caldwep';
groupObj2['name'] = 'Peter M. Caldwell';
groupObj2['type'] = 0;
groupObj2['email'] = "caldwell19@llnl.gov";
groupObjsArr.push(groupObj2);

var groupObj3 = {};
groupObj3['nid'] = 33036;
groupObj3['uid'] = 58176;
groupObj3['uname'] = 'lipscomb';
groupObj3['name'] = 'William H. Lipscomb';
groupObj3['type'] = 0;
groupObj3['email'] = "Lipscomb@lanl.gov";
groupObjsArr.push(groupObj3);

var groupObj4 = {};
groupObj4['nid'] = 3148;
groupObj4['uid'] = 1834;
groupObj4['uname'] = 'mickelso';
groupObj4['name'] = 'Sheri Mickelson';
groupObj4['type'] = 0;
groupObj4['email'] = "mickelso@mcs.anl.gov";
groupObjsArr.push(groupObj4);

exports.groupObjsArr = groupObjsArr;







