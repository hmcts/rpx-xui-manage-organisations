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
;
    let sourceReport = __dirname + '/Report.html';
    let destDir = process.env.PWD + "/" + conf.reportPath;
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    } 
    let destReport = destDir+"Report.html"


        fs.copyFileSync(sourceReport, destReport);

        // if (err) throw err;
    // console.log('source.txt was copied to destination.txt' + destReport);


    let htmlData = fs.readFileSync(destReport, 'utf8');

    var result = htmlData.replace(/replacejsoncontent/g, JSON.stringify(reportJson));

    fs.writeFileSync(destReport, result);
    // console.log(JSON.stringify(reportJson)); 

}

function getTestDetails(test){
    return {
        name: test.title,
        status: test.state,
        error: test.err.message,
        a11yResult: test.ctx.a11yResult
    };

}