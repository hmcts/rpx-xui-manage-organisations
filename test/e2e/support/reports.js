const reporter = require('allure-js-commons');
const fs = require('fs');
const mkdirp = require('mkdirp');

const xmlReports = `${process.cwd()}/reports/xml`;

// var createXmlDir = (function() {
//     if (!fs.existsSync(xmlReports)) {
//         mkdirp.sync(xmlReports);
//     }
// })();

reporter.options = { targetDir: xmlReports };

module.exports = reporter;
