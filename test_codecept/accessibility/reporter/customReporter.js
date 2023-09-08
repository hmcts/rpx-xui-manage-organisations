const mocha = require('mocha');
const fs = require('fs');

const { conf } = require('../config/config');

module.exports = report;

function report(runner) {
  mocha.reporters.Base.call(this, runner);
  const tests = [];
  let passCounter = 0;
  let failCounter = 0;
  runner.on('pass', function (test) {
    if (test.ctx.a11yResult.issues && test.ctx.a11yResult.issues.length === 0){
      onPass(test);
    } else {
      test.state = 'failed';
      onFail(test, { 'message': 'Accesibility issues reported' });
    }
  });
  function onPass(test) {
    console.log('\n');
    console.log('\t[ PASS ] ' + test.title);
    console.log('\n');
    tests.push(getTestDetails(test));
    passCounter++;
  }

  runner.on('fail', function (test, err) {
    onFail(test, err);
  });
  function onFail(test, err) {
    console.log('\n');
    console.log('\t[ FAIL ] ' + test.title);
    console.log('\t\t' + err.message);
    console.log('\n');
    // console.log(test);
    tests.push(getTestDetails(test));
    failCounter++;
  }

  runner.on('end', function () {
    generateReport(passCounter, failCounter, tests);
  });
}

function generateReport(passCount, failCount, tests){
  const reportJson = {
    appName: conf.appName,
    passed: passCount,
    failed: failCount,
    tests: tests
  };
  consoleReport(reportJson);

  const sourceReport = __dirname + '/Report.html';
  const destDir = process.env.PWD + '/' + conf.reportPath;
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }
  const destReport = destDir+'Report.html';
  const destJson = destDir + 'report_output.js';

  fs.copyFileSync(sourceReport, destReport);

  const htmlData = fs.readFileSync(sourceReport, 'utf8');
  const result = 'var replacejsoncontent = ' +JSON.stringify(reportJson);
  fs.writeFileSync(destJson, result);
  copyResources();
}

function getTestDetails(test){
  return {
    name: test.title,
    status: test.state,
    error: test.err ? test.err.message : 'Accessibility issues reported',
    a11yResult: test.ctx.a11yResult
  };
}

function copyResources(){
  const resourceDir = process.env.PWD + '/' + conf.reportPath + 'resources/';
  const cssDir = resourceDir+ 'css/';
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }

  const webfontsDir = resourceDir+'webfonts/';
  if (!fs.existsSync(webfontsDir)) {
    fs.mkdirSync(webfontsDir, { recursive: true });
  }

  fs.copyFileSync(__dirname + '/resources/angular.min.js', resourceDir+'angular.min.js');
  fs.copyFileSync(__dirname + '/resources/css/all.css', cssDir + 'all.css');
  fs.copyFileSync(__dirname + '/resources/webfonts/fa-solid-900.woff2', webfontsDir + 'fa-solid-900.woff2');
}

function consoleReport(reportjson){
  console.log('\t Total tests : '+reportjson.tests.length);
  console.log('\t Failed tests : '+reportjson.failed);

  for (let testCounter = 0; testCounter < reportjson.tests.length; testCounter++){
    const test =reportjson.tests[testCounter];
    if (test.status === 'failed'){
      const a11yResult = test.a11yResult;
      console.log('\t \t Test Case : ' + test.name);

      console.log('\t \t Page title : '+a11yResult.documentTitle);
      console.log('\t \t Page url : '+a11yResult.pageUrl);
      console.log('\t \t \t Issues:');
      if (a11yResult.issues){
        for (let issueCounter = 0; issueCounter < a11yResult.issues.length; issueCounter++) {
          console.log('\t \t \t ' + (issueCounter + 1) + '. ' + a11yResult.issues[issueCounter].code);
          // console.log("\t \t \t \t"+a11yResult.issues[issueCounter].context);
          console.log('\t \t \t \t' + a11yResult.issues[issueCounter].selector);
          console.log('\t \t \t \t' + a11yResult.issues[issueCounter].message);
        }
      } else {
        console.log('\t \t \t \t Error executing test steps');
      }
    }
    console.log('\t');
  }
}
