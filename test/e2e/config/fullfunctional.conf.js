const chai            = require('chai');
const chaiAsPromised  = require('chai-as-promised');
const minimist        = require('minimist');
var screenShotUtils = require("protractor-screenshot-utils").ProtractorScreenShotUtils;
var { localConfig, jenkinsConfig, cucumberOpts} = require('./common.conf');
chai.use(chaiAsPromised);

const argv = minimist(process.argv.slice(2));

const cap = (argv.local) ? localConfig : jenkinsConfig;

const config = {
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  specs: ['../features/**/*.feature'],
  baseUrl: process.env.TEST_URL || 'https://xui-mo-webapp-aat.service.core-compute-aat.internal/',
  params: {
    serverUrls: process.env.TEST_URL || 'https://xui-mo-webapp-aat.service.core-compute-aat.internal/',
    targetEnv: argv.env || 'local',
    username: process.env.TEST_EMAIL || 'autotest_superuser@mailinator.com' ,
    password: process.env.TEST_PASSWORD || 'Monday01',
    // username: 'peterxuisuperuser@mailnesia.com',
    // password: 'Monday01'
  },
  directConnect: true,
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  getPageTimeout: 120000,
  allScriptsTimeout: 500000,
  multiCapabilities: cap,

  onPrepare() {
    browser.waitForAngularEnabled(false);
    global.expect = chai.expect;
    global.assert = chai.assert;
    global.should = chai.should;
    global.screenShotUtils = new screenShotUtils({
      browserInstance: browser
    });
  },

  cucumberOpts: {
    strict: true,
    // format: ['node_modules/cucumber-pretty'],
    format: ['node_modules/cucumber-pretty', 'json:reports/tests/functional/results.json'],
    tags: ['@all or @smoke or @fullFunctional or @end2end'],
    // tags: ['@test'],
    require: cucumberOpts

  },

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'XUI Manage Organisation Functional Tests',
        // openReportInBrowser: true,
        jsonDir: 'reports/tests/functional',
        reportPath: 'reports/tests/functional'
      }
    }
  ]


};


exports.config = config;
