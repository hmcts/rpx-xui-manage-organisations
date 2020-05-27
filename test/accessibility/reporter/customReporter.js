var mocha = require('mocha');
const fs = require('fs');

const {conf} = require('../config/config');

module.exports = report;

function report(runner) {
    mocha.reporters.Base.call(this, runner);
    let tests = [];
    let passCounter = 0;
    let failCounter = 0;
    runner.on('pass', function (test) {
        console.log('[pass]%s', test.title);
        tests.push(getTestDetails(test))
        passCounter++;

    });

    runner.on('fail', function (test, err) {
        console.log('[fail]%s(%s)', test.title, err.message);
        // console.log(test);
        tests.push(getTestDetails(test))
        failCounter++;

    });

    runner.on('end', function () {
        // console.log(tests);
        generateReport(passCounter,failCounter,tests);
        process.exit(0);
    });
}

function generateReport(passCount,failCount, tests){
    let reportJson = {
        appName: conf.appName,
        passed: passCount,
        failed: failCount,
        tests:tests
    };

    let sourceReport = __dirname + '/Report.html';
    let destDir = process.env.PWD + "/" + conf.reportPath;
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    } 
    let destReport = destDir+"Report_output.html"
    let destJson = destDir + "report_output.js"

    fs.copyFileSync(sourceReport, destReport);

    let htmlData = fs.readFileSync(sourceReport, 'utf8');
    var result = 'var replacejsoncontent = ' +JSON.stringify(reportJson);
    fs.writeFileSync(destJson, result);
    copyResources();


}

function getTestDetails(test){
    return {
        name: test.title,
        status: test.state,
        error: test.err.message,
        a11yResult: test.ctx.a11yResult
    };

}


function copyResources(){
    let destDir = process.env.PWD + "/" + conf.reportPath+'resources/';
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    }  

    fs.copyFileSync(__dirname + '/resources/angular.min.js', destDir+'angular.min.js'); 
    fs.copyFileSync(__dirname + '/resources/fontawesome.min.js', destDir + 'fontawesome.min.js'); 

}