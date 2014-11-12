console.log('Loading proxyConfig.js...');

exports.firewallMode = false;
exports.serviceHost = 'techint-b117.ornl.gov';
exports.servicePort = '8080';

exports.proxyHost = 'localhost';
exports.proxyPort = 1337;
exports.feed_on = 'false';
exports.doiOfflineMode = 'false';



/* Debug flags for the proxy layer */
exports.userDebug = false;
exports.groupDebug = false;
exports.appDebug = false;
exports.jobDebug = false;
exports.tagDebug = false;
exports.fileDebug = false;
exports.doiDebug = false;