console.log('loading sample search results array');


var search_results_obj_arr = [];

var search_results_obj_0 = {};
search_results_obj_0['nid'] = 6576;
search_results_obj_0['uid'] = 2670;
search_results_obj_0['uname'] = 'djohn1';
search_results_obj_0['name'] = 'Dwayne John';
search_results_obj_0['type'] = 0;
search_results_obj_0['email'] = 'djohn@utk.edu';

search_results_obj_arr.push(search_results_obj_0);

var search_results_obj_1 = {};
search_results_obj_1['nid'] = 6876;
search_results_obj_1['uid'] = 2743;
search_results_obj_1['uname'] = 'jxp';
search_results_obj_1['name'] = 'John Banks';
search_results_obj_1['type'] = 0;
search_results_obj_1['email'] = 'jxp@ornl.gov';

search_results_obj_arr.push(search_results_obj_1);

var search_results_obj_2 = {};
search_results_obj_2['nid'] = 54608;
search_results_obj_2['gid'] = 2184;
search_results_obj_2['gname'] = 'cli017dev';
search_results_obj_2['type'] = 1;

search_results_obj_arr.push(search_results_obj_2);

var search_results_obj_3 = {};
search_results_obj_3['nid'] = 88388;
search_results_obj_3['user'] = 9328;
search_results_obj_3['nodes'] = 1;
search_results_obj_3['jid'] = 1722972;
search_results_obj_3['err'] = 0;
search_results_obj_3['stop'] = 1378024278;
search_results_obj_3['host'] = "titan";
search_results_obj_3['start'] = 1378024199;
search_results_obj_3['name'] = 'swtc1';
search_results_obj_3['type'] = 2;
search_results_obj_3['wall'] = 0;

search_results_obj_arr.push(search_results_obj_3);


var search_results_obj_4 = {};
search_results_obj_4['nid'] = 93936;
search_results_obj_4['job'] = 1722972;
search_results_obj_4['nodes'] = 1;
search_results_obj_4['err'] = 0;
search_results_obj_4['stop'] = 1378024273;
search_results_obj_4['host'] = 'titan';
search_results_obj_4['start'] = 1378024204;
search_results_obj_4['cmd'] = "/usr/bin/aprun -n 16 /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/test_execs/swtcA/swtcA";
search_results_obj_4['type'] = 3;
search_results_obj_4['aid'] = 3498899;

search_results_obj_arr.push(search_results_obj_4);


var search_results_obj_5 = {};
search_results_obj_5['path'] = "/stf008/world-shared/tmp";
search_results_obj_5['nid'] = 101324;
search_results_obj_5['xuid'] = 2912;
search_results_obj_5['xgid'] = 2329;
search_results_obj_5['name'] = "tmp";
search_results_obj_5['fmode'] = 436;
search_results_obj_5['ctime'] = 1396888768;
search_results_obj_5['type'] = 4;
search_results_obj_5['mtime'] = 1396888768;

search_results_obj_arr.push(search_results_obj_5);

var search_results_obj_6 = {};
search_results_obj_6['nid'] = 99296;
search_results_obj_6['path'] = "/stf008";
search_results_obj_6['xuid'] = 0;
search_results_obj_6['xgid'] = 2329;
search_results_obj_6['name'] = "stf008";
search_results_obj_6['fmode'] = 493;
search_results_obj_6['ctime'] = 1380646733;
search_results_obj_6['type'] = 5;
search_results_obj_6['mtime'] = 1380646733;

search_results_obj_arr.push(search_results_obj_6);

var search_results_obj_7 = {};
search_results_obj_7['nid'] = 5386652;
search_results_obj_7['access'] = 0;
search_results_obj_7['name'] = 'jamrozTag';
search_results_obj_7['type'] = 6;
search_results_obj_7['desc'] = "This is Jamroz Tag.";
search_results_obj_7['owner'] = 9328;

//search_results_obj_arr.push(search_results_obj_7);


var search_results_obj_8 = {};
search_results_obj_8['nid'] = 5386656;
search_results_obj_8['access'] = 0;
search_results_obj_8['name'] = "myNewTag6";
search_results_obj_8['type'] = 6;
search_results_obj_8['desc'] = "";
search_results_obj_8['owner'] = 5112;

search_results_obj_arr.push(search_results_obj_8);

var search_results_obj_9 = {};
search_results_obj_9['nid'] = 9999999;
search_results_obj_9['name'] = "Doi1";
search_results_obj_9['type'] = 7;
//search_results_obj_9['links'] = "54608,1722972,101324";
search_results_obj_9['owner'] = 9328;

search_results_obj_arr.push(search_results_obj_9);


exports.search_results_obj_arr = search_results_obj_arr;

/*  Duplication of this object
 * [
	   {"nid":6576,"uid":2670,"uname":"djohn1","name":"Dwayne John","type":0,"email":"djohn@utk.edu"},
	   {"nid":6876,"uid":2743,"uname":"jxp","name":"John Banks","type":0,"email":"jxp@ornl.gov"},
	   
	   {"nid":54608,"gid":2184,"gname":"cli017dev","type":1},
	   
	   {"user":9328,"nid":88388,"nodes":1,"jid":1722972,"err":0,"stop":1378024278,"host":"titan","start":1378024199,"name":"swtc1","type":2,"wall":0},
	   
	   {"job":1722972,"nid":93636,"nodes":1,"err":0,"stop":1378024273,"host":"titan","start":1378024204,"cmd":"/usr/bin/aprun -n 16 /lustre/widow3/scratch/jamroz/builds/testing/nightly/homme-trunk-nightly-gnu/test_execs/swtcA/swtcA","type":3,"aid":3498899},
	   
	   {"path":"/stf008/world-shared/tmp","nid":101324,"xuid":2912,"xgid":2329,"name":"tmp","fmode":436,"ctime":1396888768,"type":4,"mtime":1396888768},
	   
	   {"path":"/stf008","nid":99296,"xuid":0,"xgid":2329,"name":"stf008","fmode":493,"ctime":1380646733,"type":5,"mtime":1380646733}
	   
	   
	   {"nid":600120,"access":0,"name":"jamrozTagFive","type":6,"desc":"This is Tag Five.","owner":9328},
	   {"nid":604012,"access":0,"name":"markTagOne","type":6,"desc":"","owner":9328}
	   
	   {"nid":9999999,"name":"Doi1","type":7,"links":"54608,1722972,101324","owner":9328}
	   
	  ]
 */

